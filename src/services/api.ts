import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
console.log(API_BASE_URL);

export const fetchHello = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}`);
    console.log('data', response);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};
