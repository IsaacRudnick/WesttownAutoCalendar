# WesttownAutoCalendar

Thanks to

- [Andrew Ramsay](https://github.com/andrewramsay/ical_to_gcal_sync/blob/master/ical_to_gcal_sync.py) for a somewhat similar program, albeit in Python, which helped with certain specifics of the calendar sync.

- [Martennnn](https://dev.to/maartennnn/google-calendar-integration-with-nodejs-without-oauth-2-0-5256) for a helpful article on how to integrate Google Calendar with Node.js.

This program was made because I wanted to dynamically subscribe Westtonians to their MyWesttown ical feed such that it was made visible Google Calendar for their primary calendar (so others can view their availability), something which cannot be done easily.

You can _run_ the program by typing `node app` in the terminal. This program does not resolve. It listens for web requests and updates users indefinitely.

# Changing the program

I know at some point this code will break. I've attempted to make it as easy as possible for future developers to understand it.

To understand how the program works, you will need a decent understanding of **[Node.js](https://www.smashingmagazine.com/2019/02/node-api-http-es6-javascript/)**

**Please leave this codebase as well-documented as you've found it.**
The best comments don't explain what something does, but why it does it.

### Where do I look to start fixing a bug?

Before you begin, remember that this program is connected to real users' calendars. Do not attempt to change anything without creating a new Google [service account](https://developers.google.com/identity/protocols/oauth2/service-account) for testing.

All calls are easy to follow. Look through the code starting here:

- app.js is the main file. It is the entry point for the program.
- app.js connects to the DB and then:
  - begins the calendar syncing part of the program (`/updater`)
  - begins listening for web requests

### Logs

There are log files for the last three days in the `/updater/logs` folder.
They contain a lot of useful information, but don't make up for working debugging.

# Documentation

Incredibly helpful documentation can be found in `/updater/docs` in the form of a static website. Open any of the `.html` files in your broswer and you will be able to navigate through the documentation. This folder is made by running `npm run build-docs`. As said earlier, please maintain the quality of this codebase; all functions are documented with [JSDoc Docstrings](https://jsdoc.app/about-getting-started.html)
