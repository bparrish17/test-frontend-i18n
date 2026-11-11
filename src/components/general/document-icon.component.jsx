import { Box, HStack, Icon, Tag } from '@chakra-ui/react';

const DocumentOutline = (props) => (
  <Icon
    width='17px'
    height='21px'
    viewBox='0 0 17 21'
    fill='none'
    {...props}
  >
    <path
      d='M0.825521 11.5556V3.51042C0.825521 1.61458 1.77344 0.648438 3.65104 0.648438H7.98047C9.0013 0.648438 9.57552 0.803385 10.2682 1.51432L15.2904 6.6276C16.0195 7.375 16.1563 7.88542 16.1563 9.0612V17.3372C16.1563 19.2331 15.2174 20.1901 13.3307 20.1901H12.7778C13.1667 19.8012 13.1667 19.3333 13.1667 18.7227H13.2578C14.2057 18.7227 14.6888 18.2214 14.6888 17.3099V9.125H9.49349C8.35417 9.125 7.77995 8.5599 7.77995 7.41146V2.11589H3.72396C2.77604 2.11589 2.29297 2.63542 2.29297 3.53776V11.5556C1.88889 11.5556 1.79167 11.5556 1.54557 11.5556C1.30859 11.5556 1.11111 11.5556 0.825521 11.5556ZM9.15625 7.23828C9.15625 7.60286 9.29297 7.7487 9.65755 7.7487H14.4063L9.15625 2.39844V7.23828Z'
      fill='currentColor'
    />
  </Icon>
);

const ExtensionTag = ({ extension, ...props }) => {
  const styleByExtension = {
    pdf: { bgColor: 'critical.primary' },
    doc: {
      bgColor: 'brandSecondary.primary',
      fontSize: '6px',
      letterSpacing: -0.15,
      lineHeight: '9px',
      minW: '17px'
    },
    docx: {
      bgColor: 'brandSecondary.primary',
      fontSize: '6px',
      letterSpacing: -0.25,
      lineHeight: '9px',
      minW: '20.5px'
    },
    xls: { bgColor: 'positive.primary' },
    xlsx: {
      bgColor: 'positive.primary',
      minW: '20.5px'
    },
    csv: {
      bgColor: 'positive.primary',
      minW: '17.5px'
    },
    txt: { bgColor: 'brandSecondary.primary' }
  };

  return (
    <HStack
      w={6}
      justify='end'
      {...props}
    >
      <Tag
        minW='15.2px'
        py={0.25}
        px={0.5}
        w='min-content'
        color='brandSecondary.onPrimary'
        borderRadius={3}
        textStyle='label-500-sm'
        fontSize='6.2px'
        lineHeight='131.25%'
        textTransform='uppercase'
        pointerEvents='none'
        userSelect='none'
        {...styleByExtension[extension]}
      >
        {extension}
      </Tag>
    </HStack>
  );
};

/**
 * @param {Object} props
 * @param {"pdf" | "doc" | "docx" | "xls" | "xlsx" | "csv" | "txt"} props.extension - The file extension to display.
 */
const DocumentIcon = ({ extension }) => {
  return (
    <Box
      w={6}
      h='min-content'
      position='relative'
    >
      <DocumentOutline color='brandPrimary.onContainer' />
      <ExtensionTag
        extension={extension}
        position='absolute'
        bottom={0}
        left={-3}
      />
    </Box>
  );
};

export default DocumentIcon;
