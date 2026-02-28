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

We have documentated all that was needed in one single document file. Open link to read more. 
`https://docs.google.com/document/d/152PoBv6Bi-K0uk3A_4nNcqaZkAA7to6ug6zP7x15qDw/edit?usp=sharing`
