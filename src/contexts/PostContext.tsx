import { type AppBskyFeedDefs } from '@atproto/api';
import React, { createContext, useContext, useState } from 'react';

interface PostContextType {
  cachedPost: AppBskyFeedDefs.FeedViewPost | undefined;
  setCachedPost: React.Dispatch<React.SetStateAction<AppBskyFeedDefs.FeedViewPost | undefined>>;
}

const PostContext = createContext<PostContextType | undefined>(undefined);

export const usePost = (): PostContextType => {
  const context = useContext(PostContext);

  if (context == null) {
    throw new Error('usePost must be used within a PostProvider!');
  }
  return context;
}

const PostProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cachedPost, setCachedPost] = useState<AppBskyFeedDefs.FeedViewPost | undefined>(undefined);

  return (
      <PostContext.Provider value={{ cachedPost, setCachedPost }}>
        {children}
      </PostContext.Provider>
  );
}

export default PostProvider;
