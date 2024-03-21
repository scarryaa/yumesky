import { faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useComposer } from '../../hooks/useComposer';
import './ComposeButton.scss';

const ComposeButton: React.FC = () => {
  const { openComposer } = useComposer();

  return (
    <div className='compose-button-container'>
        <button className='no-button-style compose-button' onClick={() => { openComposer(undefined); }}>
            <FontAwesomeIcon icon={faPenToSquare} fontSize={24} />
        </button>
    </div>
  )
}

export default ComposeButton;
