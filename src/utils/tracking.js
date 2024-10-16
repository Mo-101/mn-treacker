export const initializeTracking = () => {
  if (process.env.NODE_ENV === 'production') {
    // Initialize Sentry or Posthog tracking
    console.log('Initializing tracking in production mode');
    // Add your tracking initialization code here
  } else {
    console.log('Tracking is disabled in development mode.');
  }
};