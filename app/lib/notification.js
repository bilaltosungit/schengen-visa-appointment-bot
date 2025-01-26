export const playNotification = async () => {
  try {
    const audio = new Audio('/notification.mp3');
    await audio.play();
  } catch (error) {
    console.error('Notification sound could not be played:', error);
  }
}; 