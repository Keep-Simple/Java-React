import React from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/lib/ReactCrop.scss';

// eslint-disable-next-line react/prop-types
const CropPhoto = ({ src, crop, setCrop }) => (
  <ReactCrop
    src={src}
    crop={crop}
    maxWidth="200"
    onChange={(newCrop, percent) => setCrop(percent)}
  />
);

export default CropPhoto;
