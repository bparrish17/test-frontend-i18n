import { CloseIcon, PlusIcon } from '@assets/icons';
import { Button, HStack, IconButton, Input, InputGroup, Stack, Text } from '@chakra-ui/react';
import SettingsLayout from '@layouts/settings.layout';
import {
  usePatchTenantAsAppUser,
  useTenantById
} from '@services/query-services/tenants.query-service';
import { useUserStore } from '@store/app.store';
import { useMutationToast, useSetDocumentTitle } from '@util/hooks';
import { last } from 'lodash-es';
import { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function RecordingPage() {
  const { t } = useTranslation();

  useSetDocumentTitle('Recording - FORA');
  const navigate = useNavigate();
  const user = useUserStore((state) => state?.user);
  const tenantId = useUserStore((state) => state?.tenant)?.id;
  const refreshSessionTenant = useUserStore((state) => state?.refreshSessionTenant);

  const { data: tenant } = useTenantById(tenantId, { enabled: !!tenantId });
  const form = useForm({
    defaultValues: {
      never_domains: tenant?.meeting_config?.never_domains,
      never_titles: tenant?.meeting_config?.never_titles,
      wordBoost: tenant?.bot_creation_request?.wordBoost
    },
    values: {
      never_domains: tenant?.meeting_config?.never_domains?.map((domain) =>
        domain?.replaceAll('.*', '')
      ),
      never_titles: tenant?.meeting_config?.never_titles?.map((title) =>
        title?.replaceAll('.*', '')
      ),
      wordBoost: tenant?.bot_creation_request?.wordBoost
    }
  });

  const { handleSubmit, control } = form;
  const neverTitlesArray = useFieldArray({
    control,
    name: 'never_titles'
  });
  const neverDomainsArray = useFieldArray({
    control,
    name: 'never_domains'
  });
  const keyWordsArray = useFieldArray({
    control,
    name: 'wordBoost'
  });

  const { mutateAsync: patchTenant, isLoading: isPatching } = usePatchTenantAsAppUser({
    optimisticUpdateConfig: {
      enabled: true,
      type: 'id'
    }
  });
  const { onSuccess, onError } = useMutationToast("tenant's recording settings", 'update');
  const [reqBody, setReqBody] = useState({});

  async function onSubmit() {
    await refreshSessionTenant(tenant.id);
    await patchTenant(
      {
        id: tenant.id,
        ...reqBody
      },
      {
        onSuccess,
        onError
      }
    );
  }

  const approvedUserTypes = ['Admin'];
  useEffect(() => {
    if (user && !approvedUserTypes.includes(user?.type)) {
      navigate('/settings');
    }
  }, [user]);

  return (
    <SettingsLayout
      pageTitle='Recording'
      dataCy='recording-page'
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack
          w={850}
          gap={8}
        >
          <Stack>
            <Text
              fontSize='2xl'
              fontWeight={600}
            >
              {t('recordingPage.doNotRecordList')}
            </Text>
            <Text
              fontStyle='italic'
              fontSize='md'
              mt={4}
            >
              {t('recordingPage.blacklistVariousMeetingsFrom')}
            </Text>
            <Text
              fontStyle='italic'
              fontSize='md'
            >
              {t('recordingPage.ifYouWouldLike')}
            </Text>
          </Stack>

          <RuleSection
            title={t('recordingPage.excludeTitles')}
            description={t('recordingPage.doNotRecordMeetings')}
            rulesArray={neverTitlesArray}
            rulesName='never_titles'
            rulesTitle='Title Exclusions'
            form={form}
            addToBody={(values) =>
              setReqBody({
                ...reqBody,
                meeting_config: {
                  never_titles: values?.length > 0 ? values : null
                }
              })
            }
            registerOptions={{
              setValueAs: (v) => `.*${v.trim()}.*`
            }}
          />

          <RuleSection
            title={t('recordingPage.excludeDomains')}
            description={t('recordingPage.doNotRecordMeetings2')}
            rulesArray={neverDomainsArray}
            rulesName='never_domains'
            rulesTitle='Domain Exclusions'
            form={form}
            addToBody={(values) =>
              setReqBody({
                ...reqBody,
                meeting_config: {
                  never_domains: values?.length > 0 ? values : null
                }
              })
            }
          />

          <RuleSection
            title={t('recordingPage.keyWords')}
            description={t('recordingPage.wordsListedHereWill')}
            rulesArray={keyWordsArray}
            rulesName='wordBoost'
            rulesTitle='Key Words'
            form={form}
            addToBody={(values) =>
              setReqBody({
                ...reqBody,
                bot_creation_request: {
                  wordBoost: values?.length > 0 ? values : null
                }
              })
            }
            registerOptions={{
              setValueAs: (v) => v.trim()
            }}
          />
          <Button
            type='submit'
            variant='reskinPrimary'
            w={200}
            isLoading={isPatching}
          >
            {t('recordingPage.save')}
          </Button>
        </Stack>
      </form>
    </SettingsLayout>
  );
}

/**
 * @typedef {Object} RuleSectionProps
 * @property {import('react-hook-form').RegisterOptions} registerOptions
 *
 * @param {RuleSectionProps} props
 */
function RuleSection({
  title,
  description,
  rulesArray,
  rulesName,
  addToBody,
  form,
  registerOptions
}) {
  const { t } = useTranslation();

  const [hasInteracted, setHasInteracted] = useState(false);
  const { register, watch, setFocus } = form;

  const values = watch(rulesName);
  const lastRule = last(values);

  useEffect(() => {
    if (hasInteracted) {
      setFocus(`${rulesName}.${rulesArray?.fields?.length - 1}`);
    }
  }, [values, hasInteracted]);

  useEffect(() => {
    addToBody(values);
  }, [values]);

  return (
    <Stack w={600}>
      <Text
        fontSize='xl'
        fontWeight={500}
      >
        {title}
      </Text>
      <Text>{description}</Text>
      {rulesArray?.fields?.map((field, i) => {
        const { onBlur, ...rest } = register(`${rulesName}.${i}`, registerOptions);
        return (
          <HStack key={field.id}>
            <InputGroup>
              <Input
                key={field.id}
                {...rest}
                onKeyDown={(e) => {
                  setHasInteracted(true);
                  if (e.key === 'Enter') {
                    rulesArray.append('');
                    setFocus(`${rulesName}.${i + 1}`);
                  }
                }}
                onBlur={(e) => {
                  setHasInteracted(true);
                  onBlur(e);
                }}
              />
            </InputGroup>
            <IconButton
              icon={<CloseIcon />}
              variant='reskinWhite'
              onClick={() => {
                rulesArray.remove(i);
              }}
            />
          </HStack>
        );
      })}
      <Button
        leftIcon={<PlusIcon />}
        w='fit-content'
        boxSize={8}
        px={10}
        fontSize='sm'
        variant='reskinWhite'
        color='surface.onSurfaceVariant'
        isDisabled={values?.length > 0 && lastRule === ''}
        onClick={() => {
          setHasInteracted(true);
          rulesArray.append('');
        }}
      >
        {t('recordingPage.add')}
      </Button>
    </Stack>
  );
}
