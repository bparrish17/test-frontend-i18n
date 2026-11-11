import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  IconButton,
  PopoverArrow,
  ButtonGroup,
  Button,
  useDisclosure
} from '@chakra-ui/react';

import { SFHorizontalDecreaseIcon, SFSearchIcon } from '@assets/icons';
import ColumnFilter from './column-filter.component';
import { useTranslation } from 'react-i18next';

export default function ColumnFilterPopover({ column }) {
  const { t } = useTranslation();

  const { filterVariant } = column.columnDef.meta ?? {};
  const { isOpen, onToggle, onClose } = useDisclosure();

  return (
    <Popover
      placement='top'
      isOpen={isOpen}
      onClose={onClose}
    >
      <PopoverTrigger>
        <IconButton
          icon={
            filterVariant === 'select' ? (
              <SFHorizontalDecreaseIcon
                boxSize='14px'
                mx='3px'
              />
            ) : (
              <SFSearchIcon boxSize={5} />
            )
          }
          variant='reskinGhost'
          size='reskinXs'
          colorScheme={column.getIsFiltered() ? 'brandPrimary' : 'surface'}
          px={0.5}
          isRound
          onClick={(e) => {
            e?.stopPropagation();
            onToggle();
          }}
        />
      </PopoverTrigger>
      <PopoverContent boxShadow='med-light'>
        <PopoverArrow />
        <PopoverBody
          display='flex'
          flexDir='column'
          gap={2}
          px={2}
          pb={2}
        >
          <ColumnFilter column={column} />
          <ButtonGroup
            display='flex'
            alignSelf='flex-end'
          >
            <Button
              variant='reskinLink'
              size='reskinXs'
              alignSelf='flex-end'
              onClick={() => column.setFilterValue(null)}
            >
              {t('columnFilterPopover.reset')}
            </Button>
            <Button
              variant='reskinGhost'
              size='reskinXs'
              alignSelf='flex-end'
              onClick={() => onClose()}
            >
              {t('columnFilterPopover.close')}
            </Button>
          </ButtonGroup>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}
