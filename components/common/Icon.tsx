import styled from 'styled-components';

export const CloseIcon = () => {
  return (
    <Svg aria-label="삭제" height="12" role="img" viewBox="0 0 24 24" width="12">
      <line
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        x1="21"
        x2="3"
        y1="3"
        y2="21"
      ></line>
      <line
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        x1="21"
        x2="3"
        y1="21"
        y2="3"
      ></line>
    </Svg>
  );
};

const Svg = styled.svg`
  color: ${({ theme }) => theme.modalTextColor};
  fill: ${({ theme }) => theme.modalTextColor};
`;

export const SeeMoreIcon = () => {
  return (
    <svg
      viewBox="64 64 896 896"
      focusable="false"
      data-icon="ellipsis"
      width="1em"
      height="1em"
      fill="currentColor"
      aria-hidden="true"
      color="#000"
    >
      <path d="M176 511a56 56 0 10112 0 56 56 0 10-112 0zm280 0a56 56 0 10112 0 56 56 0 10-112 0zm280 0a56 56 0 10112 0 56 56 0 10-112 0z"></path>
    </svg>
  );
};
