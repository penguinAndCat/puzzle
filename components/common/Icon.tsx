import styled from 'styled-components';

const Svg = styled.svg`
  color: ${({ theme }) => theme.modalTextColor};
  fill: ${({ theme }) => theme.modalTextColor};
`;

const PaletteSvg = styled.svg`
  color: ${({ theme }) => theme.paletteColor};
  fill: ${({ theme }) => theme.paletteColor};
`;

const PopupSvg = styled.svg`
  color: ${({ theme }) => theme.bgColor};
  fill: ${({ theme }) => theme.bgColor};
`;

const DropdownSvg = styled.svg`
  color: ${({ theme }) => theme.textColor};
  fill: ${({ theme }) => theme.textColor};
`;

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

export const PopupCloseIcon = () => {
  return (
    <PopupSvg aria-label="삭제" height="12" role="img" viewBox="0 0 24 24" width="12">
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
    </PopupSvg>
  );
};

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

export const PaletteIcon = () => {
  return (
    <PaletteSvg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      x="0px"
      y="0px"
      viewBox="0 0 2000 2000"
      xmlSpace="preserve"
      width={18}
      height={18}
    >
      <g>
        <g transform="translate(0.000000,1001.000000) scale(0.20000,-0.20000)">
          <path
            stroke="#ffffff"
            d="M8773.6,4879.8c0-5,17.5-50.1,37.5-97.6c47.6-115.1,47.6-317.9,0-433c-20-47.6-160.2-215.3-310.4-370.5c-355.4-368-390.5-435.6-388-728.4c2.5-275.4,52.6-405.5,235.3-598.2c185.2-195.3,375.5-275.4,650.8-277.9c192.8,0,230.3,7.5,380.5,82.6c202.8,100.1,373,280.4,450.6,480.6c60.1,160.2,70.1,445.6,22.5,625.8c-107.6,388-538.2,986.3-901.2,1246.6C8856.2,4879.8,8773.6,4912.3,8773.6,4879.8z"
          />
          <path
            stroke="#ffffff"
            d="M4062.5,4702c-1990-322.9-3507-1777.3-3905-3742.3C107.5,704.4,100,604.3,100,71.1c2.5-553.2,7.5-625.8,70.1-916.2C488-2339.4,1454.2-3551,2828.5-4176.8c931.2-425.5,2012.6-528.2,3028.9-285.4c210.3,50.1,272.9,127.7,255.3,307.9c-20,187.7-132.7,380.5-395.5,670.8c-605.8,670.8-833.6,1129-751,1501.9c82.6,368,565.7,673.4,941.2,595.8c200.3-42.5,295.4-120.1,513.2-410.5c247.8-332.9,580.7-648.3,791-751c125.2-62.6,200.3-80.1,368-90.1c115.2-7.5,215.3-5,222.8,7.5c7.5,12.5,2.5,112.6-7.5,222.8c-40.1,393-67.6,1359.2-50.1,1752.2c10,220.3,12.5,405.5,10,410.5c-5,7.5-32.5-12.5-65.1-40.1c-95.1-87.6-302.9-177.7-478.1-210.3C6781-569.7,6327.9-326.9,6135.2,81.2c-72.6,152.7-77.6,185.2-77.6,440.5c0,260.3,5,285.4,80.1,440.6c100.1,200.3,300.4,398,500.6,493.1c130.2,60.1,172.7,67.6,420.5,67.6s290.4-7.5,420.5-67.6c80.1-37.5,210.3-130.1,287.9-205.2l145.2-137.7l70.1,305.4c37.6,167.7,107.6,420.6,155.2,558.2l85.1,255.3l-142.7,145.2c-160.2,162.7-290.4,400.5-335.4,610.8c-27.6,127.7-20,505.7,12.5,613.3c12.5,40.1-22.5,77.6-190.3,202.8c-565.7,420.5-1204,708.4-1909.9,861.1C5329.2,4737.1,4403,4757.1,4062.5,4702z M5531.9,3387.9c585.8-282.9,575.7-1123.9-15-1389.3c-137.7-60.1-175.2-67.6-360.5-57.6c-162.7,7.5-227.8,25-315.4,75.1c-255.3,152.7-400.5,385.5-403,653.3c-7.5,355.5,187.7,633.3,528.2,761C5101.4,3480.5,5384.2,3457.9,5531.9,3387.9z M2861,2108.7c182.7-77.6,297.9-187.7,385.5-365.5c67.6-140.2,80.1-192.7,80.1-342.9c0-295.4-155.2-545.7-420.5-685.9c-110.1-57.6-157.7-67.6-340.4-67.6s-230.3,10-337.9,67.6c-160.2,85.1-295.4,225.3-368,383c-77.6,170.2-77.6,450.6,0,613.3C2050,2103.7,2478,2273.9,2861,2108.7z M2811-790c695.9-358,490.6-1399.3-285.4-1449.4c-242.8-15-395.5,37.5-570.7,197.8c-175.2,160.2-247.8,322.9-247.8,563.2c0,145.2,12.5,207.8,67.6,320.4c80.1,162.7,272.8,345.4,423,400.5C2352.9-699.8,2670.8-717.4,2811-790z"
          />
          <path
            stroke="#ffffff"
            d="M8498.2,1921c-120.1-327.9-265.3-1013.8-322.9-1562c-155.2-1416.8-77.6-3021.3,197.8-4067.7c197.8-756,458.1-1076.4,748.5-928.7c212.8,110.1,435.5,628.3,578.2,1341.7c145.2,728.4,200.3,1356.7,200.3,2318c0,926.2-52.6,1562-187.7,2227.8c-72.6,363-210.3,811-247.8,811c-15,0-90.1-17.5-165.2-37.5c-210.3-55.1-475.6-47.5-693.4,22.5C8558.3,2061.2,8545.8,2046.2,8498.2,1921z"
          />
        </g>
      </g>
    </PaletteSvg>
  );
};

export const DropdownIcon = () => {
  return (
    <DropdownSvg xmlns="http://www.w3.org/2000/svg" width="12px" height="12px" viewBox="6 6 12 12">
      <rect x="0" fill="none" width="24" height="24" />
      <g>
        <path d="M7 10l5 5 5-5" />
      </g>
    </DropdownSvg>
  );
};
