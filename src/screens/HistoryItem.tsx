import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

interface HistoryItem {
  id: string;
  title: string;
  date: string;
  distance: string;
}


const dummyData: HistoryItem[] = [
  { id: '1', title: 'Walk around park', date: '2025-04-27T10:00:00Z', distance: '2.5 km' },
  { id: '2', title: 'Morning jog', date: '2025-04-25T07:30:00Z', distance: '5.2 km' },
  { id: '3', title: 'Evening walk', date: '2025-04-20T18:00:00Z', distance: '3.8 km' },
];

const App = () => {
  const [screen, setScreen] = useState<'dashboard' | 'history'>('dashboard');

  const renderHistory = () => (
    <View style={styles.historyContainer}>
      <Text style={styles.heading}>History</Text>
      <FlatList
        data={dummyData}
        renderItem={({ item }) => (
          <View style={styles.historyItem}>
            <Text>{item.title}</Text>
            <Text>{new Date(item.date).toLocaleDateString()}</Text>
            <Text>{item.distance}</Text>
          </View>
        )}
        keyExtractor={item => item.id}
      />
      <TouchableOpacity onPress={() => setScreen('dashboard')} style={styles.button}>
        <Text style={styles.buttonText}>Back to Dashboard</Text>
      </TouchableOpacity>
    </View>
  );

  const renderDashboard = () => (
    <View style={styles.dashboardContainer}>
      <Text style={styles.heading}>Dashboard</Text>
      <Text>Tracking your activities...</Text>
      <TouchableOpacity onPress={() => setScreen('history')} style={styles.button}>
        <Text style={styles.buttonText}>View History</Text>
      </TouchableOpacity>
    </View>
  );

  return <View style={styles.container}>{screen === 'dashboard' ? renderDashboard() : renderHistory()}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dashboardContainer: {
    alignItems: 'center',
  },
  historyContainer: {
    alignItems: 'center',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  historyItem: {
    marginBottom: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    width: 250,
    alignItems: 'center',
  },
});

export default App;
