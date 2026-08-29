# TaskFlow 🚀

A Trello-style task management board built from scratch as a hands-on React learning project — now a fully-featured app with a real REST API, optimistic UI updates, and modern state management.

> Built step-by-step to master React fundamentals through advanced patterns: hooks, component composition, server state, and client state management.

## ✨ Features

- **Full CRUD** — create, read, update, and delete tasks against a real REST API
- **Optimistic UI updates** — status changes, task creation, and deletion feel instant, with automatic rollback if the server request fails
- **Live search** — filter tasks by title in real time, powered by a global Zustand store
- **Three-column board** — Not Started / In Progress / Completed, with drag-free status changes via dropdown
- **Reusable component composition** — a `Modal` with a children pattern, a configurable `Button` with variants
- **Clean architecture** — API calls, data-fetching logic, and UI are cleanly separated into their own layers

## 🛠 Tech Stack

| Layer        | Choice                                                 | Why                                                                                                        |
| ------------ | ------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------- |
| UI           | React 18 + Vite                                        | Fast dev server, modern React with hooks                                                                   |
| Server state | [TanStack Query](https://tanstack.com/query)           | Caching, background refetching, and mutation handling instead of manual `useState`/`useEffect` fetch logic |
| Client state | [Zustand](https://github.com/pmndrs/zustand)           | Minimal global state (search term) without prop drilling or Context boilerplate                            |
| Mock backend | [json-server](https://github.com/typicode/json-server) | A quick REST API for local development, backed by a JSON file                                              |
| Styling      | Plain CSS                                              | No framework — hand-written, scoped by component                                                           |

## 🏗 Architecture

```
src/
├── services/
│   └── taskApi.js          # All fetch calls — the only place that knows about the API
├── store/
│   └── searchStore.js      # Zustand store for search state
└── features/
    └── tasks/
        ├── hooks/
        │   └── useTasks.js # React Query hooks: fetching + optimistic mutations
        └── components/
            ├── Column.jsx
            ├── TaskCard.jsx
            ├── Modal.jsx
            ├── Button.jsx
            └── SearchInput.jsx
```

**Design decisions worth calling out:**

- **Why TanStack Query instead of manual `fetch` + `useState`?** Manual data-fetching means every component that needs the same data re-fetches independently, with no shared cache and no built-in way to know when data goes stale. TanStack Query solves this with a centralized cache, automatic background refetching, and a consistent loading/error API.
- **Why Zustand instead of React Context for search?** Context works, but requires writing a `Provider`, wrapping the tree, and a bit of boilerplate for something as small as a search string. Zustand gives any component direct read/write access to shared client state with far less ceremony — and only re-renders components that actually subscribe to the piece of state that changed.
- **Why optimistic updates?** Waiting for a server round-trip before updating the UI makes a task board feel sluggish. Optimistic updates apply the change immediately, then roll back automatically (via TanStack Query's `onMutate`/`onError`/`onSettled`) if the request fails — giving a fast, native-app feel without sacrificing correctness.
- **Why a separate `services/taskApi.js` layer?** Keeps a single responsibility per file: `taskApi.js` only knows _how to talk to the server_ (URLs, HTTP methods, headers); `useTasks.js` only knows _how to manage that data in React_ (caching, optimistic updates). If the backend changes, only `taskApi.js` needs to change.

## 🚀 Getting Started

```bash
npm install

# Terminal 1 — frontend
npm run dev          # http://localhost:5173

# Terminal 2 — fake backend
npm run server        # http://localhost:3001
```

## 📍 Roadmap

- [x] Phase 1 — Git & project setup
- [x] Phase 2 — Board skeleton + data flow (props, lifting state up)
- [x] Phase 3 — Hooks (useEffect, Context concepts)
- [x] Phase 4 — Component composition (Modal, Card, Button)
- [x] Phase 5 — REST API integration
- [x] Phase 6 — State management (TanStack Query + Zustand)
- [x] Phase 7 — Clean Code refactor (custom hooks, DRY, SRP, services layer)
