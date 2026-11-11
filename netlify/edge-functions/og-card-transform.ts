// @ts-nocheck
import { Context } from '@netlify/edge-functions';
import {
  flow,
  isError,
  replace
} from 'https://raw.githubusercontent.com/lodash/lodash/4.17.21-es/lodash.js';
import axiod from 'https://deno.land/x/axiod/mod.ts';
import { isbot } from 'https://cdn.jsdelivr.net/npm/isbot/+esm';

export default async function handler(request: Request, context: Context) {
  const IMG_URL = 'https://i.ibb.co/yy7FPtH/fora-logo-opengraph.png';

  const url = new URL(request.url);
  const [cardId, ..._rest] = url?.pathname?.split('/').reverse() || [undefined, undefined];
  const uaString = request.headers.get('user-agent');

  const handleBotRequest = async () => {
    // parts of the chain make the last part of the url an html file?
    if (cardId?.includes('.')) {
      return;
    }

    // its a bot and needs a transformed template
    const cardsService = axiod.create({
      baseURL: 'https://api.fora.app/cards/'
    });

    const htmlService = axiod.create({
      baseURL: 'https://seo--foraday.netlify.app/'
    });

    const cardResp = await cardsService.get(cardId).catch((error) => {
      return new Error(error);
    });

    let card;
    if (isError(cardResp)) {
      return;
    } else {
      card = cardResp.data;
    }
    const title = card?.source_data?.title ?? card?.initiative?.title ?? '';
    const description = card?.headline;

    let { data: htmlToTransform } = await htmlService.get().catch((error) => {
      return new Error(error);
    });

    const transform = (regex, value) => (html) => replace(html, new RegExp(regex, 'g'), value);

    const transformHtml = flow(
      transform('{{IMAGE_URL GOES HERE}}', IMG_URL),
      transform('{{TITLE GOES HERE}}', `${title} Summary`),
      transform('{{AUTHOR GOES HERE}}', 'Fora'),
      transform('{{DESCRIPTION GOES HERE}}', description)
    );

    const transformed = transformHtml(htmlToTransform);

    return new Response(transformed, {
      headers: { 'content-type': 'text/html' }
    });
  };

  if (isbot(uaString)) {
    return await handleBotRequest();
  } else {
    return context.next();
  }
}

// todo: put this back on ln 48 if dynamic image generation is wanted
// const imageService = axiod.create({
//   baseURL: 'https://og-tags-w-edge-function--foraday.netlify.app/og-image/'
// });
// const sections = card?.sections
//
// const { data: image } = await axiod({
//   method: 'GET',
//   url: `http://localhost:8888/og-image/`,
//   params: {
//     title,
//     description,
//     // sections,
//   }
// })
//     .catch((error) => {
//       return new Error(error);
//     });
