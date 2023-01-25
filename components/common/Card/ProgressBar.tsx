import React from 'react';
import styled from 'styled-components';

export default function ProgressBar({ percent }: { percent: number }) {
  return (
    <Container>
      <Progress></Progress>
      <BlockBar percent={100 - percent}></BlockBar>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  height: 8px;
  position: relative;
  border-radius: 4px;
  padding: 1px;
`;

const Progress = styled.div`
  width: 100%;
  height: 8px;
  border-radius: 4px;
  background: ${({ theme }) => `linear-gradient(to right, ${theme.loadingColor3}, ${theme.loadingColor1});`};
`;

const BlockBar = styled.div<{ percent: number }>`
  background-color: white;
  position: absolute;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  top: 1px;
  right: 0px;
  width: ${({ percent }) => `${percent}%;`}
  height: 8px;
  z-index: 2;
`;
