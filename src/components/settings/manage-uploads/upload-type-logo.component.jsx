import SourceLogo from '@components/general/source-logo.component';
import { findMatchingCard } from '@util/helpers';

export default function UploadTypeLogo({ upload, cards, type }) {
  const card = findMatchingCard(upload, cards, type);
  const tags = [...(card?.tags || []), ...(upload?.tags || [])];

  return (
    <SourceLogo
      color='brandPrimary.primary'
      sourceType={card?.source || type}
      subSource={card?.sub_source}
      source={card?.source_data}
      tags={tags}
      boxSize='30px'
      m={1.5}
    />
  );
}
