import { useToastState } from 'libs/zustand/store';
import styled from 'styled-components';
import Toast from '.';

const ToastList = () => {
  const { toast } = useToastState();

  return (
    <Wrapper>
      {toast.map((item, index) => (
        <Toast key={index} option={item} />
      ))}
    </Wrapper>
  );
};

export default ToastList;

const Wrapper = styled.div`
  position: fixed;
  right: 10px;
  top: 20px;
  z-index: 999;
`;
