import AuthService from './Autenticación';
import { API_ROUTES } from './Rutas';

export interface Publicacion {
    id: number;
    codigo: string;
    titulo: string;
    descripcion: string;
    fecha_publicacion: string;
    usuario: {
        id: number;
        nombre: string;
    };
    situacion: {
        nombre: string;
    };
    categoria: {
        nombre: string;
    };
    ubicacion: string;
    
}

export interface Categoria {
    id: number;
    nombre: string;
    descripcion: string;
    departamento: {
        id: number;
        nombre: string;
        descripcion: string;
    };
}

export interface CreatePublicacionData {
    titulo: string;
    descripcion: string;
    nombre_calle: string;
    numero_calle: number;
    latitud: number;
    longitud: number;
    categoria: number;
    departamento: number;
    junta_vecinal: number;
}

class PublicacionesService {
    static async getPublicacionesUsuario() {
        try {
            const userId = await AuthService.getUserId();
            if (!userId) {
                throw new Error('No se encontró ID de usuario');
            }

            const headers = await AuthService.getAuthHeaders();
            const url = `${API_ROUTES.PUBLICACIONES.BASE}?usuario=${userId}`;
            
            const response = await fetch(url, {
                method: 'GET',
                headers: headers
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error respuesta del servidor:', errorData);
                throw new Error('Error al obtener publicaciones');
            }

            const data = await response.json();
            return data;

        } catch (error) {
            console.error('Error en getPublicacionesUsuario:', error);
            throw error;
        }
    }

    static async getCategorias() {
        try {
            const headers = await AuthService.getAuthHeaders();
            const response = await fetch(API_ROUTES.MUNICIPALIDAD.CATEGORIAS, {
                method: 'GET',
                headers: headers
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error respuesta del servidor:', errorData);
                throw new Error('Error al obtener categorías');
            }

            const data = await response.json();
            return data;

        } catch (error) {
            console.error('Error en getCategorias:', error);
            throw error;
        }
    }

    static async createPublicacion(data: CreatePublicacionData, imagen?: any) {
        try {
            const userId = await AuthService.getUserId();
            if (!userId) {
                throw new Error('No se encontró ID de usuario');
            }

            const headers = await AuthService.getAuthHeaders();
            
            // Crear la publicación
            const publicacionResponse = await fetch(API_ROUTES.PUBLICACIONES.BASE, {
                method: 'POST',
                headers: {
                    ...headers,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...data,
                    usuario: userId,
                })
            });

            if (!publicacionResponse.ok) {
                const errorData = await publicacionResponse.json();
                throw new Error(errorData.detail || 'Error al crear la publicación');
            }

            const publicacion = await publicacionResponse.json();

            // Si hay imagen, subirla como evidencia
            if (imagen) {
                const formData = new FormData();
                formData.append('archivo', {
                    uri: imagen.uri,
                    type: imagen.type || 'image/jpeg',
                    name: imagen.fileName || 'image.jpg',
                });
                formData.append('publicacion_id', publicacion.id);
                formData.append('extension', imagen.type?.split('/')[1] || 'jpg');

                const evidenciaResponse = await fetch(API_ROUTES.EVIDENCIAS, {
                    method: 'POST',
                    headers: {
                        ...headers,
                        'Content-Type': 'multipart/form-data',
                    },
                    body: formData
                });

                if (!evidenciaResponse.ok) {
                    throw new Error('Error al subir la imagen');
                }
            }

            return publicacion;

        } catch (error) {
            console.error('Error en createPublicacion:', error);
            throw error;
        }
    }
}

export default PublicacionesService;