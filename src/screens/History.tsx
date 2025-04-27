

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

const filterOptions = ['Today', 'Last 7 Days', 'All'];

const HistoryScreen = () => {
  const [selectedFilter, setSelectedFilter] = useState('All');

  const filterData = () => {
    const today = new Date();
    if (selectedFilter === 'Today') {
      return dummyData.filter(item => {
        const itemDate = new Date(item.date);
        return (
          itemDate.getDate() === today.getDate() &&
          itemDate.getMonth() === today.getMonth() &&
          itemDate.getFullYear() === today.getFullYear()
        );
      });
    } else if (selectedFilter === 'Last 7 Days') {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(today.getDate() - 7);
      return dummyData.filter(item => {
        const itemDate = new Date(item.date);
        return itemDate >= sevenDaysAgo && itemDate <= today;
      });
    }
    return dummyData;
  };

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        {filterOptions.map(option => (
          <TouchableOpacity
            key={option}
            style={[styles.filterButton, selectedFilter === option && styles.selectedButton]}
            onPress={() => setSelectedFilter(option)}
          >
            <Text style={styles.filterText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filterData()}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.historyItem}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.details}>{item.distance} | {new Date(item.date).toLocaleDateString()}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No history found.</Text>}
      />
    </View>
  );
};

export default HistoryScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  filterContainer: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 16 },
  filterButton: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, backgroundColor: '#eee' },
  selectedButton: { backgroundColor: '#007bff' },
  filterText: { color: '#333' },
  historyItem: { padding: 16, backgroundColor: '#f9f9f9', borderRadius: 8, marginBottom: 12 },
  title: { fontSize: 16, fontWeight: 'bold' },
  details: { fontSize: 14, color: '#666', marginTop: 4 },
  emptyText: { textAlign: 'center', color: '#888', marginTop: 50 },
});
