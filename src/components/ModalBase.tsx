import {
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
} from '@chakra-ui/modal';
import React from 'react';

interface ModalBaseType {
  isOpen: boolean;
  onClose: () => void;
}
const ModalBase: React.FC<ModalBaseType> = (props) => {
  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        {props.children}
      </ModalContent>
    </Modal>
  );
};

export default ModalBase;
