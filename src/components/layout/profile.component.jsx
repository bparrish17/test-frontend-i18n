import {
  Avatar,
  Button,
  Divider,
  Link,
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@chakra-ui/react';
import { Link as ReactRouterLink } from 'react-router-dom';
import { useUserStore } from '@store/app.store';
import PersonPreview from '@components/general/avatar-preview/person-preview.component';

const avatarStyles = {
  bgColor: 'brandSecondary.primary',
  color: 'brandSecondary.onPrimary'
};

const linkProps = (onClose) => ({
  as: ReactRouterLink,
  textStyle: 'label-600-md',
  onClick: onClose
});

export default function Profile() {
  const user = useUserStore((state) => state.user);
  const isGuest = user?.isGuest;

  return (
    <Popover
      placement='bottom-start'
      offset={[0, -40]}
    >
      {({ onClose }) => (
        <>
          <PopoverTrigger>
            <Button
              variant='unstyled'
              w='fit-content'
            >
              {!!user && (
                <Avatar
                  name={user?.name}
                  size={10}
                  src={user.avatar_url ?? user?.apollo_profile?.photo_url}
                  {...avatarStyles}
                  cursor='pointer'
                />
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            py={4}
            shadow='xl'
            flexDir='column'
            rounded='md'
            bgColor='brandPrimary.onSurface'
            border='none'
            gap={3}
            p={3}
            color='brandPrimary.onPrimary'
            boxShadow='dark'
          >
            <PersonPreview
              person={{ ...user, title: getUserTypeText(user?.type, isGuest) }}
              isLink={false}
              size='xl'
              nameProps={{ color: 'brandPrimary.onPrimary' }}
              titleProps={{ color: 'brandPrimary.onPrimary' }}
            />
            <Divider borderColor='brandPrimary.onPrimaryFixed' />
            <Link
              to='/settings/account'
              {...linkProps(onClose)}
            >
              Profile Settings
            </Link>
            {/* <Link {...linkProps(onClose)}>Download FORA for iOS</Link> */}
            <Divider borderColor='brandPrimary.onPrimaryFixed' />
            <Link
              {...linkProps(onClose)}
              to='/logout'
            >
              Sign Out
            </Link>
          </PopoverContent>
        </>
      )}
    </Popover>
  );
}
function getUserTypeText(userType, isGuest) {
  if (isGuest) {
    return 'Guest User';
  }
  switch (userType) {
    case 'Associate': {
      return 'Lite User';
    }
    case 'Admin': {
      return 'Admin User';
    }
    case 'Executive': {
      return 'Executive User';
    }
    default: {
      return 'Pro User';
    }
  }
}
