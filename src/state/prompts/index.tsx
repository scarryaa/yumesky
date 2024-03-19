import { createContext, useCallback, useContext, useMemo, useState } from 'react';

export interface DeletePostPromptType extends Prompt {
  name: 'delete-post',
};

export interface Prompt {
  name: string;
  title: string;
  description?: string;
  options: string[];
  confirmAction: (props?: any) => void;
  uri?: string;
}

interface PromptContext {
  isPromptActive: boolean;
  activePrompts: Prompt[];
}

interface PromptControlContext {
  openPrompt: (prompt: Prompt) => void;
  closePrompt: () => boolean;
  closeAllPrompts: () => void;
}

const promptContext = createContext<PromptContext>({ isPromptActive: false, activePrompts: [] });
const promptControlContext = createContext<PromptControlContext>({
  openPrompt: () => {},
  closePrompt: () => false,
  closeAllPrompts: () => {}
});

export const Provider = ({ children }: React.PropsWithChildren<Record<string, unknown>>): JSX.Element => {
  const [activePrompts, setActivePrompts] = useState<Prompt[]>([]);

  const openPrompt = useCallback((prompt: Prompt) => {
    setActivePrompts(prompts => [...prompts, prompt]);
  }, []);

  const closePrompt = useCallback(() => {
    const wasActive = activePrompts.length > 0;
    setActivePrompts(prompts => {
      return prompts.slice(0, -1);
    });
    return wasActive;
  }, []);

  const closeAllPrompts = useCallback(() => {
    setActivePrompts([]);
  }, [])

  const state = useMemo(() => ({
    isPromptActive: activePrompts.length > 0,
    activePrompts
  }), [activePrompts]);

  const methods = useMemo(() => ({
    openPrompt,
    closePrompt,
    closeAllPrompts
  }), [openPrompt, closePrompt, closeAllPrompts]);

  return (
    <promptContext.Provider value={state}>
        <promptControlContext.Provider value={methods}>
            {children}
        </promptControlContext.Provider>
    </promptContext.Provider>
  )
}

export const usePrompts = (): PromptContext => {
  return useContext(promptContext);
}

export const usePromptControls = (): PromptControlContext => {
  return useContext(promptControlContext);
}
