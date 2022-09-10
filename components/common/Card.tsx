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
  cursor: pointer;
`;

const Img = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;
