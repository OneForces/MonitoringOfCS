// frontend/src/components/DownloadModal.tsx
import React from 'react';
import './DownloadModal.css';

interface Props {
  onClose: () => void;
  onDownload: () => void; // ✅ Добавлен проп для обновления графика
}

const DownloadModal: React.FC<Props> = ({ onClose, onDownload }) => {
  const handleDownload = (buildName: string) => {
    window.location.href = `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/api/servers/download/${buildName}/`;


    // Дать бэкенду записать статистику, потом обновить график
    setTimeout(() => {
      onDownload(); // ✅ Триггерим обновление графика
    }, 2000);

    onClose();
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
