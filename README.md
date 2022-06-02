# Portfolio Website

## Setup

Before working you'll want to set up the .env files:

for development
- .env.development.local

for production
- .env.production.local

These will hold our SECRET environment variables

The following Variables should be defined

    EMAIL_USER=<YOUR SMTP EMAIL USERNAME>
    EMAIL_PASS=<YOUR SMTP EMAIL PASSWORD>
    EMAIL_HOST=<YOUR SMTP EMAIL SERVER>
    EMAIL_PORT=<YOUR SMTP EMAIL PORT>

    PERSONAL_EMAIL_ADDRESS=<THE EMAIL TO FORWARD CONTACT FORMS TO>
    CONTACT_RATELIMIT_WINDOW=<RATE LIMIT WINDOW IN MS>
    CONTACT_RATELIMIT_MAXREQUESTS=<MAX AMOUNT OF REQ PER WINDOW>


## Commands

To start the development server use: <br>
``$ yarn dev``

To build the docker image use: <br>
``$ ./build.sh``

