import {
  Flex,
  Icon,
  Input,
  Select,
  Stack,
  HStack,
  Text,
  Radio,
  Checkbox,
  Switch,
  Menu,
  MenuList,
  MenuItem,
  MenuOptionGroup,
  MenuItemOption,
  MenuButton,
  Button,
  UnorderedList,
  ListItem,
  Divider
} from '@chakra-ui/react';
import { chakraComponents } from 'chakra-react-select';
import { useState } from 'react';
import { map } from 'lodash-es';

import { usePeopleOptions } from '@services/query-services/people.query-service';
import { useAvailableSymbols } from '@services/query-services/fmp.query-service';
import { ReskinMeetingCardContext } from '@components/general/card/reskin-meeting-card/reskin-meeting-card.component';
import { useAllMeetingContentById } from '@services/query-services/meetings.query-service';
import { useDebouncedProp } from '@util/hooks';
import { SFSquareArrowDown } from '@assets/icons';
import { DURATION_OPTIONS, VISIBILITY_OPTIONS } from '@util/constants';

import CustomSelect from '@components/general/form/custom-select.component';
import FormInput from '@components/general/form/form-input.component';
import StyledSelect from '@components/general/styled-select.component';
import StyledSwitch from '@components/general/styled-switch.component';
import ReskinMeetingMenu from '@components/general/card/reskin-meeting-card/reskin-meeting-menu.component';
import { useTranslation } from 'react-i18next';

const fakeMeetingId =
  'f7943f5426875095bfc49f8bd15b626c7577aa0a_0ph88m8tm7iv7o3bjl6po568e2_20250407T133000Z';

export default function FormFieldsSection() {
  const { t } = useTranslation();

  const { data: peopleOptions } = usePeopleOptions();
  const [selectedPeople, setSelectedPeople] = useState([]);
  const [selectedPrivacy, setSelectedPrivacy] = useState();
  const [inputText, setInputText] = useState('');
  const [selectedTickers, setSelectedTickers] = useState([]);
  const [debouncedInputText] = useDebouncedProp(inputText);
  const { data: allMeetingData } = useAllMeetingContentById(fakeMeetingId, false, {
    placeholderData: { value: null, card: null, bot: null }
  });
  const { value: meeting, card, bot } = allMeetingData;

  const { data: availableSymbols, isLoading } = useAvailableSymbols(debouncedInputText, {
    enabled: debouncedInputText?.length >= 2 && debouncedInputText?.length <= 30,
    select: (symbols) => map(symbols, 'value')
  });

  const handleInputChange = (inputText, meta) => {
    if (meta.action !== 'input-blur' && meta.action !== 'menu-close') {
      setInputText(inputText);
    }
  };

  return (
    <Flex
      direction='row'
      wrap='wrap'
      gap={12}
    >
      <Stack>
        <Text fontWeight={600}>{t('formFieldsSection.input')}</Text>
        <Input
          placeholder={t('formFieldsSection.smPlaceholder')}
          size='sm'
        />
        <FormInput
          size='sm'
          label={t('formFieldsSection.formInputCustomSm')}
          errorMsg='Please enter something.'
        />
        <Input
          placeholder={t('formFieldsSection.mdPlaceholder')}
          size='md'
        />
        <FormInput
          size='md'
          label={t('formFieldsSection.formInputCustomMd')}
          errorMsg='Please enter something.'
        />
        <Input
          placeholder={t('formFieldsSection.lgPlaceholder')}
          size='lg'
        />
        <FormInput
          size='lg'
          label={t('formFieldsSection.formInputCustomLg')}
          errorMsg='Please enter something.'
        />
      </Stack>
      <Stack w='400px'>
        <Text
          fontWeight={600}
          mb={2}
        >
          {t('formFieldsSection.selectDropdown')}
        </Text>
        <Divider mb={6} />
        <Stack>
          <Text fontWeight={500}>{t('formFieldsSection.customSelect')}</Text>
          <Text fontSize='xs'>{t('formFieldsSection.shouldBeTheDefault')}</Text>

          <CustomSelect
            selectProps={{ width: '100%' }}
            placeholder={t('formFieldsSection.customselectExample1SmPlaceholder')}
            getOptionLabel={(opt) => opt?.label}
            getOptionValue={(opt) => opt?.value}
            size='sm'
            value={selectedPeople}
            onChange={setSelectedPeople}
            options={peopleOptions}
          />
          <CustomSelect
            selectProps={{ width: '100%' }}
            placeholder={t('formFieldsSection.customselectExample1MdPlaceholder')}
            getOptionLabel={(opt) => opt?.label}
            getOptionValue={(opt) => opt?.value}
            size='md'
            value={selectedPeople}
            onChange={setSelectedPeople}
            options={peopleOptions}
          />
          <CustomSelect
            selectProps={{ width: '100%' }}
            placeholder={t('formFieldsSection.customselectExample1LgPlaceholder')}
            getOptionLabel={(opt) => opt?.label}
            getOptionValue={(opt) => opt?.value}
            value={selectedPeople}
            onChange={setSelectedPeople}
            options={peopleOptions}
          />
          <CustomSelect
            placeholder={t('formFieldsSection.customselectExample2LgPlaceholder')}
            getOptionValue={(opt) => opt?.symbol}
            inputValue={inputText}
            onInputChange={handleInputChange}
            options={availableSymbols}
            value={selectedTickers}
            onChange={setSelectedTickers}
            filterOption={null}
            isLoading={!!inputText && isLoading}
            controlProps={{ py: 3 }}
            components={{
              Option,
              MultiValueLabel,
              LoadingMessage: (props) => (
                <LoadingMessage
                  inputHasTwoChars={inputText?.length >= 2}
                  {...props}
                />
              ),
              NoOptionsMessage: (props) => (
                <NoOptionsMessage
                  hasInput={inputText?.length > 0}
                  {...props}
                />
              )
            }}
          />
        </Stack>
        <Divider my={6} />
        <Stack>
          <Text fontWeight={500}>{t('formFieldsSection.chakraDefaultSelect')}</Text>
          <Text fontSize='xs'>{t('formFieldsSection.usedOnlyInA')}</Text>
          <UnorderedList
            mb={2}
            fontSize='xs'
          >
            <ListItem>{t('formFieldsSection.createLensFormDuration')}</ListItem>
            <ListItem>{t('formFieldsSection.createMeetingModalCategory')}</ListItem>
            <ListItem>{t('formFieldsSection.manualDigestPageFor')}</ListItem>
            <ListItem>{t('formFieldsSection.settingsUserSettingsTimezone')}</ListItem>
            <ListItem>{t('formFieldsSection.manualDigestPageFor')}</ListItem>
          </UnorderedList>
          <Select
            placeholder={t('formFieldsSection.defaultChakraSelectOutlinePlaceholder')}
            variant='reskinOutline'
          >
            <FakeOptions />
          </Select>
          <Select
            placeholder={t('formFieldsSection.defaultChakraSelectFilledPlaceholder')}
            variant='reskinFilled'
          >
            <FakeOptions />
          </Select>
        </Stack>
        <Divider my={6} />
        <Stack>
          <Text fontWeight={500}>{t('formFieldsSection.styledSelect')}</Text>
          <Text fontSize='xs'>
            Only really used on the Create Lens form, Person Meeting Timeline, and Create User Page.{' '}
          </Text>
          <StyledSelect
            selectLabel='StyledSelect'
            placeholder={t('formFieldsSection.customChakraMenuComponentPlaceholder')}
            options={VISIBILITY_OPTIONS.map((visOption) => ({
              ...visOption,
              icon: (
                <Icon
                  as={visOption.icon}
                  boxSize={4}
                />
              )
            }))}
            value={selectedPrivacy}
            onChange={setSelectedPrivacy}
            menuButtonProps={{
              backgroundColor: 'surface.containerLow'
            }}
          />
        </Stack>
      </Stack>
      <Stack>
        <Text fontWeight={600}>{t('formFieldsSection.radio')}</Text>
        <Radio size='xs'>{t('formFieldsSection.xsRadio')}</Radio>
        <Radio
          size='sm'
          variant='secondary'
          isChecked
        >
          {t('formFieldsSection.smRadio')}
        </Radio>
        <Radio
          size='md'
          isChecked
        >
          {t('formFieldsSection.mdRadio')}
        </Radio>
        <Radio
          size='lg'
          isChecked
        >
          {t('formFieldsSection.lgRadio')}
        </Radio>{' '}
        <Radio
          size='xl'
          isChecked
        >
          {t('formFieldsSection.xlRadio')}
        </Radio>
      </Stack>
      <Stack>
        <Text fontWeight={600}>{t('formFieldsSection.checkbox')}</Text>
        <Checkbox size='sm'>{t('formFieldsSection.smCheckbox')}</Checkbox>
        <Checkbox size='md'>{t('formFieldsSection.mdCheckbox')}</Checkbox>
        <Checkbox size='lg'>{t('formFieldsSection.lgCheckbox')}</Checkbox>
      </Stack>
      <Stack>
        <Text fontWeight={600}>{t('formFieldsSection.switch')}</Text>
        <Switch size='sm'>{t('formFieldsSection.smSwitch')}</Switch>
        <Switch size='md'>{t('formFieldsSection.mdSwitch')}</Switch>
        <Switch size='lg'>{t('formFieldsSection.lgSwitch')}</Switch>
        <StyledSwitch />
      </Stack>
      <Stack>
        <Text fontWeight={600}>{t('formFieldsSection.menu')}</Text>
        <FakeMenu title={t('formFieldsSection.baseVariant')} />
        <FakeMenu
          title={t('formFieldsSection.selectVariant')}
          variant='select'
        />
        <StyledSelect
          selectLabel='StyledSelectMenu'
          placeholder={t('formFieldsSection.technicallyAMenuComponenPlaceholder')}
          options={VISIBILITY_OPTIONS.map((visOption) => ({
            ...visOption,
            icon: (
              <Icon
                as={visOption.icon}
                boxSize={4}
              />
            )
          }))}
          value={selectedPrivacy}
          onChange={setSelectedPrivacy}
          menuButtonProps={{
            backgroundColor: 'surface.containerLow'
          }}
        />
        <Flex
          gap={3}
          align='center'
        >
          <Text>{t('formFieldsSection.meetingMenuScrumExample')}</Text>
          <ReskinMeetingCardContext.Provider
            value={{
              meeting,
              bot,
              card,
              showCardActions: true,
              onCardActionClick: () => console.log('hey'),
              onMeetingActionClick: () => console.log('hey')
            }}
          >
            <ReskinMeetingMenu showViewTranscriptButton />
          </ReskinMeetingCardContext.Provider>
        </Flex>
      </Stack>
    </Flex>
  );
}

function FakeMenu({ title, variant }) {
  const { t } = useTranslation();

  return (
    <Menu variant={variant}>
      <MenuButton
        as={Button}
        rightIcon={<SFSquareArrowDown />}
      >
        {title}
      </MenuButton>
      <MenuList>
        <MenuItem>{t('formFieldsSection.fakeItem1')}</MenuItem>
        <MenuItem>{t('formFieldsSection.fakeItem2Is')}</MenuItem>
        <MenuItem>{t('formFieldsSection.fakeItem3Of')}</MenuItem>
        <MenuOptionGroup title={t('formFieldsSection.fakeOptionGroup')}>
          <MenuItemOption>{t('formFieldsSection.fakeOptionItem1')}</MenuItemOption>
          <MenuItemOption>{t('formFieldsSection.fakeOptionItem2')}</MenuItemOption>
          <MenuItemOption>{t('formFieldsSection.fakeOptionItem3')}</MenuItemOption>
        </MenuOptionGroup>
      </MenuList>
    </Menu>
  );
}

function FakeOptions() {
  return (
    <>
      {DURATION_OPTIONS.map(({ value, label }) => (
        <option
          key={value}
          value={value}
        >
          {label}
        </option>
      ))}
    </>
  );
}

function MultiValueLabel({ data: option, ...props }) {
  return (
    <chakraComponents.MultiValueLabel {...props}>
      <Text
        as='span'
        color='surface.onSurface'
        variant='label-500-md'
      >
        {option?.symbol}
      </Text>
    </chakraComponents.MultiValueLabel>
  );
}

function Option({ data: option, ...props }) {
  return (
    <chakraComponents.Option {...props}>
      <HStack>
        <Text
          as='span'
          color='surface.onSurface'
          variant='label-500-md'
        >
          {option?.symbol}
        </Text>
        <Text
          as='span'
          color='surface.outline'
          variant='label-500-md'
        >
          {option?.companyName}
        </Text>
      </HStack>
    </chakraComponents.Option>
  );
}

function LoadingMessage({ inputHasTwoChars, ...props }) {
  return (
    <chakraComponents.LoadingMessage {...props}>
      <Text>{inputHasTwoChars ? 'Loading...' : 'Input at least 2 characters to search...'}</Text>
    </chakraComponents.LoadingMessage>
  );
}

function NoOptionsMessage({ hasInput, ...props }) {
  return (
    <chakraComponents.NoOptionsMessage {...props}>
      <Text>{hasInput ? 'No tickers found' : 'Input a ticker or company name'}</Text>
    </chakraComponents.NoOptionsMessage>
  );
}
