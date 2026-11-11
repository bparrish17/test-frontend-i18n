# Prod Changelog

All prod builds documented here

## [0.11.112](https://github.com/summarizator/fora-frontend/compare/v0.11.111...v0.11.112) <span style="color: red;">[prod]</span>
> Tue, Sep 2 2025 | 11:10 AM EST

### Tasks

- [FORA-1933](https://foraday.atlassian.net/browse/FORA-1933): bump sonar github action for security
  <details>
    <summary>Commits</summary>

    - [bump sonar scan version](https://github.com/summarizator/fora-frontend/commit/14779da02)

  </details>

## [0.11.111](https://github.com/summarizator/fora-frontend/compare/v0.11.110...v0.11.111) <span style="color: red;">[prod]</span>
> Fri, Aug 29 2025 | 05:12 PM EST

### Tasks

- [FORA-1928](https://foraday.atlassian.net/browse/FORA-1928): navigate to card explorer from recent feed via "analyze" button
  <details>
    <summary>Commits</summary>

    - [remove unnecessary check](https://github.com/summarizator/fora-frontend/commit/1312a31fc)
    - [tweaking and tests](https://github.com/summarizator/fora-frontend/commit/09acbe602)
    - [it works, neat](https://github.com/summarizator/fora-frontend/commit/77576f8c1)
    - [add null checks to handle error](https://github.com/summarizator/fora-frontend/commit/ba852002d)

  </details>

## [0.11.110](https://github.com/summarizator/fora-frontend/compare/v0.11.109...v0.11.110) <span style="color: red;">[prod]</span>
> Fri, Aug 29 2025 | 11:21 AM EST

### Tasks

- [FORA-1920](https://foraday.atlassian.net/browse/FORA-1920): update card explorer design to match mockups
  <details>
    <summary>Commits</summary>

    - [fix tests](https://github.com/summarizator/fora-frontend/commit/2af35699d)
    - [sonar](https://github.com/summarizator/fora-frontend/commit/da1dfaf79)
    - [better spacing for add and clear buttons](https://github.com/summarizator/fora-frontend/commit/f80ebe336)
    - [one more fix](https://github.com/summarizator/fora-frontend/commit/4ddb63d8c)
    - [more tests](https://github.com/summarizator/fora-frontend/commit/6c5f091b4)
    - [split up page components; first tranche of unit tests](https://github.com/summarizator/fora-frontend/commit/d59de8bd9)
    - [looks prettier](https://github.com/summarizator/fora-frontend/commit/c33489133)
    - [update submit button](https://github.com/summarizator/fora-frontend/commit/ceac22fdf)
    - [swap from right rail approach to two columns](https://github.com/summarizator/fora-frontend/commit/71055028a)

  </details>

## [0.11.109](https://github.com/summarizator/fora-frontend/compare/v0.11.108...v0.11.109) <span style="color: red;">[prod]</span>
> Tue, Aug 26 2025 | 04:35 PM EST

### Bug Fixes

- [FORA-1882](https://foraday.atlassian.net/browse/FORA-1882): Empty State on Earnings Call Screen is a Loading Icon
  <details>
    <summary>Commits</summary>

    - [Handle case where subscribed tickers is 0](https://github.com/summarizator/fora-frontend/commit/1483dec50)

  </details>

## [0.11.108](https://github.com/summarizator/fora-frontend/compare/v0.11.107...v0.11.108) <span style="color: red;">[prod]</span>
> Tue, Aug 26 2025 | 01:47 PM EST

### Features

- [FORA-1893](https://foraday.atlassian.net/browse/FORA-1893): "add" cards to card explorer
  <details>
    <summary>Commits</summary>

    - [stray null check](https://github.com/summarizator/fora-frontend/commit/6f975247a)
    - [put chat message markdown in its own component](https://github.com/summarizator/fora-frontend/commit/edd27d324)
    - [fix tests](https://github.com/summarizator/fora-frontend/commit/788325d4f)
    - [merge conflict](https://github.com/summarizator/fora-frontend/commit/e1360026f)
    - [tests and logs](https://github.com/summarizator/fora-frontend/commit/e07babf85)
    - [remove dead things](https://github.com/summarizator/fora-frontend/commit/3436799e7)
    - [tweaks for the release](https://github.com/summarizator/fora-frontend/commit/40c207af8)
    - [checkpoint: it kind of works](https://github.com/summarizator/fora-frontend/commit/7078ae8af)

  </details>

## [0.11.107](https://github.com/summarizator/fora-frontend/compare/v0.11.106...v0.11.107) <span style="color: red;">[prod]</span>
> Mon, Aug 25 2025 | 11:45 AM EST

### Tasks

- [FORA-1892](https://foraday.atlassian.net/browse/FORA-1892): Add an "Add Invitees" Button to the sharing dialog where you input email addresses
  <details>
    <summary>Commits</summary>

    - [Add all invitees button to share meeting modal](https://github.com/summarizator/fora-frontend/commit/717bf36c4)

  </details>

## [0.11.106](https://github.com/summarizator/fora-frontend/compare/v0.11.105...v0.11.106) <span style="color: red;">[prod]</span>
> Fri, Aug 22 2025 | 04:50 PM EST

### Features

- [FORA-1706](https://foraday.atlassian.net/browse/FORA-1706): display shared meetings for user in recent feed
  <details>
    <summary>Commits</summary>

    - [Handle null meetings on meeting helper functions](https://github.com/summarizator/fora-frontend/commit/1152c1aaf)
    - [Add support for shared user that is a meeting participant](https://github.com/summarizator/fora-frontend/commit/3711be59f)
    - [Switch to useMediaQuery over useBreakpoints](https://github.com/summarizator/fora-frontend/commit/f0f892d2c)
    - [Render a StyledSelect for summary options when not on desktop](https://github.com/summarizator/fora-frontend/commit/1de87b18a)
    - [Remove shares_email filter from card search params](https://github.com/summarizator/fora-frontend/commit/776341e97)
    - [Display shared meetings to internal FORA user in recent feed](https://github.com/summarizator/fora-frontend/commit/d472fa156)
    - [Add getSummaryObject helper function](https://github.com/summarizator/fora-frontend/commit/356bc6a3e)
    - [Implement shared filter on summaries page](https://github.com/summarizator/fora-frontend/commit/8d2543255)

  </details>

## [0.11.104](https://github.com/summarizator/fora-frontend/compare/v0.11.103...v0.11.104) <span style="color: red;">[prod]</span>
> Fri, Aug 22 2025 | 02:21 PM EST

### Features

- [FORA-1839](https://foraday.atlassian.net/browse/FORA-1839): Allow users to upload a profile picture to their user account from the profile page
  <details>
    <summary>Commits</summary>

    - [Add icon on hover and spinner on loading state](https://github.com/summarizator/fora-frontend/commit/1cddd136b)
    - [Allow fora-avatars in CSP headers](https://github.com/summarizator/fora-frontend/commit/12a648e91)
    - [Add avatar upload functionality to account settings page](https://github.com/summarizator/fora-frontend/commit/d90c243bd)

  </details>

## [0.11.103](https://github.com/summarizator/fora-frontend/compare/v0.11.102...v0.11.103) <span style="color: red;">[prod]</span>
> Tue, Aug 19 2025 | 06:06 PM EST

### Features

- [FORA-1607](https://foraday.atlassian.net/browse/FORA-1607): Migrate zoom functions to microservice
  <details>
    <summary>Commits</summary>

    - [Add integrations to path for zoom functions](https://github.com/summarizator/fora-frontend/commit/47f51e6c3)

  </details>

## [0.11.102](https://github.com/summarizator/fora-frontend/compare/v0.11.101...v0.11.102) <span style="color: red;">[prod]</span>
> Tue, Aug 19 2025 | 03:38 PM EST

### Features

- [FORA-1608](https://foraday.atlassian.net/browse/FORA-1608): Migrate process channel logic to microservice
  <details>
    <summary>Commits</summary>

    - [Add channel path](https://github.com/summarizator/fora-frontend/commit/338921bfc)

  </details>

## [0.11.101](https://github.com/summarizator/fora-frontend/compare/v0.11.100...v0.11.101) <span style="color: red;">[prod]</span>
> Tue, Aug 19 2025 | 12:35 PM EST

### Tasks

- [FORA-1894](https://foraday.atlassian.net/browse/FORA-1894): Allow Speaker Sentiment to be feature flagged or turned off by tenant
  <details>
    <summary>Commits</summary>

    - [feature flag for speaker behavior](https://github.com/summarizator/fora-frontend/commit/462d540dd)

  </details>

## [0.11.100](https://github.com/summarizator/fora-frontend/compare/v0.11.99...v0.11.100) <span style="color: red;">[prod]</span>
> Mon, Aug 18 2025 | 04:55 PM EST

### Features

- [FORA-1848](https://foraday.atlassian.net/browse/FORA-1848): "ask" across multiple cards
  <details>
    <summary>Commits</summary>

    - [start the user off with some prompts](https://github.com/summarizator/fora-frontend/commit/ef4efa122)
    - [Merge branch 'FORA-1848-card-explorer' of https://github.com/summarizator/fora-frontend into FORA-1848-card-explorer](https://github.com/summarizator/fora-frontend/commit/96728ce70)
    - [remove source from right rail](https://github.com/summarizator/fora-frontend/commit/76bcacfcd)
    - [Merge branch 'app' into FORA-1848-card-explorer](https://github.com/summarizator/fora-frontend/commit/3fff03f40)
    - [address pr comments](https://github.com/summarizator/fora-frontend/commit/959c47c5f)
    - [sonar?](https://github.com/summarizator/fora-frontend/commit/462475143)
    - [Merge branch 'app' of https://github.com/summarizator/fora-frontend into FORA-1848-card-explorer](https://github.com/summarizator/fora-frontend/commit/e5949acd8)
    - [add some tests](https://github.com/summarizator/fora-frontend/commit/fea9baefa)
    - [add analyze button from lens sources; add loader; add feature flag](https://github.com/summarizator/fora-frontend/commit/e178948e4)
    - [Merge branch 'app' of https://github.com/summarizator/fora-frontend into FORA-1848-card-explorer](https://github.com/summarizator/fora-frontend/commit/ebec44863)
    - [ensure we correctly invalidate conversation query keys](https://github.com/summarizator/fora-frontend/commit/cc0dc5236)
    - [lots of progress](https://github.com/summarizator/fora-frontend/commit/81362f43b)
    - [Merge branch 'app' of https://github.com/summarizator/fora-frontend into FORA-1848-card-explorer](https://github.com/summarizator/fora-frontend/commit/60051cc08)
    - [start explorer page](https://github.com/summarizator/fora-frontend/commit/d5f579e7d)

  </details>

## [0.11.99](https://github.com/summarizator/fora-frontend/compare/v0.11.98...v0.11.99) <span style="color: red;">[prod]</span>
> Fri, Aug 15 2025 | 03:41 PM EST

### Bug Fixes

- [FORA-1890](https://foraday.atlassian.net/browse/FORA-1890): Remove Sentiment from Web Share View of FORA Meeting for External People
  <details>
    <summary>Commits</summary>

    - [hide speaker behavior from guest users; minor fixes to guest user profile menu](https://github.com/summarizator/fora-frontend/commit/a86e6c3b0)

  </details>


### Tasks

- [FORA-1887](https://foraday.atlassian.net/browse/FORA-1887): test speaker times and attendee population hook
  <details>
    <summary>Commits</summary>

    - [Merge branch 'app' into FORA-1887-test-speaker-times-and-attendee-population-hook](https://github.com/summarizator/fora-frontend/commit/1581c5e71)
    - [Merge branch 'app' into FORA-1887-test-speaker-times-and-attendee-population-hook](https://github.com/summarizator/fora-frontend/commit/90f3a295b)
    - [fall back to `speakers` if `speakers_` not provided](https://github.com/summarizator/fora-frontend/commit/8ced84b8c)
    - [test that mergeAttendeesAndSpeakers returns all participants and all speakers](https://github.com/summarizator/fora-frontend/commit/b3bb41f24)
    - [test usePopulateMeetingAttendees, showcase speakers being added to participant list in transcript helpers](https://github.com/summarizator/fora-frontend/commit/9786eea36)
    - [use msw-auto-mock](https://github.com/summarizator/fora-frontend/commit/9688315e1)

  </details>

- [FORA-1856](https://foraday.atlassian.net/browse/FORA-1856): Save GitHub Actions time spent on testing
  <details>
    <summary>Commits</summary>

    - [Merge branch 'app' into FORA-1856-Save-GitHub-Actions-time-spent-on-testing](https://github.com/summarizator/fora-frontend/commit/9abfba968)
    - [Merge branch 'app' into FORA-1856-Save-GitHub-Actions-time-spent-on-testing](https://github.com/summarizator/fora-frontend/commit/ae5fbc90e)
    - [gitguardian specify branches](https://github.com/summarizator/fora-frontend/commit/a338b91d3)
    - [gitguardian scan test](https://github.com/summarizator/fora-frontend/commit/6a7379e17)
    - [skip sonar analysis and gitguardianscan on draft](https://github.com/summarizator/fora-frontend/commit/4bcfba4f7)
    - [run tests when ready for review](https://github.com/summarizator/fora-frontend/commit/ed3ad5a34)

  </details>

- [FORA-1861](https://foraday.atlassian.net/browse/FORA-1861): update insight detail page
  <details>
    <summary>Commits</summary>

    - [Merge branch 'app' into FORA-1861-update-insight-detail-page](https://github.com/summarizator/fora-frontend/commit/2fb34f503)
    - [add feature flag for sharing, fix insight tests](https://github.com/summarizator/fora-frontend/commit/f0853cd9d)
    - [margin around source buttons](https://github.com/summarizator/fora-frontend/commit/36b067563)
    - [past insights to right rail, sources are back at the end of main section](https://github.com/summarizator/fora-frontend/commit/52093c2dd)
    - [remove commented prop](https://github.com/summarizator/fora-frontend/commit/ff46ffb07)
    - [fix tests](https://github.com/summarizator/fora-frontend/commit/247a58310)
    - [update insight page, add share button](https://github.com/summarizator/fora-frontend/commit/4b1741a7d)

  </details>


### Features

- [FORA-1885](https://foraday.atlassian.net/browse/FORA-1885): Add codex agent.md file to frontend / sls / admin repos
  <details>
    <summary>Commits</summary>

    - [Add tooling section to AGENTS.md](https://github.com/summarizator/fora-frontend/commit/54d3e92cb)
    - [Add agents file](https://github.com/summarizator/fora-frontend/commit/61d9da7b2)

  </details>

## [0.11.94](https://github.com/summarizator/fora-frontend/compare/v0.11.93...v0.11.94) <span style="color: red;">[prod]</span>
> Tue, Aug 12 2025 | 03:40 PM EST

### Tasks

- [FORA-1842](https://foraday.atlassian.net/browse/FORA-1842): Allow Spaces and Some special characters in file uploads via Summarize
  <details>
    <summary>Commits</summary>

    - [sanitize filename after submission](https://github.com/summarizator/fora-frontend/commit/06117300e)

  </details>

- [FORA-1843](https://foraday.atlassian.net/browse/FORA-1843): Add a link to manage uploads page from "Summarize" Button Menu
  <details>
    <summary>Commits</summary>

    - [Add link to manage uploads page](https://github.com/summarizator/fora-frontend/commit/463421cd5)

  </details>


### Bug Fixes

- [FORA-1652](https://foraday.atlassian.net/browse/FORA-1652): meeting-detail: Only redirect on 401 error
  <details>
    <summary>Commits</summary>

    - [Handle meeting not found error by redirecting](https://github.com/summarizator/fora-frontend/commit/8c487a4cf)
    - [Reduce complexity in removeStatsigClient](https://github.com/summarizator/fora-frontend/commit/28c42bf28)
    - [Attempt to reduce cognitive complexity of sanitizeValue](https://github.com/summarizator/fora-frontend/commit/0cfb91d86)
    - [Fix broken test](https://github.com/summarizator/fora-frontend/commit/e52d87cf6)
    - [only redirect from meeting page on 401 or 403 errors](https://github.com/summarizator/fora-frontend/commit/9bbb86c72)
    - [Redirect to login page on 403 error](https://github.com/summarizator/fora-frontend/commit/5a0ddfd77)

  </details>

- [FORA-1697](https://foraday.atlassian.net/browse/FORA-1697): Update link on manage categories page
  <details>
    <summary>Commits</summary>

    - [Fix sonar](https://github.com/summarizator/fora-frontend/commit/7e9941ead)
    - [Change link to Edit Category](https://github.com/summarizator/fora-frontend/commit/13eb7b3cd)

  </details>

## [0.11.90](https://github.com/summarizator/fora-frontend/compare/v0.11.89...v0.11.90) <span style="color: red;">[prod]</span>
> Tue, Aug 12 2025 | 11:21 AM EST

### Features

- [FORA-1841](https://foraday.atlassian.net/browse/FORA-1841): Remove "New" Labels/Badges from Earnings Calls and Autoscheduling
  <details>
    <summary>Commits</summary>

    - [fix sonar issue](https://github.com/summarizator/fora-frontend/commit/2fe5ded13)
    - [Remove NEW labels](https://github.com/summarizator/fora-frontend/commit/7b46f6bb0)

  </details>

- [FORA-1206](https://foraday.atlassian.net/browse/FORA-1206): Company pages that do not have apollo data returned should still be accessible with just FORA information
  <details>
    <summary>Commits</summary>

    - [Merge branch 'app' into FORA-1206-Company-pages-that-do-not-have-apollo-data-returned-should-still-be-accessible-with-just-FORA-information](https://github.com/summarizator/fora-frontend/commit/c8deb4cdb)
    - [fix OrganizationPage and PersonStatsInline tests](https://github.com/summarizator/fora-frontend/commit/d8557fc6f)
    - [add buildOrgLink test, fix OrganizationDetails tests](https://github.com/summarizator/fora-frontend/commit/6c6d9f3a1)
    - [enable navigating to orgs without id](https://github.com/summarizator/fora-frontend/commit/b8436c4e0)
    - [mobile organization page props](https://github.com/summarizator/fora-frontend/commit/67eea42ad)
    - [/organizations/:id => /organization?id=&domain=](https://github.com/summarizator/fora-frontend/commit/a3b23402e)

  </details>

## [0.11.88](https://github.com/summarizator/fora-frontend/compare/v0.11.87...v0.11.88) <span style="color: red;">[prod]</span>
> Wed, Aug 6 2025 | 02:24 PM EST

### Tasks

- [FORA-1812](https://foraday.atlassian.net/browse/FORA-1812): Configurable Side Nav by Tenant
  <details>
    <summary>Commits</summary>

    - [Merge branch 'app' into FORA-1812-configurable-side-nav-by-tenant](https://github.com/summarizator/fora-frontend/commit/d3a1a7afb)
    - [Add configurable side nav and custom home page route](https://github.com/summarizator/fora-frontend/commit/32ec35b5a)

  </details>

## [0.11.87](https://github.com/summarizator/fora-frontend/compare/v0.11.86...v0.11.87) <span style="color: red;">[prod]</span>
> Tue, Aug 5 2025 | 05:10 PM EST

### Features

- [FORA-1598](https://foraday.atlassian.net/browse/FORA-1598): Rollbar Upgrades
  <details>
    <summary>Commits</summary>

    - [fix test](https://github.com/summarizator/fora-frontend/commit/2552730b6)
    - [add rollbar to share meeting modal submit function so we can trace better](https://github.com/summarizator/fora-frontend/commit/137ed654e)

  </details>

## [0.11.86](https://github.com/summarizator/fora-frontend/compare/v0.11.85...v0.11.86) <span style="color: red;">[prod]</span>
> Mon, Aug 4 2025 | 04:02 PM EST

### Tasks

- [FORA-1852](https://foraday.atlassian.net/browse/FORA-1852): [frontend] Remove Nylas Grant & Unschedule Bots when deactivating a User
  <details>
    <summary>Commits</summary>

    - [nicer toast nesting](https://github.com/summarizator/fora-frontend/commit/f87efa196)
    - [invalidate grant and unschedule meetings when a user is deactivated](https://github.com/summarizator/fora-frontend/commit/8e8e59567)

  </details>

## [0.11.85](https://github.com/summarizator/fora-frontend/compare/v0.11.84...v0.11.85) <span style="color: red;">[prod]</span>
> Fri, Aug 1 2025 | 12:58 PM EST

### Features

- [FORA-1834](https://foraday.atlassian.net/browse/FORA-1834): Update Agenda page to new designs
  <details>
    <summary>Commits</summary>

    - [Merge branch 'app' into FORA-1834-Update-Agenda-page-to-new-designs](https://github.com/summarizator/fora-frontend/commit/1f26d83a6)
    - [sonar](https://github.com/summarizator/fora-frontend/commit/e5fad69ba)
    - [mobile meeting row styling](https://github.com/summarizator/fora-frontend/commit/f666dac9d)
    - [swap tweet for card headline](https://github.com/summarizator/fora-frontend/commit/855f3c556)
    - [extend tweet, stop truncating meeting title on mobile](https://github.com/summarizator/fora-frontend/commit/35d5bd9b0)
    - [tweet truncate after 3 lines](https://github.com/summarizator/fora-frontend/commit/c835a42bf)
    - [fix menu tests, set up MSW for mocking api responses](https://github.com/summarizator/fora-frontend/commit/27d134e7f)
    - [icons coherency](https://github.com/summarizator/fora-frontend/commit/56706b2d2)
    - [hide share button in menu for meeting card but show in agenda](https://github.com/summarizator/fora-frontend/commit/678913669)
    - [update menu, add skeleton](https://github.com/summarizator/fora-frontend/commit/b4d7ec2e9)
    - [agenda meeting menu](https://github.com/summarizator/fora-frontend/commit/50a6a5e4d)
    - [fetch all meeting data to get a bot tweet, navigate on meeting row click](https://github.com/summarizator/fora-frontend/commit/bf80415a3)
    - [populate agenda meetings with full bot to get tweet](https://github.com/summarizator/fora-frontend/commit/0edefa829)
    - [Merge branch 'app' into FORA-1834-Update-Agenda-page-to-new-designs](https://github.com/summarizator/fora-frontend/commit/b6a06a875)
    - [update status icons](https://github.com/summarizator/fora-frontend/commit/6ad91e4fc)
    - [remove accordion](https://github.com/summarizator/fora-frontend/commit/ecf1fbeba)
    - [remove "your meetings"](https://github.com/summarizator/fora-frontend/commit/96bff506c)

  </details>

## [0.11.84](https://github.com/summarizator/fora-frontend/compare/v0.11.83...v0.11.84) <span style="color: red;">[prod]</span>
> Thu, Jul 31 2025 | 12:45 PM EST

### Bug Fixes

- [FORA-1855](https://foraday.atlassian.net/browse/FORA-1855): exclude templates that are not yours from the meeting page
  <details>
    <summary>Commits</summary>

    - [Merge branch 'app' into FORA-1855-fewer-templates-for-admins](https://github.com/summarizator/fora-frontend/commit/1f354921a)
    - [on meeting page only query for templates created by active user](https://github.com/summarizator/fora-frontend/commit/0c9d2477b)

  </details>

## [0.11.83](https://github.com/summarizator/fora-frontend/compare/v0.11.82...v0.11.83) <span style="color: red;">[prod]</span>
> Thu, Jul 31 2025 | 12:18 PM EST

### Features

- [FORA-1329](https://foraday.atlassian.net/browse/FORA-1329): Redirecting after logging in
  <details>
    <summary>Commits</summary>

    - [fix missing import](https://github.com/summarizator/fora-frontend/commit/ec2676738)

  </details>

## [0.11.82](https://github.com/summarizator/fora-frontend/compare/v0.11.81...v0.11.82) <span style="color: red;">[prod]</span>
> Wed, Jul 30 2025 | 12:39 PM EST

### Features

- [FORA-1849](https://foraday.atlassian.net/browse/FORA-1849): allow users to share private meetings via web
  <details>
    <summary>Commits</summary>

    - [tweak isUserWithAccess](https://github.com/summarizator/fora-frontend/commit/faac108bd)
    - [Merge branch 'app' into FORA-1849-sharing-private-meetings](https://github.com/summarizator/fora-frontend/commit/6e7db5b07)
    - [enable sharing for sensitive meetings](https://github.com/summarizator/fora-frontend/commit/329fd28ab)

  </details>

## [0.11.81](https://github.com/summarizator/fora-frontend/compare/v0.11.80...v0.11.81) <span style="color: red;">[prod]</span>
> Tue, Jul 29 2025 | 04:54 PM EST

### Features

- [FORA-1581](https://foraday.atlassian.net/browse/FORA-1581): Manage Uploads page
  <details>
    <summary>Commits</summary>

    - [Address QA comments](https://github.com/summarizator/fora-frontend/commit/cfaf5c20f)
    - [Set maxItems to 5](https://github.com/summarizator/fora-frontend/commit/295da2794)
    - [Address sonar complaints](https://github.com/summarizator/fora-frontend/commit/f35645972)
    - [Change icon](https://github.com/summarizator/fora-frontend/commit/55b6426ea)
    - [Add loading spinner for downloading file](https://github.com/summarizator/fora-frontend/commit/5f9188927)
    - [Add tests for batches query-service](https://github.com/summarizator/fora-frontend/commit/ff13c56f1)
    - [Add support for meeting upload icon](https://github.com/summarizator/fora-frontend/commit/e7111830b)
    - [Update route for manage-uploads](https://github.com/summarizator/fora-frontend/commit/58a4ddbfe)
    - [Add manage-uploads page](https://github.com/summarizator/fora-frontend/commit/965fdd1f6)
    - [Add fn getPresignedUrl](https://github.com/summarizator/fora-frontend/commit/680930761)
    - [export getOriginalFileEntry](https://github.com/summarizator/fora-frontend/commit/c2050d725)
    - [Add manage-uploads-table](https://github.com/summarizator/fora-frontend/commit/3878fb25d)
    - [Add upload helper components and tests](https://github.com/summarizator/fora-frontend/commit/1f3e48df8)
    - [Add upload helpers](https://github.com/summarizator/fora-frontend/commit/6b0eddfa8)
    - [Add helper hooks](https://github.com/summarizator/fora-frontend/commit/866a23c18)
    - [Add new icon](https://github.com/summarizator/fora-frontend/commit/c30f88c30)
    - [Commit temporary state of manage uploads page (unfinished)](https://github.com/summarizator/fora-frontend/commit/f5dd590d6)

  </details>

## [0.11.80](https://github.com/summarizator/fora-frontend/compare/v0.11.79...v0.11.80) <span style="color: red;">[prod]</span>
> Tue, Jul 29 2025 | 03:13 PM EST

### Tasks

- [FORA-1804](https://foraday.atlassian.net/browse/FORA-1804): spike: ring central API integration
  <details>
    <summary>Commits</summary>

    - [Add ring-central logo](https://github.com/summarizator/fora-frontend/commit/d6b629bde)
    - [Add ring-central oauth logic](https://github.com/summarizator/fora-frontend/commit/3ec2692a3)
    - [Start adding ring central logic](https://github.com/summarizator/fora-frontend/commit/f8953ddbb)

  </details>

## [0.11.79](https://github.com/summarizator/fora-frontend/compare/v0.11.78...v0.11.79) <span style="color: red;">[prod]</span>
> Fri, Jul 25 2025 | 02:19 PM EST

### Tasks

- [FORA-1833](https://foraday.atlassian.net/browse/FORA-1833): Duplicate meetings on Agenda page due to Span of Control issues
  <details>
    <summary>Commits</summary>

    - [Merge branch 'app' into FORA-1833-remove-FE-deduping](https://github.com/summarizator/fora-frontend/commit/c82d323ee)
    - [Merge branch 'app' into FORA-1833-remove-FE-deduping](https://github.com/summarizator/fora-frontend/commit/ee3789fe8)
    - [remove meeting deduping and some other dead code from a darker agae](https://github.com/summarizator/fora-frontend/commit/c57935c31)

  </details>

## [0.11.78](https://github.com/summarizator/fora-frontend/compare/v0.11.77...v0.11.78) <span style="color: red;">[prod]</span>
> Fri, Jul 25 2025 | 12:40 PM EST

### Tasks

- [FORA-1837](https://foraday.atlassian.net/browse/FORA-1837): Create Re-Sync button on agenda page for application user to refresh calendar
  <details>
    <summary>Commits</summary>

    - [Merge branch 'app' into FORA-1837-Create-Re-Sync-button-on-agenda-page-for-application-user-to-refresh-calendar](https://github.com/summarizator/fora-frontend/commit/9d6909305)
    - [add test for nylas query](https://github.com/summarizator/fora-frontend/commit/f08735b29)
    - [add tests for calendar sync button](https://github.com/summarizator/fora-frontend/commit/e6d3b8b3b)
    - [isLoading state](https://github.com/summarizator/fora-frontend/commit/f68bedce6)
    - [button styling changes](https://github.com/summarizator/fora-frontend/commit/6df012ace)
    - [calendar sync agenda button](https://github.com/summarizator/fora-frontend/commit/dc0a1940d)

  </details>

## [0.11.77](https://github.com/summarizator/fora-frontend/compare/v0.11.76...v0.11.77) <span style="color: red;">[prod]</span>
> Fri, Jul 25 2025 | 10:24 AM EST

### Tasks

- [FORA-1832](https://foraday.atlassian.net/browse/FORA-1832): Add Alert and Re-Sync Calendar Button to Agenda For Bad Nylas Grants
  <details>
    <summary>Commits</summary>

    - [Add logic to trigger cal connect when nylas is expired or removed](https://github.com/summarizator/fora-frontend/commit/40b91c19e)

  </details>

## [0.11.76](https://github.com/summarizator/fora-frontend/compare/v0.11.75...v0.11.76) <span style="color: red;">[prod]</span>
> Thu, Jul 24 2025 | 07:52 AM EST

### Features

- [FORA-1307](https://foraday.atlassian.net/browse/FORA-1307): Add speaker timings to the meeting detail page.
  <details>
    <summary>Commits</summary>

    - [Merge branch 'app' into FORA-1307-hotfix](https://github.com/summarizator/fora-frontend/commit/aed25a3e0)
    - [expect organizations as array](https://github.com/summarizator/fora-frontend/commit/e9ec06bd3)

  </details>

## [0.11.75](https://github.com/summarizator/fora-frontend/compare/v0.11.74...v0.11.75) <span style="color: red;">[prod]</span>
> Wed, Jul 23 2025 | 04:57 PM EST

### Features

- [FORA-1307](https://foraday.atlassian.net/browse/FORA-1307): Add speaker timings to the meeting detail page.
  <details>
    <summary>Commits</summary>

    - [Merge branch 'app' into FORA-1307-Add-speaker-timings-to-the-meeting-detail-page](https://github.com/summarizator/fora-frontend/commit/ad69a3251)
    - [expect sonar](https://github.com/summarizator/fora-frontend/commit/e619a65a9)
    - [fix test import](https://github.com/summarizator/fora-frontend/commit/45a07b2d3)
    - [fix imports](https://github.com/summarizator/fora-frontend/commit/983fb0ac3)
    - [Merge branch 'app' into FORA-1307-Add-speaker-timings-to-the-meeting-detail-page](https://github.com/summarizator/fora-frontend/commit/ec22724f8)
    - [add tests](https://github.com/summarizator/fora-frontend/commit/a7e28c1e4)
    - [fix mobile meeting page imports](https://github.com/summarizator/fora-frontend/commit/8ad8fe02a)
    - [full alias path, move meeting components from pages directory](https://github.com/summarizator/fora-frontend/commit/95688b712)
    - [update meeting attendee info spacing](https://github.com/summarizator/fora-frontend/commit/867a172cc)
    - [sonar](https://github.com/summarizator/fora-frontend/commit/acdb17bb8)
    - [fix speaker related tests](https://github.com/summarizator/fora-frontend/commit/423d3ab8f)
    - [sonar](https://github.com/summarizator/fora-frontend/commit/7921b3054)
    - [make components for meeting organizations and meeting attendees lists](https://github.com/summarizator/fora-frontend/commit/03de682c5)
    - [mobile, little refactor for attendees population](https://github.com/summarizator/fora-frontend/commit/464aee5a5)
    - [fix for meetings without speakers](https://github.com/summarizator/fora-frontend/commit/a335ae1c1)
    - [style see more button](https://github.com/summarizator/fora-frontend/commit/b4ff3d162)
    - [fix findIndex result of -1 setting max people directly](https://github.com/summarizator/fora-frontend/commit/3df583570)
    - [merge speakers and attendees, update styles from figma](https://github.com/summarizator/fora-frontend/commit/0f7240e44)
    - [handle undefined bot](https://github.com/summarizator/fora-frontend/commit/3d8332c71)
    - [use name displayed in attendees as a key instead of speaker name](https://github.com/summarizator/fora-frontend/commit/654a626a1)
    - [display speaker times in decimal minutes (like in iOS app)](https://github.com/summarizator/fora-frontend/commit/22e40042c)
    - [update openapi types, remove conflicting type definition](https://github.com/summarizator/fora-frontend/commit/081ccce0a)
    - [add speaker icon, stub speaker time label component, include in people stack](https://github.com/summarizator/fora-frontend/commit/c9428580e)

  </details>

- [FORA-704](https://foraday.atlassian.net/browse/FORA-704): revisit searchAgendaMeetings logic
  <details>
    <summary>Commits</summary>

    - [Merge branch 'app' into FORA-704-revisit-searchAgendaMeetings-logic](https://github.com/summarizator/fora-frontend/commit/5bf216733)
    - [add searchAgendaMeetingsTest](https://github.com/summarizator/fora-frontend/commit/22a85c9a3)
    - [sonar](https://github.com/summarizator/fora-frontend/commit/93b72008e)
    - [fix boolean logic](https://github.com/summarizator/fora-frontend/commit/7f8c188ef)
    - [convert if statement to a guard clause](https://github.com/summarizator/fora-frontend/commit/da84a0591)
    - [fix tests - add optional chaining to scrollIntoView call](https://github.com/summarizator/fora-frontend/commit/b8c577b76)
    - [remove searching for linked meetings to enrich agenda meetings](https://github.com/summarizator/fora-frontend/commit/f142c1b81)

  </details>

## [0.11.73](https://github.com/summarizator/fora-frontend/compare/v0.11.72...v0.11.73) <span style="color: red;">[prod]</span>
> Tue, Jul 22 2025 | 10:43 AM EST

### Features

- [FORA-768](https://foraday.atlassian.net/browse/FORA-768): Make person/org thumbnail clickable
  <details>
    <summary>Commits</summary>

    - [Merge branch 'app' into FORA-768-Make-person-org-thumbnail-clickable](https://github.com/summarizator/fora-frontend/commit/bd3ab93e0)
    - [Merge branch 'app' into FORA-768-Make-person-org-thumbnail-clickable](https://github.com/summarizator/fora-frontend/commit/60cae1b7c)
    - [sonar](https://github.com/summarizator/fora-frontend/commit/f21a73674)
    - [fix import](https://github.com/summarizator/fora-frontend/commit/4be382b5e)
    - [dedupe code](https://github.com/summarizator/fora-frontend/commit/e9dc8db70)
    - [combine meeting person preview in one component](https://github.com/summarizator/fora-frontend/commit/f3ad0626f)
    - [fix user profile color (1)](https://github.com/summarizator/fora-frontend/commit/08da65970)
    - [fix user profile color](https://github.com/summarizator/fora-frontend/commit/6bfd7be85)
    - [update person previews on person/org pages](https://github.com/summarizator/fora-frontend/commit/9b8d29a22)
    - [make person previews on meeting page consistent and fully clickable](https://github.com/summarizator/fora-frontend/commit/711bde077)

  </details>


### Tasks

- [FORA-1829](https://foraday.atlassian.net/browse/FORA-1829): fix layout shifts on columned layout
  <details>
    <summary>Commits</summary>

    - [fix columned layout shifts](https://github.com/summarizator/fora-frontend/commit/894991b90)

  </details>

## [0.11.71](https://github.com/summarizator/fora-frontend/compare/v0.11.70...v0.11.71) <span style="color: red;">[prod]</span>
> Wed, Jul 16 2025 | 02:22 PM EST

### Bug Fixes

- [FORA-1818](https://foraday.atlassian.net/browse/FORA-1818): Infinite Scroll on Recents page not working in HURC P2P Tenant
  <details>
    <summary>Commits</summary>

    - [Merge branch 'app' into FORA-1818-Infinite-Scroll-on-Recents-page-not-working-in-HURC-P2P-Tenant](https://github.com/summarizator/fora-frontend/commit/dd1243607)
    - [fix feed scroll by removing conditional rendering, relying on search for filtering](https://github.com/summarizator/fora-frontend/commit/a27cba21a)
    - [remove offset in visibility calculation for infinite scroll](https://github.com/summarizator/fora-frontend/commit/da4cbe164)

  </details>

## [0.11.70](https://github.com/summarizator/fora-frontend/compare/v0.11.69...v0.11.70) <span style="color: red;">[prod]</span>
> Wed, Jul 16 2025 | 12:36 PM EST

### Bug Fixes

- [FORA-1803](https://foraday.atlassian.net/browse/FORA-1803): Avoid control bar error until 5 minutes after meeting end time
  <details>
    <summary>Commits</summary>

    - [Add comment](https://github.com/summarizator/fora-frontend/commit/e509196e6)
    - [Add liveDate to getControlBarState to prevent error within timeframe](https://github.com/summarizator/fora-frontend/commit/154ff6d53)

  </details>

## [0.11.69](https://github.com/summarizator/fora-frontend/compare/v0.11.68...v0.11.69) <span style="color: red;">[prod]</span>
> Wed, Jul 16 2025 | 11:31 AM EST

### Tasks

- [FORA-1293](https://foraday.atlassian.net/browse/FORA-1293): add rollbar to netlify edge function logs
  <details>
    <summary>Commits</summary>

    - [Remove test logic](https://github.com/summarizator/fora-frontend/commit/29a2351f5)
    - [Add nonce to CSP](https://github.com/summarizator/fora-frontend/commit/aa2c149f4)
    - [Attempt to get style working](https://github.com/summarizator/fora-frontend/commit/caff64abd)
    - [Pass nonce to errorHtml](https://github.com/summarizator/fora-frontend/commit/0e9972e00)
    - [Update errorHtml and re-incorporate logic (for another test)](https://github.com/summarizator/fora-frontend/commit/bea2c9a69)
    - [Respond with error html](https://github.com/summarizator/fora-frontend/commit/e730a95b5)
    - [Trigger error so I can see what happens](https://github.com/summarizator/fora-frontend/commit/be65e7469)
    - [Remove rollbar test trigger](https://github.com/summarizator/fora-frontend/commit/cfda02c50)
    - [Attempt setup of rollbar logic in edge function](https://github.com/summarizator/fora-frontend/commit/38955dbad)
    - [rollback eslint change](https://github.com/summarizator/fora-frontend/commit/0b8c69fc7)
    - [Add edge function files to eslintrc](https://github.com/summarizator/fora-frontend/commit/6d608d8f1)

  </details>

## [0.11.68](https://github.com/summarizator/fora-frontend/compare/v0.11.67...v0.11.68) <span style="color: red;">[prod]</span>
> Tue, Jul 15 2025 | 02:37 PM EST

### Bug Fixes

- [FORA-1817](https://foraday.atlassian.net/browse/FORA-1817): A manually added label should not be tappable on mobile
  <details>
    <summary>Commits</summary>

    - [Merge branch 'app' into FORA-1817-A-manually-added-label-should-not-be-tappable-on-mobile](https://github.com/summarizator/fora-frontend/commit/e4ecab50c)
    - [Merge branch 'app' into FORA-1817-A-manually-added-label-should-not-be-tappable-on-mobile](https://github.com/summarizator/fora-frontend/commit/fabb69305)
    - [desktop/mobile test](https://github.com/summarizator/fora-frontend/commit/a7ac103a0)
    - [fix labels bar test](https://github.com/summarizator/fora-frontend/commit/1137f6f85)
    - [add test for mobile](https://github.com/summarizator/fora-frontend/commit/3da7ee619)
    - [add label tests](https://github.com/summarizator/fora-frontend/commit/4e3a0c02c)
    - [pass isGenerated prop](https://github.com/summarizator/fora-frontend/commit/58ee8712e)
    - [render tooltip only on desktop](https://github.com/summarizator/fora-frontend/commit/452c44f7c)

  </details>

## [0.11.67](https://github.com/summarizator/fora-frontend/compare/v0.11.66...v0.11.67) <span style="color: red;">[prod]</span>
> Tue, Jul 15 2025 | 01:41 PM EST

### Features

- [FORA-1723](https://foraday.atlassian.net/browse/FORA-1723): Migrate parachute health to new okta instance
  <details>
    <summary>Commits</summary>

    - [Fix flaky test](https://github.com/summarizator/fora-frontend/commit/2ba58346b)
    - [Migrate parachutehealth to new okta app](https://github.com/summarizator/fora-frontend/commit/24f79ecf3)

  </details>

## [0.11.66](https://github.com/summarizator/fora-frontend/compare/v0.11.65...v0.11.66) <span style="color: red;">[prod]</span>
> Mon, Jul 14 2025 | 04:25 PM EST

### Bug Fixes

- [FORA-1816](https://foraday.atlassian.net/browse/FORA-1816): Mobile label count on view more incorrect.
  <details>
    <summary>Commits</summary>

    - [Merge branch 'app' into FORA-1816-Mobile-label-count-on-view-more-incorrect](https://github.com/summarizator/fora-frontend/commit/82bd1ed16)
    - [fix labels counting](https://github.com/summarizator/fora-frontend/commit/a12f84d2b)

  </details>


### Features

- [FORA-1357](https://foraday.atlassian.net/browse/FORA-1357): [MEETING DETAIL] Copy Transcript to keep the formatting
  <details>
    <summary>Commits</summary>

    - [Merge branch 'app' into FORA-1357-MEETING-DETAIL-Copy-Transcript-to-keep-the-formatting](https://github.com/summarizator/fora-frontend/commit/01096c5c4)
    - [Merge branch 'app' into FORA-1357-MEETING-DETAIL-Copy-Transcript-to-keep-the-formatting](https://github.com/summarizator/fora-frontend/commit/820f75164)
    - [Merge branch 'app' into FORA-1357-MEETING-DETAIL-Copy-Transcript-to-keep-the-formatting](https://github.com/summarizator/fora-frontend/commit/f6a44018a)
    - [disable vtt calls before bot is ready](https://github.com/summarizator/fora-frontend/commit/96adc3722)
    - [test copy to clipboard](https://github.com/summarizator/fora-frontend/commit/2064164ad)
    - [copy vtt to clipboard](https://github.com/summarizator/fora-frontend/commit/71ccc6b7e)

  </details>

## [0.11.64](https://github.com/summarizator/fora-frontend/compare/v0.11.63...v0.11.64) <span style="color: red;">[prod]</span>
> Mon, Jul 14 2025 | 02:08 PM EST

### Bug Fixes

- [FORA-1814](https://foraday.atlassian.net/browse/FORA-1814): Overflow broken on mobile meeting details page
  <details>
    <summary>Commits</summary>

    - [Merge branch 'app' into FORA-1814-Overflow-broken-on-mobile-meeting-details-page](https://github.com/summarizator/fora-frontend/commit/9c7762bb1)
    - [fix horizontal mobile overflow](https://github.com/summarizator/fora-frontend/commit/1967f8e8e)

  </details>

- [FORA-1813](https://foraday.atlassian.net/browse/FORA-1813): Scrolling not working on Lenses and Settings pages.
  <details>
    <summary>Commits</summary>

    - [add bottom padding to mobile summary card](https://github.com/summarizator/fora-frontend/commit/f7ffca408)
    - [fix scroll on non-columned layouts](https://github.com/summarizator/fora-frontend/commit/8cddc63f6)

  </details>

## [0.11.62](https://github.com/summarizator/fora-frontend/compare/v0.11.61...v0.11.62) <span style="color: red;">[prod]</span>
> Mon, Jul 14 2025 | 09:44 AM EST

### Bug Fixes

- [FORA-1811](https://foraday.atlassian.net/browse/FORA-1811): If you scroll on the right rail of the recent page the whole page scrolls away
  <details>
    <summary>Commits</summary>

    - [Merge branch 'app' into FORA-1811-If-you-scroll-on-the-right-rail-of-the-recent-page-the-whole-page-scrolls-away](https://github.com/summarizator/fora-frontend/commit/587d9106e)
    - [change <main> overflow strategy for lg+ breakpoints](https://github.com/summarizator/fora-frontend/commit/c7c8b1b1f)

  </details>

## [0.11.61](https://github.com/summarizator/fora-frontend/compare/v0.11.60...v0.11.61) <span style="color: red;">[prod]</span>
> Fri, Jul 11 2025 | 06:12 PM EST

### Tasks

- [FORA-1794](https://foraday.atlassian.net/browse/FORA-1794): Remove FORA from Series
  <details>
    <summary>Commits</summary>

    - [Merge branch 'app' into FORA-1794-Remove-FORA-from-Series](https://github.com/summarizator/fora-frontend/commit/9a5d341c3)
    - [test for parameters passed to mutations](https://github.com/summarizator/fora-frontend/commit/d5d8974ad)
    - [remove unused](https://github.com/summarizator/fora-frontend/commit/4c3c20cee)
    - [test useRemoveFora](https://github.com/summarizator/fora-frontend/commit/7ade26822)
    - [remove unnecessary mocks](https://github.com/summarizator/fora-frontend/commit/69dfd6e87)
    - [useUnscheduleBot test](https://github.com/summarizator/fora-frontend/commit/ee378e850)
    - [test](https://github.com/summarizator/fora-frontend/commit/92ce3a2e7)
    - [add "remove bot from series" meeting card menu option](https://github.com/summarizator/fora-frontend/commit/bb8129191)

  </details>

## [0.11.60](https://github.com/summarizator/fora-frontend/compare/v0.11.59...v0.11.60) <span style="color: red;">[prod]</span>
> Fri, Jul 11 2025 | 02:22 PM EST

### Features

- [FORA-1770](https://foraday.atlassian.net/browse/FORA-1770): Bot scheduling reason
  <details>
    <summary>Commits</summary>

    - [Maintain scheduled reason during paused state](https://github.com/summarizator/fora-frontend/commit/4885675d6)
    - [Add tooltip during active and recording state](https://github.com/summarizator/fora-frontend/commit/604c2d15a)
    - [Add tooltip to summarized and recording states as well](https://github.com/summarizator/fora-frontend/commit/83cb9b74c)
    - [Add underline if there is a relevant tooltip to display to the user](https://github.com/summarizator/fora-frontend/commit/5e3ea97aa)
    - [Implement scheduled reason tooltip logic (incomplete, does not work on agenda page)](https://github.com/summarizator/fora-frontend/commit/f460e6d24)

  </details>

## [0.11.59](https://github.com/summarizator/fora-frontend/compare/v0.11.58...v0.11.59) <span style="color: red;">[prod]</span>
> Thu, Jul 10 2025 | 05:31 PM EST

### Bug Fixes

- [FORA-1009](https://foraday.atlassian.net/browse/FORA-1009): [VIDEO] Keep timeline expanded when opening video
  <details>
    <summary>Commits</summary>

    - [rename topic group component](https://github.com/summarizator/fora-frontend/commit/452d242a6)
    - [enable video button and prevent accordion closing after clicking it](https://github.com/summarizator/fora-frontend/commit/9d0f84fba)

  </details>

## [0.11.58](https://github.com/summarizator/fora-frontend/compare/v0.11.57...v0.11.58) <span style="color: red;">[prod]</span>
> Wed, Jul 9 2025 | 05:50 PM EST

### Tasks

- [FORA-1681](https://foraday.atlassian.net/browse/FORA-1681): Remove "meeting upload" page
  <details>
    <summary>Commits</summary>

    - [Merge branch 'app' into FORA-1681-Remove-meeting-upload-page](https://github.com/summarizator/fora-frontend/commit/d934e87f4)
    - [remove meeting upload settings page](https://github.com/summarizator/fora-frontend/commit/ea3e1ddd4)

  </details>

## [0.11.57](https://github.com/summarizator/fora-frontend/compare/v0.11.56...v0.11.57) <span style="color: red;">[prod]</span>
> Wed, Jul 9 2025 | 03:39 PM EST

### Features

- [FORA-1499](https://foraday.atlassian.net/browse/FORA-1499): [RECENT] Allow users to filter by my meetings vs all meetings
  <details>
    <summary>Commits</summary>

    - [Fix test after rebase](https://github.com/summarizator/fora-frontend/commit/85159def9)
    - [Bring back saved/archived on mobile](https://github.com/summarizator/fora-frontend/commit/f5a3f0ff6)
    - [Add QA comments](https://github.com/summarizator/fora-frontend/commit/8dcdb32e8)
    - [Reset tab when filters are cleared](https://github.com/summarizator/fora-frontend/commit/91de8ec4d)
    - [Add tab for all summaries/your summaries](https://github.com/summarizator/fora-frontend/commit/2226c6ff8)

  </details>

- [FORA-1758](https://foraday.atlassian.net/browse/FORA-1758): Update Prior Meetings to have full summary cards
  <details>
    <summary>Commits</summary>

    - [Merge branch 'app' into FORA-1758-prior-meetings-headline](https://github.com/summarizator/fora-frontend/commit/38518af12)
    - [Merge branch 'app' into FORA-1758-prior-meetings-headline](https://github.com/summarizator/fora-frontend/commit/75b42675e)
    - [Add test cases for showing card headline](https://github.com/summarizator/fora-frontend/commit/6cf2415f0)
    - [Fixed optimistic updating](https://github.com/summarizator/fora-frontend/commit/b7a73ecf8)
    - [update prior meetings to use summary card. add card actions to prior meetings. clarify query key issue on meetings query service](https://github.com/summarizator/fora-frontend/commit/38d726074)

  </details>

## [0.11.55](https://github.com/summarizator/fora-frontend/compare/v0.11.54...v0.11.55) <span style="color: red;">[prod]</span>
> Thu, Jul 3 2025 | 10:07 AM EST

### Features

- [FORA-1778](https://foraday.atlassian.net/browse/FORA-1778): Support okta idP login flow
  <details>
    <summary>Commits</summary>

    - [Add support for okta Idp login flow](https://github.com/summarizator/fora-frontend/commit/ac51c1f58)

  </details>


### Tasks

- [FORA-1775](https://foraday.atlassian.net/browse/FORA-1775): use setLabels endpoint
  <details>
    <summary>Commits</summary>

    - [Merge branch 'app' into FORA-1775-use-setLabels-endpoint](https://github.com/summarizator/fora-frontend/commit/d828cbf5d)
    - [Merge branch 'app' into FORA-1775-use-setLabels-endpoint](https://github.com/summarizator/fora-frontend/commit/80948f7a8)
    - [use setLabels instead of add/remove](https://github.com/summarizator/fora-frontend/commit/6d882583a)

  </details>

## [0.11.53](https://github.com/summarizator/fora-frontend/compare/v0.11.52...v0.11.53) <span style="color: red;">[prod]</span>
> Wed, Jul 2 2025 | 02:16 PM EST

### Bug Fixes

- [FORA-1776](https://foraday.atlassian.net/browse/FORA-1776): Handle error in meeting upload
  <details>
    <summary>Commits</summary>

    - [Attempt to reduce cognitive complexity](https://github.com/summarizator/fora-frontend/commit/bc2e2fb66)
    - [Handle gladia_transcription error](https://github.com/summarizator/fora-frontend/commit/b20dbddac)

  </details>

## [0.11.52](https://github.com/summarizator/fora-frontend/compare/v0.11.51...v0.11.52) <span style="color: red;">[prod]</span>
> Wed, Jul 2 2025 | 10:22 AM EST

### Bug Fixes

- [FORA-1709](https://foraday.atlassian.net/browse/FORA-1709): Handle guest access gracefully (rollbar)
  <details>
    <summary>Commits</summary>

    - [Hide labels-bar from guest users](https://github.com/summarizator/fora-frontend/commit/5cb2b69ed)
    - [Fix broken test](https://github.com/summarizator/fora-frontend/commit/6d281f6c6)
    - [Add tests for useGlobalSettings in app-header](https://github.com/summarizator/fora-frontend/commit/db6396af2)
    - [Disable labels query for guest users](https://github.com/summarizator/fora-frontend/commit/a86c676e0)
    - [Fix broken tests](https://github.com/summarizator/fora-frontend/commit/baa53f9b7)
    - [Add logic to disable certain queries for guest users](https://github.com/summarizator/fora-frontend/commit/66f19d4d1)
    - [Disable useGlobalSettings when user is guest](https://github.com/summarizator/fora-frontend/commit/6477a39a8)

  </details>

## [0.11.51](https://github.com/summarizator/fora-frontend/compare/v0.11.50...v0.11.51) <span style="color: red;">[prod]</span>
> Mon, Jun 30 2025 | 05:32 PM EST

### Features

- [FORA-1734](https://foraday.atlassian.net/browse/FORA-1734): FE - Including Label filtering in lens
  <details>
    <summary>Commits</summary>

    - [Merge branch 'app' into FORA-1734-label-lens-filter](https://github.com/summarizator/fora-frontend/commit/a5a70e2b3)
    - [test fixes](https://github.com/summarizator/fora-frontend/commit/5b6595e6c)
    - [Sonar fixes](https://github.com/summarizator/fora-frontend/commit/18c5ce0d7)
    - [Fixed bugs on creating new label in lens form](https://github.com/summarizator/fora-frontend/commit/a3d91934b)
    - [Fixed bugs on creating new label in lens form](https://github.com/summarizator/fora-frontend/commit/bc000ee0a)
    - [Adding test cases](https://github.com/summarizator/fora-frontend/commit/92b2346bb)
    - [undefined key fix](https://github.com/summarizator/fora-frontend/commit/b910fce69)
    - [Updating labels modal to use labelselect](https://github.com/summarizator/fora-frontend/commit/3e979a1ea)
    - [add label creation and editing](https://github.com/summarizator/fora-frontend/commit/2f00bbbde)
    - [Merge branch 'app' into FORA-1734-label-lens-filter](https://github.com/summarizator/fora-frontend/commit/142e344ab)
    - [minor cleanup](https://github.com/summarizator/fora-frontend/commit/607b23521)
    - [Removed ReactMultiEmail component from the create lens form people filters. Added labels filters. Updated general create-lens-form styling](https://github.com/summarizator/fora-frontend/commit/1c8e8167d)

  </details>


### Bug Fixes

- [FORA-1765](https://foraday.atlassian.net/browse/FORA-1765): fix labels being applied to other user's card 
  <details>
    <summary>Commits</summary>

    - [merge labels fix branch into ticket branch](https://github.com/summarizator/fora-frontend/commit/d1fa2977f)
    - [labels title sort](https://github.com/summarizator/fora-frontend/commit/bc906b232)
    - [fetch users card on demand](https://github.com/summarizator/fora-frontend/commit/8d8988827)
    - [sync: true](https://github.com/summarizator/fora-frontend/commit/220677ff9)
    - [optimistically update labels on recent feed](https://github.com/summarizator/fora-frontend/commit/ac35542d4)
    - [only refetch card on meeting page if initial fetch returns other user's card](https://github.com/summarizator/fora-frontend/commit/d93d6c31b)
    - [derive a users copy of meeting to navigate from recent feed](https://github.com/summarizator/fora-frontend/commit/094447353)
    - [sort by label type](https://github.com/summarizator/fora-frontend/commit/1ec42fb28)

  </details>

## [0.11.49](https://github.com/summarizator/fora-frontend/compare/v0.11.48...v0.11.49) <span style="color: red;">[prod]</span>
> Mon, Jun 30 2025 | 12:23 PM EST

### Bug Fixes

- [FORA-1064](https://foraday.atlassian.net/browse/FORA-1064): [AGENDA] control bar stuck in summarizing/error on agenda page
  <details>
    <summary>Commits</summary>

    - [Invalidate query instead of refetching](https://github.com/summarizator/fora-frontend/commit/74f46b475)
    - [Add back comment](https://github.com/summarizator/fora-frontend/commit/bc24fae25)
    - [Update path](https://github.com/summarizator/fora-frontend/commit/c6aa69482)
    - [Handle new pusher events in Agenda page logic](https://github.com/summarizator/fora-frontend/commit/250a612b9)
    - [Add fn multiBotTranscriptUpdaterFn](https://github.com/summarizator/fora-frontend/commit/25de22d40)
    - [Break out didNotGenerate into a separate helper function](https://github.com/summarizator/fora-frontend/commit/11045889c)

  </details>

## [0.11.48](https://github.com/summarizator/fora-frontend/compare/v0.11.47...v0.11.48) <span style="color: red;">[prod]</span>
> Mon, Jun 30 2025 | 11:34 AM EST

### Bug Fixes

- [FORA-1741](https://foraday.atlassian.net/browse/FORA-1741): Fix preview shared summary on Share Meeting Modal
  <details>
    <summary>Commits</summary>

    - [Merge branch 'app' into FORA-1741-preview-shared-summary-fixes](https://github.com/summarizator/fora-frontend/commit/78663b120)
    - [Add loading spinner for share meeting modal](https://github.com/summarizator/fora-frontend/commit/bdae01a8d)
    - [Fix hover modal close bug. Fix Empty meeting id bug on card context. Fixed tests.](https://github.com/summarizator/fora-frontend/commit/4f1ffe94c)
    - [Add full meeting fetching to share meeting modal to ensure sharable meeting ID exists](https://github.com/summarizator/fora-frontend/commit/2ea533633)
    - [Merge branch 'app' into FORA-1741-preview-shared-summary-fixes](https://github.com/summarizator/fora-frontend/commit/f6465c492)
    - [Stashing allMeetingContent to just remove sharing](https://github.com/summarizator/fora-frontend/commit/50821a077)

  </details>

## [0.11.47](https://github.com/summarizator/fora-frontend/compare/v0.11.46...v0.11.47) <span style="color: red;">[prod]</span>
> Fri, Jun 27 2025 | 02:25 PM EST

### Bug Fixes

- [FORA-1753](https://foraday.atlassian.net/browse/FORA-1753): Add label_ids to card search
  <details>
    <summary>Commits</summary>

    - [Add label_ids to search body on ReskinSummariesPage](https://github.com/summarizator/fora-frontend/commit/a3280c0dd)

  </details>

## [0.11.46](https://github.com/summarizator/fora-frontend/compare/v0.11.45...v0.11.46) <span style="color: red;">[prod]</span>
> Thu, Jun 26 2025 | 04:34 PM EST

### Bug Fixes

- [FORA-1749](https://foraday.atlassian.net/browse/FORA-1749): fix newly created label not being applied
  <details>
    <summary>Commits</summary>

    - [skip test for while sharing is disabled](https://github.com/summarizator/fora-frontend/commit/5189e6bb1)
    - [Merge branch 'app' into FORA-1749-fix-newly-created-label-not-being-applied](https://github.com/summarizator/fora-frontend/commit/b2b64a333)
    - [only admins are allowed to create](https://github.com/summarizator/fora-frontend/commit/22b3ab64e)
    - [fix label not applying after creating](https://github.com/summarizator/fora-frontend/commit/b9a5d5108)

  </details>

## [0.11.45](https://github.com/summarizator/fora-frontend/compare/v0.11.44...v0.11.45) <span style="color: red;">[prod]</span>
> Thu, Jun 26 2025 | 12:58 PM EST

### Features

- [FORA-1619](https://foraday.atlassian.net/browse/FORA-1619): Manually applying labels to meetings/ any other content
  <details>
    <summary>Commits</summary>

    - [statusTimeLabel spans over full width in meeting card header](https://github.com/summarizator/fora-frontend/commit/f76dbf433)
    - [4px + 8px padding in labels](https://github.com/summarizator/fora-frontend/commit/66db11332)
    - [align card action buttons](https://github.com/summarizator/fora-frontend/commit/be928edb8)
    - [fix card test - render with providers](https://github.com/summarizator/fora-frontend/commit/3faccfece)
    - [Merge branch 'app' into FORA-1619-Manually-applying-labels-to-meetings-any-other-content](https://github.com/summarizator/fora-frontend/commit/30e15f3c4)
    - [Merge branch 'app' into FORA-1619-Manually-applying-labels-to-meetings-any-other-content](https://github.com/summarizator/fora-frontend/commit/65664659e)
    - [some tests](https://github.com/summarizator/fora-frontend/commit/24e3e2720)
    - [mobile labels](https://github.com/summarizator/fora-frontend/commit/a38ca883f)
    - [prevent shifts when hovering](https://github.com/summarizator/fora-frontend/commit/899631586)
    - [Merge branch 'app' into FORA-1619-Manually-applying-labels-to-meetings-any-other-content](https://github.com/summarizator/fora-frontend/commit/1c9612027)
    - [fix undefined](https://github.com/summarizator/fora-frontend/commit/e6d62cf42)
    - [cleanup](https://github.com/summarizator/fora-frontend/commit/a5d1370b6)
    - [prevent erasing new label title](https://github.com/summarizator/fora-frontend/commit/22e357cd1)
    - [Merge branch 'app' into FORA-1619-Manually-applying-labels-to-meetings-any-other-content](https://github.com/summarizator/fora-frontend/commit/d3de21c86)
    - [show option label for creatable](https://github.com/summarizator/fora-frontend/commit/af71568e1)
    - [fix new label form resetting, add newly created label](https://github.com/summarizator/fora-frontend/commit/0ba214ae7)
    - [remove button color update](https://github.com/summarizator/fora-frontend/commit/bf2b4ccf1)
    - [fix tests](https://github.com/summarizator/fora-frontend/commit/b5868d2a9)
    - [reduce labels modals to 1 instance, use shared disclosure](https://github.com/summarizator/fora-frontend/commit/fda7822ee)
    - [refetch card queries after editing labels, send label ids only](https://github.com/summarizator/fora-frontend/commit/8a67a78ee)
    - [label tooltip](https://github.com/summarizator/fora-frontend/commit/72eb88a3f)
    - [keep labels select menu open](https://github.com/summarizator/fora-frontend/commit/f0006be96)
    - [use add/remove instead of set (PUT) to preserve auto matched labels](https://github.com/summarizator/fora-frontend/commit/7b2529363)
    - [disable labels in share summary modal](https://github.com/summarizator/fora-frontend/commit/b6e338bf5)
    - [fix modal remove, autoFocus, defaultMenuIsOpen](https://github.com/summarizator/fora-frontend/commit/010b4c3de)
    - [auto matched labels, collapse for space behind menu list](https://github.com/summarizator/fora-frontend/commit/acc4e6045)
    - [add space between labels in custom select](https://github.com/summarizator/fora-frontend/commit/6dfcf091d)
    - [fix values resetting to previous state after applying labels and closing modal](https://github.com/summarizator/fora-frontend/commit/51d7b24a6)
    - [close modal after submit, add button loading indicator](https://github.com/summarizator/fora-frontend/commit/a4a9a6d44)
    - [add/remove labels](https://github.com/summarizator/fora-frontend/commit/7ede99f05)
    - [bump openapi types](https://github.com/summarizator/fora-frontend/commit/c634accb3)

  </details>

- [FORA-1622](https://foraday.atlassian.net/browse/FORA-1622): [RECENT] - Saved/Archived/Share/+ on hover
  <details>
    <summary>Commits</summary>

    - [Merge branch 'app' into FORA-1622-saved-archived-summary-cards](https://github.com/summarizator/fora-frontend/commit/05b2629cb)
    - [fix tests](https://github.com/summarizator/fora-frontend/commit/f57180be9)
    - [full card clickable](https://github.com/summarizator/fora-frontend/commit/d683f43d0)
    - [mobile padding fixes](https://github.com/summarizator/fora-frontend/commit/eee3cc0ac)
    - [styling QA notes](https://github.com/summarizator/fora-frontend/commit/33516593a)
    - [Merge branch 'app' into FORA-1622-saved-archived-summary-cards](https://github.com/summarizator/fora-frontend/commit/d90b7372d)
    - [Add tests to reskin summary card](https://github.com/summarizator/fora-frontend/commit/d5d37bb08)
    - [Merge branch 'app' into FORA-1622-saved-archived-summary-cards](https://github.com/summarizator/fora-frontend/commit/afab22fcf)
    - [Put labels behind FF on labels, fixed archiving success notif, fixed slack channel H1 formatting](https://github.com/summarizator/fora-frontend/commit/0bdf8da3f)
    - [Merge branch 'app' into FORA-1622-saved-archived-summary-cards](https://github.com/summarizator/fora-frontend/commit/43318c80b)
    - [Merge branch 'app' into FORA-1622-saved-archived-summary-cards](https://github.com/summarizator/fora-frontend/commit/a66943726)
    - [Fix 'show shared summary' error](https://github.com/summarizator/fora-frontend/commit/8ecf79f69)
    - [fix share functionality on new summary cards](https://github.com/summarizator/fora-frontend/commit/3ddcf5883)
    - [Tooltip improvmeents for design request](https://github.com/summarizator/fora-frontend/commit/7e0a43387)
    - [minor reorg](https://github.com/summarizator/fora-frontend/commit/ca681952b)
    - [mobile support](https://github.com/summarizator/fora-frontend/commit/5e2c33336)
    - [Began rework of reskin summary card. Removed unneeded summary card footer. Added text variants](https://github.com/summarizator/fora-frontend/commit/b4a956135)

  </details>


### Bug Fixes

- [FORA-1740](https://foraday.atlassian.net/browse/FORA-1740): Fix archive refreshing on recent summaries
  <details>
    <summary>Commits</summary>

    - [Fix archive refreshing issue on recent summaries](https://github.com/summarizator/fora-frontend/commit/048304130)

  </details>

## [0.11.41](https://github.com/summarizator/fora-frontend/compare/v0.11.40...v0.11.41) <span style="color: red;">[prod]</span>
> Wed, Jun 25 2025 | 09:57 AM EST

### Features

- [FORA-1723](https://foraday.atlassian.net/browse/FORA-1723): Migrate parachute health to new okta instance
  <details>
    <summary>Commits</summary>

    - [Revert "Migrate parachutehealth to new okta app (#1517)"](https://github.com/summarizator/fora-frontend/commit/e8c7fd81b)
    - [Merge branch 'app' into FORA-1723-migrate-parachute-health-to-new-okta-instance](https://github.com/summarizator/fora-frontend/commit/25417ed9a)
    - [Merge branch 'app' into FORA-1723-migrate-parachute-health-to-new-okta-instance](https://github.com/summarizator/fora-frontend/commit/0c3b2c5de)
    - [Fix flaky test](https://github.com/summarizator/fora-frontend/commit/e64fcc1e3)
    - [Migrate parachutehealth to new okta app](https://github.com/summarizator/fora-frontend/commit/f8c2df9d1)

  </details>

- [FORA-1710](https://foraday.atlassian.net/browse/FORA-1710): [RECENT] - Add Labels Filter
  <details>
    <summary>Commits</summary>

    - [Merge branch 'app' into FORA-1710-recent-add-labels-filter](https://github.com/summarizator/fora-frontend/commit/5db15cf86)
    - [Merge branch 'app' into FORA-1710-recent-add-labels-filter](https://github.com/summarizator/fora-frontend/commit/244761168)
    - [PR comments](https://github.com/summarizator/fora-frontend/commit/06ce1208c)
    - [Add labels filter to handleResetFilters](https://github.com/summarizator/fora-frontend/commit/d640f6cb4)
    - [Add support for labels filter option on recent page](https://github.com/summarizator/fora-frontend/commit/18a8fd3ff)

  </details>


### Bug Fixes

- [FORA-1739](https://foraday.atlassian.net/browse/FORA-1739): Don't let Guest users see Summarize Button
  <details>
    <summary>Commits</summary>

    - [Merge branch 'app' into FORA-1739-hide-guest-summarize](https://github.com/summarizator/fora-frontend/commit/fa40ca485)
    - [Hide Summarize Menu from Guests](https://github.com/summarizator/fora-frontend/commit/56143e6a8)

  </details>

- [FORA-1721](https://foraday.atlassian.net/browse/FORA-1721): preview shared summary not available on recent page
  <details>
    <summary>Commits</summary>

    - [Merge branch 'app' into FORA-1721-preview-shared-summary-not-available-on-recent-page](https://github.com/summarizator/fora-frontend/commit/7db43fce9)
    - [Load full bot if required in ShareMeetingModal](https://github.com/summarizator/fora-frontend/commit/d407d3617)

  </details>

## [0.11.36](https://github.com/summarizator/fora-frontend/compare/v0.11.35...v0.11.36) <span style="color: red;">[prod]</span>
> Tue, Jun 24 2025 | 03:24 PM EST

### Tasks

- [FORA-776](https://foraday.atlassian.net/browse/FORA-776): security: rotate and remove hardcoded secret in fora-frontend repo
  <details>
    <summary>Commits</summary>

    - [Merge branch 'FORA-776-bad-secret' of https://github.com/summarizator/fora-frontend into FORA-776-bad-secret](https://github.com/summarizator/fora-frontend/commit/9ad9d65f7)
    - [test fix](https://github.com/summarizator/fora-frontend/commit/934e2e12c)
    - [Merge branch 'app' into FORA-776-bad-secret](https://github.com/summarizator/fora-frontend/commit/0d85d5c6c)
    - [remove the markdown instantiation causing test to fail because it is not used](https://github.com/summarizator/fora-frontend/commit/d42aee96b)
    - [Merge branch 'app' of https://github.com/summarizator/fora-frontend into FORA-776-bad-secret](https://github.com/summarizator/fora-frontend/commit/e1ab41033)
    - [Merge branch 'app' into FORA-776-bad-secret](https://github.com/summarizator/fora-frontend/commit/1f2bc0b99)
    - [remove code no longer used that contains unused env var](https://github.com/summarizator/fora-frontend/commit/e6d0b380e)

  </details>

## [0.11.35](https://github.com/summarizator/fora-frontend/compare/v0.11.34...v0.11.35) <span style="color: red;">[prod]</span>
> Tue, Jun 24 2025 | 02:42 PM EST

### Tasks

- [FORA-1720](https://foraday.atlassian.net/browse/FORA-1720): spike: project HURC
  <details>
    <summary>Commits</summary>

    - [Merge branch 'app' into FORA-1720-fix-tests](https://github.com/summarizator/fora-frontend/commit/1e6545c8d)
    - [Fix broken tests](https://github.com/summarizator/fora-frontend/commit/b64fe7e85)

  </details>

- [FORA-1728](https://foraday.atlassian.net/browse/FORA-1728): Clarify Form Field use cases in component testing page
  <details>
    <summary>Commits</summary>

    - [add additional size variations of custom select](https://github.com/summarizator/fora-frontend/commit/1e283b468)
    - [Added documentation/clarification on form field uses](https://github.com/summarizator/fora-frontend/commit/ae3a67240)

  </details>


### Bug Fixes

- [FORA-1729](https://foraday.atlassian.net/browse/FORA-1729): Full users can't access Home
  <details>
    <summary>Commits</summary>

    - [Merge branch 'app' into FORA-1729-full-users-home-access](https://github.com/summarizator/fora-frontend/commit/5b648689c)
    - [Moved Home page to routes for Full, Executive, and Admin users. Fixed issue where field wasn't disabled on edit lens details](https://github.com/summarizator/fora-frontend/commit/6cf145f4c)

  </details>

## [0.11.32](https://github.com/summarizator/fora-frontend/compare/v0.11.31...v0.11.32) <span style="color: red;">[prod]</span>
> Mon, Jun 23 2025 | 11:19 AM EST

### Tasks

- [FORA-1720](https://foraday.atlassian.net/browse/FORA-1720): spike: project HURC
  <details>
    <summary>Commits</summary>

    - [Merge branch 'app' into FORA-1720-project-hurc-polish](https://github.com/summarizator/fora-frontend/commit/e89706c9b)
    - [Merge branch 'app' into FORA-1720-project-hurc-polish](https://github.com/summarizator/fora-frontend/commit/bb910a67b)
    - [dont need the hack anymore](https://github.com/summarizator/fora-frontend/commit/edd56e29e)
    - [add markdown to card sections](https://github.com/summarizator/fora-frontend/commit/f480e7d9c)
    - [add status bar message hack for project hurc demo, remove later](https://github.com/summarizator/fora-frontend/commit/7230b2d00)

  </details>

## [0.11.31](https://github.com/summarizator/fora-frontend/compare/v0.11.30...v0.11.31) <span style="color: red;">[prod]</span>
> Mon, Jun 23 2025 | 11:00 AM EST

### Features

- [FORA-1726](https://foraday.atlassian.net/browse/FORA-1726): Add new okta domain to CSP headers file
  <details>
    <summary>Commits</summary>

    - [Add new okta domain to CSP headers file](https://github.com/summarizator/fora-frontend/commit/f84be027c)

  </details>

## [0.11.30](https://github.com/summarizator/fora-frontend/compare/v0.11.29...v0.11.30) <span style="color: red;">[prod]</span>
> Mon, Jun 23 2025 | 10:22 AM EST

### Features

- [FORA-1281](https://foraday.atlassian.net/browse/FORA-1281): 3. Lens Insights on Earnings call page
  <details>
    <summary>Commits</summary>

    - [Merge branch 'app' into FORA-1281-earnings-call-lens-insights](https://github.com/summarizator/fora-frontend/commit/cdd7b7a55)
    - [Fixed generic insight panel source linking](https://github.com/summarizator/fora-frontend/commit/3f85aff54)
    - [update tests for card functionality](https://github.com/summarizator/fora-frontend/commit/a7cd1677c)
    - [fix lens card fetching for earnings call page](https://github.com/summarizator/fora-frontend/commit/c1be6a0b6)
    - [fix source modal links to go to expected earnings calls. Updated and cleaned up tests for simpler functionality](https://github.com/summarizator/fora-frontend/commit/567cc156f)
    - [Fixed issue where source modal would have link to current page](https://github.com/summarizator/fora-frontend/commit/39fe7005d)
    - [Updated focus and lens card fetching on the earnings call details page. Removed duplicate 'get link to source of card' functions in card helpers](https://github.com/summarizator/fora-frontend/commit/7309ab17c)
    - [Merge branch 'app' into FORA-1281-earnings-call-lens-insights](https://github.com/summarizator/fora-frontend/commit/0d972b0ac)
    - [minor sonar fixes to pp components"](https://github.com/summarizator/fora-frontend/commit/773c83209)
    - [Test fixes](https://github.com/summarizator/fora-frontend/commit/584baef52)
    - [Test fixes part 1](https://github.com/summarizator/fora-frontend/commit/ba51cf246)
    - [Merge branch 'app' into FORA-1281-earnings-call-lens-insights](https://github.com/summarizator/fora-frontend/commit/1af0f1528)
    - [minor clean console errors](https://github.com/summarizator/fora-frontend/commit/b8ec50d56)
    - [fixed source logo issue on source-modal-header, along with styling redundancies](https://github.com/summarizator/fora-frontend/commit/d3efa6b37)
    - [Add 'insights from lenses' section to earnings call details page. Updated lens card fetching logic to be simpler and more consistent with how backend works](https://github.com/summarizator/fora-frontend/commit/7318bffe5)
    - [Cleaned up SourceInfo component and updated it to leverage SourceLogo component](https://github.com/summarizator/fora-frontend/commit/fe177a5ca)
    - [Cleaned up generic insight panel subcomponents, notably using SourceLogo component and reducing repeated template definitions](https://github.com/summarizator/fora-frontend/commit/3f638cb1e)
    - [Cleaned up imperativeRef references and other oddities](https://github.com/summarizator/fora-frontend/commit/c5c3ed298)
    - [Cleaned up existing insight-tabs, insight-list, generic-insight-panel, source-=modal, and source-modal-header components](https://github.com/summarizator/fora-frontend/commit/2a38c6c96)

  </details>

- [FORA-1582](https://foraday.atlassian.net/browse/FORA-1582): Ask - reasoning window changes
  <details>
    <summary>Commits</summary>

    - [Merge branch 'app' into FORA-1582-Ask-reasoning-window-changes](https://github.com/summarizator/fora-frontend/commit/ab26b38ca)
    - [green tests](https://github.com/summarizator/fora-frontend/commit/13cccc442)
    - [cot display test](https://github.com/summarizator/fora-frontend/commit/6c9b74a7f)
    - [reorg](https://github.com/summarizator/fora-frontend/commit/b03fab77a)
    - [fullscreen responsive](https://github.com/summarizator/fora-frontend/commit/ce16cc12c)
    - [chat reasoning](https://github.com/summarizator/fora-frontend/commit/bbb01c220)

  </details>

## [0.11.28](https://github.com/summarizator/fora-frontend/compare/v0.11.27...v0.11.28) <span style="color: red;">[prod]</span>
> Fri, Jun 20 2025 | 12:39 PM EST

### Bug Fixes

- [FORA-1643](https://foraday.atlassian.net/browse/FORA-1643): Allow admins to access /home
  <details>
    <summary>Commits</summary>

    - [Merge branch 'app' into FORA-1643-admin-home-access](https://github.com/summarizator/fora-frontend/commit/73c0e1540)
    - [add home page to executive/admin routes instead of executive only](https://github.com/summarizator/fora-frontend/commit/d9ffa1c3f)

  </details>

- [FORA-1707](https://foraday.atlassian.net/browse/FORA-1707): Make PDF downloadable for private meetings
  <details>
    <summary>Commits</summary>

    - [Disable tooltip for pdf](https://github.com/summarizator/fora-frontend/commit/c6729e0e4)

  </details>

- [FORA-1692](https://foraday.atlassian.net/browse/FORA-1692): Change copy in earnings call modal
  <details>
    <summary>Commits</summary>

    - [Change copy again](https://github.com/summarizator/fora-frontend/commit/7f4edcf7c)
    - [Fix sonar complaint](https://github.com/summarizator/fora-frontend/commit/fcc2bbad4)
    - [Remove NYSE](https://github.com/summarizator/fora-frontend/commit/548c23e08)
    - [Change copy on earnings call modal](https://github.com/summarizator/fora-frontend/commit/601297af0)

  </details>


### Features

- [FORA-1281](https://foraday.atlassian.net/browse/FORA-1281): 3. Lens Insights on Earnings call page
  <details>
    <summary>Commits</summary>

    - [Revert "FORA-1281: Earnings Call Lens Insights (#1509)"](https://github.com/summarizator/fora-frontend/commit/8280ac521)
    - [Merge branch 'app' into FORA-1281-earnings-call-lens-insights](https://github.com/summarizator/fora-frontend/commit/0d972b0ac)
    - [minor sonar fixes to pp components"](https://github.com/summarizator/fora-frontend/commit/773c83209)
    - [Test fixes](https://github.com/summarizator/fora-frontend/commit/584baef52)
    - [Test fixes part 1](https://github.com/summarizator/fora-frontend/commit/ba51cf246)
    - [Merge branch 'app' into FORA-1281-earnings-call-lens-insights](https://github.com/summarizator/fora-frontend/commit/1af0f1528)
    - [minor clean console errors](https://github.com/summarizator/fora-frontend/commit/b8ec50d56)
    - [fixed source logo issue on source-modal-header, along with styling redundancies](https://github.com/summarizator/fora-frontend/commit/d3efa6b37)
    - [Add 'insights from lenses' section to earnings call details page. Updated lens card fetching logic to be simpler and more consistent with how backend works](https://github.com/summarizator/fora-frontend/commit/7318bffe5)
    - [Cleaned up SourceInfo component and updated it to leverage SourceLogo component](https://github.com/summarizator/fora-frontend/commit/fe177a5ca)
    - [Cleaned up generic insight panel subcomponents, notably using SourceLogo component and reducing repeated template definitions](https://github.com/summarizator/fora-frontend/commit/3f638cb1e)
    - [Cleaned up imperativeRef references and other oddities](https://github.com/summarizator/fora-frontend/commit/c5c3ed298)
    - [Cleaned up existing insight-tabs, insight-list, generic-insight-panel, source-=modal, and source-modal-header components](https://github.com/summarizator/fora-frontend/commit/2a38c6c96)

  </details>

## [0.11.23](https://github.com/summarizator/fora-frontend/compare/v0.11.22...v0.11.23) <span style="color: red;">[prod]</span>
> Tue, Jun 17 2025 | 12:28 PM EST

### Features

- [FORA-1617](https://foraday.atlassian.net/browse/FORA-1617): Editing Labels
  <details>
    <summary>Commits</summary>

    - [Merge branch 'app' into FORA-1617-Editing-Labels](https://github.com/summarizator/fora-frontend/commit/abcc16a55)
    - [create and edit note variants](https://github.com/summarizator/fora-frontend/commit/7b50057b6)
    - [update label form note copy](https://github.com/summarizator/fora-frontend/commit/598996cbe)
    - [limit title length without `progressive: true`, update text styles](https://github.com/summarizator/fora-frontend/commit/736fe1820)

  </details>


### Bug Fixes

- [FORA-1669](https://foraday.atlassian.net/browse/FORA-1669): Remove Prior Meeting from navigation if there are no prior meetings to show
  <details>
    <summary>Commits</summary>

    - [Merge branch 'app' into FORA-1669-Remove-Prior-Meeting-from-navigation-if-there-are-no-prior-meetings-to-show](https://github.com/summarizator/fora-frontend/commit/a741d4676)
    - [use top-file model instead of passing](https://github.com/summarizator/fora-frontend/commit/5830bffff)
    - [fix outgoing requests to undefined model](https://github.com/summarizator/fora-frontend/commit/f90e4b4ed)
    - [Merge branch 'app' into FORA-1669-Remove-Prior-Meeting-from-navigation-if-there-are-no-prior-meetings-to-show](https://github.com/summarizator/fora-frontend/commit/ffedeafe6)
    - [Merge branch 'app' into FORA-1669-Remove-Prior-Meeting-from-navigation-if-there-are-no-prior-meetings-to-show](https://github.com/summarizator/fora-frontend/commit/9d7d94b1e)
    - [Merge branch 'app' into FORA-1669-Remove-Prior-Meeting-from-navigation-if-there-are-no-prior-meetings-to-show](https://github.com/summarizator/fora-frontend/commit/92999a1db)
    - [Merge branch 'app' into FORA-1669-Remove-Prior-Meeting-from-navigation-if-there-are-no-prior-meetings-to-show](https://github.com/summarizator/fora-frontend/commit/73fda5949)
    - [reorg](https://github.com/summarizator/fora-frontend/commit/01189f182)
    - [getPriorMeetingsSections test](https://github.com/summarizator/fora-frontend/commit/d2339d104)
    - [change check for meeting status before showing ago time](https://github.com/summarizator/fora-frontend/commit/ac2e9f9b6)
    - [hide prior meetings sections with no results, refactor](https://github.com/summarizator/fora-frontend/commit/1a44723d9)

  </details>

- [FORA-1696](https://foraday.atlassian.net/browse/FORA-1696): Do not close modal when "Learn more" is clicked in Digest Form
  <details>
    <summary>Commits</summary>

    - [Merge branch 'app' into FORA-1696-Do-not-close-modal-when-Learn-more-is-clicked-in-Digest-Form](https://github.com/summarizator/fora-frontend/commit/f2821c5c6)
    - [Merge branch 'app' into FORA-1696-Do-not-close-modal-when-Learn-more-is-clicked-in-Digest-Form](https://github.com/summarizator/fora-frontend/commit/a15e12889)
    - [don't close the modal when Learn More is clicked](https://github.com/summarizator/fora-frontend/commit/ec163aca9)

  </details>

- [FORA-1707](https://foraday.atlassian.net/browse/FORA-1707): Make PDF downloadable for private meetings
  <details>
    <summary>Commits</summary>

    - [Allow download of pdf even if meeting is private](https://github.com/summarizator/fora-frontend/commit/b71e726f3)

  </details>

- [FORA-1708](https://foraday.atlassian.net/browse/FORA-1708): MeetingChat: Fix bug after clearing the meeting chat 
  <details>
    <summary>Commits</summary>

    - [Merge branch 'app' into FORA-1708-clear-chat-but](https://github.com/summarizator/fora-frontend/commit/523257dd6)
    - [fix tests](https://github.com/summarizator/fora-frontend/commit/8a07a2c1e)
    - [fix clear chat function and handle network errors](https://github.com/summarizator/fora-frontend/commit/668bda4f5)

  </details>

- [FORA-1657](https://foraday.atlassian.net/browse/FORA-1657): ViewsShareCard making invalid search
  <details>
    <summary>Commits</summary>

    - [Add maxW](https://github.com/summarizator/fora-frontend/commit/aacdef8c3)
    - [Disable FF build logic unless in production](https://github.com/summarizator/fora-frontend/commit/bed5680fd)
    - [Handle people search in ViewsShareCard component](https://github.com/summarizator/fora-frontend/commit/36f25b756)

  </details>

## [0.11.16](https://github.com/summarizator/fora-frontend/compare/v0.11.15...v0.11.16) <span style="color: red;">[prod]</span>
> Fri, Jun 13 2025 | 03:03 PM EST

### Bug Fixes

- [FORA-1700](https://foraday.atlassian.net/browse/FORA-1700): Remove extraneous get video url call
  <details>
    <summary>Commits</summary>

    - [Another sonar issue](https://github.com/summarizator/fora-frontend/commit/223b5f715)
    - [Fix sonar complaints](https://github.com/summarizator/fora-frontend/commit/84d42f1da)
    - [Do not pass bot to useVideoThumbnail](https://github.com/summarizator/fora-frontend/commit/f80a40e42)
    - [Remove extraneous useBotVideoUrl call](https://github.com/summarizator/fora-frontend/commit/fb81be07c)

  </details>

## [0.11.15](https://github.com/summarizator/fora-frontend/compare/v0.11.14...v0.11.15) <span style="color: red;">[prod]</span>
> Thu, Jun 12 2025 | 04:35 PM EST

### Bug Fixes

- [FORA-1683](https://foraday.atlassian.net/browse/FORA-1683): Fix exported PDF using card sections instead of `bot.recap`
  <details>
    <summary>Commits</summary>

    - [Merge branch 'app' into FORA-1683-fix-exported-pdf-using-card-sections-instead-of-bot-recap](https://github.com/summarizator/fora-frontend/commit/75111c8ea)
    - [Merge branch 'app' into FORA-1683-fix-exported-pdf-using-card-sections-instead-of-bot-recap](https://github.com/summarizator/fora-frontend/commit/132823ce7)
    - [Merge branch 'app' into FORA-1683-fix-exported-pdf-using-card-sections-instead-of-bot-recap](https://github.com/summarizator/fora-frontend/commit/5952461ba)
    - [Pass bot recap to PDFSummaryCard](https://github.com/summarizator/fora-frontend/commit/149bb3321)

  </details>

- [FORA-1702](https://foraday.atlassian.net/browse/FORA-1702): fix mobile chat erroring when it gets opened
  <details>
    <summary>Commits</summary>

    - [?](https://github.com/summarizator/fora-frontend/commit/2380a0571)

  </details>

## [0.11.13](https://github.com/summarizator/fora-frontend/compare/v0.11.12...v0.11.13) <span style="color: red;">[prod]</span>
> Thu, Jun 12 2025 | 01:30 PM EST

### Bug Fixes

- [FORA-1680](https://foraday.atlassian.net/browse/FORA-1680): Handle "Title is already in use" error when creating a label
  <details>
    <summary>Commits</summary>

    - [Merge branch 'app' into FORA-1680-Handle-Title-is-already-in-use-error-when-creating-a-label](https://github.com/summarizator/fora-frontend/commit/4fee8acf1)
    - [handle title already in use error](https://github.com/summarizator/fora-frontend/commit/fbee9ed75)
    - [eslint/quotes](https://github.com/summarizator/fora-frontend/commit/fd2182c17)

  </details>

## [0.11.12](https://github.com/summarizator/fora-frontend/compare/v0.11.11...v0.11.12) <span style="color: red;">[prod]</span>
> Wed, Jun 11 2025 | 03:45 PM EST

### Bug Fixes

- [FORA-1684](https://foraday.atlassian.net/browse/FORA-1684): Fix chat responding with "I've encountered an error" during a live meeting
  <details>
    <summary>Commits</summary>

    - [add null check for rollbar failure](https://github.com/summarizator/fora-frontend/commit/a5ff42355)

  </details>

## [0.11.11](https://github.com/summarizator/fora-frontend/compare/v0.11.10...v0.11.11) <span style="color: red;">[prod]</span>
> Wed, Jun 11 2025 | 01:39 PM EST

### Bug Fixes

- [FORA-1668](https://foraday.atlassian.net/browse/FORA-1668): Move skullcandy to OIN okta app
  <details>
    <summary>Commits</summary>

    - [Merge branch 'app' into FORA-1668-move-skullcandy-to-oin-okta-app](https://github.com/summarizator/fora-frontend/commit/29828871e)
    - [Migrate skullcandy to OIN okta app](https://github.com/summarizator/fora-frontend/commit/ff73688e8)

  </details>

## [0.11.10](https://github.com/summarizator/fora-frontend/compare/v0.11.9...v0.11.10) <span style="color: red;">[prod]</span>
> Tue, Jun 10 2025 | 03:54 PM EST

### Features

- [FORA-1585](https://foraday.atlassian.net/browse/FORA-1585): Update handling of didNotGenerate status
  <details>
    <summary>Commits</summary>

    - [Merge branch 'app' into FORA-1585-didNotGenerate-status](https://github.com/summarizator/fora-frontend/commit/0bdbb113d)
    - [test fixes](https://github.com/summarizator/fora-frontend/commit/df06410c4)
    - [Merge branch 'app' into FORA-1585-didNotGenerate-status](https://github.com/summarizator/fora-frontend/commit/6bad13a4b)
    - [Merge branch 'app' into FORA-1585-didNotGenerate-status](https://github.com/summarizator/fora-frontend/commit/b3dceebe7)
    - [Merge branch 'app' into FORA-1585-didNotGenerate-status](https://github.com/summarizator/fora-frontend/commit/ba1bc626b)
    - [remove meeting from botStatus argument and passed as second argument. Updated JSDocumentation](https://github.com/summarizator/fora-frontend/commit/352c7fd41)
    - [Add additional test cases to didNotGenerate logci](https://github.com/summarizator/fora-frontend/commit/c6d5d0491)
    - [add condition and check for all status_changes having a num_of_summaries pusher value](https://github.com/summarizator/fora-frontend/commit/984b5b476)
    - [revert](https://github.com/summarizator/fora-frontend/commit/9210bba45)
    - [Cleaned up analytics service imports. Removed URLs from test bot in component testing control bar section](https://github.com/summarizator/fora-frontend/commit/b19fa4017)
    - [Merge branch 'app' into FORA-1585-didNotGenerate-status](https://github.com/summarizator/fora-frontend/commit/c9363a7b8)
    - [added num_of_summaries pusher checks to didNotGenerate status](https://github.com/summarizator/fora-frontend/commit/006d2d47d)
    - [Add additional didNotGenerate checks for num_of_summaries value. Added duplicate prevention logic to the bot updater functions. Added some documentation clarifying all this pusher stuff"](https://github.com/summarizator/fora-frontend/commit/054af15ec)
    - [Merge remote-tracking branch 'origin/app' into FORA-1585-didNotGenerate-status](https://github.com/summarizator/fora-frontend/commit/876cb0481)
    - [Merge remote-tracking branch 'origin/app' into FORA-1585-didNotGenerate-status](https://github.com/summarizator/fora-frontend/commit/af7d036ea)
    - [minor naming revert](https://github.com/summarizator/fora-frontend/commit/f81abbcd3)
    - [test fix](https://github.com/summarizator/fora-frontend/commit/56b966efc)
    - [remove unnecessary lines of bot code](https://github.com/summarizator/fora-frontend/commit/027209e71)
    - [Add control bar testing page](https://github.com/summarizator/fora-frontend/commit/e53083067)
    - [Merge remote-tracking branch 'origin/app' into FORA-1585-didNotGenerate-status](https://github.com/summarizator/fora-frontend/commit/a28333d9e)
    - [Updated 'didNotGenerate' meeting status to use bot.fatal code instead of done and not summary](https://github.com/summarizator/fora-frontend/commit/7630bf8b5)

  </details>

- [FORA-991](https://foraday.atlassian.net/browse/FORA-991): Delete meetings
  <details>
    <summary>Commits</summary>

    - [Merge branch 'app' into FORA-991-delete-meetings](https://github.com/summarizator/fora-frontend/commit/31d146ce6)
    - [minor test case fix](https://github.com/summarizator/fora-frontend/commit/fb2067da5)
    - [Updated digests management to use new delete confirmation modal](https://github.com/summarizator/fora-frontend/commit/4386b686b)
    - [Utilized delete confirmation modal](https://github.com/summarizator/fora-frontend/commit/4a8ba4a08)
    - [Merge branch 'app' into FORA-991-delete-meetings](https://github.com/summarizator/fora-frontend/commit/e65558e53)
    - [fix non-today optimistic update issue](https://github.com/summarizator/fora-frontend/commit/ba6c53dcc)
    - [Fixed meeting detail and feed summary archive issues](https://github.com/summarizator/fora-frontend/commit/b54b5dbf5)
    - [Merge branch 'app' into FORA-991-delete-meetings](https://github.com/summarizator/fora-frontend/commit/610f7daab)
    - [Add test cases to useAGendaMeetingActions](https://github.com/summarizator/fora-frontend/commit/c65831526)
    - [Add insight and card invalidation after archiving a meeeting. Add optimistic updating of agenda meetings from meeting detail page if the day of the meeting is that day](https://github.com/summarizator/fora-frontend/commit/1a12cd5a4)
    - [minor clean](https://github.com/summarizator/fora-frontend/commit/460219803)
    - [Merge branch 'app' into FORA-991-delete-meetings](https://github.com/summarizator/fora-frontend/commit/9b4881057)
    - [minor clean](https://github.com/summarizator/fora-frontend/commit/b26b6b198)
    - [fix invalidation issue on meetingd etails](https://github.com/summarizator/fora-frontend/commit/09be3fb2d)
    - [minor clean](https://github.com/summarizator/fora-frontend/commit/42b28b9a8)
    - [added meeting archiving support to recent feed, agenda, and meeting details pages-](https://github.com/summarizator/fora-frontend/commit/819b7eefd)
    - [fixing query invalidation on the delete meeting action](https://github.com/summarizator/fora-frontend/commit/049f10435)
    - [Updated delete modal. Added archive meeting service call to reskin-meeting-menu](https://github.com/summarizator/fora-frontend/commit/c75d05dbc)
    - [Add delete option to meeting card menu. Deleted old unused files](https://github.com/summarizator/fora-frontend/commit/9f334f21d)

  </details>

## [0.11.8](https://github.com/summarizator/fora-frontend/compare/v0.11.7...v0.11.8) <span style="color: red;">[prod]</span>
> Tue, Jun 10 2025 | 12:26 PM EST

### Epics

- [FORA-1](https://foraday.atlassian.net/browse/FORA-1): test epic
  <details>
    <summary>Commits</summary>

    - [another small change to force a bump](https://github.com/summarizator/fora-frontend/commit/79e490a97)

  </details>

## [0.11.7](https://github.com/summarizator/fora-frontend/compare/v0.11.6...v0.11.7) <span style="color: red;">[prod]</span>
> Tue, Jun 10 2025 | 10:01 AM EST

### Features

- [FORA-1614](https://foraday.atlassian.net/browse/FORA-1614): Creating Labels
  <details>
    <summary>Commits</summary>

    - [Merge branch 'app' into FORA-1614-Creating-Labels](https://github.com/summarizator/fora-frontend/commit/27a706172)
    - [Merge branch 'app' into FORA-1614-Creating-Labels](https://github.com/summarizator/fora-frontend/commit/f30784aa6)
    - [manage-labels test](https://github.com/summarizator/fora-frontend/commit/31d98bc52)
    - [fix tests](https://github.com/summarizator/fora-frontend/commit/803c8eb2b)
    - [remove sorting config for created by](https://github.com/summarizator/fora-frontend/commit/9cde67460)
    - [cleanup](https://github.com/summarizator/fora-frontend/commit/4d5f33a52)
    - [disable filtering, useConst columns](https://github.com/summarizator/fora-frontend/commit/0127bc683)
    - [add created_by column](https://github.com/summarizator/fora-frontend/commit/595e7f5b8)
    - [unset selected label after delete, refactor overriding `disclosure.onClose`](https://github.com/summarizator/fora-frontend/commit/f313df627)
    - [confirmation modal, "expansion" column](https://github.com/summarizator/fora-frontend/commit/e7da7c63a)
    - [add sorting values config to specify different values for Table API and `/search`](https://github.com/summarizator/fora-frontend/commit/c04b6b79a)
    - [archive instead of deleting, remove title uniqueness validation](https://github.com/summarizator/fora-frontend/commit/37fc90204)
    - [check if title is already in use within tenant](https://github.com/summarizator/fora-frontend/commit/bf1062be3)
    - [reset on close](https://github.com/summarizator/fora-frontend/commit/952ffd843)
    - [disable name sorting](https://github.com/summarizator/fora-frontend/commit/29a9f53d7)
    - [style add label button, submit button text](https://github.com/summarizator/fora-frontend/commit/07007ab1e)
    - [add applepencil icon](https://github.com/summarizator/fora-frontend/commit/73a6015e8)
    - [search/filtering](https://github.com/summarizator/fora-frontend/commit/b3011f403)
    - [styling, use refetch after patch (optimistic update didnt work)](https://github.com/summarizator/fora-frontend/commit/030f0c781)
    - [delete label, limit title input characters](https://github.com/summarizator/fora-frontend/commit/a077c2c90)
    - [create labels](https://github.com/summarizator/fora-frontend/commit/4361f5064)
    - [update labels](https://github.com/summarizator/fora-frontend/commit/155f9b8f6)
    - [make manage-labels accessible to Admin users only](https://github.com/summarizator/fora-frontend/commit/05a096253)
    - [add `expandedRowChildren` prop to `Table`](https://github.com/summarizator/fora-frontend/commit/6f75af460)
    - [labels: ff, settings nav item and part of manage labels (table and copied modal)](https://github.com/summarizator/fora-frontend/commit/4b1169397)
    - [bump openapi types](https://github.com/summarizator/fora-frontend/commit/7ba1a8a0e)

  </details>


### Bug Fixes

- [FORA-1676](https://foraday.atlassian.net/browse/FORA-1676): Fix rows not expanding in Topics Table
  <details>
    <summary>Commits</summary>

    - [Merge branch 'app' into FORA-1676-Fix-rows-not-expanding-in-Topics-Table](https://github.com/summarizator/fora-frontend/commit/e5f141eef)
    - [useState in Topics component to track expanded rows](https://github.com/summarizator/fora-frontend/commit/179f62d16)

  </details>

## [0.11.5](https://github.com/summarizator/fora-frontend/compare/v0.11.4...v0.11.5) <span style="color: red;">[prod]</span>
> Mon, Jun 9 2025 | 03:52 PM EST

### Bug Fixes

- [FORA-1661](https://foraday.atlassian.net/browse/FORA-1661): Handle invalid filenames in meeting upload
  <details>
    <summary>Commits</summary>

    - [Allow underscore and parentheses](https://github.com/summarizator/fora-frontend/commit/112686658)
    - [Add filename and start-time validation to summarize upload](https://github.com/summarizator/fora-frontend/commit/bd968cba5)

  </details>

## [0.11.4](https://github.com/summarizator/fora-frontend/compare/v0.11.3...v0.11.4) <span style="color: red;">[prod]</span>
> Mon, Jun 9 2025 | 02:29 PM EST

### Bug Fixes

- [FORA-1674](https://foraday.atlassian.net/browse/FORA-1674): Add failing urls to CSP headers
  <details>
    <summary>Commits</summary>

    - [Add urls to csp-header file to avoid rollbar error](https://github.com/summarizator/fora-frontend/commit/b127dcf6c)

  </details>

## [0.11.3](https://github.com/summarizator/fora-frontend/compare/v0.11.2...v0.11.3) <span style="color: red;">[prod]</span>
> Fri, Jun 6 2025 | 12:41 PM EST

### Features

- [FORA-1282](https://foraday.atlassian.net/browse/FORA-1282): 4. Add Ask to Earnings call detail page
  <details>
    <summary>Commits</summary>

    - [Merge branch 'app' into FORA-1282-earnings-call-ask](https://github.com/summarizator/fora-frontend/commit/2814ad333)
    - [fix test](https://github.com/summarizator/fora-frontend/commit/7016f48d7)
    - [Merge branch 'app' of https://github.com/summarizator/fora-frontend into FORA-1282-earnings-call-ask](https://github.com/summarizator/fora-frontend/commit/6651c57a6)
    - [generate some honestly not terrible documentation about chat components](https://github.com/summarizator/fora-frontend/commit/6443edb59)
    - [move wrapper to top level](https://github.com/summarizator/fora-frontend/commit/dfa9c3770)
    - [remove unused test imports](https://github.com/summarizator/fora-frontend/commit/8b37d3d6e)
    - [rename chat.component to meeting-chat.component and move it for clarity](https://github.com/summarizator/fora-frontend/commit/6a9eedc0f)
    - [consolidate chat hooks where possible](https://github.com/summarizator/fora-frontend/commit/00f1eb579)
    - [Merge branch 'FORA-1282-earnings-call-ask' of https://github.com/summarizator/fora-frontend into FORA-1282-earnings-call-ask](https://github.com/summarizator/fora-frontend/commit/08c51dc17)
    - [Merge branch 'app' into FORA-1282-earnings-call-ask](https://github.com/summarizator/fora-frontend/commit/47b9a65d8)
    - [fix the last test](https://github.com/summarizator/fora-frontend/commit/6c37e8aae)
    - [store tests](https://github.com/summarizator/fora-frontend/commit/d2b4f26b7)
    - [create hooks for retrieving chat specific logic](https://github.com/summarizator/fora-frontend/commit/c67d6a8c9)
    - [some of the comments](https://github.com/summarizator/fora-frontend/commit/5ee87c697)
    - [merge from app](https://github.com/summarizator/fora-frontend/commit/66cefee55)
    - [tests in progress](https://github.com/summarizator/fora-frontend/commit/117031fcf)
    - [Merge branch 'FORA-1282-earnings-call-ask' of github.com:summarizator/fora-frontend into FORA-1282-earnings-call-ask](https://github.com/summarizator/fora-frontend/commit/767384ac6)
    - [improved title handling for custom summaries](https://github.com/summarizator/fora-frontend/commit/f7aa2fe66)
    - [Merge branch 'app' into FORA-1282-earnings-call-ask](https://github.com/summarizator/fora-frontend/commit/67409da09)
    - [checkpoint -- need to get the SLS function up before continuing](https://github.com/summarizator/fora-frontend/commit/ff020feb3)
    - [header is now source agnostic](https://github.com/summarizator/fora-frontend/commit/3927d381a)
    - [Merge branch 'FORA-1282-earnings-call-ask' of https://github.com/summarizator/fora-frontend into FORA-1282-earnings-call-ask](https://github.com/summarizator/fora-frontend/commit/a18a6c9f0)
    - [checkpoint - mid refactor](https://github.com/summarizator/fora-frontend/commit/606d0eb0e)
    - [begin refactoring the various chat stores together](https://github.com/summarizator/fora-frontend/commit/74ae8fd0f)
    - [checkpoint -- need to refactor all the chat components to work with non-meeting data sources](https://github.com/summarizator/fora-frontend/commit/a0c79c004)

  </details>


### Tasks

- [FORA-1667](https://foraday.atlassian.net/browse/FORA-1667): summary text - safely removing `\n`
  <details>
    <summary>Commits</summary>

    - [Merge branch 'app' into FORA-1667-summary-text-safely-removing-n](https://github.com/summarizator/fora-frontend/commit/a6dc331ab)
    - [add bullet points test](https://github.com/summarizator/fora-frontend/commit/2b5dfe7f9)
    - [\\n in other places](https://github.com/summarizator/fora-frontend/commit/53627752d)
    - [ACTUALLY replace \n in a string](https://github.com/summarizator/fora-frontend/commit/a6dd27ebc)

  </details>

## [0.11.1](https://github.com/summarizator/fora-frontend/compare/v0.11.0...v0.11.1) <span style="color: red;">[prod]</span>
> Fri, Jun 6 2025 | 11:19 AM EST

### Features

- [FORA-1655](https://foraday.atlassian.net/browse/FORA-1655): Cleanup rollbar error grouping
  <details>
    <summary>Commits</summary>

    - [Add try/catch to prevent exception](https://github.com/summarizator/fora-frontend/commit/2fe0afc01)
    - [Handle undefined and update tests](https://github.com/summarizator/fora-frontend/commit/8d63b4334)
    - [Re-use url const](https://github.com/summarizator/fora-frontend/commit/22a30448b)
    - [Handle case where key exists but is undefined](https://github.com/summarizator/fora-frontend/commit/63ae6b025)
    - [Improve formatting of axios errors in rollbar](https://github.com/summarizator/fora-frontend/commit/3956e4efc)

  </details>

## [0.11.0](https://github.com/summarizator/fora-frontend/compare/v0.11.-1...v0.11.0) <span style="color: red;">[prod]</span>
> Thu, Jun 5 2025 | 04:06 PM EST

### Tasks

- [FORA-1584](https://foraday.atlassian.net/browse/FORA-1584): SPIKE: Statsig event tracking strategy
  <details>
    <summary>Commits</summary>

    - [Merge branch 'app' into FORA-1584-SPIKE-Statsig-event-tracking-strategy](https://github.com/summarizator/fora-frontend/commit/aa230782f)
    - [simplify click tracking logic by consolidating conditions for tracking state](https://github.com/summarizator/fora-frontend/commit/1b1b8f28c)
    - [refactor analytics service to reduce payload size by removing duplicate fields for Pendo compatibility](https://github.com/summarizator/fora-frontend/commit/ad224e04b)
    - [enhance click tracking tests with additional context and mock implementations](https://github.com/summarizator/fora-frontend/commit/bb782a273)
    - [enhance click tracking by capturing context at click time](https://github.com/summarizator/fora-frontend/commit/43fbf1e50)
    - [md updates](https://github.com/summarizator/fora-frontend/commit/4a962a50d)
    - [md](https://github.com/summarizator/fora-frontend/commit/062c87ef6)
    - [md](https://github.com/summarizator/fora-frontend/commit/e55c4359a)
    - [sonar2](https://github.com/summarizator/fora-frontend/commit/4496f8f8a)
    - [sonar1](https://github.com/summarizator/fora-frontend/commit/19d4ce8b6)
    - [feat: integrate analytics service for accordion header click tracking](https://github.com/summarizator/fora-frontend/commit/59419538e)
    - [feat: replace Pendo tracking with analytics service for event tracking in chat and share components](https://github.com/summarizator/fora-frontend/commit/780b7c395)
    - [feat: implement analytics service for event tracking in components that did it before](https://github.com/summarizator/fora-frontend/commit/3847f5f6c)
    - [feat: remove performance configuration from analytics settings and update original properties handling](https://github.com/summarizator/fora-frontend/commit/7499aa24b)
    - [feat: add comprehensive documentation for analytics system architecture and configuration](https://github.com/summarizator/fora-frontend/commit/e5757f27e)
    - [feat: add comprehensive tests for analytics helpers and configuration](https://github.com/summarizator/fora-frontend/commit/58d59401f)
    - [feat: optimize lodash usage in analytics configuration validation and deep cloning](https://github.com/summarizator/fora-frontend/commit/49b5725ce)
    - [feat: enhance analytics service tests with comprehensive lodash mocks and improved event tracking logic](https://github.com/summarizator/fora-frontend/commit/af0cccace)
    - [feat: enhance analytics service by optimizing lodash usage and improving property handling](https://github.com/summarizator/fora-frontend/commit/12fe1bd6b)
    - [feat: streamline event property organization and enhance event data creation](https://github.com/summarizator/fora-frontend/commit/c5577ae95)
    - [feat: implement unified button name detection and enhance analytics configuration handling](https://github.com/summarizator/fora-frontend/commit/313963ee8)
    - [feat: enhance analytics logging with improved message formatting and additional context](https://github.com/summarizator/fora-frontend/commit/890f5ea98)
    - [feat: refactor analytics logging functions and configuration for improved modularity](https://github.com/summarizator/fora-frontend/commit/e5e7a8d39)
    - [feat: mock build-info.json for tests to ensure consistent test environment](https://github.com/summarizator/fora-frontend/commit/48e306238)
    - [feat: mock build-info.json for tests to ensure consistent test environment](https://github.com/summarizator/fora-frontend/commit/ea684ef84)
    - [rollback random file changes](https://github.com/summarizator/fora-frontend/commit/3e87d1528)
    - [feat: implement dynamic analytics log level management with console commands](https://github.com/summarizator/fora-frontend/commit/6b1f61fae)
    - [feat: expand analytics constants tests with logging and mapping validations](https://github.com/summarizator/fora-frontend/commit/061a82de0)
    - [feat: enhance analytics tracking with element type mappings and trackable checks](https://github.com/summarizator/fora-frontend/commit/3ccb27c31)
    - [Merge branch 'app' into FORA-1584-SPIKE-Statsig-event-tracking-strategy](https://github.com/summarizator/fora-frontend/commit/88bc609f2)
    - [feat: enhance analytics tracking with element type mappings and trackable checks](https://github.com/summarizator/fora-frontend/commit/4feccb965)
    - [feat: implement centralized mapping for navigation paths and icon classes in analytics tracking](https://github.com/summarizator/fora-frontend/commit/f622060a0)
    - [feat: enhance Statsig event logging with combined page and action value in statsig value field](https://github.com/summarizator/fora-frontend/commit/54380763f)
    - [feat: implement strategy pattern for button click value generation in analytics tracking](https://github.com/summarizator/fora-frontend/commit/f437d1e30)
    - [feat: enhance analytics tracking with improved event data capture and logging](https://github.com/summarizator/fora-frontend/commit/40fc5db69)
    - [fix: implement route change handling and improve analytics initialization logic](https://github.com/summarizator/fora-frontend/commit/cb8b10122)
    - [fix: correct regex pattern for matching test file blocks](https://github.com/summarizator/fora-frontend/commit/c99987f27)
    - [feat: implement semantic event naming for improved analytics tracking](https://github.com/summarizator/fora-frontend/commit/68ddb0e82)
    - [feat: organize event properties and remove redundant user_id from analytics metadata](https://github.com/summarizator/fora-frontend/commit/db3ad33c5)
    - [fix init](https://github.com/summarizator/fora-frontend/commit/6408a5a05)
    - [feat: implement centralized analytics logging configuration and enhance log verbosity control](https://github.com/summarizator/fora-frontend/commit/2998ad653)
    - [fix re navigate bug](https://github.com/summarizator/fora-frontend/commit/5be22fb70)
    - [feat: integrate React Router for dynamic route tracking and page name generation](https://github.com/summarizator/fora-frontend/commit/a7b6fed81)
    - [feat: refactor analytics tracking configuration and enhance route-based tracking setup](https://github.com/summarizator/fora-frontend/commit/4f994576e)
    - [feat: implement centralized route-based analytics configuration for automatic tracking](https://github.com/summarizator/fora-frontend/commit/9b4cf8729)
    - [feat: implement TrackedRoute component for route-level analytics tracking configuration](https://github.com/summarizator/fora-frontend/commit/b2b2f5911)
    - [Merge branch 'app' into FORA-1584-SPIKE-Statsig-event-tracking-strategy](https://github.com/summarizator/fora-frontend/commit/e36892765)
    - [fixes](https://github.com/summarizator/fora-frontend/commit/0b9d86951)
    - [feat: implement analytics service for event tracking and auto-tracking functionality](https://github.com/summarizator/fora-frontend/commit/086cbd3ff)
    - [chore: add @crimsonsunset/cursor-config dependency to package.json and package-lock.json](https://github.com/summarizator/fora-frontend/commit/421f33ae2)
    - [remove cursor rule files in favor of pkg](https://github.com/summarizator/fora-frontend/commit/e061d4938)
    - [remove cursor rule files in favor of pkg](https://github.com/summarizator/fora-frontend/commit/8b8dec5b2)
    - [refactor: streamline user authentication flow and remove unused Rollbar registration](https://github.com/summarizator/fora-frontend/commit/b411ed985)
    - [remove some console errors](https://github.com/summarizator/fora-frontend/commit/fe43ba2b4)

  </details>


### Features

- [FORA-1500](https://foraday.atlassian.net/browse/FORA-1500): Cleanup Statsig flags that have been released 
  <details>
    <summary>Commits</summary>

    - [fix: update test mock for feature gate checks in file1.js](https://github.com/summarizator/fora-frontend/commit/1056bbebf)
    - [feat: enhance feature gate detection with specific regex patterns](https://github.com/summarizator/fora-frontend/commit/ec93e44d2)
    - [fix: normalize serverless code status handling in feature gates table](https://github.com/summarizator/fora-frontend/commit/7b9644033)
    - [comments](https://github.com/summarizator/fora-frontend/commit/a539f4216)
    - [Merge branch 'app' into FORA-1500-Cleanup-Statsig-flags-that-have-been-released](https://github.com/summarizator/fora-frontend/commit/e1a278385)
    - [Merge branch 'app' into FORA-1500-Cleanup-Statsig-flags-that-have-been-released](https://github.com/summarizator/fora-frontend/commit/2d667c11b)
    - [feat: clean up debug logging in accordion and feature gates components](https://github.com/summarizator/fora-frontend/commit/04a16308e)
    - [feat: refactor accordion and feature gates tables to use expandedRows prop for better state management](https://github.com/summarizator/fora-frontend/commit/74d91bccb)
    - [feat: add debug logging to accordion and feature gates tables for better traceability](https://github.com/summarizator/fora-frontend/commit/090389ca4)
    - [feat: add debug logging to accordion and feature gates tables for better traceability](https://github.com/summarizator/fora-frontend/commit/d8110495c)
    - [feat: add project ID handling and external link button for Statsig console](https://github.com/summarizator/fora-frontend/commit/a36128733)
    - [test](https://github.com/summarizator/fora-frontend/commit/380845b0f)

  </details>

## [0.9.9](https://github.com/summarizator/fora-frontend/compare/v0.9.8...v0.9.9) <span style="color: red;">[prod]</span>
> Thu, May 29 2025 | 05:00 PM EST

### Features

- [FORA-1637](https://foraday.atlassian.net/browse/FORA-1637): Feature Flag Summarize Teams
  <details>
    <summary>Commits</summary>

    - [minor: clean](https://github.com/summarizator/fora-frontend/commit/fc547769a)
    - [Add 'no public teams channels' message](https://github.com/summarizator/fora-frontend/commit/b1637aa38)
    - [minor test fix](https://github.com/summarizator/fora-frontend/commit/e0a09cca2)
    - [Added teams-digest filter flags for Teams Digest content](https://github.com/summarizator/fora-frontend/commit/80661d774)

  </details>

## [0.9.8](https://github.com/summarizator/fora-frontend/compare/v0.9.7...v0.9.8) <span style="color: red;">[prod]</span>
> Thu, May 29 2025 | 11:13 AM EST

### Features

- [FORA-1391](https://foraday.atlassian.net/browse/FORA-1391): Summarize > Audio or Video
  <details>
    <summary>Commits</summary>

    - [Add ? to avoid null issue](https://github.com/summarizator/fora-frontend/commit/e010db612)
    - [Update path to component](https://github.com/summarizator/fora-frontend/commit/7b7f43afa)
    - [Set placement to top](https://github.com/summarizator/fora-frontend/commit/1712d5e0d)
    - [Add onFileRemove](https://github.com/summarizator/fora-frontend/commit/371777252)
    - [Remove navigate](https://github.com/summarizator/fora-frontend/commit/23598bc84)
    - [Add FF to summarize audio video feature](https://github.com/summarizator/fora-frontend/commit/e4379dd67)
    - [Move test file](https://github.com/summarizator/fora-frontend/commit/52d3128f1)
    - [Cleanup after rebase](https://github.com/summarizator/fora-frontend/commit/c8054407d)
    - [Add custom error messaging for azure_transcription errors](https://github.com/summarizator/fora-frontend/commit/67711a66a)
    - [Fix broken test](https://github.com/summarizator/fora-frontend/commit/b6428ba02)
    - [Conform SummarizeAudioVideo to DocumentDropzone format](https://github.com/summarizator/fora-frontend/commit/f111920f8)
    - [Cleanup after rebase](https://github.com/summarizator/fora-frontend/commit/2b4c7c724)
    - [Remove scrollBehavior from AV modal](https://github.com/summarizator/fora-frontend/commit/bc5268dbe)
    - [Add logic to check for meeting_upload](https://github.com/summarizator/fora-frontend/commit/0520334f5)
    - [Address some QA comments](https://github.com/summarizator/fora-frontend/commit/c8bf875e7)
    - [Address PR comments](https://github.com/summarizator/fora-frontend/commit/e21471c5b)
    - [Add additional summarize-menu tests](https://github.com/summarizator/fora-frontend/commit/7431db3c0)
    - [add tests for SummarizeAudioVideo](https://github.com/summarizator/fora-frontend/commit/45ca177f8)
    - [Fix test in create-slack-digest-modal](https://github.com/summarizator/fora-frontend/commit/324d091ec)
    - [Add tests for StepWithLabelComponent](https://github.com/summarizator/fora-frontend/commit/e0e4cdfff)
    - [Form cleanup](https://github.com/summarizator/fora-frontend/commit/de0783d66)
    - [Convert to StepWithLabelComponent in create-teams-digest-modal](https://github.com/summarizator/fora-frontend/commit/c5af16aca)
    - [Continue to work on SummarizeAudioVideo](https://github.com/summarizator/fora-frontend/commit/e3e4b165f)
    - [Add StepWithLabelComponent](https://github.com/summarizator/fora-frontend/commit/d06ed9a33)
    - [Add file helpers](https://github.com/summarizator/fora-frontend/commit/9727a32db)
    - [Pass parameters in SummarizeDocument component](https://github.com/summarizator/fora-frontend/commit/1998e1743)
    - [accept parameters in DocumentDropzone component](https://github.com/summarizator/fora-frontend/commit/2fa747513)
    - [Start refactor of document-dropzone](https://github.com/summarizator/fora-frontend/commit/e7e57a268)
    - [Add scaffolding of SummarizeAudioVideo component](https://github.com/summarizator/fora-frontend/commit/0e2d33cc1)
    - [Add tests for summarize-document and document-dropzone component](https://github.com/summarizator/fora-frontend/commit/ca3bb4994)

  </details>

## [0.9.7](https://github.com/summarizator/fora-frontend/compare/v0.9.6...v0.9.7) <span style="color: red;">[prod]</span>
> Thu, May 29 2025 | 09:17 AM EST

### Bug Fixes

- [FORA-1633](https://foraday.atlassian.net/browse/FORA-1633): Add Microsoft Teams User-Specific Permissioning
  <details>
    <summary>Commits</summary>

    - [Revert "FORA-1633: Add 'Team.ReadBasic.All' and 'Channel.ReadBasic.All' microsoft graph permissions (#1480)"](https://github.com/summarizator/fora-frontend/commit/71a73a84d)

  </details>

## [0.9.6](https://github.com/summarizator/fora-frontend/compare/v0.9.5...v0.9.6) <span style="color: red;">[prod]</span>
> Wed, May 28 2025 | 03:57 PM EST

### Tasks

- [FORA-1631](https://foraday.atlassian.net/browse/FORA-1631): add email tooltip for Summarize Menu
  <details>
    <summary>Commits</summary>

    - [Merge branch 'app' into FORA-1631-add-email-tooltip-for-Summarize-Menu](https://github.com/summarizator/fora-frontend/commit/987360839)
    - [Merge branch 'app' into FORA-1631-add-email-tooltip-for-Summarize-Menu](https://github.com/summarizator/fora-frontend/commit/dc1cb50ee)
    - [add info tooltip for email part of summarize menu](https://github.com/summarizator/fora-frontend/commit/843317a43)

  </details>

## [0.9.5](https://github.com/summarizator/fora-frontend/compare/v0.9.4...v0.9.5) <span style="color: red;">[prod]</span>
> Wed, May 28 2025 | 03:01 PM EST

### Bug Fixes

- [FORA-1633](https://foraday.atlassian.net/browse/FORA-1633): Add Microsoft Teams User-Specific Permissioning
  <details>
    <summary>Commits</summary>

    - [FORA-1633: Add 'Team.ReadBasic.All' and 'Channel.ReadBasic.All' microsoft graph permissions](https://github.com/summarizator/fora-frontend/commit/125f8b74c)

  </details>

## [0.9.4](https://github.com/summarizator/fora-frontend/compare/v0.9.3...v0.9.4) <span style="color: red;">[prod]</span>
> Wed, May 28 2025 | 01:56 PM EST

### Tasks

- [FORA-791](https://foraday.atlassian.net/browse/FORA-791): stop directly calling the slack api from the FE
  <details>
    <summary>Commits</summary>

    - [Merge branch 'app' into FORA-791-be-slack-api](https://github.com/summarizator/fora-frontend/commit/86d63c4d5)
    - [add slack service test cases](https://github.com/summarizator/fora-frontend/commit/6eded4471)
    - [Updated slack and related services to use Fora's passthrough to slack api](https://github.com/summarizator/fora-frontend/commit/5a9dc1d9c)

  </details>


### Features

- [FORA-569](https://foraday.atlassian.net/browse/FORA-569): [QUICK ADD] menu option changes
  <details>
    <summary>Commits</summary>

    - [Merge branch 'app' into FORA-569-QUICK-ADD-menu-option-changes](https://github.com/summarizator/fora-frontend/commit/6acd0ba3)
    - [test add-menu](https://github.com/summarizator/fora-frontend/commit/4a846a9b)
    - [feature flag create-meeting-modal](https://github.com/summarizator/fora-frontend/commit/92ee00ed)
    - [fix meeting.hooks tests](https://github.com/summarizator/fora-frontend/commit/8572e870)
    - [Revert "bump lock file"](https://github.com/summarizator/fora-frontend/commit/d21e76b9)
    - [Merge branch 'app' into FORA-569-QUICK-ADD-menu-option-changes](https://github.com/summarizator/fora-frontend/commit/608cd95f)
    - [Merge branch 'app' into FORA-569-QUICK-ADD-menu-option-changes](https://github.com/summarizator/fora-frontend/commit/014bbd5e)
    - [fix create-meeting-modal test](https://github.com/summarizator/fora-frontend/commit/e1fae317)
    - [Merge branch 'app' into FORA-569-QUICK-ADD-menu-option-changes](https://github.com/summarizator/fora-frontend/commit/40bd5c9e)
    - [feature flag](https://github.com/summarizator/fora-frontend/commit/10c00def)
    - [cleanup (1)](https://github.com/summarizator/fora-frontend/commit/397abbba)
    - [cleanup](https://github.com/summarizator/fora-frontend/commit/45b499bb)
    - [`useInvalidateMeetingQueries`](https://github.com/summarizator/fora-frontend/commit/978f165e)
    - [icon sizing](https://github.com/summarizator/fora-frontend/commit/22384dba)
    - [useUpdateBotFromPusherEvent](https://github.com/summarizator/fora-frontend/commit/3932e4bb)
    - ["optimistic update"](https://github.com/summarizator/fora-frontend/commit/52d62ba2)
    - [invalidate relevant meeting queries when bot is added and removed](https://github.com/summarizator/fora-frontend/commit/292738b4)
    - [tweak logic based on statuses, loading fix](https://github.com/summarizator/fora-frontend/commit/d01684ac)
    - [bump lock file](https://github.com/summarizator/fora-frontend/commit/2024d6f6)
    - [force refetch meetings onces starting from add menu is complete](https://github.com/summarizator/fora-frontend/commit/c4efed6d)
    - [enable meetings to start if "add fora" or "add fora back" is present](https://github.com/summarizator/fora-frontend/commit/46c4e718)
    - [use CustomSelect for category select](https://github.com/summarizator/fora-frontend/commit/d0b2618e)
    - [fix typo](https://github.com/summarizator/fora-frontend/commit/7392fcd2)
    - [only show meetings that can be started (i.e meeting with a bot with changes will not start)](https://github.com/summarizator/fora-frontend/commit/dfe977a3)
    - [update create meeting modal](https://github.com/summarizator/fora-frontend/commit/895b750c)
    - [add menu: show meetings that are live and aren't being recorded yet](https://github.com/summarizator/fora-frontend/commit/d939a7eb)

  </details>

- [FORA-1610](https://foraday.atlassian.net/browse/FORA-1610): Use Microsoft Token from Login for Getting "My Teams and Channels"
  <details>
    <summary>Commits</summary>

    - [add token setting test case"](https://github.com/summarizator/fora-frontend/commit/2aedafc8)
    - [minor doc cleanup](https://github.com/summarizator/fora-frontend/commit/f3c31acf)
    - [Add logout clearing and mobile login hook](https://github.com/summarizator/fora-frontend/commit/652140c2)
    - [added back ne private filters](https://github.com/summarizator/fora-frontend/commit/dca9978e)
    - [Merge branch 'app' into FORA-1610-store-msft-token](https://github.com/summarizator/fora-frontend/commit/16c2ced3)
    - [Merge branch 'app' into FORA-1610-store-msft-token](https://github.com/summarizator/fora-frontend/commit/cf39cc04)
    - [add my teams and channels to digest modal](https://github.com/summarizator/fora-frontend/commit/30b9b1b4)
    - [add 'myTeamsChannels' fetch. Fixed divider issue on teams channels selector](https://github.com/summarizator/fora-frontend/commit/30ea20a6)
    - [Add my teams query](https://github.com/summarizator/fora-frontend/commit/b5db66f8)

  </details>

## [0.9.1](https://github.com/summarizator/fora-frontend/compare/v0.9.0...v0.9.1) <span style="color: red;">[prod]</span>
> Tue, May 27 2025 | 04:42 PM EST

### Bug Fixes

- [FORA-1623](https://foraday.atlassian.net/browse/FORA-1623): TypeError: Meeting Chat Error
  <details>
    <summary>Commits</summary>

    - [add null check for conversation sources field](https://github.com/summarizator/fora-frontend/commit/f619647f)

  </details>


### Features

- [FORA-1500](https://foraday.atlassian.net/browse/FORA-1500): Cleanup Statsig flags that have been released 
  <details>
    <summary>Commits</summary>

    - [feat: add onExpansionChange callback to accordion and feature gates tables](https://github.com/summarizator/fora-frontend/commit/d929665a)
    - [refactor: enhance AWS S3 client configuration with environment variable logging and improved credential handling](https://github.com/summarizator/fora-frontend/commit/3e32f956)
    - [refactor: enhance AWS S3 client configuration with environment variable logging and improved credential handling](https://github.com/summarizator/fora-frontend/commit/a5a7578e)
    - [kick](https://github.com/summarizator/fora-frontend/commit/627753a3)

  </details>

- [FORA-1593](https://foraday.atlassian.net/browse/FORA-1593): Add "Connect Slack" to Create Slack Digest Modal if not connected
  <details>
    <summary>Commits</summary>

    - [Merge branch 'app' into FORA-1593-connect-slack-teams-notif](https://github.com/summarizator/fora-frontend/commit/9eefa11f)
    - [Add learn more links](https://github.com/summarizator/fora-frontend/commit/745aed47)
    - [Merge branch 'app' into FORA-1593-connect-slack-teams-notif](https://github.com/summarizator/fora-frontend/commit/2e62ff29)
    - [Merge remote-tracking branch 'origin/app' into FORA-1593-connect-slack-teams-notif](https://github.com/summarizator/fora-frontend/commit/f3dbf4eb)
    - [Fix issue with reading digest config from tenant, show slack and teams regardless of configuration](https://github.com/summarizator/fora-frontend/commit/8c1fd0d1)
    - [Merge branch 'app' into FORA-1593-connect-slack-teams-notif](https://github.com/summarizator/fora-frontend/commit/26bf211d)
    - [minor: test fixes](https://github.com/summarizator/fora-frontend/commit/05f7b394)
    - [minor bug fix](https://github.com/summarizator/fora-frontend/commit/cfc5e71c)
    - [Add 'connect slack/teams'info blurb to create digest modals if not connected](https://github.com/summarizator/fora-frontend/commit/864a9749)

  </details>

## [0.8.1](https://github.com/summarizator/fora-frontend/compare/v0.8.0...v0.8.1) <span style="color: red;">[prod]</span>
> Tue, May 27 2025 | 11:03 AM EST

### Bug Fixes

- [FORA-1613](https://foraday.atlassian.net/browse/FORA-1613): AxiosError: [API Error] GET /global/settings
  <details>
    <summary>Commits</summary>

    - [Merge branch 'app' into FORA-1613-global-settings-error](https://github.com/summarizator/fora-frontend/commit/26a77e25)
    - [ignore 403 errors](https://github.com/summarizator/fora-frontend/commit/984a0899)
    - [Merge branch 'app' of https://github.com/summarizator/fora-frontend into FORA-1613-global-settings-error](https://github.com/summarizator/fora-frontend/commit/5b8dcf66)
    - [Merge branch 'app' of https://github.com/summarizator/fora-frontend into FORA-1598-rollbar-upgrades](https://github.com/summarizator/fora-frontend/commit/02736da4)
    - [add buildinfo to error boundary and axios interceptor](https://github.com/summarizator/fora-frontend/commit/e9fa8779)
    - [redundant check to add the semantic version?](https://github.com/summarizator/fora-frontend/commit/223ee64a)
    - [its the other one](https://github.com/summarizator/fora-frontend/commit/366c582a)
    - [Merge branch 'app' of https://github.com/summarizator/fora-frontend into FORA-1598-rollbar-upgrades](https://github.com/summarizator/fora-frontend/commit/5d3dc7ab)
    - [use commit sha for code version for rollbar](https://github.com/summarizator/fora-frontend/commit/0b205b54)

  </details>


### Features

- [FORA-1500](https://foraday.atlassian.net/browse/FORA-1500): Cleanup Statsig flags that have been released 
  <details>
    <summary>Commits</summary>

    - [Merge branch 'app' into FORA-1500-Cleanup-Statsig-flags-that-have-been-released](https://github.com/summarizator/fora-frontend/commit/0fb54255)
    - [refactor: simplify archived status checks in feature gates and improve file retrieval tests](https://github.com/summarizator/fora-frontend/commit/856ed826)
    - [refactor: use uniqueId for DataRowAccordionItem keys to ensure uniqueness](https://github.com/summarizator/fora-frontend/commit/1be98ad8)
    - [refactor: enhance feature gates display with normalized status and improved tooltip information](https://github.com/summarizator/fora-frontend/commit/4459c497)
    - [test: refactor error boundary tests for improved readability and consistency](https://github.com/summarizator/fora-frontend/commit/62e00282)
    - [test: refactor error boundary tests for improved readability and consistency](https://github.com/summarizator/fora-frontend/commit/243782b6)
    - [test: enhance feature gates table tests with detailed assertions and cleanup](https://github.com/summarizator/fora-frontend/commit/a0328a9a)
    - [test: add unit tests for vite-build-info plugin functionality and error handling](https://github.com/summarizator/fora-frontend/commit/5d962c53)
    - [Merge branch 'app' into FORA-1500-Cleanup-Statsig-flags-that-have-been-released](https://github.com/summarizator/fora-frontend/commit/ddd2563d)
    - [refactor: improve build info plugin by enhancing helper functions and cleaning up code](https://github.com/summarizator/fora-frontend/commit/d1999739)
    - [feat: enhance feature gates table with detailed code usage status and cleanup unused code](https://github.com/summarizator/fora-frontend/commit/009942fb)
    - [feat: add clipboard copy functionality for feature gate names](https://github.com/summarizator/fora-frontend/commit/0d183392)
    - [feat: add expand/collapse all functionality to feature gates table](https://github.com/summarizator/fora-frontend/commit/cdc03ba0)
    - [feat: add code usage status to feature gates table](https://github.com/summarizator/fora-frontend/commit/91cfaa4e)
    - [refactor: streamline feature flag processing](https://github.com/summarizator/fora-frontend/commit/4fe84aba)
    - [feat: enhance code usage display in UI](https://github.com/summarizator/fora-frontend/commit/4999aec5)
    - [feat: enhance feature flag management with code usage tracking and improved badge rendering](https://github.com/summarizator/fora-frontend/commit/79c7a0d8)

  </details>

## [0.7.22](https://github.com/summarizator/fora-frontend/compare/v0.7.21...v0.7.22) <span style="color: red;">[prod]</span>
> Fri, May 23 2025 | 02:16 PM EST

### Features

- [FORA-1598](https://foraday.atlassian.net/browse/FORA-1598): Rollbar Upgrades
  <details>
    <summary>Commits</summary>

    - [Merge branch 'app' of https://github.com/summarizator/fora-frontend into FORA-1598-rollbar-upgrades](https://github.com/summarizator/fora-frontend/commit/02736da4)
    - [add buildinfo to error boundary and axios interceptor](https://github.com/summarizator/fora-frontend/commit/e9fa8779)
    - [redundant check to add the semantic version?](https://github.com/summarizator/fora-frontend/commit/223ee64a)
    - [its the other one](https://github.com/summarizator/fora-frontend/commit/366c582a)
    - [Merge branch 'app' of https://github.com/summarizator/fora-frontend into FORA-1598-rollbar-upgrades](https://github.com/summarizator/fora-frontend/commit/5d3dc7ab)
    - [use commit sha for code version for rollbar](https://github.com/summarizator/fora-frontend/commit/0b205b54)

  </details>


### Bug Fixes

- [FORA-1554](https://foraday.atlassian.net/browse/FORA-1554): Remove Retry button from Error Boundary fallback
  <details>
    <summary>Commits</summary>

    - [Merge branch 'app' into FORA-1554-Remove-Retry-button-from-Error-Boundary-fallback](https://github.com/summarizator/fora-frontend/commit/8b2f65fa)
    - [replace chunk hashes with build version](https://github.com/summarizator/fora-frontend/commit/28091df9)
    - [Merge branch 'app' into FORA-1554-Remove-Retry-button-from-Error-Boundary-fallback](https://github.com/summarizator/fora-frontend/commit/d3be5998)
    - [remove retry button](https://github.com/summarizator/fora-frontend/commit/f4937b30)
    - [`lazyWithRetry`](https://github.com/summarizator/fora-frontend/commit/f27c2d89)

  </details>


### Tasks

- [FORA-1589](https://foraday.atlassian.net/browse/FORA-1589): Summarize > Earnings call should only be available for Executives and Admins
  <details>
    <summary>Commits</summary>

    - [Merge branch 'app' into FORA-1589-Summarize-Earnings-call-should-only-be-available-for-Executives-and-Admins](https://github.com/summarizator/fora-frontend/commit/c41a055d)
    - [test](https://github.com/summarizator/fora-frontend/commit/7065e584)
    - [useIsUserType('Admin', 'Executive')](https://github.com/summarizator/fora-frontend/commit/a410c7d7)
    - [remove space](https://github.com/summarizator/fora-frontend/commit/4cc15af6)
    - [allow Summarize > Earnings for execs and admins only](https://github.com/summarizator/fora-frontend/commit/2ac81cae)

  </details>

- [FORA-1549](https://foraday.atlassian.net/browse/FORA-1549): Spike: Tanstack Table or other Headless Table Options
  <details>
    <summary>Commits</summary>

    - [Merge branch 'app' into FORA-1549-tanstack-table](https://github.com/summarizator/fora-frontend/commit/8cc4ccdd)
    - [Added feature flagged component testing page to settings. Beefed up component testing with query params for testing](https://github.com/summarizator/fora-frontend/commit/3719fdbe)
    - [Column filter default fixes and size fixes to cards example](https://github.com/summarizator/fora-frontend/commit/23e88632)
    - [Add individual column filtering.](https://github.com/summarizator/fora-frontend/commit/123b953a)
    - [Merge branch 'app' into FORA-1549-tanstack-table](https://github.com/summarizator/fora-frontend/commit/4ba21db1)
    - [Merge branch 'app' into FORA-1549-tanstack-table](https://github.com/summarizator/fora-frontend/commit/cdcf4ffd)
    - [Merge branch 'app' into FORA-1549-tanstack-table](https://github.com/summarizator/fora-frontend/commit/7af9b1f4)
    - [minor col fixes](https://github.com/summarizator/fora-frontend/commit/fd4ea832)
    - [Extracting table logic to hooks and atomic component](https://github.com/summarizator/fora-frontend/commit/c2231c1c)
    - [minor clean](https://github.com/summarizator/fora-frontend/commit/d02d53f9)
    - [Clean up for demo](https://github.com/summarizator/fora-frontend/commit/66c39a74)
    - [row expansion done and done](https://github.com/summarizator/fora-frontend/commit/1e972a1c)
    - [stash](https://github.com/summarizator/fora-frontend/commit/20a55d29)
    - [Messing with expanded rows and column widths](https://github.com/summarizator/fora-frontend/commit/e1c0a1f0)
    - [add sorting functionality](https://github.com/summarizator/fora-frontend/commit/8515bdeb)
    - [add tanstack table and started working on example](https://github.com/summarizator/fora-frontend/commit/7914f561)

  </details>

## [0.7.18](https://github.com/summarizator/fora-frontend/compare/v0.7.17...v0.7.18) <span style="color: red;">[prod]</span>
> Wed, May 21 2025 | 06:33 PM EST

### Bug Fixes

- [FORA-1091](https://foraday.atlassian.net/browse/FORA-1091): Fix overflow on mobile
  <details>
    <summary>Commits</summary>

    - [fix topics overflow](https://github.com/summarizator/fora-frontend/commit/e13f3191)

  </details>

## [0.7.17](https://github.com/summarizator/fora-frontend/compare/v0.7.16...v0.7.17) <span style="color: red;">[prod]</span>
> Tue, May 20 2025 | 03:28 PM EST

### Bug Fixes

- [FORA-1583](https://foraday.atlassian.net/browse/FORA-1583): Login Spinner Position
  <details>
    <summary>Commits</summary>

    - [Merge branch 'app' into FORA-1583-login-spinner-position](https://github.com/summarizator/fora-frontend/commit/5d04c77e)
    - [center login spinner](https://github.com/summarizator/fora-frontend/commit/baa76e20)

  </details>

- [FORA-1578](https://foraday.atlassian.net/browse/FORA-1578): Add okta domains to frame-src directive
  <details>
    <summary>Commits</summary>

    - [Add okta domains to frame-src directive](https://github.com/summarizator/fora-frontend/commit/9f55cc8b)

  </details>


### Tasks

- [FORA-1575](https://foraday.atlassian.net/browse/FORA-1575): Apply Document Type Icons
  <details>
    <summary>Commits</summary>

    - [Merge branch 'app' into FORA-1575-Apply-Document-Type-Icons](https://github.com/summarizator/fora-frontend/commit/721a8756)
    - [Merge branch 'app' into FORA-1575-Apply-Document-Type-Icons](https://github.com/summarizator/fora-frontend/commit/eced2373)
    - [sonar](https://github.com/summarizator/fora-frontend/commit/68b01c89)
    - [add padding to card header if it's a document to prevent overflow](https://github.com/summarizator/fora-frontend/commit/1b7c3683)
    - [summarize document style tweaks](https://github.com/summarizator/fora-frontend/commit/391a2496)
    - [getDocumentTitleFromCard => getDocumentMetadataFromCard](https://github.com/summarizator/fora-frontend/commit/c67aa181)
    - [apply document icons to summary card](https://github.com/summarizator/fora-frontend/commit/3000cc2b)
    - [add document icons](https://github.com/summarizator/fora-frontend/commit/6a8f434a)

  </details>

## [0.7.14](https://github.com/summarizator/fora-frontend/compare/v0.7.13...v0.7.14) <span style="color: red;">[prod]</span>
> Mon, May 19 2025 | 04:24 PM EST

### Bug Fixes

- [FORA-1576](https://foraday.atlassian.net/browse/FORA-1576): Remove X-Fora-Key from Axios Defaults on People Requests
  <details>
    <summary>Commits</summary>

    - [test fixes](https://github.com/summarizator/fora-frontend/commit/579e1b46)
    - [Merge branch 'app' into FORA-1576-x-fora-key-default-fix](https://github.com/summarizator/fora-frontend/commit/760ca320)
    - [minor doc addition](https://github.com/summarizator/fora-frontend/commit/1130be5e)
    - [lambda fix](https://github.com/summarizator/fora-frontend/commit/bf3ca705)
    - [Updated "generateAuthHeader" to correctly handle auth requests. Added tests for this fn"](https://github.com/summarizator/fora-frontend/commit/8a175d3d)

  </details>

- [FORA-1065](https://foraday.atlassian.net/browse/FORA-1065): [AGENDA] control bar does not reflect state
  <details>
    <summary>Commits</summary>

    - [invalidate meetings/id/all query after pause/resuming on agenda](https://github.com/summarizator/fora-frontend/commit/40852f01)
    - [Merge branch 'app' into FORA-1065-control-bar-update](https://github.com/summarizator/fora-frontend/commit/51cfd277)
    - [Control bar fixes](https://github.com/summarizator/fora-frontend/commit/f8669ba0)
    - [sonar maintainability issue fixes](https://github.com/summarizator/fora-frontend/commit/fc20a9b3)
    - [Merge branch 'app' into FORA-1049-control-bar-update-refresh](https://github.com/summarizator/fora-frontend/commit/4fc96ef6)
    - [Minor: clean](https://github.com/summarizator/fora-frontend/commit/d524ccce)
    - [Add tests for meeting pause/resume functionality](https://github.com/summarizator/fora-frontend/commit/8f47d015)
    - [more granular invalidation](https://github.com/summarizator/fora-frontend/commit/1ee31312)
    - [Trying to fix agenda meeting invalidation](https://github.com/summarizator/fora-frontend/commit/cee2e0bf)

  </details>

- [FORA-114](https://foraday.atlassian.net/browse/FORA-114): [MEETING DETAIL] "New Summary Available : View" button does not route user to the Summary
  <details>
    <summary>Commits</summary>

    - [Merge branch 'app' into FORA-114-navigate-to-details-on-new-card](https://github.com/summarizator/fora-frontend/commit/39b97bd7)
    - [Merge branch 'app' into FORA-114-navigate-to-details-on-new-card](https://github.com/summarizator/fora-frontend/commit/b6e4ce6a)
    - [Updated 'on_new_card' pusher event listeners to navigated to expected source data details rather than summaries](https://github.com/summarizator/fora-frontend/commit/b39a3eef)

  </details>


### Tasks

- [FORA-1564](https://foraday.atlassian.net/browse/FORA-1564): Add `sources: ["Slack", "Teams"]` to manage-digests
  <details>
    <summary>Commits</summary>

    - [Merge branch 'app' into FORA-1564-manage-digests-source-filtering](https://github.com/summarizator/fora-frontend/commit/be2d9c02)
    - [Merge branch 'app' into FORA-1564-manage-digests-source-filtering](https://github.com/summarizator/fora-frontend/commit/acec4b5b)
    - [Merge branch 'app' into FORA-1564-manage-digests-source-filtering](https://github.com/summarizator/fora-frontend/commit/a75cff14)
    - [Merge branch 'app' into FORA-1564-manage-digests-source-filtering](https://github.com/summarizator/fora-frontend/commit/2ad60371)
    - [Add 'sources' filter to manage digests](https://github.com/summarizator/fora-frontend/commit/40d1d6b4)

  </details>


### Features

- [FORA-1237](https://foraday.atlassian.net/browse/FORA-1237): [RECENT] allow user to open new tabs from Recent page cards
  <details>
    <summary>Commits</summary>

    - [Merge branch 'app' into FORA-1237-navigate-with-right-click](https://github.com/summarizator/fora-frontend/commit/723780fe)
    - [Merge branch 'app' into FORA-1237-navigate-with-right-click](https://github.com/summarizator/fora-frontend/commit/370e3d21)
    - [FORA-1237: Allow user to navigate with right click -> open in new tab from reskin card body](https://github.com/summarizator/fora-frontend/commit/481b64a8)

  </details>

- [FORA-1452](https://foraday.atlassian.net/browse/FORA-1452): Auto user scheduling
  <details>
    <summary>Commits</summary>

    - [test fixes for auto scheduling](https://github.com/summarizator/fora-frontend/commit/e096af64)

  </details>

## [0.7.8](https://github.com/summarizator/fora-frontend/compare/v0.7.7...v0.7.8) <span style="color: red;">[prod]</span>
> Fri, May 16 2025 | 01:40 PM EST

### Features

- [FORA-1452](https://foraday.atlassian.net/browse/FORA-1452): Auto user scheduling
  <details>
    <summary>Commits</summary>

    - [Add FF to user auto scheduling](https://github.com/summarizator/fora-frontend/commit/2fabeac0)

  </details>

## [0.7.7](https://github.com/summarizator/fora-frontend/compare/v0.7.6...v0.7.7) <span style="color: red;">[prod]</span>
> Thu, May 15 2025 | 03:39 PM EST

### Features

- [FORA-1541](https://foraday.atlassian.net/browse/FORA-1541): Support "Web" type application for okta OIN
  <details>
    <summary>Commits</summary>

    - [Address more sonar complaints](https://github.com/summarizator/fora-frontend/commit/0c68b77d)
    - [Improve maintainability score (sonar)](https://github.com/summarizator/fora-frontend/commit/1c020a73)
    - [Add new tests for initializeOktaAuth](https://github.com/summarizator/fora-frontend/commit/22cc4d45)
    - [Update tests for okta-login-page](https://github.com/summarizator/fora-frontend/commit/17015179)
    - [OktaCallbackWebPage cleanup and tests](https://github.com/summarizator/fora-frontend/commit/2480faac)
    - [Add tests for getOktaToken](https://github.com/summarizator/fora-frontend/commit/66875801)
    - [Start implementing okta login flow for web based app type](https://github.com/summarizator/fora-frontend/commit/66ac3399)

  </details>

- [FORA-1557](https://foraday.atlassian.net/browse/FORA-1557): Add Document name as the title of the document upload.
  <details>
    <summary>Commits</summary>

    - [Merge branch 'app' into FORA-1557-Add-Document-name-as-the-title-of-the-document-upload](https://github.com/summarizator/fora-frontend/commit/e2c574fa)
    - [typo](https://github.com/summarizator/fora-frontend/commit/9519a9e3)
    - [reset title when file is removed](https://github.com/summarizator/fora-frontend/commit/03262631)
    - [add test for custom name](https://github.com/summarizator/fora-frontend/commit/5ee74d8d)
    - [single file, custom file name](https://github.com/summarizator/fora-frontend/commit/707d8306)

  </details>

## [0.7.5](https://github.com/summarizator/fora-frontend/compare/v0.7.4...v0.7.5) <span style="color: red;">[prod]</span>
> Wed, May 14 2025 | 05:41 PM EST

### Bug Fixes

- [FORA-1562](https://foraday.atlassian.net/browse/FORA-1562): fix sharing bug from EB 
  <details>
    <summary>Commits</summary>

    - [fix: add share-summary component to the build include patterns](https://github.com/summarizator/fora-frontend/commit/4c643b6d)

  </details>

- [FORA-1561](https://foraday.atlassian.net/browse/FORA-1561): fix Button colors (occurrence in toasts with "View")
  <details>
    <summary>Commits</summary>

    - [Merge branch 'app' into FORA-1561-toast-button-colors](https://github.com/summarizator/fora-frontend/commit/4cc15e08)
    - [Removed opacity from container color tokens. Fixed action button on styled-toast](https://github.com/summarizator/fora-frontend/commit/fed16fe5)

  </details>


### Features

- [FORA-1538](https://foraday.atlassian.net/browse/FORA-1538): Open Overall tab when opened card gets deleted
  <details>
    <summary>Commits</summary>

    - [Merge branch 'app' into FORA-1538-Open-Overall-tab-when-opened-card-gets-deleted](https://github.com/summarizator/fora-frontend/commit/8874b292)
    - [Merge branch 'app' into FORA-1538-Open-Overall-tab-when-opened-card-gets-deleted](https://github.com/summarizator/fora-frontend/commit/29e37f44)
    - [scroll to start of "Your Summaries" section when custom summary is deleted](https://github.com/summarizator/fora-frontend/commit/3409f6a3)

  </details>

## [0.7.2](https://github.com/summarizator/fora-frontend/compare/v0.7.1...v0.7.2) <span style="color: red;">[prod]</span>
> Wed, May 14 2025 | 09:38 AM EST

### Bug Fixes

- [FORA-1178](https://foraday.atlassian.net/browse/FORA-1178): [MOBILE/OTHER BROWSER] Meeting Control Bar Breaking Incorrectly on Mobile
  <details>
    <summary>Commits</summary>

    - [Merge branch 'app' into FORA-1178-MOBILE-OTHER-BROWSER-Meeting-Control-Bar-Breaking-Incorrectly-on-Mobile](https://github.com/summarizator/fora-frontend/commit/032fa05d)
    - [Merge branch 'app' into FORA-1178-MOBILE-OTHER-BROWSER-Meeting-Control-Bar-Breaking-Incorrectly-on-Mobile](https://github.com/summarizator/fora-frontend/commit/c1f57a53)
    - [Merge branch 'app' into FORA-1178-MOBILE-OTHER-BROWSER-Meeting-Control-Bar-Breaking-Incorrectly-on-Mobile](https://github.com/summarizator/fora-frontend/commit/9adff8f9)
    - [Merge branch 'app' into FORA-1178-MOBILE-OTHER-BROWSER-Meeting-Control-Bar-Breaking-Incorrectly-on-Mobile](https://github.com/summarizator/fora-frontend/commit/583f0013)
    - [flexWrap unset](https://github.com/summarizator/fora-frontend/commit/c8ee69b7)
    - [Merge branch 'app' into FORA-1178-MOBILE-OTHER-BROWSER-Meeting-Control-Bar-Breaking-Incorrectly-on-Mobile](https://github.com/summarizator/fora-frontend/commit/70ee8055)
    - [Merge branch 'app' into FORA-1178-MOBILE-OTHER-BROWSER-Meeting-Control-Bar-Breaking-Incorrectly-on-Mobile](https://github.com/summarizator/fora-frontend/commit/d26ea63e)
    - [Merge branch 'app' into FORA-1178-MOBILE-OTHER-BROWSER-Meeting-Control-Bar-Breaking-Incorrectly-on-Mobile](https://github.com/summarizator/fora-frontend/commit/30c06402)
    - [wrap control buttons down when status is long](https://github.com/summarizator/fora-frontend/commit/31115eb6)

  </details>


### Features

- [FORA-1534](https://foraday.atlassian.net/browse/FORA-1534): FE - extract filename from tags field on document upload and display
  <details>
    <summary>Commits</summary>

    - [Merge branch 'app' into FORA-1534-FE-extract-filename-from-tags-field-on-document-upload-and-display](https://github.com/summarizator/fora-frontend/commit/dea8830a)
    - [Merge branch 'app' into FORA-1534-FE-extract-filename-from-tags-field-on-document-upload-and-display](https://github.com/summarizator/fora-frontend/commit/f810dbc6)
    - [Merge branch 'app' into FORA-1534-FE-extract-filename-from-tags-field-on-document-upload-and-display](https://github.com/summarizator/fora-frontend/commit/da71b183)
    - [Merge branch 'app' into FORA-1534-FE-extract-filename-from-tags-field-on-document-upload-and-display](https://github.com/summarizator/fora-frontend/commit/ebe3933e)
    - [use getDocumentTitleFromCard in reskin summary card](https://github.com/summarizator/fora-frontend/commit/c578b095)
    - [Merge branch 'app' into FORA-1534-FE-extract-filename-from-tags-field-on-document-upload-and-display](https://github.com/summarizator/fora-frontend/commit/99199c75)
    - [cleanup](https://github.com/summarizator/fora-frontend/commit/c0f690c2)
    - [extract document title from card tags](https://github.com/summarizator/fora-frontend/commit/ca058379)

  </details>

- [FORA-1476](https://foraday.atlassian.net/browse/FORA-1476): Integrate rollbar into handled API errors
  <details>
    <summary>Commits</summary>

    - [refactor: update sanitization functions and improve error boundary styling. rm inline comments](https://github.com/summarizator/fora-frontend/commit/4ed5a0e8)
    - [fix: use optional chaining for safer access to conversation artifacts](https://github.com/summarizator/fora-frontend/commit/905d957d)
    - [fix: use optional chaining for safer access to conversation artifacts](https://github.com/summarizator/fora-frontend/commit/e694a759)
    - [Merge remote-tracking branch 'origin/FORA-1476-Integrate-rollbar-into-handled-API-errors' into FORA-1476-Integrate-rollbar-into-handled-API-errors](https://github.com/summarizator/fora-frontend/commit/6141ca5d)
    - [Update src/pages/callback/slack-callback.page.jsx](https://github.com/summarizator/fora-frontend/commit/28b0417f)
    - [Merge branch 'app' into FORA-1476-Integrate-rollbar-into-handled-API-errors](https://github.com/summarizator/fora-frontend/commit/11c1d39b)
    - [comment removal, jsdoc](https://github.com/summarizator/fora-frontend/commit/921395eb)
    - [Merge branch 'app' into FORA-1476-Integrate-rollbar-into-handled-API-errors](https://github.com/summarizator/fora-frontend/commit/d0636568)
    - [comment removal, jsdoc](https://github.com/summarizator/fora-frontend/commit/768321d7)
    - [first round of pr comments](https://github.com/summarizator/fora-frontend/commit/677baff6)
    - [first round of pr comments](https://github.com/summarizator/fora-frontend/commit/3c07995a)
    - [first round of pr comments](https://github.com/summarizator/fora-frontend/commit/f42ea712)
    - [Merge branch 'app' into FORA-1476-Integrate-rollbar-into-handled-API-errors](https://github.com/summarizator/fora-frontend/commit/c29df70e)
    - [refactor: enhance documentation with detailed JSDoc comments for helper functions and components](https://github.com/summarizator/fora-frontend/commit/97fd4e93)
    - [add cursor rules](https://github.com/summarizator/fora-frontend/commit/fc31e521)
    - [sonar](https://github.com/summarizator/fora-frontend/commit/08851604)
    - [refactor: update Rollbar configuration to disable in local environment and improve clarity](https://github.com/summarizator/fora-frontend/commit/f9b020c3)
    - [refactor: streamline authentication check and enhance error logging in feature gates](https://github.com/summarizator/fora-frontend/commit/8fcb4a91)
    - [test: add unit tests for getSimplifiedGatesFromStore function](https://github.com/summarizator/fora-frontend/commit/d3a3b76d)
    - [refactor: replace feature gates cache retrieval with store access in error boundary](https://github.com/summarizator/fora-frontend/commit/7bf6c45f)
    - [query service back temp](https://github.com/summarizator/fora-frontend/commit/26598afa)
    - [start of worlds funnest merge](https://github.com/summarizator/fora-frontend/commit/5fe2155b)
    - [feat: enhance error boundary tests and simplify feature gates caching logic](https://github.com/summarizator/fora-frontend/commit/738cbe80)
    - [feat: enhance error handling in Rollbar by refining ignore conditions for uncaught errors](https://github.com/summarizator/fora-frontend/commit/78763cbf)
    - [feat: enhance error handling in Rollbar by refining ignore conditions for uncaught errors](https://github.com/summarizator/fora-frontend/commit/34572144)
    - [feat: implement simplified feature gates handling with dedicated caching and retrieval](https://github.com/summarizator/fora-frontend/commit/dfb6565c)
    - [feat: simplify feature gates handling by removing unnecessary complexity and ensuring consistent caching](https://github.com/summarizator/fora-frontend/commit/301e5a8f)
    - [feat: refactor feature gates query service tests for improved clarity and error handling](https://github.com/summarizator/fora-frontend/commit/beb6f49d)
    - [feat: enhance Rollbar transform helpers with additional exception handling and improved test coverage](https://github.com/summarizator/fora-frontend/commit/66114be5)
    - [feat: enhance Rollbar transform helpers with additional exception handling and improved test coverage](https://github.com/summarizator/fora-frontend/commit/ee9f862e)
    - [feat: refactor Rollbar transform helpers for improved modularity and testing](https://github.com/summarizator/fora-frontend/commit/eac9d5a8)
    - [sonar](https://github.com/summarizator/fora-frontend/commit/b933e29e)
    - [feat: add tests for sanitization helpers to redact sensitive data](https://github.com/summarizator/fora-frontend/commit/33e8e0b1)
    - [feat: add tests for sanitization helpers to redact sensitive data](https://github.com/summarizator/fora-frontend/commit/7f20c0ab)
    - [feat: add tests for sanitization helpers to redact sensitive data](https://github.com/summarizator/fora-frontend/commit/127b91bb)
    - [feat: add documentation for searching specific error types in Rollbar](https://github.com/summarizator/fora-frontend/commit/fc9612ee)
    - [feat: add documentation for searching specific error types in Rollbar](https://github.com/summarizator/fora-frontend/commit/df8d3a0b)
    - [feat: enhance error boundary plugin to conditionally import helpers and add forceInclude option](https://github.com/summarizator/fora-frontend/commit/33cc7536)
    - [feat: standardize Rollbar error titles and refactor imports for clarity](https://github.com/summarizator/fora-frontend/commit/9f2a49ab)
    - [feat: enhance Rollbar error reporting with standardized titles across components](https://github.com/summarizator/fora-frontend/commit/1ac22f77)
    - [Merge branch 'FORA-1327-FE-Implement-App-Wide-Error-Isolation-with-Babel-Transform' into FORA-1476-Integrate-rollbar-into-handled-API-errors](https://github.com/summarizator/fora-frontend/commit/51447ba0)
    - [feat: enhance error handling in testing components with toast notifications](https://github.com/summarizator/fora-frontend/commit/6768a43a)
    - [feat: enhance Rollbar testing page with improved error handling components and UI updates](https://github.com/summarizator/fora-frontend/commit/13b2b331)
    - [feat: add sanitization helpers for sensitive data in API requests](https://github.com/summarizator/fora-frontend/commit/c1310280)
    - [refactor: remove Rollbar user registration from authentication methods (redundant)](https://github.com/summarizator/fora-frontend/commit/50f5ff79)
    - [refactor: only use one rollbar instance](https://github.com/summarizator/fora-frontend/commit/99cd7e40)
    - [feat: integrate Rollbar for error reporting in api (start)](https://github.com/summarizator/fora-frontend/commit/98c77df3)
    - [Merge branch 'dev' into FORA-1476-Integrate-rollbar-into-handled-API-errors](https://github.com/summarizator/fora-frontend/commit/3c0d0a16)

  </details>

- [FORA-1478](https://foraday.atlassian.net/browse/FORA-1478): Category Rules - add the new domain fields
  <details>
    <summary>Commits</summary>

    - [Merge branch 'app' into FORA-1478-domains-are-only](https://github.com/summarizator/fora-frontend/commit/e9b32a1d)
    - [fix rogue invittees append](https://github.com/summarizator/fora-frontend/commit/a918397e)
    - [add helpers to focus helpers](https://github.com/summarizator/fora-frontend/commit/a0861e4b)
    - [minor styling clean up](https://github.com/summarizator/fora-frontend/commit/3689296a)
    - [minor component name fix](https://github.com/summarizator/fora-frontend/commit/a7471efe)
    - [copy updates](https://github.com/summarizator/fora-frontend/commit/89512f6a)
    - [styling improvements on category form](https://github.com/summarizator/fora-frontend/commit/4da8d37b)
    - [Add 'only domains' to create category rules](https://github.com/summarizator/fora-frontend/commit/52e7c4b7)

  </details>

## [0.6.7](https://github.com/summarizator/fora-frontend/compare/v0.6.6...v0.6.7) <span style="color: red;">[prod]</span>
> Mon, May 12 2025 | 11:14 AM EST

### Features

- [FORA-1485](https://foraday.atlassian.net/browse/FORA-1485): Manage Digests - editing slack digests /teams digests
  <details>
    <summary>Commits</summary>

    - [Merge branch 'app' into FORA-1485-edit-slack-digest](https://github.com/summarizator/fora-frontend/commit/afcfd9dd)
    - [Merge branch 'app' into FORA-1485-edit-slack-digest](https://github.com/summarizator/fora-frontend/commit/e5ec9063)
    - [minor fix to post-edit reset on slack digest modal](https://github.com/summarizator/fora-frontend/commit/53a49ddd)
    - [minor clean up](https://github.com/summarizator/fora-frontend/commit/a9839de0)
    - [add delete modal tests"](https://github.com/summarizator/fora-frontend/commit/b3f14ba9)
    - [Updated tests for digest form](https://github.com/summarizator/fora-frontend/commit/773fbfbc)
    - [minor renames for consistency](https://github.com/summarizator/fora-frontend/commit/13fec3cc)
    - [Fixed channel conversion on edit](https://github.com/summarizator/fora-frontend/commit/dd875238)
    - [TDD on channel conversion helpers for debugging](https://github.com/summarizator/fora-frontend/commit/7714d137)
    - [Add editing support to teams digest modal, fied issue with individaul teams identifiers](https://github.com/summarizator/fora-frontend/commit/06e7b148)
    - [minor rename and normalzing with slack modal](https://github.com/summarizator/fora-frontend/commit/3df219b1)
    - [Merge branch 'app' into FORA-1485-edit-slack-digest](https://github.com/summarizator/fora-frontend/commit/2c6102f3)
    - [add delete-digest modal](https://github.com/summarizator/fora-frontend/commit/777cc509)
    - [clean up and removal of old digest form files](https://github.com/summarizator/fora-frontend/commit/960e9421)
    - [reorganize logic in create-slack-digest modal](https://github.com/summarizator/fora-frontend/commit/cf188bf1)
    - [Add edit columns and expand table to fit content better](https://github.com/summarizator/fora-frontend/commit/e709693a)
    - [Reworking manage-digests page](https://github.com/summarizator/fora-frontend/commit/d0a34c70)

  </details>

## [0.6.6](https://github.com/summarizator/fora-frontend/compare/v0.6.5...v0.6.6) <span style="color: red;">[prod]</span>
> Fri, May 9 2025 | 06:09 PM EST

### Bug Fixes

- [FORA-1516](https://foraday.atlassian.net/browse/FORA-1516): Formatting instructions not respected during custom summary creation
  <details>
    <summary>Commits</summary>

    - [Merge branch 'app' into FORA-1516-custom-summary-bug](https://github.com/summarizator/fora-frontend/commit/a8a4b7a9)
    - [Merge branch 'app' into FORA-1516-custom-summary-bug](https://github.com/summarizator/fora-frontend/commit/3e748d51)
    - [missing param when saving template initiative](https://github.com/summarizator/fora-frontend/commit/9f9186eb)

  </details>

## [0.6.5](https://github.com/summarizator/fora-frontend/compare/v0.6.4...v0.6.5) <span style="color: red;">[prod]</span>
> Fri, May 9 2025 | 03:57 PM EST

### Features

- [FORA-1544](https://foraday.atlassian.net/browse/FORA-1544): Fix shared summary in meeting modal
  <details>
    <summary>Commits</summary>

    - [remove bad code](https://github.com/summarizator/fora-frontend/commit/574bafaf)

  </details>

## [0.6.4](https://github.com/summarizator/fora-frontend/compare/v0.6.3...v0.6.4) <span style="color: red;">[prod]</span>
> Fri, May 9 2025 | 02:03 PM EST

### Features

- [FORA-1543](https://foraday.atlassian.net/browse/FORA-1543): comment out unhandled control bar state rollbar error
  <details>
    <summary>Commits</summary>

    - [comment out rollbar error](https://github.com/summarizator/fora-frontend/commit/cf4ec409)

  </details>

## [0.6.3](https://github.com/summarizator/fora-frontend/compare/v0.6.2...v0.6.3) <span style="color: red;">[prod]</span>
> Fri, May 9 2025 | 10:52 AM EST

### Features

- [FORA-1389](https://foraday.atlassian.net/browse/FORA-1389): Summarize > teams channels
  <details>
    <summary>Commits</summary>

    - [Merge branch 'app' into FORA-1389-Summarize-teams-channels](https://github.com/summarizator/fora-frontend/commit/11e83583)
    - [Merge branch 'app' into FORA-1389-Summarize-teams-channels](https://github.com/summarizator/fora-frontend/commit/ce291389)
    - [sonar](https://github.com/summarizator/fora-frontend/commit/a3b8c063)
    - [teams channels selector error state](https://github.com/summarizator/fora-frontend/commit/15150667)
    - [finish accordion styling](https://github.com/summarizator/fora-frontend/commit/3c917faf)
    - [organize callbacks, format selected channels info text](https://github.com/summarizator/fora-frontend/commit/3c4db1c1)
    - [create teams digest mobile - implement flow](https://github.com/summarizator/fora-frontend/commit/a61f9172)

  </details>

- [FORA-1538](https://foraday.atlassian.net/browse/FORA-1538): Open Overall tab when opened card gets deleted
  <details>
    <summary>Commits</summary>

    - [Merge branch 'app' into FORA-1538-Open-Overall-tab-when-opened-card-gets-deleted](https://github.com/summarizator/fora-frontend/commit/7b5fcbff)
    - [open overall tab on custom summary deletion](https://github.com/summarizator/fora-frontend/commit/753d975e)

  </details>

## [0.6.1](https://github.com/summarizator/fora-frontend/compare/v0.6.0...v0.6.1) <span style="color: red;">[prod]</span>
> Thu, May 8 2025 | 11:26 AM EST

### Bug Fixes

- [FORA-1535](https://foraday.atlassian.net/browse/FORA-1535): Move non-components out of components/pages folders
  <details>
    <summary>Commits</summary>

    - [Fix broken tests](https://github.com/summarizator/fora-frontend/commit/1013f2e6)
    - [Move org-store store to store dir](https://github.com/summarizator/fora-frontend/commit/a9c3302c)
    - [Move pulse store to store dir](https://github.com/summarizator/fora-frontend/commit/25815e28)
    - [Move users helpers to util/helpers](https://github.com/summarizator/fora-frontend/commit/4391e7d4)
    - [Exclude pdf components from error boundary](https://github.com/summarizator/fora-frontend/commit/01ef37c1)
    - [Remove unused file meeting-modal](https://github.com/summarizator/fora-frontend/commit/0fa0394a)
    - [Move pdf-icons to assets/icons](https://github.com/summarizator/fora-frontend/commit/650f3304)
    - [Remove extraneous test file](https://github.com/summarizator/fora-frontend/commit/760b3c81)
    - [Move feed.constants to util/constants](https://github.com/summarizator/fora-frontend/commit/f03672ff)
    - [Move pdf.helpers to util/helpers](https://github.com/summarizator/fora-frontend/commit/7541fbd4)
    - [Move reskin-meeting-card.hooks to util/hooks](https://github.com/summarizator/fora-frontend/commit/d8b70b3f)

  </details>


### Tasks

- [FORA-1327](https://foraday.atlassian.net/browse/FORA-1327): FE: Implement App-Wide Error Isolation with Babel Transform
  <details>
    <summary>Commits</summary>

    - [Merge branch 'app' into FORA-1327-FE-Implement-App-Wide-Error-Isolation-with-Babel-Transform](https://github.com/summarizator/fora-frontend/commit/2d692462)
    - [fix: improve cache validation by using lodash's isEmpty for gates check](https://github.com/summarizator/fora-frontend/commit/68bc26fa)
    - [fix: update color and background properties in card helpers tests](https://github.com/summarizator/fora-frontend/commit/a86f9d1a)
    - [Merge branch 'dev' into FORA-1327-FE-Implement-App-Wide-Error-Isolation-with-Babel-Transform](https://github.com/summarizator/fora-frontend/commit/2ca5022d)
    - [Merge branch 'app' into 'dev' [skip post-merge-dev]](https://github.com/summarizator/fora-frontend/commit/c02e740a)
    - [feat: use optional chaining for statsigClient check in updateUserAccess](https://github.com/summarizator/fora-frontend/commit/5fce31ec)
    - [Merge branch 'dev' into FORA-1327-FE-Implement-App-Wide-Error-Isolation-with-Babel-Transform](https://github.com/summarizator/fora-frontend/commit/9641d31d)
    - [sonar](https://github.com/summarizator/fora-frontend/commit/c5e5d2c2)
    - [rename test file](https://github.com/summarizator/fora-frontend/commit/617b060d)
    - [comments 15 (comment removal5)](https://github.com/summarizator/fora-frontend/commit/66a297cc)
    - [comments 14 (comment removal4)](https://github.com/summarizator/fora-frontend/commit/c01d5829)
    - [comments 13 (comment removal3)](https://github.com/summarizator/fora-frontend/commit/5f2db3c1)
    - [comments 12 (comment removal2)](https://github.com/summarizator/fora-frontend/commit/4b7db0a0)
    - [comments 11 (comment removal1)](https://github.com/summarizator/fora-frontend/commit/b3a54ce4)
    - [comments 10 (end of switch to zustand)](https://github.com/summarizator/fora-frontend/commit/de695c6d)
    - [comments 10 (start of switch to zustand)](https://github.com/summarizator/fora-frontend/commit/c7e3cdd7)
    - [comments 9 (memo)](https://github.com/summarizator/fora-frontend/commit/e974cb5b)
    - [comments 8](https://github.com/summarizator/fora-frontend/commit/467163a2)
    - [comments 7](https://github.com/summarizator/fora-frontend/commit/f2ffdd7c)
    - [comments 6](https://github.com/summarizator/fora-frontend/commit/8a359691)
    - [comments 5](https://github.com/summarizator/fora-frontend/commit/4324db1a)
    - [comments 4](https://github.com/summarizator/fora-frontend/commit/17314f18)
    - [comments 3](https://github.com/summarizator/fora-frontend/commit/107257cd)
    - [comments 2](https://github.com/summarizator/fora-frontend/commit/30a2375c)
    - [comments 1](https://github.com/summarizator/fora-frontend/commit/bac51910)
    - [Merge branch 'dev' into FORA-1327-FE-Implement-App-Wide-Error-Isolation-with-Babel-Transform](https://github.com/summarizator/fora-frontend/commit/55054297)
    - [feat: simplify feature flag check using Object.hasOwn](https://github.com/summarizator/fora-frontend/commit/f2df2363)
    - [feat: update lint-staged configuration to support Prettier and ensure non-empty file arguments](https://github.com/summarizator/fora-frontend/commit/1f11fe63)
    - [feat: add rollbarConfig.transform tests and enhance general hooks with new listeners](https://github.com/summarizator/fora-frontend/commit/019b1858)
    - [feat: refactor error boundary helpers into separate file and update tests](https://github.com/summarizator/fora-frontend/commit/3a7f494b)
    - [feat: add FeatureGatesTable component and related tests; update kill-netlify script to accept port argument](https://github.com/summarizator/fora-frontend/commit/fcd299dd)
    - [Merge branch 'dev' into FORA-1327-FE-Implement-App-Wide-Error-Isolation-with-Babel-Transform](https://github.com/summarizator/fora-frontend/commit/0226d1f1)
    - [put full ff payload back](https://github.com/summarizator/fora-frontend/commit/a92a04eb)
    - [sonar](https://github.com/summarizator/fora-frontend/commit/ff5f01e8)
    - [rm problem tests idk why they were failing](https://github.com/summarizator/fora-frontend/commit/84334df9)
    - [rm problem tests idk why they were failing](https://github.com/summarizator/fora-frontend/commit/ee3a66e4)
    - [sonar](https://github.com/summarizator/fora-frontend/commit/e3838d93)
    - [sonar](https://github.com/summarizator/fora-frontend/commit/070344f9)
    - [feat: remove unnecessary console logs from error boundary and feature gates initialization](https://github.com/summarizator/fora-frontend/commit/4d77dd47)
    - [kick](https://github.com/summarizator/fora-frontend/commit/b0a06567)
    - [feat: simplify ErrorBoundary tests by creating a mock component and improving error handling](https://github.com/summarizator/fora-frontend/commit/09a8b847)
    - [feat: exclude specific skeleton and loader components from error boundary wrapping](https://github.com/summarizator/fora-frontend/commit/0a7bad2d)
    - [feat: enhance feature gates management by initializing during login and clearing cache on logout](https://github.com/summarizator/fora-frontend/commit/0ae41ba0)
    - [docs: update error boundaries documentation to reflect method renumbering and improve clarity](https://github.com/summarizator/fora-frontend/commit/296bff2b)
    - [refactor: simplify error boundary feature gate handling by removing unnecessary API calls and using cached data](https://github.com/summarizator/fora-frontend/commit/538426a6)
    - [feat: use rollbar err boundary. enhance ErrorBoundary to prefetch and manage feature gates, improving error context reporting](https://github.com/summarizator/fora-frontend/commit/162c0aeb)
    - [feat: add check function to prevent duplicate error reporting for expected errors](https://github.com/summarizator/fora-frontend/commit/0a355faa)
    - [feat: add app version and build information to custom payload for improved tracking](https://github.com/summarizator/fora-frontend/commit/eb141602)
    - [feat: add app version and build information to custom payload for improved tracking](https://github.com/summarizator/fora-frontend/commit/c09e414e)
    - [refactor: update Rollbar error reporting to configure custom context payload](https://github.com/summarizator/fora-frontend/commit/b6ed6d68)
    - [refactor: update Rollbar error reporting to configure custom context payload](https://github.com/summarizator/fora-frontend/commit/ee518f73)
    - [feat: add development configuration for Netlify with auto-launch and no-open option](https://github.com/summarizator/fora-frontend/commit/590e2732)
    - [feat: optimize payload size by removing unnecessary data and limiting component stack](https://github.com/summarizator/fora-frontend/commit/059e1674)
    - [tests](https://github.com/summarizator/fora-frontend/commit/8a7ccffc)
    - [tests](https://github.com/summarizator/fora-frontend/commit/8f1a394b)
    - [feat: enhance document title management with priority handling and fallbacks](https://github.com/summarizator/fora-frontend/commit/e1c0627f)
    - [feat: implement dynamic document title setting based on route and component](https://github.com/summarizator/fora-frontend/commit/083b7c63)
    - [refactor: replace feature gates store with query service for improved data fetching](https://github.com/summarizator/fora-frontend/commit/bba1e694)
    - [refactor: streamline feature gates fetching and improve error handling](https://github.com/summarizator/fora-frontend/commit/73d3b122)
    - [refactor: consolidate feature gates fetching and enhance error reporting](https://github.com/summarizator/fora-frontend/commit/7d1f5bed)
    - [table styling](https://github.com/summarizator/fora-frontend/commit/2afc350e)
    - [table more](https://github.com/summarizator/fora-frontend/commit/a0f667c4)
    - [table start](https://github.com/summarizator/fora-frontend/commit/d38ae031)
    - [start of working feature gate page](https://github.com/summarizator/fora-frontend/commit/edb16887)
    - [organize internal testing pages](https://github.com/summarizator/fora-frontend/commit/68678dc7)
    - [ensure its doing the right thing](https://github.com/summarizator/fora-frontend/commit/5a6a46f4)
    - [cleanup old statsig shit](https://github.com/summarizator/fora-frontend/commit/c610a15f)
    - [start of statsig cleanup and rewrite](https://github.com/summarizator/fora-frontend/commit/6bc1122f)
    - [add second round of extra data to EB](https://github.com/summarizator/fora-frontend/commit/ce2c9851)
    - [add first round of extra data to EB](https://github.com/summarizator/fora-frontend/commit/6b521091)
    - [page reload button](https://github.com/summarizator/fora-frontend/commit/bc212b4f)
    - [fix tests](https://github.com/summarizator/fora-frontend/commit/39915da4)
    - [more naming cleanup](https://github.com/summarizator/fora-frontend/commit/2ee60c9b)
    - [custom working cleanup](https://github.com/summarizator/fora-frontend/commit/cef68142)
    - [custom working cleanup](https://github.com/summarizator/fora-frontend/commit/3844daff)
    - [custom working cleanup](https://github.com/summarizator/fora-frontend/commit/78e4b572)
    - [custom working cleanup](https://github.com/summarizator/fora-frontend/commit/060034b9)
    - [custom working](https://github.com/summarizator/fora-frontend/commit/4d9ef278)
    - [back to custom](https://github.com/summarizator/fora-frontend/commit/96e41f98)
    - [sike its not fixed](https://github.com/summarizator/fora-frontend/commit/16504226)
    - [fix top case](https://github.com/summarizator/fora-frontend/commit/7c1bab9c)
    - [Merge branch 'dev' into FORA-1327-FE-Implement-App-Wide-Error-Isolation-with-Babel-Transform](https://github.com/summarizator/fora-frontend/commit/1184761f)
    - [unify to one testing page](https://github.com/summarizator/fora-frontend/commit/0d5db426)
    - [md explanation](https://github.com/summarizator/fora-frontend/commit/05a41410)
    - [more detailed debugging](https://github.com/summarizator/fora-frontend/commit/020ce270)
    - [more detailed debugging](https://github.com/summarizator/fora-frontend/commit/d0170093)
    - [start of dev ootb](https://github.com/summarizator/fora-frontend/commit/3e1c068e)
    - [switch to OOTB](https://github.com/summarizator/fora-frontend/commit/f0f37562)
    - [switch to OOTB](https://github.com/summarizator/fora-frontend/commit/9912a43e)
    - [switch to OOTB](https://github.com/summarizator/fora-frontend/commit/4a0a3427)
    - [Merge branch 'dev' into FORA-1327-FE-Implement-App-Wide-Error-Isolation-with-Babel-Transform](https://github.com/summarizator/fora-frontend/commit/57922494)
    - [starter files, not working yet](https://github.com/summarizator/fora-frontend/commit/c1cad419)
    - [starter files, not working yet](https://github.com/summarizator/fora-frontend/commit/a1157675)

  </details>


### Features

- [FORA-1533](https://foraday.atlassian.net/browse/FORA-1533): Prod site cutover v2
  <details>
    <summary>Commits</summary>

    - [Add *.fora.day to csp header list](https://github.com/summarizator/fora-frontend/commit/7e7c85d4)
    - [Rename to app](https://github.com/summarizator/fora-frontend/commit/25e18acd)
    - [Setup new build scripts](https://github.com/summarizator/fora-frontend/commit/1fa68c06)
    - [disable existing build scripts](https://github.com/summarizator/fora-frontend/commit/6fba1281)

  </details>

## [0.5.249](https://github.com/summarizator/fora-frontend/compare/v0.5.248...v0.5.249) <span style="color: red;">[prod]</span>
> Mon, May 5 2025 | 03:29 PM EST

### Features

- [FORA-1482](https://foraday.atlassian.net/browse/FORA-1482): Color Token Migration
  <details>
    <summary>Commits</summary>

    - [Merge branch 'dev' of https://github.com/summarizator/fora-frontend into FORA-1482-color-migration](https://github.com/summarizator/fora-frontend/commit/66e25fc4)
    - [Hex code removal. Fix to incorrect colors](https://github.com/summarizator/fora-frontend/commit/5e0bb0a0)
    - [fix surfaceBrighter instances](https://github.com/summarizator/fora-frontend/commit/a15084ca)
    - [Fix to profile fallback color](https://github.com/summarizator/fora-frontend/commit/716b6f68)
    - [fix to orphaned tokens](https://github.com/summarizator/fora-frontend/commit/c368401a)
    - [minor fixes to critical](https://github.com/summarizator/fora-frontend/commit/40ee2108)
    - [foraPrimary -> brandPrimary. foraSecondary -> brandSecondary. foraTertiary -> brandTertiary](https://github.com/summarizator/fora-frontend/commit/e681bb9c)
    - [slack 'brand' tokens => 'foraPrimary'](https://github.com/summarizator/fora-frontend/commit/a47d4689)
    - [Merge branch 'dev' of https://github.com/summarizator/fora-frontend into FORA-1482-color-migration](https://github.com/summarizator/fora-frontend/commit/1957cf78)
    - [Removed references to 'material'](https://github.com/summarizator/fora-frontend/commit/61ccb064)
    - [Fixed edge cases in progress bar and new summarize menu](https://github.com/summarizator/fora-frontend/commit/5457c91e)
    - [etc => scrim. Fixed old instances of onPrimaryContainer and other orphaned tokens](https://github.com/summarizator/fora-frontend/commit/7c8a2b83)
    - [Add 'neutral' palette. Add comments to theming files](https://github.com/summarizator/fora-frontend/commit/d8eee361)
    - ['live' palette updates](https://github.com/summarizator/fora-frontend/commit/894eb8a3)
    - [container.surfaceContainer... => surface.container... across all instances. Consolidated old container palette into surface palette.](https://github.com/summarizator/fora-frontend/commit/9d10e17f)
    - [surface: refined palette. Updated old tokens](https://github.com/summarizator/fora-frontend/commit/0f38918e)
    - [Add all new tag color palettes. Converted old emerald, blue, and amethyst tag palettes to more lightweight versions](https://github.com/summarizator/fora-frontend/commit/068b22b2)
    - [system.caution => caution. yellow_system hex updates. Update component testing color palettes. Removed system.position, system.caution, system.critical tokens. Removed insight tokens '](https://github.com/summarizator/fora-frontend/commit/76cfaae6)
    - [Add outline and outlineVariant tokens](https://github.com/summarizator/fora-frontend/commit/45170c43)
    - [system.critical => critical. red_system hex updates](https://github.com/summarizator/fora-frontend/commit/f1dccede)
    - [system.positive => positive. green_system hex updates](https://github.com/summarizator/fora-frontend/commit/84cea2f8)
    - [insight purple => brandTertiary. 'insight' palette => brand_purple](https://github.com/summarizator/fora-frontend/commit/12d37e50)
    - [Removed  palette. Removed references to prep palette](https://github.com/summarizator/fora-frontend/commit/46d91729)
    - [add brand_light_blue color palette. Add foraSecondary semantic token palette](https://github.com/summarizator/fora-frontend/commit/fc1f8a8a)
    - [brand => foraPrimary | brand => brand_blue in colors.theme.js. Updated all references to brand color](https://github.com/summarizator/fora-frontend/commit/d086ea13)

  </details>

## [0.5.247](https://github.com/summarizator/fora-frontend/compare/v0.5.246...v0.5.247) <span style="color: red;">[prod]</span>
> Thu, May 1 2025 | 04:15 PM EST

### Features

- [FORA-1517](https://foraday.atlassian.net/browse/FORA-1517): Add okta test issuer to CSP headers
  <details>
    <summary>Commits</summary>

    - [Add okta test issuer to CSP headers file](https://github.com/summarizator/fora-frontend/commit/73c199ba)

  </details>

- [FORA-1394](https://foraday.atlassian.net/browse/FORA-1394): Summarize > Document
  <details>
    <summary>Commits</summary>

    - [Merge branch 'dev' into FORA-1394-Summarize-Document](https://github.com/summarizator/fora-frontend/commit/b86e8afa)
    - [remove QueryProvider in test suite where the query is mocked already](https://github.com/summarizator/fora-frontend/commit/4a3a98da)
    - [add s3bucket tests](https://github.com/summarizator/fora-frontend/commit/f8ae4789)
    - [add reskin-card-body-bullet-points tests](https://github.com/summarizator/fora-frontend/commit/de1acdb7)
    - [add getDocumentTitleFromString test](https://github.com/summarizator/fora-frontend/commit/f4aa0c5d)
    - [organize card-body](https://github.com/summarizator/fora-frontend/commit/fe5d2115)
    - [sonar test - javascript:S3800](https://github.com/summarizator/fora-frontend/commit/e9c96401)
    - [fix card body tests](https://github.com/summarizator/fora-frontend/commit/50f919ac)
    - [hide undefined from supporting data](https://github.com/summarizator/fora-frontend/commit/244b0b15)
    - [hide timestamp in document title](https://github.com/summarizator/fora-frontend/commit/d7f45638)
    - [remove stuff for debugging](https://github.com/summarizator/fora-frontend/commit/1d551c15)
    - [unset toast maxW](https://github.com/summarizator/fora-frontend/commit/1c40ddca)
    - [remove test toasts](https://github.com/summarizator/fora-frontend/commit/9509b425)
    - [upload multiple files, fix file names overflow, copy updates](https://github.com/summarizator/fora-frontend/commit/20f9dc93)
    - [move uploading text down, center dropzone contents vertically](https://github.com/summarizator/fora-frontend/commit/c74989dd)
    - [move close button to file container](https://github.com/summarizator/fora-frontend/commit/f1fb34e9)
    - [center align file container](https://github.com/summarizator/fora-frontend/commit/d2026fa6)
    - [placement 'bottom-end' looks nicer](https://github.com/summarizator/fora-frontend/commit/6fda6b90)
    - [update modal design, add popover contents](https://github.com/summarizator/fora-frontend/commit/e91b2070)

  </details>

- [FORA-1355](https://foraday.atlassian.net/browse/FORA-1355): Summarize > slack channels
  <details>
    <summary>Commits</summary>

    - [Add smarter error handling](https://github.com/summarizator/fora-frontend/commit/03206ea4)
    - [Add tooltip](https://github.com/summarizator/fora-frontend/commit/e3adcb4a)
    - [Reset form on completion success](https://github.com/summarizator/fora-frontend/commit/59fbece6)
    - [removed duplicate variant in text theme](https://github.com/summarizator/fora-frontend/commit/c2fc2167)
    - [pulled in test fixes](https://github.com/summarizator/fora-frontend/commit/e7ec8682)
    - [Merge branch 'dev' of https://github.com/summarizator/fora-frontend into FORA-1355-slack-summarize](https://github.com/summarizator/fora-frontend/commit/ccee20f2)
    - [Add time to cron schedules](https://github.com/summarizator/fora-frontend/commit/ad87a015)
    - [Revert date-fns upgrade. Fix timezone management on channel creation](https://github.com/summarizator/fora-frontend/commit/0a2170ae)
    - [Upgraded date-fns to v4.1.0. Added @date-fn/tz for better handling userTimezone and tenantTimezone values. Updated channel creation logic on create slack digest to use user or tenant timezone](https://github.com/summarizator/fora-frontend/commit/9c6e792b)
    - [Add intercom links](https://github.com/summarizator/fora-frontend/commit/110011b2)
    - [select QoL improvement](https://github.com/summarizator/fora-frontend/commit/0597d5f1)
    - [minor clean](https://github.com/summarizator/fora-frontend/commit/a63af63f)
    - [Merge branch 'dev' of https://github.com/summarizator/fora-frontend into FORA-1355-slack-summarize](https://github.com/summarizator/fora-frontend/commit/dd075fde)
    - [update slack digest to QA items, switched to regular Modal](https://github.com/summarizator/fora-frontend/commit/4e773184)
    - [remove just once digest option](https://github.com/summarizator/fora-frontend/commit/d67000d9)
    - [minor styling fix](https://github.com/summarizator/fora-frontend/commit/c564c19d)
    - [minor: removed unneeded test comments](https://github.com/summarizator/fora-frontend/commit/99c34c6f)
    - [Fix issue where handleSubmit did not wrap onSubmit correctly. Added tests for formValue => body conversion. Retroactively updated form tests](https://github.com/summarizator/fora-frontend/commit/fa680872)
    - [fix validation message](https://github.com/summarizator/fora-frontend/commit/b121434e)
    - [add create-slack-digest-modal tests](https://github.com/summarizator/fora-frontend/commit/77784819)
    - [add tests for create-digest-form](https://github.com/summarizator/fora-frontend/commit/160af084)
    - [minor clean](https://github.com/summarizator/fora-frontend/commit/eba5a8a0)
    - [minor clean](https://github.com/summarizator/fora-frontend/commit/6092a2e7)
    - [update visibility button text](https://github.com/summarizator/fora-frontend/commit/71456186)
    - [Add generalized create digest form and updated form fields with label and avlidation logic](https://github.com/summarizator/fora-frontend/commit/b25d1cb9)
    - [Merge branch 'dev' of https://github.com/summarizator/fora-frontend into FORA-1355-slack-summarize](https://github.com/summarizator/fora-frontend/commit/67a6ce2a)
    - [Merge branch 'dev' of https://github.com/summarizator/fora-frontend into FORA-1355-slack-summarize](https://github.com/summarizator/fora-frontend/commit/c4810014)
    - [revert for push](https://github.com/summarizator/fora-frontend/commit/14fa80a9)
    - [add modal configurations. Update custom select theming](https://github.com/summarizator/fora-frontend/commit/6e45afce)
    - [Add horizontal radio and info blurb components. Added sections to create digest modal. Fixed custom select theme styling](https://github.com/summarizator/fora-frontend/commit/c928c117)
    - [Merge branch 'dev' of https://github.com/summarizator/fora-frontend into FORA-1355-slack-summarize](https://github.com/summarizator/fora-frontend/commit/ba5e47c8)
    - [minor before pull](https://github.com/summarizator/fora-frontend/commit/ff8e70f8)
    - [Add digest modal](https://github.com/summarizator/fora-frontend/commit/a610f534)

  </details>

## [0.5.243](https://github.com/summarizator/fora-frontend/compare/v0.5.242...v0.5.243) <span style="color: red;">[prod]</span>
> Tue, Apr 29 2025 | 04:04 PM EST

### Features

- [FORA-1503](https://foraday.atlassian.net/browse/FORA-1503): Support okta login for okta tester
  <details>
    <summary>Commits</summary>

    - [Support login for okta tester](https://github.com/summarizator/fora-frontend/commit/c9b449a4)

  </details>

- [FORA-1394](https://foraday.atlassian.net/browse/FORA-1394): Summarize > Document
  <details>
    <summary>Commits</summary>

    - [render document title in meeting card](https://github.com/summarizator/fora-frontend/commit/036355a6)
    - [hide "undefined" in heading (detailed summary), show document title found in contents](https://github.com/summarizator/fora-frontend/commit/fd025fe0)
    - [remove minsize constraint from dropzone](https://github.com/summarizator/fora-frontend/commit/cae04908)
    - [comment out deploy-preview](https://github.com/summarizator/fora-frontend/commit/c22ca7ac)
    - [csp](https://github.com/summarizator/fora-frontend/commit/23b4054f)

  </details>

## [0.5.240](https://github.com/summarizator/fora-frontend/compare/v0.5.239...v0.5.240) <span style="color: red;">[prod]</span>
> Mon, Apr 28 2025 | 04:29 PM EST

### Features

- [FORA-1352](https://foraday.atlassian.net/browse/FORA-1352): Email subscription to turn on by default ONLY when a user's calendar is connected
  <details>
    <summary>Commits</summary>

    - [Use bang instead of isNil](https://github.com/summarizator/fora-frontend/commit/66e32f5e)
    - [Update person.helpers reference](https://github.com/summarizator/fora-frontend/commit/86c6bdc5)
    - [Add function addDigestConfigToNewUser to NylasCallbackPage](https://github.com/summarizator/fora-frontend/commit/dbf3e22f)

  </details>

- [FORA-1494](https://foraday.atlassian.net/browse/FORA-1494): Okta: support built-in auth server (FE)
  <details>
    <summary>Commits</summary>

    - [Support built-in okta auth server](https://github.com/summarizator/fora-frontend/commit/a168dd72)

  </details>

- [FORA-1394](https://foraday.atlassian.net/browse/FORA-1394): Summarize > Document
  <details>
    <summary>Commits</summary>

    - [move form inside modal body](https://github.com/summarizator/fora-frontend/commit/04b71749)
    - [add overlay, close button, update padding](https://github.com/summarizator/fora-frontend/commit/df3f9b21)
    - [remove StyledModal](https://github.com/summarizator/fora-frontend/commit/a67db39a)
    - [classic modal, update copy](https://github.com/summarizator/fora-frontend/commit/c16a2731)
    - [Merge branch 'dev' into FORA-1394-Summarize-Document](https://github.com/summarizator/fora-frontend/commit/373a5c72)
    - [SF icon is Chakra icon](https://github.com/summarizator/fora-frontend/commit/1a76352d)
    - [fix lambda query-service test](https://github.com/summarizator/fora-frontend/commit/c31b9d23)
    - [test s3 bucket, add nock library for mocking api calls](https://github.com/summarizator/fora-frontend/commit/71f44dae)
    - [s3 bucket class, styling comments](https://github.com/summarizator/fora-frontend/commit/0de0868c)
    - [update toasts](https://github.com/summarizator/fora-frontend/commit/f5eb3b4d)
    - [summarize document](https://github.com/summarizator/fora-frontend/commit/f628db55)
    - [form flow, call document parsing](https://github.com/summarizator/fora-frontend/commit/4767a71c)
    - [Merge branch 'dev' into FORA-1394-Summarize-Document](https://github.com/summarizator/fora-frontend/commit/2dd40666)
    - [update app header layout (design sync 4/22)](https://github.com/summarizator/fora-frontend/commit/d609c661)
    - [organize Summarize feature components, add `react-dropzone`, Summarize Document wip](https://github.com/summarizator/fora-frontend/commit/bcd3e9de)

  </details>


### Tasks

- [FORA-1488](https://foraday.atlassian.net/browse/FORA-1488): Auto Scheduling Copy Improvements
  <details>
    <summary>Commits</summary>

    - [Add tooltip to auto schedule](https://github.com/summarizator/fora-frontend/commit/f7dbc130)

  </details>

## [0.5.234](https://github.com/summarizator/fora-frontend/compare/v0.5.233...v0.5.234) <span style="color: red;">[prod]</span>
> Thu, Apr 24 2025 | 05:54 PM EST

## [0.5.233](https://github.com/summarizator/fora-frontend/compare/v0.5.232...v0.5.233) <span style="color: red;">[prod]</span>
> Wed, Apr 23 2025 | 03:26 PM EST

### Bug Fixes

- [FORA-1459](https://foraday.atlassian.net/browse/FORA-1459): dead fields appearing on earnings call settings page
  <details>
    <summary>Commits</summary>

    - [Fixed loading on earnings call page](https://github.com/summarizator/fora-frontend/commit/8a94fbc3)

  </details>

## [0.5.231](https://github.com/summarizator/fora-frontend/compare/v0.5.230...v0.5.231) <span style="color: red;">[prod]</span>
> Tue, Apr 22 2025 | 04:57 PM EST

### Features

- [FORA-1453](https://foraday.atlassian.net/browse/FORA-1453): Pop up for new profile page
  <details>
    <summary>Commits</summary>

    - [minor clean](https://github.com/summarizator/fora-frontend/commit/48cc37b8)
    - [Add tests](https://github.com/summarizator/fora-frontend/commit/3987d522)
    - [minor: copy updates](https://github.com/summarizator/fora-frontend/commit/0f02ab5b)
    - [Merge branch 'dev' of https://github.com/summarizator/fora-frontend into FORA-1453-profile-pop-up](https://github.com/summarizator/fora-frontend/commit/955eeb60)
    - [Updated initialFOcusRef for modal. Copy updates to welcome items](https://github.com/summarizator/fora-frontend/commit/7c58cf96)
    - [Merge branch 'FORA-1452-auto-scheduling' into FORA-1453-profile-pop-up](https://github.com/summarizator/fora-frontend/commit/dfb87535)
    - [Merge branch 'dev' of https://github.com/summarizator/fora-frontend into FORA-1453-profile-pop-up](https://github.com/summarizator/fora-frontend/commit/cba5e0e9)
    - [Styling fix to auto schedule label](https://github.com/summarizator/fora-frontend/commit/e36edeba)
    - [add success toast on auto schedule change](https://github.com/summarizator/fora-frontend/commit/e295c584)
    - [minor clean for PR](https://github.com/summarizator/fora-frontend/commit/cb9a6975)
    - [Add feature flag for welcome modal](https://github.com/summarizator/fora-frontend/commit/c305d31b)
    - [minor tag components update](https://github.com/summarizator/fora-frontend/commit/4ffc5a17)
    - [styling welcome modal](https://github.com/summarizator/fora-frontend/commit/ff0a88c5)
    - [Updated default tag theming](https://github.com/summarizator/fora-frontend/commit/15d5650d)
    - [add user config store and welcome modal](https://github.com/summarizator/fora-frontend/commit/524df43a)
    - [Merge branch 'dev' of https://github.com/summarizator/fora-frontend into FORA-1452-auto-scheduling](https://github.com/summarizator/fora-frontend/commit/eca00355)
    - [Added auto scheduling. Add tests](https://github.com/summarizator/fora-frontend/commit/a74c81d9)

  </details>


### Bug Fixes

- [FORA-1462](https://foraday.atlassian.net/browse/FORA-1462): Additional parameters to disable zoom cloud recording status
  <details>
    <summary>Commits</summary>

    - [Pass a staleTime of 10 minutes in useZoomMeetingRecordingStatus](https://github.com/summarizator/fora-frontend/commit/f9a069d5)
    - [Use disableCloudRecording function to enable/disable useZoomMeetingRecordingStatus query](https://github.com/summarizator/fora-frontend/commit/5fa918d4)

  </details>

## [0.5.228](https://github.com/summarizator/fora-frontend/compare/v0.5.227...v0.5.228) <span style="color: red;">[prod]</span>
> Tue, Apr 22 2025 | 11:04 AM EST

### Features

- [FORA-1452](https://foraday.atlassian.net/browse/FORA-1452): Auto user scheduling
  <details>
    <summary>Commits</summary>

    - [Styling fix to auto schedule label](https://github.com/summarizator/fora-frontend/commit/e36edeba)
    - [add success toast on auto schedule change](https://github.com/summarizator/fora-frontend/commit/e295c584)
    - [Merge branch 'dev' of https://github.com/summarizator/fora-frontend into FORA-1452-auto-scheduling](https://github.com/summarizator/fora-frontend/commit/eca00355)
    - [Added auto scheduling. Add tests](https://github.com/summarizator/fora-frontend/commit/a74c81d9)

  </details>


### Tasks

- [FORA-1457](https://foraday.atlassian.net/browse/FORA-1457): Add dev site to csp headers for okta
  <details>
    <summary>Commits</summary>

    - [Add dev site to CSP headers](https://github.com/summarizator/fora-frontend/commit/178b2821)

  </details>


### Bug Fixes

- [FORA-1456](https://foraday.atlassian.net/browse/FORA-1456): Can't use 3 dots on agenda control bar
  <details>
    <summary>Commits</summary>

    - [Move navigate logic to heading stack](https://github.com/summarizator/fora-frontend/commit/822912bb)

  </details>

## [0.5.224](https://github.com/summarizator/fora-frontend/compare/v0.5.223...v0.5.224) <span style="color: red;">[prod]</span>
> Mon, Apr 21 2025 | 11:11 AM EST

### Tasks

- [FORA-1454](https://foraday.atlassian.net/browse/FORA-1454): remove hardcoded limit on lenses from FE
  <details>
    <summary>Commits</summary>

    - [remove hard coded cap on lens creation](https://github.com/summarizator/fora-frontend/commit/4f021d7f)

  </details>


### Features

- [FORA-1390](https://foraday.atlassian.net/browse/FORA-1390): Summarize > Earnings Calls
  <details>
    <summary>Commits</summary>

    - [update tests](https://github.com/summarizator/fora-frontend/commit/cdd4b604)
    - [add earnings call modal to summarize menu, close on outside click](https://github.com/summarizator/fora-frontend/commit/1e2207f7)
    - [update `AddTickerModal` styles and copy, remove disabling outside click](https://github.com/summarizator/fora-frontend/commit/a934c6c5)
    - [update custom select shared styles](https://github.com/summarizator/fora-frontend/commit/d2ae4a52)
    - [fix calendar spacing](https://github.com/summarizator/fora-frontend/commit/c94791b7)

  </details>


### Bug Fixes

- [FORA-1449](https://foraday.atlassian.net/browse/FORA-1449): fix release process
  <details>
    <summary>Commits</summary>

    - [Manually bump version to 0.5.220](https://github.com/summarizator/fora-frontend/commit/bf213f29)

  </details>

## [0.5.218](https://github.com/summarizator/fora-frontend/compare/v0.5.217...v0.5.218) <span style="color: red;">[prod]</span>
> Mon, Apr 14 2025 | 10:47 AM EST

### Tasks

- [FORA-1332](https://foraday.atlassian.net/browse/FORA-1332): Clean Up Chakra Theming Setup
  <details>
    <summary>Commits</summary>

    - [revert show fullscreen chat](https://github.com/summarizator/fora-frontend/commit/bad061c8)
    - [Merge branch 'dev' of https://github.com/summarizator/fora-frontend into FORA-1332-chakra-cleanup](https://github.com/summarizator/fora-frontend/commit/358085cc)
    - [revert <List> removal](https://github.com/summarizator/fora-frontend/commit/603b378a)
    - [Final cleanup of detailed summary section](https://github.com/summarizator/fora-frontend/commit/e97679cd)
    - [fixed cards page detailed summary fully](https://github.com/summarizator/fora-frontend/commit/a0066fc9)
    - [removed auto-fullscreen that was happening unintentionally on chat component](https://github.com/summarizator/fora-frontend/commit/5269ef92)
    - [Design QA on insight card sources for Josh](https://github.com/summarizator/fora-frontend/commit/fef888f6)
    - [Fixed detailed summary on cards page markdown](https://github.com/summarizator/fora-frontend/commit/33fadc9b)
    - [fixed clear chat positioning and CTA styling](https://github.com/summarizator/fora-frontend/commit/250a7c9c)
    - [Merge branch 'dev' of https://github.com/summarizator/fora-frontend into FORA-1332-chakra-cleanup](https://github.com/summarizator/fora-frontend/commit/05abd56a)
    - [Fixes to border: base references](https://github.com/summarizator/fora-frontend/commit/9c3b8468)
    - [deleted form-elements-testbed since it was pulled into the component testing page](https://github.com/summarizator/fora-frontend/commit/81e95b07)
    - [minor clean](https://github.com/summarizator/fora-frontend/commit/1be37551)
    - [Added icon button section](https://github.com/summarizator/fora-frontend/commit/4876d1f4)
    - [Merge branch 'dev' of https://github.com/summarizator/fora-frontend into FORA-1332-chakra-cleanup](https://github.com/summarizator/fora-frontend/commit/294a1e97)
    - [Add Menu stuff to component testing before discussion with Josh](https://github.com/summarizator/fora-frontend/commit/001f8253)
    - [Updated buttons theming page before discussion with Josh.](https://github.com/summarizator/fora-frontend/commit/c9c1e960)
    - [Exclude component testing from sonar](https://github.com/summarizator/fora-frontend/commit/e4d9b1cf)
    - [Merge branch 'dev' of https://github.com/summarizator/fora-frontend into FORA-1332-chakra-cleanup](https://github.com/summarizator/fora-frontend/commit/354a4edb)
    - [add alert testing section and fixed test](https://github.com/summarizator/fora-frontend/commit/c29081de)
    - [minor sonar fix](https://github.com/summarizator/fora-frontend/commit/d62e5fbd)
    - [Updated default thick border token](https://github.com/summarizator/fora-frontend/commit/ad11c633)
    - [Updated all border theme references to use reskin default](https://github.com/summarizator/fora-frontend/commit/16643867)
    - [Added route guard check for component testing page](https://github.com/summarizator/fora-frontend/commit/90c1fcfc)
    - [minor improvement to palettes](https://github.com/summarizator/fora-frontend/commit/abf068bb)
    - [Add custom components section to component testing page](https://github.com/summarizator/fora-frontend/commit/8142793e)
    - [Refactored component testing page into more extensive setup to start working with Josh](https://github.com/summarizator/fora-frontend/commit/c9354065)
    - [Add palettes to component-testing page](https://github.com/summarizator/fora-frontend/commit/8022536a)
    - [removed last of gray, blue and black tokens. Added items to component testing page](https://github.com/summarizator/fora-frontend/commit/a1b9c4c3)
    - [Updated all red and gray instances to use reskin theming](https://github.com/summarizator/fora-frontend/commit/d955a8ea)
    - [component-ized high priority explanation](https://github.com/summarizator/fora-frontend/commit/05e1df64)
    - [Removed all blue color references. Removed all green color references. Removed all legacy yellow color references](https://github.com/summarizator/fora-frontend/commit/0218bb62)
    - [removed old instances of blue color theming and updated with new palettes](https://github.com/summarizator/fora-frontend/commit/b5962eb7)

  </details>

## [0.5.216](https://github.com/summarizator/fora-frontend/compare/v0.5.215...v0.5.216) <span style="color: red;">[prod]</span>
> Fri, Apr 11 2025 | 04:23 PM EST

### Features

- [FORA-1373](https://foraday.atlassian.net/browse/FORA-1373): Expose all timezones
  <details>
    <summary>Commits</summary>

    - [comments and tests (1)](https://github.com/summarizator/fora-frontend/commit/abd186ee)
    - [comments and tests](https://github.com/summarizator/fora-frontend/commit/4df73a94)
    - [switch tzs by converting all backend code names to iana](https://github.com/summarizator/fora-frontend/commit/79483ed8)
    - [page tests](https://github.com/summarizator/fora-frontend/commit/890039d1)
    - [query tests](https://github.com/summarizator/fora-frontend/commit/e082df9c)
    - [add codenames](https://github.com/summarizator/fora-frontend/commit/83137078)
    - [call `GET /types/timeZones` and list all timezones in email subscriptions](https://github.com/summarizator/fora-frontend/commit/94667778)

  </details>

## [0.5.214](https://github.com/summarizator/fora-frontend/compare/v0.5.213...v0.5.214) <span style="color: red;">[prod]</span>
> Fri, Apr 11 2025 | 11:47 AM EST

### Bug Fixes

- [FORA-1430](https://foraday.atlassian.net/browse/FORA-1430): Mobile - People and Org pages
  <details>
    <summary>Commits</summary>

    - ["view top 15" button styling](https://github.com/summarizator/fora-frontend/commit/c9c109bf)
    - [keep org chart button](https://github.com/summarizator/fora-frontend/commit/9154e220)
    - [Merge branch 'dev' into FORA-1430-Mobile-People-and-Org-pages](https://github.com/summarizator/fora-frontend/commit/3d11c672)
    - [comment](https://github.com/summarizator/fora-frontend/commit/471378e7)
    - [Update src/components/person/new-person-card-header.component.jsx](https://github.com/summarizator/fora-frontend/commit/71b6b90b)
    - [mobile organization page improvements](https://github.com/summarizator/fora-frontend/commit/68ef9d0f)
    - [chore: update changelog and related files](https://github.com/summarizator/fora-frontend/commit/5494b9c8)
    - [chore: release 0.5.210](https://github.com/summarizator/fora-frontend/commit/ab0c8e67)
    - [Add logic to enable zoom cloud recording (feature flag) (#1355)](https://github.com/summarizator/fora-frontend/commit/c915f9ba)
    - [Merge branch 'app' into 'dev' [skip post-merge-dev]](https://github.com/summarizator/fora-frontend/commit/a6e59b8f)

  </details>

## [0.5.212](https://github.com/summarizator/fora-frontend/compare/v0.5.211...v0.5.212) <span style="color: red;">[prod]</span>
> Fri, Apr 11 2025 | 10:41 AM EST

## [0.5.211](https://github.com/summarizator/fora-frontend/compare/v0.5.210...v0.5.211) <span style="color: red;">[prod]</span>
> Thu, Apr 10 2025 | 04:58 PM EST

### Features

- [FORA-1376](https://foraday.atlassian.net/browse/FORA-1376): Zoom Cloud Recording 
  <details>
    <summary>Commits</summary>

    - [Remove release-dev GH action](https://github.com/summarizator/fora-frontend/commit/769117d6)
    - [Address PR comments](https://github.com/summarizator/fora-frontend/commit/4100200b)
    - [Add logic to enable zoom cloud recording (feature flag)](https://github.com/summarizator/fora-frontend/commit/6b63d180)

  </details>

## [0.5.209](https://github.com/summarizator/fora-frontend/compare/v0.5.208...v0.5.209) <span style="color: red;">[prod]</span>
> Thu, Apr 10 2025 | 04:30 PM EST

## [0.5.208](https://github.com/summarizator/fora-frontend/compare/v0.5.207...v0.5.208) <span style="color: red;">[prod]</span>
> Thu, Apr 10 2025 | 03:02 PM EST

### Features

- [FORA-1288](https://foraday.atlassian.net/browse/FORA-1288): Fix release_notes / changelog script
  <details>
    <summary>Commits</summary>

    - [Rename to release:dev](https://github.com/summarizator/fora-frontend/commit/3115746a)
    - [Change to branch app](https://github.com/summarizator/fora-frontend/commit/29658473)
    - [update prod changelog flow](https://github.com/summarizator/fora-frontend/commit/9a0860a6)

  </details>


### Bug Fixes

- [FORA-1422](https://foraday.atlassian.net/browse/FORA-1422): Add skip to tests
  <details>
    <summary>Commits</summary>

    - [Add post-merge-app workflow](https://github.com/summarizator/fora-frontend/commit/a2435e9e)
    - [Skip broken tests for now](https://github.com/summarizator/fora-frontend/commit/a135e9f6)

  </details>

## [0.5.205](https://github.com/summarizator/fora-frontend/compare/v0.5.204...v0.5.205) <span style="color: red;">[prod]</span>
> Tue, Apr 8 2025 | 05:15 PM EST

### Tasks

- [FORA-1377](https://foraday.atlassian.net/browse/FORA-1377): put inner monologue into meeting chat
  <details>
    <summary>Commits</summary>

    - [ignore test that will soon be rewritten](https://github.com/summarizator/fora-frontend/commit/1597b2f7)
    - [merge in dev](https://github.com/summarizator/fora-frontend/commit/c417573e)
    - [move chat popup from 10 to 8](https://github.com/summarizator/fora-frontend/commit/c53e7de1)
    - [Merge branch 'dev' of github.com:summarizator/fora-frontend into FORA-1377-inner-monologue-chat](https://github.com/summarizator/fora-frontend/commit/ba9c1005)
    - [address pr comments](https://github.com/summarizator/fora-frontend/commit/75bcb892)
    - [split out components with tests](https://github.com/summarizator/fora-frontend/commit/9c176aae)
    - [fix tests more](https://github.com/summarizator/fora-frontend/commit/aa8f5aa5)
    - [fix tests](https://github.com/summarizator/fora-frontend/commit/89c9bcb6)
    - [merge from latest](https://github.com/summarizator/fora-frontend/commit/c18c27a7)
    - [checkpoint - better loading with chain-of-thought](https://github.com/summarizator/fora-frontend/commit/16521c9e)
    - [show/hide via brain icon](https://github.com/summarizator/fora-frontend/commit/66db6379)
    - [lots of progress](https://github.com/summarizator/fora-frontend/commit/3e413573)
    - [janky chain of thought experience!](https://github.com/summarizator/fora-frontend/commit/05036cdc)

  </details>


### Features

- [FORA-1406](https://foraday.atlassian.net/browse/FORA-1406): Salesforce information for People data.
  <details>
    <summary>Commits</summary>

    - [minor: clean](https://github.com/summarizator/fora-frontend/commit/e779c400)
    - [rename salesforce-related items to Contact for clarity on different contact sources.](https://github.com/summarizator/fora-frontend/commit/10e2ee8b)
    - [Changed all salesforcelogo instances to icons for consistency](https://github.com/summarizator/fora-frontend/commit/142f18ae)
    - [Updated tests for salesforce data](https://github.com/summarizator/fora-frontend/commit/30a97fa4)
    - [add salesforce logo option to PersonPreview component instances. Added logo to meeting details and agenda pages. Add salesforce profile fetching to populateMeetingAttendees logic](https://github.com/summarizator/fora-frontend/commit/e9f4b2c5)
    - [minor: test fix](https://github.com/summarizator/fora-frontend/commit/be2e2ada)
    - [Added salesforce logic to NewPersonCard and updated tests](https://github.com/summarizator/fora-frontend/commit/d3820ca6)
    - [Add contacts query service. Remove old referenced card components. Added apollo logo. Updated some items to new designs on people page](https://github.com/summarizator/fora-frontend/commit/5afa97f4)

  </details>

## [0.5.202](https://github.com/summarizator/fora-frontend/compare/v0.5.201...v0.5.202) <span style="color: red;">[prod]</span>
> Mon, Apr 7 2025 | 04:43 PM EST

## [0.5.201](https://github.com/summarizator/fora-frontend/compare/v0.5.200...v0.5.201) <span style="color: red;">[prod]</span>
> Fri, Apr 4 2025 | 09:46 AM EST

## [0.5.200](https://github.com/summarizator/fora-frontend/compare/v0.5.199...v0.5.200) <span style="color: red;">[prod]</span>
> Tue, Apr 1 2025 | 05:57 PM EST

### Tasks

- [FORA-1403](https://foraday.atlassian.net/browse/FORA-1403): Remove useCardById from ReskinInsightCard
  <details>
    <summary>Commits</summary>

    - [Removed useCardById from insights search on home page](https://github.com/summarizator/fora-frontend/commit/975ba589)

  </details>


### Bug Fixes

- [FORA-1397](https://foraday.atlassian.net/browse/FORA-1397): Meeting Timeline Not Appearing on Earnings Calls
  <details>
    <summary>Commits</summary>

    - [Fixed bugged timeline component. Added test case to ensure this doesn't occur again. Fixed tests to remove redundancies, mock data correctly, and added more meaningful test cases](https://github.com/summarizator/fora-frontend/commit/f84a2d3f)

  </details>


### Features

- [FORA-1259](https://foraday.atlassian.net/browse/FORA-1259): Company Page - Org chart
  <details>
    <summary>Commits</summary>

    - [`reskinLink`](https://github.com/summarizator/fora-frontend/commit/38cc99b7)
    - [rename `isCEO` to `isRootPerson`](https://github.com/summarizator/fora-frontend/commit/6eda37af)
    - [`as`,`target` props are not applied from the variant](https://github.com/summarizator/fora-frontend/commit/3a4c3c9f)
    - [CEO exclusive view](https://github.com/summarizator/fora-frontend/commit/190b59a5)
    - [create 'linkButton' variant and replace new button props](https://github.com/summarizator/fora-frontend/commit/a3266b5b)
    - [user org chart on company page](https://github.com/summarizator/fora-frontend/commit/27015d18)

  </details>

## [0.5.196](https://github.com/summarizator/fora-frontend/compare/v0.5.195...v0.5.196) <span style="color: red;">[prod]</span>
> Mon, Mar 31 2025 | 06:29 PM EST

### Features

- [FORA-1283](https://foraday.atlassian.net/browse/FORA-1283): Lens create/edit page filters to include/exclude earnings call
  <details>
    <summary>Commits</summary>

    - [Test fixes for sub source defaults](https://github.com/summarizator/fora-frontend/commit/91074b12)
    - [Merge branch 'dev' of https://github.com/summarizator/fora-frontend into FORA-1283-lens-earnings-call-filter](https://github.com/summarizator/fora-frontend/commit/236ded92)
    - [Fix isViewOnlyMode disabled](https://github.com/summarizator/fora-frontend/commit/b831b28d)
    - [Updated default behavior for sub_sources from lens_config](https://github.com/summarizator/fora-frontend/commit/019aafcb)
    - [minor readability improvement](https://github.com/summarizator/fora-frontend/commit/a2ef0394)
    - [Merge branch 'dev' of https://github.com/summarizator/fora-frontend into FORA-1283-lens-earnings-call-filter](https://github.com/summarizator/fora-frontend/commit/40056a8b)
    - [Updated default sub_sources on creation to not include Earnings_Call](https://github.com/summarizator/fora-frontend/commit/8ea2891a)
    - [remove '.only' describe in lens tests](https://github.com/summarizator/fora-frontend/commit/675d0659)
    - [Fixed lens hook tests and added case for sub sources](https://github.com/summarizator/fora-frontend/commit/f238da59)
    - [Added contentType filter tests](https://github.com/summarizator/fora-frontend/commit/0679333d)
    - [Merge branch 'dev' of https://github.com/summarizator/fora-frontend into FORA-1283-lens-earnings-call-filter](https://github.com/summarizator/fora-frontend/commit/0e5d1a1f)
    - [Fixed lens icon placement issue. Updated patchLens functionality to handle filters a little better, along with sub_sources. Removed right rail CTA](https://github.com/summarizator/fora-frontend/commit/516ac80c)
    - [Added BE model => form conversion for sub_source values. Updated tests](https://github.com/summarizator/fora-frontend/commit/2d75323b)
    - [Fixed styling on create lens right rail to match updated design](https://github.com/summarizator/fora-frontend/commit/53c290e0)
    - [Added form invalidation to content type fields and retroactively to other required fields](https://github.com/summarizator/fora-frontend/commit/a067e658)
    - [Merge branch 'dev' of https://github.com/summarizator/fora-frontend into FORA-1283-lens-earnings-call-filter](https://github.com/summarizator/fora-frontend/commit/8d3eefab)
    - [Changed folder name for clarity](https://github.com/summarizator/fora-frontend/commit/9ed4b3c9)
    - [Added content type filter to create lens form. Reorganized form section components in create lens form to be in separate files](https://github.com/summarizator/fora-frontend/commit/28c27ada)
    - [minor readability improvement](https://github.com/summarizator/fora-frontend/commit/a2ef0394)
    - [Merge branch 'dev' of https://github.com/summarizator/fora-frontend into FORA-1283-lens-earnings-call-filter](https://github.com/summarizator/fora-frontend/commit/40056a8b)
    - [Updated default sub_sources on creation to not include Earnings_Call](https://github.com/summarizator/fora-frontend/commit/8ea2891a)
    - [remove '.only' describe in lens tests](https://github.com/summarizator/fora-frontend/commit/675d0659)
    - [Fixed lens hook tests and added case for sub sources](https://github.com/summarizator/fora-frontend/commit/f238da59)
    - [Added contentType filter tests](https://github.com/summarizator/fora-frontend/commit/0679333d)
    - [Merge branch 'dev' of https://github.com/summarizator/fora-frontend into FORA-1283-lens-earnings-call-filter](https://github.com/summarizator/fora-frontend/commit/0e5d1a1f)
    - [Fixed lens icon placement issue. Updated patchLens functionality to handle filters a little better, along with sub_sources. Removed right rail CTA](https://github.com/summarizator/fora-frontend/commit/516ac80c)
    - [Added BE model => form conversion for sub_source values. Updated tests](https://github.com/summarizator/fora-frontend/commit/2d75323b)
    - [Fixed styling on create lens right rail to match updated design](https://github.com/summarizator/fora-frontend/commit/53c290e0)
    - [Added form invalidation to content type fields and retroactively to other required fields](https://github.com/summarizator/fora-frontend/commit/a067e658)
    - [Merge branch 'dev' of https://github.com/summarizator/fora-frontend into FORA-1283-lens-earnings-call-filter](https://github.com/summarizator/fora-frontend/commit/8d3eefab)
    - [Changed folder name for clarity](https://github.com/summarizator/fora-frontend/commit/9ed4b3c9)
    - [Added content type filter to create lens form. Reorganized form section components in create lens form to be in separate files](https://github.com/summarizator/fora-frontend/commit/28c27ada)

  </details>

- [FORA-1253](https://foraday.atlassian.net/browse/FORA-1253): Company Page - Recent Summaries
  <details>
    <summary>Commits</summary>

    - [fix mobile organization page tests](https://github.com/summarizator/fora-frontend/commit/5f1edd23)
    - [recent meeting summaries - mobile](https://github.com/summarizator/fora-frontend/commit/7180f5f9)
    - [recent summaries company page](https://github.com/summarizator/fora-frontend/commit/469bcff3)

  </details>


### Tasks

- [FORA-1385](https://foraday.atlassian.net/browse/FORA-1385): Remove `useChannelById` and Related Logic from `ReskinSummaryCardFooter`
  <details>
    <summary>Commits</summary>

    - [Remove useChannelById and related channel/digest logic in the feed card footer](https://github.com/summarizator/fora-frontend/commit/c096bd89)

  </details>

## [0.5.191](https://github.com/summarizator/fora-frontend/compare/v0.5.190...v0.5.191) <span style="color: red;">[prod]</span>
> Fri, Mar 28 2025 | 10:45 AM EST

### Bug Fixes

- [FORA-1386](https://foraday.atlassian.net/browse/FORA-1386): Hide zoom settings page from non FORA tenant
  <details>
    <summary>Commits</summary>

    - [Fix test](https://github.com/summarizator/fora-frontend/commit/69786ee4)
    - [Create new gate for zoom-settings-page (remove meeting upload from gate)](https://github.com/summarizator/fora-frontend/commit/52b70230)

  </details>


### Features

- [FORA-1284](https://foraday.atlassian.net/browse/FORA-1284): 2. Prior Earnings calls 
  <details>
    <summary>Commits</summary>

    - [cleanup](https://github.com/summarizator/fora-frontend/commit/47f67dbb)
    - [cleanup](https://github.com/summarizator/fora-frontend/commit/10923d1b)
    - [Merge branch 'dev' into FORA-1284-2.-Prior-Earnings-calls](https://github.com/summarizator/fora-frontend/commit/d9c3a7cf)
    - [rm stub data since we have example now](https://github.com/summarizator/fora-frontend/commit/db8ecd81)
    - [sonar dupe issues?](https://github.com/summarizator/fora-frontend/commit/092fc5c5)
    - [sonar issues](https://github.com/summarizator/fora-frontend/commit/164646b5)
    - [start of comments](https://github.com/summarizator/fora-frontend/commit/c9433372)
    - [rm dates](https://github.com/summarizator/fora-frontend/commit/55cd9a53)
    - [tests](https://github.com/summarizator/fora-frontend/commit/c0c71270)
    - [tests](https://github.com/summarizator/fora-frontend/commit/6ced883b)
    - [tests](https://github.com/summarizator/fora-frontend/commit/71160460)
    - [Merge branch 'dev' into FORA-1284-2.-Prior-Earnings-calls](https://github.com/summarizator/fora-frontend/commit/7ef741c7)
    - [some stub data easy to flip](https://github.com/summarizator/fora-frontend/commit/7f0c4da3)
    - [last AC](https://github.com/summarizator/fora-frontend/commit/73212e47)
    - [wire back up](https://github.com/summarizator/fora-frontend/commit/1837793d)
    - [view all wired](https://github.com/summarizator/fora-frontend/commit/fe85a3a1)
    - [empty state](https://github.com/summarizator/fora-frontend/commit/5e44f21c)
    - [wire up section](https://github.com/summarizator/fora-frontend/commit/1b7ecdb4)
    - [styles](https://github.com/summarizator/fora-frontend/commit/ebaf06a7)
    - [support trunc](https://github.com/summarizator/fora-frontend/commit/3099bef7)
    - [closer](https://github.com/summarizator/fora-frontend/commit/e62f36b5)
    - [start of listing](https://github.com/summarizator/fora-frontend/commit/a9cee771)
    - [get it back](https://github.com/summarizator/fora-frontend/commit/5ab06d24)
    - [fallback](https://github.com/summarizator/fora-frontend/commit/053d43de)
    - [font cleanup](https://github.com/summarizator/fora-frontend/commit/d8b8dcd7)
    - [font cleanup](https://github.com/summarizator/fora-frontend/commit/08459071)
    - [naming cleanup](https://github.com/summarizator/fora-frontend/commit/a2e8ddd6)
    - [Merge remote-tracking branch 'origin/FORA-1305-earnings-call-navigation-bar' into FORA-1284-2.-Prior-Earnings-calls](https://github.com/summarizator/fora-frontend/commit/f6df92da)
    - [Fixed retroactive test breaks](https://github.com/summarizator/fora-frontend/commit/05d14495)
    - [Rename 'meeting-pdf' dir to 'pdf' to allow for more stuff](https://github.com/summarizator/fora-frontend/commit/2bc6a1f5)
    - [Added earnings call shareCard functionality. Consolidated summary components across meetings and earnings calls](https://github.com/summarizator/fora-frontend/commit/f7190a81)
    - [Broke out Meeting-PDF into multiple components and added Earnings Call PDF download.](https://github.com/summarizator/fora-frontend/commit/93dbae4e)
    - [Abstracted share modal functionality to shared components and moved functionality into more clear places](https://github.com/summarizator/fora-frontend/commit/a64b3ac6)
    - [Started on more generic share modal to be used across earnings calls and meetings](https://github.com/summarizator/fora-frontend/commit/4ca3485e)
    - [Merge branch 'dev' of https://github.com/summarizator/fora-frontend into FORA-1305-earnings-call-navigation-bar](https://github.com/summarizator/fora-frontend/commit/b5188995)
    - [minor: icon sizing and undefined property fixes](https://github.com/summarizator/fora-frontend/commit/ff773ff0)
    - [Reorganize  earnings call page subcomponents. Add transcript menu item and privacy label](https://github.com/summarizator/fora-frontend/commit/37c4bfbf)
    - [added category modal to earnings call navigation bar](https://github.com/summarizator/fora-frontend/commit/a3659291)
    - [Merge branch 'dev' of https://github.com/summarizator/fora-frontend into FORA-1303-earnings-call-right-rail](https://github.com/summarizator/fora-frontend/commit/ff4b3360)
    - [retroactive test fix](https://github.com/summarizator/fora-frontend/commit/ea02d318)
    - [removed unused section component props. Fixed tests for earnings-call page. Added tests for right r ail](https://github.com/summarizator/fora-frontend/commit/6f7eb026)
    - [Fix to scroll position listener](https://github.com/summarizator/fora-frontend/commit/d04fb288)
    - [added feature to apolloOrgsByDomains function to set query data for matching orgs by ids](https://github.com/summarizator/fora-frontend/commit/f31d2d6e)
    - [Removed 'getQuarterStartDate backup func](https://github.com/summarizator/fora-frontend/commit/3832019e)
    - [Add check for released_at property to earningsCallDate](https://github.com/summarizator/fora-frontend/commit/6215a22e)
    - [Add fallback state when apollo organization isn't available](https://github.com/summarizator/fora-frontend/commit/895dbbcf)
    - [Refactored document scroll listener functions to go through one hook. Added organization link to earnings calls. Added 'closest scrolled section' to earnings call page](https://github.com/summarizator/fora-frontend/commit/8f277fd8)
    - [Reverted individual instance accordion table props and made default instead](https://github.com/summarizator/fora-frontend/commit/7709eef8)
    - [add earnings call right rail section](https://github.com/summarizator/fora-frontend/commit/ae8cc95f)

  </details>

- [FORA-1378](https://foraday.atlassian.net/browse/FORA-1378): Sharing Earnings call via email
  <details>
    <summary>Commits</summary>

    - [share earnings without web option](https://github.com/summarizator/fora-frontend/commit/d564689e)

  </details>

## [0.5.187](https://github.com/summarizator/fora-frontend/compare/v0.5.186...v0.5.187) <span style="color: red;">[prod]</span>
> Wed, Mar 26 2025 | 06:07 PM EST

### Features

- [FORA-1305](https://foraday.atlassian.net/browse/FORA-1305): 1.Earnings call detail page - Navigation bar
  <details>
    <summary>Commits</summary>

    - [hide earnings call share modal](https://github.com/summarizator/fora-frontend/commit/7904e6e8)
    - [Minor clean for PR](https://github.com/summarizator/fora-frontend/commit/be01c45b)
    - [Merge branch 'dev' of https://github.com/summarizator/fora-frontend into FORA-1305-earnings-call-navigation-bar](https://github.com/summarizator/fora-frontend/commit/420ffd59)
    - [Merge branch 'dev' of https://github.com/summarizator/fora-frontend into FORA-1305-earnings-call-navigation-bar](https://github.com/summarizator/fora-frontend/commit/206765e4)
    - [removed notes](https://github.com/summarizator/fora-frontend/commit/3672aef0)
    - [Merge branch 'dev' of https://github.com/summarizator/fora-frontend into FORA-1305-earnings-call-navigation-bar](https://github.com/summarizator/fora-frontend/commit/b48022b4)
    - [Cleaned up PDF components](https://github.com/summarizator/fora-frontend/commit/e707e6f6)
    - [Added tests to share earnings call modal](https://github.com/summarizator/fora-frontend/commit/b5cc0998)
    - [Add test cases for share-meeting-modal.component.test.jsx](https://github.com/summarizator/fora-frontend/commit/97eb2e89)
    - [Add tests to share-summary component](https://github.com/summarizator/fora-frontend/commit/a12d7298)
    - [Fixed retroactive test breaks](https://github.com/summarizator/fora-frontend/commit/05d14495)
    - [Rename 'meeting-pdf' dir to 'pdf' to allow for more stuff](https://github.com/summarizator/fora-frontend/commit/2bc6a1f5)
    - [Added earnings call shareCard functionality. Consolidated summary components across meetings and earnings calls](https://github.com/summarizator/fora-frontend/commit/f7190a81)
    - [Broke out Meeting-PDF into multiple components and added Earnings Call PDF download.](https://github.com/summarizator/fora-frontend/commit/93dbae4e)
    - [Abstracted share modal functionality to shared components and moved functionality into more clear places](https://github.com/summarizator/fora-frontend/commit/a64b3ac6)
    - [Started on more generic share modal to be used across earnings calls and meetings](https://github.com/summarizator/fora-frontend/commit/4ca3485e)
    - [Merge branch 'dev' of https://github.com/summarizator/fora-frontend into FORA-1305-earnings-call-navigation-bar](https://github.com/summarizator/fora-frontend/commit/b5188995)
    - [minor: icon sizing and undefined property fixes](https://github.com/summarizator/fora-frontend/commit/ff773ff0)
    - [Reorganize  earnings call page subcomponents. Add transcript menu item and privacy label](https://github.com/summarizator/fora-frontend/commit/37c4bfbf)
    - [added category modal to earnings call navigation bar](https://github.com/summarizator/fora-frontend/commit/a3659291)
    - [Merge branch 'dev' of https://github.com/summarizator/fora-frontend into FORA-1303-earnings-call-right-rail](https://github.com/summarizator/fora-frontend/commit/ff4b3360)
    - [retroactive test fix](https://github.com/summarizator/fora-frontend/commit/ea02d318)
    - [removed unused section component props. Fixed tests for earnings-call page. Added tests for right r ail](https://github.com/summarizator/fora-frontend/commit/6f7eb026)
    - [Fix to scroll position listener](https://github.com/summarizator/fora-frontend/commit/d04fb288)
    - [added feature to apolloOrgsByDomains function to set query data for matching orgs by ids](https://github.com/summarizator/fora-frontend/commit/f31d2d6e)
    - [Removed 'getQuarterStartDate backup func](https://github.com/summarizator/fora-frontend/commit/3832019e)
    - [Add check for released_at property to earningsCallDate](https://github.com/summarizator/fora-frontend/commit/6215a22e)
    - [Add fallback state when apollo organization isn't available](https://github.com/summarizator/fora-frontend/commit/895dbbcf)
    - [Refactored document scroll listener functions to go through one hook. Added organization link to earnings calls. Added 'closest scrolled section' to earnings call page](https://github.com/summarizator/fora-frontend/commit/8f277fd8)
    - [Reverted individual instance accordion table props and made default instead](https://github.com/summarizator/fora-frontend/commit/7709eef8)
    - [add earnings call right rail section](https://github.com/summarizator/fora-frontend/commit/ae8cc95f)

  </details>

## [0.5.184](https://github.com/summarizator/fora-frontend/compare/v0.5.183...v0.5.184) <span style="color: red;">[prod]</span>
> Tue, Mar 25 2025 | 05:36 PM EST

### Features

- [FORA-1251](https://foraday.atlassian.net/browse/FORA-1251): Right Rail - Summaries source Count
  <details>
    <summary>Commits</summary>

    - [sonar](https://github.com/summarizator/fora-frontend/commit/3cadda91)
    - [tests](https://github.com/summarizator/fora-frontend/commit/8a617beb)
    - [people hooks test](https://github.com/summarizator/fora-frontend/commit/beb02270)
    - [Merge branch 'dev' into FORA-1251-Right-Rail-Summaries-source-Count](https://github.com/summarizator/fora-frontend/commit/2b95b8aa)
    - [new-person-card and organization page tests](https://github.com/summarizator/fora-frontend/commit/05ac6e56)
    - [remove decodeObjectFields and relevant logic around `meeting.domains`](https://github.com/summarizator/fora-frontend/commit/49a311c5)
    - [update right rail conditional rendering logic](https://github.com/summarizator/fora-frontend/commit/c25b09f2)
    - [Update src/util/hooks/people.hooks.js](https://github.com/summarizator/fora-frontend/commit/51d5634f)
    - [loading => initialloading](https://github.com/summarizator/fora-frontend/commit/cb49622f)
    - [zoom logo img props](https://github.com/summarizator/fora-frontend/commit/c1f707eb)
    - [qa items](https://github.com/summarizator/fora-frontend/commit/06bea61d)
    - [company fallback icon in headers, hide right rail if no data to show](https://github.com/summarizator/fora-frontend/commit/59f726a7)
    - [company right rail](https://github.com/summarizator/fora-frontend/commit/6e503df2)

  </details>

## [0.5.182](https://github.com/summarizator/fora-frontend/compare/v0.5.181...v0.5.182) <span style="color: red;">[prod]</span>
> Mon, Mar 24 2025 | 05:37 PM EST

### Bug Fixes

- [FORA-1328](https://foraday.atlassian.net/browse/FORA-1328): Handle rogue chat paging
  <details>
    <summary>Commits</summary>

    - [fix test](https://github.com/summarizator/fora-frontend/commit/f577915e)
    - [address pr comments and solidify logic a bit](https://github.com/summarizator/fora-frontend/commit/bd3ef8da)
    - [resolve rogue paging issue with react query!](https://github.com/summarizator/fora-frontend/commit/72019014)

  </details>


### Features

- [FORA-1303](https://foraday.atlassian.net/browse/FORA-1303): 1.Earnings call detail page - Right rail
  <details>
    <summary>Commits</summary>

    - [retroactive test fix](https://github.com/summarizator/fora-frontend/commit/ea02d318)
    - [removed unused section component props. Fixed tests for earnings-call page. Added tests for right r ail](https://github.com/summarizator/fora-frontend/commit/6f7eb026)
    - [Fix to scroll position listener](https://github.com/summarizator/fora-frontend/commit/d04fb288)
    - [added feature to apolloOrgsByDomains function to set query data for matching orgs by ids](https://github.com/summarizator/fora-frontend/commit/f31d2d6e)
    - [Removed 'getQuarterStartDate backup func](https://github.com/summarizator/fora-frontend/commit/3832019e)
    - [Add check for released_at property to earningsCallDate](https://github.com/summarizator/fora-frontend/commit/6215a22e)
    - [Add fallback state when apollo organization isn't available](https://github.com/summarizator/fora-frontend/commit/895dbbcf)
    - [Refactored document scroll listener functions to go through one hook. Added organization link to earnings calls. Added 'closest scrolled section' to earnings call page](https://github.com/summarizator/fora-frontend/commit/8f277fd8)
    - [Reverted individual instance accordion table props and made default instead](https://github.com/summarizator/fora-frontend/commit/7709eef8)
    - [add earnings call right rail section](https://github.com/summarizator/fora-frontend/commit/ae8cc95f)

  </details>

## [0.5.179](https://github.com/summarizator/fora-frontend/compare/v0.5.178...v0.5.179) <span style="color: red;">[prod]</span>
> Thu, Mar 20 2025 | 04:10 PM EST

### Features

- [FORA-1277](https://foraday.atlassian.net/browse/FORA-1277): [RECENT] Earnings call filter on Recent page
  <details>
    <summary>Commits</summary>

    - [Merge branch 'dev' into FORA-1277-RECENT-Earnings-call-filter-on-Recent-page](https://github.com/summarizator/fora-frontend/commit/d7cb417d)
    - [start of implementation](https://github.com/summarizator/fora-frontend/commit/95c35d1a)
    - [fix nesting issue](https://github.com/summarizator/fora-frontend/commit/96144275)
    - [Merge remote-tracking branch 'origin/FORA-1279-earnings-call-details' into FORA-1277-RECENT-Earnings-call-filter-on-Recent-page](https://github.com/summarizator/fora-frontend/commit/78f69c02)
    - [made topics accordion more compact to match designs](https://github.com/summarizator/fora-frontend/commit/4f18c6aa)
    - [fixed recent page link to earnings calls page](https://github.com/summarizator/fora-frontend/commit/bb3c25b5)
    - [Merge branch 'dev' of https://github.com/summarizator/fora-frontend into FORA-1279-earnings-call-details](https://github.com/summarizator/fora-frontend/commit/f42a0a74)
    - [Moved getQuarterStartDate to datetime.helpers, added tests, and fixed argument order issue](https://github.com/summarizator/fora-frontend/commit/d4a14b2b)
    - [trimmed down fixture file](https://github.com/summarizator/fora-frontend/commit/3cb8fdb9)
    - [Added eranings-call page tests](https://github.com/summarizator/fora-frontend/commit/57fe97a5)
    - [mock tests fix](https://github.com/summarizator/fora-frontend/commit/781e3999)
    - [Added skeleton loader to page](https://github.com/summarizator/fora-frontend/commit/c3ea0288)
    - [Cleaned up template, checked merge changes on earnings calls page](https://github.com/summarizator/fora-frontend/commit/73bc0266)
    - [Merge branch 'dev' into FORA-1279-earnings-call-details](https://github.com/summarizator/fora-frontend/commit/972634fb)
    - [organized components, turned off video button for earnings calls, minor import clean](https://github.com/summarizator/fora-frontend/commit/1f6bd689)
    - [Add parseRawTranscript unit test along with fixtures folder for larger mocks](https://github.com/summarizator/fora-frontend/commit/06be6315)
    - [Added date fetching from fmp for the earnings call page.](https://github.com/summarizator/fora-frontend/commit/1d6a13d6)
    - [Renamed DetailedSummary to MeetingSummary to differentiate from DetailedSummarySection that only exists on Cards page and YourSummary](https://github.com/summarizator/fora-frontend/commit/43a1a043)
    - [Fix undefined meeting in custom summary menu](https://github.com/summarizator/fora-frontend/commit/c051f418)
    - [Added subSource to SourceLogo component for earnings calls. Replaced all instances of card stack styling with layerStyle='section-card'. Fixed issue with undefined text in cards page. Started bringing all instances of DetailedSummary to parity and to support new design](https://github.com/summarizator/fora-frontend/commit/60b8b7a1)
    - [Deleted unused feedback-modal and pdf-specific components](https://github.com/summarizator/fora-frontend/commit/b2a7969f)
    - [Deprecate unused card-structure and lens insight components](https://github.com/summarizator/fora-frontend/commit/3ca18d4c)
    - [remove deprecated summary card subcomponents and old earningscall icon](https://github.com/summarizator/fora-frontend/commit/e09283ad)
    - [Remove deprecated summary-card component, meeting-pdf page. Updated sourceLogo and reskin card source text to account for earnings calls](https://github.com/summarizator/fora-frontend/commit/8ed3b072)
    - [Removed redundant meeting header information from each individual page section](https://github.com/summarizator/fora-frontend/commit/c52c5706)
    - [Updated Heading default fontWeight to 600 and updated instances across the board. Removed any redundant fontweight={600} props on instances as well. Added meeting timeline to earnings call page, and reorganized component structure in src/components/meeting](https://github.com/summarizator/fora-frontend/commit/7219adc7)
    - [Add earnings call page. Add larger page foundation with loose versions of header and card](https://github.com/summarizator/fora-frontend/commit/8ac60ecb)

  </details>


### Bug Fixes

- [FORA-1360](https://foraday.atlassian.net/browse/FORA-1360): fix email summary displaying Slack icon on insight page
  <details>
    <summary>Commits</summary>

    - [fix test by fixing code](https://github.com/summarizator/fora-frontend/commit/1e5319c4)
    - [Merge branch 'dev' of https://github.com/summarizator/fora-frontend into FORA-1360-email-icon](https://github.com/summarizator/fora-frontend/commit/30b3d9b7)
    - [address pr comments](https://github.com/summarizator/fora-frontend/commit/dce0f2e3)
    - [Merge branch 'FORA-1360-email-icon' of https://github.com/summarizator/fora-frontend into FORA-1360-email-icon](https://github.com/summarizator/fora-frontend/commit/91107165)
    - [Merge branch 'dev' of https://github.com/summarizator/fora-frontend into FORA-1360-email-icon](https://github.com/summarizator/fora-frontend/commit/c5106861)
    - [Update src/components/lens/generic-insight-panel.component.jsx](https://github.com/summarizator/fora-frontend/commit/777eaa0d)
    - [support email icon in lens insight sources](https://github.com/summarizator/fora-frontend/commit/308ae3f5)

  </details>

- [FORA-1365](https://foraday.atlassian.net/browse/FORA-1365): custom summary templates appearing in lens insights section of meeting page
  <details>
    <summary>Commits</summary>

    - [remove custom summary template insights from home page vecause i noticed it](https://github.com/summarizator/fora-frontend/commit/b65279da)
    - [remove code that was pushing the newly generating card into the insights section for some reason](https://github.com/summarizator/fora-frontend/commit/6df23994)

  </details>


### Tasks

- [FORA-1017](https://foraday.atlassian.net/browse/FORA-1017): add FE support for outage message
  <details>
    <summary>Commits</summary>

    - [add mobile view](https://github.com/summarizator/fora-frontend/commit/695a4744)
    - [test and refactor](https://github.com/summarizator/fora-frontend/commit/2a3f6da4)
    - [get and set from localstorage](https://github.com/summarizator/fora-frontend/commit/4f627795)
    - [consider me a react query believer](https://github.com/summarizator/fora-frontend/commit/1e3746ae)
    - [Merge branch 'dev' of https://github.com/summarizator/fora-frontend into FORA-1017-outage-message](https://github.com/summarizator/fora-frontend/commit/d5d83af9)
    - [add outage message!!!](https://github.com/summarizator/fora-frontend/commit/c12735d9)

  </details>

- [FORA-1367](https://foraday.atlassian.net/browse/FORA-1367): put high priority stuff behind feature flag
  <details>
    <summary>Commits</summary>

    - [fix test](https://github.com/summarizator/fora-frontend/commit/1c7c38ba)
    - [add feature flag for high priority alerts](https://github.com/summarizator/fora-frontend/commit/44c29f82)

  </details>

## [0.5.173](https://github.com/summarizator/fora-frontend/compare/v0.5.172...v0.5.173) <span style="color: red;">[prod]</span>
> Wed, Mar 19 2025 | 06:23 PM EST

### Features

- [FORA-1309](https://foraday.atlassian.net/browse/FORA-1309): Design qa changes for Lens Insights page
  <details>
    <summary>Commits</summary>

    - [design tweaks](https://github.com/summarizator/fora-frontend/commit/1bcaeb4f)
    - [design tweaks](https://github.com/summarizator/fora-frontend/commit/925a4ff5)

  </details>

- [FORA-1279](https://foraday.atlassian.net/browse/FORA-1279): 1.Earnings call detail page - different sections - splitting page
  <details>
    <summary>Commits</summary>

    - [made topics accordion more compact to match designs](https://github.com/summarizator/fora-frontend/commit/4f18c6aa)
    - [fixed recent page link to earnings calls page](https://github.com/summarizator/fora-frontend/commit/bb3c25b5)
    - [Merge branch 'dev' of https://github.com/summarizator/fora-frontend into FORA-1279-earnings-call-details](https://github.com/summarizator/fora-frontend/commit/f42a0a74)
    - [Moved getQuarterStartDate to datetime.helpers, added tests, and fixed argument order issue](https://github.com/summarizator/fora-frontend/commit/d4a14b2b)
    - [trimmed down fixture file](https://github.com/summarizator/fora-frontend/commit/3cb8fdb9)
    - [Added eranings-call page tests](https://github.com/summarizator/fora-frontend/commit/57fe97a5)
    - [mock tests fix](https://github.com/summarizator/fora-frontend/commit/781e3999)
    - [Added skeleton loader to page](https://github.com/summarizator/fora-frontend/commit/c3ea0288)
    - [Cleaned up template, checked merge changes on earnings calls page](https://github.com/summarizator/fora-frontend/commit/73bc0266)
    - [Merge branch 'dev' into FORA-1279-earnings-call-details](https://github.com/summarizator/fora-frontend/commit/972634fb)
    - [organized components, turned off video button for earnings calls, minor import clean](https://github.com/summarizator/fora-frontend/commit/1f6bd689)
    - [Add parseRawTranscript unit test along with fixtures folder for larger mocks](https://github.com/summarizator/fora-frontend/commit/06be6315)
    - [Added date fetching from fmp for the earnings call page.](https://github.com/summarizator/fora-frontend/commit/1d6a13d6)
    - [Renamed DetailedSummary to MeetingSummary to differentiate from DetailedSummarySection that only exists on Cards page and YourSummary](https://github.com/summarizator/fora-frontend/commit/43a1a043)
    - [Fix undefined meeting in custom summary menu](https://github.com/summarizator/fora-frontend/commit/c051f418)
    - [Added subSource to SourceLogo component for earnings calls. Replaced all instances of card stack styling with layerStyle='section-card'. Fixed issue with undefined text in cards page. Started bringing all instances of DetailedSummary to parity and to support new design](https://github.com/summarizator/fora-frontend/commit/60b8b7a1)
    - [Deleted unused feedback-modal and pdf-specific components](https://github.com/summarizator/fora-frontend/commit/b2a7969f)
    - [Deprecate unused card-structure and lens insight components](https://github.com/summarizator/fora-frontend/commit/3ca18d4c)
    - [remove deprecated summary card subcomponents and old earningscall icon](https://github.com/summarizator/fora-frontend/commit/e09283ad)
    - [Remove deprecated summary-card component, meeting-pdf page. Updated sourceLogo and reskin card source text to account for earnings calls](https://github.com/summarizator/fora-frontend/commit/8ed3b072)
    - [Removed redundant meeting header information from each individual page section](https://github.com/summarizator/fora-frontend/commit/c52c5706)
    - [Updated Heading default fontWeight to 600 and updated instances across the board. Removed any redundant fontweight={600} props on instances as well. Added meeting timeline to earnings call page, and reorganized component structure in src/components/meeting](https://github.com/summarizator/fora-frontend/commit/7219adc7)
    - [Add earnings call page. Add larger page foundation with loose versions of header and card](https://github.com/summarizator/fora-frontend/commit/8ac60ecb)

  </details>

## [0.5.170](https://github.com/summarizator/fora-frontend/compare/v0.5.169...v0.5.170) <span style="color: red;">[prod]</span>
> Tue, Mar 18 2025 | 05:30 PM EST

### Features

- [FORA-1260](https://foraday.atlassian.net/browse/FORA-1260): Company Page - people/company met with section
  <details>
    <summary>Commits</summary>

    - [rm console.log](https://github.com/summarizator/fora-frontend/commit/175924b5)
    - [select](https://github.com/summarizator/fora-frontend/commit/be228533)
    - [`keyBy`](https://github.com/summarizator/fora-frontend/commit/d2ce44e6)
    - [Update src/components/person/new-recently-met-with-modal.component.jsx](https://github.com/summarizator/fora-frontend/commit/47d7869b)
    - [Update src/components/person/new-person-card.component.jsx](https://github.com/summarizator/fora-frontend/commit/4accc5ae)
    - [add recent-met-with tests for PersonPreview](https://github.com/summarizator/fora-frontend/commit/24ec01d0)
    - [more people hooks tests](https://github.com/summarizator/fora-frontend/commit/2cc801ad)
    - [new-person-card tests](https://github.com/summarizator/fora-frontend/commit/e6b36fbf)
    - [sonar](https://github.com/summarizator/fora-frontend/commit/c46213f7)
    - [tests](https://github.com/summarizator/fora-frontend/commit/9edbd02d)
    - [people hooks test](https://github.com/summarizator/fora-frontend/commit/895c71a7)
    - [Merge branch 'dev' into FORA-1260-Company-Page-people-company-met-with-section](https://github.com/summarizator/fora-frontend/commit/f69701a7)
    - [Merge branch 'dev' into FORA-1260-Company-Page-people-company-met-with-section](https://github.com/summarizator/fora-frontend/commit/b9759af0)
    - [update formatDurationWithUnits test](https://github.com/summarizator/fora-frontend/commit/8b6ec237)
    - [update external company companies rmw title](https://github.com/summarizator/fora-frontend/commit/b8b2a6be)
    - [update header title for external recently met with section](https://github.com/summarizator/fora-frontend/commit/12b742ff)
    - [remove avatar stack preview text characters limit](https://github.com/summarizator/fora-frontend/commit/b6f4c795)
    - [company recently met with](https://github.com/summarizator/fora-frontend/commit/7d5b5dbd)
    - [formatDurationWithUnits to progressively display units if available](https://github.com/summarizator/fora-frontend/commit/200c5ab8)

  </details>

## [0.5.168](https://github.com/summarizator/fora-frontend/compare/v0.5.167...v0.5.168) <span style="color: red;">[prod]</span>
> Mon, Mar 17 2025 | 05:57 PM EST

### Features

- [FORA-1275](https://foraday.atlassian.net/browse/FORA-1275): Subscription main page 
  <details>
    <summary>Commits</summary>

    - [update to new call type](https://github.com/summarizator/fora-frontend/commit/886ca701)
    - [update to new call type](https://github.com/summarizator/fora-frontend/commit/6b329dfa)
    - [update to new call type](https://github.com/summarizator/fora-frontend/commit/771aa018)
    - [fix](https://github.com/summarizator/fora-frontend/commit/85d4c3f4)
    - [fix](https://github.com/summarizator/fora-frontend/commit/78982a09)
    - [Merge branch 'dev' into FORA-1275-Subscription-main-page](https://github.com/summarizator/fora-frontend/commit/c6dda214)
    - [Merge branch 'dev' into FORA-1275-Subscription-main-page](https://github.com/summarizator/fora-frontend/commit/c6b2021b)
    - [comment 2](https://github.com/summarizator/fora-frontend/commit/d59bc8d5)
    - [comment 1](https://github.com/summarizator/fora-frontend/commit/cd6e89cd)
    - [start of comments](https://github.com/summarizator/fora-frontend/commit/3c4100d5)
    - [tests passing](https://github.com/summarizator/fora-frontend/commit/0eaf5f49)
    - [start of tests](https://github.com/summarizator/fora-frontend/commit/b6b86228)
    - [start of tests](https://github.com/summarizator/fora-frontend/commit/454ee496)
    - [start of tests](https://github.com/summarizator/fora-frontend/commit/590f1712)
    - [start of tests](https://github.com/summarizator/fora-frontend/commit/298d5035)
    - [sonar fixes](https://github.com/summarizator/fora-frontend/commit/0744a8e9)
    - [fixes](https://github.com/summarizator/fora-frontend/commit/4ecdeb6c)
    - [fixes](https://github.com/summarizator/fora-frontend/commit/77261c0d)
    - [cleanup and move logic out](https://github.com/summarizator/fora-frontend/commit/b24ea1b2)
    - [wired with real dates but needs some cleanup](https://github.com/summarizator/fora-frontend/commit/e29cadb4)
    - [start of real dates](https://github.com/summarizator/fora-frontend/commit/46957ae6)
    - [pr comments](https://github.com/summarizator/fora-frontend/commit/97d1fc68)
    - [Merge branch 'dev' into FORA-1275-Subscription-main-page](https://github.com/summarizator/fora-frontend/commit/581c4445)
    - [code cleanup](https://github.com/summarizator/fora-frontend/commit/871ed5cd)
    - [styling on table fone](https://github.com/summarizator/fora-frontend/commit/b355ea77)
    - [styling on table](https://github.com/summarizator/fora-frontend/commit/a23eb592)
    - [styling on table](https://github.com/summarizator/fora-frontend/commit/deaac313)
    - [start of styling on table](https://github.com/summarizator/fora-frontend/commit/6112e2df)
    - [button working](https://github.com/summarizator/fora-frontend/commit/fd342fcb)
    - [button working](https://github.com/summarizator/fora-frontend/commit/102e57a9)
    - [start of elipsis button](https://github.com/summarizator/fora-frontend/commit/b4e1bcaf)
    - [start of elipsis button](https://github.com/summarizator/fora-frontend/commit/16e24ea5)
    - [styling](https://github.com/summarizator/fora-frontend/commit/9641ba81)
    - [styling](https://github.com/summarizator/fora-frontend/commit/4c11c125)
    - [move to tabs](https://github.com/summarizator/fora-frontend/commit/a60f8abe)
    - [start page](https://github.com/summarizator/fora-frontend/commit/149d00a7)

  </details>

## [0.5.166](https://github.com/summarizator/fora-frontend/compare/v0.5.165...v0.5.166) <span style="color: red;">[prod]</span>
> Thu, Mar 13 2025 | 05:15 PM EST

### Tasks

- [FORA-1339](https://foraday.atlassian.net/browse/FORA-1339): update lens source card header design
  <details>
    <summary>Commits</summary>

    - [insights test](https://github.com/summarizator/fora-frontend/commit/e697db07)
    - [test for lens card](https://github.com/summarizator/fora-frontend/commit/ac1fa876)
    - [correct alignment](https://github.com/summarizator/fora-frontend/commit/26346538)
    - [update lens source card header design](https://github.com/summarizator/fora-frontend/commit/a66d14f8)

  </details>

- [FORA-1338](https://foraday.atlassian.net/browse/FORA-1338): remove extra divider in meeting/summary card menu
  <details>
    <summary>Commits</summary>

    - [remove extra divider in meeting summary card menu](https://github.com/summarizator/fora-frontend/commit/87ac6d78)

  </details>


### Bug Fixes

- [FORA-1342](https://foraday.atlassian.net/browse/FORA-1342): earnings-call: use from_date and set next_run_at
  <details>
    <summary>Commits</summary>

    - [Use from_date in metadata and set next_run_at and last_run_status (earnings call)](https://github.com/summarizator/fora-frontend/commit/8de5c486)

  </details>

## [0.5.162](https://github.com/summarizator/fora-frontend/compare/v0.5.161...v0.5.162) <span style="color: red;">[prod]</span>
> Wed, Mar 12 2025 | 04:08 PM EST

### Bug Fixes

- [FORA-1336](https://foraday.atlassian.net/browse/FORA-1336): manual version bump
  <details>
    <summary>Commits</summary>

    - [Bump to 0.5.160](https://github.com/summarizator/fora-frontend/commit/9c784eba)

  </details>

## [0.5.159](https://github.com/summarizator/fora-frontend/compare/v0.5.158...v0.5.159) <span style="color: red;">[prod]</span>
> Mon, Mar 3 2025 | 12:45 PM EST

### Tasks

- [FORA-1242](https://foraday.atlassian.net/browse/FORA-1242): FE: Final Round of design qa on insight detail 
  <details>
    <summary>Commits</summary>

    - [comment](https://github.com/summarizator/fora-frontend/commit/8c21d307)
    - [Merge branch 'dev' into FORA-1242-FE-Final-Round-of-design-qa-on-insight-detail](https://github.com/summarizator/fora-frontend/commit/67554bdb)
    - [bunch of design tweaks](https://github.com/summarizator/fora-frontend/commit/e4352e68)

  </details>

- [FORA-1274](https://foraday.atlassian.net/browse/FORA-1274): Fix security vulnerability from CASA scan
  <details>
    <summary>Commits</summary>

    - [more minimal security fix](https://github.com/summarizator/fora-frontend/commit/2755b89a)

  </details>


### Features

- [FORA-1249](https://foraday.atlassian.net/browse/FORA-1249): Pulse Cards on Lens Insights page
  <details>
    <summary>Commits</summary>

    - [add clickthru func for pulse cards](https://github.com/summarizator/fora-frontend/commit/fe942d7c)

  </details>

## [0.5.155](https://github.com/summarizator/fora-frontend/compare/v0.5.154...v0.5.155) <span style="color: red;">[prod]</span>
> Fri, Feb 28 2025 | 09:46 AM EST

### Features

- [FORA-1216](https://foraday.atlassian.net/browse/FORA-1216): Include summaries count in FE
  <details>
    <summary>Commits</summary>

    - [update person stats previews from showing time-related to summaries count](https://github.com/summarizator/fora-frontend/commit/f0b31918)

  </details>

## [0.5.153](https://github.com/summarizator/fora-frontend/compare/v0.5.152...v0.5.153) <span style="color: red;">[prod]</span>
> Fri, Feb 28 2025 | 08:35 AM EST

### Bug Fixes

- [FORA-1266](https://foraday.atlassian.net/browse/FORA-1266): Update button text on smaller screens
  <details>
    <summary>Commits</summary>

    - [Update text to say Manage for smaller screens](https://github.com/summarizator/fora-frontend/commit/ec63a6fc)

  </details>


### Tasks

- [FORA-1021](https://foraday.atlassian.net/browse/FORA-1021): break table element into separate reusable component
  <details>
    <summary>Commits</summary>

    - [Fix lens card alignment issues](https://github.com/summarizator/fora-frontend/commit/efed8f0a)
    - [Sonar](https://github.com/summarizator/fora-frontend/commit/ccdd2d05)
    - [updated for review comments, fixed video modal scrobbling styling](https://github.com/summarizator/fora-frontend/commit/92611acd)
    - [unstage CHANGELOG](https://github.com/summarizator/fora-frontend/commit/98018dbb)
    - [Add CHANGELOG.md to gitignore](https://github.com/summarizator/fora-frontend/commit/8d97ab09)
    - [updated for PR comments, added documentation to AccordionTable props](https://github.com/summarizator/fora-frontend/commit/9f4f77c5)
    - [Merge branch 'dev' of https://github.com/summarizator/fora-frontend into FORA-1021-shared-table-component](https://github.com/summarizator/fora-frontend/commit/0369e67a)
    - [Merge branch 'dev' of https://github.com/summarizator/fora-frontend into FORA-1021-shared-table-component](https://github.com/summarizator/fora-frontend/commit/5707dbf7)
    - [Updated accordion table to allow any query param for initial sorting](https://github.com/summarizator/fora-frontend/commit/2c85e7db)
    - [test resolution](https://github.com/summarizator/fora-frontend/commit/e2b34124)
    - [adding tests](https://github.com/summarizator/fora-frontend/commit/240cb4c0)
    - [Merge branch 'dev' of https://github.com/summarizator/fora-frontend into FORA-1021-shared-table-component](https://github.com/summarizator/fora-frontend/commit/3f2dbbeb)
    - [clean for PR](https://github.com/summarizator/fora-frontend/commit/33b4a108)
    - [replaced meeting-topics with new component](https://github.com/summarizator/fora-frontend/commit/257ebed1)
    - [Merge branch 'dev' of https://github.com/summarizator/fora-frontend into FORA-1021-shared-table-component](https://github.com/summarizator/fora-frontend/commit/f4b38894)
    - [import fix](https://github.com/summarizator/fora-frontend/commit/8a64069c)
    - [Added additional configuration options to table](https://github.com/summarizator/fora-frontend/commit/39f302cc)
    - [import fix](https://github.com/summarizator/fora-frontend/commit/ab3a86a4)
    - [Add additional config](https://github.com/summarizator/fora-frontend/commit/717eef4b)
    - [import removal](https://github.com/summarizator/fora-frontend/commit/5788d470)
    - [Adding generic columns](https://github.com/summarizator/fora-frontend/commit/775fced5)
    - [import fix](https://github.com/summarizator/fora-frontend/commit/60c41d8d)
    - [Add shared comp](https://github.com/summarizator/fora-frontend/commit/336da0a3)

  </details>

## [0.5.150](https://github.com/summarizator/fora-frontend/compare/v0.5.149...v0.5.150) <span style="color: red;">[prod]</span>
> Thu, Feb 20 2025 | 08:12 AM EST

### Bug Fixes

- [FORA-1229](https://foraday.atlassian.net/browse/FORA-1229): selecting the same date for lens start_at and end_at filters means no matches
  <details>
    <summary>Commits</summary>

    - [remove console log](https://github.com/summarizator/fora-frontend/commit/b74e02ea)
    - [coerce test env to use our timezone](https://github.com/summarizator/fora-frontend/commit/70848819)
    - [always corece start_at to midnight and end_at to 11:59pm](https://github.com/summarizator/fora-frontend/commit/88f1472b)

  </details>


### Tasks

- [FORA-1164](https://foraday.atlassian.net/browse/FORA-1164): fix lens settings text to stay on one line
  <details>
    <summary>Commits</summary>

    - [Merge branch 'dev' into FORA-1164-fix-lens-settings-text-to-stay-on-one-line](https://github.com/summarizator/fora-frontend/commit/f2d55252)
    - [fix lens settings similarity score slider text to stay on one line](https://github.com/summarizator/fora-frontend/commit/f9f7a24a)

  </details>

- [FORA-1220](https://foraday.atlassian.net/browse/FORA-1220): Remove help link from custom summary menu
  <details>
    <summary>Commits</summary>

    - [Remove help menu](https://github.com/summarizator/fora-frontend/commit/55380783)

  </details>

## [0.5.146](https://github.com/summarizator/fora-frontend/compare/v0.5.145...v0.5.146) <span style="color: red;">[prod]</span>
> Wed, Feb 19 2025 | 07:07 PM EST

### Features

- [FORA-560](https://foraday.atlassian.net/browse/FORA-560): External person page
  <details>
    <summary>Commits</summary>

    - [add size of 11 to theme](https://github.com/summarizator/fora-frontend/commit/a825e5d8)
    - [make person page centered if no person stats to be displayed on right rail](https://github.com/summarizator/fora-frontend/commit/9657aabe)
    - [Merge branch 'dev' into FORA-560-External-person-page](https://github.com/summarizator/fora-frontend/commit/85e70a8b)
    - [initial meeting summaries skeleton](https://github.com/summarizator/fora-frontend/commit/1ee19ffb)
    - [topics table test + sonar](https://github.com/summarizator/fora-frontend/commit/c641fc28)
    - [org chart icon 24 to 6](https://github.com/summarizator/fora-frontend/commit/6aecf1e8)
    - [sonar](https://github.com/summarizator/fora-frontend/commit/220baef7)
    - [gray.text](https://github.com/summarizator/fora-frontend/commit/16b75cf9)
    - [update uses of 44px to 11 (chakra)](https://github.com/summarizator/fora-frontend/commit/96388483)
    - [nameProps](https://github.com/summarizator/fora-frontend/commit/65af8037)
    - [remove atTo atFrom as only used once](https://github.com/summarizator/fora-frontend/commit/2f309d2b)
    - [differenceInDays](https://github.com/summarizator/fora-frontend/commit/a18b63e9)
    - [useConst meeting timeline](https://github.com/summarizator/fora-frontend/commit/dff57c57)
    - [remove step of 1](https://github.com/summarizator/fora-frontend/commit/caaf6462)
    - [remove noop, move pendo track to topics table](https://github.com/summarizator/fora-frontend/commit/fd99c6d1)
    - [remove noop](https://github.com/summarizator/fora-frontend/commit/db7679f0)
    - [useConst](https://github.com/summarizator/fora-frontend/commit/3821a3eb)
    - [nsbp](https://github.com/summarizator/fora-frontend/commit/2fb3eaf7)
    - [person component tests](https://github.com/summarizator/fora-frontend/commit/278cd8c4)
    - [split tests script](https://github.com/summarizator/fora-frontend/commit/8ba7b0a0)
    - [fix pulse button hidden](https://github.com/summarizator/fora-frontend/commit/e5718d50)
    - [missed prop foraPerson](https://github.com/summarizator/fora-frontend/commit/05a61ee4)
    - [move internal-vs-external chart outside right rail](https://github.com/summarizator/fora-frontend/commit/4ec8adb4)
    - [move summaries stats outside right rail component file](https://github.com/summarizator/fora-frontend/commit/75d15d12)
    - [add new person page tests](https://github.com/summarizator/fora-frontend/commit/6d60beea)
    - [new person page](https://github.com/summarizator/fora-frontend/commit/6955acff)
    - [test person.page and person.hooks](https://github.com/summarizator/fora-frontend/commit/bf8a00ea)
    - [tests lint-staged](https://github.com/summarizator/fora-frontend/commit/b0ca238a)
    - [merge dev w/o tests](https://github.com/summarizator/fora-frontend/commit/1a6ae9e1)
    - [old new page feature flag](https://github.com/summarizator/fora-frontend/commit/a85e1ee8)
    - [push groups](https://github.com/summarizator/fora-frontend/commit/7a816769)
    - [useInfiniteCards](https://github.com/summarizator/fora-frontend/commit/70200f51)
    - [improve request body?](https://github.com/summarizator/fora-frontend/commit/1fbbb12a)
    - [update meetings search request](https://github.com/summarizator/fora-frontend/commit/e27b30dd)
    - [Merge branch 'dev' into FORA-560-External-person-page](https://github.com/summarizator/fora-frontend/commit/4e9bac9b)
    - [dedupe infinite search, two creators](https://github.com/summarizator/fora-frontend/commit/29426fb1)
    - [recent meetings infinite search](https://github.com/summarizator/fora-frontend/commit/48b4563a)
    - [recently met with companies 2 columns max](https://github.com/summarizator/fora-frontend/commit/389d7ef0)
    - [improve recent summaries skeleton](https://github.com/summarizator/fora-frontend/commit/5d78f723)
    - [update recent summaries from starting 2 days ago to 90 days ago](https://github.com/summarizator/fora-frontend/commit/5c984b58)
    - [spacing](https://github.com/summarizator/fora-frontend/commit/7c624a55)
    - [inline](https://github.com/summarizator/fora-frontend/commit/d143e8ae)
    - [update recent summaries design and separate unused timeline component](https://github.com/summarizator/fora-frontend/commit/434a505a)
    - [merge dev](https://github.com/summarizator/fora-frontend/commit/0812595b)
    - [update recent summaries format](https://github.com/summarizator/fora-frontend/commit/472bf863)
    - [hide avg meetings per day from external](https://github.com/summarizator/fora-frontend/commit/da6c673c)
    - [use recent summaries skeletons](https://github.com/summarizator/fora-frontend/commit/abb8d973)
    - [recent summaries format](https://github.com/summarizator/fora-frontend/commit/8d0e8428)
    - [update content-section-header: wider and lighter](https://github.com/summarizator/fora-frontend/commit/ce11447f)
    - [don't send participant_emails when on your own page](https://github.com/summarizator/fora-frontend/commit/6147cb88)
    - [update recent summaries: swap headling and meeting title](https://github.com/summarizator/fora-frontend/commit/9d506ed8)
    - [john's qa styling](https://github.com/summarizator/fora-frontend/commit/55a3af21)
    - [org chart icon, spacing](https://github.com/summarizator/fora-frontend/commit/bf7e71ea)
    - [pluralize](https://github.com/summarizator/fora-frontend/commit/7cf90e9c)
    - [recent summaries do not include user email](https://github.com/summarizator/fora-frontend/commit/76048608)
    - [revert meeting query hooks after merge](https://github.com/summarizator/fora-frontend/commit/014ef4fc)
    - [merge dev](https://github.com/summarizator/fora-frontend/commit/75e50c1a)
    - [all references to number of days for stats to account for](https://github.com/summarizator/fora-frontend/commit/56017d9f)
    - [apply timeframe of 90 days to external people stats](https://github.com/summarizator/fora-frontend/commit/6681090b)
    - [fix isExternalToUser](https://github.com/summarizator/fora-frontend/commit/15379f24)
    - [tooltip styling](https://github.com/summarizator/fora-frontend/commit/bf220ddc)
    - [adapt to external](https://github.com/summarizator/fora-frontend/commit/e8d0ede9)
    - [recent summaries skeleton](https://github.com/summarizator/fora-frontend/commit/775835c1)
    - [Revert "add recent summaries section to be under loading screen"](https://github.com/summarizator/fora-frontend/commit/a4a606c8)
    - [change org chart button spacing](https://github.com/summarizator/fora-frontend/commit/eb305634)
    - [add recent summaries section to be under loading screen](https://github.com/summarizator/fora-frontend/commit/3374b9a2)
    - [useCards](https://github.com/summarizator/fora-frontend/commit/0cdf74ad)
    - [recent summaries to only look for meeting sources](https://github.com/summarizator/fora-frontend/commit/56738193)
    - [move from prior meeeitngs](https://github.com/summarizator/fora-frontend/commit/6611fabf)
    - [add check for bot_attendee_emails as they count as external](https://github.com/summarizator/fora-frontend/commit/938f1f09)
    - [fix loading condition and warnings](https://github.com/summarizator/fora-frontend/commit/14da4377)
    - [loading screen](https://github.com/summarizator/fora-frontend/commit/16faa196)
    - [merge dev + error fixes](https://github.com/summarizator/fora-frontend/commit/6b9597f3)
    - [internal: recent summaries](https://github.com/summarizator/fora-frontend/commit/3e3d4e26)
    - [internal: right rail and some main content](https://github.com/summarizator/fora-frontend/commit/c9e52923)
    - [profile buttons](https://github.com/summarizator/fora-frontend/commit/f5d2db0f)
    - [don't PENDO if you don't need to, as simple as that](https://github.com/summarizator/fora-frontend/commit/1ade0e0b)
    - [person summaries bar chart data population](https://github.com/summarizator/fora-frontend/commit/a46c5217)
    - [fix date ticks generation](https://github.com/summarizator/fora-frontend/commit/8e222d70)
    - [timeline data](https://github.com/summarizator/fora-frontend/commit/0b646f8c)
    - [remove console.log](https://github.com/summarizator/fora-frontend/commit/f5a53d76)
    - [recently met with](https://github.com/summarizator/fora-frontend/commit/54fa7b55)
    - [person page charts (right rail donut and timeline bubble chart)](https://github.com/summarizator/fora-frontend/commit/190c5fab)
    - [organize person components](https://github.com/summarizator/fora-frontend/commit/5af43ceb)
    - [person right rail](https://github.com/summarizator/fora-frontend/commit/3a1350d2)
    - [add person inline stats](https://github.com/summarizator/fora-frontend/commit/fd967ab4)
    - [pb](https://github.com/summarizator/fora-frontend/commit/1994aa1f)
    - [person card avatars](https://github.com/summarizator/fora-frontend/commit/382fa02b)
    - [call handleResize initially in columned layout](https://github.com/summarizator/fora-frontend/commit/2ea77164)
    - [separate topics table from meeting section representation](https://github.com/summarizator/fora-frontend/commit/d14e6328)
    - [sync openapi types](https://github.com/summarizator/fora-frontend/commit/d11ed256)

  </details>

- [FORA-1155](https://foraday.atlassian.net/browse/FORA-1155): Start button improvements
  <details>
    <summary>Commits</summary>

    - [Add logic to support FORA is Joining behavior](https://github.com/summarizator/fora-frontend/commit/7d49dcff)

  </details>


### Bug Fixes

- [FORA-1210](https://foraday.atlassian.net/browse/FORA-1210): Date filter on lens create/edit page not working
  <details>
    <summary>Commits</summary>

    - [Bump pageSize to 500](https://github.com/summarizator/fora-frontend/commit/22dfa552)
    - [Use pageSize 100 has_tags false](https://github.com/summarizator/fora-frontend/commit/93092b05)
    - [Increase lens pageSize to 1000](https://github.com/summarizator/fora-frontend/commit/3d9146a2)
    - [Hide the date in the form when using the default date](https://github.com/summarizator/fora-frontend/commit/3244ace7)
    - [Refactor useCreateLensFormState by breaking out helper functions](https://github.com/summarizator/fora-frontend/commit/33c49ffc)
    - [Remove duplicate useLensActivation definitions and refactor correct one](https://github.com/summarizator/fora-frontend/commit/0b553d61)
    - [Use default timestamps logic in lens submission process](https://github.com/summarizator/fora-frontend/commit/abeea478)
    - [Fix pre-commit hook with ignored files](https://github.com/summarizator/fora-frontend/commit/81748416)
    - [Add function lensIsUsingDefaultTimestamps](https://github.com/summarizator/fora-frontend/commit/109ab6c8)
    - [Make save button logic consistent in right rail](https://github.com/summarizator/fora-frontend/commit/a3465a57)

  </details>

- [FORA-1223](https://foraday.atlassian.net/browse/FORA-1223): Fix bug with home page
  <details>
    <summary>Commits</summary>

    - [Add includeTotal to the queryKey](https://github.com/summarizator/fora-frontend/commit/830c03f6)

  </details>

## [0.5.140](https://github.com/summarizator/fora-frontend/compare/v0.5.139...v0.5.140) <span style="color: red;">[prod]</span>

> Mon, Feb 17 2025 | 12:51 PM EST

### Tasks

- [FORA-1202](https://foraday.atlassian.net/browse/FORA-1202): Update Pre-Commit Lint Hook
  <details>
    <summary>Commits</summary>

  - [Add push lint check to husky pre-commit hook to prevent useless warning fix commits](https://github.com/summarizator/fora-frontend/commit/39ed6dfe)

  </details>

### Bug Fixes

- [FORA-1127](https://foraday.atlassian.net/browse/FORA-1127): Flag for Lenses - Fix Segment and remove redirect. Fix issues with original 1083 PR
  <details>
    <summary>Commits</summary>

  - [Merge branch 'dev' into FORA-1127-before-dev](https://github.com/summarizator/fora-frontend/commit/36ce3614)
  - [pr comment](https://github.com/summarizator/fora-frontend/commit/ecf3fada)
  - [forgot one functionaliry](https://github.com/summarizator/fora-frontend/commit/8070d15e)
  - [forgot one functionaliry](https://github.com/summarizator/fora-frontend/commit/32e60160)
  - [eat shit tests](https://github.com/summarizator/fora-frontend/commit/d503e2d5)
  - [a lot more final test fixes](https://github.com/summarizator/fora-frontend/commit/46e4da05)
  - [more of test fix final](https://github.com/summarizator/fora-frontend/commit/c4195890)
  - [start of test fix final](https://github.com/summarizator/fora-frontend/commit/2b2bbfe0)
  - [f8b](https://github.com/summarizator/fora-frontend/commit/45c38238)
  - [fc](https://github.com/summarizator/fora-frontend/commit/33a385a5)
  - [95](https://github.com/summarizator/fora-frontend/commit/88b6dc48)
  - [auto move tests](https://github.com/summarizator/fora-frontend/commit/704773d1)
  - [last of non test stuff](https://github.com/summarizator/fora-frontend/commit/61807238)
  - [3d](https://github.com/summarizator/fora-frontend/commit/0eeafaa6)
  - [46](https://github.com/summarizator/fora-frontend/commit/1dde9225)
  - [4b](https://github.com/summarizator/fora-frontend/commit/03a75012)
  - [78](https://github.com/summarizator/fora-frontend/commit/78bf1da5)
  - [01](https://github.com/summarizator/fora-frontend/commit/8297782d)
  - [49](https://github.com/summarizator/fora-frontend/commit/b6bc6044)
  - [fb](https://github.com/summarizator/fora-frontend/commit/ba098d92)
  - [cleanup](https://github.com/summarizator/fora-frontend/commit/32758a71)
  - [47](https://github.com/summarizator/fora-frontend/commit/28479c82)
  - [f8](https://github.com/summarizator/fora-frontend/commit/217a145b)
  - [Merge branch 'dev' into FORA-1127-before-dev](https://github.com/summarizator/fora-frontend/commit/0eca19bc)
  - [tests fix](https://github.com/summarizator/fora-frontend/commit/d0c7e242)
  - [fix archiving and unarchiving lenses](https://github.com/summarizator/fora-frontend/commit/169bb7f3)
  - [cleanup](https://github.com/summarizator/fora-frontend/commit/d081d386)
  - [why changes why](https://github.com/summarizator/fora-frontend/commit/66399d94)
  - [undo swap manually](https://github.com/summarizator/fora-frontend/commit/2f3eccf3)
  - [Merge branch 'dev' into FORA-1127-Flag-for-Lenses-Fix-Segment-and-remove-redirect](https://github.com/summarizator/fora-frontend/commit/d15140da)
  - [comments and fix](https://github.com/summarizator/fora-frontend/commit/7c0c5947)
  - [swap titles](https://github.com/summarizator/fora-frontend/commit/8e228b0e)
  - [pulse launch container behind flag](https://github.com/summarizator/fora-frontend/commit/5f2bdc26)
  - [tests](https://github.com/summarizator/fora-frontend/commit/8ba55550)
  - [last qa comment](https://github.com/summarizator/fora-frontend/commit/9581219c)
  - [Merge branch 'dev' into FORA-1127-Flag-for-Lenses-Fix-Segment-and-remove-redirect](https://github.com/summarizator/fora-frontend/commit/6f927b99)
  - [Merge branch 'dev' into FORA-1127-Flag-for-Lenses-Fix-Segment-and-remove-redirect](https://github.com/summarizator/fora-frontend/commit/47ea6ec2)
  - [Merge remote-tracking branch 'origin/FORA-1083-Redesign-Lens-Insight-page-Right-Pane' into FORA-1127-Flag-for-Lenses-Fix-Segment-and-remove-redirect](https://github.com/summarizator/fora-frontend/commit/20a37420)
  - [fix understanding field](https://github.com/summarizator/fora-frontend/commit/947b6803)
  - [Merge branch 'dev' into FORA-1127-Flag-for-Lenses-Fix-Segment-and-remove-redirect](https://github.com/summarizator/fora-frontend/commit/73c849ec)
  - [okay fallback approach](https://github.com/summarizator/fora-frontend/commit/a660525b)
  - [okay fallback approach](https://github.com/summarizator/fora-frontend/commit/b00fc3a0)
  - [okay fallback approach](https://github.com/summarizator/fora-frontend/commit/5f1b3159)
  - [this still works](https://github.com/summarizator/fora-frontend/commit/106b3fb7)
  - [Merge branch 'FORA-1083-Redesign-Lens-Insight-page-Right-Pane' into FORA-1127-Flag-for-Lenses-Fix-Segment-and-remove-redirect](https://github.com/summarizator/fora-frontend/commit/3108aca1)
  - [Merge branch 'dev' into FORA-1127-Flag-for-Lenses-Fix-Segment-and-remove-redirect](https://github.com/summarizator/fora-frontend/commit/c7ba9014)
  - [test](https://github.com/summarizator/fora-frontend/commit/426904a9)
  - [test](https://github.com/summarizator/fora-frontend/commit/9e51ac16)
  - [test](https://github.com/summarizator/fora-frontend/commit/b9432760)
  - [test](https://github.com/summarizator/fora-frontend/commit/10480363)
  - [working sad path](https://github.com/summarizator/fora-frontend/commit/6b08d715)
  - [working happy](https://github.com/summarizator/fora-frontend/commit/29187aa6)
  - [start](https://github.com/summarizator/fora-frontend/commit/900a7895)

  </details>

## [0.5.137](https://github.com/summarizator/fora-frontend/compare/v0.5.136...v0.5.137) <span style="color: red;">[prod]</span>

> Thu, Feb 13 2025 | 05:30 PM EST

### Features

- [FORA-1170](https://foraday.atlassian.net/browse/FORA-1170): "l" is Not a Function Prod Issue
  <details>
    <summary>Commits</summary>

  - [revert fix that got overwritten in merge](https://github.com/summarizator/fora-frontend/commit/ebd76d54)

  </details>

## [0.5.135](https://github.com/summarizator/fora-frontend/compare/v0.5.134...v0.5.135) <span style="color: red;">[prod]</span>

> Thu, Feb 13 2025 | 04:42 PM EST

### Features

- [FORA-1170](https://foraday.atlassian.net/browse/FORA-1170): "l" is Not a Function Prod Issue
  <details>
    <summary>Commits</summary>

  - [fix build error](https://github.com/summarizator/fora-frontend/commit/4c94eecd)
  - [Add test cases to usePrefetchInfiniteSearchQuery](https://github.com/summarizator/fora-frontend/commit/52714679)
  - [Merge branch 'dev' of https://github.com/summarizator/fora-frontend into FORA-1170-l-is-not-a-function-bug](https://github.com/summarizator/fora-frontend/commit/b8b1b4f5)
  - [Fixed insights and cards prefetching. Cleaned up prefetch mocks in tests](https://github.com/summarizator/fora-frontend/commit/32a5ebfa)
  - [Merge branch 'dev' of https://github.com/summarizator/fora-frontend into FORA-1170-l-is-not-a-function-bug](https://github.com/summarizator/fora-frontend/commit/9e098eb4)
  - [Revert issue where prefetching was calling the useInfiniteQuery hook instead](https://github.com/summarizator/fora-frontend/commit/a016eb13)

  </details>

## [0.5.133](https://github.com/summarizator/fora-frontend/compare/v0.5.132...v0.5.133) <span style="color: red;">[prod]</span>

> Wed, Feb 12 2025 | 04:28 PM EST

### Features

- [FORA-1083](https://foraday.atlassian.net/browse/FORA-1083): Redesign Lens Insight page - Right Pane
  <details>
    <summary>Commits</summary>

  - [Revert "Merge pull request #1225 from summarizator/FORA-1083-Redesign-Lens-Insight-page-Right-Pane"](https://github.com/summarizator/fora-frontend/commit/0dbd3150)

  </details>

## [0.5.131](https://github.com/summarizator/fora-frontend/compare/v0.5.130...v0.5.131) <span style="color: red;">[prod]</span>

> Wed, Feb 12 2025 | 08:05 PM EST

## [0.5.129](https://github.com/summarizator/fora-frontend/compare/v0.5.128...v0.5.129) <span style="color: red;">[prod]</span>

> Tue, Feb 11 2025 | 02:24 PM EST

### Bug Fixes

- [FORA-1195](https://foraday.atlassian.net/browse/FORA-1195): okta: Handle other apollo domains
  <details>
    <summary>Commits</summary>

  - [Change to SonarSource/sonarqube-scan-action](https://github.com/summarizator/fora-frontend/commit/f259f95e)
  - [Support other apollo domains](https://github.com/summarizator/fora-frontend/commit/00c4231d)

  </details>

### Features

- [FORA-1073](https://foraday.atlassian.net/browse/FORA-1073): Add Copy Transcript button to the meeting detail page.
  <details>
    <summary>Commits</summary>

  - [Change to numbers](https://github.com/summarizator/fora-frontend/commit/2dc8c974)
  - [Mock all tests within the UTC timezone](https://github.com/summarizator/fora-frontend/commit/0beba859)
  - [Add copy to transcript button](https://github.com/summarizator/fora-frontend/commit/068a8715)

  </details>

- [FORA-1083](https://foraday.atlassian.net/browse/FORA-1083): Redesign Lens Insight page - Right Pane
  <details>
    <summary>Commits</summary>

  - [last qa comment](https://github.com/summarizator/fora-frontend/commit/5baf4f27)
  - [test crap](https://github.com/summarizator/fora-frontend/commit/f8b28873)
  - [test crap](https://github.com/summarizator/fora-frontend/commit/fc38d79f)
  - [test merge and cleanup](https://github.com/summarizator/fora-frontend/commit/bd545744)
  - [scorlling func](https://github.com/summarizator/fora-frontend/commit/3d21f0da)
  - [josh design updates](https://github.com/summarizator/fora-frontend/commit/f63c8eb7)
  - [new functionality link to meeting page](https://github.com/summarizator/fora-frontend/commit/4bdff423)
  - [modal launching on sources](https://github.com/summarizator/fora-frontend/commit/78fea99b)
  - [start of launching modal instead of linking](https://github.com/summarizator/fora-frontend/commit/018977c2)
  - [test updates](https://github.com/summarizator/fora-frontend/commit/497b1b70)
  - [view more buttons](https://github.com/summarizator/fora-frontend/commit/fb9aacf5)
  - [first 2 cynthia comments](https://github.com/summarizator/fora-frontend/commit/47558175)
  - [pr comments](https://github.com/summarizator/fora-frontend/commit/f8d4c672)
  - [Merge branch 'dev' into FORA-1083-Redesign-Lens-Insight-page-Right-Pane](https://github.com/summarizator/fora-frontend/commit/dcbfd77a)
  - [cynthia comments](https://github.com/summarizator/fora-frontend/commit/cd3ae799)
  - [revert weird change](https://github.com/summarizator/fora-frontend/commit/51f79662)
  - [revert](https://github.com/summarizator/fora-frontend/commit/cc2720a4)
  - [more test fixes](https://github.com/summarizator/fora-frontend/commit/5a2c9c5d)
  - [more test fixes](https://github.com/summarizator/fora-frontend/commit/de064148)
  - [more test fixes](https://github.com/summarizator/fora-frontend/commit/9c0714aa)
  - [more test fixes](https://github.com/summarizator/fora-frontend/commit/7b6c1230)
  - [fix lenses edit](https://github.com/summarizator/fora-frontend/commit/4364d280)
  - [lint](https://github.com/summarizator/fora-frontend/commit/4b42f8c6)
  - [lint](https://github.com/summarizator/fora-frontend/commit/383580ad)
  - [number rendering](https://github.com/summarizator/fora-frontend/commit/10bb5db4)
  - [pass number along](https://github.com/summarizator/fora-frontend/commit/2d799d74)
  - [first part of design in modal](https://github.com/summarizator/fora-frontend/commit/927d1f40)
  - [start of modal additions](https://github.com/summarizator/fora-frontend/commit/5f7537bb)
  - [working modal on borrom half](https://github.com/summarizator/fora-frontend/commit/d571f911)
  - [working modal on top half](https://github.com/summarizator/fora-frontend/commit/e63f88a8)
  - [start of modal bs](https://github.com/summarizator/fora-frontend/commit/40816def)
  - [test fixese](https://github.com/summarizator/fora-frontend/commit/93f55600)
  - [menu parity and remove elipsis button from metadata](https://github.com/summarizator/fora-frontend/commit/c31e8625)
  - [new props for lens list](https://github.com/summarizator/fora-frontend/commit/1aa99f7b)
  - [titles wired correctly](https://github.com/summarizator/fora-frontend/commit/6fb03f2d)
  - [titles wired correctly](https://github.com/summarizator/fora-frontend/commit/7370fcf8)
  - [start of fixing list](https://github.com/summarizator/fora-frontend/commit/ee1d0dc3)
  - [Merge branch 'dev' into FORA-1083-Redesign-Lens-Insight-page-Right-Pane](https://github.com/summarizator/fora-frontend/commit/3c2f7ebe)
  - [start of refactor for list](https://github.com/summarizator/fora-frontend/commit/f4b011d5)
  - [start of refactor for list](https://github.com/summarizator/fora-frontend/commit/c356b63a)
  - [merge hooks and more tests](https://github.com/summarizator/fora-frontend/commit/7e851ba6)
  - [start refactoring for reusing previoous insights component](https://github.com/summarizator/fora-frontend/commit/df52913b)
  - [Merge branch 'FORA-1082-Redesign-Lens-Insight-page-Sources-section' into FORA-1083-Redesign-Lens-Insight-page-Right-Pane](https://github.com/summarizator/fora-frontend/commit/81b5a290)
  - [eat it tests](https://github.com/summarizator/fora-frontend/commit/74cdcd30)
  - [eat it tests](https://github.com/summarizator/fora-frontend/commit/41743dce)
  - [tests suck](https://github.com/summarizator/fora-frontend/commit/26729343)
  - [styling and link out to creator name](https://github.com/summarizator/fora-frontend/commit/354fdbd5)
  - [merge](https://github.com/summarizator/fora-frontend/commit/eb6dddd4)
  - [start of right side](https://github.com/summarizator/fora-frontend/commit/825ce571)
  - [start of test](https://github.com/summarizator/fora-frontend/commit/c9ab79ac)

  </details>

- [FORA-211](https://foraday.atlassian.net/browse/FORA-211): Timezone for emails on User level
  <details>
    <summary>Commits</summary>

  - [Add unit tests to email-subscriptions page](https://github.com/summarizator/fora-frontend/commit/a940400b)
  - [minor qol loading improvement](https://github.com/summarizator/fora-frontend/commit/25ec3c40)
  - [Merge branch 'dev' of https://github.com/summarizator/fora-frontend into FORA-211-user-level-timezones](https://github.com/summarizator/fora-frontend/commit/3db6599d)
  - [minor: undefined var fix](https://github.com/summarizator/fora-frontend/commit/c70d2416)
  - [added 'filled' Select theme. Added timezone selector to email subscriptions](https://github.com/summarizator/fora-frontend/commit/69d297a6)
  - [minor: import remove](https://github.com/summarizator/fora-frontend/commit/cd317de6)
  - [Fixes to icon box sizing on setings page/app wide](https://github.com/summarizator/fora-frontend/commit/af2ae0ab)

  </details>

## [0.5.124](https://github.com/summarizator/fora-frontend/compare/v0.5.123...v0.5.124) <span style="color: red;">[prod]</span>

> Mon, Feb 10 2025 | 04:16 PM EST

### Tasks

- [FORA-1125](https://foraday.atlassian.net/browse/FORA-1125): set up pendo tracking for various flows
  <details>
    <summary>Commits</summary>

  - [add some sharing events](https://github.com/summarizator/fora-frontend/commit/159fb8d6)
  - [add pendo tracking in a bunch of places](https://github.com/summarizator/fora-frontend/commit/352c1ff8)
  - [Merge branch 'dev' of github.com:summarizator/fora-frontend into dev](https://github.com/summarizator/fora-frontend/commit/4255a9c5)
  - [Merge branch 'dev' of github.com:summarizator/fora-frontend into dev](https://github.com/summarizator/fora-frontend/commit/f640287f)
  - [Merge branch 'dev' of github.com:summarizator/fora-frontend into dev](https://github.com/summarizator/fora-frontend/commit/e475409a)

  </details>

### Features

- [FORA-1185](https://foraday.atlassian.net/browse/FORA-1185): Handle custom auth server in okta
  <details>
    <summary>Commits</summary>

  - [Pass realm into /oauth/okta call when authenticating with backend](https://github.com/summarizator/fora-frontend/commit/4505e160)
  - [Add logic to pass auth server in okta callback](https://github.com/summarizator/fora-frontend/commit/96f48bbe)
  - [Add logic to extract custom auth server](https://github.com/summarizator/fora-frontend/commit/4af5806e)

  </details>

### Bug Fixes

- [FORA-1179](https://foraday.atlassian.net/browse/FORA-1179): Reduce Mobile Meeting Page Container Padding
  <details>
    <summary>Commits</summary>

  - [Fixed weird spacing on mobile sticky nav as well](https://github.com/summarizator/fora-frontend/commit/4ef374f7)
  - [Reduced padding on meeting page main container to match rest of app](https://github.com/summarizator/fora-frontend/commit/b7949efd)

  </details>

## [0.5.120](https://github.com/summarizator/fora-frontend/compare/v0.5.119...v0.5.120) <span style="color: red;">[prod]</span>

> Thu, Feb 6 2025 | 06:26 PM EST

### Bug Fixes

- [FORA-1172](https://foraday.atlassian.net/browse/FORA-1172): Loading Screen disco
  <details>
    <summary>Commits</summary>

  - [useState](https://github.com/summarizator/fora-frontend/commit/04c171c6)
  - [remove console.log](https://github.com/summarizator/fora-frontend/commit/58d432f9)
  - [fix console errors and loading screen disco as valid video error appears](https://github.com/summarizator/fora-frontend/commit/d4fc25cf)

  </details>

### Features

- [FORA-1102](https://foraday.atlassian.net/browse/FORA-1102): Bot joining the meeting in a Paused state when local recording is OFF
  <details>
    <summary>Commits</summary>

  - [Handle bot in error state when call hasn't yet finished](https://github.com/summarizator/fora-frontend/commit/a26e143a)

  </details>

## [0.5.117](https://github.com/summarizator/fora-frontend/compare/v0.5.116...v0.5.117) <span style="color: red;">[prod]</span>

> Thu, Feb 6 2025 | 10:38 AM EST

### Features

- [FORA-1082](https://foraday.atlassian.net/browse/FORA-1082): Redesign Lens Insight page - Sources section
  <details>
    <summary>Commits</summary>

  - [start of refactor for list](https://github.com/summarizator/fora-frontend/commit/2b156b15)
  - [tests](https://github.com/summarizator/fora-frontend/commit/aad491ab)
  - [comments](https://github.com/summarizator/fora-frontend/commit/85665093)
  - [comments](https://github.com/summarizator/fora-frontend/commit/886b6696)
  - [test fixes](https://github.com/summarizator/fora-frontend/commit/7dcb3d0f)
  - [sonar](https://github.com/summarizator/fora-frontend/commit/5e74ce32)
  - [testsz](https://github.com/summarizator/fora-frontend/commit/6529ef2b)
  - [Merge branch 'dev' into FORA-1082-Redesign-Lens-Insight-page-Sources-section](https://github.com/summarizator/fora-frontend/commit/5cf277fb)
  - [styling and fixes](https://github.com/summarizator/fora-frontend/commit/5de7099e)
  - [styling and fixes](https://github.com/summarizator/fora-frontend/commit/7f74307e)
  - [styling and fixes](https://github.com/summarizator/fora-frontend/commit/b999dbf0)
  - [add deactivate reactivate to lens card menu 2](https://github.com/summarizator/fora-frontend/commit/4ffd9db9)
  - [add deactivate reactivate to lens card menu](https://github.com/summarizator/fora-frontend/commit/2399a273)
  - [refactor to pull deactivation logic out for usage in menu](https://github.com/summarizator/fora-frontend/commit/346b38fd)
  - [refactor to pull deactivation logic out for usage in menu](https://github.com/summarizator/fora-frontend/commit/d1134597)
  - [clean tests](https://github.com/summarizator/fora-frontend/commit/8700efcb)
  - [clean tests](https://github.com/summarizator/fora-frontend/commit/7bb2ad44)
  - [start of tests](https://github.com/summarizator/fora-frontend/commit/ee48181d)
  - [formatting for previous insights](https://github.com/summarizator/fora-frontend/commit/67402f18)
  - [cleanup](https://github.com/summarizator/fora-frontend/commit/66eaf753)
  - [break out previous insights](https://github.com/summarizator/fora-frontend/commit/81c73aa6)
  - [styles](https://github.com/summarizator/fora-frontend/commit/e8c6ac19)
  - [warnings](https://github.com/summarizator/fora-frontend/commit/4b811bcc)
  - [warnings](https://github.com/summarizator/fora-frontend/commit/5ad1bb8f)
  - [Merge branch 'dev' into FORA-1082-Redesign-Lens-Insight-page-Sources-section](https://github.com/summarizator/fora-frontend/commit/15f86097)
  - [start of next tabs](https://github.com/summarizator/fora-frontend/commit/deb25061)
  - [Merge branch 'dev' into FORA-1082-Redesign-Lens-Insight-page-Sources-section](https://github.com/summarizator/fora-frontend/commit/36915d32)
  - [source button click functionality](https://github.com/summarizator/fora-frontend/commit/343da3d4)
  - [sourcebutton styling](https://github.com/summarizator/fora-frontend/commit/2c9ef845)
  - [all logic for first tab](https://github.com/summarizator/fora-frontend/commit/1f6ca6da)
  - [start of fullcard logic](https://github.com/summarizator/fora-frontend/commit/9822e33a)
  - [edit button logic](https://github.com/summarizator/fora-frontend/commit/87d213a2)
  - [start of tabs](https://github.com/summarizator/fora-frontend/commit/a7f1bdb3)
  - [start of tabs](https://github.com/summarizator/fora-frontend/commit/4af0cd19)

  </details>

- [FORA-1081](https://foraday.atlassian.net/browse/FORA-1081): Redesign Lens Insight page - Center Pane
  <details>
    <summary>Commits</summary>

  - [tests](https://github.com/summarizator/fora-frontend/commit/c6530017)
  - [tests](https://github.com/summarizator/fora-frontend/commit/7908db17)
  - [tests](https://github.com/summarizator/fora-frontend/commit/70cd0b8c)
  - [tests](https://github.com/summarizator/fora-frontend/commit/625b93e7)
  - [comments from original ticket](https://github.com/summarizator/fora-frontend/commit/2b95133e)

  </details>

### Bug Fixes

- [FORA-1167](https://foraday.atlassian.net/browse/FORA-1167): use user meeting id when calling start endpoint
  <details>
    <summary>Commits</summary>

  - [Pass meetingId to rollbar](https://github.com/summarizator/fora-frontend/commit/f59745bd)
  - [Update error handling and add rollbar](https://github.com/summarizator/fora-frontend/commit/21e056fc)
  - [Switch to using the users meeting id when calling start](https://github.com/summarizator/fora-frontend/commit/98d7f409)

  </details>

## [0.5.113](https://github.com/summarizator/fora-frontend/compare/v0.5.112...v0.5.113) <span style="color: red;">[prod]</span>

> Mon, Feb 3 2025 | 05:38 PM EST

## [0.5.112](https://github.com/summarizator/fora-frontend/compare/v0.5.111...v0.5.112) <span style="color: red;">[prod]</span>

> Mon, Feb 3 2025 | 05:16 PM EST

### Features

- [FORA-1018](https://foraday.atlassian.net/browse/FORA-1018): FORA notetaker removal and add back
  <details>
    <summary>Commits</summary>

  - [Change status code](https://github.com/summarizator/fora-frontend/commit/947d058c)
  - [Change to isCallEnded for showStartEarlyButton](https://github.com/summarizator/fora-frontend/commit/ce3e8541)
  - [Handle NaN](https://github.com/summarizator/fora-frontend/commit/95e3d72b)
  - [Breakout progress bar into separate component](https://github.com/summarizator/fora-frontend/commit/f5504e45)
  - [Add tests for usePusherChannel](https://github.com/summarizator/fora-frontend/commit/c1a6b169)
  - [Fix broken tests](https://github.com/summarizator/fora-frontend/commit/0a3839da)
  - [refactor isDone and progress bar logic for in-between states](https://github.com/summarizator/fora-frontend/commit/54482974)
  - [Destroy channel if already exists](https://github.com/summarizator/fora-frontend/commit/5aea9ba2)
  - [Invalidate meeting page query after startMeeting](https://github.com/summarizator/fora-frontend/commit/bce53181)
  - [More lint issues](https://github.com/summarizator/fora-frontend/commit/34ff1199)
  - [lint fixes](https://github.com/summarizator/fora-frontend/commit/fdc8a6b6)
  - [Use wasSummarized to show/hide share button](https://github.com/summarizator/fora-frontend/commit/038c97ed)
  - [Use meetings/all querykey in MeetingPage for live reloading](https://github.com/summarizator/fora-frontend/commit/8d5a4238)
  - [cleanup show/hide control bar logic in ReskinMeetingCard](https://github.com/summarizator/fora-frontend/commit/3a170051)
  - [Use insufficentTranscripts to decide when to show add fora back button](https://github.com/summarizator/fora-frontend/commit/cc81e908)
  - [Add tests for useMeetingRecordingStatus](https://github.com/summarizator/fora-frontend/commit/a99b908d)
  - [Remove broken tests](https://github.com/summarizator/fora-frontend/commit/448de2fb)
  - [Add tests](https://github.com/summarizator/fora-frontend/commit/095c0974)
  - [Lint](https://github.com/summarizator/fora-frontend/commit/ebd10e60)
  - [Refactor logic to add fora back to a meeting](https://github.com/summarizator/fora-frontend/commit/d7596a23)
  - [FORA-1018: Add FORA back](https://github.com/summarizator/fora-frontend/commit/4d778cea)

  </details>

### Tasks

- [FORA-1106](https://foraday.atlassian.net/browse/FORA-1106): evaluate fora-frontend error handling
  <details>
    <summary>Commits</summary>

  - [update build script to reserve more memory](https://github.com/summarizator/fora-frontend/commit/abe721c6)
  - [chunk out some node modules to reduce heap overhead](https://github.com/summarizator/fora-frontend/commit/69334361)
  - [add param to script tag](https://github.com/summarizator/fora-frontend/commit/301435cc)
  - [generate source maps with vite and hope rollbar can just pick it up](https://github.com/summarizator/fora-frontend/commit/a29b20e8)
  - [add local_username to yaml to avoid the unknown user ugliness](https://github.com/summarizator/fora-frontend/commit/5c93c0f9)

  </details>

## [0.5.109](https://github.com/summarizator/fora-frontend/compare/v0.5.108...v0.5.109) <span style="color: red;">[prod]</span>

> Mon, Feb 3 2025 | 03:25 PM EST

## [0.5.108](https://github.com/summarizator/fora-frontend/compare/v0.5.107...v0.5.108) <span style="color: red;">[prod]</span>

> Mon, Feb 3 2025 | 03:04 PM EST

## [0.5.107](https://github.com/summarizator/fora-frontend/compare/v0.5.106...v0.5.107) <span style="color: red;">[prod]</span>

> Mon, Feb 3 2025 | 02:58 PM EST

## [0.5.106](https://github.com/summarizator/fora-frontend/compare/v0.5.105...v0.5.106) <span style="color: red;">[prod]</span>

> Sun, Feb 2 2025 | 06:34 PM EST

### Features

- [FORA-1101](https://foraday.atlassian.net/browse/FORA-1101): Meeting count and Time
  <details>
    <summary>Commits</summary>

  - [allow organizers into sensitive meetings](https://github.com/summarizator/fora-frontend/commit/266c61b2)

  </details>

### Bug Fixes

- [FORA-1162](https://foraday.atlassian.net/browse/FORA-1162): stop undefined calls coming from meeting page on load
  <details>
    <summary>Commits</summary>

  - [dont render the views menu if there isnt a meeting yet](https://github.com/summarizator/fora-frontend/commit/3116ad0b)

  </details>

## [0.5.103](https://github.com/summarizator/fora-frontend/compare/v0.5.102...v0.5.103) <span style="color: red;">[prod]</span>

> Sun, Feb 2 2025 | 03:41 PM EST

### Tasks

- [FORA-1106](https://foraday.atlassian.net/browse/FORA-1106): evaluate fora-frontend error handling
  <details>
    <summary>Commits</summary>

  - [add deploy-preview to environment name options](https://github.com/summarizator/fora-frontend/commit/34bd6108)
  - [update rollbar config to include code version and hopefully source maps; also dont auto instrument on localhost](https://github.com/summarizator/fora-frontend/commit/dbb94de3)
  - [migrate catch statement console.logs to use rollbar.error](https://github.com/summarizator/fora-frontend/commit/559b277a)
  - [Merge branch 'dev' of github.com:summarizator/fora-frontend into FORA-1106-better-rollbar](https://github.com/summarizator/fora-frontend/commit/497682df)

  </details>

## [0.5.101](https://github.com/summarizator/fora-frontend/compare/v0.5.100...v0.5.101) <span style="color: red;">[prod]</span>

> Thu, Jan 30 2025 | 03:56 PM EST

### Bug Fixes

- [FORA-1157](https://foraday.atlassian.net/browse/FORA-1157): missing prior meetings section
  <details>
    <summary>Commits</summary>

  - [remove code that was preventing prior meeting section from rendering](https://github.com/summarizator/fora-frontend/commit/d46ccf65)

  </details>

## [0.5.99](https://github.com/summarizator/fora-frontend/compare/v0.5.98...v0.5.99) <span style="color: red;">[prod]</span>

> Thu, Jan 30 2025 | 07:24 PM EST

### Tasks

- [FORA-1106](https://foraday.atlassian.net/browse/FORA-1106): evaluate fora-frontend error handling
  <details>
    <summary>Commits</summary>

  - [update csp header](https://github.com/summarizator/fora-frontend/commit/b0321439)

  </details>

## [0.5.97](https://github.com/summarizator/fora-frontend/compare/v0.5.96...v0.5.97) <span style="color: red;">[prod]</span>

> Wed, Jan 29 2025 | 05:42 PM EST

### Tasks

- [FORA-1106](https://foraday.atlassian.net/browse/FORA-1106): evaluate fora-frontend error handling
  <details>
    <summary>Commits</summary>

  - [special error handler for meeting page fetch data](https://github.com/summarizator/fora-frontend/commit/fe275c19)
  - [update rollbar config options](https://github.com/summarizator/fora-frontend/commit/1e8f275d)

  </details>

## [0.5.95](https://github.com/summarizator/fora-frontend/compare/v0.5.94...v0.5.95) <span style="color: red;">[prod]</span>

> Tue, Jan 28 2025 | 04:08 PM EST

### Bug Fixes

- [FORA-1119](https://foraday.atlassian.net/browse/FORA-1119): disable MeetingChat for guest users
  <details>
    <summary>Commits</summary>

  - [disable meeting chat for guest users](https://github.com/summarizator/fora-frontend/commit/8ae5d41a)
  - [:wq!](https://github.com/summarizator/fora-frontend/commit/98968db5)

  </details>

- [FORA-1129](https://foraday.atlassian.net/browse/FORA-1129): Insights and lenses visual bug
  <details>
    <summary>Commits</summary>

  - [Rename to fora-lenses.section.test](https://github.com/summarizator/fora-frontend/commit/928325de)
  - [Point to lcov.info file](https://github.com/summarizator/fora-frontend/commit/f4de072e)
  - [fix lint errors](https://github.com/summarizator/fora-frontend/commit/87791fda)
  - [refactor and write tests](https://github.com/summarizator/fora-frontend/commit/b9929ae1)
  - [Only show max 2 columns in grid](https://github.com/summarizator/fora-frontend/commit/19d4ffbf)
  - [Set a minH on the match_prompt Text box](https://github.com/summarizator/fora-frontend/commit/02c7f65d)

  </details>

### Features

- [FORA-1078](https://foraday.atlassian.net/browse/FORA-1078): FE: Roll out Feature Flag Solution
  <details>
    <summary>Commits</summary>

  - [fix test assertion](https://github.com/summarizator/fora-frontend/commit/16783f74)
  - [pre push hook warning fix](https://github.com/summarizator/fora-frontend/commit/ea7f41dc)
  - [add test for bootstrap helpers (and fix guest case)](https://github.com/summarizator/fora-frontend/commit/2f008725)
  - [un feature flag custom summaries](https://github.com/summarizator/fora-frontend/commit/b0b06c49)
  - [un-feature flag the lenses panel](https://github.com/summarizator/fora-frontend/commit/07895f72)
  - [pre push hook warnings](https://github.com/summarizator/fora-frontend/commit/f1f2d9e3)
  - [reimplement statsig and change feature flag strategy](https://github.com/summarizator/fora-frontend/commit/a0bbb619)
  - [Merge branch 'dev' of github.com:summarizator/fora-frontend into dev](https://github.com/summarizator/fora-frontend/commit/06746328)

  </details>

- [FORA-1134](https://foraday.atlassian.net/browse/FORA-1134): Use statsig for custom summary feature flag
  <details>
    <summary>Commits</summary>

  - [lint](https://github.com/summarizator/fora-frontend/commit/56baf259)
  - [refactor to wait for client to be initialized](https://github.com/summarizator/fora-frontend/commit/f8a0265d)
  - [statsig - Wrap fields in custom block to use as custom field in rules](https://github.com/summarizator/fora-frontend/commit/4591ac9f)
  - [Use custom-summaries gate value in personal-summary-section](https://github.com/summarizator/fora-frontend/commit/16eed061)

  </details>

## [0.5.90](https://github.com/summarizator/fora-frontend/compare/v0.5.89...v0.5.90) <span style="color: red;">[prod]</span>

> Mon, Jan 27 2025 | 06:53 PM EST

### Features

- [FORA-1030](https://foraday.atlassian.net/browse/FORA-1030): generate custom summary from chat
  <details>
    <summary>Commits</summary>

  - [fix test and make linter happy](https://github.com/summarizator/fora-frontend/commit/8009dcfa)
  - [remove comment](https://github.com/summarizator/fora-frontend/commit/e5038148)
  - [make button red](https://github.com/summarizator/fora-frontend/commit/958106da)
  - [show newly created card when closing custom sumamry ask window](https://github.com/summarizator/fora-frontend/commit/d83e3f13)
  - [arrive at unit test promised land](https://github.com/summarizator/fora-frontend/commit/11f4959f)
  - [add meeting date to chat header on fullscreen](https://github.com/summarizator/fora-frontend/commit/6167f077)
  - [Merge branch 'dev' of github.com:summarizator/fora-frontend into FORA-1030-custom-summary-chat](https://github.com/summarizator/fora-frontend/commit/316e6cdd)
  - [better title editing handling](https://github.com/summarizator/fora-frontend/commit/7926ae04)
  - [disable save template button if nothing has been generated yet](https://github.com/summarizator/fora-frontend/commit/67529666)
  - [rename custom summary menu](https://github.com/summarizator/fora-frontend/commit/27d37fd3)
  - [correctly pass sources to sls fxn on initialization from fullscreen mode](https://github.com/summarizator/fora-frontend/commit/c8637a72)
  - [display meeting title in fullscreen mode](https://github.com/summarizator/fora-frontend/commit/8900f0aa)
  - [checkpoint](https://github.com/summarizator/fora-frontend/commit/12305dfc)
  - [one more before claude cut me off](https://github.com/summarizator/fora-frontend/commit/b9bc7543)
  - [checkpoint!](https://github.com/summarizator/fora-frontend/commit/43a638f9)
  - [custom summary](https://github.com/summarizator/fora-frontend/commit/56cc7efb)
  - [no need to lint test files](https://github.com/summarizator/fora-frontend/commit/08ffd826)
  - [test checkpoint - top level wrapper functions](https://github.com/summarizator/fora-frontend/commit/9a9b7aff)
  - [warnings](https://github.com/summarizator/fora-frontend/commit/082207e0)
  - [unit tests for the store files](https://github.com/summarizator/fora-frontend/commit/2e0b0566)
  - [Merge branch 'dev' of github.com:summarizator/fora-frontend into FORA-1030-custom-summary-chat](https://github.com/summarizator/fora-frontend/commit/5cea17fa)
  - [more warnings](https://github.com/summarizator/fora-frontend/commit/168f61a6)
  - [buncha little things](https://github.com/summarizator/fora-frontend/commit/f61fc2f9)
  - [fix toast zindex issue](https://github.com/summarizator/fora-frontend/commit/4d6c71ff)
  - [warning fix](https://github.com/summarizator/fora-frontend/commit/3f6407f6)
  - [back in business](https://github.com/summarizator/fora-frontend/commit/19a5a51f)
  - [MMMerge branch 'dev' of github.com:summarizator/fora-frontend into FORA-1030-custom-summary-chat](https://github.com/summarizator/fora-frontend/commit/b8210a82)
  - [another lint](https://github.com/summarizator/fora-frontend/commit/ae2ee389)
  - [linter](https://github.com/summarizator/fora-frontend/commit/f89611e9)
  - [we are in business](https://github.com/summarizator/fora-frontend/commit/7361058f)
  - [merge in dev](https://github.com/summarizator/fora-frontend/commit/622477e3)
  - [checkpoint - waiting on some minor design and minor BE changes to continue](https://github.com/summarizator/fora-frontend/commit/24ef9bd4)
  - [missed one](https://github.com/summarizator/fora-frontend/commit/c0364c37)
  - [RIP warnings](https://github.com/summarizator/fora-frontend/commit/0f2b5f71)
  - [clear chat button and begin work on actually saving as template](https://github.com/summarizator/fora-frontend/commit/184ede45)
  - [chat up and running](https://github.com/summarizator/fora-frontend/commit/cda00da1)
  - [another spot](https://github.com/summarizator/fora-frontend/commit/8b204619)
  - [missed a spot](https://github.com/summarizator/fora-frontend/commit/77e6b355)
  - [merge in dev](https://github.com/summarizator/fora-frontend/commit/f62fb7fa)
  - [checkpoint](https://github.com/summarizator/fora-frontend/commit/66c30259)
  - [open separate chat instance from menu](https://github.com/summarizator/fora-frontend/commit/97647e54)
  - [merge in dev](https://github.com/summarizator/fora-frontend/commit/19cc5238)
  - [a pattern that will actually work?](https://github.com/summarizator/fora-frontend/commit/5eaddcfb)
  - [random checkpoint, how to deal with stores that initialize differently?](https://github.com/summarizator/fora-frontend/commit/6e9e1bcf)
  - [rename meeting chat store file](https://github.com/summarizator/fora-frontend/commit/b4f36e97)

  </details>

## [0.5.88](https://github.com/summarizator/fora-frontend/compare/v0.5.87...v0.5.88) <span style="color: red;">[prod]</span>

> Mon, Jan 27 2025 | 04:08 PM EST

### Features

- [FORA-1141](https://foraday.atlassian.net/browse/FORA-1141): Setup skullcandy okta setup
  <details>
    <summary>Commits</summary>

  - [Setup skullcandy okta configuration](https://github.com/summarizator/fora-frontend/commit/209ea08a)

  </details>

## [0.5.86](https://github.com/summarizator/fora-frontend/compare/v0.5.85...v0.5.86) <span style="color: red;">[prod]</span>

> Sun, Jan 26 2025 | 05:06 PM EST

### Features

- [FORA-1067](https://foraday.atlassian.net/browse/FORA-1067): Increase the scrollable text area
  <details>
    <summary>Commits</summary>

  - [FORA-1067: Increase preview height / Modal top|bottom margin to 24px](https://github.com/summarizator/fora-frontend/commit/f2cf2fce)

  </details>

- [FORA-1137](https://foraday.atlassian.net/browse/FORA-1137): host code coverage report in PR
  <details>
    <summary>Commits</summary>

  - [Remove console log](https://github.com/summarizator/fora-frontend/commit/4203cf89)
  - [Remove code-coverage script](https://github.com/summarizator/fora-frontend/commit/74b95882)
  - [Try with sonar](https://github.com/summarizator/fora-frontend/commit/0ff64e48)
  - [combine into 1 step](https://github.com/summarizator/fora-frontend/commit/f9e5b659)
  - [Change to github-pages-deploy-action](https://github.com/summarizator/fora-frontend/commit/953fcef4)
  - [generate report by branch and comment on PR](https://github.com/summarizator/fora-frontend/commit/57480ffb)
  - [Use continue-on-error](https://github.com/summarizator/fora-frontend/commit/4e9f48d4)
  - [Add console for testing](https://github.com/summarizator/fora-frontend/commit/12d9e4bd)
  - [Add pull-requests permission](https://github.com/summarizator/fora-frontend/commit/c2fda42a)
  - [add permission](https://github.com/summarizator/fora-frontend/commit/ec546b22)
  - [Use checkout v4](https://github.com/summarizator/fora-frontend/commit/0ae45e42)
  - [Remove continue-on-error](https://github.com/summarizator/fora-frontend/commit/7625200d)
  - [Generate github page after running the code coverage action](https://github.com/summarizator/fora-frontend/commit/a8862963)

  </details>

### Bug Fixes

- [FORA-1061](https://foraday.atlassian.net/browse/FORA-1061): Change to fora blue
  <details>
    <summary>Commits</summary>

  - [FORA-1061: Agenda prep link color](https://github.com/summarizator/fora-frontend/commit/02ddd19a)

  </details>

## [0.5.82](https://github.com/summarizator/fora-frontend/compare/v0.5.81...v0.5.82) <span style="color: red;">[prod]</span>

> Fri, Jan 24 2025 | 11:15 AM EST

### Bug Fixes

- [FORA-1130](https://foraday.atlassian.net/browse/FORA-1130): missing video player on mobile
  <details>
    <summary>Commits</summary>

  - [Add back missing video player](https://github.com/summarizator/fora-frontend/commit/ec1e9b4a)

  </details>

- [FORA-1128](https://foraday.atlassian.net/browse/FORA-1128): Meeting Page slow rendering
  <details>
    <summary>Commits</summary>

  - [`LoadingScreen`: add `titleRef` to dependency array](https://github.com/summarizator/fora-frontend/commit/ecf4ae4d)
  - [`DetailedSummary`: default `enabled` to `true`](https://github.com/summarizator/fora-frontend/commit/c6e410af)
  - [only ever render one summary card, render right rail after main, willChange](https://github.com/summarizator/fora-frontend/commit/45d4c0b5)

  </details>

- [FORA-1122](https://foraday.atlassian.net/browse/FORA-1122): Fix slider on create lens form
  <details>
    <summary>Commits</summary>

  - [Fix workflow issue](https://github.com/summarizator/fora-frontend/commit/7ac2a529)
  - [Change slider size to lg](https://github.com/summarizator/fora-frontend/commit/05164cbe)

  </details>

### Features

- [FORA-1079](https://foraday.atlassian.net/browse/FORA-1079): Enforcing unit-tests for PRs
  <details>
    <summary>Commits</summary>

  - [change to coverage](https://github.com/summarizator/fora-frontend/commit/7809833b)
  - [rollback to original implementation](https://github.com/summarizator/fora-frontend/commit/c7a23983)
  - [Rename code coverage](https://github.com/summarizator/fora-frontend/commit/d63d8a44)
  - [Update name](https://github.com/summarizator/fora-frontend/commit/b73910b1)
  - [Combine workflow_dispatch into 1 job](https://github.com/summarizator/fora-frontend/commit/1141dae3)
  - [Add manual aproval workflow_dispatch step](https://github.com/summarizator/fora-frontend/commit/4004e81c)
  - [Get package-lock in sync](https://github.com/summarizator/fora-frontend/commit/f8f95527)
  - [merge](https://github.com/summarizator/fora-frontend/commit/d275cc56)
  - [Update README](https://github.com/summarizator/fora-frontend/commit/923a50f2)
  - [Add conditional for no changed files](https://github.com/summarizator/fora-frontend/commit/6c6b524c)
  - [Change name](https://github.com/summarizator/fora-frontend/commit/ad5f1719)
  - [Remove comment](https://github.com/summarizator/fora-frontend/commit/6c0a1a41)
  - [Remove exclude](https://github.com/summarizator/fora-frontend/commit/03aeca0a)
  - [Remove pusher hook comment](https://github.com/summarizator/fora-frontend/commit/02827bef)
  - [Attempt exclude of file](https://github.com/summarizator/fora-frontend/commit/1e87b575)
  - [Set files with --coverage.include=](https://github.com/summarizator/fora-frontend/commit/0cc074bc)
  - [Add another file](https://github.com/summarizator/fora-frontend/commit/dc1b4b81)
  - [Add list-files config](https://github.com/summarizator/fora-frontend/commit/25f4b58b)
  - [Update action again](https://github.com/summarizator/fora-frontend/commit/16ba82ff)
  - [Update action](https://github.com/summarizator/fora-frontend/commit/f31c7392)
  - [Commit a change for testing](https://github.com/summarizator/fora-frontend/commit/d5ae31c5)
  - [Add test coverage report through v8](https://github.com/summarizator/fora-frontend/commit/66d85346)

  </details>

## [0.5.77](https://github.com/summarizator/fora-frontend/compare/v0.5.76...v0.5.77) <span style="color: red;">[prod]</span>

> Thu, Jan 23 2025 | 12:06 AM EST

### Bug Fixes

- [FORA-1121](https://foraday.atlassian.net/browse/FORA-1121): Joe Test Bug
  <details>
    <summary>Commits</summary>

  - [add the merge back nowzz](https://github.com/summarizator/fora-frontend/commit/10c15eef)
  - [add the merge back now](https://github.com/summarizator/fora-frontend/commit/3e264fc6)
  - [Merge branch 'app' into FORA-1121-Joe-Test-Bug](https://github.com/summarizator/fora-frontend/commit/83ca4a7b)
  - [chore: update changelog for production release v0.5.75](https://github.com/summarizator/fora-frontend/commit/0d010e89)
  - [chore: release 0.5.75](https://github.com/summarizator/fora-frontend/commit/236b32b8)
  - [Merge pull request #1175 from summarizator/dev](https://github.com/summarizator/fora-frontend/commit/403170e3)

  </details>

## [0.5.75](https://github.com/summarizator/fora-frontend/compare/v0.5.74...v0.5.75) <span style="color: red;">[prod]</span>

> Thu, Jan 23 2025 | 11:19 PM EST

### Features

- [FORA-1077](https://foraday.atlassian.net/browse/FORA-1077): FE: Integrate Release-It to github actions flow
  <details>
    <summary>Commits</summary>

  - [Merge branch 'app' into FORA-1077-FE-Integrate-Release-It-to-github-actions-flow](https://github.com/summarizator/fora-frontend/commit/8643f4b8)
  - [commit 4](https://github.com/summarizator/fora-frontend/commit/c87beffa)
  - [Merge pull request #1173 from summarizator/dev](https://github.com/summarizator/fora-frontend/commit/6adaa601)
  - [Merge branch 'app' into FORA-1077-FE-Integrate-Release-It-to-github-actions-flow](https://github.com/summarizator/fora-frontend/commit/cc260af4)
  - [chore: update changelog for production release v0.5.72](https://github.com/summarizator/fora-frontend/commit/8c4f1206)
  - [chore: release 0.5.72](https://github.com/summarizator/fora-frontend/commit/c1914fbe)
  - [Merge pull request #1170 from summarizator/dev](https://github.com/summarizator/fora-frontend/commit/47c8bca8)
  - [caches](https://github.com/summarizator/fora-frontend/commit/75297382)
  - [maybe finally](https://github.com/summarizator/fora-frontend/commit/f951eb46)
  - [chore: release 0.5.61](https://github.com/summarizator/fora-frontend/commit/34a27f86)
  - [chore: release 0.5.60](https://github.com/summarizator/fora-frontend/commit/205cf6bb)
  - [chore: release 0.5.59](https://github.com/summarizator/fora-frontend/commit/b8ce3830)
  - [chore: release 0.5.58](https://github.com/summarizator/fora-frontend/commit/7196a14f)
  - [chore: release 0.5.57](https://github.com/summarizator/fora-frontend/commit/5e6f6c3e)
  - [chore: release 0.5.56](https://github.com/summarizator/fora-frontend/commit/2641b805)
  - [chore: release 0.5.55](https://github.com/summarizator/fora-frontend/commit/90dea734)
  - [chore: release 0.5.54](https://github.com/summarizator/fora-frontend/commit/c8bd5549)
  - [chore: release 0.5.53](https://github.com/summarizator/fora-frontend/commit/8702254c)
  - [chore: release 0.5.52](https://github.com/summarizator/fora-frontend/commit/7b035fed)
  - [chore: release 0.5.51](https://github.com/summarizator/fora-frontend/commit/ae71451f)
  - [chore: release 0.5.50](https://github.com/summarizator/fora-frontend/commit/58f8c159)
  - [ugh](https://github.com/summarizator/fora-frontend/commit/8505a73a)
  - [chore: update changelog for production release v0.5.49](https://github.com/summarizator/fora-frontend/commit/df6ee29c)
  - [chore: release 0.5.49](https://github.com/summarizator/fora-frontend/commit/c41529fb)
  - [Merge pull request #1163 from summarizator/dev](https://github.com/summarizator/fora-frontend/commit/289df588)
  - [zzzz222](https://github.com/summarizator/fora-frontend/commit/6e2ae365)
  - [zzzz](https://github.com/summarizator/fora-frontend/commit/951ca70a)
  - [chore: update changelog for production release v0.5.47](https://github.com/summarizator/fora-frontend/commit/94dafc05)
  - [chore: release 0.5.47](https://github.com/summarizator/fora-frontend/commit/183339bc)
  - [Merge pull request #1161 from summarizator/dev](https://github.com/summarizator/fora-frontend/commit/69cfcf27)
  - [maybe fix for prod job](https://github.com/summarizator/fora-frontend/commit/8a11074e)
  - [maybe fix for prod job](https://github.com/summarizator/fora-frontend/commit/7464a06c)
  - [chore: update changelog for production release v0.5.45](https://github.com/summarizator/fora-frontend/commit/d263b855)
  - [chore: release 0.5.45](https://github.com/summarizator/fora-frontend/commit/59639faa)
  - [Merge pull request #1159 from summarizator/dev](https://github.com/summarizator/fora-frontend/commit/af095ba7)
  - [Merge pull request #1157 from summarizator/dev](https://github.com/summarizator/fora-frontend/commit/a1b746a8)
  - [Merge pull request #1148 from summarizator/dev](https://github.com/summarizator/fora-frontend/commit/114e049b)
  - [maybe fix for prod job](https://github.com/summarizator/fora-frontend/commit/7f4efa61)
  - [use cache for prod job too](https://github.com/summarizator/fora-frontend/commit/8fb0bc20)
  - [perhaps prod changes 3](https://github.com/summarizator/fora-frontend/commit/5a886e4f)
  - [perhaps prod changes 3](https://github.com/summarizator/fora-frontend/commit/2d166700)
  - [commit 2](https://github.com/summarizator/fora-frontend/commit/f2314527)
  - [commit 1](https://github.com/summarizator/fora-frontend/commit/2c82ec3e)
  - [aaaaanotherz](https://github.com/summarizator/fora-frontend/commit/a612e1e5)
  - [chore: release 0.5.39](https://github.com/summarizator/fora-frontend/commit/6c21fbb5)
  - [chore: release 0.5.36](https://github.com/summarizator/fora-frontend/commit/c46d914f)
  - [](https://github.com/summarizator/fora-frontend/commit/)
  - [](https://github.com/summarizator/fora-frontend/commit/)
  - [](https://github.com/summarizator/fora-frontend/commit/)
  - [chore: release 0.5.27](https://github.com/summarizator/fora-frontend/commit/5879296f)
  - [logz](https://github.com/summarizator/fora-frontend/commit/780e7fa6)
  - [logz](https://github.com/summarizator/fora-frontend/commit/625aee98)
  - [chore: release 0.5.26](https://github.com/summarizator/fora-frontend/commit/0a936731)
  - [chore: release 0.5.25](https://github.com/summarizator/fora-frontend/commit/3f677031)
  - [chore: release 0.5.24](https://github.com/summarizator/fora-frontend/commit/3aa63c2c)
  - [chore: release 0.5.23](https://github.com/summarizator/fora-frontend/commit/e31e8d5f)
  - [chore: release 0.5.18](https://github.com/summarizator/fora-frontend/commit/56f9d7ec)
  - [chore: release 0.5.17](https://github.com/summarizator/fora-frontend/commit/2bec2ac9)
  - [chore: release 0.5.16](https://github.com/summarizator/fora-frontend/commit/1ce7c9e9)
  - [cool new readme](https://github.com/summarizator/fora-frontend/commit/bba4c6ed)

  </details>

- [FORA-878](https://foraday.atlassian.net/browse/FORA-878): Allow category change on recent page
  <details>
    <summary>Commits</summary>

  - [](https://github.com/summarizator/fora-frontend/commit/)

  </details>

- [FORA-1085](https://foraday.atlassian.net/browse/FORA-1085): Create Summary modal
  <details>
    <summary>Commits</summary>

  - [](https://github.com/summarizator/fora-frontend/commit/)

  </details>

- [FORA-1066](https://foraday.atlassian.net/browse/FORA-1066): SPIKE - Okta Integration
  <details>
    <summary>Commits</summary>

  - [](https://github.com/summarizator/fora-frontend/commit/)

  </details>

- [FORA-840](https://foraday.atlassian.net/browse/FORA-840): Integrate Release-It to FE Repo
  <details>
    <summary>Commits</summary>

  - [chore: release 0.5.14](https://github.com/summarizator/fora-frontend/commit/88fee98e)
  - [chore: release 0.5.13](https://github.com/summarizator/fora-frontend/commit/f11b546c)
  - [chore: release 0.5.12](https://github.com/summarizator/fora-frontend/commit/9dc77c8a)
  - [chore: release 0.5.11](https://github.com/summarizator/fora-frontend/commit/10c35a54)
  - [chore: release 0.5.10](https://github.com/summarizator/fora-frontend/commit/8ee45320)
  - [chore: release 0.5.9](https://github.com/summarizator/fora-frontend/commit/b2ae433b)
  - [chore: release 0.5.8](https://github.com/summarizator/fora-frontend/commit/ceed34d9)
  - [chore: release 0.5.7](https://github.com/summarizator/fora-frontend/commit/53d84d35)
  - [chore: release 0.5.6](https://github.com/summarizator/fora-frontend/commit/0d250ed2)
  - [chore: release 0.5.5](https://github.com/summarizator/fora-frontend/commit/bf541008)
  - [chore: release 0.5.4](https://github.com/summarizator/fora-frontend/commit/9c37c293)
  - [chore: release 0.5.3](https://github.com/summarizator/fora-frontend/commit/f7d4bfe8)
  - [chore: release 0.5.2](https://github.com/summarizator/fora-frontend/commit/bf4a84db)
  - [chore: release 0.5.1](https://github.com/summarizator/fora-frontend/commit/aadf74d3)
  - [chore: release 0.5.2](https://github.com/summarizator/fora-frontend/commit/6b514330)
  - [chore: release 0.6.11](https://github.com/summarizator/fora-frontend/commit/ece60a67)
  - [chore: release 0.6.10](https://github.com/summarizator/fora-frontend/commit/2de1bedb)
  - [chore: release 0.6.9](https://github.com/summarizator/fora-frontend/commit/53b8f5ca)
  - [chore: release 0.6.8](https://github.com/summarizator/fora-frontend/commit/7798ad1d)
  - [chore: release 0.6.7](https://github.com/summarizator/fora-frontend/commit/f886470d)
  - [chore: release 0.6.6](https://github.com/summarizator/fora-frontend/commit/330eb03c)
  - [chore: release 0.6.5](https://github.com/summarizator/fora-frontend/commit/6787b64c)
  - [chore: release 0.6.4](https://github.com/summarizator/fora-frontend/commit/5a0fa3e6)
  - [chore: release 0.6.3](https://github.com/summarizator/fora-frontend/commit/6f8abded)
  - [Merge branch 'dev' into FORA-840](https://github.com/summarizator/fora-frontend/commit/c6bb1a7a)
  - [chore: release 0.6.1](https://github.com/summarizator/fora-frontend/commit/a9f1d7e6)
  - [chore: release 0.6.0](https://github.com/summarizator/fora-frontend/commit/6d5b7351)
  - [Merge branch 'dev' of github.com:summarizator/fora-frontend into FORA-840](https://github.com/summarizator/fora-frontend/commit/06ad38b4)
  - [try to kill all warnings](https://github.com/summarizator/fora-frontend/commit/7b1f20bb)
  - [add linting to pre-push](https://github.com/summarizator/fora-frontend/commit/0763edf0)
  - [add linting to pre-push](https://github.com/summarizator/fora-frontend/commit/963ff2f0)
  - [fix lint](https://github.com/summarizator/fora-frontend/commit/a8d262df)
  - [test](https://github.com/summarizator/fora-frontend/commit/e3f4e99b)
  - [clean](https://github.com/summarizator/fora-frontend/commit/fcedb650)
  - [fixes](https://github.com/summarizator/fora-frontend/commit/9d05113a)
  - [chore: release 0.5.15](https://github.com/summarizator/fora-frontend/commit/989f6fa9)
  - [chore: release 0.5.14](https://github.com/summarizator/fora-frontend/commit/42ad3861)
  - [Merge branch 'dev' into FORA-840](https://github.com/summarizator/fora-frontend/commit/df1530e1)
  - [chore: release 0.5.13](https://github.com/summarizator/fora-frontend/commit/10932202)
  - [chore: release 0.5.12](https://github.com/summarizator/fora-frontend/commit/92dcd324)
  - [fixes](https://github.com/summarizator/fora-frontend/commit/b27af8e0)
  - [build stuff](https://github.com/summarizator/fora-frontend/commit/3c72984b)
  - [think its working](https://github.com/summarizator/fora-frontend/commit/85c70b83)
  - [think its working](https://github.com/summarizator/fora-frontend/commit/3bbd19d3)
  - [Merge branch 'dev' into FORA-840](https://github.com/summarizator/fora-frontend/commit/601022d4)
  - [think its working](https://github.com/summarizator/fora-frontend/commit/70f85e94)
  - [chore: release 0.5.11](https://github.com/summarizator/fora-frontend/commit/f231b109)
  - [chore: release 0.5.10](https://github.com/summarizator/fora-frontend/commit/2b3663f4)
  - [chore: release 0.5.9](https://github.com/summarizator/fora-frontend/commit/b2cc8d94)
  - [chore: release 0.5.8](https://github.com/summarizator/fora-frontend/commit/dbb82f0d)
  - [chore: release 0.5.7](https://github.com/summarizator/fora-frontend/commit/a7712fb6)
  - [chore: release 0.5.6](https://github.com/summarizator/fora-frontend/commit/c6b905b6)
  - [untested prod function](https://github.com/summarizator/fora-frontend/commit/254f8fe4)
  - [chore: release 0.5.5](https://github.com/summarizator/fora-frontend/commit/c61eed54)
  - [start concept of dev and prod releases](https://github.com/summarizator/fora-frontend/commit/e288b500)
  - [chore: release 0.5.4](https://github.com/summarizator/fora-frontend/commit/bb2a5ef1)
  - [chore: release 0.5.3](https://github.com/summarizator/fora-frontend/commit/3c1e584e)
  - [chore: release 0.5.2](https://github.com/summarizator/fora-frontend/commit/b79edc4b)
  - [chore: release 0.5.1](https://github.com/summarizator/fora-frontend/commit/8a7be26f)
  - [rm commit message hook](https://github.com/summarizator/fora-frontend/commit/59e2d658)
  - [fix: json writing](https://github.com/summarizator/fora-frontend/commit/eab3c626)
  - [chore: release 0.15.28](https://github.com/summarizator/fora-frontend/commit/200f276c)
  - [chore: release 0.15.27](https://github.com/summarizator/fora-frontend/commit/8c35ce2c)
  - [chore: release 0.15.25](https://github.com/summarizator/fora-frontend/commit/41d91fe7)
  - [chore: release 0.15.24](https://github.com/summarizator/fora-frontend/commit/f8b43f75)
  - [chore: release 0.15.23](https://github.com/summarizator/fora-frontend/commit/2d8850c7)
  - [chore: release 0.15.22](https://github.com/summarizator/fora-frontend/commit/c0970bcc)
  - [chore: release 0.15.21](https://github.com/summarizator/fora-frontend/commit/29d219d0)
  - [chore: release 0.15.20](https://github.com/summarizator/fora-frontend/commit/da361273)
  - [fix: json writing](https://github.com/summarizator/fora-frontend/commit/16c1a997)
  - [chore: release 0.15.19](https://github.com/summarizator/fora-frontend/commit/c06bd710)
  - [chore: release 0.15.18](https://github.com/summarizator/fora-frontend/commit/e8729ef2)
  - [chore: release 0.15.17](https://github.com/summarizator/fora-frontend/commit/9c5889e0)
  - [chore: release 0.15.16](https://github.com/summarizator/fora-frontend/commit/74b14f5b)
  - [chore: release 0.15.15](https://github.com/summarizator/fora-frontend/commit/cfb51171)
  - [chore: release 0.15.14](https://github.com/summarizator/fora-frontend/commit/05185594)
  - [chore: release 0.15.13](https://github.com/summarizator/fora-frontend/commit/b104e115)
  - [chore: release 0.15.12](https://github.com/summarizator/fora-frontend/commit/632914ae)
  - [chore: release 0.15.11](https://github.com/summarizator/fora-frontend/commit/2c5ba71e)
  - [fix: looks like i want it to](https://github.com/summarizator/fora-frontend/commit/ac551328)
  - [chore: release 0.15.9](https://github.com/summarizator/fora-frontend/commit/b4e4b927)
  - [chore: release 0.15.8](https://github.com/summarizator/fora-frontend/commit/8ea004e1)
  - [chore: release 0.15.7](https://github.com/summarizator/fora-frontend/commit/25eea181)
  - [chore: release 0.15.6](https://github.com/summarizator/fora-frontend/commit/c4d8839e)
  - [chore: release 0.15.5](https://github.com/summarizator/fora-frontend/commit/724d618e)
  - [chore: release 0.15.4](https://github.com/summarizator/fora-frontend/commit/fb3ed7e2)
  - [chore: release 0.15.3](https://github.com/summarizator/fora-frontend/commit/de1a6c17)
  - [fix: some more edits](https://github.com/summarizator/fora-frontend/commit/828b63f9)
  - [chore: release 0.15.0](https://github.com/summarizator/fora-frontend/commit/8d1f5e03)
  - [fix: some more edits](https://github.com/summarizator/fora-frontend/commit/421858f9)
  - [fix: some more edits](https://github.com/summarizator/fora-frontend/commit/9a7a0e95)
  - [fix: got it](https://github.com/summarizator/fora-frontend/commit/1251fdb4)
  - [chore: release 0.14.0](https://github.com/summarizator/fora-frontend/commit/de185c95)
  - [chore: release 0.13.0](https://github.com/summarizator/fora-frontend/commit/ed9cf8fd)
  - [chore: release 0.12.0](https://github.com/summarizator/fora-frontend/commit/1b1d868d)
  - [chore: release 0.11.0](https://github.com/summarizator/fora-frontend/commit/0ad82baa)
  - [chore: release 0.10.0](https://github.com/summarizator/fora-frontend/commit/b6e2da3f)
  - [chore: release 0.9.0](https://github.com/summarizator/fora-frontend/commit/37594ba8)
  - [chore: release 0.8.0](https://github.com/summarizator/fora-frontend/commit/60a50f28)
  - [chore: release 0.7.0](https://github.com/summarizator/fora-frontend/commit/dd08fbab)
  - [chore: release 0.6.0](https://github.com/summarizator/fora-frontend/commit/037a9275)
  - [fix: some more readme formatting for dates](https://github.com/summarizator/fora-frontend/commit/f3ea4051)
  - [fix: some more readme formatting](https://github.com/summarizator/fora-frontend/commit/27b0c0be)
  - [fix: maybe fix release flow](https://github.com/summarizator/fora-frontend/commit/8f8fa992)
  - [chore: maybe move pre-push check](https://github.com/summarizator/fora-frontend/commit/396b69c2)
  - [fix: maybe fix branch naming](https://github.com/summarizator/fora-frontend/commit/2ebf827e)
  - [feat: test feature here](https://github.com/summarizator/fora-frontend/commit/9f4ba6ff)
  - [fix: husky hook](https://github.com/summarizator/fora-frontend/commit/09b68c85)
  - [test husky](https://github.com/summarizator/fora-frontend/commit/017494c1)
  - [test husky](https://github.com/summarizator/fora-frontend/commit/2dbd3a41)
  - [chore: release 0.5.3](https://github.com/summarizator/fora-frontend/commit/39be00fb)
  - [chore: release 0.5.2](https://github.com/summarizator/fora-frontend/commit/1b46922f)
  - [start of releaseit](https://github.com/summarizator/fora-frontend/commit/ac2c95bf)
  - [chore: release v0.5.1](https://github.com/summarizator/fora-frontend/commit/ffeb29d4)
  - [build info plugin](https://github.com/summarizator/fora-frontend/commit/7c82d728)

  </details>

### Bug Fixes

- [FORA-1117](https://foraday.atlassian.net/browse/FORA-1117): broken guest user flow
  <details>
    <summary>Commits</summary>

  - [chore: release 0.5.37](https://github.com/summarizator/fora-frontend/commit/8c83d46c)

  </details>

- [FORA-1115](https://foraday.atlassian.net/browse/FORA-1115): Add padding on meeting detail page
  <details>
    <summary>Commits</summary>

  - [](https://github.com/summarizator/fora-frontend/commit/)

  </details>

- [FORA-1114](https://foraday.atlassian.net/browse/FORA-1114): remove duplicate fora lenses
  <details>
    <summary>Commits</summary>

  - [](https://github.com/summarizator/fora-frontend/commit/)

  </details>

## [0.5.72](https://github.com/summarizator/fora-frontend/compare/v0.5.71...v0.5.72) <span style="color: red;">[prod]</span>

> Fri, Jan 24 2025 | 10:37 PM EST

### Features

- [FORA-1077](https://foraday.atlassian.net/browse/FORA-1077): FE: Integrate Release-It to github actions flow
  <details>
    <summary>Commits</summary>

  - [caches](https://github.com/summarizator/fora-frontend/commit/75297382)
  - [maybe finally](https://github.com/summarizator/fora-frontend/commit/f951eb46)
  - [chore: release 0.5.61](https://github.com/summarizator/fora-frontend/commit/34a27f86)
  - [chore: release 0.5.60](https://github.com/summarizator/fora-frontend/commit/205cf6bb)
  - [chore: release 0.5.59](https://github.com/summarizator/fora-frontend/commit/b8ce3830)
  - [chore: release 0.5.58](https://github.com/summarizator/fora-frontend/commit/7196a14f)
  - [chore: release 0.5.57](https://github.com/summarizator/fora-frontend/commit/5e6f6c3e)
  - [chore: release 0.5.56](https://github.com/summarizator/fora-frontend/commit/2641b805)
  - [chore: release 0.5.55](https://github.com/summarizator/fora-frontend/commit/90dea734)
  - [chore: release 0.5.54](https://github.com/summarizator/fora-frontend/commit/c8bd5549)
  - [chore: release 0.5.53](https://github.com/summarizator/fora-frontend/commit/8702254c)
  - [chore: release 0.5.52](https://github.com/summarizator/fora-frontend/commit/7b035fed)
  - [chore: release 0.5.51](https://github.com/summarizator/fora-frontend/commit/ae71451f)
  - [chore: release 0.5.50](https://github.com/summarizator/fora-frontend/commit/58f8c159)
  - [ugh](https://github.com/summarizator/fora-frontend/commit/8505a73a)
  - [chore: update changelog for production release v0.5.49](https://github.com/summarizator/fora-frontend/commit/df6ee29c)
  - [chore: release 0.5.49](https://github.com/summarizator/fora-frontend/commit/c41529fb)
  - [Merge pull request #1163 from summarizator/dev](https://github.com/summarizator/fora-frontend/commit/289df588)
  - [zzzz222](https://github.com/summarizator/fora-frontend/commit/6e2ae365)
  - [zzzz](https://github.com/summarizator/fora-frontend/commit/951ca70a)
  - [chore: update changelog for production release v0.5.47](https://github.com/summarizator/fora-frontend/commit/94dafc05)
  - [chore: release 0.5.47](https://github.com/summarizator/fora-frontend/commit/183339bc)
  - [Merge pull request #1161 from summarizator/dev](https://github.com/summarizator/fora-frontend/commit/69cfcf27)
  - [maybe fix for prod job](https://github.com/summarizator/fora-frontend/commit/8a11074e)
  - [maybe fix for prod job](https://github.com/summarizator/fora-frontend/commit/7464a06c)
  - [chore: update changelog for production release v0.5.45](https://github.com/summarizator/fora-frontend/commit/d263b855)
  - [chore: release 0.5.45](https://github.com/summarizator/fora-frontend/commit/59639faa)
  - [Merge pull request #1159 from summarizator/dev](https://github.com/summarizator/fora-frontend/commit/af095ba7)
  - [Merge pull request #1157 from summarizator/dev](https://github.com/summarizator/fora-frontend/commit/a1b746a8)
  - [Merge pull request #1148 from summarizator/dev](https://github.com/summarizator/fora-frontend/commit/114e049b)
  - [maybe fix for prod job](https://github.com/summarizator/fora-frontend/commit/7f4efa61)
  - [use cache for prod job too](https://github.com/summarizator/fora-frontend/commit/8fb0bc20)
  - [perhaps prod changes 3](https://github.com/summarizator/fora-frontend/commit/5a886e4f)
  - [perhaps prod changes 3](https://github.com/summarizator/fora-frontend/commit/2d166700)
  - [commit 2](https://github.com/summarizator/fora-frontend/commit/f2314527)
  - [commit 1](https://github.com/summarizator/fora-frontend/commit/2c82ec3e)
  - [aaaaanotherz](https://github.com/summarizator/fora-frontend/commit/a612e1e5)
  - [chore: release 0.5.39](https://github.com/summarizator/fora-frontend/commit/6c21fbb5)
  - [chore: release 0.5.36](https://github.com/summarizator/fora-frontend/commit/c46d914f)
  - [](https://github.com/summarizator/fora-frontend/commit/)
  - [](https://github.com/summarizator/fora-frontend/commit/)
  - [](https://github.com/summarizator/fora-frontend/commit/)
  - [chore: release 0.5.27](https://github.com/summarizator/fora-frontend/commit/5879296f)
  - [logz](https://github.com/summarizator/fora-frontend/commit/780e7fa6)
  - [logz](https://github.com/summarizator/fora-frontend/commit/625aee98)
  - [chore: release 0.5.26](https://github.com/summarizator/fora-frontend/commit/0a936731)
  - [chore: release 0.5.25](https://github.com/summarizator/fora-frontend/commit/3f677031)
  - [chore: release 0.5.24](https://github.com/summarizator/fora-frontend/commit/3aa63c2c)
  - [chore: release 0.5.23](https://github.com/summarizator/fora-frontend/commit/e31e8d5f)
  - [chore: release 0.5.18](https://github.com/summarizator/fora-frontend/commit/56f9d7ec)
  - [chore: release 0.5.17](https://github.com/summarizator/fora-frontend/commit/2bec2ac9)
  - [chore: release 0.5.16](https://github.com/summarizator/fora-frontend/commit/1ce7c9e9)
  - [cool new readme](https://github.com/summarizator/fora-frontend/commit/bba4c6ed)

  </details>

- [FORA-878](https://foraday.atlassian.net/browse/FORA-878): Allow category change on recent page
  <details>
    <summary>Commits</summary>

  - [](https://github.com/summarizator/fora-frontend/commit/)

  </details>

- [FORA-1085](https://foraday.atlassian.net/browse/FORA-1085): Create Summary modal
  <details>
    <summary>Commits</summary>

  - [](https://github.com/summarizator/fora-frontend/commit/)

  </details>

- [FORA-1066](https://foraday.atlassian.net/browse/FORA-1066): SPIKE - Okta Integration
  <details>
    <summary>Commits</summary>

  - [](https://github.com/summarizator/fora-frontend/commit/)

  </details>

- [FORA-840](https://foraday.atlassian.net/browse/FORA-840): Integrate Release-It to FE Repo
  <details>
    <summary>Commits</summary>

  - [chore: release 0.5.14](https://github.com/summarizator/fora-frontend/commit/88fee98e)
  - [chore: release 0.5.13](https://github.com/summarizator/fora-frontend/commit/f11b546c)
  - [chore: release 0.5.12](https://github.com/summarizator/fora-frontend/commit/9dc77c8a)
  - [chore: release 0.5.11](https://github.com/summarizator/fora-frontend/commit/10c35a54)
  - [chore: release 0.5.10](https://github.com/summarizator/fora-frontend/commit/8ee45320)
  - [chore: release 0.5.9](https://github.com/summarizator/fora-frontend/commit/b2ae433b)
  - [chore: release 0.5.8](https://github.com/summarizator/fora-frontend/commit/ceed34d9)
  - [chore: release 0.5.7](https://github.com/summarizator/fora-frontend/commit/53d84d35)
  - [chore: release 0.5.6](https://github.com/summarizator/fora-frontend/commit/0d250ed2)
  - [chore: release 0.5.5](https://github.com/summarizator/fora-frontend/commit/bf541008)
  - [chore: release 0.5.4](https://github.com/summarizator/fora-frontend/commit/9c37c293)
  - [chore: release 0.5.3](https://github.com/summarizator/fora-frontend/commit/f7d4bfe8)
  - [chore: release 0.5.2](https://github.com/summarizator/fora-frontend/commit/bf4a84db)
  - [chore: release 0.5.1](https://github.com/summarizator/fora-frontend/commit/aadf74d3)
  - [chore: release 0.5.2](https://github.com/summarizator/fora-frontend/commit/6b514330)
  - [chore: release 0.6.11](https://github.com/summarizator/fora-frontend/commit/ece60a67)
  - [chore: release 0.6.10](https://github.com/summarizator/fora-frontend/commit/2de1bedb)
  - [chore: release 0.6.9](https://github.com/summarizator/fora-frontend/commit/53b8f5ca)
  - [chore: release 0.6.8](https://github.com/summarizator/fora-frontend/commit/7798ad1d)
  - [chore: release 0.6.7](https://github.com/summarizator/fora-frontend/commit/f886470d)
  - [chore: release 0.6.6](https://github.com/summarizator/fora-frontend/commit/330eb03c)
  - [chore: release 0.6.5](https://github.com/summarizator/fora-frontend/commit/6787b64c)
  - [chore: release 0.6.4](https://github.com/summarizator/fora-frontend/commit/5a0fa3e6)
  - [chore: release 0.6.3](https://github.com/summarizator/fora-frontend/commit/6f8abded)
  - [Merge branch 'dev' into FORA-840](https://github.com/summarizator/fora-frontend/commit/c6bb1a7a)
  - [chore: release 0.6.1](https://github.com/summarizator/fora-frontend/commit/a9f1d7e6)
  - [chore: release 0.6.0](https://github.com/summarizator/fora-frontend/commit/6d5b7351)
  - [Merge branch 'dev' of github.com:summarizator/fora-frontend into FORA-840](https://github.com/summarizator/fora-frontend/commit/06ad38b4)
  - [try to kill all warnings](https://github.com/summarizator/fora-frontend/commit/7b1f20bb)
  - [add linting to pre-push](https://github.com/summarizator/fora-frontend/commit/0763edf0)
  - [add linting to pre-push](https://github.com/summarizator/fora-frontend/commit/963ff2f0)
  - [fix lint](https://github.com/summarizator/fora-frontend/commit/a8d262df)
  - [test](https://github.com/summarizator/fora-frontend/commit/e3f4e99b)
  - [clean](https://github.com/summarizator/fora-frontend/commit/fcedb650)
  - [fixes](https://github.com/summarizator/fora-frontend/commit/9d05113a)
  - [chore: release 0.5.15](https://github.com/summarizator/fora-frontend/commit/989f6fa9)
  - [chore: release 0.5.14](https://github.com/summarizator/fora-frontend/commit/42ad3861)
  - [Merge branch 'dev' into FORA-840](https://github.com/summarizator/fora-frontend/commit/df1530e1)
  - [chore: release 0.5.13](https://github.com/summarizator/fora-frontend/commit/10932202)
  - [chore: release 0.5.12](https://github.com/summarizator/fora-frontend/commit/92dcd324)
  - [fixes](https://github.com/summarizator/fora-frontend/commit/b27af8e0)
  - [build stuff](https://github.com/summarizator/fora-frontend/commit/3c72984b)
  - [think its working](https://github.com/summarizator/fora-frontend/commit/85c70b83)
  - [think its working](https://github.com/summarizator/fora-frontend/commit/3bbd19d3)
  - [Merge branch 'dev' into FORA-840](https://github.com/summarizator/fora-frontend/commit/601022d4)
  - [think its working](https://github.com/summarizator/fora-frontend/commit/70f85e94)
  - [chore: release 0.5.11](https://github.com/summarizator/fora-frontend/commit/f231b109)
  - [chore: release 0.5.10](https://github.com/summarizator/fora-frontend/commit/2b3663f4)
  - [chore: release 0.5.9](https://github.com/summarizator/fora-frontend/commit/b2cc8d94)
  - [chore: release 0.5.8](https://github.com/summarizator/fora-frontend/commit/dbb82f0d)
  - [chore: release 0.5.7](https://github.com/summarizator/fora-frontend/commit/a7712fb6)
  - [chore: release 0.5.6](https://github.com/summarizator/fora-frontend/commit/c6b905b6)
  - [untested prod function](https://github.com/summarizator/fora-frontend/commit/254f8fe4)
  - [chore: release 0.5.5](https://github.com/summarizator/fora-frontend/commit/c61eed54)
  - [start concept of dev and prod releases](https://github.com/summarizator/fora-frontend/commit/e288b500)
  - [chore: release 0.5.4](https://github.com/summarizator/fora-frontend/commit/bb2a5ef1)
  - [chore: release 0.5.3](https://github.com/summarizator/fora-frontend/commit/3c1e584e)
  - [chore: release 0.5.2](https://github.com/summarizator/fora-frontend/commit/b79edc4b)
  - [chore: release 0.5.1](https://github.com/summarizator/fora-frontend/commit/8a7be26f)
  - [rm commit message hook](https://github.com/summarizator/fora-frontend/commit/59e2d658)
  - [fix: json writing](https://github.com/summarizator/fora-frontend/commit/eab3c626)
  - [chore: release 0.15.28](https://github.com/summarizator/fora-frontend/commit/200f276c)
  - [chore: release 0.15.27](https://github.com/summarizator/fora-frontend/commit/8c35ce2c)
  - [chore: release 0.15.25](https://github.com/summarizator/fora-frontend/commit/41d91fe7)
  - [chore: release 0.15.24](https://github.com/summarizator/fora-frontend/commit/f8b43f75)
  - [chore: release 0.15.23](https://github.com/summarizator/fora-frontend/commit/2d8850c7)
  - [chore: release 0.15.22](https://github.com/summarizator/fora-frontend/commit/c0970bcc)
  - [chore: release 0.15.21](https://github.com/summarizator/fora-frontend/commit/29d219d0)
  - [chore: release 0.15.20](https://github.com/summarizator/fora-frontend/commit/da361273)
  - [fix: json writing](https://github.com/summarizator/fora-frontend/commit/16c1a997)
  - [chore: release 0.15.19](https://github.com/summarizator/fora-frontend/commit/c06bd710)
  - [chore: release 0.15.18](https://github.com/summarizator/fora-frontend/commit/e8729ef2)
  - [chore: release 0.15.17](https://github.com/summarizator/fora-frontend/commit/9c5889e0)
  - [chore: release 0.15.16](https://github.com/summarizator/fora-frontend/commit/74b14f5b)
  - [chore: release 0.15.15](https://github.com/summarizator/fora-frontend/commit/cfb51171)
  - [chore: release 0.15.14](https://github.com/summarizator/fora-frontend/commit/05185594)
  - [chore: release 0.15.13](https://github.com/summarizator/fora-frontend/commit/b104e115)
  - [chore: release 0.15.12](https://github.com/summarizator/fora-frontend/commit/632914ae)
  - [chore: release 0.15.11](https://github.com/summarizator/fora-frontend/commit/2c5ba71e)
  - [fix: looks like i want it to](https://github.com/summarizator/fora-frontend/commit/ac551328)
  - [chore: release 0.15.9](https://github.com/summarizator/fora-frontend/commit/b4e4b927)
  - [chore: release 0.15.8](https://github.com/summarizator/fora-frontend/commit/8ea004e1)
  - [chore: release 0.15.7](https://github.com/summarizator/fora-frontend/commit/25eea181)
  - [chore: release 0.15.6](https://github.com/summarizator/fora-frontend/commit/c4d8839e)
  - [chore: release 0.15.5](https://github.com/summarizator/fora-frontend/commit/724d618e)
  - [chore: release 0.15.4](https://github.com/summarizator/fora-frontend/commit/fb3ed7e2)
  - [chore: release 0.15.3](https://github.com/summarizator/fora-frontend/commit/de1a6c17)
  - [fix: some more edits](https://github.com/summarizator/fora-frontend/commit/828b63f9)
  - [chore: release 0.15.0](https://github.com/summarizator/fora-frontend/commit/8d1f5e03)
  - [fix: some more edits](https://github.com/summarizator/fora-frontend/commit/421858f9)
  - [fix: some more edits](https://github.com/summarizator/fora-frontend/commit/9a7a0e95)
  - [fix: got it](https://github.com/summarizator/fora-frontend/commit/1251fdb4)
  - [chore: release 0.14.0](https://github.com/summarizator/fora-frontend/commit/de185c95)
  - [chore: release 0.13.0](https://github.com/summarizator/fora-frontend/commit/ed9cf8fd)
  - [chore: release 0.12.0](https://github.com/summarizator/fora-frontend/commit/1b1d868d)
  - [chore: release 0.11.0](https://github.com/summarizator/fora-frontend/commit/0ad82baa)
  - [chore: release 0.10.0](https://github.com/summarizator/fora-frontend/commit/b6e2da3f)
  - [chore: release 0.9.0](https://github.com/summarizator/fora-frontend/commit/37594ba8)
  - [chore: release 0.8.0](https://github.com/summarizator/fora-frontend/commit/60a50f28)
  - [chore: release 0.7.0](https://github.com/summarizator/fora-frontend/commit/dd08fbab)
  - [chore: release 0.6.0](https://github.com/summarizator/fora-frontend/commit/037a9275)
  - [fix: some more readme formatting for dates](https://github.com/summarizator/fora-frontend/commit/f3ea4051)
  - [fix: some more readme formatting](https://github.com/summarizator/fora-frontend/commit/27b0c0be)
  - [fix: maybe fix release flow](https://github.com/summarizator/fora-frontend/commit/8f8fa992)
  - [chore: maybe move pre-push check](https://github.com/summarizator/fora-frontend/commit/396b69c2)
  - [fix: maybe fix branch naming](https://github.com/summarizator/fora-frontend/commit/2ebf827e)
  - [feat: test feature here](https://github.com/summarizator/fora-frontend/commit/9f4ba6ff)
  - [fix: husky hook](https://github.com/summarizator/fora-frontend/commit/09b68c85)
  - [test husky](https://github.com/summarizator/fora-frontend/commit/017494c1)
  - [test husky](https://github.com/summarizator/fora-frontend/commit/2dbd3a41)
  - [chore: release 0.5.3](https://github.com/summarizator/fora-frontend/commit/39be00fb)
  - [chore: release 0.5.2](https://github.com/summarizator/fora-frontend/commit/1b46922f)
  - [start of releaseit](https://github.com/summarizator/fora-frontend/commit/ac2c95bf)
  - [chore: release v0.5.1](https://github.com/summarizator/fora-frontend/commit/ffeb29d4)
  - [build info plugin](https://github.com/summarizator/fora-frontend/commit/7c82d728)

  </details>

### Bug Fixes

- [FORA-1117](https://foraday.atlassian.net/browse/FORA-1117): broken guest user flow
  <details>
    <summary>Commits</summary>

  - [chore: release 0.5.37](https://github.com/summarizator/fora-frontend/commit/8c83d46c)

  </details>

- [FORA-1115](https://foraday.atlassian.net/browse/FORA-1115): Add padding on meeting detail page
  <details>
    <summary>Commits</summary>

  - [](https://github.com/summarizator/fora-frontend/commit/)

  </details>

- [FORA-1114](https://foraday.atlassian.net/browse/FORA-1114): remove duplicate fora lenses
  <details>
    <summary>Commits</summary>

  - [](https://github.com/summarizator/fora-frontend/commit/)

  </details>

## [0.5.70](https://github.com/summarizator/fora-frontend/compare/v0.5.69...v0.5.70) <span style="color: red;">[prod]</span>

> Thu, Jan 23 2025 | 09:56 PM EST

### Features

- [FORA-1077](https://foraday.atlassian.net/browse/FORA-1077): FE: Integrate Release-It to github actions flow
  <details>
    <summary>Commits</summary>

  - [maybe finally](https://github.com/summarizator/fora-frontend/commit/f951eb46)
  - [chore: release 0.5.61](https://github.com/summarizator/fora-frontend/commit/34a27f86)
  - [chore: release 0.5.60](https://github.com/summarizator/fora-frontend/commit/205cf6bb)
  - [chore: release 0.5.59](https://github.com/summarizator/fora-frontend/commit/b8ce3830)
  - [chore: release 0.5.58](https://github.com/summarizator/fora-frontend/commit/7196a14f)
  - [chore: release 0.5.57](https://github.com/summarizator/fora-frontend/commit/5e6f6c3e)
  - [chore: release 0.5.56](https://github.com/summarizator/fora-frontend/commit/2641b805)
  - [chore: release 0.5.55](https://github.com/summarizator/fora-frontend/commit/90dea734)
  - [chore: release 0.5.54](https://github.com/summarizator/fora-frontend/commit/c8bd5549)
  - [chore: release 0.5.53](https://github.com/summarizator/fora-frontend/commit/8702254c)
  - [chore: release 0.5.52](https://github.com/summarizator/fora-frontend/commit/7b035fed)
  - [chore: release 0.5.51](https://github.com/summarizator/fora-frontend/commit/ae71451f)
  - [chore: release 0.5.50](https://github.com/summarizator/fora-frontend/commit/58f8c159)
  - [ugh](https://github.com/summarizator/fora-frontend/commit/8505a73a)
  - [chore: update changelog for production release v0.5.49](https://github.com/summarizator/fora-frontend/commit/df6ee29c)
  - [chore: release 0.5.49](https://github.com/summarizator/fora-frontend/commit/c41529fb)
  - [Merge pull request #1163 from summarizator/dev](https://github.com/summarizator/fora-frontend/commit/289df588)
  - [zzzz222](https://github.com/summarizator/fora-frontend/commit/6e2ae365)
  - [zzzz](https://github.com/summarizator/fora-frontend/commit/951ca70a)
  - [chore: update changelog for production release v0.5.47](https://github.com/summarizator/fora-frontend/commit/94dafc05)
  - [chore: release 0.5.47](https://github.com/summarizator/fora-frontend/commit/183339bc)
  - [Merge pull request #1161 from summarizator/dev](https://github.com/summarizator/fora-frontend/commit/69cfcf27)
  - [maybe fix for prod job](https://github.com/summarizator/fora-frontend/commit/8a11074e)
  - [maybe fix for prod job](https://github.com/summarizator/fora-frontend/commit/7464a06c)
  - [chore: update changelog for production release v0.5.45](https://github.com/summarizator/fora-frontend/commit/d263b855)
  - [chore: release 0.5.45](https://github.com/summarizator/fora-frontend/commit/59639faa)
  - [Merge pull request #1159 from summarizator/dev](https://github.com/summarizator/fora-frontend/commit/af095ba7)
  - [Merge pull request #1157 from summarizator/dev](https://github.com/summarizator/fora-frontend/commit/a1b746a8)
  - [Merge pull request #1148 from summarizator/dev](https://github.com/summarizator/fora-frontend/commit/114e049b)
  - [maybe fix for prod job](https://github.com/summarizator/fora-frontend/commit/7f4efa61)
  - [use cache for prod job too](https://github.com/summarizator/fora-frontend/commit/8fb0bc20)
  - [perhaps prod changes 3](https://github.com/summarizator/fora-frontend/commit/5a886e4f)
  - [perhaps prod changes 3](https://github.com/summarizator/fora-frontend/commit/2d166700)
  - [commit 2](https://github.com/summarizator/fora-frontend/commit/f2314527)
  - [commit 1](https://github.com/summarizator/fora-frontend/commit/2c82ec3e)
  - [aaaaanotherz](https://github.com/summarizator/fora-frontend/commit/a612e1e5)
  - [chore: release 0.5.39](https://github.com/summarizator/fora-frontend/commit/6c21fbb5)
  - [chore: release 0.5.36](https://github.com/summarizator/fora-frontend/commit/c46d914f)
  - [](https://github.com/summarizator/fora-frontend/commit/)
  - [](https://github.com/summarizator/fora-frontend/commit/)
  - [](https://github.com/summarizator/fora-frontend/commit/)
  - [chore: release 0.5.27](https://github.com/summarizator/fora-frontend/commit/5879296f)
  - [logz](https://github.com/summarizator/fora-frontend/commit/780e7fa6)
  - [logz](https://github.com/summarizator/fora-frontend/commit/625aee98)
  - [chore: release 0.5.26](https://github.com/summarizator/fora-frontend/commit/0a936731)
  - [chore: release 0.5.25](https://github.com/summarizator/fora-frontend/commit/3f677031)
  - [chore: release 0.5.24](https://github.com/summarizator/fora-frontend/commit/3aa63c2c)
  - [chore: release 0.5.23](https://github.com/summarizator/fora-frontend/commit/e31e8d5f)
  - [chore: release 0.5.18](https://github.com/summarizator/fora-frontend/commit/56f9d7ec)
  - [chore: release 0.5.17](https://github.com/summarizator/fora-frontend/commit/2bec2ac9)
  - [chore: release 0.5.16](https://github.com/summarizator/fora-frontend/commit/1ce7c9e9)
  - [cool new readme](https://github.com/summarizator/fora-frontend/commit/bba4c6ed)

  </details>

- [FORA-878](https://foraday.atlassian.net/browse/FORA-878): Allow category change on recent page
  <details>
    <summary>Commits</summary>

  - [](https://github.com/summarizator/fora-frontend/commit/)

  </details>

- [FORA-1085](https://foraday.atlassian.net/browse/FORA-1085): Create Summary modal
  <details>
    <summary>Commits</summary>

  - [](https://github.com/summarizator/fora-frontend/commit/)

  </details>

- [FORA-1066](https://foraday.atlassian.net/browse/FORA-1066): SPIKE - Okta Integration
  <details>
    <summary>Commits</summary>

  - [](https://github.com/summarizator/fora-frontend/commit/)

  </details>

- [FORA-840](https://foraday.atlassian.net/browse/FORA-840): Integrate Release-It to FE Repo
  <details>
    <summary>Commits</summary>

  - [chore: release 0.5.14](https://github.com/summarizator/fora-frontend/commit/88fee98e)
  - [chore: release 0.5.13](https://github.com/summarizator/fora-frontend/commit/f11b546c)
  - [chore: release 0.5.12](https://github.com/summarizator/fora-frontend/commit/9dc77c8a)
  - [chore: release 0.5.11](https://github.com/summarizator/fora-frontend/commit/10c35a54)
  - [chore: release 0.5.10](https://github.com/summarizator/fora-frontend/commit/8ee45320)
  - [chore: release 0.5.9](https://github.com/summarizator/fora-frontend/commit/b2ae433b)
  - [chore: release 0.5.8](https://github.com/summarizator/fora-frontend/commit/ceed34d9)
  - [chore: release 0.5.7](https://github.com/summarizator/fora-frontend/commit/53d84d35)
  - [chore: release 0.5.6](https://github.com/summarizator/fora-frontend/commit/0d250ed2)
  - [chore: release 0.5.5](https://github.com/summarizator/fora-frontend/commit/bf541008)
  - [chore: release 0.5.4](https://github.com/summarizator/fora-frontend/commit/9c37c293)
  - [chore: release 0.5.3](https://github.com/summarizator/fora-frontend/commit/f7d4bfe8)
  - [chore: release 0.5.2](https://github.com/summarizator/fora-frontend/commit/bf4a84db)
  - [chore: release 0.5.1](https://github.com/summarizator/fora-frontend/commit/aadf74d3)
  - [chore: release 0.5.2](https://github.com/summarizator/fora-frontend/commit/6b514330)
  - [chore: release 0.6.11](https://github.com/summarizator/fora-frontend/commit/ece60a67)
  - [chore: release 0.6.10](https://github.com/summarizator/fora-frontend/commit/2de1bedb)
  - [chore: release 0.6.9](https://github.com/summarizator/fora-frontend/commit/53b8f5ca)
  - [chore: release 0.6.8](https://github.com/summarizator/fora-frontend/commit/7798ad1d)
  - [chore: release 0.6.7](https://github.com/summarizator/fora-frontend/commit/f886470d)
  - [chore: release 0.6.6](https://github.com/summarizator/fora-frontend/commit/330eb03c)
  - [chore: release 0.6.5](https://github.com/summarizator/fora-frontend/commit/6787b64c)
  - [chore: release 0.6.4](https://github.com/summarizator/fora-frontend/commit/5a0fa3e6)
  - [chore: release 0.6.3](https://github.com/summarizator/fora-frontend/commit/6f8abded)
  - [Merge branch 'dev' into FORA-840](https://github.com/summarizator/fora-frontend/commit/c6bb1a7a)
  - [chore: release 0.6.1](https://github.com/summarizator/fora-frontend/commit/a9f1d7e6)
  - [chore: release 0.6.0](https://github.com/summarizator/fora-frontend/commit/6d5b7351)
  - [Merge branch 'dev' of github.com:summarizator/fora-frontend into FORA-840](https://github.com/summarizator/fora-frontend/commit/06ad38b4)
  - [try to kill all warnings](https://github.com/summarizator/fora-frontend/commit/7b1f20bb)
  - [add linting to pre-push](https://github.com/summarizator/fora-frontend/commit/0763edf0)
  - [add linting to pre-push](https://github.com/summarizator/fora-frontend/commit/963ff2f0)
  - [fix lint](https://github.com/summarizator/fora-frontend/commit/a8d262df)
  - [test](https://github.com/summarizator/fora-frontend/commit/e3f4e99b)
  - [clean](https://github.com/summarizator/fora-frontend/commit/fcedb650)
  - [fixes](https://github.com/summarizator/fora-frontend/commit/9d05113a)
  - [chore: release 0.5.15](https://github.com/summarizator/fora-frontend/commit/989f6fa9)
  - [chore: release 0.5.14](https://github.com/summarizator/fora-frontend/commit/42ad3861)
  - [Merge branch 'dev' into FORA-840](https://github.com/summarizator/fora-frontend/commit/df1530e1)
  - [chore: release 0.5.13](https://github.com/summarizator/fora-frontend/commit/10932202)
  - [chore: release 0.5.12](https://github.com/summarizator/fora-frontend/commit/92dcd324)
  - [fixes](https://github.com/summarizator/fora-frontend/commit/b27af8e0)
  - [build stuff](https://github.com/summarizator/fora-frontend/commit/3c72984b)
  - [think its working](https://github.com/summarizator/fora-frontend/commit/85c70b83)
  - [think its working](https://github.com/summarizator/fora-frontend/commit/3bbd19d3)
  - [Merge branch 'dev' into FORA-840](https://github.com/summarizator/fora-frontend/commit/601022d4)
  - [think its working](https://github.com/summarizator/fora-frontend/commit/70f85e94)
  - [chore: release 0.5.11](https://github.com/summarizator/fora-frontend/commit/f231b109)
  - [chore: release 0.5.10](https://github.com/summarizator/fora-frontend/commit/2b3663f4)
  - [chore: release 0.5.9](https://github.com/summarizator/fora-frontend/commit/b2cc8d94)
  - [chore: release 0.5.8](https://github.com/summarizator/fora-frontend/commit/dbb82f0d)
  - [chore: release 0.5.7](https://github.com/summarizator/fora-frontend/commit/a7712fb6)
  - [chore: release 0.5.6](https://github.com/summarizator/fora-frontend/commit/c6b905b6)
  - [untested prod function](https://github.com/summarizator/fora-frontend/commit/254f8fe4)
  - [chore: release 0.5.5](https://github.com/summarizator/fora-frontend/commit/c61eed54)
  - [start concept of dev and prod releases](https://github.com/summarizator/fora-frontend/commit/e288b500)
  - [chore: release 0.5.4](https://github.com/summarizator/fora-frontend/commit/bb2a5ef1)
  - [chore: release 0.5.3](https://github.com/summarizator/fora-frontend/commit/3c1e584e)
  - [chore: release 0.5.2](https://github.com/summarizator/fora-frontend/commit/b79edc4b)
  - [chore: release 0.5.1](https://github.com/summarizator/fora-frontend/commit/8a7be26f)
  - [rm commit message hook](https://github.com/summarizator/fora-frontend/commit/59e2d658)
  - [fix: json writing](https://github.com/summarizator/fora-frontend/commit/eab3c626)
  - [chore: release 0.15.28](https://github.com/summarizator/fora-frontend/commit/200f276c)
  - [chore: release 0.15.27](https://github.com/summarizator/fora-frontend/commit/8c35ce2c)
  - [chore: release 0.15.25](https://github.com/summarizator/fora-frontend/commit/41d91fe7)
  - [chore: release 0.15.24](https://github.com/summarizator/fora-frontend/commit/f8b43f75)
  - [chore: release 0.15.23](https://github.com/summarizator/fora-frontend/commit/2d8850c7)
  - [chore: release 0.15.22](https://github.com/summarizator/fora-frontend/commit/c0970bcc)
  - [chore: release 0.15.21](https://github.com/summarizator/fora-frontend/commit/29d219d0)
  - [chore: release 0.15.20](https://github.com/summarizator/fora-frontend/commit/da361273)
  - [fix: json writing](https://github.com/summarizator/fora-frontend/commit/16c1a997)
  - [chore: release 0.15.19](https://github.com/summarizator/fora-frontend/commit/c06bd710)
  - [chore: release 0.15.18](https://github.com/summarizator/fora-frontend/commit/e8729ef2)
  - [chore: release 0.15.17](https://github.com/summarizator/fora-frontend/commit/9c5889e0)
  - [chore: release 0.15.16](https://github.com/summarizator/fora-frontend/commit/74b14f5b)
  - [chore: release 0.15.15](https://github.com/summarizator/fora-frontend/commit/cfb51171)
  - [chore: release 0.15.14](https://github.com/summarizator/fora-frontend/commit/05185594)
  - [chore: release 0.15.13](https://github.com/summarizator/fora-frontend/commit/b104e115)
  - [chore: release 0.15.12](https://github.com/summarizator/fora-frontend/commit/632914ae)
  - [chore: release 0.15.11](https://github.com/summarizator/fora-frontend/commit/2c5ba71e)
  - [fix: looks like i want it to](https://github.com/summarizator/fora-frontend/commit/ac551328)
  - [chore: release 0.15.9](https://github.com/summarizator/fora-frontend/commit/b4e4b927)
  - [chore: release 0.15.8](https://github.com/summarizator/fora-frontend/commit/8ea004e1)
  - [chore: release 0.15.7](https://github.com/summarizator/fora-frontend/commit/25eea181)
  - [chore: release 0.15.6](https://github.com/summarizator/fora-frontend/commit/c4d8839e)
  - [chore: release 0.15.5](https://github.com/summarizator/fora-frontend/commit/724d618e)
  - [chore: release 0.15.4](https://github.com/summarizator/fora-frontend/commit/fb3ed7e2)
  - [chore: release 0.15.3](https://github.com/summarizator/fora-frontend/commit/de1a6c17)
  - [fix: some more edits](https://github.com/summarizator/fora-frontend/commit/828b63f9)
  - [chore: release 0.15.0](https://github.com/summarizator/fora-frontend/commit/8d1f5e03)
  - [fix: some more edits](https://github.com/summarizator/fora-frontend/commit/421858f9)
  - [fix: some more edits](https://github.com/summarizator/fora-frontend/commit/9a7a0e95)
  - [fix: got it](https://github.com/summarizator/fora-frontend/commit/1251fdb4)
  - [chore: release 0.14.0](https://github.com/summarizator/fora-frontend/commit/de185c95)
  - [chore: release 0.13.0](https://github.com/summarizator/fora-frontend/commit/ed9cf8fd)
  - [chore: release 0.12.0](https://github.com/summarizator/fora-frontend/commit/1b1d868d)
  - [chore: release 0.11.0](https://github.com/summarizator/fora-frontend/commit/0ad82baa)
  - [chore: release 0.10.0](https://github.com/summarizator/fora-frontend/commit/b6e2da3f)
  - [chore: release 0.9.0](https://github.com/summarizator/fora-frontend/commit/37594ba8)
  - [chore: release 0.8.0](https://github.com/summarizator/fora-frontend/commit/60a50f28)
  - [chore: release 0.7.0](https://github.com/summarizator/fora-frontend/commit/dd08fbab)
  - [chore: release 0.6.0](https://github.com/summarizator/fora-frontend/commit/037a9275)
  - [fix: some more readme formatting for dates](https://github.com/summarizator/fora-frontend/commit/f3ea4051)
  - [fix: some more readme formatting](https://github.com/summarizator/fora-frontend/commit/27b0c0be)
  - [fix: maybe fix release flow](https://github.com/summarizator/fora-frontend/commit/8f8fa992)
  - [chore: maybe move pre-push check](https://github.com/summarizator/fora-frontend/commit/396b69c2)
  - [fix: maybe fix branch naming](https://github.com/summarizator/fora-frontend/commit/2ebf827e)
  - [feat: test feature here](https://github.com/summarizator/fora-frontend/commit/9f4ba6ff)
  - [fix: husky hook](https://github.com/summarizator/fora-frontend/commit/09b68c85)
  - [test husky](https://github.com/summarizator/fora-frontend/commit/017494c1)
  - [test husky](https://github.com/summarizator/fora-frontend/commit/2dbd3a41)
  - [chore: release 0.5.3](https://github.com/summarizator/fora-frontend/commit/39be00fb)
  - [chore: release 0.5.2](https://github.com/summarizator/fora-frontend/commit/1b46922f)
  - [start of releaseit](https://github.com/summarizator/fora-frontend/commit/ac2c95bf)
  - [chore: release v0.5.1](https://github.com/summarizator/fora-frontend/commit/ffeb29d4)
  - [build info plugin](https://github.com/summarizator/fora-frontend/commit/7c82d728)

  </details>

### Bug Fixes

- [FORA-1117](https://foraday.atlassian.net/browse/FORA-1117): broken guest user flow
  <details>
    <summary>Commits</summary>

  - [chore: release 0.5.37](https://github.com/summarizator/fora-frontend/commit/8c83d46c)

  </details>

- [FORA-1115](https://foraday.atlassian.net/browse/FORA-1115): Add padding on meeting detail page
  <details>
    <summary>Commits</summary>

  - [](https://github.com/summarizator/fora-frontend/commit/)

  </details>

- [FORA-1114](https://foraday.atlassian.net/browse/FORA-1114): remove duplicate fora lenses
  <details>
    <summary>Commits</summary>

  - [](https://github.com/summarizator/fora-frontend/commit/)

  </details>

## [0.5.69](https://github.com/summarizator/fora-frontend/compare/v0.5.68...v0.5.69) <span style="color: red;">[prod]</span>

> Thu, Jan 23 2025 | 09:54 PM EST

### Features

- [FORA-1077](https://foraday.atlassian.net/browse/FORA-1077): FE: Integrate Release-It to github actions flow
  <details>
    <summary>Commits</summary>

  - [maybe finally](https://github.com/summarizator/fora-frontend/commit/f951eb46)
  - [chore: release 0.5.61](https://github.com/summarizator/fora-frontend/commit/34a27f86)
  - [chore: release 0.5.60](https://github.com/summarizator/fora-frontend/commit/205cf6bb)
  - [chore: release 0.5.59](https://github.com/summarizator/fora-frontend/commit/b8ce3830)
  - [chore: release 0.5.58](https://github.com/summarizator/fora-frontend/commit/7196a14f)
  - [chore: release 0.5.57](https://github.com/summarizator/fora-frontend/commit/5e6f6c3e)
  - [chore: release 0.5.56](https://github.com/summarizator/fora-frontend/commit/2641b805)
  - [chore: release 0.5.55](https://github.com/summarizator/fora-frontend/commit/90dea734)
  - [chore: release 0.5.54](https://github.com/summarizator/fora-frontend/commit/c8bd5549)
  - [chore: release 0.5.53](https://github.com/summarizator/fora-frontend/commit/8702254c)
  - [chore: release 0.5.52](https://github.com/summarizator/fora-frontend/commit/7b035fed)
  - [chore: release 0.5.51](https://github.com/summarizator/fora-frontend/commit/ae71451f)
  - [chore: release 0.5.50](https://github.com/summarizator/fora-frontend/commit/58f8c159)
  - [ugh](https://github.com/summarizator/fora-frontend/commit/8505a73a)
  - [chore: update changelog for production release v0.5.49](https://github.com/summarizator/fora-frontend/commit/df6ee29c)
  - [chore: release 0.5.49](https://github.com/summarizator/fora-frontend/commit/c41529fb)
  - [Merge pull request #1163 from summarizator/dev](https://github.com/summarizator/fora-frontend/commit/289df588)
  - [zzzz222](https://github.com/summarizator/fora-frontend/commit/6e2ae365)
  - [zzzz](https://github.com/summarizator/fora-frontend/commit/951ca70a)
  - [chore: update changelog for production release v0.5.47](https://github.com/summarizator/fora-frontend/commit/94dafc05)
  - [chore: release 0.5.47](https://github.com/summarizator/fora-frontend/commit/183339bc)
  - [Merge pull request #1161 from summarizator/dev](https://github.com/summarizator/fora-frontend/commit/69cfcf27)
  - [maybe fix for prod job](https://github.com/summarizator/fora-frontend/commit/8a11074e)
  - [maybe fix for prod job](https://github.com/summarizator/fora-frontend/commit/7464a06c)
  - [chore: update changelog for production release v0.5.45](https://github.com/summarizator/fora-frontend/commit/d263b855)
  - [chore: release 0.5.45](https://github.com/summarizator/fora-frontend/commit/59639faa)
  - [Merge pull request #1159 from summarizator/dev](https://github.com/summarizator/fora-frontend/commit/af095ba7)
  - [Merge pull request #1157 from summarizator/dev](https://github.com/summarizator/fora-frontend/commit/a1b746a8)
  - [Merge pull request #1148 from summarizator/dev](https://github.com/summarizator/fora-frontend/commit/114e049b)
  - [maybe fix for prod job](https://github.com/summarizator/fora-frontend/commit/7f4efa61)
  - [use cache for prod job too](https://github.com/summarizator/fora-frontend/commit/8fb0bc20)
  - [perhaps prod changes 3](https://github.com/summarizator/fora-frontend/commit/5a886e4f)
  - [perhaps prod changes 3](https://github.com/summarizator/fora-frontend/commit/2d166700)
  - [commit 2](https://github.com/summarizator/fora-frontend/commit/f2314527)
  - [commit 1](https://github.com/summarizator/fora-frontend/commit/2c82ec3e)
  - [aaaaanotherz](https://github.com/summarizator/fora-frontend/commit/a612e1e5)
  - [chore: release 0.5.39](https://github.com/summarizator/fora-frontend/commit/6c21fbb5)
  - [chore: release 0.5.36](https://github.com/summarizator/fora-frontend/commit/c46d914f)
  - [](https://github.com/summarizator/fora-frontend/commit/)
  - [](https://github.com/summarizator/fora-frontend/commit/)
  - [](https://github.com/summarizator/fora-frontend/commit/)
  - [chore: release 0.5.27](https://github.com/summarizator/fora-frontend/commit/5879296f)
  - [logz](https://github.com/summarizator/fora-frontend/commit/780e7fa6)
  - [logz](https://github.com/summarizator/fora-frontend/commit/625aee98)
  - [chore: release 0.5.26](https://github.com/summarizator/fora-frontend/commit/0a936731)
  - [chore: release 0.5.25](https://github.com/summarizator/fora-frontend/commit/3f677031)
  - [chore: release 0.5.24](https://github.com/summarizator/fora-frontend/commit/3aa63c2c)
  - [chore: release 0.5.23](https://github.com/summarizator/fora-frontend/commit/e31e8d5f)
  - [chore: release 0.5.18](https://github.com/summarizator/fora-frontend/commit/56f9d7ec)
  - [chore: release 0.5.17](https://github.com/summarizator/fora-frontend/commit/2bec2ac9)
  - [chore: release 0.5.16](https://github.com/summarizator/fora-frontend/commit/1ce7c9e9)
  - [cool new readme](https://github.com/summarizator/fora-frontend/commit/bba4c6ed)

  </details>

- [FORA-878](https://foraday.atlassian.net/browse/FORA-878): Allow category change on recent page
  <details>
    <summary>Commits</summary>

  - [](https://github.com/summarizator/fora-frontend/commit/)

  </details>

- [FORA-1085](https://foraday.atlassian.net/browse/FORA-1085): Create Summary modal
  <details>
    <summary>Commits</summary>

  - [](https://github.com/summarizator/fora-frontend/commit/)

  </details>

- [FORA-1066](https://foraday.atlassian.net/browse/FORA-1066): SPIKE - Okta Integration
  <details>
    <summary>Commits</summary>

  - [](https://github.com/summarizator/fora-frontend/commit/)

  </details>

- [FORA-840](https://foraday.atlassian.net/browse/FORA-840): Integrate Release-It to FE Repo
  <details>
    <summary>Commits</summary>

  - [chore: release 0.5.14](https://github.com/summarizator/fora-frontend/commit/88fee98e)
  - [chore: release 0.5.13](https://github.com/summarizator/fora-frontend/commit/f11b546c)
  - [chore: release 0.5.12](https://github.com/summarizator/fora-frontend/commit/9dc77c8a)
  - [chore: release 0.5.11](https://github.com/summarizator/fora-frontend/commit/10c35a54)
  - [chore: release 0.5.10](https://github.com/summarizator/fora-frontend/commit/8ee45320)
  - [chore: release 0.5.9](https://github.com/summarizator/fora-frontend/commit/b2ae433b)
  - [chore: release 0.5.8](https://github.com/summarizator/fora-frontend/commit/ceed34d9)
  - [chore: release 0.5.7](https://github.com/summarizator/fora-frontend/commit/53d84d35)
  - [chore: release 0.5.6](https://github.com/summarizator/fora-frontend/commit/0d250ed2)
  - [chore: release 0.5.5](https://github.com/summarizator/fora-frontend/commit/bf541008)
  - [chore: release 0.5.4](https://github.com/summarizator/fora-frontend/commit/9c37c293)
  - [chore: release 0.5.3](https://github.com/summarizator/fora-frontend/commit/f7d4bfe8)
  - [chore: release 0.5.2](https://github.com/summarizator/fora-frontend/commit/bf4a84db)
  - [chore: release 0.5.1](https://github.com/summarizator/fora-frontend/commit/aadf74d3)
  - [chore: release 0.5.2](https://github.com/summarizator/fora-frontend/commit/6b514330)
  - [chore: release 0.6.11](https://github.com/summarizator/fora-frontend/commit/ece60a67)
  - [chore: release 0.6.10](https://github.com/summarizator/fora-frontend/commit/2de1bedb)
  - [chore: release 0.6.9](https://github.com/summarizator/fora-frontend/commit/53b8f5ca)
  - [chore: release 0.6.8](https://github.com/summarizator/fora-frontend/commit/7798ad1d)
  - [chore: release 0.6.7](https://github.com/summarizator/fora-frontend/commit/f886470d)
  - [chore: release 0.6.6](https://github.com/summarizator/fora-frontend/commit/330eb03c)
  - [chore: release 0.6.5](https://github.com/summarizator/fora-frontend/commit/6787b64c)
  - [chore: release 0.6.4](https://github.com/summarizator/fora-frontend/commit/5a0fa3e6)
  - [chore: release 0.6.3](https://github.com/summarizator/fora-frontend/commit/6f8abded)
  - [Merge branch 'dev' into FORA-840](https://github.com/summarizator/fora-frontend/commit/c6bb1a7a)
  - [chore: release 0.6.1](https://github.com/summarizator/fora-frontend/commit/a9f1d7e6)
  - [chore: release 0.6.0](https://github.com/summarizator/fora-frontend/commit/6d5b7351)
  - [Merge branch 'dev' of github.com:summarizator/fora-frontend into FORA-840](https://github.com/summarizator/fora-frontend/commit/06ad38b4)
  - [try to kill all warnings](https://github.com/summarizator/fora-frontend/commit/7b1f20bb)
  - [add linting to pre-push](https://github.com/summarizator/fora-frontend/commit/0763edf0)
  - [add linting to pre-push](https://github.com/summarizator/fora-frontend/commit/963ff2f0)
  - [fix lint](https://github.com/summarizator/fora-frontend/commit/a8d262df)
  - [test](https://github.com/summarizator/fora-frontend/commit/e3f4e99b)
  - [clean](https://github.com/summarizator/fora-frontend/commit/fcedb650)
  - [fixes](https://github.com/summarizator/fora-frontend/commit/9d05113a)
  - [chore: release 0.5.15](https://github.com/summarizator/fora-frontend/commit/989f6fa9)
  - [chore: release 0.5.14](https://github.com/summarizator/fora-frontend/commit/42ad3861)
  - [Merge branch 'dev' into FORA-840](https://github.com/summarizator/fora-frontend/commit/df1530e1)
  - [chore: release 0.5.13](https://github.com/summarizator/fora-frontend/commit/10932202)
  - [chore: release 0.5.12](https://github.com/summarizator/fora-frontend/commit/92dcd324)
  - [fixes](https://github.com/summarizator/fora-frontend/commit/b27af8e0)
  - [build stuff](https://github.com/summarizator/fora-frontend/commit/3c72984b)
  - [think its working](https://github.com/summarizator/fora-frontend/commit/85c70b83)
  - [think its working](https://github.com/summarizator/fora-frontend/commit/3bbd19d3)
  - [Merge branch 'dev' into FORA-840](https://github.com/summarizator/fora-frontend/commit/601022d4)
  - [think its working](https://github.com/summarizator/fora-frontend/commit/70f85e94)
  - [chore: release 0.5.11](https://github.com/summarizator/fora-frontend/commit/f231b109)
  - [chore: release 0.5.10](https://github.com/summarizator/fora-frontend/commit/2b3663f4)
  - [chore: release 0.5.9](https://github.com/summarizator/fora-frontend/commit/b2cc8d94)
  - [chore: release 0.5.8](https://github.com/summarizator/fora-frontend/commit/dbb82f0d)
  - [chore: release 0.5.7](https://github.com/summarizator/fora-frontend/commit/a7712fb6)
  - [chore: release 0.5.6](https://github.com/summarizator/fora-frontend/commit/c6b905b6)
  - [untested prod function](https://github.com/summarizator/fora-frontend/commit/254f8fe4)
  - [chore: release 0.5.5](https://github.com/summarizator/fora-frontend/commit/c61eed54)
  - [start concept of dev and prod releases](https://github.com/summarizator/fora-frontend/commit/e288b500)
  - [chore: release 0.5.4](https://github.com/summarizator/fora-frontend/commit/bb2a5ef1)
  - [chore: release 0.5.3](https://github.com/summarizator/fora-frontend/commit/3c1e584e)
  - [chore: release 0.5.2](https://github.com/summarizator/fora-frontend/commit/b79edc4b)
  - [chore: release 0.5.1](https://github.com/summarizator/fora-frontend/commit/8a7be26f)
  - [rm commit message hook](https://github.com/summarizator/fora-frontend/commit/59e2d658)
  - [fix: json writing](https://github.com/summarizator/fora-frontend/commit/eab3c626)
  - [chore: release 0.15.28](https://github.com/summarizator/fora-frontend/commit/200f276c)
  - [chore: release 0.15.27](https://github.com/summarizator/fora-frontend/commit/8c35ce2c)
  - [chore: release 0.15.25](https://github.com/summarizator/fora-frontend/commit/41d91fe7)
  - [chore: release 0.15.24](https://github.com/summarizator/fora-frontend/commit/f8b43f75)
  - [chore: release 0.15.23](https://github.com/summarizator/fora-frontend/commit/2d8850c7)
  - [chore: release 0.15.22](https://github.com/summarizator/fora-frontend/commit/c0970bcc)
  - [chore: release 0.15.21](https://github.com/summarizator/fora-frontend/commit/29d219d0)
  - [chore: release 0.15.20](https://github.com/summarizator/fora-frontend/commit/da361273)
  - [fix: json writing](https://github.com/summarizator/fora-frontend/commit/16c1a997)
  - [chore: release 0.15.19](https://github.com/summarizator/fora-frontend/commit/c06bd710)
  - [chore: release 0.15.18](https://github.com/summarizator/fora-frontend/commit/e8729ef2)
  - [chore: release 0.15.17](https://github.com/summarizator/fora-frontend/commit/9c5889e0)
  - [chore: release 0.15.16](https://github.com/summarizator/fora-frontend/commit/74b14f5b)
  - [chore: release 0.15.15](https://github.com/summarizator/fora-frontend/commit/cfb51171)
  - [chore: release 0.15.14](https://github.com/summarizator/fora-frontend/commit/05185594)
  - [chore: release 0.15.13](https://github.com/summarizator/fora-frontend/commit/b104e115)
  - [chore: release 0.15.12](https://github.com/summarizator/fora-frontend/commit/632914ae)
  - [chore: release 0.15.11](https://github.com/summarizator/fora-frontend/commit/2c5ba71e)
  - [fix: looks like i want it to](https://github.com/summarizator/fora-frontend/commit/ac551328)
  - [chore: release 0.15.9](https://github.com/summarizator/fora-frontend/commit/b4e4b927)
  - [chore: release 0.15.8](https://github.com/summarizator/fora-frontend/commit/8ea004e1)
  - [chore: release 0.15.7](https://github.com/summarizator/fora-frontend/commit/25eea181)
  - [chore: release 0.15.6](https://github.com/summarizator/fora-frontend/commit/c4d8839e)
  - [chore: release 0.15.5](https://github.com/summarizator/fora-frontend/commit/724d618e)
  - [chore: release 0.15.4](https://github.com/summarizator/fora-frontend/commit/fb3ed7e2)
  - [chore: release 0.15.3](https://github.com/summarizator/fora-frontend/commit/de1a6c17)
  - [fix: some more edits](https://github.com/summarizator/fora-frontend/commit/828b63f9)
  - [chore: release 0.15.0](https://github.com/summarizator/fora-frontend/commit/8d1f5e03)
  - [fix: some more edits](https://github.com/summarizator/fora-frontend/commit/421858f9)
  - [fix: some more edits](https://github.com/summarizator/fora-frontend/commit/9a7a0e95)
  - [fix: got it](https://github.com/summarizator/fora-frontend/commit/1251fdb4)
  - [chore: release 0.14.0](https://github.com/summarizator/fora-frontend/commit/de185c95)
  - [chore: release 0.13.0](https://github.com/summarizator/fora-frontend/commit/ed9cf8fd)
  - [chore: release 0.12.0](https://github.com/summarizator/fora-frontend/commit/1b1d868d)
  - [chore: release 0.11.0](https://github.com/summarizator/fora-frontend/commit/0ad82baa)
  - [chore: release 0.10.0](https://github.com/summarizator/fora-frontend/commit/b6e2da3f)
  - [chore: release 0.9.0](https://github.com/summarizator/fora-frontend/commit/37594ba8)
  - [chore: release 0.8.0](https://github.com/summarizator/fora-frontend/commit/60a50f28)
  - [chore: release 0.7.0](https://github.com/summarizator/fora-frontend/commit/dd08fbab)
  - [chore: release 0.6.0](https://github.com/summarizator/fora-frontend/commit/037a9275)
  - [fix: some more readme formatting for dates](https://github.com/summarizator/fora-frontend/commit/f3ea4051)
  - [fix: some more readme formatting](https://github.com/summarizator/fora-frontend/commit/27b0c0be)
  - [fix: maybe fix release flow](https://github.com/summarizator/fora-frontend/commit/8f8fa992)
  - [chore: maybe move pre-push check](https://github.com/summarizator/fora-frontend/commit/396b69c2)
  - [fix: maybe fix branch naming](https://github.com/summarizator/fora-frontend/commit/2ebf827e)
  - [feat: test feature here](https://github.com/summarizator/fora-frontend/commit/9f4ba6ff)
  - [fix: husky hook](https://github.com/summarizator/fora-frontend/commit/09b68c85)
  - [test husky](https://github.com/summarizator/fora-frontend/commit/017494c1)
  - [test husky](https://github.com/summarizator/fora-frontend/commit/2dbd3a41)
  - [chore: release 0.5.3](https://github.com/summarizator/fora-frontend/commit/39be00fb)
  - [chore: release 0.5.2](https://github.com/summarizator/fora-frontend/commit/1b46922f)
  - [start of releaseit](https://github.com/summarizator/fora-frontend/commit/ac2c95bf)
  - [chore: release v0.5.1](https://github.com/summarizator/fora-frontend/commit/ffeb29d4)
  - [build info plugin](https://github.com/summarizator/fora-frontend/commit/7c82d728)

  </details>

### Bug Fixes

- [FORA-1117](https://foraday.atlassian.net/browse/FORA-1117): broken guest user flow
  <details>
    <summary>Commits</summary>

  - [chore: release 0.5.37](https://github.com/summarizator/fora-frontend/commit/8c83d46c)

  </details>

- [FORA-1115](https://foraday.atlassian.net/browse/FORA-1115): Add padding on meeting detail page
  <details>
    <summary>Commits</summary>

  - [](https://github.com/summarizator/fora-frontend/commit/)

  </details>

- [FORA-1114](https://foraday.atlassian.net/browse/FORA-1114): remove duplicate fora lenses
  <details>
    <summary>Commits</summary>

  - [](https://github.com/summarizator/fora-frontend/commit/)

  </details>

## [0.5.68](https://github.com/summarizator/fora-frontend/compare/v0.5.67...v0.5.68) <span style="color: red;">[prod]</span>

> Thu, Jan 23 2025 | 09:51 PM EST

### Features

- [FORA-1077](https://foraday.atlassian.net/browse/FORA-1077): FE: Integrate Release-It to github actions flow
  <details>
    <summary>Commits</summary>

  - [maybe finally](https://github.com/summarizator/fora-frontend/commit/f951eb46)
  - [chore: release 0.5.61](https://github.com/summarizator/fora-frontend/commit/34a27f86)
  - [chore: release 0.5.60](https://github.com/summarizator/fora-frontend/commit/205cf6bb)
  - [chore: release 0.5.59](https://github.com/summarizator/fora-frontend/commit/b8ce3830)
  - [chore: release 0.5.58](https://github.com/summarizator/fora-frontend/commit/7196a14f)
  - [chore: release 0.5.57](https://github.com/summarizator/fora-frontend/commit/5e6f6c3e)
  - [chore: release 0.5.56](https://github.com/summarizator/fora-frontend/commit/2641b805)
  - [chore: release 0.5.55](https://github.com/summarizator/fora-frontend/commit/90dea734)
  - [chore: release 0.5.54](https://github.com/summarizator/fora-frontend/commit/c8bd5549)
  - [chore: release 0.5.53](https://github.com/summarizator/fora-frontend/commit/8702254c)
  - [chore: release 0.5.52](https://github.com/summarizator/fora-frontend/commit/7b035fed)
  - [chore: release 0.5.51](https://github.com/summarizator/fora-frontend/commit/ae71451f)
  - [chore: release 0.5.50](https://github.com/summarizator/fora-frontend/commit/58f8c159)
  - [ugh](https://github.com/summarizator/fora-frontend/commit/8505a73a)
  - [chore: update changelog for production release v0.5.49](https://github.com/summarizator/fora-frontend/commit/df6ee29c)
  - [chore: release 0.5.49](https://github.com/summarizator/fora-frontend/commit/c41529fb)
  - [Merge pull request #1163 from summarizator/dev](https://github.com/summarizator/fora-frontend/commit/289df588)
  - [zzzz222](https://github.com/summarizator/fora-frontend/commit/6e2ae365)
  - [zzzz](https://github.com/summarizator/fora-frontend/commit/951ca70a)
  - [chore: update changelog for production release v0.5.47](https://github.com/summarizator/fora-frontend/commit/94dafc05)
  - [chore: release 0.5.47](https://github.com/summarizator/fora-frontend/commit/183339bc)
  - [Merge pull request #1161 from summarizator/dev](https://github.com/summarizator/fora-frontend/commit/69cfcf27)
  - [maybe fix for prod job](https://github.com/summarizator/fora-frontend/commit/8a11074e)
  - [maybe fix for prod job](https://github.com/summarizator/fora-frontend/commit/7464a06c)
  - [chore: update changelog for production release v0.5.45](https://github.com/summarizator/fora-frontend/commit/d263b855)
  - [chore: release 0.5.45](https://github.com/summarizator/fora-frontend/commit/59639faa)
  - [Merge pull request #1159 from summarizator/dev](https://github.com/summarizator/fora-frontend/commit/af095ba7)
  - [Merge pull request #1157 from summarizator/dev](https://github.com/summarizator/fora-frontend/commit/a1b746a8)
  - [Merge pull request #1148 from summarizator/dev](https://github.com/summarizator/fora-frontend/commit/114e049b)
  - [maybe fix for prod job](https://github.com/summarizator/fora-frontend/commit/7f4efa61)
  - [use cache for prod job too](https://github.com/summarizator/fora-frontend/commit/8fb0bc20)
  - [perhaps prod changes 3](https://github.com/summarizator/fora-frontend/commit/5a886e4f)
  - [perhaps prod changes 3](https://github.com/summarizator/fora-frontend/commit/2d166700)
  - [commit 2](https://github.com/summarizator/fora-frontend/commit/f2314527)
  - [commit 1](https://github.com/summarizator/fora-frontend/commit/2c82ec3e)
  - [aaaaanotherz](https://github.com/summarizator/fora-frontend/commit/a612e1e5)
  - [chore: release 0.5.39](https://github.com/summarizator/fora-frontend/commit/6c21fbb5)
  - [chore: release 0.5.36](https://github.com/summarizator/fora-frontend/commit/c46d914f)
  - [](https://github.com/summarizator/fora-frontend/commit/)
  - [](https://github.com/summarizator/fora-frontend/commit/)
  - [](https://github.com/summarizator/fora-frontend/commit/)
  - [chore: release 0.5.27](https://github.com/summarizator/fora-frontend/commit/5879296f)
  - [logz](https://github.com/summarizator/fora-frontend/commit/780e7fa6)
  - [logz](https://github.com/summarizator/fora-frontend/commit/625aee98)
  - [chore: release 0.5.26](https://github.com/summarizator/fora-frontend/commit/0a936731)
  - [chore: release 0.5.25](https://github.com/summarizator/fora-frontend/commit/3f677031)
  - [chore: release 0.5.24](https://github.com/summarizator/fora-frontend/commit/3aa63c2c)
  - [chore: release 0.5.23](https://github.com/summarizator/fora-frontend/commit/e31e8d5f)
  - [chore: release 0.5.18](https://github.com/summarizator/fora-frontend/commit/56f9d7ec)
  - [chore: release 0.5.17](https://github.com/summarizator/fora-frontend/commit/2bec2ac9)
  - [chore: release 0.5.16](https://github.com/summarizator/fora-frontend/commit/1ce7c9e9)
  - [cool new readme](https://github.com/summarizator/fora-frontend/commit/bba4c6ed)

  </details>

- [FORA-878](https://foraday.atlassian.net/browse/FORA-878): Allow category change on recent page
  <details>
    <summary>Commits</summary>

  - [](https://github.com/summarizator/fora-frontend/commit/)

  </details>

- [FORA-1085](https://foraday.atlassian.net/browse/FORA-1085): Create Summary modal
  <details>
    <summary>Commits</summary>

  - [](https://github.com/summarizator/fora-frontend/commit/)

  </details>

- [FORA-1066](https://foraday.atlassian.net/browse/FORA-1066): SPIKE - Okta Integration
  <details>
    <summary>Commits</summary>

  - [](https://github.com/summarizator/fora-frontend/commit/)

  </details>

- [FORA-840](https://foraday.atlassian.net/browse/FORA-840): Integrate Release-It to FE Repo
  <details>
    <summary>Commits</summary>

  - [chore: release 0.5.14](https://github.com/summarizator/fora-frontend/commit/88fee98e)
  - [chore: release 0.5.13](https://github.com/summarizator/fora-frontend/commit/f11b546c)
  - [chore: release 0.5.12](https://github.com/summarizator/fora-frontend/commit/9dc77c8a)
  - [chore: release 0.5.11](https://github.com/summarizator/fora-frontend/commit/10c35a54)
  - [chore: release 0.5.10](https://github.com/summarizator/fora-frontend/commit/8ee45320)
  - [chore: release 0.5.9](https://github.com/summarizator/fora-frontend/commit/b2ae433b)
  - [chore: release 0.5.8](https://github.com/summarizator/fora-frontend/commit/ceed34d9)
  - [chore: release 0.5.7](https://github.com/summarizator/fora-frontend/commit/53d84d35)
  - [chore: release 0.5.6](https://github.com/summarizator/fora-frontend/commit/0d250ed2)
  - [chore: release 0.5.5](https://github.com/summarizator/fora-frontend/commit/bf541008)
  - [chore: release 0.5.4](https://github.com/summarizator/fora-frontend/commit/9c37c293)
  - [chore: release 0.5.3](https://github.com/summarizator/fora-frontend/commit/f7d4bfe8)
  - [chore: release 0.5.2](https://github.com/summarizator/fora-frontend/commit/bf4a84db)
  - [chore: release 0.5.1](https://github.com/summarizator/fora-frontend/commit/aadf74d3)
  - [chore: release 0.5.2](https://github.com/summarizator/fora-frontend/commit/6b514330)
  - [chore: release 0.6.11](https://github.com/summarizator/fora-frontend/commit/ece60a67)
  - [chore: release 0.6.10](https://github.com/summarizator/fora-frontend/commit/2de1bedb)
  - [chore: release 0.6.9](https://github.com/summarizator/fora-frontend/commit/53b8f5ca)
  - [chore: release 0.6.8](https://github.com/summarizator/fora-frontend/commit/7798ad1d)
  - [chore: release 0.6.7](https://github.com/summarizator/fora-frontend/commit/f886470d)
  - [chore: release 0.6.6](https://github.com/summarizator/fora-frontend/commit/330eb03c)
  - [chore: release 0.6.5](https://github.com/summarizator/fora-frontend/commit/6787b64c)
  - [chore: release 0.6.4](https://github.com/summarizator/fora-frontend/commit/5a0fa3e6)
  - [chore: release 0.6.3](https://github.com/summarizator/fora-frontend/commit/6f8abded)
  - [Merge branch 'dev' into FORA-840](https://github.com/summarizator/fora-frontend/commit/c6bb1a7a)
  - [chore: release 0.6.1](https://github.com/summarizator/fora-frontend/commit/a9f1d7e6)
  - [chore: release 0.6.0](https://github.com/summarizator/fora-frontend/commit/6d5b7351)
  - [Merge branch 'dev' of github.com:summarizator/fora-frontend into FORA-840](https://github.com/summarizator/fora-frontend/commit/06ad38b4)
  - [try to kill all warnings](https://github.com/summarizator/fora-frontend/commit/7b1f20bb)
  - [add linting to pre-push](https://github.com/summarizator/fora-frontend/commit/0763edf0)
  - [add linting to pre-push](https://github.com/summarizator/fora-frontend/commit/963ff2f0)
  - [fix lint](https://github.com/summarizator/fora-frontend/commit/a8d262df)
  - [test](https://github.com/summarizator/fora-frontend/commit/e3f4e99b)
  - [clean](https://github.com/summarizator/fora-frontend/commit/fcedb650)
  - [fixes](https://github.com/summarizator/fora-frontend/commit/9d05113a)
  - [chore: release 0.5.15](https://github.com/summarizator/fora-frontend/commit/989f6fa9)
  - [chore: release 0.5.14](https://github.com/summarizator/fora-frontend/commit/42ad3861)
  - [Merge branch 'dev' into FORA-840](https://github.com/summarizator/fora-frontend/commit/df1530e1)
  - [chore: release 0.5.13](https://github.com/summarizator/fora-frontend/commit/10932202)
  - [chore: release 0.5.12](https://github.com/summarizator/fora-frontend/commit/92dcd324)
  - [fixes](https://github.com/summarizator/fora-frontend/commit/b27af8e0)
  - [build stuff](https://github.com/summarizator/fora-frontend/commit/3c72984b)
  - [think its working](https://github.com/summarizator/fora-frontend/commit/85c70b83)
  - [think its working](https://github.com/summarizator/fora-frontend/commit/3bbd19d3)
  - [Merge branch 'dev' into FORA-840](https://github.com/summarizator/fora-frontend/commit/601022d4)
  - [think its working](https://github.com/summarizator/fora-frontend/commit/70f85e94)
  - [chore: release 0.5.11](https://github.com/summarizator/fora-frontend/commit/f231b109)
  - [chore: release 0.5.10](https://github.com/summarizator/fora-frontend/commit/2b3663f4)
  - [chore: release 0.5.9](https://github.com/summarizator/fora-frontend/commit/b2cc8d94)
  - [chore: release 0.5.8](https://github.com/summarizator/fora-frontend/commit/dbb82f0d)
  - [chore: release 0.5.7](https://github.com/summarizator/fora-frontend/commit/a7712fb6)
  - [chore: release 0.5.6](https://github.com/summarizator/fora-frontend/commit/c6b905b6)
  - [untested prod function](https://github.com/summarizator/fora-frontend/commit/254f8fe4)
  - [chore: release 0.5.5](https://github.com/summarizator/fora-frontend/commit/c61eed54)
  - [start concept of dev and prod releases](https://github.com/summarizator/fora-frontend/commit/e288b500)
  - [chore: release 0.5.4](https://github.com/summarizator/fora-frontend/commit/bb2a5ef1)
  - [chore: release 0.5.3](https://github.com/summarizator/fora-frontend/commit/3c1e584e)
  - [chore: release 0.5.2](https://github.com/summarizator/fora-frontend/commit/b79edc4b)
  - [chore: release 0.5.1](https://github.com/summarizator/fora-frontend/commit/8a7be26f)
  - [rm commit message hook](https://github.com/summarizator/fora-frontend/commit/59e2d658)
  - [fix: json writing](https://github.com/summarizator/fora-frontend/commit/eab3c626)
  - [chore: release 0.15.28](https://github.com/summarizator/fora-frontend/commit/200f276c)
  - [chore: release 0.15.27](https://github.com/summarizator/fora-frontend/commit/8c35ce2c)
  - [chore: release 0.15.25](https://github.com/summarizator/fora-frontend/commit/41d91fe7)
  - [chore: release 0.15.24](https://github.com/summarizator/fora-frontend/commit/f8b43f75)
  - [chore: release 0.15.23](https://github.com/summarizator/fora-frontend/commit/2d8850c7)
  - [chore: release 0.15.22](https://github.com/summarizator/fora-frontend/commit/c0970bcc)
  - [chore: release 0.15.21](https://github.com/summarizator/fora-frontend/commit/29d219d0)
  - [chore: release 0.15.20](https://github.com/summarizator/fora-frontend/commit/da361273)
  - [fix: json writing](https://github.com/summarizator/fora-frontend/commit/16c1a997)
  - [chore: release 0.15.19](https://github.com/summarizator/fora-frontend/commit/c06bd710)
  - [chore: release 0.15.18](https://github.com/summarizator/fora-frontend/commit/e8729ef2)
  - [chore: release 0.15.17](https://github.com/summarizator/fora-frontend/commit/9c5889e0)
  - [chore: release 0.15.16](https://github.com/summarizator/fora-frontend/commit/74b14f5b)
  - [chore: release 0.15.15](https://github.com/summarizator/fora-frontend/commit/cfb51171)
  - [chore: release 0.15.14](https://github.com/summarizator/fora-frontend/commit/05185594)
  - [chore: release 0.15.13](https://github.com/summarizator/fora-frontend/commit/b104e115)
  - [chore: release 0.15.12](https://github.com/summarizator/fora-frontend/commit/632914ae)
  - [chore: release 0.15.11](https://github.com/summarizator/fora-frontend/commit/2c5ba71e)
  - [fix: looks like i want it to](https://github.com/summarizator/fora-frontend/commit/ac551328)
  - [chore: release 0.15.9](https://github.com/summarizator/fora-frontend/commit/b4e4b927)
  - [chore: release 0.15.8](https://github.com/summarizator/fora-frontend/commit/8ea004e1)
  - [chore: release 0.15.7](https://github.com/summarizator/fora-frontend/commit/25eea181)
  - [chore: release 0.15.6](https://github.com/summarizator/fora-frontend/commit/c4d8839e)
  - [chore: release 0.15.5](https://github.com/summarizator/fora-frontend/commit/724d618e)
  - [chore: release 0.15.4](https://github.com/summarizator/fora-frontend/commit/fb3ed7e2)
  - [chore: release 0.15.3](https://github.com/summarizator/fora-frontend/commit/de1a6c17)
  - [fix: some more edits](https://github.com/summarizator/fora-frontend/commit/828b63f9)
  - [chore: release 0.15.0](https://github.com/summarizator/fora-frontend/commit/8d1f5e03)
  - [fix: some more edits](https://github.com/summarizator/fora-frontend/commit/421858f9)
  - [fix: some more edits](https://github.com/summarizator/fora-frontend/commit/9a7a0e95)
  - [fix: got it](https://github.com/summarizator/fora-frontend/commit/1251fdb4)
  - [chore: release 0.14.0](https://github.com/summarizator/fora-frontend/commit/de185c95)
  - [chore: release 0.13.0](https://github.com/summarizator/fora-frontend/commit/ed9cf8fd)
  - [chore: release 0.12.0](https://github.com/summarizator/fora-frontend/commit/1b1d868d)
  - [chore: release 0.11.0](https://github.com/summarizator/fora-frontend/commit/0ad82baa)
  - [chore: release 0.10.0](https://github.com/summarizator/fora-frontend/commit/b6e2da3f)
  - [chore: release 0.9.0](https://github.com/summarizator/fora-frontend/commit/37594ba8)
  - [chore: release 0.8.0](https://github.com/summarizator/fora-frontend/commit/60a50f28)
  - [chore: release 0.7.0](https://github.com/summarizator/fora-frontend/commit/dd08fbab)
  - [chore: release 0.6.0](https://github.com/summarizator/fora-frontend/commit/037a9275)
  - [fix: some more readme formatting for dates](https://github.com/summarizator/fora-frontend/commit/f3ea4051)
  - [fix: some more readme formatting](https://github.com/summarizator/fora-frontend/commit/27b0c0be)
  - [fix: maybe fix release flow](https://github.com/summarizator/fora-frontend/commit/8f8fa992)
  - [chore: maybe move pre-push check](https://github.com/summarizator/fora-frontend/commit/396b69c2)
  - [fix: maybe fix branch naming](https://github.com/summarizator/fora-frontend/commit/2ebf827e)
  - [feat: test feature here](https://github.com/summarizator/fora-frontend/commit/9f4ba6ff)
  - [fix: husky hook](https://github.com/summarizator/fora-frontend/commit/09b68c85)
  - [test husky](https://github.com/summarizator/fora-frontend/commit/017494c1)
  - [test husky](https://github.com/summarizator/fora-frontend/commit/2dbd3a41)
  - [chore: release 0.5.3](https://github.com/summarizator/fora-frontend/commit/39be00fb)
  - [chore: release 0.5.2](https://github.com/summarizator/fora-frontend/commit/1b46922f)
  - [start of releaseit](https://github.com/summarizator/fora-frontend/commit/ac2c95bf)
  - [chore: release v0.5.1](https://github.com/summarizator/fora-frontend/commit/ffeb29d4)
  - [build info plugin](https://github.com/summarizator/fora-frontend/commit/7c82d728)

  </details>

### Bug Fixes

- [FORA-1117](https://foraday.atlassian.net/browse/FORA-1117): broken guest user flow
  <details>
    <summary>Commits</summary>

  - [chore: release 0.5.37](https://github.com/summarizator/fora-frontend/commit/8c83d46c)

  </details>

- [FORA-1115](https://foraday.atlassian.net/browse/FORA-1115): Add padding on meeting detail page
  <details>
    <summary>Commits</summary>

  - [](https://github.com/summarizator/fora-frontend/commit/)

  </details>

- [FORA-1114](https://foraday.atlassian.net/browse/FORA-1114): remove duplicate fora lenses
  <details>
    <summary>Commits</summary>

  - [](https://github.com/summarizator/fora-frontend/commit/)

  </details>

## [0.5.67](https://github.com/summarizator/fora-frontend/compare/v0.5.66...v0.5.67) <span style="color: red;">[prod]</span>

> Thu, Jan 23 2025 | 09:48 PM EST

### Features

- [FORA-1077](https://foraday.atlassian.net/browse/FORA-1077): FE: Integrate Release-It to github actions flow
  <details>
    <summary>Commits</summary>

  - [maybe finally](https://github.com/summarizator/fora-frontend/commit/f951eb46)
  - [chore: release 0.5.61](https://github.com/summarizator/fora-frontend/commit/34a27f86)
  - [chore: release 0.5.60](https://github.com/summarizator/fora-frontend/commit/205cf6bb)
  - [chore: release 0.5.59](https://github.com/summarizator/fora-frontend/commit/b8ce3830)
  - [chore: release 0.5.58](https://github.com/summarizator/fora-frontend/commit/7196a14f)
  - [chore: release 0.5.57](https://github.com/summarizator/fora-frontend/commit/5e6f6c3e)
  - [chore: release 0.5.56](https://github.com/summarizator/fora-frontend/commit/2641b805)
  - [chore: release 0.5.55](https://github.com/summarizator/fora-frontend/commit/90dea734)
  - [chore: release 0.5.54](https://github.com/summarizator/fora-frontend/commit/c8bd5549)
  - [chore: release 0.5.53](https://github.com/summarizator/fora-frontend/commit/8702254c)
  - [chore: release 0.5.52](https://github.com/summarizator/fora-frontend/commit/7b035fed)
  - [chore: release 0.5.51](https://github.com/summarizator/fora-frontend/commit/ae71451f)
  - [chore: release 0.5.50](https://github.com/summarizator/fora-frontend/commit/58f8c159)
  - [ugh](https://github.com/summarizator/fora-frontend/commit/8505a73a)
  - [chore: update changelog for production release v0.5.49](https://github.com/summarizator/fora-frontend/commit/df6ee29c)
  - [chore: release 0.5.49](https://github.com/summarizator/fora-frontend/commit/c41529fb)
  - [Merge pull request #1163 from summarizator/dev](https://github.com/summarizator/fora-frontend/commit/289df588)
  - [zzzz222](https://github.com/summarizator/fora-frontend/commit/6e2ae365)
  - [zzzz](https://github.com/summarizator/fora-frontend/commit/951ca70a)
  - [chore: update changelog for production release v0.5.47](https://github.com/summarizator/fora-frontend/commit/94dafc05)
  - [chore: release 0.5.47](https://github.com/summarizator/fora-frontend/commit/183339bc)
  - [Merge pull request #1161 from summarizator/dev](https://github.com/summarizator/fora-frontend/commit/69cfcf27)
  - [maybe fix for prod job](https://github.com/summarizator/fora-frontend/commit/8a11074e)
  - [maybe fix for prod job](https://github.com/summarizator/fora-frontend/commit/7464a06c)
  - [chore: update changelog for production release v0.5.45](https://github.com/summarizator/fora-frontend/commit/d263b855)
  - [chore: release 0.5.45](https://github.com/summarizator/fora-frontend/commit/59639faa)
  - [Merge pull request #1159 from summarizator/dev](https://github.com/summarizator/fora-frontend/commit/af095ba7)
  - [Merge pull request #1157 from summarizator/dev](https://github.com/summarizator/fora-frontend/commit/a1b746a8)
  - [Merge pull request #1148 from summarizator/dev](https://github.com/summarizator/fora-frontend/commit/114e049b)
  - [maybe fix for prod job](https://github.com/summarizator/fora-frontend/commit/7f4efa61)
  - [use cache for prod job too](https://github.com/summarizator/fora-frontend/commit/8fb0bc20)
  - [perhaps prod changes 3](https://github.com/summarizator/fora-frontend/commit/5a886e4f)
  - [perhaps prod changes 3](https://github.com/summarizator/fora-frontend/commit/2d166700)
  - [commit 2](https://github.com/summarizator/fora-frontend/commit/f2314527)
  - [commit 1](https://github.com/summarizator/fora-frontend/commit/2c82ec3e)
  - [aaaaanotherz](https://github.com/summarizator/fora-frontend/commit/a612e1e5)
  - [chore: release 0.5.39](https://github.com/summarizator/fora-frontend/commit/6c21fbb5)
  - [chore: release 0.5.36](https://github.com/summarizator/fora-frontend/commit/c46d914f)
  - [](https://github.com/summarizator/fora-frontend/commit/)
  - [](https://github.com/summarizator/fora-frontend/commit/)
  - [](https://github.com/summarizator/fora-frontend/commit/)
  - [chore: release 0.5.27](https://github.com/summarizator/fora-frontend/commit/5879296f)
  - [logz](https://github.com/summarizator/fora-frontend/commit/780e7fa6)
  - [logz](https://github.com/summarizator/fora-frontend/commit/625aee98)
  - [chore: release 0.5.26](https://github.com/summarizator/fora-frontend/commit/0a936731)
  - [chore: release 0.5.25](https://github.com/summarizator/fora-frontend/commit/3f677031)
  - [chore: release 0.5.24](https://github.com/summarizator/fora-frontend/commit/3aa63c2c)
  - [chore: release 0.5.23](https://github.com/summarizator/fora-frontend/commit/e31e8d5f)
  - [chore: release 0.5.18](https://github.com/summarizator/fora-frontend/commit/56f9d7ec)
  - [chore: release 0.5.17](https://github.com/summarizator/fora-frontend/commit/2bec2ac9)
  - [chore: release 0.5.16](https://github.com/summarizator/fora-frontend/commit/1ce7c9e9)
  - [cool new readme](https://github.com/summarizator/fora-frontend/commit/bba4c6ed)

  </details>

- [FORA-878](https://foraday.atlassian.net/browse/FORA-878): Allow category change on recent page
  <details>
    <summary>Commits</summary>

  - [](https://github.com/summarizator/fora-frontend/commit/)

  </details>

- [FORA-1085](https://foraday.atlassian.net/browse/FORA-1085): Create Summary modal
  <details>
    <summary>Commits</summary>

  - [](https://github.com/summarizator/fora-frontend/commit/)

  </details>

- [FORA-1066](https://foraday.atlassian.net/browse/FORA-1066): SPIKE - Okta Integration
  <details>
    <summary>Commits</summary>

  - [](https://github.com/summarizator/fora-frontend/commit/)

  </details>

- [FORA-840](https://foraday.atlassian.net/browse/FORA-840): Integrate Release-It to FE Repo
  <details>
    <summary>Commits</summary>

  - [chore: release 0.5.14](https://github.com/summarizator/fora-frontend/commit/88fee98e)
  - [chore: release 0.5.13](https://github.com/summarizator/fora-frontend/commit/f11b546c)
  - [chore: release 0.5.12](https://github.com/summarizator/fora-frontend/commit/9dc77c8a)
  - [chore: release 0.5.11](https://github.com/summarizator/fora-frontend/commit/10c35a54)
  - [chore: release 0.5.10](https://github.com/summarizator/fora-frontend/commit/8ee45320)
  - [chore: release 0.5.9](https://github.com/summarizator/fora-frontend/commit/b2ae433b)
  - [chore: release 0.5.8](https://github.com/summarizator/fora-frontend/commit/ceed34d9)
  - [chore: release 0.5.7](https://github.com/summarizator/fora-frontend/commit/53d84d35)
  - [chore: release 0.5.6](https://github.com/summarizator/fora-frontend/commit/0d250ed2)
  - [chore: release 0.5.5](https://github.com/summarizator/fora-frontend/commit/bf541008)
  - [chore: release 0.5.4](https://github.com/summarizator/fora-frontend/commit/9c37c293)
  - [chore: release 0.5.3](https://github.com/summarizator/fora-frontend/commit/f7d4bfe8)
  - [chore: release 0.5.2](https://github.com/summarizator/fora-frontend/commit/bf4a84db)
  - [chore: release 0.5.1](https://github.com/summarizator/fora-frontend/commit/aadf74d3)
  - [chore: release 0.5.2](https://github.com/summarizator/fora-frontend/commit/6b514330)
  - [chore: release 0.6.11](https://github.com/summarizator/fora-frontend/commit/ece60a67)
  - [chore: release 0.6.10](https://github.com/summarizator/fora-frontend/commit/2de1bedb)
  - [chore: release 0.6.9](https://github.com/summarizator/fora-frontend/commit/53b8f5ca)
  - [chore: release 0.6.8](https://github.com/summarizator/fora-frontend/commit/7798ad1d)
  - [chore: release 0.6.7](https://github.com/summarizator/fora-frontend/commit/f886470d)
  - [chore: release 0.6.6](https://github.com/summarizator/fora-frontend/commit/330eb03c)
  - [chore: release 0.6.5](https://github.com/summarizator/fora-frontend/commit/6787b64c)
  - [chore: release 0.6.4](https://github.com/summarizator/fora-frontend/commit/5a0fa3e6)
  - [chore: release 0.6.3](https://github.com/summarizator/fora-frontend/commit/6f8abded)
  - [Merge branch 'dev' into FORA-840](https://github.com/summarizator/fora-frontend/commit/c6bb1a7a)
  - [chore: release 0.6.1](https://github.com/summarizator/fora-frontend/commit/a9f1d7e6)
  - [chore: release 0.6.0](https://github.com/summarizator/fora-frontend/commit/6d5b7351)
  - [Merge branch 'dev' of github.com:summarizator/fora-frontend into FORA-840](https://github.com/summarizator/fora-frontend/commit/06ad38b4)
  - [try to kill all warnings](https://github.com/summarizator/fora-frontend/commit/7b1f20bb)
  - [add linting to pre-push](https://github.com/summarizator/fora-frontend/commit/0763edf0)
  - [add linting to pre-push](https://github.com/summarizator/fora-frontend/commit/963ff2f0)
  - [fix lint](https://github.com/summarizator/fora-frontend/commit/a8d262df)
  - [test](https://github.com/summarizator/fora-frontend/commit/e3f4e99b)
  - [clean](https://github.com/summarizator/fora-frontend/commit/fcedb650)
  - [fixes](https://github.com/summarizator/fora-frontend/commit/9d05113a)
  - [chore: release 0.5.15](https://github.com/summarizator/fora-frontend/commit/989f6fa9)
  - [chore: release 0.5.14](https://github.com/summarizator/fora-frontend/commit/42ad3861)
  - [Merge branch 'dev' into FORA-840](https://github.com/summarizator/fora-frontend/commit/df1530e1)
  - [chore: release 0.5.13](https://github.com/summarizator/fora-frontend/commit/10932202)
  - [chore: release 0.5.12](https://github.com/summarizator/fora-frontend/commit/92dcd324)
  - [fixes](https://github.com/summarizator/fora-frontend/commit/b27af8e0)
  - [build stuff](https://github.com/summarizator/fora-frontend/commit/3c72984b)
  - [think its working](https://github.com/summarizator/fora-frontend/commit/85c70b83)
  - [think its working](https://github.com/summarizator/fora-frontend/commit/3bbd19d3)
  - [Merge branch 'dev' into FORA-840](https://github.com/summarizator/fora-frontend/commit/601022d4)
  - [think its working](https://github.com/summarizator/fora-frontend/commit/70f85e94)
  - [chore: release 0.5.11](https://github.com/summarizator/fora-frontend/commit/f231b109)
  - [chore: release 0.5.10](https://github.com/summarizator/fora-frontend/commit/2b3663f4)
  - [chore: release 0.5.9](https://github.com/summarizator/fora-frontend/commit/b2cc8d94)
  - [chore: release 0.5.8](https://github.com/summarizator/fora-frontend/commit/dbb82f0d)
  - [chore: release 0.5.7](https://github.com/summarizator/fora-frontend/commit/a7712fb6)
  - [chore: release 0.5.6](https://github.com/summarizator/fora-frontend/commit/c6b905b6)
  - [untested prod function](https://github.com/summarizator/fora-frontend/commit/254f8fe4)
  - [chore: release 0.5.5](https://github.com/summarizator/fora-frontend/commit/c61eed54)
  - [start concept of dev and prod releases](https://github.com/summarizator/fora-frontend/commit/e288b500)
  - [chore: release 0.5.4](https://github.com/summarizator/fora-frontend/commit/bb2a5ef1)
  - [chore: release 0.5.3](https://github.com/summarizator/fora-frontend/commit/3c1e584e)
  - [chore: release 0.5.2](https://github.com/summarizator/fora-frontend/commit/b79edc4b)
  - [chore: release 0.5.1](https://github.com/summarizator/fora-frontend/commit/8a7be26f)
  - [rm commit message hook](https://github.com/summarizator/fora-frontend/commit/59e2d658)
  - [fix: json writing](https://github.com/summarizator/fora-frontend/commit/eab3c626)
  - [chore: release 0.15.28](https://github.com/summarizator/fora-frontend/commit/200f276c)
  - [chore: release 0.15.27](https://github.com/summarizator/fora-frontend/commit/8c35ce2c)
  - [chore: release 0.15.25](https://github.com/summarizator/fora-frontend/commit/41d91fe7)
  - [chore: release 0.15.24](https://github.com/summarizator/fora-frontend/commit/f8b43f75)
  - [chore: release 0.15.23](https://github.com/summarizator/fora-frontend/commit/2d8850c7)
  - [chore: release 0.15.22](https://github.com/summarizator/fora-frontend/commit/c0970bcc)
  - [chore: release 0.15.21](https://github.com/summarizator/fora-frontend/commit/29d219d0)
  - [chore: release 0.15.20](https://github.com/summarizator/fora-frontend/commit/da361273)
  - [fix: json writing](https://github.com/summarizator/fora-frontend/commit/16c1a997)
  - [chore: release 0.15.19](https://github.com/summarizator/fora-frontend/commit/c06bd710)
  - [chore: release 0.15.18](https://github.com/summarizator/fora-frontend/commit/e8729ef2)
  - [chore: release 0.15.17](https://github.com/summarizator/fora-frontend/commit/9c5889e0)
  - [chore: release 0.15.16](https://github.com/summarizator/fora-frontend/commit/74b14f5b)
  - [chore: release 0.15.15](https://github.com/summarizator/fora-frontend/commit/cfb51171)
  - [chore: release 0.15.14](https://github.com/summarizator/fora-frontend/commit/05185594)
  - [chore: release 0.15.13](https://github.com/summarizator/fora-frontend/commit/b104e115)
  - [chore: release 0.15.12](https://github.com/summarizator/fora-frontend/commit/632914ae)
  - [chore: release 0.15.11](https://github.com/summarizator/fora-frontend/commit/2c5ba71e)
  - [fix: looks like i want it to](https://github.com/summarizator/fora-frontend/commit/ac551328)
  - [chore: release 0.15.9](https://github.com/summarizator/fora-frontend/commit/b4e4b927)
  - [chore: release 0.15.8](https://github.com/summarizator/fora-frontend/commit/8ea004e1)
  - [chore: release 0.15.7](https://github.com/summarizator/fora-frontend/commit/25eea181)
  - [chore: release 0.15.6](https://github.com/summarizator/fora-frontend/commit/c4d8839e)
  - [chore: release 0.15.5](https://github.com/summarizator/fora-frontend/commit/724d618e)
  - [chore: release 0.15.4](https://github.com/summarizator/fora-frontend/commit/fb3ed7e2)
  - [chore: release 0.15.3](https://github.com/summarizator/fora-frontend/commit/de1a6c17)
  - [fix: some more edits](https://github.com/summarizator/fora-frontend/commit/828b63f9)
  - [chore: release 0.15.0](https://github.com/summarizator/fora-frontend/commit/8d1f5e03)
  - [fix: some more edits](https://github.com/summarizator/fora-frontend/commit/421858f9)
  - [fix: some more edits](https://github.com/summarizator/fora-frontend/commit/9a7a0e95)
  - [fix: got it](https://github.com/summarizator/fora-frontend/commit/1251fdb4)
  - [chore: release 0.14.0](https://github.com/summarizator/fora-frontend/commit/de185c95)
  - [chore: release 0.13.0](https://github.com/summarizator/fora-frontend/commit/ed9cf8fd)
  - [chore: release 0.12.0](https://github.com/summarizator/fora-frontend/commit/1b1d868d)
  - [chore: release 0.11.0](https://github.com/summarizator/fora-frontend/commit/0ad82baa)
  - [chore: release 0.10.0](https://github.com/summarizator/fora-frontend/commit/b6e2da3f)
  - [chore: release 0.9.0](https://github.com/summarizator/fora-frontend/commit/37594ba8)
  - [chore: release 0.8.0](https://github.com/summarizator/fora-frontend/commit/60a50f28)
  - [chore: release 0.7.0](https://github.com/summarizator/fora-frontend/commit/dd08fbab)
  - [chore: release 0.6.0](https://github.com/summarizator/fora-frontend/commit/037a9275)
  - [fix: some more readme formatting for dates](https://github.com/summarizator/fora-frontend/commit/f3ea4051)
  - [fix: some more readme formatting](https://github.com/summarizator/fora-frontend/commit/27b0c0be)
  - [fix: maybe fix release flow](https://github.com/summarizator/fora-frontend/commit/8f8fa992)
  - [chore: maybe move pre-push check](https://github.com/summarizator/fora-frontend/commit/396b69c2)
  - [fix: maybe fix branch naming](https://github.com/summarizator/fora-frontend/commit/2ebf827e)
  - [feat: test feature here](https://github.com/summarizator/fora-frontend/commit/9f4ba6ff)
  - [fix: husky hook](https://github.com/summarizator/fora-frontend/commit/09b68c85)
  - [test husky](https://github.com/summarizator/fora-frontend/commit/017494c1)
  - [test husky](https://github.com/summarizator/fora-frontend/commit/2dbd3a41)
  - [chore: release 0.5.3](https://github.com/summarizator/fora-frontend/commit/39be00fb)
  - [chore: release 0.5.2](https://github.com/summarizator/fora-frontend/commit/1b46922f)
  - [start of releaseit](https://github.com/summarizator/fora-frontend/commit/ac2c95bf)
  - [chore: release v0.5.1](https://github.com/summarizator/fora-frontend/commit/ffeb29d4)
  - [build info plugin](https://github.com/summarizator/fora-frontend/commit/7c82d728)

  </details>

### Bug Fixes

- [FORA-1117](https://foraday.atlassian.net/browse/FORA-1117): broken guest user flow
  <details>
    <summary>Commits</summary>

  - [chore: release 0.5.37](https://github.com/summarizator/fora-frontend/commit/8c83d46c)

  </details>

- [FORA-1115](https://foraday.atlassian.net/browse/FORA-1115): Add padding on meeting detail page
  <details>
    <summary>Commits</summary>

  - [](https://github.com/summarizator/fora-frontend/commit/)

  </details>

- [FORA-1114](https://foraday.atlassian.net/browse/FORA-1114): remove duplicate fora lenses
  <details>
    <summary>Commits</summary>

  - [](https://github.com/summarizator/fora-frontend/commit/)

  </details>

## [0.5.66](https://github.com/summarizator/fora-frontend/compare/v0.5.65...v0.5.66) <span style="color: red;">[prod]</span>

> Thu, Jan 23 2025 | 09:45 PM EST

### Features

- [FORA-1077](https://foraday.atlassian.net/browse/FORA-1077): FE: Integrate Release-It to github actions flow
  <details>
    <summary>Commits</summary>

  - [maybe finally](https://github.com/summarizator/fora-frontend/commit/f951eb46)
  - [chore: release 0.5.61](https://github.com/summarizator/fora-frontend/commit/34a27f86)
  - [chore: release 0.5.60](https://github.com/summarizator/fora-frontend/commit/205cf6bb)
  - [chore: release 0.5.59](https://github.com/summarizator/fora-frontend/commit/b8ce3830)
  - [chore: release 0.5.58](https://github.com/summarizator/fora-frontend/commit/7196a14f)
  - [chore: release 0.5.57](https://github.com/summarizator/fora-frontend/commit/5e6f6c3e)
  - [chore: release 0.5.56](https://github.com/summarizator/fora-frontend/commit/2641b805)
  - [chore: release 0.5.55](https://github.com/summarizator/fora-frontend/commit/90dea734)
  - [chore: release 0.5.54](https://github.com/summarizator/fora-frontend/commit/c8bd5549)
  - [chore: release 0.5.53](https://github.com/summarizator/fora-frontend/commit/8702254c)
  - [chore: release 0.5.52](https://github.com/summarizator/fora-frontend/commit/7b035fed)
  - [chore: release 0.5.51](https://github.com/summarizator/fora-frontend/commit/ae71451f)
  - [chore: release 0.5.50](https://github.com/summarizator/fora-frontend/commit/58f8c159)
  - [ugh](https://github.com/summarizator/fora-frontend/commit/8505a73a)
  - [chore: update changelog for production release v0.5.49](https://github.com/summarizator/fora-frontend/commit/df6ee29c)
  - [chore: release 0.5.49](https://github.com/summarizator/fora-frontend/commit/c41529fb)
  - [Merge pull request #1163 from summarizator/dev](https://github.com/summarizator/fora-frontend/commit/289df588)
  - [zzzz222](https://github.com/summarizator/fora-frontend/commit/6e2ae365)
  - [zzzz](https://github.com/summarizator/fora-frontend/commit/951ca70a)
  - [chore: update changelog for production release v0.5.47](https://github.com/summarizator/fora-frontend/commit/94dafc05)
  - [chore: release 0.5.47](https://github.com/summarizator/fora-frontend/commit/183339bc)
  - [Merge pull request #1161 from summarizator/dev](https://github.com/summarizator/fora-frontend/commit/69cfcf27)
  - [maybe fix for prod job](https://github.com/summarizator/fora-frontend/commit/8a11074e)
  - [maybe fix for prod job](https://github.com/summarizator/fora-frontend/commit/7464a06c)
  - [chore: update changelog for production release v0.5.45](https://github.com/summarizator/fora-frontend/commit/d263b855)
  - [chore: release 0.5.45](https://github.com/summarizator/fora-frontend/commit/59639faa)
  - [Merge pull request #1159 from summarizator/dev](https://github.com/summarizator/fora-frontend/commit/af095ba7)
  - [Merge pull request #1157 from summarizator/dev](https://github.com/summarizator/fora-frontend/commit/a1b746a8)
  - [Merge pull request #1148 from summarizator/dev](https://github.com/summarizator/fora-frontend/commit/114e049b)
  - [maybe fix for prod job](https://github.com/summarizator/fora-frontend/commit/7f4efa61)
  - [use cache for prod job too](https://github.com/summarizator/fora-frontend/commit/8fb0bc20)
  - [perhaps prod changes 3](https://github.com/summarizator/fora-frontend/commit/5a886e4f)
  - [perhaps prod changes 3](https://github.com/summarizator/fora-frontend/commit/2d166700)
  - [commit 2](https://github.com/summarizator/fora-frontend/commit/f2314527)
  - [commit 1](https://github.com/summarizator/fora-frontend/commit/2c82ec3e)
  - [aaaaanotherz](https://github.com/summarizator/fora-frontend/commit/a612e1e5)
  - [chore: release 0.5.39](https://github.com/summarizator/fora-frontend/commit/6c21fbb5)
  - [chore: release 0.5.36](https://github.com/summarizator/fora-frontend/commit/c46d914f)
  - [](https://github.com/summarizator/fora-frontend/commit/)
  - [](https://github.com/summarizator/fora-frontend/commit/)
  - [](https://github.com/summarizator/fora-frontend/commit/)
  - [chore: release 0.5.27](https://github.com/summarizator/fora-frontend/commit/5879296f)
  - [logz](https://github.com/summarizator/fora-frontend/commit/780e7fa6)
  - [logz](https://github.com/summarizator/fora-frontend/commit/625aee98)
  - [chore: release 0.5.26](https://github.com/summarizator/fora-frontend/commit/0a936731)
  - [chore: release 0.5.25](https://github.com/summarizator/fora-frontend/commit/3f677031)
  - [chore: release 0.5.24](https://github.com/summarizator/fora-frontend/commit/3aa63c2c)
  - [chore: release 0.5.23](https://github.com/summarizator/fora-frontend/commit/e31e8d5f)
  - [chore: release 0.5.18](https://github.com/summarizator/fora-frontend/commit/56f9d7ec)
  - [chore: release 0.5.17](https://github.com/summarizator/fora-frontend/commit/2bec2ac9)
  - [chore: release 0.5.16](https://github.com/summarizator/fora-frontend/commit/1ce7c9e9)
  - [cool new readme](https://github.com/summarizator/fora-frontend/commit/bba4c6ed)

  </details>

- [FORA-878](https://foraday.atlassian.net/browse/FORA-878): Allow category change on recent page
  <details>
    <summary>Commits</summary>

  - [](https://github.com/summarizator/fora-frontend/commit/)

  </details>

- [FORA-1085](https://foraday.atlassian.net/browse/FORA-1085): Create Summary modal
  <details>
    <summary>Commits</summary>

  - [](https://github.com/summarizator/fora-frontend/commit/)

  </details>

- [FORA-1066](https://foraday.atlassian.net/browse/FORA-1066): SPIKE - Okta Integration
  <details>
    <summary>Commits</summary>

  - [](https://github.com/summarizator/fora-frontend/commit/)

  </details>

- [FORA-840](https://foraday.atlassian.net/browse/FORA-840): Integrate Release-It to FE Repo
  <details>
    <summary>Commits</summary>

  - [chore: release 0.5.14](https://github.com/summarizator/fora-frontend/commit/88fee98e)
  - [chore: release 0.5.13](https://github.com/summarizator/fora-frontend/commit/f11b546c)
  - [chore: release 0.5.12](https://github.com/summarizator/fora-frontend/commit/9dc77c8a)
  - [chore: release 0.5.11](https://github.com/summarizator/fora-frontend/commit/10c35a54)
  - [chore: release 0.5.10](https://github.com/summarizator/fora-frontend/commit/8ee45320)
  - [chore: release 0.5.9](https://github.com/summarizator/fora-frontend/commit/b2ae433b)
  - [chore: release 0.5.8](https://github.com/summarizator/fora-frontend/commit/ceed34d9)
  - [chore: release 0.5.7](https://github.com/summarizator/fora-frontend/commit/53d84d35)
  - [chore: release 0.5.6](https://github.com/summarizator/fora-frontend/commit/0d250ed2)
  - [chore: release 0.5.5](https://github.com/summarizator/fora-frontend/commit/bf541008)
  - [chore: release 0.5.4](https://github.com/summarizator/fora-frontend/commit/9c37c293)
  - [chore: release 0.5.3](https://github.com/summarizator/fora-frontend/commit/f7d4bfe8)
  - [chore: release 0.5.2](https://github.com/summarizator/fora-frontend/commit/bf4a84db)
  - [chore: release 0.5.1](https://github.com/summarizator/fora-frontend/commit/aadf74d3)
  - [chore: release 0.5.2](https://github.com/summarizator/fora-frontend/commit/6b514330)
  - [chore: release 0.6.11](https://github.com/summarizator/fora-frontend/commit/ece60a67)
  - [chore: release 0.6.10](https://github.com/summarizator/fora-frontend/commit/2de1bedb)
  - [chore: release 0.6.9](https://github.com/summarizator/fora-frontend/commit/53b8f5ca)
  - [chore: release 0.6.8](https://github.com/summarizator/fora-frontend/commit/7798ad1d)
  - [chore: release 0.6.7](https://github.com/summarizator/fora-frontend/commit/f886470d)
  - [chore: release 0.6.6](https://github.com/summarizator/fora-frontend/commit/330eb03c)
  - [chore: release 0.6.5](https://github.com/summarizator/fora-frontend/commit/6787b64c)
  - [chore: release 0.6.4](https://github.com/summarizator/fora-frontend/commit/5a0fa3e6)
  - [chore: release 0.6.3](https://github.com/summarizator/fora-frontend/commit/6f8abded)
  - [Merge branch 'dev' into FORA-840](https://github.com/summarizator/fora-frontend/commit/c6bb1a7a)
  - [chore: release 0.6.1](https://github.com/summarizator/fora-frontend/commit/a9f1d7e6)
  - [chore: release 0.6.0](https://github.com/summarizator/fora-frontend/commit/6d5b7351)
  - [Merge branch 'dev' of github.com:summarizator/fora-frontend into FORA-840](https://github.com/summarizator/fora-frontend/commit/06ad38b4)
  - [try to kill all warnings](https://github.com/summarizator/fora-frontend/commit/7b1f20bb)
  - [add linting to pre-push](https://github.com/summarizator/fora-frontend/commit/0763edf0)
  - [add linting to pre-push](https://github.com/summarizator/fora-frontend/commit/963ff2f0)
  - [fix lint](https://github.com/summarizator/fora-frontend/commit/a8d262df)
  - [test](https://github.com/summarizator/fora-frontend/commit/e3f4e99b)
  - [clean](https://github.com/summarizator/fora-frontend/commit/fcedb650)
  - [fixes](https://github.com/summarizator/fora-frontend/commit/9d05113a)
  - [chore: release 0.5.15](https://github.com/summarizator/fora-frontend/commit/989f6fa9)
  - [chore: release 0.5.14](https://github.com/summarizator/fora-frontend/commit/42ad3861)
  - [Merge branch 'dev' into FORA-840](https://github.com/summarizator/fora-frontend/commit/df1530e1)
  - [chore: release 0.5.13](https://github.com/summarizator/fora-frontend/commit/10932202)
  - [chore: release 0.5.12](https://github.com/summarizator/fora-frontend/commit/92dcd324)
  - [fixes](https://github.com/summarizator/fora-frontend/commit/b27af8e0)
  - [build stuff](https://github.com/summarizator/fora-frontend/commit/3c72984b)
  - [think its working](https://github.com/summarizator/fora-frontend/commit/85c70b83)
  - [think its working](https://github.com/summarizator/fora-frontend/commit/3bbd19d3)
  - [Merge branch 'dev' into FORA-840](https://github.com/summarizator/fora-frontend/commit/601022d4)
  - [think its working](https://github.com/summarizator/fora-frontend/commit/70f85e94)
  - [chore: release 0.5.11](https://github.com/summarizator/fora-frontend/commit/f231b109)
  - [chore: release 0.5.10](https://github.com/summarizator/fora-frontend/commit/2b3663f4)
  - [chore: release 0.5.9](https://github.com/summarizator/fora-frontend/commit/b2cc8d94)
  - [chore: release 0.5.8](https://github.com/summarizator/fora-frontend/commit/dbb82f0d)
  - [chore: release 0.5.7](https://github.com/summarizator/fora-frontend/commit/a7712fb6)
  - [chore: release 0.5.6](https://github.com/summarizator/fora-frontend/commit/c6b905b6)
  - [untested prod function](https://github.com/summarizator/fora-frontend/commit/254f8fe4)
  - [chore: release 0.5.5](https://github.com/summarizator/fora-frontend/commit/c61eed54)
  - [start concept of dev and prod releases](https://github.com/summarizator/fora-frontend/commit/e288b500)
  - [chore: release 0.5.4](https://github.com/summarizator/fora-frontend/commit/bb2a5ef1)
  - [chore: release 0.5.3](https://github.com/summarizator/fora-frontend/commit/3c1e584e)
  - [chore: release 0.5.2](https://github.com/summarizator/fora-frontend/commit/b79edc4b)
  - [chore: release 0.5.1](https://github.com/summarizator/fora-frontend/commit/8a7be26f)
  - [rm commit message hook](https://github.com/summarizator/fora-frontend/commit/59e2d658)
  - [fix: json writing](https://github.com/summarizator/fora-frontend/commit/eab3c626)
  - [chore: release 0.15.28](https://github.com/summarizator/fora-frontend/commit/200f276c)
  - [chore: release 0.15.27](https://github.com/summarizator/fora-frontend/commit/8c35ce2c)
  - [chore: release 0.15.25](https://github.com/summarizator/fora-frontend/commit/41d91fe7)
  - [chore: release 0.15.24](https://github.com/summarizator/fora-frontend/commit/f8b43f75)
  - [chore: release 0.15.23](https://github.com/summarizator/fora-frontend/commit/2d8850c7)
  - [chore: release 0.15.22](https://github.com/summarizator/fora-frontend/commit/c0970bcc)
  - [chore: release 0.15.21](https://github.com/summarizator/fora-frontend/commit/29d219d0)
  - [chore: release 0.15.20](https://github.com/summarizator/fora-frontend/commit/da361273)
  - [fix: json writing](https://github.com/summarizator/fora-frontend/commit/16c1a997)
  - [chore: release 0.15.19](https://github.com/summarizator/fora-frontend/commit/c06bd710)
  - [chore: release 0.15.18](https://github.com/summarizator/fora-frontend/commit/e8729ef2)
  - [chore: release 0.15.17](https://github.com/summarizator/fora-frontend/commit/9c5889e0)
  - [chore: release 0.15.16](https://github.com/summarizator/fora-frontend/commit/74b14f5b)
  - [chore: release 0.15.15](https://github.com/summarizator/fora-frontend/commit/cfb51171)
  - [chore: release 0.15.14](https://github.com/summarizator/fora-frontend/commit/05185594)
  - [chore: release 0.15.13](https://github.com/summarizator/fora-frontend/commit/b104e115)
  - [chore: release 0.15.12](https://github.com/summarizator/fora-frontend/commit/632914ae)
  - [chore: release 0.15.11](https://github.com/summarizator/fora-frontend/commit/2c5ba71e)
  - [fix: looks like i want it to](https://github.com/summarizator/fora-frontend/commit/ac551328)
  - [chore: release 0.15.9](https://github.com/summarizator/fora-frontend/commit/b4e4b927)
  - [chore: release 0.15.8](https://github.com/summarizator/fora-frontend/commit/8ea004e1)
  - [chore: release 0.15.7](https://github.com/summarizator/fora-frontend/commit/25eea181)
  - [chore: release 0.15.6](https://github.com/summarizator/fora-frontend/commit/c4d8839e)
  - [chore: release 0.15.5](https://github.com/summarizator/fora-frontend/commit/724d618e)
  - [chore: release 0.15.4](https://github.com/summarizator/fora-frontend/commit/fb3ed7e2)
  - [chore: release 0.15.3](https://github.com/summarizator/fora-frontend/commit/de1a6c17)
  - [fix: some more edits](https://github.com/summarizator/fora-frontend/commit/828b63f9)
  - [chore: release 0.15.0](https://github.com/summarizator/fora-frontend/commit/8d1f5e03)
  - [fix: some more edits](https://github.com/summarizator/fora-frontend/commit/421858f9)
  - [fix: some more edits](https://github.com/summarizator/fora-frontend/commit/9a7a0e95)
  - [fix: got it](https://github.com/summarizator/fora-frontend/commit/1251fdb4)
  - [chore: release 0.14.0](https://github.com/summarizator/fora-frontend/commit/de185c95)
  - [chore: release 0.13.0](https://github.com/summarizator/fora-frontend/commit/ed9cf8fd)
  - [chore: release 0.12.0](https://github.com/summarizator/fora-frontend/commit/1b1d868d)
  - [chore: release 0.11.0](https://github.com/summarizator/fora-frontend/commit/0ad82baa)
  - [chore: release 0.10.0](https://github.com/summarizator/fora-frontend/commit/b6e2da3f)
  - [chore: release 0.9.0](https://github.com/summarizator/fora-frontend/commit/37594ba8)
  - [chore: release 0.8.0](https://github.com/summarizator/fora-frontend/commit/60a50f28)
  - [chore: release 0.7.0](https://github.com/summarizator/fora-frontend/commit/dd08fbab)
  - [chore: release 0.6.0](https://github.com/summarizator/fora-frontend/commit/037a9275)
  - [fix: some more readme formatting for dates](https://github.com/summarizator/fora-frontend/commit/f3ea4051)
  - [fix: some more readme formatting](https://github.com/summarizator/fora-frontend/commit/27b0c0be)
  - [fix: maybe fix release flow](https://github.com/summarizator/fora-frontend/commit/8f8fa992)
  - [chore: maybe move pre-push check](https://github.com/summarizator/fora-frontend/commit/396b69c2)
  - [fix: maybe fix branch naming](https://github.com/summarizator/fora-frontend/commit/2ebf827e)
  - [feat: test feature here](https://github.com/summarizator/fora-frontend/commit/9f4ba6ff)
  - [fix: husky hook](https://github.com/summarizator/fora-frontend/commit/09b68c85)
  - [test husky](https://github.com/summarizator/fora-frontend/commit/017494c1)
  - [test husky](https://github.com/summarizator/fora-frontend/commit/2dbd3a41)
  - [chore: release 0.5.3](https://github.com/summarizator/fora-frontend/commit/39be00fb)
  - [chore: release 0.5.2](https://github.com/summarizator/fora-frontend/commit/1b46922f)
  - [start of releaseit](https://github.com/summarizator/fora-frontend/commit/ac2c95bf)
  - [chore: release v0.5.1](https://github.com/summarizator/fora-frontend/commit/ffeb29d4)
  - [build info plugin](https://github.com/summarizator/fora-frontend/commit/7c82d728)

  </details>

### Bug Fixes

- [FORA-1117](https://foraday.atlassian.net/browse/FORA-1117): broken guest user flow
  <details>
    <summary>Commits</summary>

  - [chore: release 0.5.37](https://github.com/summarizator/fora-frontend/commit/8c83d46c)

  </details>

- [FORA-1115](https://foraday.atlassian.net/browse/FORA-1115): Add padding on meeting detail page
  <details>
    <summary>Commits</summary>

  - [](https://github.com/summarizator/fora-frontend/commit/)

  </details>

- [FORA-1114](https://foraday.atlassian.net/browse/FORA-1114): remove duplicate fora lenses
  <details>
    <summary>Commits</summary>

  - [](https://github.com/summarizator/fora-frontend/commit/)

  </details>

## [0.5.65](https://github.com/summarizator/fora-frontend/compare/v0.5.64...v0.5.65) <span style="color: red;">[prod]</span>

> Thu, Jan 23 2025 | 09:41 PM EST

### Features

- [FORA-1077](https://foraday.atlassian.net/browse/FORA-1077): FE: Integrate Release-It to github actions flow
  <details>
    <summary>Commits</summary>

  - [maybe finally](https://github.com/summarizator/fora-frontend/commit/f951eb46)
  - [chore: release 0.5.61](https://github.com/summarizator/fora-frontend/commit/34a27f86)
  - [chore: release 0.5.60](https://github.com/summarizator/fora-frontend/commit/205cf6bb)
  - [chore: release 0.5.59](https://github.com/summarizator/fora-frontend/commit/b8ce3830)
  - [chore: release 0.5.58](https://github.com/summarizator/fora-frontend/commit/7196a14f)
  - [chore: release 0.5.57](https://github.com/summarizator/fora-frontend/commit/5e6f6c3e)
  - [chore: release 0.5.56](https://github.com/summarizator/fora-frontend/commit/2641b805)
  - [chore: release 0.5.55](https://github.com/summarizator/fora-frontend/commit/90dea734)
  - [chore: release 0.5.54](https://github.com/summarizator/fora-frontend/commit/c8bd5549)
  - [chore: release 0.5.53](https://github.com/summarizator/fora-frontend/commit/8702254c)
  - [chore: release 0.5.52](https://github.com/summarizator/fora-frontend/commit/7b035fed)
  - [chore: release 0.5.51](https://github.com/summarizator/fora-frontend/commit/ae71451f)
  - [chore: release 0.5.50](https://github.com/summarizator/fora-frontend/commit/58f8c159)
  - [ugh](https://github.com/summarizator/fora-frontend/commit/8505a73a)
  - [chore: update changelog for production release v0.5.49](https://github.com/summarizator/fora-frontend/commit/df6ee29c)
  - [chore: release 0.5.49](https://github.com/summarizator/fora-frontend/commit/c41529fb)
  - [Merge pull request #1163 from summarizator/dev](https://github.com/summarizator/fora-frontend/commit/289df588)
  - [zzzz222](https://github.com/summarizator/fora-frontend/commit/6e2ae365)
  - [zzzz](https://github.com/summarizator/fora-frontend/commit/951ca70a)
  - [chore: update changelog for production release v0.5.47](https://github.com/summarizator/fora-frontend/commit/94dafc05)
  - [chore: release 0.5.47](https://github.com/summarizator/fora-frontend/commit/183339bc)
  - [Merge pull request #1161 from summarizator/dev](https://github.com/summarizator/fora-frontend/commit/69cfcf27)
  - [maybe fix for prod job](https://github.com/summarizator/fora-frontend/commit/8a11074e)
  - [maybe fix for prod job](https://github.com/summarizator/fora-frontend/commit/7464a06c)
  - [chore: update changelog for production release v0.5.45](https://github.com/summarizator/fora-frontend/commit/d263b855)
  - [chore: release 0.5.45](https://github.com/summarizator/fora-frontend/commit/59639faa)
  - [Merge pull request #1159 from summarizator/dev](https://github.com/summarizator/fora-frontend/commit/af095ba7)
  - [Merge pull request #1157 from summarizator/dev](https://github.com/summarizator/fora-frontend/commit/a1b746a8)
  - [Merge pull request #1148 from summarizator/dev](https://github.com/summarizator/fora-frontend/commit/114e049b)
  - [maybe fix for prod job](https://github.com/summarizator/fora-frontend/commit/7f4efa61)
  - [use cache for prod job too](https://github.com/summarizator/fora-frontend/commit/8fb0bc20)
  - [perhaps prod changes 3](https://github.com/summarizator/fora-frontend/commit/5a886e4f)
  - [perhaps prod changes 3](https://github.com/summarizator/fora-frontend/commit/2d166700)
  - [commit 2](https://github.com/summarizator/fora-frontend/commit/f2314527)
  - [commit 1](https://github.com/summarizator/fora-frontend/commit/2c82ec3e)
  - [aaaaanotherz](https://github.com/summarizator/fora-frontend/commit/a612e1e5)
  - [chore: release 0.5.39](https://github.com/summarizator/fora-frontend/commit/6c21fbb5)
  - [chore: release 0.5.36](https://github.com/summarizator/fora-frontend/commit/c46d914f)
  - [](https://github.com/summarizator/fora-frontend/commit/)
  - [](https://github.com/summarizator/fora-frontend/commit/)
  - [](https://github.com/summarizator/fora-frontend/commit/)
  - [chore: release 0.5.27](https://github.com/summarizator/fora-frontend/commit/5879296f)
  - [logz](https://github.com/summarizator/fora-frontend/commit/780e7fa6)
  - [logz](https://github.com/summarizator/fora-frontend/commit/625aee98)
  - [chore: release 0.5.26](https://github.com/summarizator/fora-frontend/commit/0a936731)
  - [chore: release 0.5.25](https://github.com/summarizator/fora-frontend/commit/3f677031)
  - [chore: release 0.5.24](https://github.com/summarizator/fora-frontend/commit/3aa63c2c)
  - [chore: release 0.5.23](https://github.com/summarizator/fora-frontend/commit/e31e8d5f)
  - [chore: release 0.5.18](https://github.com/summarizator/fora-frontend/commit/56f9d7ec)
  - [chore: release 0.5.17](https://github.com/summarizator/fora-frontend/commit/2bec2ac9)
  - [chore: release 0.5.16](https://github.com/summarizator/fora-frontend/commit/1ce7c9e9)
  - [cool new readme](https://github.com/summarizator/fora-frontend/commit/bba4c6ed)

  </details>

- [FORA-878](https://foraday.atlassian.net/browse/FORA-878): Allow category change on recent page
  <details>
    <summary>Commits</summary>

  - [](https://github.com/summarizator/fora-frontend/commit/)

  </details>

- [FORA-1085](https://foraday.atlassian.net/browse/FORA-1085): Create Summary modal
  <details>
    <summary>Commits</summary>

  - [](https://github.com/summarizator/fora-frontend/commit/)

  </details>

- [FORA-1066](https://foraday.atlassian.net/browse/FORA-1066): SPIKE - Okta Integration
  <details>
    <summary>Commits</summary>

  - [](https://github.com/summarizator/fora-frontend/commit/)

  </details>

- [FORA-840](https://foraday.atlassian.net/browse/FORA-840): Integrate Release-It to FE Repo
  <details>
    <summary>Commits</summary>

  - [chore: release 0.5.14](https://github.com/summarizator/fora-frontend/commit/88fee98e)
  - [chore: release 0.5.13](https://github.com/summarizator/fora-frontend/commit/f11b546c)
  - [chore: release 0.5.12](https://github.com/summarizator/fora-frontend/commit/9dc77c8a)
  - [chore: release 0.5.11](https://github.com/summarizator/fora-frontend/commit/10c35a54)
  - [chore: release 0.5.10](https://github.com/summarizator/fora-frontend/commit/8ee45320)
  - [chore: release 0.5.9](https://github.com/summarizator/fora-frontend/commit/b2ae433b)
  - [chore: release 0.5.8](https://github.com/summarizator/fora-frontend/commit/ceed34d9)
  - [chore: release 0.5.7](https://github.com/summarizator/fora-frontend/commit/53d84d35)
  - [chore: release 0.5.6](https://github.com/summarizator/fora-frontend/commit/0d250ed2)
  - [chore: release 0.5.5](https://github.com/summarizator/fora-frontend/commit/bf541008)
  - [chore: release 0.5.4](https://github.com/summarizator/fora-frontend/commit/9c37c293)
  - [chore: release 0.5.3](https://github.com/summarizator/fora-frontend/commit/f7d4bfe8)
  - [chore: release 0.5.2](https://github.com/summarizator/fora-frontend/commit/bf4a84db)
  - [chore: release 0.5.1](https://github.com/summarizator/fora-frontend/commit/aadf74d3)
  - [chore: release 0.5.2](https://github.com/summarizator/fora-frontend/commit/6b514330)
  - [chore: release 0.6.11](https://github.com/summarizator/fora-frontend/commit/ece60a67)
  - [chore: release 0.6.10](https://github.com/summarizator/fora-frontend/commit/2de1bedb)
  - [chore: release 0.6.9](https://github.com/summarizator/fora-frontend/commit/53b8f5ca)
  - [chore: release 0.6.8](https://github.com/summarizator/fora-frontend/commit/7798ad1d)
  - [chore: release 0.6.7](https://github.com/summarizator/fora-frontend/commit/f886470d)
  - [chore: release 0.6.6](https://github.com/summarizator/fora-frontend/commit/330eb03c)
  - [chore: release 0.6.5](https://github.com/summarizator/fora-frontend/commit/6787b64c)
  - [chore: release 0.6.4](https://github.com/summarizator/fora-frontend/commit/5a0fa3e6)
  - [chore: release 0.6.3](https://github.com/summarizator/fora-frontend/commit/6f8abded)
  - [Merge branch 'dev' into FORA-840](https://github.com/summarizator/fora-frontend/commit/c6bb1a7a)
  - [chore: release 0.6.1](https://github.com/summarizator/fora-frontend/commit/a9f1d7e6)
  - [chore: release 0.6.0](https://github.com/summarizator/fora-frontend/commit/6d5b7351)
  - [Merge branch 'dev' of github.com:summarizator/fora-frontend into FORA-840](https://github.com/summarizator/fora-frontend/commit/06ad38b4)
  - [try to kill all warnings](https://github.com/summarizator/fora-frontend/commit/7b1f20bb)
  - [add linting to pre-push](https://github.com/summarizator/fora-frontend/commit/0763edf0)
  - [add linting to pre-push](https://github.com/summarizator/fora-frontend/commit/963ff2f0)
  - [fix lint](https://github.com/summarizator/fora-frontend/commit/a8d262df)
  - [test](https://github.com/summarizator/fora-frontend/commit/e3f4e99b)
  - [clean](https://github.com/summarizator/fora-frontend/commit/fcedb650)
  - [fixes](https://github.com/summarizator/fora-frontend/commit/9d05113a)
  - [chore: release 0.5.15](https://github.com/summarizator/fora-frontend/commit/989f6fa9)
  - [chore: release 0.5.14](https://github.com/summarizator/fora-frontend/commit/42ad3861)
  - [Merge branch 'dev' into FORA-840](https://github.com/summarizator/fora-frontend/commit/df1530e1)
  - [chore: release 0.5.13](https://github.com/summarizator/fora-frontend/commit/10932202)
  - [chore: release 0.5.12](https://github.com/summarizator/fora-frontend/commit/92dcd324)
  - [fixes](https://github.com/summarizator/fora-frontend/commit/b27af8e0)
  - [build stuff](https://github.com/summarizator/fora-frontend/commit/3c72984b)
  - [think its working](https://github.com/summarizator/fora-frontend/commit/85c70b83)
  - [think its working](https://github.com/summarizator/fora-frontend/commit/3bbd19d3)
  - [Merge branch 'dev' into FORA-840](https://github.com/summarizator/fora-frontend/commit/601022d4)
  - [think its working](https://github.com/summarizator/fora-frontend/commit/70f85e94)
  - [chore: release 0.5.11](https://github.com/summarizator/fora-frontend/commit/f231b109)
  - [chore: release 0.5.10](https://github.com/summarizator/fora-frontend/commit/2b3663f4)
  - [chore: release 0.5.9](https://github.com/summarizator/fora-frontend/commit/b2cc8d94)
  - [chore: release 0.5.8](https://github.com/summarizator/fora-frontend/commit/dbb82f0d)
  - [chore: release 0.5.7](https://github.com/summarizator/fora-frontend/commit/a7712fb6)
  - [chore: release 0.5.6](https://github.com/summarizator/fora-frontend/commit/c6b905b6)
  - [untested prod function](https://github.com/summarizator/fora-frontend/commit/254f8fe4)
  - [chore: release 0.5.5](https://github.com/summarizator/fora-frontend/commit/c61eed54)
  - [start concept of dev and prod releases](https://github.com/summarizator/fora-frontend/commit/e288b500)
  - [chore: release 0.5.4](https://github.com/summarizator/fora-frontend/commit/bb2a5ef1)
  - [chore: release 0.5.3](https://github.com/summarizator/fora-frontend/commit/3c1e584e)
  - [chore: release 0.5.2](https://github.com/summarizator/fora-frontend/commit/b79edc4b)
  - [chore: release 0.5.1](https://github.com/summarizator/fora-frontend/commit/8a7be26f)
  - [rm commit message hook](https://github.com/summarizator/fora-frontend/commit/59e2d658)
  - [fix: json writing](https://github.com/summarizator/fora-frontend/commit/eab3c626)
  - [chore: release 0.15.28](https://github.com/summarizator/fora-frontend/commit/200f276c)
  - [chore: release 0.15.27](https://github.com/summarizator/fora-frontend/commit/8c35ce2c)
  - [chore: release 0.15.25](https://github.com/summarizator/fora-frontend/commit/41d91fe7)
  - [chore: release 0.15.24](https://github.com/summarizator/fora-frontend/commit/f8b43f75)
  - [chore: release 0.15.23](https://github.com/summarizator/fora-frontend/commit/2d8850c7)
  - [chore: release 0.15.22](https://github.com/summarizator/fora-frontend/commit/c0970bcc)
  - [chore: release 0.15.21](https://github.com/summarizator/fora-frontend/commit/29d219d0)
  - [chore: release 0.15.20](https://github.com/summarizator/fora-frontend/commit/da361273)
  - [fix: json writing](https://github.com/summarizator/fora-frontend/commit/16c1a997)
  - [chore: release 0.15.19](https://github.com/summarizator/fora-frontend/commit/c06bd710)
  - [chore: release 0.15.18](https://github.com/summarizator/fora-frontend/commit/e8729ef2)
  - [chore: release 0.15.17](https://github.com/summarizator/fora-frontend/commit/9c5889e0)
  - [chore: release 0.15.16](https://github.com/summarizator/fora-frontend/commit/74b14f5b)
  - [chore: release 0.15.15](https://github.com/summarizator/fora-frontend/commit/cfb51171)
  - [chore: release 0.15.14](https://github.com/summarizator/fora-frontend/commit/05185594)
  - [chore: release 0.15.13](https://github.com/summarizator/fora-frontend/commit/b104e115)
  - [chore: release 0.15.12](https://github.com/summarizator/fora-frontend/commit/632914ae)
  - [chore: release 0.15.11](https://github.com/summarizator/fora-frontend/commit/2c5ba71e)
  - [fix: looks like i want it to](https://github.com/summarizator/fora-frontend/commit/ac551328)
  - [chore: release 0.15.9](https://github.com/summarizator/fora-frontend/commit/b4e4b927)
  - [chore: release 0.15.8](https://github.com/summarizator/fora-frontend/commit/8ea004e1)
  - [chore: release 0.15.7](https://github.com/summarizator/fora-frontend/commit/25eea181)
  - [chore: release 0.15.6](https://github.com/summarizator/fora-frontend/commit/c4d8839e)
  - [chore: release 0.15.5](https://github.com/summarizator/fora-frontend/commit/724d618e)
  - [chore: release 0.15.4](https://github.com/summarizator/fora-frontend/commit/fb3ed7e2)
  - [chore: release 0.15.3](https://github.com/summarizator/fora-frontend/commit/de1a6c17)
  - [fix: some more edits](https://github.com/summarizator/fora-frontend/commit/828b63f9)
  - [chore: release 0.15.0](https://github.com/summarizator/fora-frontend/commit/8d1f5e03)
  - [fix: some more edits](https://github.com/summarizator/fora-frontend/commit/421858f9)
  - [fix: some more edits](https://github.com/summarizator/fora-frontend/commit/9a7a0e95)
  - [fix: got it](https://github.com/summarizator/fora-frontend/commit/1251fdb4)
  - [chore: release 0.14.0](https://github.com/summarizator/fora-frontend/commit/de185c95)
  - [chore: release 0.13.0](https://github.com/summarizator/fora-frontend/commit/ed9cf8fd)
  - [chore: release 0.12.0](https://github.com/summarizator/fora-frontend/commit/1b1d868d)
  - [chore: release 0.11.0](https://github.com/summarizator/fora-frontend/commit/0ad82baa)
  - [chore: release 0.10.0](https://github.com/summarizator/fora-frontend/commit/b6e2da3f)
  - [chore: release 0.9.0](https://github.com/summarizator/fora-frontend/commit/37594ba8)
  - [chore: release 0.8.0](https://github.com/summarizator/fora-frontend/commit/60a50f28)
  - [chore: release 0.7.0](https://github.com/summarizator/fora-frontend/commit/dd08fbab)
  - [chore: release 0.6.0](https://github.com/summarizator/fora-frontend/commit/037a9275)
  - [fix: some more readme formatting for dates](https://github.com/summarizator/fora-frontend/commit/f3ea4051)
  - [fix: some more readme formatting](https://github.com/summarizator/fora-frontend/commit/27b0c0be)
  - [fix: maybe fix release flow](https://github.com/summarizator/fora-frontend/commit/8f8fa992)
  - [chore: maybe move pre-push check](https://github.com/summarizator/fora-frontend/commit/396b69c2)
  - [fix: maybe fix branch naming](https://github.com/summarizator/fora-frontend/commit/2ebf827e)
  - [feat: test feature here](https://github.com/summarizator/fora-frontend/commit/9f4ba6ff)
  - [fix: husky hook](https://github.com/summarizator/fora-frontend/commit/09b68c85)
  - [test husky](https://github.com/summarizator/fora-frontend/commit/017494c1)
  - [test husky](https://github.com/summarizator/fora-frontend/commit/2dbd3a41)
  - [chore: release 0.5.3](https://github.com/summarizator/fora-frontend/commit/39be00fb)
  - [chore: release 0.5.2](https://github.com/summarizator/fora-frontend/commit/1b46922f)
  - [start of releaseit](https://github.com/summarizator/fora-frontend/commit/ac2c95bf)
  - [chore: release v0.5.1](https://github.com/summarizator/fora-frontend/commit/ffeb29d4)
  - [build info plugin](https://github.com/summarizator/fora-frontend/commit/7c82d728)

  </details>

### Bug Fixes

- [FORA-1117](https://foraday.atlassian.net/browse/FORA-1117): broken guest user flow
  <details>
    <summary>Commits</summary>

  - [chore: release 0.5.37](https://github.com/summarizator/fora-frontend/commit/8c83d46c)

  </details>

- [FORA-1115](https://foraday.atlassian.net/browse/FORA-1115): Add padding on meeting detail page
  <details>
    <summary>Commits</summary>

  - [](https://github.com/summarizator/fora-frontend/commit/)

  </details>

- [FORA-1114](https://foraday.atlassian.net/browse/FORA-1114): remove duplicate fora lenses
  <details>
    <summary>Commits</summary>

  - [](https://github.com/summarizator/fora-frontend/commit/)

  </details>

## [0.5.64](https://github.com/summarizator/fora-frontend/compare/v0.5.63...v0.5.64) <span style="color: red;">[prod]</span>

> Fri, Jan 24 2025 | 09:40 PM EST

### Features

- [FORA-1077](https://foraday.atlassian.net/browse/FORA-1077): FE: Integrate Release-It to github actions flow
  <details>
    <summary>Commits</summary>

  - [maybe finally](https://github.com/summarizator/fora-frontend/commit/f951eb46)
  - [chore: release 0.5.61](https://github.com/summarizator/fora-frontend/commit/34a27f86)
  - [chore: release 0.5.60](https://github.com/summarizator/fora-frontend/commit/205cf6bb)
  - [chore: release 0.5.59](https://github.com/summarizator/fora-frontend/commit/b8ce3830)
  - [chore: release 0.5.58](https://github.com/summarizator/fora-frontend/commit/7196a14f)
  - [chore: release 0.5.57](https://github.com/summarizator/fora-frontend/commit/5e6f6c3e)
  - [chore: release 0.5.56](https://github.com/summarizator/fora-frontend/commit/2641b805)
  - [chore: release 0.5.55](https://github.com/summarizator/fora-frontend/commit/90dea734)
  - [chore: release 0.5.54](https://github.com/summarizator/fora-frontend/commit/c8bd5549)
  - [chore: release 0.5.53](https://github.com/summarizator/fora-frontend/commit/8702254c)
  - [chore: release 0.5.52](https://github.com/summarizator/fora-frontend/commit/7b035fed)
  - [chore: release 0.5.51](https://github.com/summarizator/fora-frontend/commit/ae71451f)
  - [chore: release 0.5.50](https://github.com/summarizator/fora-frontend/commit/58f8c159)
  - [ugh](https://github.com/summarizator/fora-frontend/commit/8505a73a)
  - [chore: update changelog for production release v0.5.49](https://github.com/summarizator/fora-frontend/commit/df6ee29c)
  - [chore: release 0.5.49](https://github.com/summarizator/fora-frontend/commit/c41529fb)
  - [Merge pull request #1163 from summarizator/dev](https://github.com/summarizator/fora-frontend/commit/289df588)
  - [zzzz222](https://github.com/summarizator/fora-frontend/commit/6e2ae365)
  - [zzzz](https://github.com/summarizator/fora-frontend/commit/951ca70a)
  - [chore: update changelog for production release v0.5.47](https://github.com/summarizator/fora-frontend/commit/94dafc05)
  - [chore: release 0.5.47](https://github.com/summarizator/fora-frontend/commit/183339bc)
  - [Merge pull request #1161 from summarizator/dev](https://github.com/summarizator/fora-frontend/commit/69cfcf27)
  - [maybe fix for prod job](https://github.com/summarizator/fora-frontend/commit/8a11074e)
  - [maybe fix for prod job](https://github.com/summarizator/fora-frontend/commit/7464a06c)
  - [chore: update changelog for production release v0.5.45](https://github.com/summarizator/fora-frontend/commit/d263b855)
  - [chore: release 0.5.45](https://github.com/summarizator/fora-frontend/commit/59639faa)
  - [Merge pull request #1159 from summarizator/dev](https://github.com/summarizator/fora-frontend/commit/af095ba7)
  - [Merge pull request #1157 from summarizator/dev](https://github.com/summarizator/fora-frontend/commit/a1b746a8)
  - [Merge pull request #1148 from summarizator/dev](https://github.com/summarizator/fora-frontend/commit/114e049b)
  - [maybe fix for prod job](https://github.com/summarizator/fora-frontend/commit/7f4efa61)
  - [use cache for prod job too](https://github.com/summarizator/fora-frontend/commit/8fb0bc20)
  - [perhaps prod changes 3](https://github.com/summarizator/fora-frontend/commit/5a886e4f)
  - [perhaps prod changes 3](https://github.com/summarizator/fora-frontend/commit/2d166700)
  - [commit 2](https://github.com/summarizator/fora-frontend/commit/f2314527)
  - [commit 1](https://github.com/summarizator/fora-frontend/commit/2c82ec3e)
  - [aaaaanotherz](https://github.com/summarizator/fora-frontend/commit/a612e1e5)
  - [chore: release 0.5.39](https://github.com/summarizator/fora-frontend/commit/6c21fbb5)
  - [chore: release 0.5.36](https://github.com/summarizator/fora-frontend/commit/c46d914f)
  - [](https://github.com/summarizator/fora-frontend/commit/)
  - [](https://github.com/summarizator/fora-frontend/commit/)
  - [](https://github.com/summarizator/fora-frontend/commit/)
  - [chore: release 0.5.27](https://github.com/summarizator/fora-frontend/commit/5879296f)
  - [logz](https://github.com/summarizator/fora-frontend/commit/780e7fa6)
  - [logz](https://github.com/summarizator/fora-frontend/commit/625aee98)
  - [chore: release 0.5.26](https://github.com/summarizator/fora-frontend/commit/0a936731)
  - [chore: release 0.5.25](https://github.com/summarizator/fora-frontend/commit/3f677031)
  - [chore: release 0.5.24](https://github.com/summarizator/fora-frontend/commit/3aa63c2c)
  - [chore: release 0.5.23](https://github.com/summarizator/fora-frontend/commit/e31e8d5f)
  - [chore: release 0.5.18](https://github.com/summarizator/fora-frontend/commit/56f9d7ec)
  - [chore: release 0.5.17](https://github.com/summarizator/fora-frontend/commit/2bec2ac9)
  - [chore: release 0.5.16](https://github.com/summarizator/fora-frontend/commit/1ce7c9e9)
  - [cool new readme](https://github.com/summarizator/fora-frontend/commit/bba4c6ed)

  </details>

- [FORA-878](https://foraday.atlassian.net/browse/FORA-878): Allow category change on recent page
  <details>
    <summary>Commits</summary>

  - [](https://github.com/summarizator/fora-frontend/commit/)

  </details>

- [FORA-1085](https://foraday.atlassian.net/browse/FORA-1085): Create Summary modal
  <details>
    <summary>Commits</summary>

  - [](https://github.com/summarizator/fora-frontend/commit/)

  </details>

- [FORA-1066](https://foraday.atlassian.net/browse/FORA-1066): SPIKE - Okta Integration
  <details>
    <summary>Commits</summary>

  - [](https://github.com/summarizator/fora-frontend/commit/)

  </details>

- [FORA-840](https://foraday.atlassian.net/browse/FORA-840): Integrate Release-It to FE Repo
  <details>
    <summary>Commits</summary>

  - [chore: release 0.5.14](https://github.com/summarizator/fora-frontend/commit/88fee98e)
  - [chore: release 0.5.13](https://github.com/summarizator/fora-frontend/commit/f11b546c)
  - [chore: release 0.5.12](https://github.com/summarizator/fora-frontend/commit/9dc77c8a)
  - [chore: release 0.5.11](https://github.com/summarizator/fora-frontend/commit/10c35a54)
  - [chore: release 0.5.10](https://github.com/summarizator/fora-frontend/commit/8ee45320)
  - [chore: release 0.5.9](https://github.com/summarizator/fora-frontend/commit/b2ae433b)
  - [chore: release 0.5.8](https://github.com/summarizator/fora-frontend/commit/ceed34d9)
  - [chore: release 0.5.7](https://github.com/summarizator/fora-frontend/commit/53d84d35)
  - [chore: release 0.5.6](https://github.com/summarizator/fora-frontend/commit/0d250ed2)
  - [chore: release 0.5.5](https://github.com/summarizator/fora-frontend/commit/bf541008)
  - [chore: release 0.5.4](https://github.com/summarizator/fora-frontend/commit/9c37c293)
  - [chore: release 0.5.3](https://github.com/summarizator/fora-frontend/commit/f7d4bfe8)
  - [chore: release 0.5.2](https://github.com/summarizator/fora-frontend/commit/bf4a84db)
  - [chore: release 0.5.1](https://github.com/summarizator/fora-frontend/commit/aadf74d3)
  - [chore: release 0.5.2](https://github.com/summarizator/fora-frontend/commit/6b514330)
  - [chore: release 0.6.11](https://github.com/summarizator/fora-frontend/commit/ece60a67)
  - [chore: release 0.6.10](https://github.com/summarizator/fora-frontend/commit/2de1bedb)
  - [chore: release 0.6.9](https://github.com/summarizator/fora-frontend/commit/53b8f5ca)
  - [chore: release 0.6.8](https://github.com/summarizator/fora-frontend/commit/7798ad1d)
  - [chore: release 0.6.7](https://github.com/summarizator/fora-frontend/commit/f886470d)
  - [chore: release 0.6.6](https://github.com/summarizator/fora-frontend/commit/330eb03c)
  - [chore: release 0.6.5](https://github.com/summarizator/fora-frontend/commit/6787b64c)
  - [chore: release 0.6.4](https://github.com/summarizator/fora-frontend/commit/5a0fa3e6)
  - [chore: release 0.6.3](https://github.com/summarizator/fora-frontend/commit/6f8abded)
  - [Merge branch 'dev' into FORA-840](https://github.com/summarizator/fora-frontend/commit/c6bb1a7a)
  - [chore: release 0.6.1](https://github.com/summarizator/fora-frontend/commit/a9f1d7e6)
  - [chore: release 0.6.0](https://github.com/summarizator/fora-frontend/commit/6d5b7351)
  - [Merge branch 'dev' of github.com:summarizator/fora-frontend into FORA-840](https://github.com/summarizator/fora-frontend/commit/06ad38b4)
  - [try to kill all warnings](https://github.com/summarizator/fora-frontend/commit/7b1f20bb)
  - [add linting to pre-push](https://github.com/summarizator/fora-frontend/commit/0763edf0)
  - [add linting to pre-push](https://github.com/summarizator/fora-frontend/commit/963ff2f0)
  - [fix lint](https://github.com/summarizator/fora-frontend/commit/a8d262df)
  - [test](https://github.com/summarizator/fora-frontend/commit/e3f4e99b)
  - [clean](https://github.com/summarizator/fora-frontend/commit/fcedb650)
  - [fixes](https://github.com/summarizator/fora-frontend/commit/9d05113a)
  - [chore: release 0.5.15](https://github.com/summarizator/fora-frontend/commit/989f6fa9)
  - [chore: release 0.5.14](https://github.com/summarizator/fora-frontend/commit/42ad3861)
  - [Merge branch 'dev' into FORA-840](https://github.com/summarizator/fora-frontend/commit/df1530e1)
  - [chore: release 0.5.13](https://github.com/summarizator/fora-frontend/commit/10932202)
  - [chore: release 0.5.12](https://github.com/summarizator/fora-frontend/commit/92dcd324)
  - [fixes](https://github.com/summarizator/fora-frontend/commit/b27af8e0)
  - [build stuff](https://github.com/summarizator/fora-frontend/commit/3c72984b)
  - [think its working](https://github.com/summarizator/fora-frontend/commit/85c70b83)
  - [think its working](https://github.com/summarizator/fora-frontend/commit/3bbd19d3)
  - [Merge branch 'dev' into FORA-840](https://github.com/summarizator/fora-frontend/commit/601022d4)
  - [think its working](https://github.com/summarizator/fora-frontend/commit/70f85e94)
  - [chore: release 0.5.11](https://github.com/summarizator/fora-frontend/commit/f231b109)
  - [chore: release 0.5.10](https://github.com/summarizator/fora-frontend/commit/2b3663f4)
  - [chore: release 0.5.9](https://github.com/summarizator/fora-frontend/commit/b2cc8d94)
  - [chore: release 0.5.8](https://github.com/summarizator/fora-frontend/commit/dbb82f0d)
  - [chore: release 0.5.7](https://github.com/summarizator/fora-frontend/commit/a7712fb6)
  - [chore: release 0.5.6](https://github.com/summarizator/fora-frontend/commit/c6b905b6)
  - [untested prod function](https://github.com/summarizator/fora-frontend/commit/254f8fe4)
  - [chore: release 0.5.5](https://github.com/summarizator/fora-frontend/commit/c61eed54)
  - [start concept of dev and prod releases](https://github.com/summarizator/fora-frontend/commit/e288b500)
  - [chore: release 0.5.4](https://github.com/summarizator/fora-frontend/commit/bb2a5ef1)
  - [chore: release 0.5.3](https://github.com/summarizator/fora-frontend/commit/3c1e584e)
  - [chore: release 0.5.2](https://github.com/summarizator/fora-frontend/commit/b79edc4b)
  - [chore: release 0.5.1](https://github.com/summarizator/fora-frontend/commit/8a7be26f)
  - [rm commit message hook](https://github.com/summarizator/fora-frontend/commit/59e2d658)
  - [fix: json writing](https://github.com/summarizator/fora-frontend/commit/eab3c626)
  - [chore: release 0.15.28](https://github.com/summarizator/fora-frontend/commit/200f276c)
  - [chore: release 0.15.27](https://github.com/summarizator/fora-frontend/commit/8c35ce2c)
  - [chore: release 0.15.25](https://github.com/summarizator/fora-frontend/commit/41d91fe7)
  - [chore: release 0.15.24](https://github.com/summarizator/fora-frontend/commit/f8b43f75)
  - [chore: release 0.15.23](https://github.com/summarizator/fora-frontend/commit/2d8850c7)
  - [chore: release 0.15.22](https://github.com/summarizator/fora-frontend/commit/c0970bcc)
  - [chore: release 0.15.21](https://github.com/summarizator/fora-frontend/commit/29d219d0)
  - [chore: release 0.15.20](https://github.com/summarizator/fora-frontend/commit/da361273)
  - [fix: json writing](https://github.com/summarizator/fora-frontend/commit/16c1a997)
  - [chore: release 0.15.19](https://github.com/summarizator/fora-frontend/commit/c06bd710)
  - [chore: release 0.15.18](https://github.com/summarizator/fora-frontend/commit/e8729ef2)
  - [chore: release 0.15.17](https://github.com/summarizator/fora-frontend/commit/9c5889e0)
  - [chore: release 0.15.16](https://github.com/summarizator/fora-frontend/commit/74b14f5b)
  - [chore: release 0.15.15](https://github.com/summarizator/fora-frontend/commit/cfb51171)
  - [chore: release 0.15.14](https://github.com/summarizator/fora-frontend/commit/05185594)
  - [chore: release 0.15.13](https://github.com/summarizator/fora-frontend/commit/b104e115)
  - [chore: release 0.15.12](https://github.com/summarizator/fora-frontend/commit/632914ae)
  - [chore: release 0.15.11](https://github.com/summarizator/fora-frontend/commit/2c5ba71e)
  - [fix: looks like i want it to](https://github.com/summarizator/fora-frontend/commit/ac551328)
  - [chore: release 0.15.9](https://github.com/summarizator/fora-frontend/commit/b4e4b927)
  - [chore: release 0.15.8](https://github.com/summarizator/fora-frontend/commit/8ea004e1)
  - [chore: release 0.15.7](https://github.com/summarizator/fora-frontend/commit/25eea181)
  - [chore: release 0.15.6](https://github.com/summarizator/fora-frontend/commit/c4d8839e)
  - [chore: release 0.15.5](https://github.com/summarizator/fora-frontend/commit/724d618e)
  - [chore: release 0.15.4](https://github.com/summarizator/fora-frontend/commit/fb3ed7e2)
  - [chore: release 0.15.3](https://github.com/summarizator/fora-frontend/commit/de1a6c17)
  - [fix: some more edits](https://github.com/summarizator/fora-frontend/commit/828b63f9)
  - [chore: release 0.15.0](https://github.com/summarizator/fora-frontend/commit/8d1f5e03)
  - [fix: some more edits](https://github.com/summarizator/fora-frontend/commit/421858f9)
  - [fix: some more edits](https://github.com/summarizator/fora-frontend/commit/9a7a0e95)
  - [fix: got it](https://github.com/summarizator/fora-frontend/commit/1251fdb4)
  - [chore: release 0.14.0](https://github.com/summarizator/fora-frontend/commit/de185c95)
  - [chore: release 0.13.0](https://github.com/summarizator/fora-frontend/commit/ed9cf8fd)
  - [chore: release 0.12.0](https://github.com/summarizator/fora-frontend/commit/1b1d868d)
  - [chore: release 0.11.0](https://github.com/summarizator/fora-frontend/commit/0ad82baa)
  - [chore: release 0.10.0](https://github.com/summarizator/fora-frontend/commit/b6e2da3f)
  - [chore: release 0.9.0](https://github.com/summarizator/fora-frontend/commit/37594ba8)
  - [chore: release 0.8.0](https://github.com/summarizator/fora-frontend/commit/60a50f28)
  - [chore: release 0.7.0](https://github.com/summarizator/fora-frontend/commit/dd08fbab)
  - [chore: release 0.6.0](https://github.com/summarizator/fora-frontend/commit/037a9275)
  - [fix: some more readme formatting for dates](https://github.com/summarizator/fora-frontend/commit/f3ea4051)
  - [fix: some more readme formatting](https://github.com/summarizator/fora-frontend/commit/27b0c0be)
  - [fix: maybe fix release flow](https://github.com/summarizator/fora-frontend/commit/8f8fa992)
  - [chore: maybe move pre-push check](https://github.com/summarizator/fora-frontend/commit/396b69c2)
  - [fix: maybe fix branch naming](https://github.com/summarizator/fora-frontend/commit/2ebf827e)
  - [feat: test feature here](https://github.com/summarizator/fora-frontend/commit/9f4ba6ff)
  - [fix: husky hook](https://github.com/summarizator/fora-frontend/commit/09b68c85)
  - [test husky](https://github.com/summarizator/fora-frontend/commit/017494c1)
  - [test husky](https://github.com/summarizator/fora-frontend/commit/2dbd3a41)
  - [chore: release 0.5.3](https://github.com/summarizator/fora-frontend/commit/39be00fb)
  - [chore: release 0.5.2](https://github.com/summarizator/fora-frontend/commit/1b46922f)
  - [start of releaseit](https://github.com/summarizator/fora-frontend/commit/ac2c95bf)
  - [chore: release v0.5.1](https://github.com/summarizator/fora-frontend/commit/ffeb29d4)
  - [build info plugin](https://github.com/summarizator/fora-frontend/commit/7c82d728)

  </details>

### Bug Fixes

- [FORA-1117](https://foraday.atlassian.net/browse/FORA-1117): broken guest user flow
  <details>
    <summary>Commits</summary>

  - [chore: release 0.5.37](https://github.com/summarizator/fora-frontend/commit/8c83d46c)

  </details>

- [FORA-1115](https://foraday.atlassian.net/browse/FORA-1115): Add padding on meeting detail page
  <details>
    <summary>Commits</summary>

  - [](https://github.com/summarizator/fora-frontend/commit/)

  </details>

- [FORA-1114](https://foraday.atlassian.net/browse/FORA-1114): remove duplicate fora lenses
  <details>
    <summary>Commits</summary>

  - [](https://github.com/summarizator/fora-frontend/commit/)

  </details>

## [0.5.63](https://github.com/summarizator/fora-frontend/compare/v0.5.62...v0.5.63) <span style="color: red;">[prod]</span>

> Fri, Jan 24 2025 | 07:46 PM EST

### Features

- [FORA-1077](https://foraday.atlassian.net/browse/FORA-1077): FE: Integrate Release-It to github actions flow
  <details>
    <summary>Commits</summary>

  - [maybe finally](https://github.com/summarizator/fora-frontend/commit/f951eb46)
  - [chore: release 0.5.61](https://github.com/summarizator/fora-frontend/commit/34a27f86)
  - [chore: release 0.5.60](https://github.com/summarizator/fora-frontend/commit/205cf6bb)
  - [chore: release 0.5.59](https://github.com/summarizator/fora-frontend/commit/b8ce3830)
  - [chore: release 0.5.58](https://github.com/summarizator/fora-frontend/commit/7196a14f)
  - [chore: release 0.5.57](https://github.com/summarizator/fora-frontend/commit/5e6f6c3e)
  - [chore: release 0.5.56](https://github.com/summarizator/fora-frontend/commit/2641b805)
  - [chore: release 0.5.55](https://github.com/summarizator/fora-frontend/commit/90dea734)
  - [chore: release 0.5.54](https://github.com/summarizator/fora-frontend/commit/c8bd5549)
  - [chore: release 0.5.53](https://github.com/summarizator/fora-frontend/commit/8702254c)
  - [chore: release 0.5.52](https://github.com/summarizator/fora-frontend/commit/7b035fed)
  - [chore: release 0.5.51](https://github.com/summarizator/fora-frontend/commit/ae71451f)
  - [chore: release 0.5.50](https://github.com/summarizator/fora-frontend/commit/58f8c159)
  - [ugh](https://github.com/summarizator/fora-frontend/commit/8505a73a)
  - [chore: update changelog for production release v0.5.49](https://github.com/summarizator/fora-frontend/commit/df6ee29c)
  - [chore: release 0.5.49](https://github.com/summarizator/fora-frontend/commit/c41529fb)
  - [Merge pull request #1163 from summarizator/dev](https://github.com/summarizator/fora-frontend/commit/289df588)
  - [zzzz222](https://github.com/summarizator/fora-frontend/commit/6e2ae365)
  - [zzzz](https://github.com/summarizator/fora-frontend/commit/951ca70a)
  - [chore: update changelog for production release v0.5.47](https://github.com/summarizator/fora-frontend/commit/94dafc05)
  - [chore: release 0.5.47](https://github.com/summarizator/fora-frontend/commit/183339bc)
  - [Merge pull request #1161 from summarizator/dev](https://github.com/summarizator/fora-frontend/commit/69cfcf27)
  - [maybe fix for prod job](https://github.com/summarizator/fora-frontend/commit/8a11074e)
  - [maybe fix for prod job](https://github.com/summarizator/fora-frontend/commit/7464a06c)
  - [chore: update changelog for production release v0.5.45](https://github.com/summarizator/fora-frontend/commit/d263b855)
  - [chore: release 0.5.45](https://github.com/summarizator/fora-frontend/commit/59639faa)
  - [Merge pull request #1159 from summarizator/dev](https://github.com/summarizator/fora-frontend/commit/af095ba7)
  - [Merge pull request #1157 from summarizator/dev](https://github.com/summarizator/fora-frontend/commit/a1b746a8)
  - [Merge pull request #1148 from summarizator/dev](https://github.com/summarizator/fora-frontend/commit/114e049b)
  - [maybe fix for prod job](https://github.com/summarizator/fora-frontend/commit/7f4efa61)
  - [use cache for prod job too](https://github.com/summarizator/fora-frontend/commit/8fb0bc20)
  - [perhaps prod changes 3](https://github.com/summarizator/fora-frontend/commit/5a886e4f)
  - [perhaps prod changes 3](https://github.com/summarizator/fora-frontend/commit/2d166700)
  - [commit 2](https://github.com/summarizator/fora-frontend/commit/f2314527)
  - [commit 1](https://github.com/summarizator/fora-frontend/commit/2c82ec3e)
  - [aaaaanotherz](https://github.com/summarizator/fora-frontend/commit/a612e1e5)
  - [chore: release 0.5.39](https://github.com/summarizator/fora-frontend/commit/6c21fbb5)
  - [chore: release 0.5.36](https://github.com/summarizator/fora-frontend/commit/c46d914f)
  - [](https://github.com/summarizator/fora-frontend/commit/)
  - [](https://github.com/summarizator/fora-frontend/commit/)
  - [](https://github.com/summarizator/fora-frontend/commit/)
  - [chore: release 0.5.27](https://github.com/summarizator/fora-frontend/commit/5879296f)
  - [logz](https://github.com/summarizator/fora-frontend/commit/780e7fa6)
  - [logz](https://github.com/summarizator/fora-frontend/commit/625aee98)
  - [chore: release 0.5.26](https://github.com/summarizator/fora-frontend/commit/0a936731)
  - [chore: release 0.5.25](https://github.com/summarizator/fora-frontend/commit/3f677031)
  - [chore: release 0.5.24](https://github.com/summarizator/fora-frontend/commit/3aa63c2c)
  - [chore: release 0.5.23](https://github.com/summarizator/fora-frontend/commit/e31e8d5f)
  - [chore: release 0.5.18](https://github.com/summarizator/fora-frontend/commit/56f9d7ec)
  - [chore: release 0.5.17](https://github.com/summarizator/fora-frontend/commit/2bec2ac9)
  - [chore: release 0.5.16](https://github.com/summarizator/fora-frontend/commit/1ce7c9e9)
  - [cool new readme](https://github.com/summarizator/fora-frontend/commit/bba4c6ed)

  </details>

- [FORA-878](https://foraday.atlassian.net/browse/FORA-878): Allow category change on recent page
  <details>
    <summary>Commits</summary>

  - [](https://github.com/summarizator/fora-frontend/commit/)

  </details>

- [FORA-1085](https://foraday.atlassian.net/browse/FORA-1085): Create Summary modal
  <details>
    <summary>Commits</summary>

  - [](https://github.com/summarizator/fora-frontend/commit/)

  </details>

- [FORA-1066](https://foraday.atlassian.net/browse/FORA-1066): SPIKE - Okta Integration
  <details>
    <summary>Commits</summary>

  - [](https://github.com/summarizator/fora-frontend/commit/)

  </details>

- [FORA-840](https://foraday.atlassian.net/browse/FORA-840): Integrate Release-It to FE Repo
  <details>
    <summary>Commits</summary>

  - [chore: release 0.5.14](https://github.com/summarizator/fora-frontend/commit/88fee98e)
  - [chore: release 0.5.13](https://github.com/summarizator/fora-frontend/commit/f11b546c)
  - [chore: release 0.5.12](https://github.com/summarizator/fora-frontend/commit/9dc77c8a)
  - [chore: release 0.5.11](https://github.com/summarizator/fora-frontend/commit/10c35a54)
  - [chore: release 0.5.10](https://github.com/summarizator/fora-frontend/commit/8ee45320)
  - [chore: release 0.5.9](https://github.com/summarizator/fora-frontend/commit/b2ae433b)
  - [chore: release 0.5.8](https://github.com/summarizator/fora-frontend/commit/ceed34d9)
  - [chore: release 0.5.7](https://github.com/summarizator/fora-frontend/commit/53d84d35)
  - [chore: release 0.5.6](https://github.com/summarizator/fora-frontend/commit/0d250ed2)
  - [chore: release 0.5.5](https://github.com/summarizator/fora-frontend/commit/bf541008)
  - [chore: release 0.5.4](https://github.com/summarizator/fora-frontend/commit/9c37c293)
  - [chore: release 0.5.3](https://github.com/summarizator/fora-frontend/commit/f7d4bfe8)
  - [chore: release 0.5.2](https://github.com/summarizator/fora-frontend/commit/bf4a84db)
  - [chore: release 0.5.1](https://github.com/summarizator/fora-frontend/commit/aadf74d3)
  - [chore: release 0.5.2](https://github.com/summarizator/fora-frontend/commit/6b514330)
  - [chore: release 0.6.11](https://github.com/summarizator/fora-frontend/commit/ece60a67)
  - [chore: release 0.6.10](https://github.com/summarizator/fora-frontend/commit/2de1bedb)
  - [chore: release 0.6.9](https://github.com/summarizator/fora-frontend/commit/53b8f5ca)
  - [chore: release 0.6.8](https://github.com/summarizator/fora-frontend/commit/7798ad1d)
  - [chore: release 0.6.7](https://github.com/summarizator/fora-frontend/commit/f886470d)
  - [chore: release 0.6.6](https://github.com/summarizator/fora-frontend/commit/330eb03c)
  - [chore: release 0.6.5](https://github.com/summarizator/fora-frontend/commit/6787b64c)
  - [chore: release 0.6.4](https://github.com/summarizator/fora-frontend/commit/5a0fa3e6)
  - [chore: release 0.6.3](https://github.com/summarizator/fora-frontend/commit/6f8abded)
  - [Merge branch 'dev' into FORA-840](https://github.com/summarizator/fora-frontend/commit/c6bb1a7a)
  - [chore: release 0.6.1](https://github.com/summarizator/fora-frontend/commit/a9f1d7e6)
  - [chore: release 0.6.0](https://github.com/summarizator/fora-frontend/commit/6d5b7351)
  - [Merge branch 'dev' of github.com:summarizator/fora-frontend into FORA-840](https://github.com/summarizator/fora-frontend/commit/06ad38b4)
  - [try to kill all warnings](https://github.com/summarizator/fora-frontend/commit/7b1f20bb)
  - [add linting to pre-push](https://github.com/summarizator/fora-frontend/commit/0763edf0)
  - [add linting to pre-push](https://github.com/summarizator/fora-frontend/commit/963ff2f0)
  - [fix lint](https://github.com/summarizator/fora-frontend/commit/a8d262df)
  - [test](https://github.com/summarizator/fora-frontend/commit/e3f4e99b)
  - [clean](https://github.com/summarizator/fora-frontend/commit/fcedb650)
  - [fixes](https://github.com/summarizator/fora-frontend/commit/9d05113a)
  - [chore: release 0.5.15](https://github.com/summarizator/fora-frontend/commit/989f6fa9)
  - [chore: release 0.5.14](https://github.com/summarizator/fora-frontend/commit/42ad3861)
  - [Merge branch 'dev' into FORA-840](https://github.com/summarizator/fora-frontend/commit/df1530e1)
  - [chore: release 0.5.13](https://github.com/summarizator/fora-frontend/commit/10932202)
  - [chore: release 0.5.12](https://github.com/summarizator/fora-frontend/commit/92dcd324)
  - [fixes](https://github.com/summarizator/fora-frontend/commit/b27af8e0)
  - [build stuff](https://github.com/summarizator/fora-frontend/commit/3c72984b)
  - [think its working](https://github.com/summarizator/fora-frontend/commit/85c70b83)
  - [think its working](https://github.com/summarizator/fora-frontend/commit/3bbd19d3)
  - [Merge branch 'dev' into FORA-840](https://github.com/summarizator/fora-frontend/commit/601022d4)
  - [think its working](https://github.com/summarizator/fora-frontend/commit/70f85e94)
  - [chore: release 0.5.11](https://github.com/summarizator/fora-frontend/commit/f231b109)
  - [chore: release 0.5.10](https://github.com/summarizator/fora-frontend/commit/2b3663f4)
  - [chore: release 0.5.9](https://github.com/summarizator/fora-frontend/commit/b2cc8d94)
  - [chore: release 0.5.8](https://github.com/summarizator/fora-frontend/commit/dbb82f0d)
  - [chore: release 0.5.7](https://github.com/summarizator/fora-frontend/commit/a7712fb6)
  - [chore: release 0.5.6](https://github.com/summarizator/fora-frontend/commit/c6b905b6)
  - [untested prod function](https://github.com/summarizator/fora-frontend/commit/254f8fe4)
  - [chore: release 0.5.5](https://github.com/summarizator/fora-frontend/commit/c61eed54)
  - [start concept of dev and prod releases](https://github.com/summarizator/fora-frontend/commit/e288b500)
  - [chore: release 0.5.4](https://github.com/summarizator/fora-frontend/commit/bb2a5ef1)
  - [chore: release 0.5.3](https://github.com/summarizator/fora-frontend/commit/3c1e584e)
  - [chore: release 0.5.2](https://github.com/summarizator/fora-frontend/commit/b79edc4b)
  - [chore: release 0.5.1](https://github.com/summarizator/fora-frontend/commit/8a7be26f)
  - [rm commit message hook](https://github.com/summarizator/fora-frontend/commit/59e2d658)
  - [fix: json writing](https://github.com/summarizator/fora-frontend/commit/eab3c626)
  - [chore: release 0.15.28](https://github.com/summarizator/fora-frontend/commit/200f276c)
  - [chore: release 0.15.27](https://github.com/summarizator/fora-frontend/commit/8c35ce2c)
  - [chore: release 0.15.25](https://github.com/summarizator/fora-frontend/commit/41d91fe7)
  - [chore: release 0.15.24](https://github.com/summarizator/fora-frontend/commit/f8b43f75)
  - [chore: release 0.15.23](https://github.com/summarizator/fora-frontend/commit/2d8850c7)
  - [chore: release 0.15.22](https://github.com/summarizator/fora-frontend/commit/c0970bcc)
  - [chore: release 0.15.21](https://github.com/summarizator/fora-frontend/commit/29d219d0)
  - [chore: release 0.15.20](https://github.com/summarizator/fora-frontend/commit/da361273)
  - [fix: json writing](https://github.com/summarizator/fora-frontend/commit/16c1a997)
  - [chore: release 0.15.19](https://github.com/summarizator/fora-frontend/commit/c06bd710)
  - [chore: release 0.15.18](https://github.com/summarizator/fora-frontend/commit/e8729ef2)
  - [chore: release 0.15.17](https://github.com/summarizator/fora-frontend/commit/9c5889e0)
  - [chore: release 0.15.16](https://github.com/summarizator/fora-frontend/commit/74b14f5b)
  - [chore: release 0.15.15](https://github.com/summarizator/fora-frontend/commit/cfb51171)
  - [chore: release 0.15.14](https://github.com/summarizator/fora-frontend/commit/05185594)
  - [chore: release 0.15.13](https://github.com/summarizator/fora-frontend/commit/b104e115)
  - [chore: release 0.15.12](https://github.com/summarizator/fora-frontend/commit/632914ae)
  - [chore: release 0.15.11](https://github.com/summarizator/fora-frontend/commit/2c5ba71e)
  - [fix: looks like i want it to](https://github.com/summarizator/fora-frontend/commit/ac551328)
  - [chore: release 0.15.9](https://github.com/summarizator/fora-frontend/commit/b4e4b927)
  - [chore: release 0.15.8](https://github.com/summarizator/fora-frontend/commit/8ea004e1)
  - [chore: release 0.15.7](https://github.com/summarizator/fora-frontend/commit/25eea181)
  - [chore: release 0.15.6](https://github.com/summarizator/fora-frontend/commit/c4d8839e)
  - [chore: release 0.15.5](https://github.com/summarizator/fora-frontend/commit/724d618e)
  - [chore: release 0.15.4](https://github.com/summarizator/fora-frontend/commit/fb3ed7e2)
  - [chore: release 0.15.3](https://github.com/summarizator/fora-frontend/commit/de1a6c17)
  - [fix: some more edits](https://github.com/summarizator/fora-frontend/commit/828b63f9)
  - [chore: release 0.15.0](https://github.com/summarizator/fora-frontend/commit/8d1f5e03)
  - [fix: some more edits](https://github.com/summarizator/fora-frontend/commit/421858f9)
  - [fix: some more edits](https://github.com/summarizator/fora-frontend/commit/9a7a0e95)
  - [fix: got it](https://github.com/summarizator/fora-frontend/commit/1251fdb4)
  - [chore: release 0.14.0](https://github.com/summarizator/fora-frontend/commit/de185c95)
  - [chore: release 0.13.0](https://github.com/summarizator/fora-frontend/commit/ed9cf8fd)
  - [chore: release 0.12.0](https://github.com/summarizator/fora-frontend/commit/1b1d868d)
  - [chore: release 0.11.0](https://github.com/summarizator/fora-frontend/commit/0ad82baa)
  - [chore: release 0.10.0](https://github.com/summarizator/fora-frontend/commit/b6e2da3f)
  - [chore: release 0.9.0](https://github.com/summarizator/fora-frontend/commit/37594ba8)
  - [chore: release 0.8.0](https://github.com/summarizator/fora-frontend/commit/60a50f28)
  - [chore: release 0.7.0](https://github.com/summarizator/fora-frontend/commit/dd08fbab)
  - [chore: release 0.6.0](https://github.com/summarizator/fora-frontend/commit/037a9275)
  - [fix: some more readme formatting for dates](https://github.com/summarizator/fora-frontend/commit/f3ea4051)
  - [fix: some more readme formatting](https://github.com/summarizator/fora-frontend/commit/27b0c0be)
  - [fix: maybe fix release flow](https://github.com/summarizator/fora-frontend/commit/8f8fa992)
  - [chore: maybe move pre-push check](https://github.com/summarizator/fora-frontend/commit/396b69c2)
  - [fix: maybe fix branch naming](https://github.com/summarizator/fora-frontend/commit/2ebf827e)
  - [feat: test feature here](https://github.com/summarizator/fora-frontend/commit/9f4ba6ff)
  - [fix: husky hook](https://github.com/summarizator/fora-frontend/commit/09b68c85)
  - [test husky](https://github.com/summarizator/fora-frontend/commit/017494c1)
  - [test husky](https://github.com/summarizator/fora-frontend/commit/2dbd3a41)
  - [chore: release 0.5.3](https://github.com/summarizator/fora-frontend/commit/39be00fb)
  - [chore: release 0.5.2](https://github.com/summarizator/fora-frontend/commit/1b46922f)
  - [start of releaseit](https://github.com/summarizator/fora-frontend/commit/ac2c95bf)
  - [chore: release v0.5.1](https://github.com/summarizator/fora-frontend/commit/ffeb29d4)
  - [build info plugin](https://github.com/summarizator/fora-frontend/commit/7c82d728)

  </details>

### Bug Fixes

- [FORA-1117](https://foraday.atlassian.net/browse/FORA-1117): broken guest user flow
  <details>
    <summary>Commits</summary>

  - [chore: release 0.5.37](https://github.com/summarizator/fora-frontend/commit/8c83d46c)

  </details>

- [FORA-1115](https://foraday.atlassian.net/browse/FORA-1115): Add padding on meeting detail page
  <details>
    <summary>Commits</summary>

  - [](https://github.com/summarizator/fora-frontend/commit/)

  </details>

- [FORA-1114](https://foraday.atlassian.net/browse/FORA-1114): remove duplicate fora lenses
  <details>
    <summary>Commits</summary>

  - [](https://github.com/summarizator/fora-frontend/commit/)

  </details>

## [0.5.61](https://github.com/summarizator/fora-frontend/compare/v0.5.60...v0.5.61) <span style="color: red;">[prod]</span>

> Thu, Jan 23 2025 | 07:40 PM EST

### Features

- [FORA-1077](https://foraday.atlassian.net/browse/FORA-1077): FE: Integrate Release-It to github actions flow
  <details>
    <summary>Commits</summary>

  - [zzzz222](https://github.com/summarizator/fora-frontend/commit/6e2ae365)
  - [zzzz](https://github.com/summarizator/fora-frontend/commit/951ca70a)
  - [chore: update changelog for production release v0.5.47](https://github.com/summarizator/fora-frontend/commit/94dafc05)
  - [chore: release 0.5.47](https://github.com/summarizator/fora-frontend/commit/183339bc)
  - [Merge pull request #1161 from summarizator/dev](https://github.com/summarizator/fora-frontend/commit/69cfcf27)
  - [maybe fix for prod job](https://github.com/summarizator/fora-frontend/commit/8a11074e)
  - [maybe fix for prod job](https://github.com/summarizator/fora-frontend/commit/7464a06c)
  - [chore: update changelog for production release v0.5.45](https://github.com/summarizator/fora-frontend/commit/d263b855)
  - [chore: release 0.5.45](https://github.com/summarizator/fora-frontend/commit/59639faa)
  - [Merge pull request #1159 from summarizator/dev](https://github.com/summarizator/fora-frontend/commit/af095ba7)
  - [Merge pull request #1157 from summarizator/dev](https://github.com/summarizator/fora-frontend/commit/a1b746a8)
  - [Merge pull request #1148 from summarizator/dev](https://github.com/summarizator/fora-frontend/commit/114e049b)
  - [maybe fix for prod job](https://github.com/summarizator/fora-frontend/commit/7f4efa61)
  - [use cache for prod job too](https://github.com/summarizator/fora-frontend/commit/8fb0bc20)
  - [perhaps prod changes 3](https://github.com/summarizator/fora-frontend/commit/5a886e4f)
  - [perhaps prod changes 3](https://github.com/summarizator/fora-frontend/commit/2d166700)
  - [commit 2](https://github.com/summarizator/fora-frontend/commit/f2314527)
  - [commit 1](https://github.com/summarizator/fora-frontend/commit/2c82ec3e)
  - [aaaaanotherz](https://github.com/summarizator/fora-frontend/commit/a612e1e5)
  - [chore: release 0.5.39](https://github.com/summarizator/fora-frontend/commit/6c21fbb5)
  - [chore: release 0.5.36](https://github.com/summarizator/fora-frontend/commit/c46d914f)
  - [](https://github.com/summarizator/fora-frontend/commit/)
  - [](https://github.com/summarizator/fora-frontend/commit/)
  - [](https://github.com/summarizator/fora-frontend/commit/)
  - [chore: release 0.5.27](https://github.com/summarizator/fora-frontend/commit/5879296f)
  - [logz](https://github.com/summarizator/fora-frontend/commit/780e7fa6)
  - [logz](https://github.com/summarizator/fora-frontend/commit/625aee98)
  - [chore: release 0.5.26](https://github.com/summarizator/fora-frontend/commit/0a936731)
  - [chore: release 0.5.25](https://github.com/summarizator/fora-frontend/commit/3f677031)
  - [chore: release 0.5.24](https://github.com/summarizator/fora-frontend/commit/3aa63c2c)
  - [chore: release 0.5.23](https://github.com/summarizator/fora-frontend/commit/e31e8d5f)
  - [chore: release 0.5.18](https://github.com/summarizator/fora-frontend/commit/56f9d7ec)
  - [chore: release 0.5.17](https://github.com/summarizator/fora-frontend/commit/2bec2ac9)
  - [chore: release 0.5.16](https://github.com/summarizator/fora-frontend/commit/1ce7c9e9)
  - [cool new readme](https://github.com/summarizator/fora-frontend/commit/bba4c6ed)

  </details>

- [FORA-878](https://foraday.atlassian.net/browse/FORA-878): Allow category change on recent page
  <details>
    <summary>Commits</summary>

  - [](https://github.com/summarizator/fora-frontend/commit/)

  </details>

- [FORA-1085](https://foraday.atlassian.net/browse/FORA-1085): Create Summary modal
  <details>
    <summary>Commits</summary>

  - [](https://github.com/summarizator/fora-frontend/commit/)

  </details>

- [FORA-1066](https://foraday.atlassian.net/browse/FORA-1066): SPIKE - Okta Integration
  <details>
    <summary>Commits</summary>

  - [](https://github.com/summarizator/fora-frontend/commit/)

  </details>

- [FORA-840](https://foraday.atlassian.net/browse/FORA-840): Integrate Release-It to FE Repo
  <details>
    <summary>Commits</summary>

  - [chore: release 0.5.14](https://github.com/summarizator/fora-frontend/commit/88fee98e)
  - [chore: release 0.5.13](https://github.com/summarizator/fora-frontend/commit/f11b546c)
  - [chore: release 0.5.12](https://github.com/summarizator/fora-frontend/commit/9dc77c8a)
  - [chore: release 0.5.11](https://github.com/summarizator/fora-frontend/commit/10c35a54)
  - [chore: release 0.5.10](https://github.com/summarizator/fora-frontend/commit/8ee45320)
  - [chore: release 0.5.9](https://github.com/summarizator/fora-frontend/commit/b2ae433b)
  - [chore: release 0.5.8](https://github.com/summarizator/fora-frontend/commit/ceed34d9)
  - [chore: release 0.5.7](https://github.com/summarizator/fora-frontend/commit/53d84d35)
  - [chore: release 0.5.6](https://github.com/summarizator/fora-frontend/commit/0d250ed2)
  - [chore: release 0.5.5](https://github.com/summarizator/fora-frontend/commit/bf541008)
  - [chore: release 0.5.4](https://github.com/summarizator/fora-frontend/commit/9c37c293)
  - [chore: release 0.5.3](https://github.com/summarizator/fora-frontend/commit/f7d4bfe8)
  - [chore: release 0.5.2](https://github.com/summarizator/fora-frontend/commit/bf4a84db)
  - [chore: release 0.5.1](https://github.com/summarizator/fora-frontend/commit/aadf74d3)
  - [chore: release 0.5.2](https://github.com/summarizator/fora-frontend/commit/6b514330)
  - [chore: release 0.6.11](https://github.com/summarizator/fora-frontend/commit/ece60a67)
  - [chore: release 0.6.10](https://github.com/summarizator/fora-frontend/commit/2de1bedb)
  - [chore: release 0.6.9](https://github.com/summarizator/fora-frontend/commit/53b8f5ca)
  - [chore: release 0.6.8](https://github.com/summarizator/fora-frontend/commit/7798ad1d)
  - [chore: release 0.6.7](https://github.com/summarizator/fora-frontend/commit/f886470d)
  - [chore: release 0.6.6](https://github.com/summarizator/fora-frontend/commit/330eb03c)
  - [chore: release 0.6.5](https://github.com/summarizator/fora-frontend/commit/6787b64c)
  - [chore: release 0.6.4](https://github.com/summarizator/fora-frontend/commit/5a0fa3e6)
  - [chore: release 0.6.3](https://github.com/summarizator/fora-frontend/commit/6f8abded)
  - [Merge branch 'dev' into FORA-840](https://github.com/summarizator/fora-frontend/commit/c6bb1a7a)
  - [chore: release 0.6.1](https://github.com/summarizator/fora-frontend/commit/a9f1d7e6)
  - [chore: release 0.6.0](https://github.com/summarizator/fora-frontend/commit/6d5b7351)
  - [Merge branch 'dev' of github.com:summarizator/fora-frontend into FORA-840](https://github.com/summarizator/fora-frontend/commit/06ad38b4)
  - [try to kill all warnings](https://github.com/summarizator/fora-frontend/commit/7b1f20bb)
  - [add linting to pre-push](https://github.com/summarizator/fora-frontend/commit/0763edf0)
  - [add linting to pre-push](https://github.com/summarizator/fora-frontend/commit/963ff2f0)
  - [fix lint](https://github.com/summarizator/fora-frontend/commit/a8d262df)
  - [test](https://github.com/summarizator/fora-frontend/commit/e3f4e99b)
  - [clean](https://github.com/summarizator/fora-frontend/commit/fcedb650)
  - [fixes](https://github.com/summarizator/fora-frontend/commit/9d05113a)
  - [chore: release 0.5.15](https://github.com/summarizator/fora-frontend/commit/989f6fa9)
  - [chore: release 0.5.14](https://github.com/summarizator/fora-frontend/commit/42ad3861)
  - [Merge branch 'dev' into FORA-840](https://github.com/summarizator/fora-frontend/commit/df1530e1)
  - [chore: release 0.5.13](https://github.com/summarizator/fora-frontend/commit/10932202)
  - [chore: release 0.5.12](https://github.com/summarizator/fora-frontend/commit/92dcd324)
  - [fixes](https://github.com/summarizator/fora-frontend/commit/b27af8e0)
  - [build stuff](https://github.com/summarizator/fora-frontend/commit/3c72984b)
  - [think its working](https://github.com/summarizator/fora-frontend/commit/85c70b83)
  - [think its working](https://github.com/summarizator/fora-frontend/commit/3bbd19d3)
  - [Merge branch 'dev' into FORA-840](https://github.com/summarizator/fora-frontend/commit/601022d4)
  - [think its working](https://github.com/summarizator/fora-frontend/commit/70f85e94)
  - [chore: release 0.5.11](https://github.com/summarizator/fora-frontend/commit/f231b109)
  - [chore: release 0.5.10](https://github.com/summarizator/fora-frontend/commit/2b3663f4)
  - [chore: release 0.5.9](https://github.com/summarizator/fora-frontend/commit/b2cc8d94)
  - [chore: release 0.5.8](https://github.com/summarizator/fora-frontend/commit/dbb82f0d)
  - [chore: release 0.5.7](https://github.com/summarizator/fora-frontend/commit/a7712fb6)
  - [chore: release 0.5.6](https://github.com/summarizator/fora-frontend/commit/c6b905b6)
  - [untested prod function](https://github.com/summarizator/fora-frontend/commit/254f8fe4)
  - [chore: release 0.5.5](https://github.com/summarizator/fora-frontend/commit/c61eed54)
  - [start concept of dev and prod releases](https://github.com/summarizator/fora-frontend/commit/e288b500)
  - [chore: release 0.5.4](https://github.com/summarizator/fora-frontend/commit/bb2a5ef1)
  - [chore: release 0.5.3](https://github.com/summarizator/fora-frontend/commit/3c1e584e)
  - [chore: release 0.5.2](https://github.com/summarizator/fora-frontend/commit/b79edc4b)
  - [chore: release 0.5.1](https://github.com/summarizator/fora-frontend/commit/8a7be26f)
  - [rm commit message hook](https://github.com/summarizator/fora-frontend/commit/59e2d658)
  - [fix: json writing](https://github.com/summarizator/fora-frontend/commit/eab3c626)
  - [chore: release 0.15.28](https://github.com/summarizator/fora-frontend/commit/200f276c)
  - [chore: release 0.15.27](https://github.com/summarizator/fora-frontend/commit/8c35ce2c)
  - [chore: release 0.15.25](https://github.com/summarizator/fora-frontend/commit/41d91fe7)
  - [chore: release 0.15.24](https://github.com/summarizator/fora-frontend/commit/f8b43f75)
  - [chore: release 0.15.23](https://github.com/summarizator/fora-frontend/commit/2d8850c7)
  - [chore: release 0.15.22](https://github.com/summarizator/fora-frontend/commit/c0970bcc)
  - [chore: release 0.15.21](https://github.com/summarizator/fora-frontend/commit/29d219d0)
  - [chore: release 0.15.20](https://github.com/summarizator/fora-frontend/commit/da361273)
  - [fix: json writing](https://github.com/summarizator/fora-frontend/commit/16c1a997)
  - [chore: release 0.15.19](https://github.com/summarizator/fora-frontend/commit/c06bd710)
  - [chore: release 0.15.18](https://github.com/summarizator/fora-frontend/commit/e8729ef2)
  - [chore: release 0.15.17](https://github.com/summarizator/fora-frontend/commit/9c5889e0)
  - [chore: release 0.15.16](https://github.com/summarizator/fora-frontend/commit/74b14f5b)
  - [chore: release 0.15.15](https://github.com/summarizator/fora-frontend/commit/cfb51171)
  - [chore: release 0.15.14](https://github.com/summarizator/fora-frontend/commit/05185594)
  - [chore: release 0.15.13](https://github.com/summarizator/fora-frontend/commit/b104e115)
  - [chore: release 0.15.12](https://github.com/summarizator/fora-frontend/commit/632914ae)
  - [chore: release 0.15.11](https://github.com/summarizator/fora-frontend/commit/2c5ba71e)
  - [fix: looks like i want it to](https://github.com/summarizator/fora-frontend/commit/ac551328)
  - [chore: release 0.15.9](https://github.com/summarizator/fora-frontend/commit/b4e4b927)
  - [chore: release 0.15.8](https://github.com/summarizator/fora-frontend/commit/8ea004e1)
  - [chore: release 0.15.7](https://github.com/summarizator/fora-frontend/commit/25eea181)
  - [chore: release 0.15.6](https://github.com/summarizator/fora-frontend/commit/c4d8839e)
  - [chore: release 0.15.5](https://github.com/summarizator/fora-frontend/commit/724d618e)
  - [chore: release 0.15.4](https://github.com/summarizator/fora-frontend/commit/fb3ed7e2)
  - [chore: release 0.15.3](https://github.com/summarizator/fora-frontend/commit/de1a6c17)
  - [fix: some more edits](https://github.com/summarizator/fora-frontend/commit/828b63f9)
  - [chore: release 0.15.0](https://github.com/summarizator/fora-frontend/commit/8d1f5e03)
  - [fix: some more edits](https://github.com/summarizator/fora-frontend/commit/421858f9)
  - [fix: some more edits](https://github.com/summarizator/fora-frontend/commit/9a7a0e95)
  - [fix: got it](https://github.com/summarizator/fora-frontend/commit/1251fdb4)
  - [chore: release 0.14.0](https://github.com/summarizator/fora-frontend/commit/de185c95)
  - [chore: release 0.13.0](https://github.com/summarizator/fora-frontend/commit/ed9cf8fd)
  - [chore: release 0.12.0](https://github.com/summarizator/fora-frontend/commit/1b1d868d)
  - [chore: release 0.11.0](https://github.com/summarizator/fora-frontend/commit/0ad82baa)
  - [chore: release 0.10.0](https://github.com/summarizator/fora-frontend/commit/b6e2da3f)
  - [chore: release 0.9.0](https://github.com/summarizator/fora-frontend/commit/37594ba8)
  - [chore: release 0.8.0](https://github.com/summarizator/fora-frontend/commit/60a50f28)
  - [chore: release 0.7.0](https://github.com/summarizator/fora-frontend/commit/dd08fbab)
  - [chore: release 0.6.0](https://github.com/summarizator/fora-frontend/commit/037a9275)
  - [fix: some more readme formatting for dates](https://github.com/summarizator/fora-frontend/commit/f3ea4051)
  - [fix: some more readme formatting](https://github.com/summarizator/fora-frontend/commit/27b0c0be)
  - [fix: maybe fix release flow](https://github.com/summarizator/fora-frontend/commit/8f8fa992)
  - [chore: maybe move pre-push check](https://github.com/summarizator/fora-frontend/commit/396b69c2)
  - [fix: maybe fix branch naming](https://github.com/summarizator/fora-frontend/commit/2ebf827e)
  - [feat: test feature here](https://github.com/summarizator/fora-frontend/commit/9f4ba6ff)
  - [fix: husky hook](https://github.com/summarizator/fora-frontend/commit/09b68c85)
  - [test husky](https://github.com/summarizator/fora-frontend/commit/017494c1)
  - [test husky](https://github.com/summarizator/fora-frontend/commit/2dbd3a41)
  - [chore: release 0.5.3](https://github.com/summarizator/fora-frontend/commit/39be00fb)
  - [chore: release 0.5.2](https://github.com/summarizator/fora-frontend/commit/1b46922f)
  - [start of releaseit](https://github.com/summarizator/fora-frontend/commit/ac2c95bf)
  - [chore: release v0.5.1](https://github.com/summarizator/fora-frontend/commit/ffeb29d4)
  - [build info plugin](https://github.com/summarizator/fora-frontend/commit/7c82d728)

  </details>

### Bug Fixes

- [FORA-1117](https://foraday.atlassian.net/browse/FORA-1117): broken guest user flow
  <details>
    <summary>Commits</summary>

  - [chore: release 0.5.37](https://github.com/summarizator/fora-frontend/commit/8c83d46c)

  </details>

- [FORA-1115](https://foraday.atlassian.net/browse/FORA-1115): Add padding on meeting detail page
  <details>
    <summary>Commits</summary>

  - [](https://github.com/summarizator/fora-frontend/commit/)

  </details>

- [FORA-1114](https://foraday.atlassian.net/browse/FORA-1114): remove duplicate fora lenses
  <details>
    <summary>Commits</summary>

  - [](https://github.com/summarizator/fora-frontend/commit/)

  </details>

## [0.5.60](https://github.com/summarizator/fora-frontend/compare/v0.5.59...v0.5.60) <span style="color: red;">[prod]</span>

> Thu, Jan 23 2025 | 07:39 PM EST

### Features

- [FORA-1077](https://foraday.atlassian.net/browse/FORA-1077): FE: Integrate Release-It to github actions flow
  <details>
    <summary>Commits</summary>

  - [zzzz222](https://github.com/summarizator/fora-frontend/commit/6e2ae365)
  - [zzzz](https://github.com/summarizator/fora-frontend/commit/951ca70a)
  - [chore: update changelog for production release v0.5.47](https://github.com/summarizator/fora-frontend/commit/94dafc05)
  - [chore: release 0.5.47](https://github.com/summarizator/fora-frontend/commit/183339bc)
  - [Merge pull request #1161 from summarizator/dev](https://github.com/summarizator/fora-frontend/commit/69cfcf27)
  - [maybe fix for prod job](https://github.com/summarizator/fora-frontend/commit/8a11074e)
  - [maybe fix for prod job](https://github.com/summarizator/fora-frontend/commit/7464a06c)
  - [chore: update changelog for production release v0.5.45](https://github.com/summarizator/fora-frontend/commit/d263b855)
  - [chore: release 0.5.45](https://github.com/summarizator/fora-frontend/commit/59639faa)
  - [Merge pull request #1159 from summarizator/dev](https://github.com/summarizator/fora-frontend/commit/af095ba7)
  - [Merge pull request #1157 from summarizator/dev](https://github.com/summarizator/fora-frontend/commit/a1b746a8)
  - [Merge pull request #1148 from summarizator/dev](https://github.com/summarizator/fora-frontend/commit/114e049b)
  - [maybe fix for prod job](https://github.com/summarizator/fora-frontend/commit/7f4efa61)
  - [use cache for prod job too](https://github.com/summarizator/fora-frontend/commit/8fb0bc20)
  - [perhaps prod changes 3](https://github.com/summarizator/fora-frontend/commit/5a886e4f)
  - [perhaps prod changes 3](https://github.com/summarizator/fora-frontend/commit/2d166700)
  - [commit 2](https://github.com/summarizator/fora-frontend/commit/f2314527)
  - [commit 1](https://github.com/summarizator/fora-frontend/commit/2c82ec3e)
  - [aaaaanotherz](https://github.com/summarizator/fora-frontend/commit/a612e1e5)
  - [chore: release 0.5.39](https://github.com/summarizator/fora-frontend/commit/6c21fbb5)
  - [chore: release 0.5.36](https://github.com/summarizator/fora-frontend/commit/c46d914f)
  - [](https://github.com/summarizator/fora-frontend/commit/)
  - [](https://github.com/summarizator/fora-frontend/commit/)
  - [](https://github.com/summarizator/fora-frontend/commit/)
  - [chore: release 0.5.27](https://github.com/summarizator/fora-frontend/commit/5879296f)
  - [logz](https://github.com/summarizator/fora-frontend/commit/780e7fa6)
  - [logz](https://github.com/summarizator/fora-frontend/commit/625aee98)
  - [chore: release 0.5.26](https://github.com/summarizator/fora-frontend/commit/0a936731)
  - [chore: release 0.5.25](https://github.com/summarizator/fora-frontend/commit/3f677031)
  - [chore: release 0.5.24](https://github.com/summarizator/fora-frontend/commit/3aa63c2c)
  - [chore: release 0.5.23](https://github.com/summarizator/fora-frontend/commit/e31e8d5f)
  - [chore: release 0.5.18](https://github.com/summarizator/fora-frontend/commit/56f9d7ec)
  - [chore: release 0.5.17](https://github.com/summarizator/fora-frontend/commit/2bec2ac9)
  - [chore: release 0.5.16](https://github.com/summarizator/fora-frontend/commit/1ce7c9e9)
  - [cool new readme](https://github.com/summarizator/fora-frontend/commit/bba4c6ed)

  </details>

- [FORA-878](https://foraday.atlassian.net/browse/FORA-878): Allow category change on recent page
  <details>
    <summary>Commits</summary>

  - [](https://github.com/summarizator/fora-frontend/commit/)

  </details>

- [FORA-1085](https://foraday.atlassian.net/browse/FORA-1085): Create Summary modal
  <details>
    <summary>Commits</summary>

  - [](https://github.com/summarizator/fora-frontend/commit/)

  </details>

- [FORA-1066](https://foraday.atlassian.net/browse/FORA-1066): SPIKE - Okta Integration
  <details>
    <summary>Commits</summary>

  - [](https://github.com/summarizator/fora-frontend/commit/)

  </details>

- [FORA-840](https://foraday.atlassian.net/browse/FORA-840): Integrate Release-It to FE Repo
  <details>
    <summary>Commits</summary>

  - [chore: release 0.5.14](https://github.com/summarizator/fora-frontend/commit/88fee98e)
  - [chore: release 0.5.13](https://github.com/summarizator/fora-frontend/commit/f11b546c)
  - [chore: release 0.5.12](https://github.com/summarizator/fora-frontend/commit/9dc77c8a)
  - [chore: release 0.5.11](https://github.com/summarizator/fora-frontend/commit/10c35a54)
  - [chore: release 0.5.10](https://github.com/summarizator/fora-frontend/commit/8ee45320)
  - [chore: release 0.5.9](https://github.com/summarizator/fora-frontend/commit/b2ae433b)
  - [chore: release 0.5.8](https://github.com/summarizator/fora-frontend/commit/ceed34d9)
  - [chore: release 0.5.7](https://github.com/summarizator/fora-frontend/commit/53d84d35)
  - [chore: release 0.5.6](https://github.com/summarizator/fora-frontend/commit/0d250ed2)
  - [chore: release 0.5.5](https://github.com/summarizator/fora-frontend/commit/bf541008)
  - [chore: release 0.5.4](https://github.com/summarizator/fora-frontend/commit/9c37c293)
  - [chore: release 0.5.3](https://github.com/summarizator/fora-frontend/commit/f7d4bfe8)
  - [chore: release 0.5.2](https://github.com/summarizator/fora-frontend/commit/bf4a84db)
  - [chore: release 0.5.1](https://github.com/summarizator/fora-frontend/commit/aadf74d3)
  - [chore: release 0.5.2](https://github.com/summarizator/fora-frontend/commit/6b514330)
  - [chore: release 0.6.11](https://github.com/summarizator/fora-frontend/commit/ece60a67)
  - [chore: release 0.6.10](https://github.com/summarizator/fora-frontend/commit/2de1bedb)
  - [chore: release 0.6.9](https://github.com/summarizator/fora-frontend/commit/53b8f5ca)
  - [chore: release 0.6.8](https://github.com/summarizator/fora-frontend/commit/7798ad1d)
  - [chore: release 0.6.7](https://github.com/summarizator/fora-frontend/commit/f886470d)
  - [chore: release 0.6.6](https://github.com/summarizator/fora-frontend/commit/330eb03c)
  - [chore: release 0.6.5](https://github.com/summarizator/fora-frontend/commit/6787b64c)
  - [chore: release 0.6.4](https://github.com/summarizator/fora-frontend/commit/5a0fa3e6)
  - [chore: release 0.6.3](https://github.com/summarizator/fora-frontend/commit/6f8abded)
  - [Merge branch 'dev' into FORA-840](https://github.com/summarizator/fora-frontend/commit/c6bb1a7a)
  - [chore: release 0.6.1](https://github.com/summarizator/fora-frontend/commit/a9f1d7e6)
  - [chore: release 0.6.0](https://github.com/summarizator/fora-frontend/commit/6d5b7351)
  - [Merge branch 'dev' of github.com:summarizator/fora-frontend into FORA-840](https://github.com/summarizator/fora-frontend/commit/06ad38b4)
  - [try to kill all warnings](https://github.com/summarizator/fora-frontend/commit/7b1f20bb)
  - [add linting to pre-push](https://github.com/summarizator/fora-frontend/commit/0763edf0)
  - [add linting to pre-push](https://github.com/summarizator/fora-frontend/commit/963ff2f0)
  - [fix lint](https://github.com/summarizator/fora-frontend/commit/a8d262df)
  - [test](https://github.com/summarizator/fora-frontend/commit/e3f4e99b)
  - [clean](https://github.com/summarizator/fora-frontend/commit/fcedb650)
  - [fixes](https://github.com/summarizator/fora-frontend/commit/9d05113a)
  - [chore: release 0.5.15](https://github.com/summarizator/fora-frontend/commit/989f6fa9)
  - [chore: release 0.5.14](https://github.com/summarizator/fora-frontend/commit/42ad3861)
  - [Merge branch 'dev' into FORA-840](https://github.com/summarizator/fora-frontend/commit/df1530e1)
  - [chore: release 0.5.13](https://github.com/summarizator/fora-frontend/commit/10932202)
  - [chore: release 0.5.12](https://github.com/summarizator/fora-frontend/commit/92dcd324)
  - [fixes](https://github.com/summarizator/fora-frontend/commit/b27af8e0)
  - [build stuff](https://github.com/summarizator/fora-frontend/commit/3c72984b)
  - [think its working](https://github.com/summarizator/fora-frontend/commit/85c70b83)
  - [think its working](https://github.com/summarizator/fora-frontend/commit/3bbd19d3)
  - [Merge branch 'dev' into FORA-840](https://github.com/summarizator/fora-frontend/commit/601022d4)
  - [think its working](https://github.com/summarizator/fora-frontend/commit/70f85e94)
  - [chore: release 0.5.11](https://github.com/summarizator/fora-frontend/commit/f231b109)
  - [chore: release 0.5.10](https://github.com/summarizator/fora-frontend/commit/2b3663f4)
  - [chore: release 0.5.9](https://github.com/summarizator/fora-frontend/commit/b2cc8d94)
  - [chore: release 0.5.8](https://github.com/summarizator/fora-frontend/commit/dbb82f0d)
  - [chore: release 0.5.7](https://github.com/summarizator/fora-frontend/commit/a7712fb6)
  - [chore: release 0.5.6](https://github.com/summarizator/fora-frontend/commit/c6b905b6)
  - [untested prod function](https://github.com/summarizator/fora-frontend/commit/254f8fe4)
  - [chore: release 0.5.5](https://github.com/summarizator/fora-frontend/commit/c61eed54)
  - [start concept of dev and prod releases](https://github.com/summarizator/fora-frontend/commit/e288b500)
  - [chore: release 0.5.4](https://github.com/summarizator/fora-frontend/commit/bb2a5ef1)
  - [chore: release 0.5.3](https://github.com/summarizator/fora-frontend/commit/3c1e584e)
  - [chore: release 0.5.2](https://github.com/summarizator/fora-frontend/commit/b79edc4b)
  - [chore: release 0.5.1](https://github.com/summarizator/fora-frontend/commit/8a7be26f)
  - [rm commit message hook](https://github.com/summarizator/fora-frontend/commit/59e2d658)
  - [fix: json writing](https://github.com/summarizator/fora-frontend/commit/eab3c626)
  - [chore: release 0.15.28](https://github.com/summarizator/fora-frontend/commit/200f276c)
  - [chore: release 0.15.27](https://github.com/summarizator/fora-frontend/commit/8c35ce2c)
  - [chore: release 0.15.25](https://github.com/summarizator/fora-frontend/commit/41d91fe7)
  - [chore: release 0.15.24](https://github.com/summarizator/fora-frontend/commit/f8b43f75)
  - [chore: release 0.15.23](https://github.com/summarizator/fora-frontend/commit/2d8850c7)
  - [chore: release 0.15.22](https://github.com/summarizator/fora-frontend/commit/c0970bcc)
  - [chore: release 0.15.21](https://github.com/summarizator/fora-frontend/commit/29d219d0)
  - [chore: release 0.15.20](https://github.com/summarizator/fora-frontend/commit/da361273)
  - [fix: json writing](https://github.com/summarizator/fora-frontend/commit/16c1a997)
  - [chore: release 0.15.19](https://github.com/summarizator/fora-frontend/commit/c06bd710)
  - [chore: release 0.15.18](https://github.com/summarizator/fora-frontend/commit/e8729ef2)
  - [chore: release 0.15.17](https://github.com/summarizator/fora-frontend/commit/9c5889e0)
  - [chore: release 0.15.16](https://github.com/summarizator/fora-frontend/commit/74b14f5b)
  - [chore: release 0.15.15](https://github.com/summarizator/fora-frontend/commit/cfb51171)
  - [chore: release 0.15.14](https://github.com/summarizator/fora-frontend/commit/05185594)
  - [chore: release 0.15.13](https://github.com/summarizator/fora-frontend/commit/b104e115)
  - [chore: release 0.15.12](https://github.com/summarizator/fora-frontend/commit/632914ae)
  - [chore: release 0.15.11](https://github.com/summarizator/fora-frontend/commit/2c5ba71e)
  - [fix: looks like i want it to](https://github.com/summarizator/fora-frontend/commit/ac551328)
  - [chore: release 0.15.9](https://github.com/summarizator/fora-frontend/commit/b4e4b927)
  - [chore: release 0.15.8](https://github.com/summarizator/fora-frontend/commit/8ea004e1)
  - [chore: release 0.15.7](https://github.com/summarizator/fora-frontend/commit/25eea181)
  - [chore: release 0.15.6](https://github.com/summarizator/fora-frontend/commit/c4d8839e)
  - [chore: release 0.15.5](https://github.com/summarizator/fora-frontend/commit/724d618e)
  - [chore: release 0.15.4](https://github.com/summarizator/fora-frontend/commit/fb3ed7e2)
  - [chore: release 0.15.3](https://github.com/summarizator/fora-frontend/commit/de1a6c17)
  - [fix: some more edits](https://github.com/summarizator/fora-frontend/commit/828b63f9)
  - [chore: release 0.15.0](https://github.com/summarizator/fora-frontend/commit/8d1f5e03)
  - [fix: some more edits](https://github.com/summarizator/fora-frontend/commit/421858f9)
  - [fix: some more edits](https://github.com/summarizator/fora-frontend/commit/9a7a0e95)
  - [fix: got it](https://github.com/summarizator/fora-frontend/commit/1251fdb4)
  - [chore: release 0.14.0](https://github.com/summarizator/fora-frontend/commit/de185c95)
  - [chore: release 0.13.0](https://github.com/summarizator/fora-frontend/commit/ed9cf8fd)
  - [chore: release 0.12.0](https://github.com/summarizator/fora-frontend/commit/1b1d868d)
  - [chore: release 0.11.0](https://github.com/summarizator/fora-frontend/commit/0ad82baa)
  - [chore: release 0.10.0](https://github.com/summarizator/fora-frontend/commit/b6e2da3f)
  - [chore: release 0.9.0](https://github.com/summarizator/fora-frontend/commit/37594ba8)
  - [chore: release 0.8.0](https://github.com/summarizator/fora-frontend/commit/60a50f28)
  - [chore: release 0.7.0](https://github.com/summarizator/fora-frontend/commit/dd08fbab)
  - [chore: release 0.6.0](https://github.com/summarizator/fora-frontend/commit/037a9275)
  - [fix: some more readme formatting for dates](https://github.com/summarizator/fora-frontend/commit/f3ea4051)
  - [fix: some more readme formatting](https://github.com/summarizator/fora-frontend/commit/27b0c0be)
  - [fix: maybe fix release flow](https://github.com/summarizator/fora-frontend/commit/8f8fa992)
  - [chore: maybe move pre-push check](https://github.com/summarizator/fora-frontend/commit/396b69c2)
  - [fix: maybe fix branch naming](https://github.com/summarizator/fora-frontend/commit/2ebf827e)
  - [feat: test feature here](https://github.com/summarizator/fora-frontend/commit/9f4ba6ff)
  - [fix: husky hook](https://github.com/summarizator/fora-frontend/commit/09b68c85)
  - [test husky](https://github.com/summarizator/fora-frontend/commit/017494c1)
  - [test husky](https://github.com/summarizator/fora-frontend/commit/2dbd3a41)
  - [chore: release 0.5.3](https://github.com/summarizator/fora-frontend/commit/39be00fb)
  - [chore: release 0.5.2](https://github.com/summarizator/fora-frontend/commit/1b46922f)
  - [start of releaseit](https://github.com/summarizator/fora-frontend/commit/ac2c95bf)
  - [chore: release v0.5.1](https://github.com/summarizator/fora-frontend/commit/ffeb29d4)
  - [build info plugin](https://github.com/summarizator/fora-frontend/commit/7c82d728)

  </details>

### Bug Fixes

- [FORA-1117](https://foraday.atlassian.net/browse/FORA-1117): broken guest user flow
  <details>
    <summary>Commits</summary>

  - [chore: release 0.5.37](https://github.com/summarizator/fora-frontend/commit/8c83d46c)

  </details>

- [FORA-1115](https://foraday.atlassian.net/browse/FORA-1115): Add padding on meeting detail page
  <details>
    <summary>Commits</summary>

  - [](https://github.com/summarizator/fora-frontend/commit/)

  </details>

- [FORA-1114](https://foraday.atlassian.net/browse/FORA-1114): remove duplicate fora lenses
  <details>
    <summary>Commits</summary>

  - [](https://github.com/summarizator/fora-frontend/commit/)

  </details>

## [0.5.59](https://github.com/summarizator/fora-frontend/compare/v0.5.58...v0.5.59) <span style="color: red;">[prod]</span>

> Thu, Jan 23 2025 | 07:30 PM EST

### Features

- [FORA-1077](https://foraday.atlassian.net/browse/FORA-1077): FE: Integrate Release-It to github actions flow
  <details>
    <summary>Commits</summary>

  - [zzzz222](https://github.com/summarizator/fora-frontend/commit/6e2ae365)
  - [zzzz](https://github.com/summarizator/fora-frontend/commit/951ca70a)
  - [chore: update changelog for production release v0.5.47](https://github.com/summarizator/fora-frontend/commit/94dafc05)
  - [chore: release 0.5.47](https://github.com/summarizator/fora-frontend/commit/183339bc)
  - [Merge pull request #1161 from summarizator/dev](https://github.com/summarizator/fora-frontend/commit/69cfcf27)
  - [maybe fix for prod job](https://github.com/summarizator/fora-frontend/commit/8a11074e)
  - [maybe fix for prod job](https://github.com/summarizator/fora-frontend/commit/7464a06c)
  - [chore: update changelog for production release v0.5.45](https://github.com/summarizator/fora-frontend/commit/d263b855)
  - [chore: release 0.5.45](https://github.com/summarizator/fora-frontend/commit/59639faa)
  - [Merge pull request #1159 from summarizator/dev](https://github.com/summarizator/fora-frontend/commit/af095ba7)
  - [Merge pull request #1157 from summarizator/dev](https://github.com/summarizator/fora-frontend/commit/a1b746a8)
  - [Merge pull request #1148 from summarizator/dev](https://github.com/summarizator/fora-frontend/commit/114e049b)
  - [maybe fix for prod job](https://github.com/summarizator/fora-frontend/commit/7f4efa61)
  - [use cache for prod job too](https://github.com/summarizator/fora-frontend/commit/8fb0bc20)
  - [perhaps prod changes 3](https://github.com/summarizator/fora-frontend/commit/5a886e4f)
  - [perhaps prod changes 3](https://github.com/summarizator/fora-frontend/commit/2d166700)
  - [commit 2](https://github.com/summarizator/fora-frontend/commit/f2314527)
  - [commit 1](https://github.com/summarizator/fora-frontend/commit/2c82ec3e)
  - [aaaaanotherz](https://github.com/summarizator/fora-frontend/commit/a612e1e5)
  - [chore: release 0.5.39](https://github.com/summarizator/fora-frontend/commit/6c21fbb5)
  - [chore: release 0.5.36](https://github.com/summarizator/fora-frontend/commit/c46d914f)
  - [](https://github.com/summarizator/fora-frontend/commit/)
  - [](https://github.com/summarizator/fora-frontend/commit/)
  - [](https://github.com/summarizator/fora-frontend/commit/)
  - [chore: release 0.5.27](https://github.com/summarizator/fora-frontend/commit/5879296f)
  - [logz](https://github.com/summarizator/fora-frontend/commit/780e7fa6)
  - [logz](https://github.com/summarizator/fora-frontend/commit/625aee98)
  - [chore: release 0.5.26](https://github.com/summarizator/fora-frontend/commit/0a936731)
  - [chore: release 0.5.25](https://github.com/summarizator/fora-frontend/commit/3f677031)
  - [chore: release 0.5.24](https://github.com/summarizator/fora-frontend/commit/3aa63c2c)
  - [chore: release 0.5.23](https://github.com/summarizator/fora-frontend/commit/e31e8d5f)
  - [chore: release 0.5.18](https://github.com/summarizator/fora-frontend/commit/56f9d7ec)
  - [chore: release 0.5.17](https://github.com/summarizator/fora-frontend/commit/2bec2ac9)
  - [chore: release 0.5.16](https://github.com/summarizator/fora-frontend/commit/1ce7c9e9)
  - [cool new readme](https://github.com/summarizator/fora-frontend/commit/bba4c6ed)

  </details>

- [FORA-878](https://foraday.atlassian.net/browse/FORA-878): Allow category change on recent page
  <details>
    <summary>Commits</summary>

  - [](https://github.com/summarizator/fora-frontend/commit/)

  </details>

- [FORA-1085](https://foraday.atlassian.net/browse/FORA-1085): Create Summary modal
  <details>
    <summary>Commits</summary>

  - [](https://github.com/summarizator/fora-frontend/commit/)

  </details>

- [FORA-1066](https://foraday.atlassian.net/browse/FORA-1066): SPIKE - Okta Integration
  <details>
    <summary>Commits</summary>

  - [](https://github.com/summarizator/fora-frontend/commit/)

  </details>

- [FORA-840](https://foraday.atlassian.net/browse/FORA-840): Integrate Release-It to FE Repo
  <details>
    <summary>Commits</summary>

  - [chore: release 0.5.14](https://github.com/summarizator/fora-frontend/commit/88fee98e)
  - [chore: release 0.5.13](https://github.com/summarizator/fora-frontend/commit/f11b546c)
  - [chore: release 0.5.12](https://github.com/summarizator/fora-frontend/commit/9dc77c8a)
  - [chore: release 0.5.11](https://github.com/summarizator/fora-frontend/commit/10c35a54)
  - [chore: release 0.5.10](https://github.com/summarizator/fora-frontend/commit/8ee45320)
  - [chore: release 0.5.9](https://github.com/summarizator/fora-frontend/commit/b2ae433b)
  - [chore: release 0.5.8](https://github.com/summarizator/fora-frontend/commit/ceed34d9)
  - [chore: release 0.5.7](https://github.com/summarizator/fora-frontend/commit/53d84d35)
  - [chore: release 0.5.6](https://github.com/summarizator/fora-frontend/commit/0d250ed2)
  - [chore: release 0.5.5](https://github.com/summarizator/fora-frontend/commit/bf541008)
  - [chore: release 0.5.4](https://github.com/summarizator/fora-frontend/commit/9c37c293)
  - [chore: release 0.5.3](https://github.com/summarizator/fora-frontend/commit/f7d4bfe8)
  - [chore: release 0.5.2](https://github.com/summarizator/fora-frontend/commit/bf4a84db)
  - [chore: release 0.5.1](https://github.com/summarizator/fora-frontend/commit/aadf74d3)
  - [chore: release 0.5.2](https://github.com/summarizator/fora-frontend/commit/6b514330)
  - [chore: release 0.6.11](https://github.com/summarizator/fora-frontend/commit/ece60a67)
  - [chore: release 0.6.10](https://github.com/summarizator/fora-frontend/commit/2de1bedb)
  - [chore: release 0.6.9](https://github.com/summarizator/fora-frontend/commit/53b8f5ca)
  - [chore: release 0.6.8](https://github.com/summarizator/fora-frontend/commit/7798ad1d)
  - [chore: release 0.6.7](https://github.com/summarizator/fora-frontend/commit/f886470d)
  - [chore: release 0.6.6](https://github.com/summarizator/fora-frontend/commit/330eb03c)
  - [chore: release 0.6.5](https://github.com/summarizator/fora-frontend/commit/6787b64c)
  - [chore: release 0.6.4](https://github.com/summarizator/fora-frontend/commit/5a0fa3e6)
  - [chore: release 0.6.3](https://github.com/summarizator/fora-frontend/commit/6f8abded)
  - [Merge branch 'dev' into FORA-840](https://github.com/summarizator/fora-frontend/commit/c6bb1a7a)
  - [chore: release 0.6.1](https://github.com/summarizator/fora-frontend/commit/a9f1d7e6)
  - [chore: release 0.6.0](https://github.com/summarizator/fora-frontend/commit/6d5b7351)
  - [Merge branch 'dev' of github.com:summarizator/fora-frontend into FORA-840](https://github.com/summarizator/fora-frontend/commit/06ad38b4)
  - [try to kill all warnings](https://github.com/summarizator/fora-frontend/commit/7b1f20bb)
  - [add linting to pre-push](https://github.com/summarizator/fora-frontend/commit/0763edf0)
  - [add linting to pre-push](https://github.com/summarizator/fora-frontend/commit/963ff2f0)
  - [fix lint](https://github.com/summarizator/fora-frontend/commit/a8d262df)
  - [test](https://github.com/summarizator/fora-frontend/commit/e3f4e99b)
  - [clean](https://github.com/summarizator/fora-frontend/commit/fcedb650)
  - [fixes](https://github.com/summarizator/fora-frontend/commit/9d05113a)
  - [chore: release 0.5.15](https://github.com/summarizator/fora-frontend/commit/989f6fa9)
  - [chore: release 0.5.14](https://github.com/summarizator/fora-frontend/commit/42ad3861)
  - [Merge branch 'dev' into FORA-840](https://github.com/summarizator/fora-frontend/commit/df1530e1)
  - [chore: release 0.5.13](https://github.com/summarizator/fora-frontend/commit/10932202)
  - [chore: release 0.5.12](https://github.com/summarizator/fora-frontend/commit/92dcd324)
  - [fixes](https://github.com/summarizator/fora-frontend/commit/b27af8e0)
  - [build stuff](https://github.com/summarizator/fora-frontend/commit/3c72984b)
  - [think its working](https://github.com/summarizator/fora-frontend/commit/85c70b83)
  - [think its working](https://github.com/summarizator/fora-frontend/commit/3bbd19d3)
  - [Merge branch 'dev' into FORA-840](https://github.com/summarizator/fora-frontend/commit/601022d4)
  - [think its working](https://github.com/summarizator/fora-frontend/commit/70f85e94)
  - [chore: release 0.5.11](https://github.com/summarizator/fora-frontend/commit/f231b109)
  - [chore: release 0.5.10](https://github.com/summarizator/fora-frontend/commit/2b3663f4)
  - [chore: release 0.5.9](https://github.com/summarizator/fora-frontend/commit/b2cc8d94)
  - [chore: release 0.5.8](https://github.com/summarizator/fora-frontend/commit/dbb82f0d)
  - [chore: release 0.5.7](https://github.com/summarizator/fora-frontend/commit/a7712fb6)
  - [chore: release 0.5.6](https://github.com/summarizator/fora-frontend/commit/c6b905b6)
  - [untested prod function](https://github.com/summarizator/fora-frontend/commit/254f8fe4)
  - [chore: release 0.5.5](https://github.com/summarizator/fora-frontend/commit/c61eed54)
  - [start concept of dev and prod releases](https://github.com/summarizator/fora-frontend/commit/e288b500)
  - [chore: release 0.5.4](https://github.com/summarizator/fora-frontend/commit/bb2a5ef1)
  - [chore: release 0.5.3](https://github.com/summarizator/fora-frontend/commit/3c1e584e)
  - [chore: release 0.5.2](https://github.com/summarizator/fora-frontend/commit/b79edc4b)
  - [chore: release 0.5.1](https://github.com/summarizator/fora-frontend/commit/8a7be26f)
  - [rm commit message hook](https://github.com/summarizator/fora-frontend/commit/59e2d658)
  - [fix: json writing](https://github.com/summarizator/fora-frontend/commit/eab3c626)
  - [chore: release 0.15.28](https://github.com/summarizator/fora-frontend/commit/200f276c)
  - [chore: release 0.15.27](https://github.com/summarizator/fora-frontend/commit/8c35ce2c)
  - [chore: release 0.15.25](https://github.com/summarizator/fora-frontend/commit/41d91fe7)
  - [chore: release 0.15.24](https://github.com/summarizator/fora-frontend/commit/f8b43f75)
  - [chore: release 0.15.23](https://github.com/summarizator/fora-frontend/commit/2d8850c7)
  - [chore: release 0.15.22](https://github.com/summarizator/fora-frontend/commit/c0970bcc)
  - [chore: release 0.15.21](https://github.com/summarizator/fora-frontend/commit/29d219d0)
  - [chore: release 0.15.20](https://github.com/summarizator/fora-frontend/commit/da361273)
  - [fix: json writing](https://github.com/summarizator/fora-frontend/commit/16c1a997)
  - [chore: release 0.15.19](https://github.com/summarizator/fora-frontend/commit/c06bd710)
  - [chore: release 0.15.18](https://github.com/summarizator/fora-frontend/commit/e8729ef2)
  - [chore: release 0.15.17](https://github.com/summarizator/fora-frontend/commit/9c5889e0)
  - [chore: release 0.15.16](https://github.com/summarizator/fora-frontend/commit/74b14f5b)
  - [chore: release 0.15.15](https://github.com/summarizator/fora-frontend/commit/cfb51171)
  - [chore: release 0.15.14](https://github.com/summarizator/fora-frontend/commit/05185594)
  - [chore: release 0.15.13](https://github.com/summarizator/fora-frontend/commit/b104e115)
  - [chore: release 0.15.12](https://github.com/summarizator/fora-frontend/commit/632914ae)
  - [chore: release 0.15.11](https://github.com/summarizator/fora-frontend/commit/2c5ba71e)
  - [fix: looks like i want it to](https://github.com/summarizator/fora-frontend/commit/ac551328)
  - [chore: release 0.15.9](https://github.com/summarizator/fora-frontend/commit/b4e4b927)
  - [chore: release 0.15.8](https://github.com/summarizator/fora-frontend/commit/8ea004e1)
  - [chore: release 0.15.7](https://github.com/summarizator/fora-frontend/commit/25eea181)
  - [chore: release 0.15.6](https://github.com/summarizator/fora-frontend/commit/c4d8839e)
  - [chore: release 0.15.5](https://github.com/summarizator/fora-frontend/commit/724d618e)
  - [chore: release 0.15.4](https://github.com/summarizator/fora-frontend/commit/fb3ed7e2)
  - [chore: release 0.15.3](https://github.com/summarizator/fora-frontend/commit/de1a6c17)
  - [fix: some more edits](https://github.com/summarizator/fora-frontend/commit/828b63f9)
  - [chore: release 0.15.0](https://github.com/summarizator/fora-frontend/commit/8d1f5e03)
  - [fix: some more edits](https://github.com/summarizator/fora-frontend/commit/421858f9)
  - [fix: some more edits](https://github.com/summarizator/fora-frontend/commit/9a7a0e95)
  - [fix: got it](https://github.com/summarizator/fora-frontend/commit/1251fdb4)
  - [chore: release 0.14.0](https://github.com/summarizator/fora-frontend/commit/de185c95)
  - [chore: release 0.13.0](https://github.com/summarizator/fora-frontend/commit/ed9cf8fd)
  - [chore: release 0.12.0](https://github.com/summarizator/fora-frontend/commit/1b1d868d)
  - [chore: release 0.11.0](https://github.com/summarizator/fora-frontend/commit/0ad82baa)
  - [chore: release 0.10.0](https://github.com/summarizator/fora-frontend/commit/b6e2da3f)
  - [chore: release 0.9.0](https://github.com/summarizator/fora-frontend/commit/37594ba8)
  - [chore: release 0.8.0](https://github.com/summarizator/fora-frontend/commit/60a50f28)
  - [chore: release 0.7.0](https://github.com/summarizator/fora-frontend/commit/dd08fbab)
  - [chore: release 0.6.0](https://github.com/summarizator/fora-frontend/commit/037a9275)
  - [fix: some more readme formatting for dates](https://github.com/summarizator/fora-frontend/commit/f3ea4051)
  - [fix: some more readme formatting](https://github.com/summarizator/fora-frontend/commit/27b0c0be)
  - [fix: maybe fix release flow](https://github.com/summarizator/fora-frontend/commit/8f8fa992)
  - [chore: maybe move pre-push check](https://github.com/summarizator/fora-frontend/commit/396b69c2)
  - [fix: maybe fix branch naming](https://github.com/summarizator/fora-frontend/commit/2ebf827e)
  - [feat: test feature here](https://github.com/summarizator/fora-frontend/commit/9f4ba6ff)
  - [fix: husky hook](https://github.com/summarizator/fora-frontend/commit/09b68c85)
  - [test husky](https://github.com/summarizator/fora-frontend/commit/017494c1)
  - [test husky](https://github.com/summarizator/fora-frontend/commit/2dbd3a41)
  - [chore: release 0.5.3](https://github.com/summarizator/fora-frontend/commit/39be00fb)
  - [chore: release 0.5.2](https://github.com/summarizator/fora-frontend/commit/1b46922f)
  - [start of releaseit](https://github.com/summarizator/fora-frontend/commit/ac2c95bf)
  - [chore: release v0.5.1](https://github.com/summarizator/fora-frontend/commit/ffeb29d4)
  - [build info plugin](https://github.com/summarizator/fora-frontend/commit/7c82d728)

  </details>

### Bug Fixes

- [FORA-1117](https://foraday.atlassian.net/browse/FORA-1117): broken guest user flow
  <details>
    <summary>Commits</summary>

  - [chore: release 0.5.37](https://github.com/summarizator/fora-frontend/commit/8c83d46c)

  </details>

- [FORA-1115](https://foraday.atlassian.net/browse/FORA-1115): Add padding on meeting detail page
  <details>
    <summary>Commits</summary>

  - [](https://github.com/summarizator/fora-frontend/commit/)

  </details>

- [FORA-1114](https://foraday.atlassian.net/browse/FORA-1114): remove duplicate fora lenses
  <details>
    <summary>Commits</summary>

  - [](https://github.com/summarizator/fora-frontend/commit/)

  </details>

## [0.5.58](https://github.com/summarizator/fora-frontend/compare/v0.5.57...v0.5.58) <span style="color: red;">[prod]</span>

> Thu, Jan 23 2025 | 07:28 PM EST

### Features

- [FORA-1077](https://foraday.atlassian.net/browse/FORA-1077): FE: Integrate Release-It to github actions flow
  <details>
    <summary>Commits</summary>

  - [zzzz222](https://github.com/summarizator/fora-frontend/commit/6e2ae365)
  - [zzzz](https://github.com/summarizator/fora-frontend/commit/951ca70a)
  - [chore: update changelog for production release v0.5.47](https://github.com/summarizator/fora-frontend/commit/94dafc05)
  - [chore: release 0.5.47](https://github.com/summarizator/fora-frontend/commit/183339bc)
  - [Merge pull request #1161 from summarizator/dev](https://github.com/summarizator/fora-frontend/commit/69cfcf27)
  - [maybe fix for prod job](https://github.com/summarizator/fora-frontend/commit/8a11074e)
  - [maybe fix for prod job](https://github.com/summarizator/fora-frontend/commit/7464a06c)
  - [chore: update changelog for production release v0.5.45](https://github.com/summarizator/fora-frontend/commit/d263b855)
  - [chore: release 0.5.45](https://github.com/summarizator/fora-frontend/commit/59639faa)
  - [Merge pull request #1159 from summarizator/dev](https://github.com/summarizator/fora-frontend/commit/af095ba7)
  - [Merge pull request #1157 from summarizator/dev](https://github.com/summarizator/fora-frontend/commit/a1b746a8)
  - [Merge pull request #1148 from summarizator/dev](https://github.com/summarizator/fora-frontend/commit/114e049b)
  - [maybe fix for prod job](https://github.com/summarizator/fora-frontend/commit/7f4efa61)
  - [use cache for prod job too](https://github.com/summarizator/fora-frontend/commit/8fb0bc20)
  - [perhaps prod changes 3](https://github.com/summarizator/fora-frontend/commit/5a886e4f)
  - [perhaps prod changes 3](https://github.com/summarizator/fora-frontend/commit/2d166700)
  - [commit 2](https://github.com/summarizator/fora-frontend/commit/f2314527)
  - [commit 1](https://github.com/summarizator/fora-frontend/commit/2c82ec3e)
  - [aaaaanotherz](https://github.com/summarizator/fora-frontend/commit/a612e1e5)
  - [chore: release 0.5.39](https://github.com/summarizator/fora-frontend/commit/6c21fbb5)
  - [chore: release 0.5.36](https://github.com/summarizator/fora-frontend/commit/c46d914f)
  - [](https://github.com/summarizator/fora-frontend/commit/)
  - [](https://github.com/summarizator/fora-frontend/commit/)
  - [](https://github.com/summarizator/fora-frontend/commit/)
  - [chore: release 0.5.27](https://github.com/summarizator/fora-frontend/commit/5879296f)
  - [logz](https://github.com/summarizator/fora-frontend/commit/780e7fa6)
  - [logz](https://github.com/summarizator/fora-frontend/commit/625aee98)
  - [chore: release 0.5.26](https://github.com/summarizator/fora-frontend/commit/0a936731)
  - [chore: release 0.5.25](https://github.com/summarizator/fora-frontend/commit/3f677031)
  - [chore: release 0.5.24](https://github.com/summarizator/fora-frontend/commit/3aa63c2c)
  - [chore: release 0.5.23](https://github.com/summarizator/fora-frontend/commit/e31e8d5f)
  - [chore: release 0.5.18](https://github.com/summarizator/fora-frontend/commit/56f9d7ec)
  - [chore: release 0.5.17](https://github.com/summarizator/fora-frontend/commit/2bec2ac9)
  - [chore: release 0.5.16](https://github.com/summarizator/fora-frontend/commit/1ce7c9e9)
  - [cool new readme](https://github.com/summarizator/fora-frontend/commit/bba4c6ed)

  </details>

- [FORA-878](https://foraday.atlassian.net/browse/FORA-878): Allow category change on recent page
  <details>
    <summary>Commits</summary>

  - [](https://github.com/summarizator/fora-frontend/commit/)

  </details>

- [FORA-1085](https://foraday.atlassian.net/browse/FORA-1085): Create Summary modal
  <details>
    <summary>Commits</summary>

  - [](https://github.com/summarizator/fora-frontend/commit/)

  </details>

- [FORA-1066](https://foraday.atlassian.net/browse/FORA-1066): SPIKE - Okta Integration
  <details>
    <summary>Commits</summary>

  - [](https://github.com/summarizator/fora-frontend/commit/)

  </details>

- [FORA-840](https://foraday.atlassian.net/browse/FORA-840): Integrate Release-It to FE Repo
  <details>
    <summary>Commits</summary>

  - [chore: release 0.5.14](https://github.com/summarizator/fora-frontend/commit/88fee98e)
  - [chore: release 0.5.13](https://github.com/summarizator/fora-frontend/commit/f11b546c)
  - [chore: release 0.5.12](https://github.com/summarizator/fora-frontend/commit/9dc77c8a)
  - [chore: release 0.5.11](https://github.com/summarizator/fora-frontend/commit/10c35a54)
  - [chore: release 0.5.10](https://github.com/summarizator/fora-frontend/commit/8ee45320)
  - [chore: release 0.5.9](https://github.com/summarizator/fora-frontend/commit/b2ae433b)
  - [chore: release 0.5.8](https://github.com/summarizator/fora-frontend/commit/ceed34d9)
  - [chore: release 0.5.7](https://github.com/summarizator/fora-frontend/commit/53d84d35)
  - [chore: release 0.5.6](https://github.com/summarizator/fora-frontend/commit/0d250ed2)
  - [chore: release 0.5.5](https://github.com/summarizator/fora-frontend/commit/bf541008)
  - [chore: release 0.5.4](https://github.com/summarizator/fora-frontend/commit/9c37c293)
  - [chore: release 0.5.3](https://github.com/summarizator/fora-frontend/commit/f7d4bfe8)
  - [chore: release 0.5.2](https://github.com/summarizator/fora-frontend/commit/bf4a84db)
  - [chore: release 0.5.1](https://github.com/summarizator/fora-frontend/commit/aadf74d3)
  - [chore: release 0.5.2](https://github.com/summarizator/fora-frontend/commit/6b514330)
  - [chore: release 0.6.11](https://github.com/summarizator/fora-frontend/commit/ece60a67)
  - [chore: release 0.6.10](https://github.com/summarizator/fora-frontend/commit/2de1bedb)
  - [chore: release 0.6.9](https://github.com/summarizator/fora-frontend/commit/53b8f5ca)
  - [chore: release 0.6.8](https://github.com/summarizator/fora-frontend/commit/7798ad1d)
  - [chore: release 0.6.7](https://github.com/summarizator/fora-frontend/commit/f886470d)
  - [chore: release 0.6.6](https://github.com/summarizator/fora-frontend/commit/330eb03c)
  - [chore: release 0.6.5](https://github.com/summarizator/fora-frontend/commit/6787b64c)
  - [chore: release 0.6.4](https://github.com/summarizator/fora-frontend/commit/5a0fa3e6)
  - [chore: release 0.6.3](https://github.com/summarizator/fora-frontend/commit/6f8abded)
  - [Merge branch 'dev' into FORA-840](https://github.com/summarizator/fora-frontend/commit/c6bb1a7a)
  - [chore: release 0.6.1](https://github.com/summarizator/fora-frontend/commit/a9f1d7e6)
  - [chore: release 0.6.0](https://github.com/summarizator/fora-frontend/commit/6d5b7351)
  - [Merge branch 'dev' of github.com:summarizator/fora-frontend into FORA-840](https://github.com/summarizator/fora-frontend/commit/06ad38b4)
  - [try to kill all warnings](https://github.com/summarizator/fora-frontend/commit/7b1f20bb)
  - [add linting to pre-push](https://github.com/summarizator/fora-frontend/commit/0763edf0)
  - [add linting to pre-push](https://github.com/summarizator/fora-frontend/commit/963ff2f0)
  - [fix lint](https://github.com/summarizator/fora-frontend/commit/a8d262df)
  - [test](https://github.com/summarizator/fora-frontend/commit/e3f4e99b)
  - [clean](https://github.com/summarizator/fora-frontend/commit/fcedb650)
  - [fixes](https://github.com/summarizator/fora-frontend/commit/9d05113a)
  - [chore: release 0.5.15](https://github.com/summarizator/fora-frontend/commit/989f6fa9)
  - [chore: release 0.5.14](https://github.com/summarizator/fora-frontend/commit/42ad3861)
  - [Merge branch 'dev' into FORA-840](https://github.com/summarizator/fora-frontend/commit/df1530e1)
  - [chore: release 0.5.13](https://github.com/summarizator/fora-frontend/commit/10932202)
  - [chore: release 0.5.12](https://github.com/summarizator/fora-frontend/commit/92dcd324)
  - [fixes](https://github.com/summarizator/fora-frontend/commit/b27af8e0)
  - [build stuff](https://github.com/summarizator/fora-frontend/commit/3c72984b)
  - [think its working](https://github.com/summarizator/fora-frontend/commit/85c70b83)
  - [think its working](https://github.com/summarizator/fora-frontend/commit/3bbd19d3)
  - [Merge branch 'dev' into FORA-840](https://github.com/summarizator/fora-frontend/commit/601022d4)
  - [think its working](https://github.com/summarizator/fora-frontend/commit/70f85e94)
  - [chore: release 0.5.11](https://github.com/summarizator/fora-frontend/commit/f231b109)
  - [chore: release 0.5.10](https://github.com/summarizator/fora-frontend/commit/2b3663f4)
  - [chore: release 0.5.9](https://github.com/summarizator/fora-frontend/commit/b2cc8d94)
  - [chore: release 0.5.8](https://github.com/summarizator/fora-frontend/commit/dbb82f0d)
  - [chore: release 0.5.7](https://github.com/summarizator/fora-frontend/commit/a7712fb6)
  - [chore: release 0.5.6](https://github.com/summarizator/fora-frontend/commit/c6b905b6)
  - [untested prod function](https://github.com/summarizator/fora-frontend/commit/254f8fe4)
  - [chore: release 0.5.5](https://github.com/summarizator/fora-frontend/commit/c61eed54)
  - [start concept of dev and prod releases](https://github.com/summarizator/fora-frontend/commit/e288b500)
  - [chore: release 0.5.4](https://github.com/summarizator/fora-frontend/commit/bb2a5ef1)
  - [chore: release 0.5.3](https://github.com/summarizator/fora-frontend/commit/3c1e584e)
  - [chore: release 0.5.2](https://github.com/summarizator/fora-frontend/commit/b79edc4b)
  - [chore: release 0.5.1](https://github.com/summarizator/fora-frontend/commit/8a7be26f)
  - [rm commit message hook](https://github.com/summarizator/fora-frontend/commit/59e2d658)
  - [fix: json writing](https://github.com/summarizator/fora-frontend/commit/eab3c626)
  - [chore: release 0.15.28](https://github.com/summarizator/fora-frontend/commit/200f276c)
  - [chore: release 0.15.27](https://github.com/summarizator/fora-frontend/commit/8c35ce2c)
  - [chore: release 0.15.25](https://github.com/summarizator/fora-frontend/commit/41d91fe7)
  - [chore: release 0.15.24](https://github.com/summarizator/fora-frontend/commit/f8b43f75)
  - [chore: release 0.15.23](https://github.com/summarizator/fora-frontend/commit/2d8850c7)
  - [chore: release 0.15.22](https://github.com/summarizator/fora-frontend/commit/c0970bcc)
  - [chore: release 0.15.21](https://github.com/summarizator/fora-frontend/commit/29d219d0)
  - [chore: release 0.15.20](https://github.com/summarizator/fora-frontend/commit/da361273)
  - [fix: json writing](https://github.com/summarizator/fora-frontend/commit/16c1a997)
  - [chore: release 0.15.19](https://github.com/summarizator/fora-frontend/commit/c06bd710)
  - [chore: release 0.15.18](https://github.com/summarizator/fora-frontend/commit/e8729ef2)
  - [chore: release 0.15.17](https://github.com/summarizator/fora-frontend/commit/9c5889e0)
  - [chore: release 0.15.16](https://github.com/summarizator/fora-frontend/commit/74b14f5b)
  - [chore: release 0.15.15](https://github.com/summarizator/fora-frontend/commit/cfb51171)
  - [chore: release 0.15.14](https://github.com/summarizator/fora-frontend/commit/05185594)
  - [chore: release 0.15.13](https://github.com/summarizator/fora-frontend/commit/b104e115)
  - [chore: release 0.15.12](https://github.com/summarizator/fora-frontend/commit/632914ae)
  - [chore: release 0.15.11](https://github.com/summarizator/fora-frontend/commit/2c5ba71e)
  - [fix: looks like i want it to](https://github.com/summarizator/fora-frontend/commit/ac551328)
  - [chore: release 0.15.9](https://github.com/summarizator/fora-frontend/commit/b4e4b927)
  - [chore: release 0.15.8](https://github.com/summarizator/fora-frontend/commit/8ea004e1)
  - [chore: release 0.15.7](https://github.com/summarizator/fora-frontend/commit/25eea181)
  - [chore: release 0.15.6](https://github.com/summarizator/fora-frontend/commit/c4d8839e)
  - [chore: release 0.15.5](https://github.com/summarizator/fora-frontend/commit/724d618e)
  - [chore: release 0.15.4](https://github.com/summarizator/fora-frontend/commit/fb3ed7e2)
  - [chore: release 0.15.3](https://github.com/summarizator/fora-frontend/commit/de1a6c17)
  - [fix: some more edits](https://github.com/summarizator/fora-frontend/commit/828b63f9)
  - [chore: release 0.15.0](https://github.com/summarizator/fora-frontend/commit/8d1f5e03)
  - [fix: some more edits](https://github.com/summarizator/fora-frontend/commit/421858f9)
  - [fix: some more edits](https://github.com/summarizator/fora-frontend/commit/9a7a0e95)
  - [fix: got it](https://github.com/summarizator/fora-frontend/commit/1251fdb4)
  - [chore: release 0.14.0](https://github.com/summarizator/fora-frontend/commit/de185c95)
  - [chore: release 0.13.0](https://github.com/summarizator/fora-frontend/commit/ed9cf8fd)
  - [chore: release 0.12.0](https://github.com/summarizator/fora-frontend/commit/1b1d868d)
  - [chore: release 0.11.0](https://github.com/summarizator/fora-frontend/commit/0ad82baa)
  - [chore: release 0.10.0](https://github.com/summarizator/fora-frontend/commit/b6e2da3f)
  - [chore: release 0.9.0](https://github.com/summarizator/fora-frontend/commit/37594ba8)
  - [chore: release 0.8.0](https://github.com/summarizator/fora-frontend/commit/60a50f28)
  - [chore: release 0.7.0](https://github.com/summarizator/fora-frontend/commit/dd08fbab)
  - [chore: release 0.6.0](https://github.com/summarizator/fora-frontend/commit/037a9275)
  - [fix: some more readme formatting for dates](https://github.com/summarizator/fora-frontend/commit/f3ea4051)
  - [fix: some more readme formatting](https://github.com/summarizator/fora-frontend/commit/27b0c0be)
  - [fix: maybe fix release flow](https://github.com/summarizator/fora-frontend/commit/8f8fa992)
  - [chore: maybe move pre-push check](https://github.com/summarizator/fora-frontend/commit/396b69c2)
  - [fix: maybe fix branch naming](https://github.com/summarizator/fora-frontend/commit/2ebf827e)
  - [feat: test feature here](https://github.com/summarizator/fora-frontend/commit/9f4ba6ff)
  - [fix: husky hook](https://github.com/summarizator/fora-frontend/commit/09b68c85)
  - [test husky](https://github.com/summarizator/fora-frontend/commit/017494c1)
  - [test husky](https://github.com/summarizator/fora-frontend/commit/2dbd3a41)
  - [chore: release 0.5.3](https://github.com/summarizator/fora-frontend/commit/39be00fb)
  - [chore: release 0.5.2](https://github.com/summarizator/fora-frontend/commit/1b46922f)
  - [start of releaseit](https://github.com/summarizator/fora-frontend/commit/ac2c95bf)
  - [chore: release v0.5.1](https://github.com/summarizator/fora-frontend/commit/ffeb29d4)
  - [build info plugin](https://github.com/summarizator/fora-frontend/commit/7c82d728)

  </details>

### Bug Fixes

- [FORA-1117](https://foraday.atlassian.net/browse/FORA-1117): broken guest user flow
  <details>
    <summary>Commits</summary>

  - [chore: release 0.5.37](https://github.com/summarizator/fora-frontend/commit/8c83d46c)

  </details>

- [FORA-1115](https://foraday.atlassian.net/browse/FORA-1115): Add padding on meeting detail page
  <details>
    <summary>Commits</summary>

  - [](https://github.com/summarizator/fora-frontend/commit/)

  </details>

- [FORA-1114](https://foraday.atlassian.net/browse/FORA-1114): remove duplicate fora lenses
  <details>
    <summary>Commits</summary>

  - [](https://github.com/summarizator/fora-frontend/commit/)

  </details>
