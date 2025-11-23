import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

// Interface pour la réponse de connexion
export interface AuthResponse {
  token: string;
  user: {
    id: string;
    username: string;
    role: string;
  };
}

// Fonction de Connexion
export const loginUser = async (credentials: { username: string; password: string }): Promise<AuthResponse> => {
  const response = await axios.post(`${API_URL}/login`, credentials);
  return response.data;
};

// Fonction d'Inscription
export const registerUser = async (credentials: { username: string; password: string; role?: string }): Promise<any> => {
  const response = await axios.post(`${API_URL}/register`, credentials);
  return response.data;
};