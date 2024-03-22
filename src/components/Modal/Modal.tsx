import { type MouseEvent } from 'react';
import { useModalControls, useModals } from '../../state/modals';
import type { Modal as ModalIface } from '../../state/modals';
import * as ReportModal from './report/Modal';
import * as AddAccountModal from './add-account/Modal'
import './Modal.scss';

export const ModalsContainer = (): JSX.Element | null => {
  const { isModalActive, activeModals } = useModals();

  if (!isModalActive) {
    return null;
  }

  return (
    <>
        {activeModals.map((modal, i) => (
            <Modal key={`modal-${i}`} modal={modal} />
        ))}
    </>
  )
}

export const Modal = ({ modal }: { modal: ModalIface }): JSX.Element | null => {
  const { isModalActive } = useModals();
  const { closeModal } = useModalControls();
  // const { isMobile } = useWebMediaQueries();

  if (!isModalActive) return null;

  const onMaskClick = (): void => {
    closeModal();
  }

  const onInnerClick = (e: MouseEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
  }

  let element;
  if (modal.name === 'report') {
    element = <ReportModal.Component {...modal} />;
  } else if (modal.name === 'add-account') {
    element = <AddAccountModal.Component />
  } else {
    return null;
  }

  return (
    <div className='modal-mask' onClick={onMaskClick}>
        <div className='modal-container' onClick={(e) => { onInnerClick(e); }}>
            {element}
        </div>
    </div>
  )
}
