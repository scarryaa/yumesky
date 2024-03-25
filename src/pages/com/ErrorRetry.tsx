import BasicView from '../../components/BasicView/BasicView'
import { CenteredView } from './util/CenteredView'
import './ErrorRetry.scss';
import PillButton from '../../components/PillButton/PillButton';

interface ErrorRetryProps {
  onRetry: () => void;
  errorText?: string;
}
export const ErrorRetry: React.FC<ErrorRetryProps> = ({ onRetry, errorText }: ErrorRetryProps) => {
  return (
    <BasicView className='error-retry' viewPadding={false}>
        <CenteredView>
            <h2>{errorText ?? 'Sorry, something went wrong.'}</h2>
            <PillButton color='var(--primary)' onClick={onRetry}>Retry?</PillButton>
        </CenteredView>
    </BasicView>
  )
}
