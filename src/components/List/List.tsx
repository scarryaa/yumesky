import { type AppBskyGraphDefs } from '@atproto/api';
import './List.scss';
import Link from '../Link/Link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import RichText from '../RichText/RichText';
import { RichText as RichTextAPI } from '@atproto/api';

const ListIcon: React.FC = () => {
  return (
    <div className='list-icon'>
        <FontAwesomeIcon icon={faUsers} fontSize={16} />
    </div>
  )
}

interface ListProps {
  list: AppBskyGraphDefs.ListView;
}
const List: React.FC<ListProps> = ({ list }: ListProps) => {
  const listId = list.uri.split('/')[4];
  const listPurpose = list.purpose === 'app.bsky.graph.defs#curatelist' ? 'User' : 'Moderation';
  const rt = new RichTextAPI({ text: list.description ?? '', facets: list?.descriptionFacets });

  return (
    <Link linkStyle={false} className='list' to={`/profile/${list.creator.handle}/lists/${listId}`}>
        <div className='list-shell'>
            {list.avatar === undefined ? <ListIcon /> : <img className='list-avatar' src={list.avatar} />}
            <div className='list-inner'>
                <span className='list-name'>{list.name}</span>
                <span className='list-purpose'>{listPurpose} list by <Link linkStyle={true} to={`/profile/${list.creator.handle}`}>@{list.creator.handle}</Link></span>
            </div>
        </div>
        {(list.description !== '') && <div className='list-description'>
            <RichText value={rt} />
        </div>}
    </Link>
  )
}

export default List;
