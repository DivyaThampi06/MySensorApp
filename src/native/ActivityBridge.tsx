import { NativeModules, NativeEventEmitter } from 'react-native';

const { ActivityBridge } = NativeModules;

export const ActivityEventEmitter = new NativeEventEmitter(ActivityBridge);

const safeActivityBridge = ActivityBridge || {};

export default {
  startTracking: () => {
    if (safeActivityBridge.startTracking) {
      safeActivityBridge.startTracking();
    } else {
      console.warn('ActivityBridge.startTracking not available');
    }
  },
  stopTracking: () => {
    if (safeActivityBridge.stopTracking) {
      safeActivityBridge.stopTracking();
    }
  },
  getCurrentActivity: (callback: (activity: string) => void) => {
    if (safeActivityBridge.getCurrentActivity) {
      safeActivityBridge.getCurrentActivity(callback);
    }
  },
};
