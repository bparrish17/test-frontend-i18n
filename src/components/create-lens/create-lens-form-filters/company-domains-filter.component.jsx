import { Flex, Stack, Switch, Text } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { Controller } from 'react-hook-form';
import { ReactMultiEmail } from 'react-multi-email';
import 'react-multi-email/dist/style.css'; // required by the component?
import ReactMultiEmailLabel from './multi-email-label.component';
import { useTranslation } from 'react-i18next';

export default function CompanyDomainsFilter({ control, watch, setValue, isViewOnlyMode }) {
  const { t } = useTranslation();

  const domains = watch('filters.participants_domains');
  const notEmpty = domains?.length > 0;
  const [domainsCache, setDomainsCache] = useState(domains);
  const [isChecked, setIsChecked] = useState(notEmpty);

  const handleSwitchChange = (e) => {
    setIsChecked(e.target.checked);
    setValue('filters.participants_domains', e.target.checked ? domainsCache : null, {
      shouldDirty: true
    });
  };

  useEffect(() => {
    if (notEmpty) {
      setIsChecked(true);
      setDomainsCache(domains);
    }
  }, [notEmpty]);

  return (
    <Flex
      flexDirection='column'
      w='100%'
      gap={4}
    >
      <Flex
        w='100%'
        justifyContent='space-between'
        alignItems='center'
      >
        <Switch
          isChecked={isChecked}
          onChange={handleSwitchChange}
          isDisabled={isViewOnlyMode}
        />
        <Stack
          direction={['column', 'row']}
          justifyContent='space-between'
          w='100%'
          mx='10px'
        >
          <Text
            whiteSpace='nowrap'
            fontSize='lg'
            variant={isChecked ? 'page-header' : ''}
          >
            {t('companyDomainsFilter.companyDomain')}
          </Text>
          <Text
            textAlign='right'
            fontWeight={400}
            fontSize='sm'
            color='surface.onSurfaceVariant'
            lineHeight={6}
          >
            {t('companyDomainsFilter.filterByCompanyDomain')}
          </Text>
        </Stack>
      </Flex>
      {isChecked && (
        <Flex
          flexDir='column'
          gap={4}
        >
          <Controller
            control={control}
            name='filters.participants_domains'
            render={({ field: { onChange, value } }) => {
              return (
                <ReactMultiEmail
                  placeholder={t('companyDomainsFilter.filterByCompanyDomainPlaceholder')}
                  validateEmail={(email) => email.length > 0 && email.includes('.')}
                  emails={value}
                  onChange={onChange}
                  isDisabled={isViewOnlyMode}
                  getLabel={(email, index, removeEmail) => (
                    <ReactMultiEmailLabel
                      key={index}
                      email={email}
                      index={index}
                      removeEmail={removeEmail}
                    />
                  )}
                />
              );
            }}
          />
        </Flex>
      )}
    </Flex>
  );
}
