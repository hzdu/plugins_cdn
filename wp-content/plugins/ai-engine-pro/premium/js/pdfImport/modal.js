// React & Vendor Libs
const { useState } = wp.element;

// NekoUI
import { NekoModal, NekoButton, NekoMessage, NekoSpacer } from '@neko-ui';

// Components
import PDFImportView from './PDFImportView';

const PDFImportModal = ({ modal, setModal, onAddEmbedding, environment }) => {
  const [viewRef, setViewRef] = useState(null);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  const reset = () => {
    setError(null);
    setBusy(false);
    if (viewRef?.clearPDF) {
      viewRef.clearPDF();
    }
  };

  const handleClose = () => {
    setModal(null);
    reset();
  };

  const handleClosePDF = () => {
    if (viewRef?.clearPDF) {
      viewRef.clearPDF();
    }
  };

  const handleCreateEmbeddings = () => {
    if (viewRef?.handleUploadEmbeddings) {
      viewRef.handleUploadEmbeddings();
    }
  };

  return (
    <NekoModal
      title="Import from PDF"
      size="full-size"
      style={{ backgroundColor: 'var(--neko-main-color)' }}
      isOpen={modal?.type === 'pdf-import'}
      onRequestClose={handleClose}
      customButtons={
        <>
          <NekoButton className="danger" onClick={handleClose} disabled={busy}>
            Close
          </NekoButton>
          <NekoButton onClick={handleClosePDF} disabled={busy || !viewRef?.pdfData}>
            Close PDF
          </NekoButton>
          <NekoButton
            className="primary"
            onClick={handleCreateEmbeddings}
            disabled={busy || !viewRef?.pdfData || !viewRef?.enabledCount}
            progress={viewRef?.busy && viewRef?.uploadProgress >= 0 ? viewRef.uploadProgress : null}
          >
            {viewRef?.busy && viewRef?.uploadProgress >= 0 ? 'Creating Embeddings...' : 'Create Embeddings'}
          </NekoButton>
        </>
      }
      content={<>
        {error && (
          <>
            <NekoMessage variant="danger">{error}</NekoMessage>
            <NekoSpacer />
          </>
        )}
        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
          <PDFImportView
            ref={setViewRef}
            onAddEmbedding={onAddEmbedding}
            environment={environment}
            onClose={handleClose}
            onError={setError}
            onBusyChange={setBusy}
          />
        </div>
      </>}
      contentStyle={{
        margin: '0 -15px',
        padding: '10px 15px',
        height: '100%',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--neko-main-color)'
      }}
    />
  );
};

export default PDFImportModal;