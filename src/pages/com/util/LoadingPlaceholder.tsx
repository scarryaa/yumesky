import { type CSSProperties } from 'react';
import './LoadingPlaceholder.scss';

interface LoadingPlaceholderProps {
  width: string | number;
  height: string | number;
  style: CSSProperties
}
export const LoadingPlaceholder: React.FC<LoadingPlaceholderProps> = ({ width, height, style }: LoadingPlaceholderProps) => {
  return (
    <div style={{ ...style, width, height }} className='loading-placeholder' />
  )
}
