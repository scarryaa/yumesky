import { useNotificationCount } from '../../hooks/useNotificationCount';
import './NotificationBubble.scss';

const NotificationBubble: React.FC = () => {
  const { notificationCount } = useNotificationCount();

  if (notificationCount === 0) return null;

  return (
    <div className="notification-bubble-container">
        <div className="notification-bubble">
            {notificationCount}
        </div>
    </div>
  )
}

export default NotificationBubble;
