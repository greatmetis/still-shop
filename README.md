# Still.
>👷🏻‍♀️ This is in progress... Please see what works now and upcoming features below. 

A quiet product catalogue built with React, TypeScript and Tailwind CSS, using the
[DummyJSON](https://dummyjson.com/docs/products) products API. It was inspired by the API documentation, and design ideas from chatting with Claude.

The purpose of the project is to learn and practice React and TypeScript fundamentals. The static components are built by Claude so that I can focus on the React and TypeScript, and interact with the API.

In this project, I have built the features step by step, and I only move on to the next once the tests passed. For more details of what I have learned, please check the section [Learning Highlights](#learning-highlights).

## Run it

```bash
npm install
npm run dev
```

`npm run check` runs the typecheck, lint, tests and production build.

## Progress
The project is built in milestones. They are:

- [x] M0 Test baseline
- [x] M1 Static catalog
- [x] M2 Live products
- [x] v0.1 early launch (after M2): "coming soon" toolbar, README, GitHub + CI, Vercel
- [ ] M3 Search, category, sort and pages in the URL (in progress: categories, debounce and URL parsing done; filtering, sorting and wiring next)
- [ ] M4 Detail page and page transitions
- [ ] M5 Polish and launch
- [ ] M6 (optional) TanStack Query

### What works now
It’s responsive with dark mode, has an intro animation, is accessible (live regions, focus after a retry), and has over 200 tests that CI runs on every push.
- Product catalog loaded live from the DummyJSON API.
- Loading and error states & retry
- Skeletons for loading states
- Category list loaded live from the API (the filter switches on later in M3)

### Upcoming features
- Search and filters
- Product detail pages with transitions
- Maybe TanStack Query for data fetching

## Learning Highlights

- `fetch` doesn't throw on a 404 or 500: I check `response.ok` and throw a typed `ApiError`.
- Cancelling requests with `AbortController` in the `useEffect` cleanup, so a late answer can't overwrite state.
- Accessibility: live regions for result counts, and moving focus after a retry.
- Separating the category fetch, hook and mapper, so each piece has one job and can be tested on its own.
- `useDebounce`: a custom hook built with `setTimeout` and effect cleanup. Every value an effect uses belongs in its dependency array.
- Filters in the URL: `parseParams` treats the URL as untrusted input, narrows strings to a union type and falls back to safe defaults.

More detail: [Learning while building (Notion)](https://app.notion.com/p/metis-teng/Learning-while-building-portfolio-2846d71d7ad1800ebfc8c57b64d8cc08)
