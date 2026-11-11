// Material Design
import { MdOutlineFilterList, MdQuestionMark, MdLabelOutline } from 'react-icons/md';

// Bootstrap
import { BsDiagram3, BsExclamationCircleFill } from 'react-icons/bs';

// Tabler
import { TbTilde } from 'react-icons/tb';

// BoxIcons

// Feather
import {
  FiAlertTriangle,
  FiCalendar,
  FiChevronRight,
  FiChevronDown,
  FiChevronLeft,
  FiChevronUp,
  FiCheck,
  FiPlus,
  FiMoreVertical,
  FiMoreHorizontal,
  FiEdit,
  FiInfo,
  FiArrowLeft,
  FiArrowRight,
  FiArrowDown,
  FiArrowUp,
  FiExternalLink,
  FiMail,
  FiSearch,
  FiMessageCircle,
  FiMenu,
  FiEye,
  FiEyeOff,
  FiCopy,
  FiLinkedin,
  FiShare2,
  FiLink2,
  FiMinus
} from 'react-icons/fi';

// css.gg
import { CgArrowsExpandRight } from 'react-icons/cg';

// Font Awesome
import { FaUserCheck, FaCheck, FaRegStickyNote, FaLinkedinIn } from 'react-icons/fa';
import { FaWandMagicSparkles } from 'react-icons/fa6';

// Phosphor Icons
import {
  PiTable,
  PiCloudMoonBold,
  PiLightning,
  PiLightningBold,
  PiLightningFill,
  PiCardsBold,
  PiUserBold,
  PiArrowUpRightBold,
  PiFolderSimpleDashed,
  PiBuildingsBold,
  PiX,
  PiQuestionBold,
  PiMagnifyingGlassBold,
  PiArrowsClockwise
} from 'react-icons/pi';

// Grommet Icons
import { GrMail, GrContract } from 'react-icons/gr';

// Hero Icons
import { HiMiniListBullet, HiChevronUpDown } from 'react-icons/hi2';

// Lucide

// Custom
import ColoredCheckCircleIcon from './colored-check-circle.icon';
import DeclineIcon from './decline.icon';
import GoogleIcon from './google.icon';
import MicrosoftIcon from './microsoft.icon';
import SlackIcon from './slack.icon';
import SlackFilledIcon from './slack-filled.icon';
import TeamsIcon from './teams.icon';
import TeamsFilledIcon from './teams-filled.icon';
import MeetLogoIcon from './meet-logo.icon';
import WarnIconTritone from './warn-tritone.icon';
import ZoomLogo from './zoom-logo.icon';
import StatusProcessingIcon from './status-processing.icon';
import StatusPausedIcon from './status-paused.icon';
import StatusNotAdmittedIcon from './status-not-admitted.component';
import StatusSummarizedIcon from './status-summarized.icon';
import StatusUnscheduledIcon from './status-unscheduled.icon';
import StatusLiveUnscheduledIcon from './status-live-unscheduled.icon';
import StatusScheduledIcon from './status-scheduled.icon';
import StatusRecordingIcon from './status-recording.icon';
import StatusDidNotAttendIcon from './status-did-not-attend.icon';
import StatusMissingLinkIcon from './status-missing-link.icon';
import StatusErrorIcon from './status-error.icon';
import LinkedinCircledLogoIcon from './linkedin-circled-logo.icon';
import GaugeStrategic from './gauge-strategic.icon';
import GaugeTactical from './gauge-tactical.icon';
import GaugeBalanced from './gauge-balanced.icon';
import SalesforceIcon from './salesforce.icon';
import UploadIcon from './upload.icon';
import UserSoundIcon from './user-sound.icon';

export * from './sf-icons';

export {
  // FORA Concepts
  FaWandMagicSparkles as InitiativeMatchIcon,
  PiCardsBold as SummaryCardIcon,
  PiLightningBold as InsightIcon,
  PiLightningFill as LightningFillThickIcon, // for thicker replacement of SFBoltFill
  FiEyeOff as ArchiveIcon,
  FiLink2 as ShareIcon,
  PiLightning as MeetingPrepIcon,
  PiBuildingsBold as OrganizationIconBold,
  BsDiagram3 as OrgChartIcon,
  GaugeStrategic as GaugeStrategicIcon,
  GaugeTactical as GaugeTacticalIcon,
  GaugeBalanced as GaugeBalancedIcon,
  MdLabelOutline as LabelIcon,

  // Common Concepts
  FiMail as MailIcon,
  GrMail as MailAltIcon,
  FiCalendar as CalendarIcon,
  FiMessageCircle as MessageDigestIcon,
  FiCheck as CheckIcon, // for checkmark indications that are not archive-related,
  FaCheck as CheckIconBold,
  ColoredCheckCircleIcon as CheckIconCircle,
  MdOutlineFilterList as FilterIcon,
  FaRegStickyNote as NoteIcon,
  FiAlertTriangle as AlertTriangle,
  MdQuestionMark as QuestionIcon,
  PiFolderSimpleDashed as EmptyCollectionIcon,
  PiQuestionBold as QuestionIconBold,
  PiUserBold as UserIconBold,
  UserSoundIcon as SpeakerIcon,
  FaUserCheck as RSVPAcceptedIcon,
  WarnIconTritone,
  StatusProcessingIcon,
  StatusPausedIcon,
  StatusMissingLinkIcon,
  StatusNotAdmittedIcon,
  StatusSummarizedIcon,
  StatusScheduledIcon,
  StatusUnscheduledIcon,
  StatusLiveUnscheduledIcon,
  StatusRecordingIcon,
  StatusDidNotAttendIcon,
  StatusErrorIcon,

  // Arrows & Chevrons
  FiChevronUp as ChevronUpIcon,
  FiChevronDown as ChevronDownIcon,
  FiChevronLeft as ChevronLeftIcon,
  FiChevronRight as ChevronRightIcon,
  FiArrowLeft as ArrowLeftIcon,
  FiArrowRight as ArrowRightIcon,
  FiArrowDown as ArrowDownIcon,
  FiArrowUp as ArrowUpIcon,
  PiArrowUpRightBold as ArrowUpRightIcon,
  CgArrowsExpandRight as ExpandIcon,
  HiChevronUpDown as ExpandVerticalIcon,
  GrContract as ContractIcon,

  // Menus & Navigation
  FiMoreVertical as VerticalDotMenuIcon,
  FiMoreHorizontal as HorizontalDotMenuIcon,
  FiExternalLink as ExternalLinkIcon,
  FiMenu as MenuIcon,
  PiX as CloseIcon,
  HiMiniListBullet as ListIcon,

  // Actions
  FiSearch as SearchIcon,
  PiMagnifyingGlassBold as SearchIconBold,
  FiPlus as PlusIcon,
  FiCopy as CopyIcon,
  FiEdit as EditAltIcon,
  FiShare2 as ShareAltIcon,
  PiArrowsClockwise as RegenerateIcon,
  FiMinus as MinimizeIcon,
  UploadIcon,

  // Logos
  ZoomLogo as ZoomLogoIcon,
  FiLinkedin as LinkedinIcon,
  FaLinkedinIn as LinkedinInIcon,
  GoogleIcon,
  MicrosoftIcon,
  SlackIcon,
  SlackFilledIcon,
  TeamsIcon,
  TeamsFilledIcon,
  MeetLogoIcon,
  LinkedinCircledLogoIcon,
  SalesforceIcon,

  // Misc
  FiInfo as InfoIcon,
  FiEye as EyeIcon,
  FiEyeOff as EyeOffIcon,
  PiTable as TableIcon,
  PiCloudMoonBold as CloudMoonBold,
  TbTilde as TildeIcon,
  DeclineIcon,
  BsExclamationCircleFill as ExclamationCircleIcon
};

/*
No Longer Used, keeping around for reference later:

// Fora Concepts
MorningPressIcon as NewsIcon,

// Common Concepts
FaVideo as VideoIcon,
WarnIconFilled,

// Arrows & Chevrons
BiArrowFromLeft as ArrowFromLeftIcon,

// Menus & Navigation
PiXBold as CloseIconBold,
FiSettings as SettingsIconOutlined,


// Actions
MdAddCircle as AddCircleIcon,
FiUserPlus as AddUserIcon,
FiUserMinus as RemoveUserIcon,
FiMinus as MinusIcon,

// Misc
// FiInfo as InfoIcon,
PiBuildings as OrganizationIcon,
PiBuildingsBold as OrganizationIconBold,
FiUploadCloud as UploadCloudIcon,

*/
