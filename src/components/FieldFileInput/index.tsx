/* eslint-disable jsx-a11y/alt-text */
import React, { useState } from 'react';
import { styled, alpha } from '@mui/material/styles';

const ImportImage = styled('div')<{ withBorder: boolean; circleShape }>(
  ({ theme, circleShape }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: circleShape ? '100%' : 'fit-content',
    width: '100%',
    // @ts-ignore
    border: 'solid 2px ' + alpha(theme.palette.text.primary, 0.5),
    borderRadius: circleShape ? '100%' : '5px',
    // @ts-ignore
    backgroundColor: theme.palette.background.default,
    marginTop: '-22px',
    cursor: 'pointer',
  }),
);

type Props = {
  children?: React.ReactNode;
  onFileSelect: (file: CustomFile) => void;
  previewImage?: string;
  circleShape?: boolean;
};

export interface CustomFile extends File {
  buffer: ArrayBuffer;
}

/**
 * MAIN COMPONENT
 * - responsible for manage file uploads
 */
const FieldFileInput: React.FC<Props> = props => {
  const [previewImage, setPeviewImage] = useState<string | null>(
    props?.previewImage ? props.previewImage : null,
  );
  const [mediaType, setMediaType] = useState<string | null>(null);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);

  const onChange = (e: any) => {
    if ((e.target as HTMLInputElement).files && e.target.files[0]) {
      if (e.target.files[0].size / 1_000_000 > 5) {
        alert('media file size exceeded. File should not exceed 5mb size.');
        return;
      }

      props.onFileSelect(e.target.files[0]);

      if (e.target.files[0].type.includes('image')) {
        setMediaType('image');

        let reader = new FileReader();

        reader.onload = e => {
          const image = new Image();

          image.src = e.target?.result as string;

          image.onload = function () {
            // const width = (this as any).width;
            // const height = (this as any).height;

            setPeviewImage(e.target?.result as string);
          };
        };
        reader.readAsDataURL(e.target.files[0]);
      } else if (e.target.files[0].type.includes('video')) {
        setMediaType('video');

        const url = URL.createObjectURL(e.target.files[0]);

        setVideoSrc(url);
      }
    }
  };

  return (
    <React.Fragment>
      <input
        id="file"
        onClick={e => e.stopPropagation()}
        accept=".jpg, .png, .jpeg, .mp4, .mkv"
        onChange={onChange}
        type="file"
      />
      <label onClick={e => e.stopPropagation()} htmlFor="file">
        <ImportImage
          withBorder={!Boolean(previewImage)}
          circleShape={props.circleShape}>
          {!previewImage ? (
            props.children || (
              <h3
                style={{
                  padding: '20px 0px',
                  fontWeight: '400',
                  opacity: '0.7',
                }}>
                Select Media.
              </h3>
            )
          ) : mediaType === 'image' ? (
            <img
              style={{
                height: '100%',
                width: '100%',
                // backgroundImage: `url(${previewImage})`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                borderRadius: props.circleShape ? '100%' : '3px',
                objectFit: 'cover',
              }}
              src={previewImage}
            />
          ) : (
            <video
              style={{
                display: 'block',
                margin: 0,
              }}
              width="100%"
              height="fit-content"
              controls
              src={videoSrc!}
            />
          )}
        </ImportImage>
      </label>
    </React.Fragment>
  );
};

export default FieldFileInput;
