import axios from 'axios';

const API_URL = 'http://localhost:5000/api/heroes';

// Fonction utilitaire pour récupérer le token
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Lecture (Publique - Pas besoin de token)
export const getAllHeroes = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const getHeroById = async (id: string) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

// Écriture (Protégée - Besoin du token)

export const createHero = async (formData: FormData) => {
  const response = await axios.post(API_URL, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      ...getAuthHeaders(),
    },
  });
  return response.data;
};

export const updateHero = async (id: string, formData: FormData) => {
  const response = await axios.put(`${API_URL}/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      ...getAuthHeaders(),
    },
  });
  return response.data;
};

export const deleteHero = async (id: string) => {
  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};