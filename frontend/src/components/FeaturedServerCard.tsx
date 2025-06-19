import React from 'react';
import './FeaturedServerCard.css';

interface FeaturedServer {
  id: number;
  name: string;
  ip: string;
  port: string;
  map: string;
  players: number;
  maxPlayers: number;
  country: string;
  isOnline?: boolean;
}

const FeaturedServerCard: React.FC<{ server: FeaturedServer }> = ({ server }) => {
  return (
    <div className="featured-card">
      <div className="featured-header">
        <span className="status-dot">{server.isOnline ? '🟢' : '🔴'}</span>
        <span className="server-name">{server.name}</span>
        <span className="flag">{server.country === 'ru' ? '🇷🇺' : '🌐'}</span>
      </div>

      <div className="map-name">Карта: {server.map}</div>

      <div className="player-info">
        {server.players}/{server.maxPlayers} 👥
      </div>

      <div className="server-ip">
        {server.ip}:{server.port}
      </div>
    </div>
  );
};

export default FeaturedServerCard;
