import { type AppBskyNotificationListNotifications } from '@atproto/api';
import './Notification.scss';

interface NotificationProps {
  notification: AppBskyNotificationListNotifications.Notification;
}
const Notification: React.FC<NotificationProps> = ({ notification }: NotificationProps) => {
  switch (notification.reason) {
    case 'like':
      return <LikeNotification notification={notification} />
    case 'follow':
      return <FollowNotification notification={notification} />
    case 'mention':
      return <MentionNotification notification={notification} />
    case 'quote':
      return <QuoteNotification notification={notification} />
    case 'reply':
      return <ReplyNotification notification={notification} />
    case 'repost':
      return <RepostNotification notification={notification} />
    default:
      return null;
  }
}

const RepostNotification: React.FC<NotificationProps> = ({ notification }: NotificationProps) => {
  return (
    <NotificationShell>
        <div>repost</div>
    </NotificationShell>
  )
}

const ReplyNotification: React.FC<NotificationProps> = ({ notification }: NotificationProps) => {
  return (
    <NotificationShell>
        <div>reply</div>
    </NotificationShell>
  )
}

const QuoteNotification: React.FC<NotificationProps> = ({ notification }: NotificationProps) => {
  return (
    <NotificationShell>
        <div>quote</div>
    </NotificationShell>
  )
}

const LikeNotification: React.FC<NotificationProps> = ({ notification }: NotificationProps) => {
  return (
    <NotificationShell>
        <div>
            <span>{notification.author.displayName}</span>
        </div>
    </NotificationShell>
  )
}

const FollowNotification: React.FC<NotificationProps> = ({ notification }: NotificationProps) => {
  return (
    <NotificationShell>
        <div>follow</div>
    </NotificationShell>
  )
}

const MentionNotification: React.FC<NotificationProps> = ({ notification }: NotificationProps) => {
  return (
    <NotificationShell>
        <div>mention</div>
    </NotificationShell>
  )
}

const NotificationShell: React.FC<{ children: React.ReactNode }> = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='notification'>
        {children}
    </div>
  )
}

export default Notification;
