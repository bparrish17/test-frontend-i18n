import { Stack, Text, Button, Icon, HStack, StackDivider } from '@chakra-ui/react';
import { values } from 'lodash-es';

import { scrollRefIntoView } from '@util/helpers';
import { SFExclamationMarkTriangleOutlined, SFXMarkFilled } from '@assets/icons';
import LensIcon from '@assets/icons/sf-icons/lens.icon';
import { useBreakpoints } from '@util/hooks';
import { useLensActivation } from '@services/query-services/lens-activation.query-service';
import {
  DeactivateLensModal,
  ReactivateLensModal
} from '@components/lens/lens-activation-modals.component';

export default function CreateLensRightRail({ lensForm, setTabIndex, isEdit }) {
  const { sections, formState, getValues, isViewOnlyMode } = lensForm;
  const navSections = values(sections);

  const { isMobile } = useBreakpoints();

  const navigateToLensFormSection = async (section) => {
    if (isMobile) {
      setTabIndex(0);
      // address the race condition in which the page attempts to scroll before the tab is switched
      setTimeout(null, 10);
    }

    return scrollRefIntoView(section.ref, { top: -32 });
  };

  const isArchived = !!getValues('archived_at');

  return (
    <Stack
      p={11}
      gap={11}
    >
      <Text variant='content-section-header'>Options</Text>
      <Stack
        gap={5}
        divider={<StackDivider style={{ margin: 0 }} />}
      >
        <Stack gap={5}>
          {navSections?.map((section) => {
            return (
              <Button
                key={section.name}
                variant='link'
                w='fit-content'
                color='surface.onSurfaceVariant'
                fontWeight={500}
                leftIcon={
                  <Icon
                    as={section?.icon}
                    boxSize={7}
                    p={1}
                  />
                }
                onClick={() => navigateToLensFormSection(section)}
              >
                {section?.name}
              </Button>
            );
          })}
        </Stack>
        {/*

        https://foraday.atlassian.net/browse/FORA-880

        <Button
          {...buttonProps}
          leftIcon={<Icon as={EyeIcon} boxSize={5} />}
          onClick={previewDisclosure.onOpen}
          isDisabled={!formState?.isValid || isViewOnlyMode}
        >
          Preview Lens Sources
        </Button>
        */}
        {isEdit && !isViewOnlyMode && !isArchived && (
          <DeactivateLensLink lensId={getValues('id')} />
        )}
        {isEdit && !isViewOnlyMode && isArchived && <ReactivateLensLink lensId={getValues('id')} />}
      </Stack>
      {isEdit && formState?.isDirty && (
        <HStack>
          <SFExclamationMarkTriangleOutlined
            color='critical.primary'
            m={0.5}
          />
          <Text fontWeight={500}>You have unsaved changes.</Text>
        </HStack>
      )}
    </Stack>
  );
}

const buttonProps = {
  variant: 'link',
  color: 'surface.onSurfaceVariant',
  w: 'fit-content',
  fontWeight: 500
};

function DeactivateLensLink({ lensId }) {
  const { disclosure, deactivateLens } = useLensActivation();

  return (
    <>
      <Button
        {...buttonProps}
        leftIcon={
          <Icon
            as={SFXMarkFilled}
            boxSize={7}
            p={1}
          />
        }
        onClick={disclosure.onOpen}
      >
        Deactivate Lens
      </Button>
      <DeactivateLensModal
        disclosure={disclosure}
        onConfirm={() => deactivateLens(lensId)}
      />
    </>
  );
}

function ReactivateLensLink({ lensId }) {
  const { disclosure, reactivateLens } = useLensActivation();
  return (
    <>
      <Button
        {...buttonProps}
        leftIcon={
          <Icon
            as={LensIcon}
            boxSize={7}
            p={1}
          />
        }
        onClick={disclosure.onOpen}
      >
        Reactivate Lens
      </Button>
      <ReactivateLensModal
        disclosure={disclosure}
        onConfirm={() => reactivateLens(lensId)}
      />
    </>
  );
}
