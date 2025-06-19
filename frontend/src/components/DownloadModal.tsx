import React from 'react';
import './DownloadModal.css';

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DownloadModal: React.FC<DownloadModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="download-modal-overlay" onClick={onClose}>
      <div className="download-modal" onClick={(e) => e.stopPropagation()}>
        <h3>Выберите сборку для скачивания</h3>
        <div className="download-options">
          <a href="/api/servers/download/build1/" download className="btn-download">Сборка #1</a>
          <a href="/api/servers/download/build2/" download className="btn-download">Сборка #2</a>
        </div>
        <button className="btn-close" onClick={onClose}>Закрыть</button>
      </div>
    </div>
  );
};

export default DownloadModal;
