import AsyncStorage from "@react-native-async-storage/async-storage";

class AuthService {
    static async login(rut: string, password: string) {
        try {
            const response = await fetch('https://backendmunicipalidadawstid-production.up.railway.app/api/v1/token/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ rut, password }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw error;
            }

            const data = await response.json();
            await this.setLoginData(data);
            // Verificamos los datos almacenados después del login
            await this.checkStoredData();
            return data;
        } catch (error) {
            console.error('Error en login:', error);
            throw error;
        }
    }

    static async setLoginData(data: { access: string; refresh: string; id: number; es_administrador: boolean }) {
        try {
            await AsyncStorage.multiSet([
                ['accessToken', data.access],
                ['refreshToken', data.refresh],
                ['userId', data.id.toString()],
                ['isAdmin', data.es_administrador.toString()]
            ]);
        } catch (error) {
            console.error('Error almacenando datos de login:', error);
            throw error;
        }
    }

    static async checkStoredData() {
        const userId = await this.getUserId();
        const accessToken = await this.getAccessToken();
        const refreshToken = await this.getRefreshToken();
        
        console.log('Datos almacenados:', {
            userId,
            hasAccessToken: !!accessToken,
            hasRefreshToken: !!refreshToken
        });
    }

    static async getUserId(): Promise<number | null> {
        try {
            const userId = await AsyncStorage.getItem('userId');
            return userId ? parseInt(userId) : null;
        } catch (error) {
            console.error('Error obteniendo ID de usuario:', error);
            return null;
        }
    }

    static async getAccessToken() {
        try {
            return await AsyncStorage.getItem('accessToken');
        } catch (error) {
            console.error('Error obteniendo access token:', error);
            return null;
        }
    }

    static async getRefreshToken() {
        try {
            return await AsyncStorage.getItem('refreshToken');
        } catch (error) {
            console.error('Error obteniendo refresh token:', error);
            return null;
        }
    }

    static async logout() {
        try {
            await this.clearSession();
        } catch (error) {
            console.error('Error en logout:', error);
            throw error;
        }
    }

    static async clearSession() {
        try {
            await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'userId', 'isAdmin']);
            // Verificamos que se hayan eliminado los datos
            await this.checkStoredData();
        } catch (error) {
            console.error('Error limpiando sesión:', error);
            throw error;
        }
    }

    static async isAuthenticated() {
        const token = await this.getAccessToken();
        return !!token;
    }

    static async getAuthHeaders() {
        const token = await this.getAccessToken();
        return {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        };
    }
}

export default AuthService;
