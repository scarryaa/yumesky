import { type AppBskyFeedDefs, AppBskyFeedPost } from '@atproto/api';
import './Post.scss';
import Link from './Link';

interface PostProps {
  post: AppBskyFeedDefs.FeedViewPost;
}

const PostInfo: React.FC<PostProps> = ({ post }: PostProps) => {
  return (
      <div className='post-info'>
        <img className='post-avatar' src={post.post.author.avatar} />
        <div className='post-info-inner'>
            <span className='post-display-name'>{post.post.author.displayName}</span>
            &nbsp;
            <span className='post-handle'>@{post.post.author.handle}</span>
        </div>
        <div className='post-content'>
            {AppBskyFeedPost.isRecord(post.post.record) ? post.post.record.text : null}
        </div>
    </div>
  )
}

const Post: React.FC<PostProps> = ({ post }: PostProps) => {
  return (
    <Link linkStyle={false} to={`/profile/${post.post.author.handle}/post/${post.post.uri.split('/')[4]}`} className='post'>
        <PostInfo post={post} />
    </Link>
  )
}

export default Post;
