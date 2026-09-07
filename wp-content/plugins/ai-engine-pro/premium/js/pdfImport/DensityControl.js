// React & Vendor Libs
const { useMemo } = wp.element;

// NekoUI
import { NekoBlock, NekoSelect, NekoOption } from '@neko-ui';
import { useNekoColors } from '@neko-ui';

const DensityControl = ({ density, onDensityChange, busy, textLength = 0, overlapPercent = 15 }) => {
  const { colors } = useNekoColors();
  
  // Estimate chunks using character-based, sentence-aware logic
  const estimateChunks = useMemo(() => {
    if (!textLength) return {};

    // Work only with characters; map density to approx chars per chunk
    // These correspond to token sizes used in chunking (x4 chars/token)
    const chunkCharSizes = {
      1: 2000 * 4, // ~8000 chars
      2: 1000 * 4, // ~4000 chars
      3: 500 * 4,  // ~2000 chars
      4: 400 * 4,  // ~1600 chars
      5: 200 * 4,  // ~800 chars
    };

    // Average sentence length heuristic in chars
    const avgCharsPerSentence = 90; // tune if needed based on corpus
    const totalSentences = Math.max(1, Math.ceil(textLength / avgCharsPerSentence));

    // Packing efficiency accounts for sentence-boundary underfilling (can't always hit exact limit)
    // Smaller chunks are less efficient; tune factors empirically
    const packingEfficiency = {
      1: 0.95,
      2: 0.93,
      3: 0.90,
      4: 0.88,
      5: 0.82,
    };

    const estimates = {};
    Object.keys(chunkCharSizes).forEach((key) => {
      const chunkChars = chunkCharSizes[key];
      const eff = packingEfficiency[key] ?? 0.9;

      // How many sentences fit in a chunk (by chars)
      const sentencesPerChunk = Math.max(1, Math.ceil(chunkChars / avgCharsPerSentence));

      // Overlap in chars, but capped to max 3 sentences and not exceeding (sentencesPerChunk - 1)
      const overlapChars = Math.floor(chunkChars * (overlapPercent / 100));
      const overlapSentencesTarget = Math.ceil(overlapChars / avgCharsPerSentence);
      const overlapSentences = Math.max(0, Math.min(3, sentencesPerChunk - 1, overlapSentencesTarget));

      // First chunk effective chars (due to sentence boundary packing)
      const firstChunkEffective = Math.max(1, Math.floor(chunkChars * eff));

      // Subsequent chunks add new sentences after overlap; convert to chars and apply packing
      const newSentencesPerChunk = Math.max(1, sentencesPerChunk - overlapSentences);
      const subsequentEffective = Math.max(1, Math.floor(newSentencesPerChunk * avgCharsPerSentence * eff));

      // Estimate chunks: first chunk, then fill remaining with subsequentEffective
      let chunks = 1;
      const remainingAfterFirst = Math.max(0, textLength - firstChunkEffective);
      if (remainingAfterFirst > 0) {
        chunks += Math.ceil(remainingAfterFirst / subsequentEffective);
      }

      // As a guard, don't let estimates drop below 1
      estimates[key] = Math.max(1, chunks);
    });

    return estimates;
  }, [textLength, overlapPercent]);
  
  return (
    <NekoBlock className="primary" title="Chunking Density">
      <NekoSelect
        value={density}
        onChange={onDensityChange}
        disabled={busy}
        busy={busy}
        style={{ width: '100%' }}
      >
        <NekoOption 
          value={1} 
          label="Very Low" 
          description={estimateChunks[1] ? `~${estimateChunks[1]} chunks • ~8000 chars each` : '~8000 chars per chunk'}
        />
        <NekoOption 
          value={2} 
          label="Low" 
          description={estimateChunks[2] ? `~${estimateChunks[2]} chunks • ~4000 chars each` : '~4000 chars per chunk'}
        />
        <NekoOption 
          value={3} 
          label="Medium (Recommended)" 
          description={estimateChunks[3] ? `~${estimateChunks[3]} chunks • ~2000 chars each` : '~2000 chars per chunk'}
        />
        <NekoOption 
          value={4} 
          label="High" 
          description={estimateChunks[4] ? `~${estimateChunks[4]} chunks • ~1600 chars each` : '~1600 chars per chunk'}
        />
        <NekoOption 
          value={5} 
          label="Very High ⚠️" 
          description={estimateChunks[5] ? `~${estimateChunks[5]} chunks • ~800 chars each` : '~800 chars per chunk'}
        />
      </NekoSelect>
      <p style={{ fontSize: 12, color: density === 5 ? colors.orange : colors.grey, marginTop: 10, marginBottom: 0 }}>
        {density === 5 
          ? "⚠️ Very High density creates many small chunks. Processing may take a moment for large PDFs."
          : "Smaller chunks improve retrieval precision for RAG. Medium (~2000 chars) is optimal for most use cases."}
      </p>
    </NekoBlock>
  );
};

export default DensityControl;
