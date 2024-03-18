import { useEffect } from 'react';
import BasicView from '../../components/BasicView/BasicView';
import LargePost from '../../components/LargePost/LargePost';
import Post from '../../components/Post/Post';
import { usePost } from '../../contexts/PostContext';
import useThreadView from '../../hooks/useThreadView';

interface ThreadViewProps {
  setCurrentPage: (pageName: string) => void;
}
const ThreadView: React.FC<ThreadViewProps> = ({ setCurrentPage }: ThreadViewProps) => {
  const { cachedPost } = usePost();
  const { postRef, childPosts, filteredPosts } = useThreadView();

  useEffect(() => {
    setCurrentPage('Post');
  }, []);

  return (
    <BasicView viewPadding={true}>
      {filteredPosts.map((post, i) => (
        <Post post={{ post }} key={i} />
      ))}
      {cachedPost !== undefined && <LargePost ref={postRef} post={cachedPost} />}
      {childPosts.map((post, i) => (
        <Post post={{ post }} key={i} />
      ))}
    </BasicView>
  )
}

export default ThreadView;
