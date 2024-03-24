import './FollowsYou.scss';

const FollowsYou: React.FC<{ className?: string }> = ({ className }: { className?: string }) => {
  return (
    <div className={`follows-you ${className}`}>
        Follows you
    </div>
  )
}

export default FollowsYou;
