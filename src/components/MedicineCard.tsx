

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../styles/ theme';

interface MedicineCardProps {
  name: string;
  time: string;
}

const MedicineCard: React.FC<MedicineCardProps> = ({ name, time }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.time}>Reminder at: {time}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.card,
    padding: theme.spacing.medium,
    borderRadius: 10,
    marginVertical: theme.spacing.small,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: 4,
  },
  time: {
    fontSize: 14,
    color: theme.colors.text,
  },
});

export default MedicineCard;
