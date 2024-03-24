import { useEffect, useRef } from 'react';
import BasicView from '../../components/BasicView/BasicView';
import { useGenerators } from '../../hooks/useGenerators';
import Image from '../../components/Image/Image';
import './Feeds.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHashtag, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import LargeFeed from '../../components/LargeFeed/LargeFeed';
import Link from '../../components/Link/Link';

interface FeedsProps {
  setCurrentPage: (pageName: string) => void;
}

const Feeds: React.FC<FeedsProps> = ({ setCurrentPage }: FeedsProps) => {
  const { myGenerators, discoveryGenerators, setLoadMore } = useGenerators();
  const filteredFeedName = 'Following';
  const bottomBoundaryRef = useRef<HTMLDivElement>(null);
  const isHandlingScroll = useRef(false);

  useEffect(() => {
    setCurrentPage('Feeds');
  });

  const handleScroll = async (): Promise<void> => {
    if (bottomBoundaryRef.current === null || isHandlingScroll.current) return;
    isHandlingScroll.current = true;

    const bottomBoundary = bottomBoundaryRef.current.getBoundingClientRect().top - window.innerHeight;
    if (bottomBoundary < 0 || (bottomBoundary < 300 && bottomBoundary > 0)) {
      setLoadMore(true);
    }

    setTimeout(() => {
      isHandlingScroll.current = false;
    }, 500);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const filteredDiscoveryGenerators = discoveryGenerators?.filter(
    (generator) => myGenerators?.find((g) => g.cid === generator.cid) == null
  );

  return (
    <BasicView className='feeds' padding={false} viewPadding={false}>
      <div className='feeds-my-feeds'>
        <div className='feeds-my-feeds-logo'>
          <FontAwesomeIcon icon={faHashtag} fontSize={22} />
        </div>
        <div className='feeds-my-feeds-container'>
          <span className='feeds-my-feeds-name'>My Feeds</span>
          <span className='feeds-my-feeds-tagline'>All your feeds, in one place.</span>
        </div>
      </div>
        {myGenerators?.filter(f => f.displayName !== filteredFeedName).map((generator, i) => (
          <Link linkStyle={false} to={`/profile/${generator.creator.handle}/feed/${generator.uri.split('/')[4]}`} className='feeds-feed' key={`${generator.cid}_${i}`}>
            <Image className='feeds-feed-avatar' src={generator.avatar} />
            <span className='feeds-feed-display-name'>{generator.displayName}</span>
          </Link>
        ))}
        <div className='feeds-new-feeds'>
          <div className='feeds-new-feeds-logo'>
            <FontAwesomeIcon icon={faMagnifyingGlass} fontSize={22} />
          </div>
          <div className='feeds-new-feeds-container'>
            <span className='feeds-new-feeds-name'>Discover New Feeds</span>
            <span className='feeds-new-feeds-tagline'>Custom feeds, built by the community.</span>
          </div>
        </div>
        {filteredDiscoveryGenerators?.map((generator, i) => (
          <LargeFeed feed={generator} key={`${generator.cid}_${i}`} />
        ))}
        <div className='bottom-boundary-ref' ref={bottomBoundaryRef} />
    </BasicView>
  )
};

export default Feeds;
