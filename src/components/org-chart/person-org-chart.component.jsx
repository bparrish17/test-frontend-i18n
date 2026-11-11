import {
  Box,
  Spinner,
  Stack,
  Text,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
  Center
} from '@chakra-ui/react';
import { useEffect } from 'react';
import { useQueryParam } from 'use-query-params';
import { omit } from 'lodash-es';

import { SFOrgChartIcon } from '@assets/icons';
import { useOrgChartStore } from '@store/org-store.store';
import { useBreakpoints } from '@util/hooks';
import { useOrgPersonById } from '@services/query-services/people.query-service';
import PersonPreview from '@components/general/avatar-preview/person-preview.component';
import OrgChart from './org-chart.component';

export default function PersonOrgChart({ personId }) {
  const [orgChartId, setOrgChartId] = useQueryParam('orgChartId');
  const { data: person, isLoading } = useOrgPersonById(personId);
  const { data: personOrgChart } = useOrgPersonById(orgChartId, {
    enabled: !!orgChartId
  });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const setOrgPerson = useOrgChartStore((state) => state.setOrgPerson);
  const isRootPerson = !person?.manager;

  useEffect(() => {
    setOrgPerson(personOrgChart);
  }, [personOrgChart]);

  useEffect(() => {
    if (orgChartId) {
      onOpen();
    } else {
      onClose();
    }
  }, [orgChartId]);

  const { isMobile } = useBreakpoints();

  if (isLoading) {
    return (
      <Stack
        py={8}
        alignItems='center'
      >
        <Spinner />
      </Stack>
    );
  }

  return (
    <Stack
      w='full'
      gap={8}
    >
      {!isMobile && (
        <>
          <Stack>
            <Text variant='content-section-header'>Manager</Text>
            <PersonNode
              person={isRootPerson ? person?.value : person?.manager}
              nodeType={isRootPerson ? 'person' : 'manager'}
            />
          </Stack>
          <Stack
            w='full'
            direction='row'
            gap={8}
            pl={8}
          >
            {(!isRootPerson || person?.peers?.length > 0) && (
              <GroupStack groupName='Peers'>
                <PersonNode
                  person={person?.value}
                  nodeType='person'
                />
                {person?.peers?.map((peer) => (
                  <PersonNode
                    key={peer?.id}
                    person={peer}
                    nodeType='peer'
                  />
                ))}
              </GroupStack>
            )}
            {person?.reports?.length > 0 && (
              <GroupStack groupName='Reports'>
                {person?.reports.map((report, i) => (
                  <PersonNode
                    index={i}
                    key={report?.id}
                    person={report}
                    selectedPerson={person?.value}
                    nodeType='report'
                  />
                ))}
              </GroupStack>
            )}
          </Stack>
        </>
      )}
      <Center>
        <Button
          as='a'
          target='_blank'
          variant='reskinLink'
          sx={{ '&>span': { color: 'brandPrimary.primary' } }}
          leftIcon={
            <SFOrgChartIcon
              color='brandPrimary.primary'
              boxSize={6}
            />
          }
          onClick={() => {
            setOrgChartId(personId);
            onOpen();
          }}
          cursor='pointer'
        >
          Org Chart
        </Button>
      </Center>
      <Modal
        isCentered
        isOpen={isOpen}
        onClose={() => {
          setOrgChartId(null);
          onClose();
        }}
      >
        <ModalOverlay />
        <ModalContent
          minW='calc(100% - 80px)'
          h='calc(100% - 80px)'
          rounded='xl'
          mx={4}
        >
          <ModalCloseButton
            zIndex='overlay'
            rounded='full'
            color='surface.onSurfaceVariant'
            top={4}
          />
          <ModalBody
            p={0}
            bgColor='surface.surface'
            rounded='xl'
          >
            <OrgChart isOpen={isOpen} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Stack>
  );
}

function GroupStack({ children, groupName }) {
  return (
    <Stack
      maxW='calc(50% - 16px)'
      flex={1}
      gap={3}
    >
      <Text variant='content-section-header'>{groupName}</Text>
      {children}
    </Stack>
  );
}

/**
 * @param {{person: OrgPerson, nodeType: "person" | "manager" | "peer" | "report"}} props
 */
function PersonNode({ person, selectedPerson, nodeType, index }) {
  const personStyles = {
    nameProps: {
      color: 'brandPrimary.onPrimary'
    },
    titleProps: {
      color: 'brandPrimary.fixed'
    },
    bgColor: 'brandPrimary.primary'
  };

  const reportStyles = { bgColor: 'surface.container' };
  const managerStyles = { bgColor: 'surface.container' };

  let styles = {};
  if (nodeType === 'person') {
    styles = personStyles;
  } else if (nodeType === 'report') {
    styles = reportStyles;
  } else if (nodeType === 'manager') {
    styles = managerStyles;
  }

  return (
    <Box
      position='relative'
      border='reskin'
      rounded='lg'
      px={4}
      py={3}
      {...omit(styles, ['nameProps', 'titleProps'])}
    >
      {nodeType === 'peer' && <PeerConnector />}
      {nodeType === 'person' && person?.manager && <PersonConnector />}
      {nodeType === 'report' && <ReportConnector index={selectedPerson?.manager && index} />}
      <PersonPreview
        whiteSpace='nowrap'
        person={{
          ...person,
          photo_url: person?.avatar_url,
          internalId: person?.id
        }}
        size='lg'
        nameProps={{
          ...styles?.nameProps,
          layerStyle: 'ellipsis-text',
          maxW: 'calc(100% - 40px)'
        }}
        title={
          <Text layerStyle='ellipsis-text'>
            {[person?.title, person?.organizationName].filter(Boolean).join(', ')}
          </Text>
        }
        titleProps={{
          ...styles?.titleProps,
          layerStyle: 'ellipsis-text',
          maxW: 'calc(100% - 40px)'
        }}
        titleContainerProps={{ minW: 'full' }}
        textStackProps={{ minW: 'full' }}
      />
    </Box>
  );
}

function PeerConnector() {
  return (
    <Box
      position='absolute'
      top='-56px'
      left='-17px'
      w='17px'
      h='92px'
      border='reskin'
      borderRight='none'
      borderTop='none'
      borderBottomLeftRadius='lg'
    />
  );
}

function PersonConnector() {
  return (
    <Box
      position='absolute'
      top='-66px'
      left='-17px'
      w='17px'
      h='102px'
      border='reskin'
      borderRight='none'
      borderTop='none'
      borderBottomLeftRadius='lg'
      zIndex={1}
    />
  );
}

function ReportConnector({ index }) {
  const firstReportStyles = {
    left: '-33px',
    w: '33px',
    borderLeft: 'none',
    borderBottomLeftRadius: 'none'
  };

  const secondReportStyles = {
    h: '80px',
    top: '-46px'
  };

  let styles = {};
  if (index === 0) {
    styles = firstReportStyles;
  } else if (index === 1) {
    styles = secondReportStyles;
  }

  return (
    <Box
      position='absolute'
      top='-66px'
      left='-17px'
      w='17px'
      h='98px'
      border='reskin'
      borderRight='none'
      borderTop='none'
      borderBottomLeftRadius='lg'
      {...styles}
    />
  );
}
