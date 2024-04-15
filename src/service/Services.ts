import type IUser from '@/interfaces/IUser'; // Asegúrate de importar la interfaz IUser desde el archivo correcto

const api_url = 'http://187.157.236.135:5000';

export default {
  async login(username: string, password: string): Promise<IUser | null> {
    try {
      const response = await fetch(`${api_url}/auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) {
        throw new Error('Credenciales incorrectas');
      }
      
      const  token  = await response.json();
      localStorage.setItem('accessToken', token);
      console.log('Token de acceso:', token);
      return token;
    } catch (error) {
      console.error('Error al autenticar:', (error as Error).message);
      return null;
    }
  }
};
