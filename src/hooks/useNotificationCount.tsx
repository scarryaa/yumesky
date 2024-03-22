import { useState, useEffect } from 'react';
import agent from '../api/agent';

export const useNotificationCount = (): { notificationCount: number, setNotificationCount: React.Dispatch<React.SetStateAction<number>> } => {
  const [notificationCount, setNotificationCount] = useState<number>(0);

  const fetchNotificationCount = async (): Promise<void> => {
    try {
      const response = await agent.api.app.bsky.notification.getUnreadCount();

      if (response.success) {
        setNotificationCount(response.data.count);
      }
    } catch (error) {
      console.error('Error fetching notification count:', error);
    }
  };

  useEffect(() => {
    void fetchNotificationCount();
    const intervalId = setInterval(fetchNotificationCount, 60000); // 60 seconds

    return () => { clearInterval(intervalId) };
  }, []);

  return { notificationCount, setNotificationCount };
};
