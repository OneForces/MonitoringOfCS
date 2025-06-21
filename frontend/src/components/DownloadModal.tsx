import React from 'react';
import './DownloadModal.css';

interface Props {
  onClose: () => void;
}

const DownloadModal: React.FC<Props> = ({ onClose }) => {
  const handleDownload = (buildName: string) => {
    window.location.href = `/download/${buildName}/`;
    onClose(); // Закрыть модалку после перехода
  };

  return (
    <div className="download-modal-overlay">
      <div className="download-modal">
        <h3>Выберите сборку для скачивания</h3>
        <div className="download-options">
          <button onClick={() => handleDownload('build1')} className="btn-download">
            Сборка #1
          </button>
          <button onClick={() => handleDownload('build2')} className="btn-download">
            Сборка #2
          </button>
        </div>
        <button onClick={onClose} className="btn-close">
          Закрыть
        </button>
      </div>
    </div>
  );
};

export default DownloadModal;
