import React, { useRef, useState } from 'react';
import {
  Button,
  Text,
  Icon,
  Box,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Select,
  Option,
  Input
} from '@chakra-ui/react';
import SelectSearch from 'react-select-search';
import { BottomSheet } from 'react-spring-bottom-sheet';
import { BiVideo } from 'react-icons/bi';
import { AiOutlineAudio } from 'react-icons/ai';
import { BsFillPenFill } from 'react-icons/bs';
import { VscDebugDisconnect } from 'react-icons/vsc';
import { BiUndo } from 'react-icons/bi';
import { BiRedo } from 'react-icons/bi';
import { MdClear } from 'react-icons/md';
import { GrFormAdd } from 'react-icons/gr';
import { Tools } from '../../../react-sketch';
import { SketchPicker } from 'react-color';

const options = [
  { name: 'Choose device type', value: '', key: 1 },
  { name: 'Phone', value: 'phone', key: 2 },
  { name: 'Desktop', value: 'desktop', key: 3 }
];

const MobileSpring = (props) => {
  const {
    open,
    setOpen,
    sketchRef,
    setCurrTool,
    lineColor,
    setLineColor,
    selfPhoneStream,
    setSelfPhoneStream,
    selfDesktopStream,
    setSelfDesktopStream
  } = props;
  const [currStream, setCurrStream] = useState(null);
  const focusRef = useRef();
  const [addTextValue, setAddTextValue] = useState('');
  function onDismiss() {
    setOpen(false);
  }
  const handleChange = async (...args) => {
    if (args[0] === '') return;
    // console.log('ARGS:', args);
    if (currStream) {
      console.log(args);
      if (args[0] === 'phone') {
        setSelfDesktopStream(null);
        setSelfPhoneStream(currStream);
      } else if (args[0] === 'desktop') {
        setSelfDesktopStream(currStream);
        setSelfPhoneStream(null);
        console.log('desktop');
      }
    } else {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: { facingMode: 'environment' }
      });
      setCurrStream(stream);
      if (args[0] === 'phone') {
        setSelfDesktopStream(null);
        setSelfPhoneStream(stream);
      } else if (args[0] === 'desktop') {
        setSelfDesktopStream(stream);
        setSelfPhoneStream(null);
      }
    }
  };

  const undo = () => {
    sketchRef.current.undo();
  };

  const redo = () => {
    sketchRef.current.redo();
  };

  const clear = () => {
    sketchRef.current.clear();
  };

  const addText = () => {
    sketchRef.current.addText(addTextValue);
  };

  const handleToolsChange = (e) => {
    setCurrTool(e.target.value);
  };

  const handleColorChange = (color) => {
    setLineColor();
  };
  return (
    <Box>
      <BottomSheet
        open={open}
        onDismiss={onDismiss}
        initialFocusRef={focusRef}
        snapPoints={({ maxHeight }) => maxHeight / 2}
        footer={
          <Box textAlign="center">
            <Button onClick={onDismiss} className="w-full">
              <Icon as={VscDebugDisconnect} w={8} h={8} color="red" />
            </Button>
          </Box>
        }
      >
        <Box display="flex" justifyContent="center" py="5px" mb="10px">
          <SelectSearch
            options={options}
            value=""
            name="device"
            onChange={handleChange}
          />
        </Box>
        <Box display="flex" justifyContent="center" mb="10px" mt="10px">
          <Icon as={BiVideo} w={8} h={8} mr="60px" />
          <Icon as={AiOutlineAudio} w={8} h={8} />
        </Box>
        <Box>
          <Accordion allowMultiple ref={focusRef}>
            <AccordionItem>
              <h2>
                <AccordionButton>
                  <Box flex="1" display="flex" alignItems="center">
                    <Icon as={BsFillPenFill} w={5} h={5} mr="10px" />
                    <Text>Click here to see sketch options</Text>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                <Box display="flex" justifyContent="center" gridGap={10}>
                  <Icon as={BiUndo} w={8} h={8} onClick={undo} />
                  <Icon as={BiRedo} w={8} h={8} onClick={redo} />
                  <Icon as={MdClear} w={8} h={8} onClick={clear} />
                </Box>
                <Box display="flex" justifyContent="center">
                  <SketchPicker
                    color={lineColor}
                    onChangeComplete={(color) => setLineColor(color.hex)}
                  />
                </Box>
                <Box display="flex" mt="8px">
                  <Input
                    placeholder="Add Text..."
                    value={addTextValue}
                    onChange={(e) => setAddTextValue(e.target.value)}
                    variant="flushed"
                    size="sm"
                  />
                  <Icon as={GrFormAdd} w={8} h={8} onClick={addText} />
                </Box>
                <Box display="flex" mt="8px">
                  <Select
                    // placeholder="Select Canvas Tool"
                    onChange={handleToolsChange}
                    variant="flushed"
                  >
                    <option value={Tools.Pencil}>Pencil</option>
                    <option value={Tools.Rectangle}>Rectangle</option>
                    <option value={Tools.Arrow}>Arrow</option>
                    <option value={Tools.Circle}>Circle</option>
                  </Select>
                </Box>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </Box>
      </BottomSheet>
    </Box>
  );
};

export default MobileSpring;
