import { type AppBskyFeedPost, type AppBskyFeedDefs } from '@atproto/api';
import { createContext, useContext, useEffect, useState } from 'react';
import agent from '../api/agent';
import { type Image as ATProtoImage } from '@atproto/api/dist/client/types/app/bsky/embed/images';
import { convertDataURIToUint8Array } from '../utils';

export interface UploadedImage {
  src: string;
  width: number;
  height: number;
  alt: string;
}

interface ComposerContext {
  composerOpen: boolean;
  closeComposer: () => void;
  openComposer: (post: AppBskyFeedDefs.FeedViewPost | undefined) => void;
  post: AppBskyFeedDefs.FeedViewPost | undefined;
  text: string;
  imgs: UploadedImage[];
  setText: React.Dispatch<React.SetStateAction<string>>
  sendPost: () => void;
  setLangs: React.Dispatch<React.SetStateAction<string[]>>;
  setRoot: React.Dispatch<React.SetStateAction<{ cid: string, uri: string } | undefined>>;
  setParent: React.Dispatch<React.SetStateAction<{ cid: string, uri: string } | undefined>>;
  setImgs: React.Dispatch<React.SetStateAction<UploadedImage[]>>;
  removeImg: (index: number) => void;
}

const composerContext = createContext<ComposerContext>({
  composerOpen: false,
  closeComposer: () => {},
  openComposer: (post: AppBskyFeedDefs.FeedViewPost | undefined) => {},
  post: undefined,
  text: '',
  imgs: [],
  setText: () => {},
  sendPost: () => {},
  setLangs: () => {},
  setRoot: () => {},
  setParent: () => {},
  setImgs: () => {},
  removeImg: () => {}
});

export const Provider = ({ children }: React.PropsWithChildren<Record<string, unknown>>): JSX.Element => {
  const [composerOpen, setComposerOpen] = useState<boolean>(false);
  const [post, setPost] = useState<AppBskyFeedDefs.FeedViewPost | undefined>();
  const [text, setText] = useState<string>('');
  const [langs, setLangs] = useState<string[]>(['en']);
  const [root, setRoot] = useState<{ cid: string, uri: string }>();
  const [parent, setParent] = useState<{ cid: string, uri: string }>();
  const [imgs, setImgs] = useState<UploadedImage[]>([]);

  const handleEmbed = async (): Promise<{ images: ATProtoImage[] }> => {
    const imagePromises = imgs.map(async (img) => {
      const { data } = await agent.uploadBlob(convertDataURIToUint8Array(img.src), {
        encoding: 'image/jpeg'
      });

      return {
        alt: img.alt,
        image: data.blob,
        aspectRatio: {
          width: img.width,
          height: img.height
        }
      };
    });

    const images = await Promise.all(imagePromises);

    return { images };
  };

  const sendPost = async (): Promise<void> => {
    const { images } = await handleEmbed();
    await agent.post({
      text,
      createdAt: new Date().toISOString(),
      langs,
      reply: parent !== undefined && root !== undefined ? { parent, root } : undefined,
      embed: { $type: images.length > 0 ? 'app.bsky.embed.images' : '', images }
    });
  };

  const removeImg = (index: number): void => {
    setImgs((prevImgs) => prevImgs.filter((_, i) => i !== index));
  };

  useEffect(() => {
    if (composerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [composerOpen]);

  const contextValue: ComposerContext = {
    composerOpen,
    openComposer: (post: AppBskyFeedDefs.FeedViewPost | undefined) => {
      console.log(post);
      setComposerOpen(true); setPost(post);

      if (post === undefined) {
        setParent(undefined);
        setRoot(undefined);
      } else if (post?.post.cid !== undefined && post?.post.uri !== undefined) {
        setParent({ cid: post?.post.cid, uri: post?.post.uri });
        setRoot({ cid: (post?.post.record as AppBskyFeedPost.Record)?.reply?.root.cid ?? post?.post.cid, uri: (post?.post.record as AppBskyFeedPost.Record)?.reply?.root.uri ?? post?.post.uri });
      }
    },
    closeComposer: () => {
      setComposerOpen(false);
      setPost(undefined);
      setText('');
      setImgs([])
    },
    post,
    text,
    imgs,
    setText,
    sendPost,
    setLangs,
    setRoot,
    setParent,
    setImgs,
    removeImg
  };

  return (
    <composerContext.Provider value={contextValue}>
      {children}
    </composerContext.Provider>
  );
};

export const useComposer = (): ComposerContext => {
  return useContext(composerContext);
}
