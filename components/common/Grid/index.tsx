import styled from 'styled-components';

export const PuzzleWrapper = styled.div`
  width: min(100%, 1024px);
  display: grid;
  grid-template-columns: repeat(4, minmax(24.25%, auto));
  padding: 1rem 0;
  gap: 1%;
  @media (max-width: 720px) {
    grid-template-columns: repeat(2, minmax(49.5%, auto));
  }
`;
