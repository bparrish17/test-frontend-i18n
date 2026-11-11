import {
  Button,
  Divider,
  Flex,
  Heading,
  IconButton,
  Stack,
  StackDivider,
  Text
} from '@chakra-ui/react';
import { map } from 'lodash-es';
import { buttonTheme } from '@styles/component-themes/button.theme';
import {
  HorizontalDotMenuIcon,
  SFBookmarkIcon,
  SFCalendarIcon,
  SFDocOutlinedIcon,
  SFPlusIcon,
  SFTwoBuildings,
  SFVideoFilled
} from '@assets/icons';

export default function ButtonSection() {
  return (
    <Stack gap={8}>
      <Heading
        size='lg'
        textAlign='center'
      >
        Buttons
      </Heading>
      <Divider />
      <Stack divider={<StackDivider style={{ margin: '32px' }} />}>
        {map(buttonTheme.sizes, (_sizeProps, size) => (
          <Flex
            key={`${size}-button-stack`}
            gap={8}
            align='flex-start'
          >
            <Text
              fontWeight={600}
              minW={40}
              textAlign='right'
            >
              {size}
            </Text>

            <ButtonStack
              title='Primary'
              variant='reskinPrimary'
              borderLeft='reskin'
              pl={8}
              size={size}
            />
            <ButtonStack
              title='Secondary'
              variant='reskinSecondary'
              size={size}
            />
            <ButtonStack
              title='Outline'
              variant='reskinOutline'
              size={size}
            />
            <ButtonStack
              title='Ghost'
              variant='reskinGhost'
              size={size}
            >
              <Button
                variant='reskinGhost'
                size={size}
                colorScheme='surface'
              >
                Surface
              </Button>
            </ButtonStack>
            <Stack>
              <Text fontWeight={500}>Link</Text>
              <Button
                variant='reskinLink'
                size={size}
                colorScheme='surface'
              >
                Link Button
              </Button>
            </Stack>
            <Stack>
              <Text fontWeight={500}>White</Text>
              <Button
                variant='reskinWhite'
                size={size}
              >
                White Button
              </Button>
            </Stack>
          </Flex>
        ))}
      </Stack>
      <Heading
        size='lg'
        textAlign='center'
      >
        Icon Buttons
      </Heading>
      <Divider />
      <Stack divider={<StackDivider style={{ margin: '32px' }} />}>
        {map(buttonTheme.sizes, (_sizeProps, size) => {
          if (size !== 'full') {
            return (
              <Flex
                key={`${size}-icon-stack`}
                gap={8}
                align='flex-start'
              >
                <Text
                  fontWeight={600}
                  minW={40}
                  textAlign='right'
                >
                  {size}
                </Text>

                <IconButtonStack
                  title='Primary'
                  variant='reskinPrimary'
                  borderLeft='reskin'
                  pl={8}
                  size={size}
                />
                <IconButtonStack
                  title='Secondary'
                  variant='reskinSecondary'
                  size={size}
                />
                <IconButtonStack
                  title='Outline'
                  variant='reskinOutline'
                  size={size}
                />
                <IconButtonStack
                  title='Ghost'
                  variant='reskinGhost'
                  size={size}
                >
                  <IconButton
                    variant='reskinGhost'
                    size={size}
                    colorScheme='surface'
                  />
                </IconButtonStack>
                <Stack>
                  <Text fontWeight={500}>Link</Text>
                  <IconButton
                    variant='reskinLink'
                    size={size}
                    colorScheme='surface'
                    icon={<HorizontalDotMenuIcon />}
                  />
                </Stack>
                <Stack>
                  <Text fontWeight={500}>White</Text>
                  <IconButton
                    variant='reskinWhite'
                    size={size}
                    icon={<SFPlusIcon />}
                  />
                </Stack>
              </Flex>
            );
          }
        })}
      </Stack>
    </Stack>
  );
}

function ButtonStack({ title, variant, size, children, ...props }) {
  return (
    <Stack {...props}>
      <Text fontWeight={500}>{title}</Text>
      <Button
        variant={variant}
        size={size}
      >
        Default
      </Button>
      <Button
        variant={variant}
        size={size}
        colorScheme='brandSecondary'
      >
        Brand Secondary
      </Button>
      <Button
        variant={variant}
        size={size}
        colorScheme='brandTertiary'
      >
        Brand Tertiary
      </Button>
      <Button
        variant={variant}
        size={size}
        colorScheme='live'
      >
        Live
      </Button>
      <Button
        variant={variant}
        size={size}
        colorScheme='critical'
      >
        Critical
      </Button>
      <Button
        variant={variant}
        size={size}
        colorScheme='caution'
      >
        Caution
      </Button>
      <Button
        variant={variant}
        size={size}
        colorScheme='positive'
      >
        Positive
      </Button>
      {children}
    </Stack>
  );
}

function IconButtonStack({ title, variant, size, children, ...props }) {
  return (
    <Stack {...props}>
      <Text fontWeight={500}>{title}</Text>
      <IconButton
        variant={variant}
        size={size}
        icon={<SFVideoFilled />}
      />
      <IconButton
        variant={variant}
        size={size}
        colorScheme='live'
        icon={<SFCalendarIcon />}
      />
      <IconButton
        variant={variant}
        size={size}
        colorScheme='critical'
        icon={<SFBookmarkIcon />}
      />
      <IconButton
        variant={variant}
        size={size}
        colorScheme='caution'
        icon={<SFDocOutlinedIcon />}
      />
      <IconButton
        variant={variant}
        size={size}
        colorScheme='positive'
        icon={<SFTwoBuildings />}
      />
      {children}
    </Stack>
  );
}
