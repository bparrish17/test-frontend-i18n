import { Center, HStack, Icon, Image, Spacer, Stack, Text } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaLinkedin } from 'react-icons/fa6';

import MonoLabel from '@components/general/monolabel.component';
import BookAccessButton from '@components/general/book-access-button.component';
import { MARKETING_SITE_BASE_URL } from '@util/constants';

import { Graph, People, Gauge } from '@assets/images';
import { useTranslation } from 'react-i18next';

const slides = [
  {
    message: 'org performance',
    icon: () => (
      <Image
        src={Graph}
        boxSize={5}
        alt='graph icon'
      />
    )
  },
  {
    message: 'customer retention',
    icon: () => (
      <Image
        src={People}
        boxSize={9}
        alt='people icon'
      />
    )
  },
  {
    message: 'program management',
    icon: () => (
      <Image
        src={Gauge}
        boxSize={6}
        alt='gauge icon'
      />
    )
  }
];

const gradientStyle = {
  background: 'linear-gradient(to bottom, #11161f 1%, #2f54c7 100%)'
};

export default function ForaBanner({ mini = false }) {
  const { t } = useTranslation();

  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSlide((slide) => (slide + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Center
      w='full'
      style={gradientStyle}
      rounded='md'
      border={mini && 'base'}
      borderColor={mini && 'brandPrimary.inverse'}
    >
      <Stack
        gap={mini ? 4 : 12}
        p={mini ? 4 : 5}
        maxW='md'
      >
        <Stack
          gap={1}
          w='full'
        >
          <HStack w='full'>
            <Text
              fontWeight={400}
              letterSpacing='tight'
              fontSize='sm'
              color='surface.inverseOnSurface'
              variant='aeonik'
            >
              {t('foraBanner.whatIsFora')}
            </Text>
            <Spacer />
            <Link
              to='https://www.linkedin.com/company/fora-day/'
              h='fit-content'
              target='_blank'
              alignSelf='flex-end'
            >
              <Icon
                as={FaLinkedin}
                color='surface.onSurfaceVariant'
                boxSize={6}
              />
            </Link>
          </HStack>
          <Spacer />
          <Text
            h='75px'
            fontWeight={700}
            letterSpacing='tight'
            fontSize='2xl'
            color='surface.surface'
          >
            FORA transforms your{' '}
            <AnimatePresence mode='wait'>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                // exit={{ opacity: 0 }}
                transition={{
                  duration: 0.8
                }}
                layout
                key={slide}
                style={{
                  display: 'inline',
                  gap: 8,
                  whiteSpace: 'break-spaces'
                }}
              >
                <Text
                  fontWeight={700}
                  color='blueTag.primary'
                  display='inline'
                >
                  {slides[slide].message.split(' ')[0]}{' '}
                </Text>
                <HStack
                  display='inline-flex'
                  color='blueTag.primary'
                >
                  <Text
                    fontWeight={700}
                    display='inline-flex'
                    align='center'
                    justify='center'
                    gap={4}
                  >
                    {slides[slide].message.split(' ')[1]}
                  </Text>

                  <Icon
                    as={slides[slide].icon}
                    display='inline'
                  />
                </HStack>
              </motion.div>
            </AnimatePresence>
          </Text>
        </Stack>
        {!mini && (
          <>
            <Stack
              gap={3}
              flex='1'
            >
              <MonoLabel
                variant='aeonik'
                color='surface.surfaceDim'
              >
                {t('foraBanner.solutions')}
              </MonoLabel>
              <FooterNavItem to={`${MARKETING_SITE_BASE_URL}/solutions/performance`}>
                {t('foraBanner.peopleOrgPerformance')}
              </FooterNavItem>
              <FooterNavItem to={`${MARKETING_SITE_BASE_URL}/solutions/retention`}>
                {t('foraBanner.customerRetentionGrowth')}
              </FooterNavItem>
              <FooterNavItem to={`${MARKETING_SITE_BASE_URL}/solutions/management`}>
                {t('foraBanner.programProjectManagement')}
              </FooterNavItem>
            </Stack>

            <Stack
              gap={3}
              flex='1'
            >
              <MonoLabel
                variant='aeonik'
                color='surface.surfaceDim'
              >
                {t('foraBanner.product')}
              </MonoLabel>
              <FooterNavItem to={`${MARKETING_SITE_BASE_URL}/product`}>
                {t('foraBanner.productOverview')}
              </FooterNavItem>
              <FooterNavItem to={`${MARKETING_SITE_BASE_URL}/pricing`}>
                {t('foraBanner.productPricing')}
              </FooterNavItem>
              <FooterNavItem to='https://foraday.notion.site/FORA-Support-Knowledge-Base-Home-58c7ed0b5e3a4bea96000389bcf10461'>
                {t('foraBanner.getSupport')}
              </FooterNavItem>
            </Stack>
          </>
        )}
        <Stack
          gap={4}
          pb={mini ? 2 : 4}
        >
          <BookAccessButton
            variant='reskinPrimary'
            w='full'
            size='sm'
          />
          <Link
            to={MARKETING_SITE_BASE_URL}
            target='_blank'
          >
            <Text
              color='brandPrimary.onPrimary'
              fontSize='md'
              fontWeight={500}
              align='center'
            >
              {t('foraBanner.learnMore')}
            </Text>
          </Link>
        </Stack>
      </Stack>
    </Center>
  );
}

function FooterNavItem({ to, children, ...props }) {
  return (
    <Link
      to={to}
      target='_blank'
    >
      <Text
        fontSize='sm'
        fontWeight={600}
        color='surface.surfaceBright'
        {...props}
      >
        {children}
      </Text>
    </Link>
  );
}
