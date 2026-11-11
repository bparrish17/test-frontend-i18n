import { omit } from 'lodash-es';
import { Button } from '@chakra-ui/react';
import SourceModal from '@components/general/modals/source-modal.component';
import SourceModalHeader from '@components/general/modals/source-modal-header.component';
import SourceModalSubheader from '@components/general/modals/source-modal-subheader.component';

export default function SourceButton({ card, sourceInfo, ...props }) {
  return (
    <SourceModal
      headerContent={<SourceModalHeader card={card} />}
      subheaderContent={<SourceModalSubheader card={card} />}
      forceTitle
      card={card}
      sourceInfo={sourceInfo}
      useBoltIcon
    >
      <Button
        display='inline-flex'
        minW={4}
        h={4}
        justifyContent='center'
        alignItems='center'
        px={1}
        mx={1}
        pt='1px'
        bgColor='surface.surfaceDim'
        color='surface.onSurfaceVariant'
        borderRadius='full'
        fontSize='xs'
        data-testid='source-button'
        userSelect='none'
        _hover={{
          bgColor: 'surface.outlineVariant'
          // textDecor: 'underline'
        }}
        {...omit(props, 'node')}
      >
        {props.children}
      </Button>
    </SourceModal>
  );
}
