import ContactSourceIcon from '@components/general/contact-source-icon.component';
import PersonPreview from '@components/general/avatar-preview/person-preview.component';

const RIGHT_RAIL_VARIANT = 'meeting-right-rail';
const MEETING_PREP_VARIANT = 'meeting-prep';
const MEETING_PREP_STYLES = {
  variant: 'card',
  border: 'reskin',
  bgColor: 'surface.containerLow'
};

/**
 * @param {Object} props
 * @param {RIGHT_RAIL_VARIANT | MEETING_PREP_VARIANT} props.variant
 * @param {Person} props.person
 */
export default function MeetingPersonPreview({ variant = RIGHT_RAIL_VARIANT, person }) {
  let styles = {};
  if (variant === MEETING_PREP_VARIANT) {
    styles = MEETING_PREP_STYLES;
  }

  return (
    <PersonPreview
      data-testid={`person-preview-${variant}`}
      person={person}
      avatarBadge={
        <ContactSourceIcon
          contact={person?.contactProfile}
          boxSize='21px'
          position='absolute'
          bottom={-1.5}
          left={-1.5}
        />
      }
      size='sm'
      fontSize='sm'
      {...styles}
    />
  );
}
