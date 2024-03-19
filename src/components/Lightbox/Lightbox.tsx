import { useLightbox, useLightboxControls } from '../../state/lightbox'
import Image from '../Image/Image';
import './Lightbox.scss';

export const LightboxContainer: React.FC = () => {
  const { isLightboxActive, src, alt } = useLightbox();

  if (!isLightboxActive) return null;

  return (
    <div>
        <Lightbox src={src} alt={alt} />
    </div>
  )
}

export const Lightbox: React.FC<{ src: string | undefined, alt: string | undefined }> = ({ src }: { src: string | undefined, alt: string | undefined }) => {
  const { isLightboxActive, alt } = useLightbox();
  const { closeLightbox } = useLightboxControls();

  if (!isLightboxActive) return null;

  const onMaskClick = (): void => {
    closeLightbox();
  }

  return (
    <div className='lightbox-mask' onClick={onMaskClick}>
        <div className='lightbox-mask-inner'>
            <Image className='lightbox-image' src={src} />
            {(alt !== undefined && alt !== '') && <div className='lightbox-alt-text-container'>
                <span className='lightbox-alt-text'>{alt}</span>
            </div>}
        </div>
    </div>
  )
}
