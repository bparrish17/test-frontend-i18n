import { SalesforceIcon } from '@assets/icons';
import { Icon } from '@chakra-ui/react';

const contactSourceIconMap = {
  Salesforce: SalesforceIcon
  // add hubspot, additional here
};

export default function ContactSourceIcon({ contact, ...props }) {
  if (!contact?.source) {
    return null;
  }

  return (
    <Icon
      as={contactSourceIconMap[contact?.source]}
      {...props}
    />
  );
}
