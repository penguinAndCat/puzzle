const getGCD = (a: number, b: number): number => {
  if (b === 0) {
    return a;
  }
  return getGCD(b, a % b);
};

const getTilewidths = (w: number, h: number): number[] => {
  const gcd = getGCD(w, h);
  const tileWidths: number[] = [];
  for (let i = 1; i <= gcd; i++) {
    if (gcd % i === 0) {
      tileWidths.push(i);
    }
  }
  return tileWidths.reverse();
};

export default getTilewidths;
