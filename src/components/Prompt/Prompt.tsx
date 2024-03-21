import { usePrompts, usePromptControls } from '../../state/prompts'
import type { Prompt as PromptIFace } from '../../state/prompts'
import { useEffect, type MouseEvent } from 'react';
import './Prompt.scss';
import { useComposer } from '../../hooks/useComposer';

export const PromptContainer: React.FC = () => {
  const { isPromptActive, activePrompts } = usePrompts();

  if (!isPromptActive) return null;

  return (
    <>
        {activePrompts.map((prompt, i) => (
            <Prompt key={`prompt-${i}`} prompt={prompt} />
        ))}
    </>
  )
}

export const Prompt = ({ prompt }: { prompt: PromptIFace }): JSX.Element | null => {
  const { isPromptActive } = usePrompts();
  const { closePrompt } = usePromptControls();
  const { closeComposer } = useComposer();

  if (!isPromptActive) return null;

  const onMaskClick = (): void => {
    closePrompt();
  }

  const onInnerClick = (e: MouseEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
  }

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        closePrompt();
      }
    };

    window.addEventListener('keydown', handleEsc);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isPromptActive]);

  const handleDeleteDraft = (): void => {
    closeComposer();
  }

  const handleConfirmAction = (): void => {
    if (prompt.name === 'delete-draft') {
      handleDeleteDraft();
    } else {
      prompt.confirmAction(prompt.uri);
    }
    closePrompt();
  };

  return (
    <div className='prompt-mask' onClick={onMaskClick}>
        <div className='prompt-container' onClick={(e) => { onInnerClick(e); }}>
            <h1 className='prompt-title'>{prompt.title}</h1>
            <div className='prompt-description'>{prompt.description}</div>
            <div className='prompt-actions'>
                <button autoFocus className='no-button-style prompt-cancel' onClick={closePrompt}>{prompt.options[0]}</button>
                <button className='no-button-style prompt-confirm' onClick={() => { handleConfirmAction(); }}>{prompt.options[1]}</button>
            </div>
        </div>
    </div>
  )
}
