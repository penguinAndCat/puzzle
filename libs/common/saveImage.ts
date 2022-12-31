import axios from 'axios';

export const saveImage = async (image: string) => {
  if (image.slice(undefined, 25) === 'http://res.cloudinary.com') return image;
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
