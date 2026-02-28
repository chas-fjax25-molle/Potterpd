# PotterPD

[![Tests](https://github.com/chas-fjax25-molle/Potterpd/actions/workflows/test.yml/badge.svg)](https://github.com/chas-fjax25-molle/Potterpd/actions/workflows/test.yml)
[![Playwright Tests](https://github.com/chas-fjax25-molle/Potterpd/actions/workflows/playwright.yml/badge.svg)](https://github.com/chas-fjax25-molle/Potterpd/actions/workflows/playwright.yml)
[![Deploy to GitHub Pages](https://github.com/chas-fjax25-molle/Potterpd/actions/workflows/deploy.yml/badge.svg)](https://github.com/chas-fjax25-molle/Potterpd/actions/workflows/deploy.yml)

## About

PotterPD is a small front-end project showcasing Harry Potter-related data (books, characters, spells, potions, movies, and favourites).

## How it works

- Data is fetched from a public API via `RequestsFromAPI.js` and used across pages.
- Routing between entities is handled by `entity_router.js` and `entity_service.js`.
- The site uses plain HTML/CSS/vanilla JS in the `src/` folder and uses Vite for local development.

- The repository includes a GitHub Actions workflow for deploying to GitHub Pages. Check `.github/workflows` (or the repo's Actions tab) for the exact deploy steps and any site URL.

## API

This project uses a public Harry Potter-themed API (via `RequestsFromAPI.js`) to fetch lists of books, characters, spells, potions and movies. Example endpoint pattern used in the codebase:

`https://docs.potterdb.com/`

## Running locally

- Install dependencies: `npm install`
- Start dev server: `npm run dev`
- Run tests: `npm test`

## Documentations

- Documented final tests verifying that the application works on both Android and iOS.

Responsive design: works on iOS Safari and Android Chrome

PWA enabled: installable on mobile

Tested on: iPhone 12+, Android 10+

- A report describing how you worked according to your planning, how well you were able to follow it, and when you fell behind or had to change the plan.

We documented our stand-ups on GitHub under the Wiki section. There, we also mentioned who worked together at times and on what tasks. To follow the original plan, we conducted SCRUM planning sessions and updated the plan during our stand-ups. The planning was difficult to follow during certain periods due to some team members being sick and one person leaving the program, which required the remaining group members to be more flexible.

- Known limitations of the offline mode and a high-level explanation of how it works.

It is not possible to access online resources in offline mode. The offline functionality only works if data has previously been saved while online. The user must first be online to fetch data, which can then be stored for offline use.

- A description of how you worked with error handling and whether there are situations where the error handling might stop functioning.

Our group did not experience major issues with error handling; rather, it was a learning process that helped us get closer to the solutions we were working toward.

- A short video demonstrating how the app transitions from online to offline mode on a mobile device, as well as how the app scales from mobile to desktop.
