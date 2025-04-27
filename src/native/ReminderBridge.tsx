import { NativeModules } from 'react-native';

const { ReminderModule } = NativeModules;

if (!ReminderModule) {
  console.error('ReminderModule is not available!');
}

const ReminderBridge = {
  scheduleReminder: (title: string, message: string, time: number) => {
    if (ReminderModule) {
      ReminderModule.scheduleReminder(title, message, time);
    } else {
      console.error('ReminderModule is null, cannot schedule reminder.');
    }
  },
  cancelAllReminders: () => {
    if (ReminderModule) {
      ReminderModule.cancelAllReminders();
    }
  },
};

export default ReminderBridge;
