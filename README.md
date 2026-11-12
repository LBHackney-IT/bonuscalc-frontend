<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="docs/images/hackney-logo-dark.svg">
    <img src="docs/images/hackney-logo.svg" alt="Hackney" width="208">
  </picture>
</p>

<h1 align="center">DLO Bonus Scheme frontend</h1>

<p align="center">
  Where supervisors enter non-productive time, view bonus scheme reports<br>
  and approve or reject changes to operatives' current payband.
</p>

<p align="center">
  <a href="#environments">Environments</a> ·
  <a href="#getting-set-up">Getting set up</a> ·
  <a href="#logging-in">Logging in</a> ·
  <a href="#continuous-delivery">Deployment</a>
</p>

## What it's built on

It's a [Next.js](https://nextjs.org) app styled with the [Hackney Design System](https://github.com/LBHackney-IT/lbh-frontend). It works with:

- Hackney's [DLO Bonus Calculation API](https://github.com/LBHackney-IT/bonuscalc-api)
- Amazon Cognito, which signs people in with their Hackney Google account

## Environments

We only use two environments:

| Environment | URL                                           |
| ----------- | --------------------------------------------- |
| Live        | https://dlo-bonus-scheme.hackney.gov.uk       |
| Staging     | https://dlo-bonus-scheme-staging.hackney.gov.uk |

## Getting set up

### Clone the project

```sh
$ git clone git@github.com:LBHackney-IT/bonuscalc-frontend.git
```

### Prerequisites

The app needs Node 20, if you have [NVM](https://github.com/nvm-sh/nvm) installed just run `nvm use` in your terminal.

### Install

Install the dependencies:

```bash
yarn install
```

### Run the development server

```bash
npm run dev
# or
yarn dev
```

Then open [http://localhost:5001](http://localhost:5001).

## Logging in

Sign in uses [next-auth](https://next-auth.js.org) with an Amazon Cognito user pool, which federates to Google. You need a `@hackney.gov.uk` Google account in the right groups. Speak to Hackney IT if you don't have these.

Create your `.env` and `.env.test` files by copying `.env.sample` and `.env.test.sample`. You will need to grab some secrets from the team.

### Authentication variables

| Variable                                                                                                           | Purpose                                                                                       |
| ------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------- |
| `NEXTAUTH_URL`                                                                                                     | Public URL of the app, e.g. `http://localhost:5001` locally. Must match the Cognito callback. |
| `NEXTAUTH_SECRET`                                                                                                  | Encrypts the session cookie. Generate with `openssl rand -base64 32`.                         |
| `COGNITO_ISSUER`                                                                                                   | `https://cognito-idp.<region>.amazonaws.com/<user-pool-id>`                                   |
| `COGNITO_DOMAIN`                                                                                                   | Hosted UI domain, used for sign out.                                                          |
| `COGNITO_CLIENT_ID`                                                                                                | App client id.                                                                                |
| `COGNITO_CLIENT_SECRET`                                                                                            | Optional. Leave unset for a public (PKCE only) app client.                                    |
| `COGNITO_IDENTITY_PROVIDER`                                                                                        | Optional. Name of the Google identity provider, to skip the hosted UI chooser.                |
| `OPERATIVE_MANAGERS_GOOGLE_GROUPNAME`, `WEEK_MANAGERS_GOOGLE_GROUPNAME`, `AUTHORISATION_MANAGERS_GOOGLE_GROUPNAME` | Group names that map to each role.                                                            |

The Cognito app client needs `<NEXTAUTH_URL>/api/auth/callback/cognito` as an allowed callback URL and `<NEXTAUTH_URL>/login` as an allowed sign out URL.

### How it works

- **Sign in:** the login page calls `signIn('cognito')`. After Cognito redirects back, the session is stored in an encrypted cookie holding the Cognito ID token and the user's groups (from the `custom:groups` claim). It lasts 4 hours and there is no refresh token. The session is treated as expired when the ID token expires, if that is sooner.
- **Roles:** groups are mapped to roles in [src/utils/user.js](src/utils/user.js). Pages declare `permittedRoles`, and [src/pages/\_app.js](src/pages/_app.js) redirects to `/login` or `/access-denied`.
- **API requests:** the ID token is read from the cookie on the server and forwarded to the service API in the `x-hackney-user` header. It is never sent to the browser.
- **Sign out:** `/api/logout` clears the session cookies and redirects to Cognito's `/logout`, which returns to `/login`.
- **Cypress:** `cy.login()` mints a session cookie signed with `NEXTAUTH_SECRET`, so e2e tests don't talk to Cognito. Use an `http` `NEXTAUTH_URL` for e2e, as `https` changes the cookie name.

## Continuous Delivery

Our serverless deployment service is configured in [serverless.yml](serverless.yml).

The serverless service includes the following:

- a single serverless function: bonuscalc-frontend
- Description of the Cloudfront CDN in CloudFormation
- Custom subdomain under hackney.gov.uk
