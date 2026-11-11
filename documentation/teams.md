# Microsoft Teams Fora Integration

## Key Links

- [Teamwork and Communication API Docs](https://learn.microsoft.com/en-us/graph/api/resources/teams-api-overview?view=graph-rest-1.0)
- [Azure Portal Login](https://portal.azure.com/#home)
  - For Fora app configuration/permissioning stuff, go to `Microsoft Entra ID`
    - There you will see the configuration for us as an organization
    - To see the Fora app configuration, go to `App Registrations` and select Fora (under `All Applications` if you can't see it)
      - Permissions exist under `API Permissions`
      - FE Authentication Flow is configured in `Authentication`
- [Get Access Without a User](https://learn.microsoft.com/en-us/graph/auth-v2-service?tabs=http)
- [Daemon Application](https://learn.microsoft.com/en-us/azure/active-directory/develop/scenario-daemon-overview)
- [SPA](https://learn.microsoft.com/en-us/azure/active-directory/develop/scenario-spa-overview)
- MSAL
  - [React Microsoft Authentication Library](https://learn.microsoft.com/en-us/azure/active-directory/develop/quickstart-single-page-app-react-sign-in)
  - [Type Documentation](https://azuread.github.io/microsoft-authentication-library-for-js/ref/modules/_azure_msal_react.html)

## Overview

Fora allows users to create digests of, or scheduled summaries, of Microsoft Teams chats. Microsoft Teams is structured into higher level "Teams", like "Engineering", "Sales", "Product", etc., with additional "Channels" underneath those categories. Channels are tied explicitly to Teams and do not exist on their own.

Example:

- Sales (Team)
  - Northeast Sales (Channel)
  - Southeast Sales (Channel)
  - Pipelines (Channel)
- Engineering (Team)
  - Integrations (Channel)
  - Frontend (Channel)
  - Developer Operations (Channel)

#### There are 3 types of Teams

- _Private_: People need permission to join
- _Public_: Anyone in the org CAN join
- _Org-Wide_: Everyone in your organization automatically joins

#### There are 3 types of channels

- _Standard_: This is a regular public channel
- _Private_: A channel under a team that is limited to specific users added by the owner of that channel
- _Shared_: A public channel under a team that can be shared with people from your organization or other orgs
  - Example: a channel shared with people from an external client

Users in a team have access to all public and shared channels, and any private channels that they have been included as a member of. Users of the Fora application will not be able to generate summaries from private channels that they are not members of.

## Digests

When creating a Teams Digest, users can either select a full team which means we will summarize any current and future Channels that exist under that team, or they can select individual Channels under that team and we will only summarize those. We store this in the Fora Channel model as such:

```json
{
  "id": "string",
  "name": "string",
  "initiative": {
    "id": "string",
    "title": "string"
  },
  // ...additionalChannelAttributes,
  "identifiers": [
    "6b2b5324-a2e1-430f-a070-413251547775", // Engineering Team ID,
    "92a02d9e-167d-4a9f-8e26-f52ad7069ad5" // Sales Team ID
  ],
  "metadata": {
    "channels": {
      "6b2b5324-a2e1-430f-a070-413251547775": [
        // Engineering Team ID - has individual channels selected, so list here
        "19:ddd8963972a645ab8031a2fa914954a2@thread.tacv2", // Integrations Channel ID
        "19:PgwJPJAATLXhfsVM1cVHJsVsxqhNY3b2cjPSwPKTIow1@thread.tacv2", // Frontend Channel ID
        "19:7d7d72110a1d45cbaccea5ac73ef8bca@thread.tacv2" // Developer Operations Channel ID
      ]
      // Sales Team has all Channels selected, so no specific Channels configured here
    }
  }
}
```

## Microsoft API Authentication and Permissioning

All the frontend has to handle is running the adminconsent flow for microsoft tenant admins and then storing the microsoft tenant id as the tenant.teams_config.accessToken. From there we can get Teams resources from the Fora API with the X-Fora-Tenant header.

### Fora Tenant Level: Application-Level Permissions

**Key Links**

- [MS Docs: Get Access Without a User](https://learn.microsoft.com/en-us/graph/auth-v2-service?tabs=http)
- [MS Docs: Daemon Application](https://learn.microsoft.com/en-us/azure/active-directory/develop/scenario-daemon-overview)
- [MS Docs: Authorize as Admin](https://learn.microsoft.com/en-us/graph/auth-v2-service?tabs=http)

#### Onboarding:

1. Fora User's Microsoft Admin navigates to the Data Sources Page
2. Fora User's Microsoft Admin chooses the Teams Data Source
3. Fora User's Microsoft Admin is taken to Microsoft Admin Consent Page
4. On that page the Microsoft Admin must log in to their admin account to consent to the permissions our app needs to access Teams
5. On redirect, the id of the Microsoft tenant they authenticated with is provided to us
6. We save that microsoft tenant id to their `ForaTenant.teams_config`

This authentication must be done by a user's Microsoft tenant Admin, e.g. a CEOs IT Administrator. This permissioning is required for us to perform background operations (like generating digests) without requiring any specific user. This gives our serverless functions access to the Microsoft Graph API on behalf of any tenant or user combo. We cannot perform any operations at this level from the Fora frontend.

When a Fora Tenant Admin authenticates with us, the ID of the Microsoft Tenant is given to us and we store it under `ForaTenant.teams_config.access_token` (stored as `access_token`, but it's actually not). We then use that Microsoft Tenant ID to get an actual `access_token` prior to performing digests from the serverless function.

#### Permissions

- `Channel.ReadBasic.All`: Read the names and descriptions of all channels
- `ChannelMessage.Read.All`: Read all channel messages
- `Group.Read.All`: Read all groups
- `Team.ReadBasic.All`: Get a list of all teams
- `TeamMember.Read.All`: Read the members of all teams
- `Teamwork.Migrate.All`: Create chat and channel messages with anyone's identity and with any timestamp

### Fora Frontend Microsoft Integration

#### Admin Authentication

We use the Frontend to allow both Fora users and their Admins to authenticate with Microsoft. Under the data-sources page, if the user has `type: 'Admin'` in Fora DB, they will be able to connect with Teams at the tenant level. This will redirect them to the Microsoft Admin Consent screen where they will sign in to the Microsoft Tenant Admin account and authenticate our application with the permissions listed above. For this flow, we just use regular redirects with [Microsoft Auth](https://login.microsoftonline.com)

#### User Authentication

If it's a regular Fora user, they will only be able to see Teams/Channels if their Admin has authenticated and their Fora Tenant has a `teams_config.access_token`. If the tenant has been connected, they will be able to fetch Teams resources from the Fora API using tenant.teams_config.accessToken in the X-Fora-Tenant header.

#### Microsoft Graph API

This is what the Fora API is hitting for us

- [Get Teams](https://learn.microsoft.com/en-us/graph/api/teams-list?view=graph-rest-1.0&tabs=http)
- [Get Team Channels](https://learn.microsoft.com/en-us/graph/api/channel-list?view=graph-rest-1.0&tabs=http)
