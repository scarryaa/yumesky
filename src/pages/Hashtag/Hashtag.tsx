import { useEffect } from 'react';
import BasicView from '../../components/BasicView/BasicView';
import { useParams } from 'react-router-dom';
import { useHashtag } from '../../hooks/useHashtag';
import Post from '../../components/Post/Post';

interface HashtagProps {
  setCurrentPage: (pageName: string) => void;
}
const Hashtag: React.FC<HashtagProps> = ({ setCurrentPage }: HashtagProps) => {
  const { hashtag } = useParams();
  const posts = useHashtag(hashtag);

  useEffect(() => {
    setCurrentPage(`#${hashtag}` ?? 'Hashtag');
  })

  return (
    <BasicView viewPadding={false} padding={false}>
        {posts?.map((post, i) => (
          <Post post={{ post }} key={i} />
        ))}
    </BasicView>
  )
}

export default Hashtag;
