import React, { useRef, useEffect } from 'react';
import { Rnd } from 'react-rnd';

const MobileSelector = (props) => {
  const {
    cameraStream,
    screenStream,
    selfPhoneStream,
    setSelfPhoneStream,
    selfDesktopStream,
    setSelfDesktopStream
  } = props;
  const cameraRef = useRef();
  const smallCameraRef = useRef();
  const screenRef = useRef();
  const smallSelf = useRef();
  const bigSelf = useRef();
  useEffect(() => {
    if (cameraStream && !screenStream && !selfDesktopStream) {
      cameraRef.current.srcObject = cameraStream;
    } else if (!cameraStream && screenStream && !selfDesktopStream) {
      cameraRef.current.srcObject = screenStream;
    } else if (cameraStream && screenStream) {
      smallCameraRef.current.srcObject = cameraStream;
      screenRef.current.srcObject = screenStream;
    }
    if (selfPhoneStream && !selfDesktopStream) {
      smallSelf.current.srcObject = selfPhoneStream;
    } else if (!selfPhoneStream && selfDesktopStream) {
      bigSelf.current.srcObject = selfDesktopStream;
    }
  }, [cameraStream, screenStream, selfPhoneStream]);
  const style = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'solid 1px #ddd',
    background: '#f0f0f0'
  };
  return (
    <>
      {selfPhoneStream && (
        <Rnd
          onResize={null}
          style={style}
          default={{
            x: 400,
            y: 0,
            width: 240,
            height: 240
          }}
        >
          <video
            className="small_mob_video"
            ref={smallSelf}
            autoPlay
            playsInline
            muted
          ></video>
        </Rnd>
      )}
      {selfDesktopStream && (
        <video
          className="mob_screen"
          ref={bigSelf}
          autoPlay
          playsInline
          muted
        ></video>
      )}
      {cameraStream && screenStream && (
        <div className="mob_wrap">
          <Rnd
            onResize={null}
            style={style}
            default={{
              x: 0,
              y: 0,
              width: 240,
              height: 240
            }}
          >
            <video
              className="small_mob_video"
              ref={smallCameraRef}
              autoPlay
              playsInline
              muted
            ></video>
          </Rnd>
          <video
            className="mob_screen"
            ref={screenRef}
            autoPlay
            playsInline
            muted
          ></video>
        </div>
      )}
      {cameraStream && !screenStream && !selfDesktopStream && (
        <video
          className="mob_video"
          ref={cameraRef}
          autoPlay
          playsInline
          muted
        ></video>
      )}
      {!cameraStream &&
        screenStream &&
        !selfDesktopStream &&
        !selfDesktopStream && (
          <video
            className="mob_video"
            ref={cameraRef}
            autoPlay
            playsInline
            muted
          ></video>
        )}
    </>
  );
};

export default MobileSelector;
