import styled from 'styled-components';

interface Props {
  image: string;
}

const Card = ({ image }: Props) => {
  return (
    <Wrapper>
      <Img src={image} />
    </Wrapper>
  );
};

export default Card;

const Wrapper = styled.div`
  width: 400px;
  heigth: 400px;
`;

const Img = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;
