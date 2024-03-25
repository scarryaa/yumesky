import { type CSSProperties } from 'react';
import { LoadingPlaceholder } from './LoadingPlaceholder'

interface LoadingSkeletonTextProps {
  width?: string | number;
  height?: string | number;
  style?: CSSProperties;
}
export const LoadingSkeletonText: React.FC<LoadingSkeletonTextProps> = ({ width, height, style }: LoadingSkeletonTextProps) => {
  return (
    <LoadingPlaceholder width={width ?? '100%'} height={height ?? 20} style={{ borderRadius: 8, ...style }} />
  )
}
