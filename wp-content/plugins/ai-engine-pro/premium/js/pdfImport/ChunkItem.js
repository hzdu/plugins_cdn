// React & Vendor Libs
const { useState } = wp.element;

// NekoUI
import { NekoCheckbox, NekoInput, NekoButton } from '@neko-ui';

const ChunkItem = ({ chunk, viewMode, onToggle, onUpdateTitle, onGenerateTitle, isChunkBusy, isAnyChunkBusy, isGeneratingTitles, isUploadingEmbeddings, colors }) => {
  const [showFullContent, setShowFullContent] = useState(false);
  
  // Field is disabled when chunk is busy or uploading embeddings
  const isFieldDisabled = !chunk.enabled || isChunkBusy || isUploadingEmbeddings;
  
  // Individual Generate button logic:
  // - Disabled when: not enabled, main generate is running, or uploading embeddings
  // - Busy when: this specific chunk is being processed (but NOT when uploading embeddings)
  // - Active when: another chunk is being processed (not this one and not main generate)
  const isGenerateDisabled = !chunk.enabled || isGeneratingTitles || isUploadingEmbeddings;
  
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        <NekoCheckbox checked={chunk.enabled} onChange={() => onToggle(chunk.id)} disabled={isChunkBusy || isUploadingEmbeddings} />
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <NekoInput
              value={chunk.title}
              onChange={(value) => onUpdateTitle(chunk.id, value)}
              style={{ flex: 1 }}
              disabled={isFieldDisabled}
              placeholder="Enter section title..."
            />
            {chunk.enabled && (
              <NekoButton size="small" className="primary" ai onClick={() => onGenerateTitle(chunk)}
                disabled={isGenerateDisabled}
                busy={isChunkBusy}
                title="Generate AI title">
                Generate
              </NekoButton>
            )}
          </div>

          {chunk.enabled && (
            <div style={{ fontSize: 12, color: colors.grey, marginTop: 2, display: 'flex', gap: 5, alignItems: 'center' }}>
              <span>{chunk.pageRange}</span>
              <span>•</span>
              <span>{chunk.chars || chunk.content.length} chars</span>
              <span>•</span>
              <button
                onClick={() => setShowFullContent(!showFullContent)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: colors.primary,
                  cursor: 'pointer',
                  padding: 0,
                  fontSize: 12,
                  textDecoration: 'underline'
                }}
              >
                {showFullContent ? 'Hide' : 'View'}
              </button>
            </div>
          )}

          {(viewMode === 'detailed' || showFullContent) && (
            <div style={{
              color: colors.darkGrey,
              marginTop: 8,
              marginBottom: 8,
              maxHeight: showFullContent ? 'none' : 80,
              overflow: showFullContent ? 'auto' : 'hidden',
              lineHeight: 1.5,
              position: 'relative',
              padding: showFullContent ? '10px' : 0,
              backgroundColor: showFullContent ? colors.lightGrey : 'transparent',
              borderRadius: showFullContent ? '4px' : 0,
              fontSize: showFullContent ? 13 : 14,
              whiteSpace: showFullContent ? 'pre-wrap' : 'normal'
            }}>
              {showFullContent ? chunk.content : chunk.content.substring(0, 200)}
              {!showFullContent && chunk.content.length > 200 && (
                <span style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  background: `linear-gradient(to right, transparent, ${colors.lightGrey})`,
                  padding: '0 10px'
                }}>...</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChunkItem;