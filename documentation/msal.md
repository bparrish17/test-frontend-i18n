# Microsoft Authentication Library Usage Docs

These docs will serve as open-ended notes for using MSAL. The libraries and microsoft documentation are so esoteric and cluttered it's almost impossible to get back in the headspace you need to develop with it, so hopefully this should help get the baseline if any of us unfortunately arrive back here.

If you want more information on the Microsoft Teams graph API access and what not, you can go to [teams.md](./teams.md) although a good bit of it is outdated since we leverage the Fora API for hitting the Microsoft Graph API.

## Overview

We use MSAL as a possible login flow for users. We use `msal-react` (a react framework wrapper around `msal-browser` and `msal-common`) to initiative login flows and handle the subsequent redirects. Whereas with something like google you just fetch an access token and it gives it back, microsoft likes to obscure everything it does behind 8 layers of abstraction so it's hard to piece together what's going on. On desktop it's easy, we simply:

- call `msalInstance.loginPopup` and then get the access_token from the response

This was our strategy on all devices until it stopped working on mobile. For whatever reason microsoft sometimes falls back to the redirect strategy which makes it harder to "catch" the access_token from the response. It's mostly only useful if you're ONLY using microsoft as authentication for users (we have our own as well as Google). This means we need to loop into their events and then add callbacks. Then since we're multi-tenant we need to instantiate `msal` twice, which leads to confusion as well. With the redirect strategy we have to

- call `msalInstance.loginRedirect`
- users are taken to microsoft
- they log in
- they are redirected back to our redirect page `/teams/callback` with a weird query string that includes a `code`, `client_info`, `state`, and `session_state` which the `msal` client leverages. The `NavigationClient` then redirects back to our login page (see [CustomNavigationClient](../src/util/helpers/bootstrap.helpers.js#CustomNavigationClient))

## Key Links

- [Auth Code v2 Flow Overview](https://learn.microsoft.com/en-us/entra/identity-platform/v2-oauth2-auth-code-flow)

### Microsoft Authentication Library for JS - Github Docs

#### msal-browser

- [Acquiring and Using an Access Token](https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/acquire-token.md)
  - General overview on access token fetching in the browser library. `msal-react` handles a lot of this in the background so you probably won't need a lot of this, but the information is useful
- [Initialization](https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/initialization.md)
  - Overview of `PublicClientApplication` object
  - Higher level flow chart of account checking and token acquisition (not super relevant for us AFAIK)
  - Redirect URI considerations
    - Links you to `msal-react`, so probably irrelevant
- [Login User - RedirectUri Considerations](https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/login-user.md#redirecturi-considerations)
  - Some helpful explanation on setting `redirectUri` on a per request basis
  - TODO: move `/teams/callback` outside of MSAL context
  - Links back to `Initialization -> Redirect URI Considerations` from doc link above. [redundant link here](https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/login-user.md#redirecturi-considerations)

#### msal-react

- [FAQ](https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-react/FAQ.md#how-do-i-handle-the-redirect-flow-in-a-react-app)
  - Important context on "What can I do outside of `@azure/msal-react` context?
    - Explains why we have to use `msal-react` over more vanilla `msal-browser` approach
- [Events in MSAL React](https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-react/docs/events.md)
  - Registering event callbacks (e.g. LOGIN_SUCCESS)
- [Hooks](https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-react/docs/hooks.md#usemsalauthentication-hook)
  - we might need `useMsalAuthentication` in the future, although it does some stuff I think we don't want (like automatically signing in users on our behalf, which we're already doing if their session is still active)
- [Sample Applications](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/samples/msal-react-samples)
  - These mostly pertain to when you want microsoft's API to actually handle your logged in state as opposed to us who use the provided access token to then validate with our own backend
  - However, there's still good examples of how things can/should be structured

### Type Documentation

- [Root Link](https://azuread.github.io/microsoft-authentication-library-for-js/ref/index.html)

These pages are helpful for actually getting any info on the wildly obfuscated functionality that msal-react is doing behind the scenes

## Things to remember/questions I left off with (03/05/2024)

- Right now the backup mobile redirect flow is weird, and could use some improvement. The listener for the login success/acquire token event callback seems inefficient
- We might not need to re-instantiate MSAL with the specific `microsoftTenantId`
  - TODO: TEST THIS
  - If we can get it to only instantiate once that'd be kewl
- "Hierarchy" of react-router provider vs. msal-provider in App.jsx
- Should we be instantiating MSAL outside of the context like in the [react-router-sample application](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/samples/msal-react-samples/react-router-sample)?
- Should we do a separate `/teams/callback` page outside of the MSAL hierarchy as suggested by "Login User - RedirectUri Considerations" above
