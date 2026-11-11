import { Button } from '@chakra-ui/react';
import { useExplorerPageStore } from '@store/app.store';
import { useStyledToast } from '@util/hooks';
import { useNavigate } from 'react-router-dom';
import { SFSparkleStarIcon } from '@assets/icons';
import { useTranslation } from 'react-i18next';
/**
 * ExplorerAnalyzeButton component
 * This component renders a button that, when clicked, sets the provided sources in local storage for use on the analyze page.
 * Then, the user is redirected to the analyze page.
 * @param {Array<any>} sourcesToSet
 */

function ExplorerAnalyzeButton({ sourcesToSet, ...props }) {
  const { t } = useTranslation();

  const navigate = useNavigate();
  const setSourcesInLocalstorage = useExplorerPageStore((state) => state.setSources);
  const toast = useStyledToast();

  const onClick = () => {
    if (!sourcesToSet) {
      toast({
        title: t('explorerAnalyzeButton.noSourcesSelected'),
        status: 'error'
      });
      return;
    }
    const sourcesMapped = sourcesToSet
      ?.filter((s) => s?.id && s?.source_data)
      .map((s) => ({
        id: s.id,
        title: s.source_data.title,
        type: 'Card'
      }));
    if (!sourcesMapped?.length) {
      toast({
        title: t('explorerAnalyzeButton.noValidSourcesSelected'),
        status: 'error'
      });
      return;
    }
    setSourcesInLocalstorage(sourcesMapped);
    navigate('/explorer');
  };

  return (
    <Button
      variant='reskinOutline'
      size='md'
      px={8}
      onClick={onClick}
      {...props}
    >
      <SFSparkleStarIcon
        boxSize={4}
        mr={2}
      />
      {t('explorerAnalyzeButton.analyze')}
    </Button>
  );
}

export default ExplorerAnalyzeButton;
