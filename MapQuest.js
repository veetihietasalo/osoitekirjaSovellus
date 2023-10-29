import React, { useEffect, useState, useRef } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { View, StyleSheet } from 'react-native';

export default function MapQuest({ route }) {
  console.log('Route object:', route);
  const { address } = route.params;
  const [coordinates, setCoordinates] = useState(null);
  const API_KEY = 'sFF5YM3snSYSbQWSvEghK1jFVKoRcfxX';
  const mapRef = useRef(null);

  useEffect(() => {
    const fetchCoordinates = async () => {
      const apiUrl = `https://www.mapquestapi.com/geocoding/v1/address?key=${API_KEY}&location=${address}`;
      try {
        const response = await fetch(apiUrl);
        if (response.ok) {
          const data = await response.json();
          const { lat, lng } = data.results[0].locations[0].latLng;
          const newCoordinates = { latitude: lat, longitude: lng };

          // Update state
          setCoordinates(newCoordinates);

          // Animate the map to new region
          mapRef.current?.animateToRegion({
            ...newCoordinates,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }, 1500); // 1500 milliseconds
        } else {
          console.error("Received non-OK HTTP status code:", response.status);
        }
      } catch (error) {
        console.error("An error occurred:", error);
      }
    };

    fetchCoordinates();
  }, []);

  return (
    <View style={styles.container}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});
