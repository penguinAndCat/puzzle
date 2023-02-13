import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import styled, { css } from 'styled-components';

import apis from 'apis';
import { useNotice } from 'hooks/apis/useReactQuery';
import { theme } from 'libs/theme/theme';
import { useModal } from 'libs/zustand/store';

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
          <DropDownButton onClick={() => (window.location.href = '/mypage')}>프로필</DropDownButton>
          <DropDownMobileButton onClick={() => addModal('friend')}>친구</DropDownMobileButton>
          <DropDownMobileButton onClick={() => addModal('notice')}>
            알림
            {notice && notice.length > 0 && <Notice />}
          </DropDownMobileButton>
          <DropDownButton onClick={logout}>로그아웃</DropDownButton>
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

const ButtonStyle = css`
  position: relative;
  width: 80px;
  height: 30px;
  border-radius: 4px;
  border: 3px ${({ theme }) => theme.borderColor};
  color: ${({ theme }) => theme.headerTextColor};
  background-color: ${({ theme }) => theme.headerColor};
  font-weight: 600;
  text-align: center;
  cursor: pointer;
  padding: 0;
`;

const Button = styled.button`
  ${ButtonStyle};
`;

const DropDownButton = styled.button`
  ${ButtonStyle};
  margin-top: 4px;
`;

const DropDownMobileButton = styled.button`
  ${ButtonStyle};
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
