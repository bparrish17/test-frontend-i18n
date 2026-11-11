import { Text } from '@chakra-ui/react';
import { Link as ReactRouterLink } from 'react-router-dom';

import { useUserStore } from '@store/app.store';
import AvatarPreview from './avatar-preview.component';

/**
 * @see {usePopulateMeetingAttendees} for the person interface
 */
export default function PersonPreview({
  person,
  size,
  variant,
  title,
  isLink = true,
  nameProps = {},
  titleProps = {},
  textStackProps = {},
  titleContainerProps = {},
  additionalText,
  avatarBadge,
  enableAvatarUpload = false,
  onAvatarUpload,
  isUploadingAvatar = false,
  ...containerProps
}) {
  const user = useUserStore((state) => state?.user);
  const isGuest = user?.isGuest;

  let params = 'email=' + person?.email;
  if (person?.internalId) {
    params += '&id=' + person?.internalId;
  }

  const linkProps = {
    as: ReactRouterLink,
    to: `/person?${params}`
  };

  return (
    <AvatarPreview
      role='group'
      data-testid='person-preview'
      name={person?.name || person?.email}
      title={
        title ?? (
          <Text>
            <Text
              as='span'
              {...titleProps}
            >
              {person?.title}
            </Text>
            {person?.organizationName && person?.title && ', '}
            <Text
              as='span'
              {...titleProps}
            >
              {person?.organizationName}
            </Text>
          </Text>
        )
      }
      photoUrl={person?.photo_url || person?.avatar_url}
      size={size}
      variant={variant}
      avatarVariant='grayscale'
      nameProps={
        isGuest
          ? {
              color: 'white'
            }
          : {
              ...nameProps,
              ...(isLink && !containerProps?.disabled
                ? {
                    _groupHover: { textDecor: 'underline' }
                  }
                : {})
            }
      }
      titleProps={titleProps}
      textStackProps={textStackProps}
      titleContainerProps={titleContainerProps}
      additionalText={additionalText}
      avatarBadge={avatarBadge}
      enableAvatarUpload={enableAvatarUpload}
      onAvatarUpload={onAvatarUpload}
      isUploadingAvatar={isUploadingAvatar}
      {...(isLink ? linkProps : {})}
      {...containerProps}
    />
  );
}
