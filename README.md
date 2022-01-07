# Hackney DLO Bonus Scheme frontend

This is the Hackney DLO Bonus Scheme frontend application which allows supervisors to enter non-productive time, view bonus scheme reports and approve/reject changes to operatives' current payband.

## Preflight

### How it's made

It's a [Next.js](https://nextjs.org) app that works with:

- Hackney's [DLO Bonus Calculation API](https://github.com/LBHackney-IT/bonuscalc-api)
- Hackney's [Google oAuth service](https://github.com/LBHackney-IT/LBH-Google-auth)

It's built using [Hackney Design System](https://github.com/LBHackney-IT/lbh-frontend).

### Clone the project

```sh
$ git clone git@github.com:LBHackney-IT/bonuscalc-frontend.git
```

## Building the project for local development

The app needs Node 14, if you have [NVM](https://github.com/nvm-sh/nvm) installed just run `nvm use` in your terminal.

### Setup

Install the dependencies:

```bash
yarn install
```

### Logging in

First, you need a `@hackney.gov.uk` Google account in the right groups to log in. Speak to Hackney IT if you don't have these.

Next, you need to tell your computer to run the app from a `hackney.gov.uk` domain. Let's use `localdev.hackney.gov.uk`. You will need to add the following line to your `/etc/hosts` file:

```
127.0.0.1       localdev.hackney.gov.uk
```

Lastly, create your `.env.local` and `.env.test.local` files from `.env`. You will need to grab some secrets from the team.

### Run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:5000](http://localhost:5000) with your browser to see the result.

## Continuous Delivery

Our serverless deployment service is configured in [serverless.yml](serverless.yml).

The serverless service includes the following:

- a single serverless function: bonuscalc-frontend
- Description of the Cloudfront CDN in CloudFormation
- Custom subdomain under hackney.gov.uk
