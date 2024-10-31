import { getMessaging, getToken } from 'firebase/messaging';
import { app } from '../config/firebase';
import { toast } from '../components/ui/use-toast';

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY;
const PROJECT_ID = import.meta.env.VITE_FIREBASE_PROJECT_ID;
const FCM_ENDPOINT = `https://fcm.googleapis.com/v1/projects/${PROJECT_ID}/messages:send`;

export const initializeFCM = async () => {
  try {
    const messaging = getMessaging(app);
    const currentToken = await getToken(messaging, { vapidKey: VAPID_KEY });
    
    if (currentToken) {
      console.log('FCM token:', currentToken);
      return currentToken;
    } else {
      console.log('No registration token available');
      return null;
    }
  } catch (error) {
    console.error('Error initializing FCM:', error);
    toast({
      title: "FCM Error",
      description: "Failed to initialize push notifications",
      variant: "destructive",
    });
    return null;
  }
};

export const sendFCMMessage = async (message) => {
  try {
    const accessToken = await getAccessToken();
    
    const response = await fetch(FCM_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: {
          notification: {
            title: message.title,
            body: message.body,
          },
          data: message.data,
          token: message.token, // for single device
          // topic: message.topic, // for topic messaging
          android: {
            notification: {
              clickAction: 'OPEN_ACTIVITY',
            }
          },
          apns: {
            payload: {
              aps: {
                category: 'NEW_MESSAGE_CATEGORY',
              }
            }
          },
          webpush: {
            notification: {
              icon: '/favicon.ico',
            }
          }
        }
      })
    });

    if (!response.ok) {
      throw new Error(`FCM send failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending FCM message:', error);
    toast({
      title: "Message Error",
      description: "Failed to send push notification",
      variant: "destructive",
    });
    throw error;
  }
};

const getAccessToken = async () => {
  try {
    const response = await fetch('/api/fcm-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to get FCM access token');
    }
    
    const { accessToken } = await response.json();
    return accessToken;
  } catch (error) {
    console.error('Error getting access token:', error);
    throw error;
  }
};