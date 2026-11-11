import { Button, Icon, Stack } from '@chakra-ui/react';
import { scrollRefIntoView } from '@util/helpers';
import { useMemo } from 'react';

/**
 * @typedef {Object} MeetingSectionNavigationProps
 * @property {MeetingSectionObject[]} sections
 * @property {React.MutableRefObject} meetingPageRef
 *
 * @param {MeetingSectionNavigationProps} props
 */
export default function MeetingPageSectionNavigation({ sections }) {
  const enabledSections = useMemo(
    () => Object.values(sections)?.filter((section) => section.enabled && !section.hideNavigation),
    [sections]
  );

  return (
    <Stack>
      {enabledSections?.map((section) => {
        return (
          <Button
            variant='link'
            order={section?.order}
            key={section.name}
            color='surface.onSurfaceVariant'
            fontWeight={600}
            lineHeight='32px'
            leftIcon={
              <Icon
                as={section?.icon}
                boxSize={5}
              />
            }
            iconSpacing={3}
            w='fit-content'
            onClick={() => scrollRefIntoView(section.ref, { top: -32 })}
          >
            {section?.name}
          </Button>
        );
      })}
    </Stack>
  );
}

/*
SCROLL ALIGNMENT LOGIC:
const meetingPageRef = useRefStore((state) => state.mainRef);

const [closestToCenterSection, setClosestToCenterSection] = useState(0);
const sectionRefs = sections?.map((s) => s?.ref);
const findClosestToStartSection = useCallback(() => {
  if (!sectionRefs.length) {
    return;
  }

  const screenStartOffset = window.innerHeight / 6;

  const sectionOffsets = sectionRefs?.map((ref) => {
    return ref?.current?.getBoundingClientRect().top;
  });

  const closestToCenterOffset = sectionOffsets?.reduce((prev, curr) => {
    return Math.abs(curr - screenStartOffset) < Math.abs(prev - screenStartOffset) ? curr : prev;
  }, Infinity);

  return sectionOffsets.indexOf(closestToCenterOffset);
}, [sectionRefs, meetingPageRef]);

useEffect(() => {
  if (!meetingPageRef?.current) {
    return;
  }

  const handleScroll = () => {
    const closestToCenterSection = findClosestToStartSection();
    setClosestToCenterSection(closestToCenterSection);
  };

  meetingPageRef.current.addEventListener('scroll', handleScroll);

  return () => meetingPageRef?.current?.removeEventListener('scroll', handleScroll);
}, [findClosestToStartSection]);

// ...
      {sections?.map((section, i) => {
                const isSectionClosestToCenter = closestToCenterSection === i;

        return (
          <Button
            variant="link"
            order={section?.order}
            key={section.name}
            onClick={() => scrollRefIntoView(section.ref, { top: -32 })}
            color={isSectionClosestToCenter ? 'surface.onSurface' : 'surface.onSurfaceVariant'}
            textDecor={isSectionClosestToCenter && 'underline'}
            fontWeight={isSectionClosestToCenter && 600}
            lineHeight="32px"
            w="fit-content"
          >
            {section?.name}
          </Button>
        );
      })}


*/
