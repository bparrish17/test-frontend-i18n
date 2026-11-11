// @ts-nocheck
import { Context } from '@netlify/edge-functions';
import { ImageResponse } from 'https://deno.land/x/og_edge/mod.ts';
import * as React from 'https://esm.sh/preact@10.5.15';
// import { renderToString } from 'https://esm.sh/preact-render-to-string@5.1.19?deps=preact@10.5.15';

// TODO: possible path to self-hosted dynamic image generation:
// 1. use (a vanilla) react project to lay out and style a component from scratch that could be populated with the title and description vars from below
// 2. instead of returning the response below, stream it to s3 or cdn bucket for long-term storage
// 3. return url of newly created cdn image

export default async function handler(request: Request) {
  const [queryStr, ..._rest] = request?.url?.split('?').reverse() || [undefined, undefined];
  const urlParams = new URLSearchParams(queryStr);
  const title = urlParams.get('title');
  const description = urlParams.get('description');

  const styleObj = {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    fontSize: 128,
    background: 'red'
  };

  return new ImageResponse(
    (
      <div style={styleObj}>
        <h1> {title} </h1>
        <pre> {description} </pre>
      </div>
    )
  );
}
