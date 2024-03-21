import React, { useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useComposer } from '../../hooks/useComposer';
import './Composer.scss';
import { faPencil, faTimes, faX } from '@fortawesome/free-solid-svg-icons';
import ImageElement from '../Image/Image';
import { useProfile } from '../../hooks/useProfile';
import agent from '../../api/agent';
import { type AppBskyFeedPost } from '@atproto/api';

const Composer: React.FC = () => {
  const { composerOpen, closeComposer, post, text, setText, sendPost, setImgs, imgs, removeImg } = useComposer();
  const profile = useProfile(agent.session?.handle);
  const contentRef = useRef<HTMLDivElement | null>(null);

  if (!composerOpen) return null;

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>): void => {
    e.preventDefault();
    const clipboardData = e.clipboardData;
    if (clipboardData !== undefined) {
      const text = clipboardData.getData('text/plain');
      document.execCommand('insertText', false, text);

      const items = clipboardData.items;
      if (items !== undefined) {
        for (let i = 0; i < items.length; i++) {
          if (items[i].type.startsWith('image')) {
            const file = items[i].getAsFile();
            if (file !== null) {
              const reader = new FileReader();
              reader.onload = (event) => {
                if (event.target !== undefined) {
                  const dataURL = event.target?.result as string;

                  // Create an Image object to get image dimensions
                  const imgElement = new Image();
                  imgElement.onload = () => {
                    const width = imgElement.width;
                    const height = imgElement.height;

                    if (imgs.length < 4) {
                      setImgs((prevImgs) => [...prevImgs, { width, height, src: dataURL, alt: '' }]);
                    }
                  };
                  imgElement.src = dataURL;
                }
              };
              reader.readAsDataURL(file);
            }
          }
        }
      }
    }
  };

  const editImg = (i: number): void => {

  }

  const setAltText = (img: number): void => {

  }

  // TODO should redesign this to not use hardcoded heights
  const getComposerStyle = (): { height: string } => {
    if (post !== undefined && imgs.length > 0) {
      return { height: '570px' };
    } else if (post !== undefined && imgs.length === 0) {
      return { height: '420px' };
    } else if (post === undefined && imgs.length > 0) {
      return { height: '440px' };
    } else {
      return { height: '300px' };
    }
  };

  return (
    <div className='composer-container'>
      <div className='composer' style={getComposerStyle()}>
        <div className='composer-actions' onClick={() => { closeComposer(); }}>
          <FontAwesomeIcon icon={faTimes} fontSize={18} color='var(--text)' />
          <button className='no-button-style composer-reply-button' onClick={() => { sendPost(); }}>
            {post !== undefined ? 'Reply' : 'Post'}
          </button>
        </div>
        <div className='composer-reply-post-container'>
          {post !== undefined && (
            <div className='composer-reply-post'>
              <ImageElement className='composer-avatar' src={post?.post.author.avatar} />
              <div className='composer-reply-post-text'>
                <span className='composer-username'>{post?.post.author.displayName}</span>
                <span className='composer-reply-text'>{(post?.post.record as AppBskyFeedPost.Record)?.text}</span>
              </div>
            </div>
          )}
        </div>
        <div className='composer-reply-area'>
          <ImageElement className='composer-avatar' src={profile?.avatar} />
          <div
            autoFocus
            className='composer-content-area'
            contentEditable="true"
            translate="no"
            tabIndex={0}
            ref={contentRef}
            onInput={() => { setText(contentRef.current?.textContent ?? ''); }}
            onPaste={(e) => { handlePaste(e); }}
          ></div>
          {(text === '' && imgs.length <= 0) && <p className='composer-placeholder'>Write your {post !== undefined ? 'reply' : 'post'}</p>}
          <div className='composer-uploaded-img-container'>
                {imgs.map((img, i) => (
                    <div className='composer-uploaded-img-overlay-container' key={`${img.src}_${i}`}>
                        <div className='composer-uploaded-img-overlay'>
                            <div className='composer-uploaded-img-overlay-content'>
                                <button className='no-button-style composer-alt-img-button' onClick={() => { setAltText(i); }}>
                                    ALT
                                </button>
                                <div className='composer-edit-delete-img-container'>
                                    <button className='no-button-style composer-edit-img-button' onClick={() => { editImg(i); }}>
                                        <FontAwesomeIcon icon={faPencil} fontSize={12} color='var(--white)' />
                                    </button>
                                    <button className='no-button-style composer-delete-img-button' onClick={() => { removeImg(i); }}>
                                        <FontAwesomeIcon icon={faX} fontSize={12} color='var(--white)' />
                                    </button>
                                </div>
                            </div>
                            <ImageElement className='composer-uploaded-img' src={img.src} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}

export default Composer;
