// React & Vendor Libs
const { useState, useRef, useMemo, useEffect, forwardRef, useImperativeHandle } = wp.element;

// NekoUI
import {
  NekoBlock, NekoButton, NekoColumn, NekoSpacer,
  NekoSelect, NekoOption, NekoProgress, NekoTypo,
  NekoSpinner, NekoIcon, NekoUploadDropArea, NekoSlider, NekoToolbar, NekoMessage,
  NekoModal, NekoTextArea, NekoCheckbox
} from '@neko-ui';
import { useNekoColors, nekoFetch } from '@neko-ui';
import { useAsyncTaskProcessor, createTask } from '@app/helpers/asyncTaskProcessor';

// Components
import ChunkItem from './ChunkItem';
import { apiUrl, restNonce, pluginUrl } from '@app/settings';
import { smartTextChunkingAsync, chapterBasedChunking } from './chunkingUtils';

// Dynamic PDF.js loader
let pdfjsLib = null;
const loadPDFjs = async () => {
  if (!pdfjsLib) {
    pdfjsLib = await import(/* webpackChunkName: "premium-pdfjs" */ 'pdfjs-dist');
    pdfjsLib.GlobalWorkerOptions.workerSrc = `${pluginUrl}/premium/pdf.worker.min.js`;
  }
  return pdfjsLib;
};

const PDFImportView = forwardRef(({
  onAddEmbedding,
  environment,
  onClose,
  onError,
  onBusyChange
}, ref) => {
  const { colors } = useNekoColors();
  const fileInputRef = useRef(null);
  
  // PDF state
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfData, setPdfData] = useState(null);
  const [pdfRefId, setPdfRefId] = useState(null); // Unique reference ID for this PDF import
  const [chunks, setChunks] = useState([]);
  const [editableChunks, setEditableChunks] = useState([]);
  
  // UI state
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [parseProgress, setParseProgress] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [chunkingStage, setChunkingStage] = useState('');
  const [isGeneratingTitles, setIsGeneratingTitles] = useState(false);
  const [shouldStopGenerating, setShouldStopGenerating] = useState(false);
  const shouldStopGeneratingRef = useRef(false);
  const [busyChunks, setBusyChunks] = useState(new Set()); // Track which chunks are being processed
  const uploadProcessor = useAsyncTaskProcessor();
  
  // Title instructions state
  const [showTitleInstructionsModal, setShowTitleInstructionsModal] = useState(false);
  const [titleInstructions, setTitleInstructions] = useState(() => {
    // Load from localStorage on mount
    return localStorage.getItem('mwai_pdf_title_instructions') || '';
  });
  
  // Chunking settings (remembered across imports, useful for repetitive/automated workflows)
  const [chunkingDensity, setChunkingDensity] = useState(() => {
    return parseInt(localStorage.getItem('mwai_pdf_chunking_density')) || 3; // Medium by default
  });
  const [chunkingType, setChunkingType] = useState('tokens');
  const [chunkingOverlap, setChunkingOverlap] = useState(() => {
    const saved = parseInt(localStorage.getItem('mwai_pdf_chunking_overlap'));
    return isNaN(saved) ? 15 : saved; // 15% default (0 is a valid saved value)
  });
  const [useFilenameAsTitle, setUseFilenameAsTitle] = useState(() => {
    return localStorage.getItem('mwai_pdf_filename_as_title') === 'true';
  });

  // Persist chunking preferences (covers every setter site, including the density reset on cancel)
  useEffect(() => {
    localStorage.setItem('mwai_pdf_chunking_density', chunkingDensity);
    localStorage.setItem('mwai_pdf_chunking_overlap', chunkingOverlap);
    localStorage.setItem('mwai_pdf_filename_as_title', useFilenameAsTitle);
  }, [chunkingDensity, chunkingOverlap, useFilenameAsTitle]);

  const enabledCount = useMemo(() => editableChunks.filter(c => c.enabled).length, [editableChunks]);

  // Update parent component when busy state changes
  useEffect(() => {
    if (onBusyChange) {
      onBusyChange(busy || isGeneratingTitles);
    }
  }, [busy, isGeneratingTitles, onBusyChange]);

  // Update parent component when error changes
  useEffect(() => {
    if (onError) {
      onError(error);
    }
  }, [error, onError]);

  // Expose methods and state to parent via ref
  // Include editableChunks and pdfRefId in dependencies to ensure fresh data
  useImperativeHandle(ref, () => ({
    pdfData,
    enabledCount,
    clearPDF,
    handleUploadEmbeddings,
    uploadProgress: uploadProcessor.percentage,
    busy
  }), [pdfData, enabledCount, uploadProcessor.percentage, busy, editableChunks, pdfRefId, useFilenameAsTitle]);

  const detectHeadings = (textContent) => {
    const headings = [];
    let currentY = null;
    let currentLine = [];
    const lines = [];
    
    // Group items into lines based on Y position
    textContent.items.forEach((item) => {
      if (currentY === null || Math.abs(item.transform[5] - currentY) > 2) {
        if (currentLine.length > 0) {
          lines.push({
            text: currentLine.map(i => i.str).join(' ').trim(),
            items: currentLine,
            y: currentY,
            height: currentLine[0]?.height || 0,
            fontName: currentLine[0]?.fontName || ''
          });
        }
        currentLine = [item];
        currentY = item.transform[5];
      } else {
        currentLine.push(item);
      }
    });
    
    // Add the last line
    if (currentLine.length > 0) {
      lines.push({
        text: currentLine.map(i => i.str).join(' ').trim(),
        items: currentLine,
        y: currentY,
        height: currentLine[0]?.height || 0,
        fontName: currentLine[0]?.fontName || ''
      });
    }
    
    // Analyze lines to find potential headings
    const avgHeight = lines.reduce((sum, line) => sum + line.height, 0) / lines.length;
    
    lines.forEach((line, index) => {
      const text = line.text;
      const isLargerFont = line.height > avgHeight * 1.2;
      const isShortLine = text.split(' ').length <= 10;
      const isNumbered = /^(Chapter\s+\d+|CHAPTER\s+\d+|\d+\.|Part\s+\d+|Section\s+\d+)/i.test(text);
      const isAllCaps = text === text.toUpperCase() && text.length > 3;
      const hasColonEnd = text.endsWith(':');
      
      // Check if it's likely a heading
      if (text.length > 3 && (
        (isLargerFont && isShortLine) ||
        isNumbered ||
        (isAllCaps && isShortLine) ||
        (hasColonEnd && isShortLine)
      )) {
        headings.push({
          text: text,
          pageIndex: 0, // Will be set later
          lineIndex: index,
          confidence: 
            (isLargerFont ? 0.3 : 0) + 
            (isNumbered ? 0.4 : 0) + 
            (isAllCaps ? 0.2 : 0) + 
            (hasColonEnd ? 0.1 : 0)
        });
      }
    });
    
    return headings.filter(h => h.confidence >= 0.3);
  };

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file || !file.type.includes('pdf')) {
      setError('Please select a valid PDF file');
      return;
    }

    console.log('[PDF Import] File selected:', file.name, 'Size:', file.size);
    setPdfFile(file);
    setError(null);
    setBusy(true);

    try {
      console.log('[PDF Import] Starting PDF parsing...');
      const pdfjsLibrary = await loadPDFjs();
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLibrary.getDocument({ data: arrayBuffer }).promise;
      console.log('[PDF Import] PDF loaded, pages:', pdf.numPages);

      let fullText = '';
      const pageTexts = [];
      const detectedHeadings = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        console.log(`[PDF Import] Extracting text from page ${i}/${pdf.numPages}`);
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        
        // Detect headings in this page
        const pageHeadings = detectHeadings(textContent);
        pageHeadings.forEach(heading => {
          heading.pageIndex = i - 1;
          detectedHeadings.push(heading);
        });
        
        const pageText = textContent.items.map(item => item.str).join(' ');
        pageTexts.push(pageText);
        fullText += pageText + '\n\n';

        setCurrentPage(i);
        setParseProgress((i / pdf.numPages) * 100);
      }

      const wordCount = fullText.split(/\s+/).filter(w => w.length > 0).length;
      console.log('[PDF Import] Text extraction complete. Words:', wordCount, 'Characters:', fullText.length);
      console.log('[PDF Import] Detected headings:', detectedHeadings.length);

      const pdfInfo = {
        numPages: pdf.numPages,
        wordCount,
        fullText,
        pageTexts,
        fileName: file.name,
        detectedHeadings: detectedHeadings.length >= 3 ? detectedHeadings : []
      };
      setPdfData(pdfInfo);

      // Generate unique reference ID for this PDF import
      // Format: pdf_<timestamp>_<short_hash_of_filename>
      const timestamp = Date.now();
      const fileNameHash = Math.abs(file.name.split('').reduce((acc, char) => {
        return ((acc << 5) - acc) + char.charCodeAt(0);
      }, 0)).toString(16).slice(-8).padStart(8, '0');
      const refId = `pdf_${timestamp}_${fileNameHash}`;
      setPdfRefId(refId);
      console.log('[PDF Import] Generated refId:', refId);

      // Generate chunks with Medium density by default
      await generateChunks(fullText, pageTexts, chunkingDensity, pdfInfo, chunkingOverlap);

    } catch (err) {
      console.error('[PDF Import] PDF parsing error:', err);
      setError('Failed to parse PDF: ' + err.message);
    } finally {
      setBusy(false);
    }
  };

  const generateChunks = async (fullText, pageTexts, density, pdfInfo, overlap = 15) => {
    setBusy(true);
    setError(null);
    setChunkingStage('analyzing');

    console.log('[PDF Import] Starting client-side chunking with density:', density, 'overlap:', overlap + '%');

    try {
      setTimeout(() => {
        if (busy) {
          setChunkingStage('processing');
        }
      }, 100);

      // Perform chunking on client side - no AI calls, instant processing
      let generatedChunks;
      
      // Always use token-based chunking with Medium density by default
      // Chapter-based chunking can be selected later
      console.log('[PDF Import] Using smart text chunking with density:', density);
      generatedChunks = await smartTextChunkingAsync(
        fullText,
        pageTexts,
        density,
        overlap,
        pdfInfo.fileName,
        (chunkCount, progress) => {
          setChunkingStage(`Creating chunks... ${chunkCount} created (${progress}%)`);
        }
      );

      if (generatedChunks && generatedChunks.length > 0) {
        console.log('[PDF Import] Generated chunks:', generatedChunks.length);
        setChunks(generatedChunks);
        setEditableChunks(generatedChunks.map((chunk, idx) => ({
          ...chunk,
          id: `chunk_${idx}`,
          enabled: true
        })));
        setError(null);
      } else {
        throw new Error('No chunks were generated');
      }
    } catch (err) {
      console.error('[PDF Import] Chunking error:', err);
      setError('Failed to generate chunks: ' + err.message);
    } finally {
      setBusy(false);
      setChunkingStage('');
    }
  };

  const handleDensityChange = async (newDensity) => {
    const densityValue = parseInt(newDensity);
    // Warn about Very High density for large PDFs
    if (densityValue === 5 && pdfData && pdfData.fullText.length > 100000) {
      const estimatedChunks = Math.ceil(pdfData.fullText.length / 800); // ~200 tokens = ~800 chars
      const proceed = confirm(
        "⚠️ Warning: Very High density will create many small chunks.\n\n" +
        "Your PDF has " + Math.round(pdfData.fullText.length / 1000) + "k characters.\n" +
        "This will create approximately " + estimatedChunks + " chunks.\n\n" +
        "Processing may take a moment. Consider using 'High' density for faster processing.\n\n" +
        "Do you still want to proceed?"
      );
      if (!proceed) return;
    }
    
    setChunkingDensity(densityValue);
    if (pdfData) {
      await regenerateChunks(densityValue, chunkingType, chunkingOverlap);
    }
  };

  const handleOverlapChange = async (newOverlap) => {
    const overlapValue = parseInt(newOverlap);
    setChunkingOverlap(overlapValue);
    if (pdfData) {
      await regenerateChunks(chunkingDensity, chunkingType, overlapValue);
    }
  };

  const regenerateChunks = async (density, type = 'tokens', overlap = 10) => {
    setBusy(true);
    setError(null);

    console.log(`[Chunk Regeneration] Starting with density: ${density}, overlap: ${overlap}%`);

    try {
      let generatedChunks;
      
      if (type === 'chapters' && pdfData.detectedHeadings && pdfData.detectedHeadings.length >= 3) {
        console.log('[Chunk Regeneration] Using chapter-based chunking');
        generatedChunks = chapterBasedChunking(
          pdfData.fullText,
          pdfData.pageTexts,
          pdfData.detectedHeadings,
          pdfData.fileName
        );
      } else {
        console.log('[Chunk Regeneration] Using token-based chunking');
        generatedChunks = await smartTextChunkingAsync(
          pdfData.fullText,
          pdfData.pageTexts,
          density,
          overlap,
          pdfData.fileName,
          (chunkCount, progress) => {
            setChunkingStage(`Regenerating... ${chunkCount} chunks (${progress}%)`);
          }
        );
      }

      if (generatedChunks && generatedChunks.length > 0) {
        console.log(`[Chunk Regeneration] Generated ${generatedChunks.length} chunks`);
        setChunks(generatedChunks);
        setEditableChunks(generatedChunks.map((chunk, idx) => ({
          ...chunk,
          id: `chunk_${idx}`,
          enabled: true
        })));
      }
    } catch (err) {
      console.error('[Chunk Regeneration] Error:', err);
      setError('Failed to regenerate chunks: ' + err.message);
    } finally {
      setBusy(false);
      setChunkingStage('');
    }
  };

  const toggleChunk = (chunkId) => {
    setEditableChunks(prev => prev.map(chunk =>
      chunk.id === chunkId ? { ...chunk, enabled: !chunk.enabled } : chunk
    ));
  };

  const updateChunkTitle = (chunkId, newTitle) => {
    setEditableChunks(prev => prev.map(chunk =>
      chunk.id === chunkId ? { ...chunk, title: newTitle } : chunk
    ));
  };

  const generateChunkTitle = async (chunk) => {
    console.log('[PDF Import] Generating title for chunk:', chunk.id);
    
    // Add this chunk to busy set
    setBusyChunks(prev => new Set(prev).add(chunk.id));
    
    try {
      // Calculate how much overlap to skip (except for first chunk)
      let startOffset = 0;
      const chunkIndex = editableChunks.findIndex(c => c.id === chunk.id);
      if (chunkIndex > 0 && chunkingOverlap > 0) {
        const overlapSize = Math.floor(chunk.content.length * (chunkingOverlap / 100));
        startOffset = Math.min(overlapSize, chunk.content.length / 4);
      }
      
      // Extract content for title generation (skip overlap, limit to 1024 chars)
      const contentForTitle = chunk.content.substring(startOffset, startOffset + 1024);
      
      // Build the prompt with optional instructions
      let prompt = `Create a concise title (max 50 chars) for this text:\n\n${contentForTitle}`;
      if (titleInstructions) {
        prompt += `\n\nAdditional instructions: ${titleInstructions}`;
      }
      prompt += '\n\nReply with ONLY the title:';
      
      const response = await nekoFetch(`${apiUrl}/ai/completions`, {
        method: 'POST',
        nonce: restNonce,
        json: {
          message: prompt,
          scope: 'embeddings-title'
        }
      });

      if (response.success && response.data) {
        const generatedTitle = response.data
          .replace(/^["']|["']$/g, '') // Remove quotes
          .replace(/^Title:\s*/i, '') // Remove "Title:" prefix
          .trim()
          .substring(0, 60);
        updateChunkTitle(chunk.id, generatedTitle);
      }
    } catch (error) {
      console.error('[PDF Import] Error generating title:', error);
      // Fall back to improved default naming
      let defaultTitle = chunk.content.substring(0, 48);
      // Trim trailing punctuation and parenthesis
      defaultTitle = defaultTitle.replace(/[.,;:()[\]{}\"'\s]+$/, '');
      defaultTitle = defaultTitle.trim() + '...';
      updateChunkTitle(chunk.id, defaultTitle);
    } finally {
      // Remove this chunk from busy set
      setBusyChunks(prev => {
        const newSet = new Set(prev);
        newSet.delete(chunk.id);
        return newSet;
      });
    }
  };

  const clearPDF = () => {
    setPdfFile(null);
    setPdfData(null);
    setPdfRefId(null);
    setChunks([]);
    setEditableChunks([]);
    setParseProgress(0);
    setCurrentPage(0);
    setError(null);
    uploadProcessor.reset();
    setBusyChunks(new Set());
    setIsGeneratingTitles(false);
    setShouldStopGenerating(false);
    shouldStopGeneratingRef.current = false;
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUploadEmbeddings = async () => {
    const enabledChunks = editableChunks.filter(c => c.enabled);
    if (enabledChunks.length === 0) {
      setError('Please select at least one chunk to upload');
      return;
    }

    // Start preparing immediately to show progress
    uploadProcessor.startPreparing();
    setBusy(true);
    setError(null);

    // Small delay to ensure UI updates
    await new Promise(resolve => setTimeout(resolve, 10));

    const sourceFilename = pdfData?.fileName || '';
    const fileBaseTitle = sourceFilename.replace(/\.pdf$/i, '');

    // Create tasks for each chunk
    const tasks = enabledChunks.map(chunk => createTask(async (signal) => {
      const partIndex = chunk.partIndex || null;
      const partTotal = chunk.partTotal || null;
      const partLabel = partIndex && partTotal ? `${fileBaseTitle} - Part ${partIndex} of ${partTotal}` : fileBaseTitle;
      const vector = {
        type: 'upload', // Mark as uploaded content (PDF, etc.)
        title: useFilenameAsTitle ? partLabel : (chunk.title || 'Untitled'),
        content: chunk.content,
        envId: environment?.id,
        refChecksum: pdfRefId, // Link all chunks from this PDF together
        source: sourceFilename, // Built-in metadata: where this chunk came from.
        partIndex,
        partTotal,
        status: 'ok'
      };

      // Call onAddEmbedding which handles the API call internally
      await onAddEmbedding(vector, true); // true = skipBusy since we're managing busy state here
      return { success: true };
    }));

    try {
      const result = await uploadProcessor.processTasks(tasks);

      // Check if upload was stopped - nothing special needed, processor handles state
      if (result.errors.length > 0) {
        setError(`Failed to upload ${result.errors.length} embeddings`);
      }

    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload embeddings: ' + err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'row', flex: 1 }}>
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
        disabled={busy}
      />

      {/* Left Column - Main Content */}
      <NekoColumn minimal style={{ flex: 3, display: 'flex', flexDirection: 'column', backgroundColor: 'var(--neko-main-color)' }}>
        
        <NekoBlock className="primary"
          title={pdfData ? (enabledCount < editableChunks.length ? `${enabledCount} of ${editableChunks.length} Chunks` : `${editableChunks.length} Chunks`) : 'Upload PDF'}
          style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          
          {!pdfData ? (
            // Upload PDF area
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <NekoTypo p style={{ marginBottom: 20 }}>
                Select a PDF file to extract its content and create embeddings. 
                The content will be intelligently chunked for optimal AI processing.
              </NekoTypo>
              
              <NekoUploadDropArea
                accept=".pdf"
                onSelectFiles={(files) => {
                  if (files && files.length > 0) {
                    handleFileSelect({ target: { files } });
                  }
                }}
                disabled={busy}
                style={{ marginBottom: 20, background: '#e9f5fc' }}
              >
                <div style={{ 
                  padding: 40, 
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}>
                  <NekoIcon icon="file-upload" width={48} color={colors.grey} style={{ marginBottom: 15 }} />
                </div>
              </NekoUploadDropArea>
              
              <NekoButton
                fullWidth
                className="primary"
                onClick={() => fileInputRef.current?.click()}
                disabled={busy}
                style={{ height: 50, fontSize: 16 }}
              >
                Select PDF
              </NekoButton>
              
              {busy && (
                <>
                  <NekoSpacer />
                  <NekoProgress busy value={parseProgress} text={
                    currentPage > 0 
                      ? `Processing page ${currentPage}...`
                      : 'Loading PDF...'
                  } />
                </>
              )}
            </div>
          ) : (
            // Chunks list
            <>
              {/* Progress Bar - Only show when uploading */}
              {uploadProcessor.isActive && (
                <NekoToolbar style={{ marginBottom: 15 }}>
                  <NekoProgress 
                    busy={!uploadProcessor.justStopped}
                    value={uploadProcessor.progress} 
                    max={uploadProcessor.total} 
                    status={uploadProcessor.isPreparing ? 'Preparing embeddings...' : 
                            uploadProcessor.isStopping ? 'Please wait...' :
                            uploadProcessor.justStopped ? 'Stopped' :
                            undefined}
                    style={{ width: '100%' }}
                    variant={uploadProcessor.variant}
                    onStopClick={uploadProcessor.justStopped ? null : uploadProcessor.stop}
                  />
                </NekoToolbar>
              )}
              
              {!uploadProcessor.isActive && uploadProcessor.percentage === 100 && (
                <NekoMessage 
                  variant="success" 
                  style={{ marginBottom: 15 }}
                  onClose={uploadProcessor.reset}
                >
                  Successfully created {uploadProcessor.progress} {uploadProcessor.progress === 1 ? 'embedding' : 'embeddings'}
                </NekoMessage>
              )}
              
              {!uploadProcessor.isActive && uploadProcessor.progress > 0 && uploadProcessor.percentage < 100 && (
                <NekoMessage 
                  variant="info" 
                  style={{ marginBottom: 15 }}
                  onClose={uploadProcessor.reset}
                >
                  Stopped after creating {uploadProcessor.progress} of {uploadProcessor.total} embeddings
                </NekoMessage>
              )}

              {busy && chunkingStage && (
                <>
                  <NekoProgress busy value={0} text={chunkingStage} />
                  <NekoSpacer />
                </>
              )}
              
              <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', overflowX: 'hidden' }}>
                {editableChunks.map((chunk) => (
                  <ChunkItem
                    key={chunk.id}
                    chunk={chunk}
                    onToggle={toggleChunk}
                    onUpdateTitle={updateChunkTitle}
                    onGenerateTitle={generateChunkTitle}
                    isChunkBusy={busyChunks.has(chunk.id)}
                    isAnyChunkBusy={busyChunks.size > 0}
                    isGeneratingTitles={isGeneratingTitles}
                    isUploadingEmbeddings={busy}
                    colors={colors}
                  />
                ))}
              </div>
            </>
          )}
        </NekoBlock>
      </NekoColumn>

      {/* Right Column - Settings */}
      <NekoColumn minimal style={{ flex: 1, marginLeft: 10, backgroundColor: 'var(--neko-main-color)' }}>
        
        {/* Document Info */}
        <NekoBlock className="primary" title="Document Info">
          {pdfData ? (
            <>
              <div style={{ marginBottom: 5, fontWeight: 'bold' }}>{pdfData.fileName}</div>
              <div style={{ fontSize: 12, color: colors.grey, marginBottom: 5 }}>
                {pdfData.fullText.length.toLocaleString()} characters ({pdfData.numPages} pages)
              </div>
              {pdfRefId && (
                <div style={{ fontSize: 11, color: colors.grey, fontFamily: 'monospace' }}>
                  Source: {pdfRefId}
                </div>
              )}
            </>
          ) : (
            <NekoTypo small style={{ color: colors.grey }}>
              No PDF loaded
            </NekoTypo>
          )}
        </NekoBlock>

        <NekoSpacer tiny />

        {/* Generate Titles */}
        {pdfData && (
          <>
            <NekoBlock className="primary" title={
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>Titles</span>
                <NekoButton
                  rounded
                  icon="tools"
                  className={titleInstructions ? 'success' : 'primary'}
                  onClick={() => setShowTitleInstructionsModal(true)}
                  title="Additional Instructions"
                />
              </div>
            }>
              <p style={{ fontSize: 12, color: colors.grey, marginBottom: 10 }}>
                Better titles make embeddings easier to identify in the UI. Edit them manually or generate individually. This doesn't affect search or retrieval quality.
              </p>
              <NekoButton
                fullWidth
                className="primary"
                ai
                onClick={async () => {
                  setIsGeneratingTitles(true);
                  setShouldStopGenerating(false);
                  shouldStopGeneratingRef.current = false;
                  
                  try {
                    for (let i = 0; i < editableChunks.length; i++) {
                      const chunk = editableChunks[i];
                      if (!chunk.enabled) continue;
                      
                      // Check if we should stop (using ref for immediate value)
                      if (shouldStopGeneratingRef.current) {
                        console.log('[PDF Import] Stopping title generation after current chunk');
                        break;
                      }
                      
                      // Mark this specific chunk as busy
                      setBusyChunks(prev => new Set(prev).add(chunk.id));
                      
                      // Calculate how much overlap to skip (except for first chunk)
                      let startOffset = 0;
                      if (i > 0 && chunkingOverlap > 0) {
                        // Estimate overlap size based on chunk content and overlap percentage
                        const overlapSize = Math.floor(chunk.content.length * (chunkingOverlap / 100));
                        startOffset = Math.min(overlapSize, chunk.content.length / 4); // Cap at 25% of chunk
                      }
                      
                      // Extract content for title generation (skip overlap, limit to 1024 chars)
                      const contentForTitle = chunk.content.substring(startOffset, startOffset + 1024);
                      
                      // Build the prompt with optional instructions
                      let prompt = `Create a concise title (max 50 chars) for this text:\n\n${contentForTitle}`;
                      if (titleInstructions) {
                        prompt += `\n\nAdditional instructions: ${titleInstructions}`;
                      }
                      prompt += '\n\nReply with ONLY the title:';
                      
                      const response = await nekoFetch(`${apiUrl}/ai/completions`, {
                        method: 'POST',
                        nonce: restNonce,
                        json: {
                          message: prompt,
                          scope: 'embeddings-title'
                        }
                      });
                      
                      if (response.success && response.data) {
                        const title = response.data.trim().replace(/["']/g, '').substring(0, 60);
                        updateChunkTitle(chunk.id, title);
                      }
                      
                      // Remove this chunk from busy set after completion
                      setBusyChunks(prev => {
                        const newSet = new Set(prev);
                        newSet.delete(chunk.id);
                        return newSet;
                      });
                    }
                  } catch (err) {
                    console.error('[PDF Import] Error generating titles:', err);
                  } finally {
                    setIsGeneratingTitles(false);
                    setShouldStopGenerating(false);
                    shouldStopGeneratingRef.current = false;
                    setBusyChunks(new Set()); // Clear any remaining busy chunks
                  }
                }}
                onStopClick={shouldStopGenerating ? null : () => {
                  setShouldStopGenerating(true);
                  shouldStopGeneratingRef.current = true;
                }}
                disabled={!pdfData || enabledCount === 0 || busyChunks.size > 0 || isGeneratingTitles || busy}
                busy={isGeneratingTitles}
                style={{ height: 40 }}
              >
                Generate
              </NekoButton>
            </NekoBlock>
            <NekoSpacer tiny />
          </>
        )}

        {/* Chunking Settings */}
        <NekoBlock className="primary" title="Chunking">
          <p style={{ fontSize: 12, color: colors.grey, marginBottom: 15 }}>
            Splits your PDF into smaller pieces to create searchable embeddings. Default settings work well for most cases.
          </p>
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontWeight: 'bold', display: 'block' }}>Density</label>
            <NekoSlider
              min={1}
              max={5}
              step={1}
              value={chunkingDensity}
              recommended={3}
              marks={[1, 2, 3, 4, 5]}
              onChange={(value) => setChunkingDensity(value)}
              onFinalChange={async (value) => {
                if (pdfData) {
                  // Check if Highest density on large PDFs
                  if (value === 5 && pdfData.fullText.length > 100000) {
                    const estimatedChunks = Math.ceil(pdfData.fullText.length / 800);
                    const proceed = confirm(
                      "⚠️ Warning: Highest density will create many small chunks.\n\n" +
                      "Your PDF has " + Math.round(pdfData.fullText.length / 1000) + "k characters.\n" +
                      "This will create approximately " + estimatedChunks + " chunks.\n\n" +
                      "Processing may take a moment. Consider using 'High' density for faster processing.\n\n" +
                      "Do you still want to proceed?"
                    );
                    if (!proceed) {
                      setChunkingDensity(4); // Reset to High
                      return;
                    }
                  }
                  await regenerateChunks(value, chunkingType, chunkingOverlap);
                }
              }}
              labelFormatter={val => {
                const labels = {
                  1: 'Lowest',
                  2: 'Low', 
                  3: 'Medium',
                  4: 'High',
                  5: 'Highest'
                };
                return labels[val];
              }}
              formatValue={val => {
                const sizes = {
                  1: '~8000 chars',
                  2: '~4000 chars',
                  3: '~2000 chars',
                  4: '~1600 chars',
                  5: '~800 chars'
                };
                return sizes[val];
              }}
              disabled={!pdfData || busy || isGeneratingTitles}
              description="Higher density creates more, smaller chunks."
            />
          </div>

          <div>
            <label style={{ fontWeight: 'bold', display: 'block' }}>Overlap</label>
            <NekoSlider
              min={0}
              max={25}
              step={5}
              value={chunkingOverlap}
              recommended={15}
              marks={[0, 5, 10, 15, 20, 25]}
              onChange={(value) => setChunkingOverlap(value)}
              onFinalChange={async (value) => {
                if (pdfData) {
                  await regenerateChunks(chunkingDensity, chunkingType, value);
                }
              }}
              formatValue={val => `${val}%`}
              disabled={!pdfData || busy || isGeneratingTitles}
              description="Overlap improves context between chunks."
            />
          </div>

          <div style={{ marginTop: 15 }}>
            <NekoCheckbox
              label="Use filename as chunk title"
              description={'Replace per-chunk titles with "{filename} - Part X of N". Useful for citation-style references.'}
              checked={useFilenameAsTitle}
              onChange={(value) => setUseFilenameAsTitle(value)}
              disabled={!pdfData || busy || isGeneratingTitles}
            />
          </div>
        </NekoBlock>

      </NekoColumn>
      
      {/* Title Instructions Modal */}
      <NekoModal
        title="Additional Instructions"
        size="small"
        isOpen={showTitleInstructionsModal}
        onRequestClose={() => setShowTitleInstructionsModal(false)}
        customButtons={
          <>
            <NekoButton 
              className="danger" 
              onClick={() => setShowTitleInstructionsModal(false)}
            >
              Cancel
            </NekoButton>
            {titleInstructions && (
              <NekoButton
                onClick={() => {
                  setTitleInstructions('');
                  localStorage.removeItem('mwai_pdf_title_instructions');
                  setShowTitleInstructionsModal(false);
                }}
              >
                Clear
              </NekoButton>
            )}
            <NekoButton
              className="primary"
              onClick={() => {
                // Save to localStorage
                if (titleInstructions) {
                  localStorage.setItem('mwai_pdf_title_instructions', titleInstructions);
                } else {
                  localStorage.removeItem('mwai_pdf_title_instructions');
                }
                setShowTitleInstructionsModal(false);
              }}
            >
              Save
            </NekoButton>
          </>
        }
        content={
          <div>
            <NekoTypo p style={{ marginBottom: 15 }}>
              Provide additional instructions for title generation. These will be included when generating titles for chunks.
            </NekoTypo>
            <NekoTextArea
              value={titleInstructions}
              onChange={setTitleInstructions}
              placeholder="e.g., Use academic style, Include chapter numbers, Focus on main concepts, etc."
              rows={5}
              style={{ width: '100%' }}
            />
            <NekoTypo small style={{ marginTop: 10, color: colors.grey }}>
              ⚠️ These instructions are stored locally in your browser and will be cleared after a while.
            </NekoTypo>
          </div>
        }
      />
    </div>
  );
});

PDFImportView.displayName = 'PDFImportView';

export default PDFImportView;