import React, { useState } from 'react';
import { ChakraProvider, Modal } from '@chakra-ui/react';
import '@/i18n';
// import { getDefaultModalState, MODAL_NONE } from '@/constants/modalState';
// import ModalContext from '@/lib/context/ModalContext';

/**
 * @description
 * the top container that includes all default styles & settings for the rest
 */
const Document: React.FC = (props) => {
  // const [stateModal, setStateModal] = useState(getDefaultModalState());

  // const closeModal = () => {
  //   setStateModal({
  //     ...stateModal,
  //     modalType: MODAL_NONE,
  //     modalBody: <div></div>,
  //   });
  // };

  // const openModal: openModalFunc = ({ type, onYes, onNo }) => {
  //   setStateModal({
  //     ...stateModal,
  //     modalType: type,
  //     onYes: onYes || stateModal.onYes,
  //     onNo: onNo || stateModal.onNo,
  //   });
  // };

  return (
    // <ModalContext.Provider value={{ ...stateModal, openModal, closeModal }}>
    <ChakraProvider>{props.children}</ChakraProvider>
    // </ModalContext.Provider>
  );
};

export default Document;
