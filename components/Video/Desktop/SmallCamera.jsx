import React, { useState, useRef, useEffect } from 'react';
import Measure from 'react-measure';
import { useUserMedia, useCardRatio } from '../../../Hooks';
import { Video, Wrapper, Container } from './smallStyle';
import { ImCancelCircle } from 'react-icons/im';
import { Icon } from '@chakra-ui/react';

const CAPTURE_OPTIONS = {
  audio: false,
  video: { facingMode: 'environment' }
};

const SmallCamera = (props) => {
  const {
    isVideoPlaying,
    setIsVideoPlaying,
    setIsCamera,
    handleMediaStream
  } = props;
  const videoRef = useRef();

  const [container, setContainer] = useState({ width: 0, height: 0 });

  const mediaStream = useUserMedia(CAPTURE_OPTIONS);
  const [aspectRatio, calculateRatio] = useCardRatio(1.9);
  if (mediaStream && videoRef.current && !videoRef.current.srcObject) {
    videoRef.current.srcObject = mediaStream;
  }
  useEffect(() => {
    if (mediaStream) {
      handleMediaStream(mediaStream);
    }
  }, [mediaStream]);

  function handleResize(contentRect) {
    setContainer({
      width: contentRect.bounds.width,
      height: Math.round(contentRect.bounds.width / aspectRatio)
    });
  }

  function handleCanPlay() {
    calculateRatio(videoRef.current.videoHeight, videoRef.current.videoWidth);
    setIsVideoPlaying(true);
    videoRef.current.play();
  }

  if (!mediaStream) {
    return null;
  }
  const handleCancel = (e) => {
    e.stopPropagation();
    console.log('cancel');
  };

  return (
    <Measure bounds onResize={handleResize}>
      {({ measureRef }) => (
        <Wrapper>
          {/* <div
            className="cancel"
            onClick={(e) => {
              e.stopPropagation();
              console.log('fe');
            }}
          >
            <Icon as={ImCancelCircle} w={30} h={30} />
          </div> */}
          <Container
            ref={measureRef}
            maxHeight={videoRef.current && videoRef.current.videoHeight}
            maxWidth={videoRef.current && videoRef.current.videoWidth}
          >
            <Video
              ref={videoRef}
              hidden={!isVideoPlaying}
              onCanPlay={handleCanPlay}
              autoPlay
              playsInline
              muted
            />
          </Container>
        </Wrapper>
      )}
    </Measure>
  );
};

export default SmallCamera;
