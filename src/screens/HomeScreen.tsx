import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, StyleSheet, TouchableOpacity, Alert, Dimensions } from 'react-native';
import ActivityBridge, { ActivityEventEmitter } from '../native/ActivityBridge'; 
import ReminderBridge from '../native/ReminderBridge';
import MedicineCard from '../components/MedicineCard';
import { theme } from '../styles/ theme';
import { LineChart } from 'react-native-chart-kit';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';


const screenWidth = Dimensions.get('window').width;

const Home: React.FC = () => {
  const [activity, setActivity] = useState<string>('Loading...');
  const [medicineList, setMedicineList] = useState([
    { name: 'Vitamin D', time: '8:00 AM' },
    { name: 'Paracetamol', time: '6:00 PM' },
  ]);
  const [sessionData, setSessionData] = useState<number[]>([10, 20, 15, 30, 25, 40, 35]); // todo dummy data replace


  const [isHistoryScreen, setIsHistoryScreen] = useState(false);

  useEffect(() => {
    const subscription = ActivityEventEmitter.addListener(
      'ActivityUpdate',
      (data: { activity: string; steps: number }) => {
        console.log('Activity update:', data);
        setActivity(`${data.activity} (${data.steps} steps)`);
      }
    );

    ActivityBridge.startTracking();

    return () => {
      subscription.remove();
      ActivityBridge.stopTracking();
    };
  }, []);


  const exportToCSV = async () => {
    try {
      const headerString = 'Session Number,Value\n';
      const rowString = sessionData.map((value, index) => `${index + 1},${value}\n`).join('');
      const csvString = `${headerString}${rowString}`;

      const path = `${RNFS.DocumentDirectoryPath}/session_data.csv`;
      await RNFS.writeFile(path, csvString, 'utf8');

      await Share.open({
        url: 'file://' + path,
        type: 'text/csv',
        filename: 'session_data',
      });
    } catch (error) {
      console.error('Error exporting CSV: ', error);
      Alert.alert('Error', 'Failed to export session data.');
    }
  };


  const HistoryScreen = () => (
    <View style={styles.historyContainer}>
      <Text style={styles.header}>🏃 Activity History</Text>
      <Text>Display historical data here</Text>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => setIsHistoryScreen(false)}
      >
        <Text style={styles.backButtonText}>Back to Home</Text>
      </TouchableOpacity>
    </View>
  );

 
  return (
    <ScrollView style={styles.container}>
      {isHistoryScreen ? (
        <HistoryScreen />
      ) : (
        <>
          <Text style={styles.header}>🏃 Activity Status</Text>
          <View style={styles.activityCard}>
            <Text style={styles.activityText}>{activity}</Text>
          </View>

          <Text style={styles.header}>📈 Real-Time Session Data</Text>
          <LineChart
            data={{
              labels: sessionData.map((_, i) => `${i + 1}`),
              datasets: [{ data: sessionData }],
            }}
            width={screenWidth - 2 * theme.spacing.medium}
            height={220}
            chartConfig={{
              backgroundColor: theme.colors.background,
              backgroundGradientFrom: theme.colors.card,
              backgroundGradientTo: theme.colors.card,
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: { borderRadius: 16 },
            }}
            bezier
            style={styles.chart}
          />

          <TouchableOpacity style={styles.exportButton} onPress={exportToCSV}>
            <Text style={styles.exportButtonText}>📄 Export Session as CSV</Text>
          </TouchableOpacity>

          <Text style={styles.header}>💊 Medicine Reminders</Text>
          {medicineList.map((item, index) => (
            <MedicineCard key={index} name={item.name} time={item.time} />
          ))}

          <TouchableOpacity
            style={styles.reminderButton}
            onPress={() =>
              ReminderBridge.scheduleReminder(
                'Medicine Time',
                'Take your Paracetamol!',
                Date.now() + 15 * 60 * 1000
              )
            }
          >
            <Text style={styles.reminderButtonText}>⏰ Schedule Reminder</Text>
          </TouchableOpacity>

          {/* Button to view history */}
          <TouchableOpacity
            style={styles.viewHistoryButton}
            onPress={() => setIsHistoryScreen(true)}
          >
            <Text style={styles.viewHistoryButtonText}>📅 View History</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.medium,
    backgroundColor: theme.colors.background,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginTop: theme.spacing.large,
    marginBottom: theme.spacing.small,
  },
  activityCard: {
    backgroundColor: theme.colors.card,
    padding: theme.spacing.medium,
    borderRadius: 10,
    marginBottom: theme.spacing.medium,
    elevation: 3,
  },
  activityText: {
    fontSize: 18,
    color: theme.colors.text,
    fontWeight: '600',
  },
  chart: {
    marginVertical: theme.spacing.medium,
    borderRadius: 16,
  },
  exportButton: {
    marginTop: 10,
    marginBottom: 20,
    padding: 14,
    backgroundColor: theme.colors.secondary,
    borderRadius: 8,
    alignItems: 'center',
  },
  exportButtonText: {
    color: theme.colors.onSecondary,
    fontWeight: 'bold',
    fontSize: 16,
  },
  reminderButton: {
    marginTop: 20,
    padding: 14,
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
    alignItems: 'center',
  },
  reminderButtonText: {
    color: theme.colors.onPrimary,
    fontWeight: 'bold',
    fontSize: 16,
  },
  viewHistoryButton: {
    marginTop: 20,
    padding: 14,
    backgroundColor: theme.colors.tertiary,
    borderRadius: 8,
    alignItems: 'center',
  },
  viewHistoryButtonText: {
    color: theme.colors.onTertiary,
    fontWeight: 'bold',
    fontSize: 16,
  },
  historyContainer: {
    padding: theme.spacing.medium,
    backgroundColor: theme.colors.background,
  },
  backButton: {
    marginTop: 20,
    padding: 14,
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
    alignItems: 'center',
  },
  backButtonText: {
    color: theme.colors.onPrimary,
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default Home;
