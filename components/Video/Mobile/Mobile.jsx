import React, { useState, useEffect, useRef } from 'react';
import { Box, Button, Text, Icon, Input, useToast } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import { FiSettings } from 'react-icons/fi';
import MobileSpring from './MobileSpring';
import Peer from 'simple-peer';
import { expand } from '../../../helper/helper';
import { supabase } from '../../../supabase/supabaseClient';
import { SketchField, Tools } from '../../../react-sketch';
import MobileSelector from './MobileSelector';

const QrReader = dynamic(() => import('react-qr-scanner'), {
  ssr: false
});

const Mobile = () => {
  const toast = useToast();
  const [mobileStream, setMobileStream] = useState([]);
  const cameraRef = useRef();
  const sketchRef = useRef();
  const [open, setOpen] = useState(false);
  const [delay, setDelay] = useState(100);
  const [result, setResult] = useState('No result');
  const [isQr, setIsQr] = useState(false);
  const [currTool, setCurrTool] = useState(Tools.Pencil);
  const [lineColor, setLineColor] = useState('#000');
  const [isConnect, setIsConnect] = useState(false);
  const [loadBtn, setLoadBtn] = useState(false);
  const [streamId, setStreamId] = useState(null);
  const [cameraStream, setCameraStream] = useState(null);
  const [screenStream, setScreenStream] = useState(null);
  const [selfPhoneStream, setSelfPhoneStream] = useState(null);
  const [selfDesktopStream, setSelfDesktopStream] = useState(null);
  const previewStyle = {
    width: '100vw',
    height: '100vh'
  };
  // Appending the streams to their ids
  useEffect(() => {
    if (streamId && mobileStream.length > 0) {
      mobileStream.forEach((value) => {
        streamId.forEach((child) => {
          if (value.id === child.stream) {
            if (child.type === 'camera') {
              setCameraStream(value);
              console.log(child.type);
            } else if (child.type === 'screen') {
              console.log(child.type);
              setScreenStream(value);
            }
          }
        });
      });
    }
  }, [streamId, mobileStream]);
  const [manualQr, setManualQr] = useState();
  const handleSubmit = async () => {
    // const decodeExpand = expand(manuaQr);
    // console.log(JSON.parse(decodeExpand));
    setLoadBtn(true);
    const peer = new Peer({
      initiator: false,
      trickle: false
    });
    const { data, error } = await supabase
      .from('session_info')
      .select()
      .eq('id', manualQr);
    peer.signal(data[0].sdp.peerData);
    setStreamId(data[0].stream);
    // if (mobileStream.length > 0) console.log(1);
    peer.on('signal', (data) => {
      updateSdp(data);
    });
    peer.on('connect', () => {
      setIsConnect(true);
      setLoadBtn(false);
      toast({
        description: 'Connected successfully',
        status: 'success',
        duration: 9000,
        isClosable: true
      });
    });
    peer.on('stream', (stream) => {
      console.log(stream);
      setMobileStream((prev) => {
        return [...prev, stream];
      });
    });
  };

  const updateSdp = async (peerData) => {
    const { data, error } = await supabase
      .from('session_info')
      .update({ sdp: { type: 'answer', peerData } })
      .eq('id', manualQr);
    console.log(data);
  };

  const handleScan = (data) => {
    if (data) {
      setResult(data);
    }
  };
  const handleError = (err) => {
    console.error(err);
  };
  return (
    <Box
      position="relative"
      display="flex"
      justifyContent="center"
      alignItems="center"
      w="100vw"
      h="100vh"
      bg="#000"
    >
      {mobileStream.length > 0 && isConnect && (
        <>
          <MobileSelector
            cameraStream={cameraStream}
            screenStream={screenStream}
            selfPhoneStream={selfPhoneStream}
            setSelfPhoneStream={setSelfPhoneStream}
            selfDesktopStream={selfDesktopStream}
            setSelfDesktopStream={setSelfDesktopStream}
          />
          <button className="openSpring" onClick={() => setOpen(true)}>
            <Icon as={FiSettings} />
          </button>
        </>
      )}
      {!isQr && (
        <Button colorScheme="teal" onClick={() => setIsQr(true)}>
          Scan
        </Button>
      )}
      {isQr && !isConnect && (
        <Box
          w="100%"
          h="100%"
          display="flex"
          justifyContent="center"
          alignItems="center"
          bg="#fff"
        >
          {/* <QrReader
            delay={delay}
            style={previewStyle}
            onError={handleError}
            onScan={handleScan}
          />
          <Text color="white">{result}</Text> */}
          <Input
            type="text"
            onChange={(e) => setManualQr(e.target.value)}
            placeholder="Enter Qr object"
          />
          <Button
            isLoading={loadBtn ? true : false}
            colorScheme="teal"
            onClick={() => {
              if (manualQr) {
                handleSubmit();
              }
            }}
          >
            submit
          </Button>
          {/* <SketchField
            tool={currTool}
            lineColor="black"
            lineWidth={3}
            ref={sketchRef}
            lineColor={lineColor}
            forceValue
          /> */}
        </Box>
      )}
      <MobileSpring
        open={open}
        setOpen={setOpen}
        sketchRef={sketchRef}
        setCurrTool={setCurrTool}
        lineColor={lineColor}
        setLineColor={setLineColor}
        selfPhoneStream={selfPhoneStream}
        setSelfPhoneStream={setSelfPhoneStream}
        selfDesktopStream={selfDesktopStream}
        setSelfDesktopStream={setSelfDesktopStream}
      />
    </Box>
  );
};

export default Mobile;
