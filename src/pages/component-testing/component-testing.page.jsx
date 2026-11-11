import { Heading, Stack, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import { StringParam, useQueryParam, withDefault } from 'use-query-params';

import { ProgressBarTesting } from '@components/custom-summary/custom-summary-generation-progress.component';
import { ColorPaletteSection, ColorTokensSection } from './token-palette-section.component';
import ButtonSection from './button-section.component';
import FormFieldsSection from './form-fields-section.component';
import TextSection from './text-section.component';
import CustomComponentsSection from './custom-components-section.component';
import AlertSection from './alert-section.component';
import GeneralSection from './general-section.component';
import TableSection from './table-section.component';
import ControlBarSection from './control-bar-section.component';
import { useTranslation } from 'react-i18next';

const tabs = [
  'Color Tokens',
  'Color Palettes',
  'Buttons',
  'Form Fields',
  'Text/Headings',
  'Custom',
  'Alerts',
  'General',
  'Tables',
  'Progress Bar',
  'Control Bar'
];
/**
 * Page for testing and previewing UI components
 * Contains tabs for different component categories
 *
 * @returns {JSX.Element} Component testing page
 */
export default function ComponentTestingPage() {
  const { t } = useTranslation();

  const [selectedTab, setSelectedTab] = useQueryParam(
    'tab',
    withDefault(StringParam, 'Color Tokens')
  );

  return (
    <Stack
      py={8}
      px={4}
      gap={8}
    >
      <Heading size='md'>{t('componentTestingPage.componentTesting')}</Heading>

      <Tabs
        index={tabs.indexOf(selectedTab)}
        onChange={(index) => setSelectedTab(tabs[index])}
        variant='enclosed'
        colorScheme='brand_blue'
        isLazy
      >
        <TabList>
          {tabs.map((tab) => (
            <Tab key={tab}>{tab}</Tab>
          ))}
        </TabList>

        <TabPanels pt={6}>
          <TabPanel>
            <ColorTokensSection />
          </TabPanel>
          <TabPanel>
            <ColorPaletteSection />
          </TabPanel>
          <TabPanel>
            <ButtonSection />
          </TabPanel>
          <TabPanel>
            <FormFieldsSection />
          </TabPanel>
          <TabPanel>
            <TextSection />
          </TabPanel>
          <TabPanel>
            <CustomComponentsSection />
          </TabPanel>
          <TabPanel>
            <AlertSection />
          </TabPanel>
          <TabPanel>
            <GeneralSection />
          </TabPanel>
          <TabPanel>
            <TableSection />
          </TabPanel>
          <TabPanel>
            <ProgressBarTesting />
          </TabPanel>
          <TabPanel>
            <ControlBarSection />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Stack>
  );
}
