import { useMemo, useEffect } from 'react';
import {
  VStack,
  Text,
  Avatar,
  Stack,
  Button,
  IconButton,
  HStack,
  Tag,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Link as ChakraLink,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverBody
} from '@chakra-ui/react';
import {
  ReactFlow,
  ConnectionLineType,
  Panel,
  Handle,
  useReactFlow,
  getSmoothStepPath,
  BaseEdge
} from '@xyflow/react';
import { Link } from 'react-router-dom';
import { useQueryParam } from 'use-query-params';
import '@xyflow/react/dist/style.css';

import { ChevronDownIcon, ExpandIcon, InfoIcon } from '@assets/icons';
import { useOrgChartStore } from '@store/org-store.store';
import { useBreakpoints, useCopyToClipboard } from '@util/hooks';
import { last } from 'lodash-es';
import { useTranslation } from 'react-i18next';

const SELECTED_PERSON_QUERY_PARAM_NAME = 'orgChartId';
let MAX_REPORTS_PER_RANK = 6;

const OrgChart = ({ isOpen }) => {
  const { t } = useTranslation();

  const person = useOrgChartStore((state) => state.orgPerson);
  const highlightedNodeId = useOrgChartStore((state) => state.highlightedNodeId);
  const setHighlightedNodeId = useOrgChartStore((state) => state.setHighlightedNodeId);
  const setMenuOpenNodeId = useOrgChartStore((state) => state.setMenuOpenNodeId);
  const [selectedPersonId] = useQueryParam(SELECTED_PERSON_QUERY_PARAM_NAME);
  const { isMobile, isTablet } = useBreakpoints();
  const copyToClipboard = useCopyToClipboard();

  useEffect(() => {
    if (isMobile) {
      MAX_REPORTS_PER_RANK = 2;
    } else if (isTablet) {
      MAX_REPORTS_PER_RANK = 4;
    }
  }, [isMobile, isTablet]);

  const reactFlow = useReactFlow();
  const { nodes, edges: builtEdges } = useMemo(
    () => buildNodesAndEdges(person),
    [person, selectedPersonId, isOpen, isMobile, isTablet, MAX_REPORTS_PER_RANK]
  );
  const nodeTypes = useMemo(
    () => ({
      personSelected: OrgPersonSelectedNode,
      report: OrgPersonReportNode,
      peer: OrgPersonPeerNode,
      manager: OrgPersonManagerNode
    }),
    []
  );
  const edgeTypes = useMemo(() => ({ reportsSmoothStepEdge: ReportsSmoothStepEdge }), []);

  // highlight path to hovered over node, dim other edges
  const edges = useMemo(() => {
    if (highlightedNodeId) {
      return builtEdges.map((edge) => {
        if (edge.source === highlightedNodeId || edge.target === highlightedNodeId) {
          return { ...edge, style: { ...edge.style, strokeWidth: 2 } };
        }
        return {
          ...edge,
          style: { ...edge.style, opacity: 0.2 }
        };
      });
    }

    return builtEdges;
  }, [builtEdges, highlightedNodeId]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onResize={reactFlow.fitView}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      onNodesChange={() => {
        setHighlightedNodeId(null);
        setMenuOpenNodeId(null);
        reactFlow.fitBounds({ x: -400, y: -300, width: 1000, height: 1000 });
      }}
      onPaneClick={() => {
        setHighlightedNodeId(null);
        setMenuOpenNodeId(null);
      }}
      proOptions={{ hideAttribution: true }}
      connectionLineType={ConnectionLineType.SmoothStep}
    >
      <Panel
        position='top-right'
        style={{ marginRight: 56 }}
      >
        <HStack>
          <Popover>
            <PopoverTrigger>
              <IconButton
                icon={<InfoIcon size='16px' />}
                color='surface.outline'
                size='sm'
                rounded='full'
                variant='reskinGhost'
                _hover={{ bgColor: 'surface.surfaceDim' }}
              />
            </PopoverTrigger>
            <PopoverContent bgColor='etc.scrim_90'>
              <PopoverArrow bgColor='etc.scrim_90' />
              <PopoverBody>
                <Text
                  fontSize='xs'
                  color='surface.surfaceDim'
                >
                  Note: Please reach out to FORA at{' '}
                  <ChakraLink
                    color='brandPrimary.onPrimary'
                    fontWeight={600}
                    href='mailto:support@fora.day'
                  >
                    {t('orgChart.supportForaDay')}
                  </ChakraLink>{' '}
                  to update the org chart.
                </Text>
              </PopoverBody>
            </PopoverContent>
          </Popover>
          <Menu>
            <MenuButton
              size={{ base: 'sm', md: 'md' }}
              as={Button}
              variant='reskinWhite'
              rightIcon={<ChevronDownIcon />}
            >
              {t('orgChart.options')}
            </MenuButton>
            <MenuList>
              <MenuItem
                onClick={() => {
                  const baseUrl = window.location.origin + window.location.pathname;
                  const emailSearch = `email=${person.value.email}`;
                  const personIdSearch = `id=${selectedPersonId}`;
                  const orgChartIdSearch = `${SELECTED_PERSON_QUERY_PARAM_NAME}=${selectedPersonId}`;
                  const url = `${baseUrl}/?${emailSearch}&${personIdSearch}&${orgChartIdSearch}`;
                  copyToClipboard(url, 'Link');
                }}
              >
                {t('orgChart.share')}
              </MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </Panel>
    </ReactFlow>
  );
};

export default OrgChart;

const NODE_WIDTH = 220;
const NODE_HEIGHT = 140;

const CENTER_POS = { x: 0, y: 0 };
const RANK_GAP = 250;
const PEER_GAP = 50;
const REPORT_GAP = 50;
const REPORTS_OFFSET = 90;

/**
 * @param {OrgPerson} orgPerson
 * @returns {{nodes: import("@xyflow/react").Node[], edges: import("@xyflow/react").Edge[]}}
 */
const buildNodesAndEdges = (orgPerson) => {
  if (!orgPerson) return { nodes: [], edges: [] };
  const { value: selectedPerson, manager, peers, reports } = orgPerson;

  /** @type {import("@xyflow/react").Node[]} */
  const nodes = [];
  /** @type {import("@xyflow/react").Edge[]} */
  const edges = [];

  const edgeType = 'smoothstep';

  // manager
  if (manager) {
    CENTER_POS.y = 0;
    nodes.push({
      id: manager.id,
      data: manager,
      position: { x: CENTER_POS.x, y: CENTER_POS.y - RANK_GAP - 30 /*!*/ },
      type: 'manager'
    });
    edges.push({
      id: `${manager.id}-${selectedPerson.id}`,
      source: manager.id,
      type: edgeType,
      target: selectedPerson.id
    });
  } else {
    // if no manager, move the center position up
    CENTER_POS.y -= RANK_GAP / 2;
  }

  const halfPeers = Math.ceil(peers.length / 2);
  const leftPeers = peers.slice(0, halfPeers);
  const rightPeers = peers.slice(halfPeers);

  // left peers
  leftPeers.forEach((peer, i) => {
    const position = { x: CENTER_POS.x - (PEER_GAP + NODE_WIDTH) * (i + 1), y: CENTER_POS.y + 35 };
    nodes.push({
      id: peer.id,
      data: { ...peer, invert: false },
      type: 'peer',
      position
    });
  });

  // selected person
  nodes.push({
    id: selectedPerson.id,
    data: selectedPerson,
    position: CENTER_POS,
    type: 'personSelected'
  });

  // right peers
  rightPeers.forEach((peer, i) => {
    const position = { x: CENTER_POS.x + (PEER_GAP + NODE_WIDTH) * (i + 1), y: CENTER_POS.y + 35 };
    nodes.push({
      id: peer.id,
      data: { ...peer, invert: true },
      type: 'peer',
      position
    });
  });

  // hey K, refactor peer nodes and edges please and their positioning
  const firstPeer = last(leftPeers);
  const lastPeer = last(rightPeers);

  edges.push({
    id: `${firstPeer?.id}-${selectedPerson?.id}`,
    source: firstPeer?.id,
    type: edgeType,
    target: lastPeer?.id,
    sourceHandle: 'right',
    targetHandle: 'left'
  });

  // reports
  reports.forEach((report, i, arr) => {
    const rank = Math.floor(i / MAX_REPORTS_PER_RANK) + 1;
    const rankIndex = i % MAX_REPORTS_PER_RANK;
    const nodesInRank = Math.min(
      MAX_REPORTS_PER_RANK,
      arr.length - (rank - 1) * MAX_REPORTS_PER_RANK
    );

    const startX = CENTER_POS.x - ((NODE_WIDTH + REPORT_GAP) * (nodesInRank - 1)) / 2;
    const x = startX + rankIndex * (NODE_WIDTH + REPORT_GAP);
    const y = CENTER_POS.y + rank * RANK_GAP + REPORTS_OFFSET;
    const position = { x, y };

    nodes.push({ id: report.id, data: report, type: 'report', position });
    edges.push({
      id: `${selectedPerson.id}-${report.id}`,
      source: selectedPerson.id,
      target: report.id,
      type: 'reportsSmoothStepEdge',
      data: { rank },
      style: { stroke: '#2D7AE6' },
      animated: false
    });
  });

  return { nodes, edges };
};

/** @param {{ id: string, data: Person, handles: import('@xyflow/react').HandleProps[] }} */
const BaseConnectedNode = ({ id, data, handles, showDepartments = false }) => {
  const highlightedNodeId = useOrgChartStore((state) => state.highlightedNodeId);
  const setHighlightedNodeId = useOrgChartStore((state) => state.setHighlightedNodeId);
  const menuOpenNodeId = useOrgChartStore((state) => state.menuOpenNodeId);
  const setMenuOpenNodeId = useOrgChartStore((state) => state.setMenuOpenNodeId);
  const setSelectedPersonId = useQueryParam(SELECTED_PERSON_QUERY_PARAM_NAME)[1];

  const isCurrentNodeMenuOpen = menuOpenNodeId === id;
  const isCurrentNodeHighlighted = highlightedNodeId === id;
  const isMenuOpen = isCurrentNodeMenuOpen || !!menuOpenNodeId;

  return (
    <>
      {handles.map((handle) => (
        <Handle
          key={`${id}-${handle.type}-${handle.position}-${handle.id}`}
          {...handle}
        />
      ))}

      <VStack
        position='relative'
        role='group'
        onMouseEnter={() => {
          if (!isMenuOpen) {
            setHighlightedNodeId(id);
          }
        }}
        onMouseLeave={() => {
          if (!isMenuOpen) {
            setHighlightedNodeId(null);
          }
        }}
        opacity={highlightedNodeId && !isCurrentNodeHighlighted ? 0.5 : 1}
        transitionProperty='opacity'
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setMenuOpenNodeId(isCurrentNodeMenuOpen ? null : id);
          setHighlightedNodeId(id);
        }}
        transitionDuration='500ms'
        p={2}
        rounded='lg'
        w={NODE_WIDTH}
        h={NODE_HEIGHT}
        gap={0}
        textAlign='center'
        _hover={{ cursor: 'pointer !important' }}
      >
        <NodeMenu
          isOpen={isCurrentNodeMenuOpen}
          person={data}
        />
        <Avatar
          border='2px solid'
          borderColor='surface.surface !important'
          position='relative'
          transition='all 100ms'
          size='lg'
          src={data.avatar_url}
          _groupHover={{
            borderColor: 'brandPrimary.primary !important'
          }}
          sx={{
            '&>img': {
              filter: 'grayscale(1)'
            }
          }}
        >
          <IconButton
            opacity={0}
            _groupHover={{
              opacity: 1
            }}
            position='absolute'
            bottom={-2}
            right={-2}
            isRound
            size='sm'
            icon={<ExpandIcon size={15} />}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setSelectedPersonId(data.id, 'replaceIn');
            }}
          />
        </Avatar>
        <Text
          zIndex={1}
          color={isCurrentNodeHighlighted && 'brandPrimary.primary'}
          mt={1}
          fontSize='xl'
          fontWeight={600}
        >
          {data.name}
        </Text>
        <Text color='surface.onSurfaceVariant'>{data.title}</Text>
        {showDepartments && (
          <HStack>
            {data.departments.map((department) => (
              <Tag
                key={department}
                size='sm'
                colorScheme='brandPrimary'
                rounded='lg'
              >
                {department}
              </Tag>
            ))}
          </HStack>
        )}
      </VStack>
    </>
  );
};

/** @param {{ data: Person }} */
const OrgPersonReportNode = ({ id, data }) => {
  const handles = [
    { type: 'target', position: 'top', style: { opacity: 0 } },
    { type: 'source', position: 'bottom', style: { opacity: 0 } }
  ];

  return (
    <BaseConnectedNode
      id={id}
      data={data}
      handles={handles}
    />
  );
};

/** @param {{ data: Person }} */
const OrgPersonManagerNode = ({ id, data }) => {
  const handles = [
    { type: 'target', position: 'top', style: { opacity: 0, top: 0 } },
    { type: 'source', position: 'bottom', style: { opacity: 0, bottom: -20 } }
  ];

  return (
    <BaseConnectedNode
      id={id}
      data={data}
      handles={handles}
      showDepartments
    />
  );
};

/** @param {{ data: Person }} */
const OrgPersonPeerNode = ({ id, data }) => {
  const handles = [
    {
      type: 'source',
      id: 'right',
      position: 'right',
      style: { opacity: 0, top: 40, left: NODE_WIDTH / 2 }
    },
    {
      type: 'target',
      id: 'left',
      position: 'left',
      style: { opacity: 0, top: 40, left: NODE_WIDTH / 2 }
    }
  ];

  return (
    <BaseConnectedNode
      id={id}
      data={data}
      handles={handles}
    />
  );
};

/** @param {{ data: Person }} */
const OrgPersonSelectedNode = ({ data }) => {
  const orgPerson = useOrgChartStore((state) => state.orgPerson);

  return (
    <>
      <Handle
        type='target'
        position='top'
        style={{ opacity: 0, top: 40 }}
      />
      <Handle
        type='target'
        id='right'
        position='right'
        style={{ opacity: 0, top: 70 }}
      />
      <Handle
        type='target'
        id='left'
        position='left'
        style={{ opacity: 0, top: 70 }}
      />
      <Handle
        type='source'
        position='bottom'
        style={{ opacity: 0, bottom: -10 }}
      />
      <Handle
        type='source'
        id='right'
        position='right'
        style={{ opacity: 0, top: 70 }}
      />
      <Handle
        type='source'
        id='left'
        position='left'
        style={{ opacity: 0, top: 70 }}
      />

      <VStack
        p={2}
        rounded='lg'
        w={NODE_WIDTH}
        h={NODE_HEIGHT + 80}
        gap={0}
        textAlign='center'
        pos='relative'
      >
        <Avatar
          border='8px solid'
          borderColor='surface.surface !important'
          size='2xl'
          src={data?.avatar_url}
          filter='grayscale(1)'
        />
        <Text
          mt={1}
          fontSize='2xl'
          fontWeight={600}
        >
          {data?.name}
        </Text>
        <Text
          color='surface.onSurfaceVariant'
          fontSize='lg'
        >
          {data?.title}
        </Text>
        <HStack>
          {data?.departments?.map((department) => (
            <Tag
              key={department}
              size='sm'
              colorScheme='brandPrimary'
              rounded='lg'
            >
              {department}
            </Tag>
          ))}
        </HStack>

        {/* Helper text */}
        {orgPerson?.reports?.length > 0 && (
          <Text
            top={NODE_HEIGHT + 150}
            left={NODE_WIDTH / 2 + 30}
            pos='absolute'
            pointerEvents='none'
            color='surface.onSurfaceVariant'
            fontSize='lg'
            zIndex='overlay'
          >
            Reports
          </Text>
        )}

        {orgPerson?.peers?.length > 0 && (
          <Text
            top={75}
            left={NODE_WIDTH}
            pos='absolute'
            pointerEvents='none'
            color='surface.onSurfaceVariant'
            fontSize='lg'
            zIndex='overlay'
          >
            Peers
          </Text>
        )}

        {orgPerson?.manager && (
          <Text
            top={-20}
            left={22}
            pos='absolute'
            pointerEvents='none'
            color='surface.onSurfaceVariant'
            fontSize='lg'
            zIndex='overlay'
            transform='rotate(-90deg)'
          >
            Manager
          </Text>
        )}
      </VStack>
    </>
  );
};

const NodeMenu = ({ isOpen, person }) => {
  const { t } = useTranslation();

  const setSelectedPersonId = useQueryParam(SELECTED_PERSON_QUERY_PARAM_NAME)[1];

  if (!isOpen) {
    return null;
  }

  return (
    <Stack
      border='reskin'
      borderColor='brandPrimary.primary'
      bgColor='surface.surfaceBright'
      rounded='lg'
      p={3}
      pos='absolute'
      left={40}
      bottom={16}
      zIndex='overlay'
      textAlign='left'
    >
      <Text
        textTransform='uppercase'
        letterSpacing='20%'
        color='surface.outline'
        fontWeight={500}
      >
        {t('orgChart.options')}
      </Text>
      <Button
        as={Link}
        to={`/person?email=${person.email}&id=${person.id}`}
        variant='ghost'
        colorScheme='light_material'
        onClick={(e) => e.stopPropagation()}
      >
        {t('orgChart.viewProfile')}
      </Button>
      <Button
        variant='ghost'
        colorScheme='light_material'
        onClick={(e) => {
          e.stopPropagation();
          setSelectedPersonId(person.id, 'replaceIn');
        }}
      >
        {t('orgChart.seeMore')}
      </Button>
    </Stack>
  );
};

const ReportsSmoothStepEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style,
  data
}) => {
  const offset = RANK_GAP * (data.rank - 1);

  const adjustedSourceY = sourceY + offset;

  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY: adjustedSourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 20
  });

  const adjustedEdgePath = edgePath.replace(
    `${sourceX} ${adjustedSourceY}`,
    `${sourceX} ${sourceY}`
  );

  return (
    <BaseEdge
      id={id}
      path={adjustedEdgePath}
      style={{ transition: 'opacity 200ms', ...style }}
    />
  );
};
