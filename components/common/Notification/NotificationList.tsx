import { useNotificationState } from 'libs/zustand/store';
import styled from 'styled-components';
import Notification from './Notification';

const NotificationList = () => {
  const { notification } = useNotificationState();

  return (
    <Wrapper>
      {notification.map((item, index) => (
        <Notification key={index} option={item} />
      ))}
    </Wrapper>
  );
};

export default NotificationList;

const Wrapper = styled.div`
  position: fixed;
  right: 10px;
  bottom: 20px;
  z-index: 999;
`;
