import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    SafeAreaView,
    ActivityIndicator,
    RefreshControl,
    Image,
    Dimensions,
    Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../Navegador';
import AnunciosService, { Anuncio } from '../Servicios/Anuncios';
import AuthService from '../Servicios/Autenticación';

type AnunciosNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Eventos'>;

const AnunciosScreen = () => {
    const navigation = useNavigation<AnunciosNavigationProp>();
    const [anuncios, setAnuncios] = useState<Anuncio[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState('');
    const [loadingMore, setLoadingMore] = useState(false);

    const checkAuth = async () => {
        const isAuthenticated = await AuthService.isAuthenticated();
        if (!isAuthenticated) {
            Alert.alert(
                "Acceso Denegado",
                "Debes iniciar sesión para ver los anuncios municipales",
                [
                    {
                        text: "Ir a Login",
                        onPress: () => navigation.replace('Login')
                    }
                ]
            );
            return false;
        }
        return true;
    };

    const loadAnuncios = async () => {
        try {
            setLoadingMore(true);
            const isAuth = await checkAuth();
            if (!isAuth) return;

            const response = await AnunciosService.getAnuncios();
            const sortedAnuncios = response.results.sort((a: Anuncio, b: Anuncio) => 
                new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
            );
            setAnuncios(sortedAnuncios);
            setError('');
        } catch (error) {
            console.error('Error cargando anuncios:', error);
            const errorMessage = error instanceof Error ? error.message : 'Error al cargar los anuncios';
            
            if (errorMessage.includes('401')) {
                navigation.replace('Login');
                return;
            }
            
            setError(errorMessage);
        } finally {
            setLoading(false);
            setLoadingMore(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadAnuncios();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        loadAnuncios();
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-CL', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const renderItem = ({ item }: { item: Anuncio }) => (
        <View style={styles.card}>
            {item.imagenes && item.imagenes.length > 0 && (
                <Image
                    source={{ 
                        uri: `https://res.cloudinary.com/de06451wd/${item.imagenes[0].imagen}` 
                    }}
                    style={styles.image}
                    resizeMode="cover"
                />
            )}
            
            <View style={styles.cardContent}>
                <View style={[styles.estadoBadge, { backgroundColor: item.estado === 'Pendiente' ? '#FFA726' : '#66BB6A' }]}>
                    <Text style={styles.estadoText}>{item.estado}</Text>
                </View>
                
                <Text style={styles.titulo}>{item.titulo}</Text>
                <Text style={styles.subtitulo}>{item.subtitulo}</Text>
                <Text style={styles.descripcion} numberOfLines={3}>
                    {item.descripcion}
                </Text>
                
                <View style={styles.cardFooter}>
                    <Text style={styles.categoria}>{item.categoria.nombre}</Text>
                    <Text style={styles.fecha}>{formatDate(item.fecha)}</Text>
                </View>
            </View>
        </View>
    );

    const ListHeader = () => (
        <View style={styles.headerContainer}>
            <Text style={styles.headerTitle}>Anuncios Municipales</Text>
            <Text style={styles.headerSubtitle}>
                {anuncios.length} anuncio{anuncios.length !== 1 ? 's' : ''} disponible{anuncios.length !== 1 ? 's' : ''}
            </Text>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#E67E22" />
                <Text style={styles.loadingText}>Cargando anuncios...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            {error ? (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity
                        style={styles.retryButton}
                        onPress={loadAnuncios}
                    >
                        <Text style={styles.retryButtonText}>Reintentar</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <>
                    <FlatList
                        data={anuncios}
                        renderItem={renderItem}
                        keyExtractor={item => item.id.toString()}
                        contentContainerStyle={styles.listContainer}
                        ListHeaderComponent={ListHeader}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                colors={['#E67E22']}
                            />
                        }
                        ListEmptyComponent={
                            <Text style={styles.emptyText}>
                                No hay anuncios disponibles
                            </Text>
                        }
                    />
                    {loadingMore && (
                        <View style={styles.loadingMoreContainer}>
                            <ActivityIndicator color="#E67E22" />
                            <Text style={styles.loadingMoreText}>Cargando más anuncios...</Text>
                        </View>
                    )}
                </>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        color: '#666',
    },
    headerContainer: {
        padding: 15,
        backgroundColor: '#f5f5f5',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#666',
        marginTop: 5,
    },
    listContainer: {
        padding: 15,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        marginBottom: 15,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: 200,
    },
    cardContent: {
        padding: 15,
    },
    estadoBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 15,
        marginBottom: 10,
    },
    estadoText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    titulo: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#333',
    },
    subtitulo: {
        fontSize: 14,
        color: '#666',
        marginBottom: 10,
    },
    descripcion: {
        fontSize: 14,
        color: '#666',
        marginBottom: 10,
        lineHeight: 20,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    categoria: {
        color: '#009688',
        fontWeight: 'bold',
    },
    fecha: {
        color: '#666',
        fontSize: 12,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginBottom: 20,
    },
    retryButton: {
        backgroundColor: '#E67E22',
        padding: 10,
        borderRadius: 5,
    },
    retryButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    emptyText: {
        textAlign: 'center',
        color: '#666',
        marginTop: 30,
    },
    loadingMoreContainer: {
        padding: 10,
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
    },
    loadingMoreText: {
        color: '#666',
        marginTop: 5,
    },
});

export default AnunciosScreen;