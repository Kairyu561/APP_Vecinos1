import AuthService from "./Autenticación";
import API_ROUTES from "./Rutas";

interface Anuncio {
    id: number;
    titulo: string;
    subtitulo: string;
    estado: string;
    descripcion: string;
    fecha: string;
    categoria: {
        nombre: string;
    };
    usuario: {
        nombre: string;
    };
    imagenes: {
        id: number;
        imagen: string;
        fecha: string;
        extension: string;
    }[];
}

class AnunciosService {
    static async getAnuncios() {
        try {
            // Verificar que tenemos un token válido
            const token = await AuthService.getAccessToken();
            if (!token) {
                throw new Error('No hay token de acceso');
            }

            const headers = await AuthService.getAuthHeaders();
            console.log('URL de anuncios:', API_ROUTES.MUNICIPALIDAD.ANUNCIOS);
            console.log('Headers:', headers);

            const response = await fetch(API_ROUTES.MUNICIPALIDAD.ANUNCIOS, {
                method: 'GET',
                headers: headers
            });

            // Verificar el tipo de contenido de la respuesta
            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                console.error('Respuesta no es JSON:', contentType);
                throw new Error('La respuesta del servidor no es JSON válido');
            }

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('No autorizado');
                }
                const errorData = await response.json();
                console.error('Error respuesta del servidor:', errorData);
                throw new Error(errorData.detail || 'Error al obtener anuncios');
            }

            const data = await response.json();
            console.log('Datos recibidos:', data);

            // Verificar que los datos tienen el formato esperado
            if (!data || !data.results) {
                throw new Error('Formato de datos inválido');
            }

            return data;

        } catch (error) {
            console.error('Error detallado en getAnuncios:', {
                message: error instanceof Error ? error.message : 'Error desconocido',
                error: error
            });
            throw error;
        }
    }
}

export default AnunciosService;
export type { Anuncio };