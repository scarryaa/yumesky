import { type AppBskyActorDefs, type AppBskyFeedDefs } from '@atproto/api';
import getConfig from './config';

export const ago = (date: number | string | Date): string => {
  let ts: number;

  if (typeof date === 'string') {
    ts = Number(new Date(date));
  } else if (date instanceof Date) {
    ts = date.getTime();
  } else {
    ts = date;
  }

  const now = Date.now();
  const diff = now - ts;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);

  if (months > 0) {
    return `${months}mo`;
  } else if (days > 0) {
    return `${days}d`;
  } else if (hours > 0) {
    return `${hours}h`;
  } else if (minutes > 0) {
    return `${minutes}m`;
  } else {
    return `${seconds}s`;
  }
};

export const agoLong = (date: number | string | Date): string => {
  let ts: number;

  if (typeof date === 'string') {
    ts = Number(new Date(date));
  } else if (date instanceof Date) {
    ts = date.getTime();
  } else {
    ts = date;
  }

  const newDate = new Date(ts);
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = monthNames[newDate.getMonth()];
  const day = newDate.getDate();
  const year = newDate.getFullYear();
  let hour = newDate.getHours();
  const minute = newDate.getMinutes();
  const ampm = hour >= 12 ? 'PM' : 'AM';

  hour = hour % 12;
  hour = hour ?? 12;

  return `${month} ${day}, ${year} at ${hour}:${minute.toString().padStart(2, '0')} ${ampm}`;
};

export const convertStringArrayToGeneratorViewArray = (stringArray: string[], generatorArray?: string[]): AppBskyFeedDefs.GeneratorView[] => {
  if (generatorArray == null) {
    return stringArray.map(str => ({ displayName: str, uri: '', cid: '', indexedAt: '', did: '', creator: { did: '', handle: '' } }));
  }

  return stringArray.map((str, index) => ({
    displayName: str,
    uri: '',
    cid: '',
    indexedAt: '',
    did: generatorArray[index],
    creator: { did: '', handle: '' }
  }));
};

export const getPostId = (post: AppBskyFeedDefs.FeedViewPost): string => {
  return post.post.uri.split('/')[4];
}

export const generatePostShareLink = (post: AppBskyFeedDefs.FeedViewPost | undefined): string => {
  if (post === undefined) return '';
  return `${getConfig().DOMAIN}/profile/${post.post.author.handle}/post/${getPostId(post)}`;
}

export const generateProfileShareLink = (profile: AppBskyActorDefs.ProfileView | undefined): string => {
  if (profile === undefined) throw new Error('Profile is undefined');
  return `${getConfig().DOMAIN}/profile/${profile.handle}`;
}

export const stripFormatting = (text: string): string => {
  return text.replace(/<[^>]+>/g, '');
};

export const convertDataURIToUint8Array = (dataURI: string): Uint8Array => {
  const base64String = dataURI.split(',')[1];
  const byteCharacters = atob(base64String);
  const byteNumbers = new Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  return new Uint8Array(byteNumbers);
}
