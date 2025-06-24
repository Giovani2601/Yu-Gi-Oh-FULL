import api from './api';

export async function loginRequest(email, senha) {
  const resp = await api.post('/usuario/login', { email, senha });
  return resp.data;
}
