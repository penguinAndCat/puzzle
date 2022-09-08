import Card from 'components/common/Card';
import styled from 'styled-components';

const images = [{ img: '/test.jpg' }, { img: '/test2.jpg' }];

const Main = () => {
  return (
    <Wrapper>
      {images.map((props, index) => {
        return <Card key={index} image={props.img} />;
      })}
    </Wrapper>
  );
};

export default Main;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  heigth: 100%;
`;
