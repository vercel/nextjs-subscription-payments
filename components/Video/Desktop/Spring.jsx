import React, { useState } from 'react';
import { Box, Icon } from '@chakra-ui/react';
import { AiOutlineCamera } from 'react-icons/ai';
import { BiCameraOff } from 'react-icons/bi';
import { CgScreen } from 'react-icons/cg';
import { ImConnection } from 'react-icons/im';
import { MdDesktopAccessDisabled } from 'react-icons/md';
import { BottomSheet } from 'react-spring-bottom-sheet';
import BarModal from './BarModal';
import { useDisclosure, useToast } from '@chakra-ui/react';
import 'react-spring-bottom-sheet/dist/style.css';

const Spring = (props) => {
  const {
    isCamera,
    setIsCamera,
    isScreen,
    setIsScreen,
    screenStream,
    mediaStream
  } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const toast = useToast();
  function onDismiss() {
    setOpen(false);
  }
  const openBarModal = () => {
    if ((mediaStream || screenStream) && (isScreen || isCamera)) {
      setOpen(false);
      // setOpenModal(!openModal);
      setTimeout(() => {
        onOpen();
      }, 100);
    } else {
      setOpen(false);
      toast({
        description:
          'You need to use camera or screen sharing before connecting',
        status: 'warning',
        duration: 9000,
        isClosable: true,
        position: 'top'
      });
    }
  };

  return (
    <div>
      <button className="openSpring" onClick={() => setOpen(true)}>
        Open
      </button>
      <BottomSheet
        open={open}
        onDismiss={onDismiss}
        snapPoints={({ minHeight }) => minHeight}
      >
        <Box display="flex" justifyContent="center" py="5px">
          <Box mr="40px" ml="40px">
            <button
              className="camera_btn"
              onClick={() => setIsCamera(!isCamera)}
            >
              {isCamera ? (
                <Icon as={BiCameraOff} w={23} h={23} />
              ) : (
                <Icon as={AiOutlineCamera} w={23} h={23} />
              )}
            </button>
          </Box>
          <Box mr="40px" ml="40px">
            <button
              className="camera_btn"
              onClick={() => setIsScreen(!isScreen)}
            >
              {isScreen ? (
                <Icon as={MdDesktopAccessDisabled} w={23} h={23} />
              ) : (
                <Icon as={CgScreen} w={23} h={23} />
              )}
            </button>
          </Box>
          <Box mr="40px" ml="40px">
            <div className="camera_btn" onClick={openBarModal}>
              <Icon as={ImConnection} w={23} h={23} />
            </div>
          </Box>
        </Box>
      </BottomSheet>
      <BarModal
        isOpen={isOpen}
        onClose={onClose}
        mediaStream={mediaStream}
        screenStream={screenStream}
      />
    </div>
  );
};

export default Spring;
