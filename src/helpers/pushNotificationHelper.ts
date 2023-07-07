import notifee, { AuthorizationStatus } from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import { setItem } from 'utils/asyncStorage';

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
      const { title, body } = remoteMessage.notification;
      const date = new Date();

      addNotificationToStorage(title, body, date);

      notifee.displayNotification({
        title: title,
        body: body,
        android: {
          channelId: 'default',
          smallIcon: 'ic_stat_name',
        },
      });
    }
  });

  messaging().onMessage(async remoteMessage => {
    console.log('Message received: ', remoteMessage);
    if (remoteMessage.notification) {
      const { title, body } = remoteMessage.notification;
      const date = new Date();

      addNotificationToStorage(title, body, date);

      notifee.displayNotification({
        title: title,
        body: body,
        android: {
          channelId: 'default',
          smallIcon: 'ic_stat_name',
        },
      });
    }
  });
}

const addNotificationToStorage = async (
  title: string | undefined,
  body: string | undefined,
  date: Date,
) => {
  try {
    const notifications = await AsyncStorage.getItem('notifications');
    let notificationsArray = [];

    if (notifications) {
      notificationsArray = JSON.parse(notifications);
    }

    const newNotification = {
      title: title,
      body: body,
      date: date,
    };
    notificationsArray.push(newNotification);
    console.log(notificationsArray);
    await setItem('notifications', JSON.stringify(notificationsArray));
  } catch (error) {
    console.log(error);
  }
};
