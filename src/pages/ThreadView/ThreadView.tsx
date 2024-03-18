import BasicView from '../../components/BasicView/BasicView';
import LargePost from '../../components/LargePost/LargePost';
import Post from '../../components/Post/Post';
import useThreadView from '../../hooks/useThreadView';

interface ThreadViewProps {
  setCurrentPage: (pageName: string) => void;
}
const ThreadView: React.FC<ThreadViewProps> = ({ setCurrentPage }: ThreadViewProps) => {
  const { filteredPosts, currentPost, childPosts, currentPostRef } = useThreadView(setCurrentPage)

  return (
    <BasicView viewPadding={true}>
      {filteredPosts.map((post, index) => (
          <Post key={index} post={{ post }} />
      ))}
      <div ref={currentPostRef}>
          {(currentPost != null) && <LargePost post={{ post: currentPost }} />}
      </div>
      {childPosts.map((post, index) => (
          <Post key={index} post={{ post }} />
      ))}
    </BasicView>
  )
}

export default ThreadView;
