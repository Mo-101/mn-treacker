import { toast } from '../components/ui/use-toast';

export const handleFirebaseError = (error) => {
  let message = 'An error occurred. Please try again.';
  
  switch (error.code) {
    case 'permission-denied':
      message = 'You do not have permission to perform this action.';
      break;
    case 'unavailable':
      message = 'Service is temporarily unavailable. Please check your internet connection.';
      break;
    case 'failed-precondition':
      message = 'Operation could not be completed. Please try again.';
      break;
    case 'cancelled':
      message = 'Operation was cancelled.';
      break;
    default:
      if (error.message) {
        message = error.message;
      }
  }

  toast({
    title: "Error",
    description: message,
    variant: "destructive"
  });

  return null;
};

export const isOnline = () => {
  return window.navigator.onLine;
};

export const setupConnectivityListeners = () => {
  window.addEventListener('online', () => {
    toast({
      title: "Connected",
      description: "You are back online",
      variant: "success"
    });
  });

  window.addEventListener('offline', () => {
    toast({
      title: "Disconnected",
      description: "You are offline. Some features may be limited.",
      variant: "warning"
    });
  });
};