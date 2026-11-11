import React from 'react';
import { Text } from '@chakra-ui/react';
import Markdown from 'react-markdown';
import { p, sourcebutton } from './markdown-components';

function LensInsightSection({ section, insight }) {
  if (section?.content) {
    return (
      <>
        <Text variant='headline-sm'>{section?.title}</Text>
        <Markdown
          components={{
            p,
            code: (props) => sourcebutton({ ...props, insight })
          }}
        >
          {section?.content}
        </Markdown>
      </>
    );
  }
  return null;
}

export default LensInsightSection;
