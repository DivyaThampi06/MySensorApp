import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, PermissionsAndroid, Platform } from 'react-native';
import Geolocation from '@react-native-community/geolocation'; 
import { Card, Title, Paragraph } from 'react-native-paper';
import { theme } from '../styles/ theme';

const Dashboard = () => {
  const [activity, setActivity] = useState('Detecting...');
  const [duration, setDuration] = useState('0 min');
  const [distance, setDistance] = useState('0.00 km');
  const [lightLevel, setLightLevel] = useState('0 lx');
  const [pressure, setPressure] = useState('0 hPa');
  const [prevLocation, setPrevLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [totalDistance, setTotalDistance] = useState(0);

  useEffect(() => {
    requestLocationPermission();
    const watchId = Geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        if (prevLocation) {
          const dist = calculateDistance(prevLocation.latitude, prevLocation.longitude, latitude, longitude);
        
          setTotalDistance(prev => prev + dist);
        
          setDistance(prev => {
            const prevNum = parseFloat(prev); 
            return (prevNum + dist).toFixed(2) + ' km';
          });
        }
        
        setPrevLocation({ latitude, longitude });
      },
      (error) => {
        console.error(error);
      },
      {
        enableHighAccuracy: true,
        distanceFilter: 10,
        interval: 5000,
        fastestInterval: 2000,
      }
    );

    const interval = setInterval(() => {
      setActivity('Walking');
      setDuration(prev => {
        const mins = parseInt(prev.split(' ')[0]) + 1;
        return `${mins} min`;
      });
      setLightLevel('150 lx');
      setPressure('1012 hPa');
    }, 10000);

    return () => {
      clearInterval(interval);
      Geolocation.clearWatch(watchId);
    };
  }, [prevLocation]);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Location Permission",
            message: "This app needs location access to track your movement.",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK",
          },
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.log("Location permission denied");
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; 
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; 
    return d;
  };

  const deg2rad = (deg: number) => {
    return deg * (Math.PI / 180);
  };

  return (
    <ScrollView style={styles.container}>
      <Title style={styles.header}>📊 Your Activity Dashboard</Title>

      <Card style={styles.card}>
        <Card.Content>
          <Title>🏃 Activity</Title>
          <Paragraph>Type: {activity}</Paragraph>
          <Paragraph>Duration: {duration}</Paragraph>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>📍 Distance</Title>
          <Paragraph>{distance}</Paragraph>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>💡 Light Level</Title>
          <Paragraph>{lightLevel}</Paragraph>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>🌬 Pressure</Title>
          <Paragraph>{pressure}</Paragraph>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.medium,
  },
  card: {
    marginVertical: theme.spacing.small,
    backgroundColor: theme.colors.card,
    elevation: 3,
  },
  header: {
    marginBottom: theme.spacing.medium,
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
});

export default Dashboard;
