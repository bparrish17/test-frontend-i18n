import MyAccount from '@components/settings/my-account.component';
import SettingsLayout from '@layouts/settings.layout';
import { useSetDocumentTitle } from '@util/hooks';

function SecurityPage() {
  useSetDocumentTitle('Sign-In & Security - FORA');
  return (
    <SettingsLayout dataCy='security-page'>
      <MyAccount />
    </SettingsLayout>
  );
}

export default SecurityPage;
