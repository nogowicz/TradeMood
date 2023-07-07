import notifee, { AuthorizationStatus } from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';

export async function checkNotificationPermission() {
  const settings = await notifee.getNotificationSettings();

  if (
    settings.authorizationStatus == AuthorizationStatus.AUTHORIZED ||
    settings.authorizationStatus == AuthorizationStatus.PROVISIONAL
  ) {
    console.log('Notification permissions have been authorized');
    getFCMToken();
  } else if (
    settings.authorizationStatus == AuthorizationStatus.DENIED ||
    settings.authorizationStatus == AuthorizationStatus.NOT_DETERMINED
  ) {
    console.log('Notification permissions have been denied');
    await notifee.requestPermission();
  }
}

export async function getFCMToken() {
  const token = await AsyncStorage.getItem('fcmToken');
  console.log('Old FCM Token: ', token);

  if (!token) {
    try {
      const token = await messaging().getToken();
      if (token) {
        console.log('New FCM Token: ', token);
        await AsyncStorage.setItem('fcmToken', token);
      }
    } catch (error) {
      console.log('FCMToken error occurred:', error);
    }
  }
}

export function notificationListener() {
  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log(
      'Notification caused app to open from the background state:',
      remoteMessage,
    );
    if (remoteMessage.notification) {
      notifee.displayNotification({
        title: remoteMessage.notification.title,
        body: remoteMessage.notification.body,
        android: {
          channelId: 'default',
          smallIcon: 'ic_stat_name',
        },
      });
    }
  });

  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log(
          'Notification caused app to open from the quit state:',
          remoteMessage,
        );
      }
    });

  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Background message received: ', remoteMessage);
    // Handle the background message here
  });

  messaging().onMessage(async remoteMessage => {
    console.log('Message received: ', remoteMessage);
    if (remoteMessage.notification) {
      notifee.displayNotification({
        title: remoteMessage.notification.title,
        body: remoteMessage.notification.body,
        android: {
          channelId: 'default',
          smallIcon: 'ic_stat_name',
        },
      });
    }
  });
}
