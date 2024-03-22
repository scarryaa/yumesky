import React, { type ChangeEvent, useRef, type KeyboardEvent, type MouseEvent, useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useComposer } from '../../hooks/useComposer';
import './Composer.scss';
import { faImage, faPencil, faSmile, faTimes, faX } from '@fortawesome/free-solid-svg-icons';
import ImageElement from '../Image/Image';
import { useProfile } from '../../hooks/useProfile';
import agent from '../../api/agent';
import { type AppBskyFeedPost } from '@atproto/api';
import { usePromptControls } from '../../state/prompts';
import { DeleteDraftPrompt } from '../Prompt/delete-draft/Prompt';
import Picker from '@emoji-mart/react'
import data from '@emoji-mart/data'

const Composer: React.FC = () => {
  const { emojiPickerOpen, setEmojiPickerOpen, composerOpen, closeComposer, post, text, setText, sendPost, setImgs, imgs, removeImg } = useComposer();
  const { openPrompt } = usePromptControls();
  const profile = useProfile(agent.session?.handle);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [pickerPosition, setPickerPosition] = useState<{ top: number; left: number, bottom: number }>({ top: 0, left: 0, bottom: 0 });

  useEffect(() => {
    const updatePickerPosition = (): void => {
      if (composerOpen && (contentRef.current != null)) {
        const composerRect = contentRef.current.getBoundingClientRect();
        const pickerHeight = (document.querySelector('.composer-emoji-picker')?.clientHeight) ?? 0;

        setPickerPosition({
          top: composerRect.bottom - 22,
          left: composerRect.left + 15,
          bottom: window.innerHeight - composerRect.bottom - pickerHeight
        });
      }
    };

    updatePickerPosition();
    window.addEventListener('resize', updatePickerPosition);
    return () => {
      window.removeEventListener('resize', updatePickerPosition);
    };
  }, [composerOpen]);

  if (!composerOpen) return null;

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
    if (event.key === 'Escape') {
      if ((text !== undefined && text !== '') || imgs.length > 0) {
        event.preventDefault();
        event.stopPropagation();
        openPrompt(DeleteDraftPrompt);
      } else {
        closeComposer();
      }
    }
  };

  const handleEmojiSelect = (emoji: string, event: MouseEvent<HTMLDivElement>): void => {
    if (contentRef.current != null) {
      contentRef.current.focus();
      document.execCommand('insertText', false, emoji);

      if (!event.shiftKey) {
        setEmojiPickerOpen(false);
      }
    }
  };

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

  const handleImageInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files !== undefined && (e.target.files?.length ?? 0) > 0) {
      const file = e.target.files?.[0] as Blob;
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
  };

  const handleImageClick = (): void => {
    if (fileInputRef.current != null) {
      fileInputRef.current.click();
    }
  };

  const editImg = (i: number): void => {

  }

  const setAltText = (img: number): void => {

  }

  const onTextInput = (e: React.FormEvent<HTMLDivElement>): void => {
    setText(contentRef.current?.textContent ?? '');
  }

  // TODO should redesign this to not use hardcoded heights
  const getComposerStyle = (): { height: string } => {
    if (post !== undefined && imgs.length > 0) {
      return { height: '540px' };
    } else if (post !== undefined && imgs.length === 0) {
      return { height: '410px' };
    } else if (post === undefined && imgs.length > 0) {
      return { height: '480px' };
    } else {
      return { height: '340px' };
    }
  };

  return (
    <div className='composer-container'>
      <div className='composer' style={getComposerStyle()}>
        <div className='composer-actions'>
            <button className='no-button-style composer-close-button' onClick={() => { closeComposer(); }}>
                <FontAwesomeIcon icon={faTimes} fontSize={18} color='var(--text)' />
            </button>
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
            onKeyDown={(e) => { handleKeyDown(e); }}
            onInput={(e) => { onTextInput(e); }}
            onPaste={(e) => { handlePaste(e); }}
            />
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
            <div className='composer-bottom-actions'>
                <button className='no-button-style' onClick={handleImageClick}>
                    <FontAwesomeIcon icon={faImage} fontSize={18} color='var(--white)' />
                </button>
                <input
                    id="fileInput"
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageInputChange}
                    accept="image/*"
                    style={{ display: 'none' }}
                />
                <button className='no-button-style' onClick={() => { setEmojiPickerOpen(v => !v) }}>
                    <FontAwesomeIcon icon={faSmile} fontSize={18} color='var(--white)' />
                </button>
            </div>
        </div>
      </div>
    {emojiPickerOpen &&
        <div className='composer-emoji-picker-mask' onClick={() => { setEmojiPickerOpen(false); }}>
            <div className='composer-emoji-picker-relative' style={{ top: pickerPosition.top, left: pickerPosition.left }}>
                <div className='composer-emoji-picker'>
                    <Picker data={data} onEmojiSelect={(emoji: any, event: MouseEvent<HTMLDivElement>) => { handleEmojiSelect(emoji.native as string, event); event.stopPropagation(); }} />
                </div>
            </div>
        </div>}
    </div>
  );
}

export default Composer;
