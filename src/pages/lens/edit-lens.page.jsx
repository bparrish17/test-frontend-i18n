import {
  Flex,
  Skeleton,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useDisclosure
} from '@chakra-ui/react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

import { useInitiativeById } from '@services/query-services/initiatives.query-service';
import { useCreateLensFormState, useSetDocumentTitle } from '@util/hooks';
import CreateLensForm from '@components/create-lens/create-lens-form.component';
import CreateLensRightRail from '@components/create-lens/right-rail-component';
import ReskinMobileStickyNav from '@components/general/reskin-mobile-sticky-nav.component';
import ColumnedLayout from '@layouts/columned.layout';
import 'react-multi-email/dist/style.css';
import { useTranslation } from 'react-i18next'; // required by the component?

function MobileEditLensPage({ lensForm, previewDisclosure }) {
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
            <Tab>{t('editLensPage.editLens')}</Tab>
            <Tab>{t('editLensPage.review')}</Tab>
          </TabList>
        </ReskinMobileStickyNav>
        <TabPanels>
          <TabPanel>
            <CreateLensForm
              lensForm={lensForm}
              previewDisclosure={previewDisclosure}
              isEdit
            />
          </TabPanel>
          <TabPanel>
            <CreateLensRightRail
              lensForm={lensForm}
              previewDisclosure={previewDisclosure}
              setTabIndex={setTabIndex}
              isEdit
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  );
}

export default function EditLensPage() {
  useSetDocumentTitle('Edit Lens - FORA');
  const { lensId } = useParams();
  const { data: lens, isLoading } = useInitiativeById(lensId, {
    enabled: true
  });

  const lensForm = useCreateLensFormState(lens, true);
  const previewDisclosure = useDisclosure();

  if (isLoading) {
    return <Skeleton />;
  }

  return (
    <ColumnedLayout
      rightRailContent={
        <CreateLensRightRail
          lensForm={lensForm}
          previewDisclosure={previewDisclosure}
          isEdit
        />
      }
      mobileContent={
        <MobileEditLensPage
          lensForm={lensForm}
          previewDisclosure={previewDisclosure}
        />
      }
    >
      <CreateLensForm
        lensForm={lensForm}
        previewDisclosure={previewDisclosure}
        isEdit
      />
    </ColumnedLayout>
  );
}
