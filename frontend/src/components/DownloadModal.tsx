// frontend/src/components/DownloadModal.tsx
import React from 'react';
import './DownloadModal.css';

interface Props {
  onClose: () => void;
  onDownload: () => void;
}

const DownloadModal: React.FC<Props> = ({ onClose, onDownload }) => {
  const handleDownload = (buildName: string) => {
    window.location.href = `/api/servers/download/${buildName}/`;

    setTimeout(() => {
      onDownload();
    }, 2000);

    onClose();
  };

  return (
    <div className="download-modal-overlay">
      <div className="download-modal">
        <h3>Выберите сборку для скачивания</h3>
        <div className="download-options">

          <div className="build-block">
            <button onClick={() => handleDownload('build1')} className="btn-download">
              Сборка #1
            </button>
            <p className="build-description">
              📦 Классическая сборка CS 1.6 с русификатором, улучшенным прицелом и паком карт de_dust2, inferno, mirage.
            </p>
          </div>

          <div className="build-block">
            <button onClick={() => handleDownload('build2')} className="btn-download">
              Сборка #2
            </button>
            <p className="build-description">
              🔥 Модифицированная сборка с админ-меню, плагинами AMX Mod X, античитом и сборником крутых скинов.
            </p>
          </div>

        </div>
        <button onClick={onClose} className="btn-close">
          Закрыть
        </button>
      </div>
    </div>
  );
};

export default DownloadModal;
