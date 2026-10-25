import React, { useEffect, useState, useRef } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { View, StyleSheet, Text } from 'react-native';
import { geocode, geocoderCredit } from './geocode';

export default function MapQuest({ route }) {
  const { address } = route.params;
  const [coordinates, setCoordinates] = useState(null);
  const [message, setMessage] = useState('');
  const mapRef = useRef(null);

  useEffect(() => {
    const fetchCoordinates = async () => {
      try {
        const newCoordinates = await geocode(address);
        if (!newCoordinates) {
          setMessage(`Address not found: ${address}`);
          return;
        }

        // Update state
        setCoordinates(newCoordinates);

        // Animate the map to new region
        mapRef.current?.animateToRegion({
          ...newCoordinates,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }, 1500); // 1500 milliseconds
      } catch (error) {
        console.error("An error occurred:", error);
        setMessage('Search failed, go back and try again.');
      }
    };

    fetchCoordinates();
  }, []);

  return (
    <View style={styles.container}>
      {message ? <Text style={styles.message}>{message}</Text> : null}
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: 60.1699,
          longitude: 24.9384,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {coordinates && (
          <Marker
            coordinate={coordinates}
            title={address}
          />
        )}
      </MapView>
      <Text style={styles.credit}>{geocoderCredit}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  message: {
    color: '#b00020',
    padding: 8,
  },
  map: {
    flex: 1,
  },
  credit: {
    fontSize: 11,
    color: 'gray',
    padding: 4,
    textAlign: 'center',
  },
});
