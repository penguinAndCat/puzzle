import axios from 'axios';

export const BASE_IMAGE = [
  {
    image: 'http://res.cloudinary.com/penguinandcatpuzzle/image/upload/v1666189078/bugvpkwfmde3q21zcm4s.png',
    thumbImage: '	http://res.cloudinary.com/penguinandcatpuzzle/image/upload/v1666189078/ududaaohxjka0r2fvrvh.webp',
  },
  {
    image: 'http://res.cloudinary.com/penguinandcatpuzzle/image/upload/v1666189134/ylij9nqsupthcypczcjn.png',
    thumbImage: '	http://res.cloudinary.com/penguinandcatpuzzle/image/upload/v1666189078/qbau9upbhb5j5oacopw0.webp',
  },
  {
    image: 'http://res.cloudinary.com/penguinandcatpuzzle/image/upload/v1666189479/uzxtq97qotpu68qhjunh.png',
    thumbImage: '	http://res.cloudinary.com/penguinandcatpuzzle/image/upload/v1666189078/foc2w5rmgmmoy8hyiyaz.webp',
  },
  {
    image: 'http://res.cloudinary.com/penguinandcatpuzzle/image/upload/v1666189365/qtpra1i8dps1nwjhc17a.png',
    thumbImage: '	http://res.cloudinary.com/penguinandcatpuzzle/image/upload/v1666189078/v1jvyheu8ymyfxcke7he.webp',
  },
];

export const saveImage = async (image: string) => {
  const baseImageUrl = getBaseImage(image);
  if (baseImageUrl !== '') return baseImageUrl;

  let formData = new FormData();
  formData.append('api_key', '487728142543533');
  formData.append('upload_preset', 'puzzle');
  formData.append(`file`, image);
  const uploadRes = await axios.post(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_NAME}/image/upload`,
    formData
  );
  const {
    data: { url },
  } = uploadRes;
  return url;
};

export const saveThumbImage = async (image: string) => {
  const baseThumbImageUrl = getBaseThumbImage(image);
  if (baseThumbImageUrl !== '') return baseThumbImageUrl;

  const webpImage = await getWebpImage(image);
  let formData = new FormData();
  formData.append('api_key', '487728142543533');
  formData.append('upload_preset', 'puzzle');
  formData.append(`file`, webpImage);
  const uploadRes = await axios.post(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_NAME}/image/upload`,
    formData
  );
  const {
    data: { url },
  } = uploadRes;
  return url;
};

const getBaseImage = (image: string) => {
  let baseImageUrl = '';
  BASE_IMAGE.forEach((item) => {
    if (item.thumbImage === image) baseImageUrl = item.image;
  });
  return baseImageUrl;
};

const getBaseThumbImage = (image: string) => {
  let baseThumbImageUrl = '';
  BASE_IMAGE.forEach((item) => {
    if (item.thumbImage === image) baseThumbImageUrl = image;
  });
  return baseThumbImageUrl;
};

const createImage = async (url: string) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous'); // needed to avoid cross-origin issues
    image.src = url;
  });

const getSize = (imageWidth: number, imageHeight: number) => {
  let width = 250;
  let height = 250;
  const ratio = imageHeight / imageWidth;
  if (ratio > 1) {
    height = height * ratio;
  } else {
    width = width / ratio;
  }
  return { width: width, height: height };
};

async function getWebpImage(imageSrc: string) {
  const image: any = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const { width, height } = getSize(image.width, image.height);
  canvas.width = width;
  canvas.height = height;
  const ctx = <CanvasRenderingContext2D>canvas.getContext('2d');

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(image, 0, 0, width, height);

  // As Base64 string
  return canvas.toDataURL('image/webp');
}
