import React, { useState, useEffect } from 'react';
import Peer from 'simple-peer';
import QRCode from 'qrcode.react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Box,
  Input,
  useToast
} from '@chakra-ui/react';
import { reduce } from '../../../helper/helper';
import { supabase } from '../../../supabase/supabaseClient';

const BarModal = (props) => {
  const toast = useToast();
  const { isOpen, onClose, mediaStream, screenStream } = props;
  const [qr, setQr] = useState(null);
  const [speer, setSpeer] = useState(null);
  const [manualQr, setManualQr] = useState({});
  const [sessionId, setSessionId] = useState(null);
  useEffect(() => {
    // if (!mediaStream && !screenStream) return;
    // let streamData = [];
    // if (mediaStream && !screenStream) {
    //   streamData = [mediaStream];
    // } else if (!mediaStream && screenStream) {
    //   streamData = [screenStream];
    // } else if (mediaStream && screenStream) {
    //   streamData = [mediaStream, screenStream];
    // }
    // const peer = new Peer({
    //   initiator: true,
    //   trickle: true,
    //   streams: streamData
    // });
    // peer.on('signal', (data) => {
    //   const reducedSdp = reduce(data);
    //   if (reducedSdp !== undefined) {
    //     // console.log(JSON.stringify(data));
    //     // console.log(reducedSdp);
    //     setQr(reducedSdp);
    //   }
    // });
    // peer.on('error', (err) => console.log(err));
    // peer.on('connect', () => {
    //   toast({
    //     description: 'Connected successfully',
    //     status: 'success',
    //     duration: 9000,
    //     isClosable: true
    //   });
    //   onClose();
    // });
    // setSpeer(peer);
  }, [mediaStream, screenStream]);
  const handleSubmit = () => {
    speer.signal(JSON.parse(manualQr));
  };
  const generateQr = () => {
    if (!mediaStream && !screenStream) return;
    let streamData = [];
    let streamId = [];
    if (mediaStream && !screenStream) {
      streamData = [mediaStream];
      streamId = [{ type: 'camera', stream: mediaStream.id }];
    } else if (!mediaStream && screenStream) {
      streamData = [screenStream];
      streamId = [{ type: 'screen', stream: screenStream.id }];
    } else if (mediaStream && screenStream) {
      streamData = [mediaStream, screenStream];
      streamId = [
        { type: 'camera', stream: mediaStream.id },
        { type: 'screen', stream: screenStream.id }
      ];
    }
    const peer = new Peer({
      initiator: true,
      trickle: false,
      streams: streamData
    });
    peer.on('signal', (peerData) => {
      insertSdp(peerData, peer, streamId);
    });
    peer.on('connect', () => {
      toast({
        description: 'Connected successfully',
        status: 'success',
        duration: 9000,
        isClosable: true
      });
      onClose();
    });
  };

  const insertSdp = async (peerData, peer, streamId) => {
    const { data, error } = await supabase
      .from('session_info')
      .insert([{ sdp: { type: 'offer', peerData }, stream: streamId }]);
    // console.log(data);
    setSessionId(data[0].id);
    console.log(data[0].id);
    // Get sdp answer from db
    const sdpInt = setInterval(async () => {
      const { data: secondData, error } = await supabase
        .from('session_info')
        .select()
        .eq('id', data[0].id);
      // console.log(secondData);
      if (secondData[0].sdp.type === 'answer') {
        clearInterval(sdpInt);
        peer.signal(secondData[0].sdp.peerData);
        console.log(true);
      } else {
        console.log(false);
      }
    }, 5000);
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Scan Barcode</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box display="flex" justifyContent="center">
            {sessionId && <QRCode value={`${sessionId}`} size={300} />}
          </Box>
          {!sessionId && (
            <Box display="flex" justifyContent="center">
              <Button onClick={generateQr}>Generate QR</Button>
            </Box>
          )}
          {/* <Box display="none" mt="10px">
            <Input
              type="text"
              onChange={(e) => setManualQr(e.target.value)}
              placeholder="Enter Qr code"
            />
            <Button onClick={handleSubmit}>submit</Button>
          </Box> */}
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default BarModal;
