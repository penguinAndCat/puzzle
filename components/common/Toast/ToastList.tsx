import { useToastState } from 'libs/zustand/store';
import styled from 'styled-components';
import Toast from './Toast';

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
  width: 250px;
  position: fixed;
  right: 10px;
  top: 20px;
  z-index: 999;
`;
