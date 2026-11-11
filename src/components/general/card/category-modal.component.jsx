import {
  Icon,
  HStack,
  Stack,
  Text,
  ModalCloseButton,
  RadioGroup,
  Radio,
  Divider,
  Button
} from '@chakra-ui/react';
import { useState } from 'react';
import { find } from 'lodash-es';

import { useUserStore } from '@store/app.store';
import { useInitiatives } from '@services/query-services/initiatives.query-service';
import { SFCalendarIcon } from '@assets/icons';
import StyledModal from '@components/general/modals/styled-modal.component';

// reskin todo: on categoryUpdated action, invalidate queries we're not looking at
// bug: when changing a category on meeting page, then navigating to agenda page it has the old value
export default function CategoryModal({
  disclosure,
  initialValue,
  title = 'Change Meeting Type',
  descriptionText,
  handleCategoryUpdated
}) {
  const user = useUserStore((state) => state?.user);
  const isGuest = user?.isGuest;
  const [selectedCategory, setSelectedCategory] = useState(initialValue);
  const { data: focuses } = useInitiatives({ type: 'Focus' }, { enabled: !!(user && !isGuest) });

  return (
    <StyledModal
      disclosure={disclosure}
      modalProps={{ scrollBehavior: 'inside' }}
      modalContentProps={{ my: 6 }}
      customHeader={
        <HStack
          data-testid='category-modal'
          color='brandPrimary.onPrimary'
          bgColor='brandPrimary.primary'
          p={6}
          alignItems='center'
        >
          <Icon
            as={SFCalendarIcon}
            boxSize='18px'
            color='brandPrimary.onPrimary'
          />
          <Text fontWeight={500}>{title}</Text>
          <ModalCloseButton alignSelf='flex-end' />
        </HStack>
      }
    >
      <RadioGroup
        defaultValue={initialValue}
        onChange={(categoryId) => setSelectedCategory(categoryId)}
      >
        <Stack
          bgColor='surface.surfaceBright'
          p={6}
          style={{ margin: 0 }}
          gap={3}
        >
          {descriptionText && (
            <>
              <Text
                color='surface.onSurfaceVariant'
                fontSize='sm'
                mb={3}
              >
                {descriptionText}
              </Text>
              <Divider />
            </>
          )}
          <Stack
            p={4}
            border='reskin'
            bgColor='surface.containerLow'
            borderWidth='1px'
            borderRadius='lg'
          >
            {(focuses ?? []).map((focus) => (
              <HStack
                justifyContent='space-between'
                p={1}
                key={focus?.id}
              >
                <Text
                  fontSize='xs'
                  color='surface.onSurfaceVariant'
                >
                  {focus?.title}
                </Text>
                <Radio
                  value={focus?.id}
                  data-testid={`focus-${focus?.id}`}
                />
              </HStack>
            ))}
          </Stack>
          <Divider />
          <HStack justifyContent='flex-end'>
            <Button
              type='submit'
              variant='reskinSecondary'
              onClick={disclosure.onClose}
            >
              Cancel
            </Button>
            <Button
              type='submit'
              variant='reskinPrimary'
              onClick={() => handleCategoryUpdated(find(focuses, { id: selectedCategory }))}
            >
              Update
            </Button>
          </HStack>
        </Stack>
      </RadioGroup>
    </StyledModal>
  );
}
