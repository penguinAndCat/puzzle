import { usePopupState } from 'libs/zustand/store';
import styled from 'styled-components';
import Popup from '.';

const PopupList = () => {
  const { popup } = usePopupState();

  return (
    <Wrapper>
      {popup.map((item, index) => (
        <Popup key={index} option={item} />
      ))}
    </Wrapper>
  );
};

export default PopupList;

const Wrapper = styled.div`
  position: fixed;
  right: 10px;
  bottom: 0px;
  z-index: 999;
`;
