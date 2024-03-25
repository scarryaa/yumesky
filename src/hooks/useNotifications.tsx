import { useEffect, useState } from 'react';
import agent from '../api/agent';
import { type AppBskyFeedLike, type AppBskyFeedDefs, type AppBskyNotificationListNotifications } from '@atproto/api';

const batchSize = 25;

export const useNotifications = (): {
  notifPosts: AppBskyFeedDefs.PostView[];
  setNotifPosts: React.Dispatch<React.SetStateAction<AppBskyFeedDefs.PostView[]>>;
  notifications: AppBskyNotificationListNotifications.Notification[];
  setNotifications: React.Dispatch<React.SetStateAction<AppBskyNotificationListNotifications.Notification[]>>;
  loadMore: boolean;
  setLoadMore: React.Dispatch<React.SetStateAction<boolean>>;
} => {
  const [notifications, setNotifications] = useState<AppBskyNotificationListNotifications.Notification[]>([]);
  const [notifPosts, setNotifPosts] = useState<AppBskyFeedDefs.PostView[]>([]);
  const [loadMore, setLoadMore] = useState<boolean>(false);
  const [cursor, setCursor] = useState<string>();

  useEffect(() => {
    const getMoreNotifications = async (): Promise<void> => {
      try {
        const notificationRes = await agent.app.bsky.notification.listNotifications({ cursor, limit: batchSize });
        if (notificationRes.success) {
          setNotifications(prevNotifications => [...prevNotifications, ...notificationRes.data.notifications]);
          setCursor(notificationRes.data.cursor);

          // Fetch posts for the newly fetched notifications
          const notificationUris = notificationRes.data.notifications.map((notif => (notif.record as AppBskyFeedLike.Record)?.subject?.uri ?? notif.uri));
          const postsRes = await agent.app.bsky.feed.getPosts({ uris: notificationUris });
          if (postsRes.success) {
            setNotifPosts(prevNotifPosts => [...prevNotifPosts, ...postsRes.data.posts]);
          } else {
            console.error(`Failed to fetch posts for notifications: ${notificationUris.join(', ')}`);
          }
        } else {
          console.error('Failed to fetch more notifications');
        }
      } catch (error) {
        console.error('Error fetching more notifications:', error);
      }
    };

    if (loadMore) {
      void getMoreNotifications();
      setLoadMore(false);
    }
  }, [loadMore]);

  useEffect(() => {
    const getNotificationsAndPosts = async (): Promise<void> => {
      try {
        const notificationRes = await agent.app.bsky.notification.listNotifications({});
        if (notificationRes.success) {
          setNotifications(notificationRes.data.notifications);
          const notificationUris = notificationRes.data.notifications.map((notif => (notif.record as AppBskyFeedLike.Record)?.subject?.uri ?? notif.uri));
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

          setCursor(notificationRes.data.cursor);
        } else {
          console.error('Failed to fetch notifications');
        }
      } catch (error) {
        console.error('Error fetching notifications and posts:', error);
      }
    };

    void getNotificationsAndPosts();
  }, []);

  return { notifications, setNotifications, notifPosts, setNotifPosts, loadMore, setLoadMore };
};
