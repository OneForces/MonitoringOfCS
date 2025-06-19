import React from 'react';
import FeaturedServerCard from './FeaturedServerCard';
import './FeaturedServerBlock.css';

const featuredServers = [
  {
    id: 3,
    name: '111111111111',
    ip: '193.33.176.236',
    port: '27015',
    map: 'jb_mainkra_2024',
    players: 8,
    maxPlayers: 32,
    country: 'ru',
    image: '',
    isOnline: true,
  },
];

const FeaturedServerBlock: React.FC = () => {
  return (
    <div className="featured-block">
      {featuredServers.map(server => (
        <FeaturedServerCard key={server.id} server={server} />
      ))}
    </div>
  );
};

export default FeaturedServerBlock;
