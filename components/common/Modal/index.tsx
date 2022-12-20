import { useModal } from 'libs/zustand/store';
import NoticeModal from './NoticeModal';
import FriendModal from './FriendModal';
import LoginModal from './LoginModal';
import ModalLayout from './ModalLayout';
import PuzzleFriendModal from './PuzzleFriendModal';
import PuzzleModal from './PuzzleModal';

const Modal = () => {
  const { modal } = useModal();
  return (
    <>
      {modal.includes('puzzle') && (
        <ModalLayout content={'puzzle'}>
          <PuzzleModal />
        </ModalLayout>
      )}
      {modal.includes('login') && (
        <ModalLayout content={'login'}>
          <LoginModal />
        </ModalLayout>
      )}
      {modal.includes('friend') && (
        <ModalLayout content={'friend'}>
          <FriendModal />
        </ModalLayout>
      )}
      {modal.includes('notice') && (
        <ModalLayout content={'notice'}>
          <NoticeModal />
        </ModalLayout>
      )}
      {modal.includes('puzzleFriend') && (
        <ModalLayout content={'puzzleFriend'}>
          <PuzzleFriendModal />
        </ModalLayout>
      )}
    </>
  );
};

export default Modal;
