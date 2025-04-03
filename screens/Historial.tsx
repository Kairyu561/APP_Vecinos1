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
    Animated,
    Easing,
    ImageBackground
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import PublicacionesService, { Publicacion } from '../Servicios/Publicacion';

const getStatusColor = (estado: string) => {
    switch (estado.toLowerCase()) {
      case 'recibido':
        return '#FFF3E0';
      case 'en curso':
        return '#E3F2FD';
      case 'resuelto':
        return '#E8F5E9';
      case 'pendiente':
        return '#FFEBEE';
      case 'no resuelto':
        return '#FFCDD2';
      default:
        return '#FFFFFF';
    }
  };

  const getStatusIcon = (estado: string) => {
    switch (estado.toLowerCase()) {
      case 'recibido':
        return '📥';
      case 'en curso':
        return '⏳';
      case 'resuelto':
        return '✅';
      case 'pendiente':
        return '⚠️';
      case 'no resuelto':
        return '❌';
      default:
        return '';
    }
  };

const HistorialScreen = () => {
    const navigation = useNavigation();
    const [publicaciones, setPublicaciones] = useState<Publicacion[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState('');

    const cardAnimation = new Animated.Value(0);

    useEffect(() => {
        loadPublicaciones();
    }, []);

    useEffect(() => {
        Animated.timing(cardAnimation, {
            toValue: 1,
            duration: 300,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
        }).start();
    }, [cardAnimation]);

    const loadPublicaciones = async () => {
        try {
            const response = await PublicacionesService.getPublicacionesUsuario();
            setPublicaciones(response.results);
            setError('');
        } catch (error) {
            console.error('Error cargando publicaciones:', error);
            setError('Error al cargar las publicaciones');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        loadPublicaciones();
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-CL', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const renderItem = ({ item }: { item: Publicacion }) => (
        <Animated.View
            style={[
                styles.card,
                {
                    opacity: cardAnimation,
                    transform: [
                        { scale: cardAnimation },
                    ],
                },
            ]}
        >
            <View style={[styles.cardHeader, { backgroundColor: getStatusColor(item.situacion.nombre) }]}>
                <Text style={styles.codigo}>{item.codigo}</Text>
                <Text style={styles.fecha}>{formatDate(item.fecha_publicacion)}</Text>     
            </View> 
            <Text style={styles.titulo}>{item.titulo}</Text>
            <View style={styles.cardFooter}>
            <Text style={styles.ubicacion}>{item.ubicacion}</Text>
                <Text style={styles.categoria}>{item.categoria.nombre}</Text>
                <View style={styles.estadoContainer}>
                    <Text style={styles.estadoIcono}>
                        {getStatusIcon(item.situacion.nombre)}
                    </Text>
                    <Text style={styles.estado}>{item.situacion.nombre}</Text>
                </View>
            </View>
        </Animated.View>
    );

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#E67E22" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
        <View style={styles.header}>
            <TouchableOpacity 
                style={styles.backButton}
                onPress={() => navigation.goBack()}
            >
                <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Mis Publicaciones</Text>
        </View>
    
        {error ? (
            <Text style={styles.errorText}>{error}</Text>
        ) : (
            <FlatList
                data={publicaciones}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={styles.listContainer}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#E67E22']}
                    />
                }
                ListEmptyComponent={
                    <Text style={styles.emptyText}>
                        No tienes publicaciones registradas
                    </Text>
                }
            />
        )}
    </SafeAreaView>

    );
};
  
  const styles = StyleSheet.create({
      container: {
          flex: 1,
          backgroundColor: '#F5F5F5',
      },
      header: {
          flexDirection: 'row',
          alignItems: 'center',
          padding: 15,
          borderBottomWidth: 1,
          borderBottomColor: '#e0e0e0',
          backgroundColor: '#4CAF50',
      },
      backButton: {
          padding: 10,
      },
      backButtonText: {
          fontSize: 24,
          color: '#fff',
      },
      headerTitle: {
          fontSize: 20,
          fontWeight: 'bold',
          color: '#fff',
          marginLeft: 10,
          flexShrink: 1,
      },
      listContainer: {
          paddingHorizontal: 15,
          paddingBottom: 20,
      },
      card: {
          padding: 15,
          borderRadius: 10,
          marginBottom: 15,
          backgroundColor: '#fff',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
      },
      titulo: {
          fontSize: 16,
          fontWeight: 'bold',
          marginBottom: 5,
          color: '#333',
          flexWrap: 'wrap',
          marginTop: 15,
      },
      codigo: {
          fontWeight: 'bold',
          color: '#666',
          flexWrap: 'wrap',
      },
      fecha: {
          color: '#666',
          fontSize: 1,
          marginBottom: 5,
      },
      ubicacion: {
          color: '#666',
          fontSize: 11,
          
          flexWrap: 'wrap',
      },
      categoria: {
          color: '#666',
          fontSize: 11,
          flexWrap: 'wrap',
      },
      cardFooter: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 10,
      },
      estadoContainer: {
          flexDirection: 'row',
          alignItems: 'center',
      },
      estadoIcono: {
          marginRight: 5,
      },
      estado: {
          fontWeight: 'bold',
          fontSize: 14,
          color: '#333',
      },
      errorText: {
          color: '#E53935',
          textAlign: 'center',
          margin: 20,
      },
      emptyText: {
          textAlign: 'center',
          color: '#666',
          marginTop: 30,
          fontSize: 16,
      },
      centered:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 15, 
        backgroundColor: '#F5F5F5', 
      },
      cardHeader:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        padding: 10,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
      },

  });

export default HistorialScreen;