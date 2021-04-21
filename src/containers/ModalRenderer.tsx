// import ModalContext from '@/lib/context/ModalContext';
// import React, { useContext } from 'react';
// import {
//   Modal,
//   ModalOverlay,
//   ModalCloseButton,
//   ModalContent,
//   ModalBody,
//   ModalFooter,
//   HStack,
//   Button,
// } from '@chakra-ui/react';
// import { MODAL_NONE } from '@/constants/modalState';

// const ModalRenderer = () => {
//   const { modalType, onYes, onNo, closeModal } = useContext(ModalContext);

//   const onClose = () => {
//     closeModal();
//   };

//   return (
//     <Modal isOpen={modalType !== MODAL_NONE} onClose={onClose}>
//       <ModalOverlay />
//       <ModalCloseButton />
//       <ModalContent>
//         <ModalBody>
//           would you like to remove <b>{removeTargetSiteName}</b> ?
//         </ModalBody>
//         <ModalFooter>
//           <HStack>
//             <Button
//               variant="solid"
//               colorScheme="red"
//               onClick={onRemoveSiteConfirm}
//             >
//               Remove
//             </Button>
//             <Button variant="outline" onClick={onClose}>
//               No
//             </Button>
//           </HStack>
//         </ModalFooter>
//       </ModalContent>
//     </Modal>
//   );
// };

// export default ModalRenderer;
