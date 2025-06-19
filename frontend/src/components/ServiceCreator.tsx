// src/components/ServiceCreator.tsx
import React, { useState } from 'react';
import axios from '../api/axios';

const ServiceCreator: React.FC = () => {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [price, setPrice] = useState('');
  const [type, setType] = useState<'boost' | 'color'>('boost');
  const [duration, setDuration] = useState(30);
  const [colors, setColors] = useState('');

  const handleCreate = async () => {
    const payload: any = {
      name,
      description: desc,
      price_per_unit: price,
      service_type: type,
      duration_days: duration,
    };

    if (type === 'color') {
      payload.available_colors = colors.split(',').map(c => c.trim());
    }

    try {
      await axios.post('/promotions/services/', payload, {
        headers: {
          Authorization: `Token ${localStorage.getItem('token')}`,
        },
      });
      alert('Услуга добавлена!');
    } catch (err) {
      alert('Ошибка при создании услуги');
    }
  };

  return (
    <div>
      <h3>Добавить услугу</h3>
      <input placeholder="Название" value={name} onChange={e => setName(e.target.value)} />
      <input placeholder="Описание" value={desc} onChange={e => setDesc(e.target.value)} />
      <input placeholder="Цена" value={price} onChange={e => setPrice(e.target.value)} type="number" />
      <select value={type} onChange={e => setType(e.target.value as 'boost' | 'color')}>
        <option value="boost">BOOST</option>
        <option value="color">Цвет</option>
      </select>
      {type === 'color' && (
        <input
          placeholder="Цвета через запятую (#fff, #000)"
          value={colors}
          onChange={e => setColors(e.target.value)}
        />
      )}
      <input placeholder="Длительность (дни)" value={duration} onChange={e => setDuration(+e.target.value)} />
      <button onClick={handleCreate}>Создать</button>
    </div>
  );
};

export default ServiceCreator;
