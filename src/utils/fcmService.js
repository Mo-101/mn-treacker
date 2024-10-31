import { getMessaging, getToken } from 'firebase/messaging';
import { app } from '../config/firebase';
import { toast } from '../components/ui/use-toast';
import axios from 'axios';

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY;
const PROJECT_ID = import.meta.env.VITE_FIREBASE_PROJECT_ID;
const FCM_ENDPOINT = `https://fcm.googleapis.com/v1/projects/${PROJECT_ID}/messages:send`;
const MAX_RETRIES = 3;

export const initializeFCM = async () => {
  try {
    const messaging = getMessaging(app);
    const currentToken = await getToken(messaging, { vapidKey: VAPID_KEY });
    
    if (currentToken) {
      console.log('FCM token:', currentToken);
      return currentToken;
    } else {
      toast({
        title: "FCM Warning",
        description: "No registration token available. Push notifications may not work.",
        variant: "warning",
      });
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

export const sendFCMMessage = async (message, retryCount = 0) => {
  try {
    const accessToken = await getAccessToken();
    
    const response = await axios.post(FCM_ENDPOINT, {
      message: {
        notification: {
          title: message.title,
          body: message.body,
        },
        data: message.data,
        token: message.token,
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
    }, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      }
    });

    toast({
      title: "Success",
      description: "Push notification sent successfully",
    });

    return response.data;
  } catch (error) {
    console.error('Error sending FCM message:', error);
    
    if (retryCount < MAX_RETRIES && error.response?.status >= 500) {
      // Retry on server errors
      await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
      return sendFCMMessage(message, retryCount + 1);
    }

    toast({
      title: "Message Error",
      description: error.response?.data?.error || "Failed to send push notification",
      variant: "destructive",
    });
    throw error;
  }
};

const getAccessToken = async () => {
  try {
    const response = await axios.post('/api/fcm-token');
    return response.data.accessToken;
  } catch (error) {
    console.error('Error getting access token:', error);
    toast({
      title: "Authentication Error",
      description: "Failed to get access token for FCM",
      variant: "destructive",
    });
    throw error;
  }
};