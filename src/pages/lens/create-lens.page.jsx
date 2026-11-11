import { Flex, Tab, TabList, TabPanel, TabPanels, Tabs, useDisclosure } from '@chakra-ui/react';
import { useState } from 'react';
import 'react-multi-email/dist/style.css'; // required by the component?

import CreateLensForm from '@components/create-lens/create-lens-form.component';
import CreateLensRightRail from '@components/create-lens/right-rail-component';
import ReskinMobileStickyNav from '@components/general/reskin-mobile-sticky-nav.component';
import ColumnedLayout from '@layouts/columned.layout';
import { useCreateLensFormState, useSetDocumentTitle } from '@util/hooks';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function MobileCreateLensPage({ lensForm, previewDisclosure }) {
  const { t } = useTranslation();

  const [tabIndex, setTabIndex] = useState(0);

  return (
    <Flex flexDir='column'>
      <Tabs
        index={tabIndex}
        onChange={(index) => setTabIndex(index)}
        variant='navDark'
      >
        <ReskinMobileStickyNav showCalendar={false}>
          <TabList
            justifyContent='space-between'
            w='full'
          >
            <Tab>{t('createLensPage.createLens')}</Tab>
            <Tab>{t('createLensPage.review')}</Tab>
          </TabList>
        </ReskinMobileStickyNav>
        <TabPanels>
          <TabPanel>
            <CreateLensForm
              lensForm={lensForm}
              previewDisclosure={previewDisclosure}
            />
          </TabPanel>
          <TabPanel>
            <CreateLensRightRail
              lensForm={lensForm}
              previewDisclosure={previewDisclosure}
              setTabIndex={setTabIndex}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  );
}

export default function CreateLensPage() {
  useSetDocumentTitle('Create Lens - FORA');
  const location = useLocation();
  const lensForm = useCreateLensFormState(location?.state?.template, false);
  const previewDisclosure = useDisclosure();

  return (
    <ColumnedLayout
      rightRailContent={
        <CreateLensRightRail
          lensForm={lensForm}
          previewDisclosure={previewDisclosure}
        />
      }
      mobileContent={
        <MobileCreateLensPage
          lensForm={lensForm}
          previewDisclosure={previewDisclosure}
        />
      }
    >
      <CreateLensForm
        lensForm={lensForm}
        previewDisclosure={previewDisclosure}
      />
    </ColumnedLayout>
  );
}
