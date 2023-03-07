import { useModal } from 'libs/zustand/store';
import NoticeModal from './NoticeModal';
import FriendModal from './FriendModal';
import LoginModal from './LoginModal';
import ModalLayout from './ModalLayout';
import PuzzleFriendModal from './PuzzleFriendModal';
import PuzzleModal from './PuzzleModal';
import SearchFriend from './FriendModal/Search';
import InvitedUserModal from './InvitedUserModal';
import CropImageModal from './CropImageModal';

const Modal = () => {
  const { modal } = useModal();
  return (
    <>
      {modal.includes('puzzle') && (
        <ModalLayout title={'Create'} content={'puzzle'}>
          <PuzzleModal />
        </ModalLayout>
      )}
      {modal.includes('login') && (
        <ModalLayout title={'Login'} content={'login'} width={240} height={220}>
          <LoginModal />
        </ModalLayout>
      )}
      {modal.includes('friend') && (
        <ModalLayout title={'Friend'} content={'friend'}>
          <FriendModal>
            <SearchFriend />
          </FriendModal>
        </ModalLayout>
      )}
      {modal.includes('notice') && (
        <ModalLayout title={'Notice'} content={'notice'}>
          <NoticeModal />
        </ModalLayout>
      )}
      {modal.includes('puzzleFriend') && (
        <ModalLayout title={'Friend'} content={'puzzleFriend'}>
          <PuzzleFriendModal />
        </ModalLayout>
      )}
      {modal.includes('invitedUser') && (
        <ModalLayout title={'Participants'} content={'invitedUser'}>
          <InvitedUserModal />
        </ModalLayout>
      )}
      {modal.includes('cropImage') && (
        <ModalLayout title={'CropImage'} content={'cropImage'}>
          <CropImageModal />
        </ModalLayout>
      )}
    </>
  );
};

export default Modal;
