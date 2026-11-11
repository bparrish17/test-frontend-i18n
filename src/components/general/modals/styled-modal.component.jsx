import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Spinner,
  Center,
  ModalFooter
} from '@chakra-ui/react';

/**
 * @typedef {Object} StyledModalProps
 * @property {React.FC} openButton
 * @property {React.ReactNode} children
 * @property {string} title
 * @property {import('@chakra-ui/react').ModalProps} [modalProps]
 * @property {import('@chakra-ui/react').UseDisclosureReturn} [disclosure]
 * @property {import('@chakra-ui/react').ModalContentProps} [modalContentProps]
 * @property {import('@chakra-ui/react').ModalBodyProps} [modalBodyProps]
 */

/**
 * @description
 * Modal component, which manages its own state by
 * passing `onOpen` to the `openButton` component instance.
 *
 * It will be rendered in place of button that is passed.
 * @example
 * <StyledModal openButton={<Button>Open Modal</Button>}>
 *   Modal Content
 * </StyledModal>
 *
 * @param {StyledModalProps} props
 */
export default function StyledModal({
  openButton,
  title,
  children,
  modalProps,
  modalContentProps,
  isLoading = false,
  modalBodyProps,
  modalHeaderProps,
  modalCloseButtonProps,
  disclosure,
  fullscreen = false,
  customHeader = false,
  customFooter = false
}) {
  let { isOpen, onOpen, onClose } = useDisclosure();
  if (disclosure) {
    isOpen = disclosure.isOpen;
    onOpen = disclosure.onOpen;
    onClose = disclosure.onClose;
  }

  const modalContentFullscreenProps = {
    minW: '100vw',
    minH: '100vh',
    rounded: 'none'
  };

  return (
    <>
      {openButton && (
        <OpenButton
          button={openButton}
          onOpen={onOpen}
        />
      )}
      <Modal
        variant='classic'
        isOpen={isOpen}
        onClose={onClose}
        {...modalProps}
      >
        <ModalOverlay />
        <ModalContent
          mx={{ base: 4, sm: 8, lg: 0 }}
          {...modalContentProps}
          {...(fullscreen && modalContentFullscreenProps)}
        >
          {!customHeader ? (
            <>
              <ModalHeader {...modalHeaderProps}>{title}</ModalHeader>
              <ModalCloseButton
                color='brandPrimary.onPrimary'
                {...modalCloseButtonProps}
              />
            </>
          ) : (
            customHeader
          )}
          {isLoading ? (
            <Center p={11}>
              <Spinner
                size='lg'
                color='brandPrimary.primary'
                thickness='3px'
              />
            </Center>
          ) : (
            <>
              <ModalBody
                w='full'
                position='relative'
                {...modalBodyProps}
              >
                {children}
              </ModalBody>
              {customFooter && <ModalFooter p={0}>{customFooter}</ModalFooter>}
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

function OpenButton({ button, onOpen }) {
  const ButtonComponent = button?.type || Button;
  return button?.props?.icon ? (
    <ButtonComponent
      onClick={onOpen}
      {...button.props}
    >
      {button.props.children}
    </ButtonComponent>
  ) : (
    <ButtonComponent
      icon={button?.props?.icon}
      onClick={onOpen}
      {...button.props}
    />
  );
}
