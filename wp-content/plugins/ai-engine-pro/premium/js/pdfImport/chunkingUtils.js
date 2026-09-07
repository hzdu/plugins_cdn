// Client-side chunking utilities for PDF import
// Avoids server-side bottleneck of AI title generation

export const estimateTokens = (text) => {
  // Simple token estimation (roughly 1 token per 4 characters)
  // This matches the server-side fallback for short text
  return Math.ceil(text.length / 4);
};

export const splitIntoSentences = (text) => {
  // Split by sentence endings, keeping the punctuation
  const sentences = text.split(/(?<=[.!?])\s+/).filter(s => s.length > 0);
  
  // Further split very long sentences
  const result = [];
  for (const sentence of sentences) {
    if (sentence.length > 500) {
      // Split long sentences by commas or semicolons
      const parts = sentence.split(/(?<=[,;])\s+/);
      result.push(...parts);
    } else {
      result.push(sentence);
    }
  }
  
  return result;
};

export const calculateOverlapSentences = (overlapTokens, sentences, currentIndex) => {
  let tokens = 0;
  let count = 0;
  
  // Work backwards from current position
  for (let i = currentIndex - 1; i >= 0 && tokens < overlapTokens; i--) {
    tokens += estimateTokens(sentences[i]);
    count++;
  }
  
  return count;
};

export const generateSimpleTitle = (content, index, fileName) => {
  // Clean filename for fallback
  const cleanFileName = fileName.replace(/\.[^/.]+$/, '');
  
  // Try to extract a meaningful title from the content
  const lines = content.split('\n').filter(line => line.trim().length > 0);
  
  // Look for potential headings in the first few lines
  for (const line of lines.slice(0, 5)) {
    const trimmedLine = line.trim();
    
    // Check if it looks like a heading
    if (trimmedLine.length > 10 && trimmedLine.length < 100) {
      // Check for common heading patterns
      if (
        /^(Chapter|Section|Part)\s+\d+/i.test(trimmedLine) ||
        /^\d+\.\s+/.test(trimmedLine) ||
        trimmedLine === trimmedLine.toUpperCase() ||
        trimmedLine.endsWith(':')
      ) {
        // Truncate to 48 chars and add ellipsis if needed
        if (trimmedLine.length > 48) {
          let title = trimmedLine.substring(0, 48);
          // Trim trailing punctuation and parenthesis
          title = title.replace(/[.,;:()[\]{}\"'\s]+$/, '');
          return title.trim() + '...';
        }
        return trimmedLine;
      }
    }
  }
  
  // Fallback: Use first sentence or part of it
  let firstSentence = lines[0]?.substring(0, 48) || `${cleanFileName} - Part ${index + 1}`;
  
  // Clean up and add ellipsis
  firstSentence = firstSentence.replace(/\s+/g, ' ').trim();
  
  // Trim trailing punctuation and parenthesis before adding ellipsis
  if (lines[0] && lines[0].length > 48) {
    firstSentence = firstSentence.replace(/[.,;:()[\]{}\"'\s]+$/, '');
    firstSentence = firstSentence.trim() + '...';
  }
  
  return firstSentence;
};

export const calculatePageRange = (chunkContent, pageTexts) => {
  if (!pageTexts || pageTexts.length === 0) {
    return '';
  }
  
  // For performance, just get a small snippet from the start
  // Most chunks won't span many pages, so this is usually accurate enough
  const startSnippet = chunkContent.substring(0, 50).trim();
  
  // Quick scan to find the page
  for (let i = 0; i < pageTexts.length; i++) {
    if (pageTexts[i].includes(startSnippet)) {
      // Check if it spans to next page
      const endSnippet = chunkContent.substring(Math.max(0, chunkContent.length - 50)).trim();
      for (let j = i; j < Math.min(i + 3, pageTexts.length); j++) {
        if (pageTexts[j].includes(endSnippet)) {
          return i === j ? `Page ${i + 1}` : `Pages ${i + 1}-${j + 1}`;
        }
      }
      return `Page ${i + 1}`;
    }
  }
  
  return ''; // Couldn't determine page range
};

// Async version with UI yielding to prevent blocking
export const smartTextChunkingAsync = async (text, pageTexts, density, overlapPercent, fileName, onProgress) => {
  const chunks = [];
  const sentences = splitIntoSentences(text);
  
  // Determine max chunk size based on density
  // Density: 1 (low) to 5 (very high)
  const chunkSizes = {
    1: 2000,  // Low density - large chunks
    2: 1000,  // Medium-low
    3: 500,   // Medium (default)
    4: 400,   // High (increased from 250 to prevent too many chunks)
    5: 200    // Very high - small chunks (increased from 125)
  };
  
  const maxChunkSize = chunkSizes[density] || 500;
  const overlapTokens = Math.floor(maxChunkSize * (overlapPercent / 100));
  
  let currentChunk = '';
  let currentTokens = 0;
  let currentSentences = [];
  let chunkIndex = 0;
  let sentenceIndex = 0;
  let lastYield = Date.now();
  let lastChunkEndIndex = 0; // Track where the last chunk ended to prevent infinite loops
  
  console.log(`[Client Chunking] Starting with density ${density}, chunk size ${maxChunkSize}, overlap ${overlapPercent}%`);
  console.log(`[Client Chunking] Processing ${sentences.length} sentences`);
  
  while (sentenceIndex < sentences.length) {
    const sentence = sentences[sentenceIndex];
    const sentenceTokens = estimateTokens(sentence);
    
    // If adding this sentence would exceed the max chunk size
    if (currentTokens + sentenceTokens > maxChunkSize && currentChunk.length > 0) {
      // Create chunk
      const title = generateSimpleTitle(currentChunk, chunkIndex, fileName);
      const pageRange = calculatePageRange(currentChunk, pageTexts);
      
      chunks.push({
        title: title,
        content: currentChunk.trim(),
        chars: currentChunk.trim().length,
        tokens: currentTokens, // Keep for backward compatibility
        pageRange: pageRange
      });
      
      // Calculate overlap - but ensure we always move forward
      lastChunkEndIndex = sentenceIndex;
      const overlapSentenceCount = calculateOverlapSentences(overlapTokens, sentences, sentenceIndex);
      const overlapStart = Math.max(
        lastChunkEndIndex - Math.min(overlapSentenceCount, currentSentences.length - 1), // Don't overlap more than we have
        lastChunkEndIndex - 3 // Maximum 3 sentences overlap to prevent infinite loops
      );
      
      // Reset for next chunk with overlap
      currentChunk = '';
      currentTokens = 0;
      currentSentences = [];
      
      // Add overlap sentences to the new chunk
      for (let i = overlapStart; i < lastChunkEndIndex; i++) {
        const overlapSentence = sentences[i];
        currentChunk += overlapSentence + ' ';
        currentTokens += estimateTokens(overlapSentence);
        currentSentences.push(overlapSentence);
      }
      
      // Continue from where we left off (not from overlap start)
      sentenceIndex = lastChunkEndIndex;
      chunkIndex++;
      
      // Yield to UI every 10 chunks or every 50ms to prevent blocking
      if (chunkIndex % 10 === 0 || Date.now() - lastYield > 50) {
        if (onProgress) {
          onProgress(chunkIndex, Math.floor((sentenceIndex / sentences.length) * 100));
        }
        console.log(`[Client Chunking] Created ${chunkIndex} chunks...`);
        await new Promise(resolve => setTimeout(resolve, 0)); // Yield to UI
        lastYield = Date.now();
      }
    } else {
      // Add sentence to current chunk
      currentChunk += sentence + ' ';
      currentTokens += sentenceTokens;
      currentSentences.push(sentence);
      sentenceIndex++;
    }
  }
  
  // Add remaining content as final chunk
  if (currentChunk.trim().length > 0) {
    const title = generateSimpleTitle(currentChunk, chunkIndex, fileName);
    const pageRange = calculatePageRange(currentChunk, pageTexts);
    
    chunks.push({
      title: title,
      content: currentChunk.trim(),
      chars: currentChunk.trim().length,
      tokens: currentTokens, // Keep for backward compatibility
      pageRange: pageRange
    });
  }
  
  console.log(`[Client Chunking] Completed: ${chunks.length} chunks created`);

  // Stamp each chunk with its position in the document. Marty asked for "Part X of N" semantics
  // (overlap-aware), not page numbers, since chunks span page boundaries.
  stampChunkParts(chunks);

  return chunks;
};

// Keep synchronous version for backward compatibility but mark as deprecated
export const smartTextChunking = (text, pageTexts, density, overlapPercent, fileName) => {
  console.warn('[Client Chunking] Using synchronous chunking - consider using smartTextChunkingAsync for better performance');
  const chunks = [];
  const sentences = splitIntoSentences(text);
  
  // Determine max chunk size based on density
  // Density: 1 (low) to 5 (very high)
  const chunkSizes = {
    1: 2000,  // Low density - large chunks
    2: 1000,  // Medium-low
    3: 500,   // Medium (default)
    4: 400,   // High (increased from 250 to prevent too many chunks)
    5: 200    // Very high - small chunks (increased from 125)
  };
  
  const maxChunkSize = chunkSizes[density] || 500;
  const overlapTokens = Math.floor(maxChunkSize * (overlapPercent / 100));
  
  let currentChunk = '';
  let currentTokens = 0;
  let currentSentences = [];
  let chunkIndex = 0;
  let sentenceIndex = 0;
  let lastChunkEndIndex = 0;
  
  console.log(`[Client Chunking] Starting with density ${density}, chunk size ${maxChunkSize}, overlap ${overlapPercent}%`);
  
  while (sentenceIndex < sentences.length) {
    const sentence = sentences[sentenceIndex];
    const sentenceTokens = estimateTokens(sentence);
    
    // If adding this sentence would exceed the max chunk size
    if (currentTokens + sentenceTokens > maxChunkSize && currentChunk.length > 0) {
      // Create chunk
      const title = generateSimpleTitle(currentChunk, chunkIndex, fileName);
      const pageRange = calculatePageRange(currentChunk, pageTexts);
      
      chunks.push({
        title: title,
        content: currentChunk.trim(),
        chars: currentChunk.trim().length,
        tokens: currentTokens, // Keep for backward compatibility
        pageRange: pageRange
      });
      
      // Calculate overlap - but ensure we always move forward
      lastChunkEndIndex = sentenceIndex;
      const overlapSentenceCount = calculateOverlapSentences(overlapTokens, sentences, sentenceIndex);
      const overlapStart = Math.max(
        lastChunkEndIndex - Math.min(overlapSentenceCount, currentSentences.length - 1),
        lastChunkEndIndex - 3 // Maximum 3 sentences overlap
      );
      
      // Reset for next chunk with overlap
      currentChunk = '';
      currentTokens = 0;
      currentSentences = [];
      
      // Add overlap sentences to the new chunk
      for (let i = overlapStart; i < lastChunkEndIndex; i++) {
        const overlapSentence = sentences[i];
        currentChunk += overlapSentence + ' ';
        currentTokens += estimateTokens(overlapSentence);
        currentSentences.push(overlapSentence);
      }
      
      // Continue from where we left off
      sentenceIndex = lastChunkEndIndex;
      chunkIndex++;
      
      // Progress feedback
      if (chunkIndex % 10 === 0) {
        console.log(`[Client Chunking] Created ${chunkIndex} chunks...`);
      }
    } else {
      // Add sentence to current chunk
      currentChunk += sentence + ' ';
      currentTokens += sentenceTokens;
      currentSentences.push(sentence);
      sentenceIndex++;
    }
  }
  
  // Add remaining content as final chunk
  if (currentChunk.trim().length > 0) {
    const title = generateSimpleTitle(currentChunk, chunkIndex, fileName);
    const pageRange = calculatePageRange(currentChunk, pageTexts);
    
    chunks.push({
      title: title,
      content: currentChunk.trim(),
      chars: currentChunk.trim().length,
      tokens: currentTokens, // Keep for backward compatibility
      pageRange: pageRange
    });
  }
  
  console.log(`[Client Chunking] Completed: ${chunks.length} chunks created`);

  // Stamp each chunk with its position in the document. Marty asked for "Part X of N" semantics
  // (overlap-aware), not page numbers, since chunks span page boundaries.
  stampChunkParts(chunks);

  return chunks;
};

export const chapterBasedChunking = (text, pageTexts, detectedHeadings, fileName) => {
  const chunks = [];
  
  if (!detectedHeadings || detectedHeadings.length === 0) {
    console.log('[Client Chunking] No headings detected, falling back to smart chunking');
    return smartTextChunking(text, pageTexts, 3, 15, fileName);
  }
  
  // Sort headings by their position
  const sortedHeadings = [...detectedHeadings].sort((a, b) => {
    if (a.pageIndex !== b.pageIndex) {
      return a.pageIndex - b.pageIndex;
    }
    return a.lineIndex - b.lineIndex;
  });
  
  console.log(`[Client Chunking] Using ${sortedHeadings.length} detected chapters`);
  
  // Create chunks based on chapters
  const lines = text.split('\n');
  let currentChunk = '';
  let currentTitle = fileName;
  let chunkIndex = 0;
  
  for (let i = 0; i < sortedHeadings.length; i++) {
    const heading = sortedHeadings[i];
    const nextHeading = sortedHeadings[i + 1];
    
    // Find the content between this heading and the next
    let startIdx = lines.findIndex(line => line.includes(heading.text));
    let endIdx = nextHeading ? lines.findIndex(line => line.includes(nextHeading.text)) : lines.length;
    
    if (startIdx !== -1) {
      currentChunk = lines.slice(startIdx, endIdx).join('\n');
      currentTitle = heading.text.substring(0, 60);
      
      const pageRange = calculatePageRange(currentChunk, pageTexts);
      
      chunks.push({
        title: currentTitle,
        content: currentChunk.trim(),
        chars: currentChunk.trim().length,
        tokens: estimateTokens(currentChunk), // Keep for backward compatibility
        pageRange: pageRange
      });
      
      chunkIndex++;
    }
  }
  
  console.log(`[Client Chunking] Created ${chunks.length} chapter-based chunks`);

  stampChunkParts(chunks);

  return chunks;
};

// Tag each chunk with its 1-based part index and total. Used as built-in metadata in the vector DB.
const stampChunkParts = (chunks) => {
  const partTotal = chunks.length;
  chunks.forEach((chunk, index) => {
    chunk.partIndex = index + 1;
    chunk.partTotal = partTotal;
  });
};