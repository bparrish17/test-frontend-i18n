import { Stack, Flex, Tooltip, Box, HStack, Button } from '@chakra-ui/react';
import { LinkedinCircledLogoIcon, SFEnvelopeIcon, SFLinkIcon } from '@assets/icons';
import { useBreakpoints } from '@util/hooks';
import AvatarStack from '@components/general/card/apollo-card/avatar-stack.component';

const buttonProps = {
  as: 'a',
  target: '_blank',
  variant: 'reskinLink',
  size: 'reskinLg',
  px: 3
};

export default function PersonCardHeader({
  email,
  websiteUrl,
  photoUrl,
  name,
  title,
  titleLink,
  subtitle,
  organizationName,
  linkedinUrl,
  isOrganization,
  bgColor = 'light_material.400',
  children,
  ...cardProps
}) {
  const { isMobile } = useBreakpoints();

  if (!isOrganization && title && organizationName) {
    title = `${title} at ${organizationName}`;
  }

  return (
    <Stack
      layerStyle='reskin-card'
      {...cardProps}
      {...(isMobile ? { borderX: 'none' } : {})}
    >
      <Flex
        px={{ base: 4, md: 11 }}
        flexWrap='wrap'
        justify='space-between'
        direction={{ base: 'column', sm: 'row' }}
        py={4}
        gap={4}
      >
        <AvatarStack
          photoUrl={photoUrl}
          name={name}
          subtitle={subtitle}
          title={title}
          link={titleLink}
          bgColor={bgColor}
          size='lg'
        />
        <HStack gap={3}>
          <TooltipButton
            label='LinkedIn Profile Not Available'
            isDisabled={!linkedinUrl}
            isTooltipDisabled={!!linkedinUrl}
            buttonProps={buttonProps}
            leftIcon={<LinkedinCircledLogoIcon boxSize={6} />}
            buttonText='LinkedIn'
            href={linkedinUrl}
          />
          {isOrganization ? (
            <TooltipButton
              label='Website Link Not Available'
              isDisabled={!websiteUrl}
              isTooltipDisabled={!!websiteUrl}
              buttonProps={buttonProps}
              leftIcon={
                <SFLinkIcon
                  boxSize={4}
                  color='brandPrimary.primary'
                />
              }
              buttonText='Website'
              href={websiteUrl}
            />
          ) : (
            <TooltipButton
              label='Email Not Available'
              isDisabled={!email}
              isTooltipDisabled={!!email}
              buttonProps={buttonProps}
              leftIcon={
                <SFEnvelopeIcon
                  boxSize={6}
                  p={0.5}
                  color='brandPrimary.primary'
                />
              }
              buttonText='Email'
              href={`mailto:${email}`}
            />
          )}
        </HStack>
      </Flex>
      <Box px={{ base: 4, md: 11 }}>{children}</Box>
    </Stack>
  );
}

const TooltipButton = ({
  label,
  isTooltipDisabled,
  isDisabled,
  buttonProps,
  leftIcon,
  buttonText,
  href
}) => (
  <Tooltip
    label={label}
    isDisabled={isTooltipDisabled}
  >
    <Button
      {...buttonProps}
      leftIcon={leftIcon}
      isDisabled={isDisabled}
      href={href}
    >
      {buttonText}
    </Button>
  </Tooltip>
);
