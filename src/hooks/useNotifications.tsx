import { useEffect, useState } from 'react';
import agent from '../api/agent';
import { type AppBskyFeedLike, type AppBskyFeedDefs, type AppBskyNotificationListNotifications } from '@atproto/api';

export const useNotifications = (): {
  notifPosts: AppBskyFeedDefs.PostView[];
  setNotifPosts: React.Dispatch<React.SetStateAction<AppBskyFeedDefs.PostView[]>>;
  notifications: AppBskyNotificationListNotifications.Notification[];
  setNotifications: React.Dispatch<React.SetStateAction<AppBskyNotificationListNotifications.Notification[]>>;
} => {
  const [notifications, setNotifications] = useState<AppBskyNotificationListNotifications.Notification[]>([]);
  const [notifPosts, setNotifPosts] = useState<AppBskyFeedDefs.PostView[]>([]);

  useEffect(() => {
    const getNotificationsAndPosts = async (): Promise<void> => {
      try {
        const notificationRes = await agent.app.bsky.notification.listNotifications({});
        if (notificationRes.success) {
          setNotifications(notificationRes.data.notifications);
          const notificationUris = notificationRes.data.notifications.map((notif => (notif.record as AppBskyFeedLike.Record)?.subject?.uri ?? notif.uri));
          const batchSize = 25;
          const numBatches = Math.ceil(notificationUris.length / batchSize);
          for (let i = 0; i < numBatches; i++) {
            const startIndex = i * batchSize;
            const endIndex = Math.min(startIndex + batchSize, notificationUris.length);
            const batchUris = notificationUris.slice(startIndex, endIndex);
            const postsRes = await agent.app.bsky.feed.getPosts({ uris: batchUris });
            if (postsRes.success) {
              setNotifPosts(prevNotifPosts => [...prevNotifPosts, ...postsRes.data.posts]);
            } else {
              console.error(`Failed to fetch posts for batch: ${batchUris.join(', ')}`);
            }
          }
        } else {
          console.error('Failed to fetch notifications');
        }
      } catch (error) {
        console.error('Error fetching notifications and posts:', error);
      }
    };

    void getNotificationsAndPosts();
  }, []);

  return { notifications, setNotifications, notifPosts, setNotifPosts };
};
