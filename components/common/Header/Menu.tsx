import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import styled, { css } from 'styled-components';

import apis from 'apis';
import { useNotice } from 'hooks/apis/useReactQuery';
import { theme } from 'libs/theme/theme';
import { useModal } from 'libs/zustand/store';
import { Button } from '../Button';

const Menu = ({ user }: { user: UserInfo | null }) => {
  const { addModal } = useModal();
  const router = useRouter();
  const { notice, refetchNotice } = useNotice(user);
  const [dropDown, setDropDown] = useState(false);
  const el = useRef<HTMLDivElement>(null);
  const onClick = () => {
    if (!dropDown) {
      setDropDown(true);
    } else {
      setDropDown(false);
    }
  };

  useEffect(() => {
    const handleCloseDropDown = (e: CustomEvent<MouseEvent>) => {
      if (!el.current || !el.current.contains(e.target as Element)) {
        setDropDown(false);
      }
    };
    window.addEventListener('click', handleCloseDropDown as EventListener);
    return () => {
      window.removeEventListener('click', handleCloseDropDown as EventListener);
    };
  }, []);

  const logout = async () => {
    await apis.users.logout();
    router.reload();
  };

  return (
    <ButtonWrapper ref={el}>
      {user?.name ? <Button onClick={onClick}>메뉴</Button> : <Button onClick={() => addModal('login')}>로그인</Button>}
      {dropDown && (
        <DropDownWrapper>
          <Button onClick={() => (window.location.href = '/mypage')} css={DropDownCss}>
            프로필
          </Button>
          <Button onClick={() => addModal('friend')} css={DropDownMobileCss}>
            친구
          </Button>
          <Button onClick={() => addModal('notice')} css={DropDownMobileCss}>
            알림
            {notice && notice.length > 0 && <Notice />}
          </Button>
          <Button onClick={logout} css={DropDownCss}>
            로그아웃
          </Button>
        </DropDownWrapper>
      )}
    </ButtonWrapper>
  );
};

export default Menu;

const ButtonWrapper = styled.div`
  position: relative;
  margin-left: 20px;
  height: 30px;
  @media (max-width: 600px) {
    margin-left: 5px;
  }
`;

const DropDownWrapper = styled.div`
  position: absolute;
  ${theme.common.flexCenterColumn}
`;

const DropDownCss = css`
  margin-top: 4px;
`;

const DropDownMobileCss = css`
  margin-top: 4px;
  display: none;
  @media (max-width: 600px) {
    display: block;
  }
`;

const Notice = styled.div`
  position: absolute;
  width: 10px;
  height: 10px;
  top: 20px;
  left: 69px;
  background-color: #c24641;
  border-radius: 50%;
`;
