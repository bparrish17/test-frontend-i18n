import { Button, Image } from '@chakra-ui/react';

import NylasService from '@services/nylas.service';
import { useUserStore } from '@store/app.store';
import { OutlookLogo, GoogleCalendarLogo } from '@assets/images';
import { useTranslation } from 'react-i18next';

const nylasService = NylasService.getInstance();

export default function AddCalendarButton(props = {}) {
  const { t } = useTranslation();

  const user = useUserStore((state) => state.user);

  const onAddCalendarClick = async () => {
    await nylasService.connectNylasAccount(user);
  };

  return (
    <Button
      display='flex'
      gap={3}
      p={6}
      h='unset'
      {...props}
      onClick={onAddCalendarClick}
    >
      <Image
        src={GoogleCalendarLogo}
        boxSize={9}
      />
      <Image
        src={OutlookLogo}
        boxSize={9}
      />
      {t('addCalendarButton.addCalendar')}
    </Button>
  );
}
