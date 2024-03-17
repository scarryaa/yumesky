import { createContext, useCallback, useContext, useMemo, useState } from 'react';

export type ReportModal = {
  name: 'report'
} & (
  | {
    uri: string
    cid: string
  }
  | { did: string }
);

export type Modal =
    // Moderation
    ReportModal;

interface ModalContext {
  isModalActive: boolean;
  activeModals: Modal[];
}

interface ModalControlContext {
  openModal: (modal: Modal) => void;
  closeModal: () => boolean;
  closeAllModals: () => void;
}

const modalContext = createContext<ModalContext>({ isModalActive: false, activeModals: [] });
const modalControlContext = createContext<ModalControlContext>({
  openModal: () => {},
  closeModal: () => false,
  closeAllModals: () => {}
});

export const Provider = ({ children }: React.PropsWithChildren<Record<string, unknown>>): JSX.Element => {
  const [activeModals, setActiveModals] = useState<Modal[]>([]);

  const openModal = useCallback((modal: Modal) => {
    setActiveModals(modals => [...modals, modal]);
  }, []);

  const closeModal = useCallback(() => {
    const wasActive = activeModals.length > 0;
    setActiveModals(modals => {
      return modals.slice(0, -1);
    });
    return wasActive;
  }, []);

  const closeAllModals = useCallback(() => {
    setActiveModals([]);
  }, []);

  const state = useMemo(() => ({
    isModalActive: activeModals.length > 0,
    activeModals
  }), [activeModals]);

  const methods = useMemo(() => ({
    openModal,
    closeModal,
    closeAllModals
  }), [openModal, closeModal, closeAllModals]);

  return (
    <modalContext.Provider value={state}>
        <modalControlContext.Provider value={methods}>
            {children}
        </modalControlContext.Provider>
    </modalContext.Provider>
  )
}

export const useModals = (): ModalContext => {
  return useContext(modalContext);
}

export const useModalControls = (): ModalControlContext => {
  return useContext(modalControlContext);
}
