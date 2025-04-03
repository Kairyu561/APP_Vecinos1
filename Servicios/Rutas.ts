// apiRoutes.ts

const BASE_URL = 'https://backendmunicipalidadawstid-production.up.railway.app/api/v1';

export const API_ROUTES = {
    // Rutas de autenticaciÃ³n
    AUTH: {
        LOGIN: `${BASE_URL}/token/`,
        REFRESH: `${BASE_URL}/token/refresh/`,
        REGISTER: `${BASE_URL}/registro/`,
    },

    // Rutas de publicaciones
    PUBLICACIONES: {
        BASE: `${BASE_URL}/publicaciones/`,
        POR_MES_CATEGORIA: `${BASE_URL}/publicaciones-por-mes-y-categoria/`,
        POR_CATEGORIA: `${BASE_URL}/publicaciones-por-categoria/`,
        ESTADISTICAS: `${BASE_URL}/resumen-estadisticas/`,
        RESUELTOS_MES: `${BASE_URL}/resueltos-por-mes/`,
        EXPORT_EXCEL: `${BASE_URL}/export-to-excel/`,
    },

    // Rutas de municipalidad
    MUNICIPALIDAD: {
        DEPARTAMENTOS: `${BASE_URL}/departamentos/`,
        CATEGORIAS: `${BASE_URL}/categorias/`,
        JUNTAS_VECINALES: `${BASE_URL}/juntas-vecinales/`,
        SITUACIONES: `${BASE_URL}/situaciones/`,
        ANUNCIOS: `${BASE_URL}/anuncios-municipales/`,
    },

    // Rutas de evidencias y respuestas
    EVIDENCIAS: `${BASE_URL}/evidencias/`,
    RESPUESTAS: `${BASE_URL}/respuestas/`,
};

export default API_ROUTES;