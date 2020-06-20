import callWebApi from 'src/helpers/webApiHelper';

export const uploadImage = async (image, cropProps) => {
  const response = cropProps
    ? await callWebApi({
      endpoint: '/api/images',
      type: 'POST',
      attachment: image,
      query: { x: cropProps[0], y: cropProps[1], width: cropProps[2] }
    })
    : await callWebApi({
      endpoint: '/api/images',
      type: 'POST',
      attachment: image
    });
  return response.json();
};
