import axios from './axios';

export const getServers = async () => {
  const res = await axios.get('/servers/');
  return res.data;
};

export const addServer = async (data: any) => {
  const res = await axios.post('/servers/', data);
  return res.data;
};

