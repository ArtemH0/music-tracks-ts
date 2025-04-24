# 🎵 Music Tracks Manager

A modern React + TypeScript application powered by Vite for managing music tracks. This project uses powerful libraries such as React Hook Form, Zod, Axios, and React Modal to build an efficient and user-friendly UI.

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

Install dependencies:

```bash
npm install
```

### Running the Development Server

```bash
npm run dev
```

This will start the Vite development server. Visit `http://localhost:3000` in your browser.

### Building for Production

```bash
npm run build
```

This will type-check the project and build optimized static files using Vite.

### Preview Production Build

```bash
npm run preview
```

This starts a local preview server to test your production build.

### Linting

```bash
npm run lint
```

Runs ESLint to check for code issues and ensure style consistency.

---

.env file exists 
Can tune environment variables in it

## 🧩 Libraries & Usage

### `react` & `react-dom`
The core UI library for building the user interface.

### `vite`
A fast build tool that serves the app in development and bundles it for production.

### `typescript`
Used for type safety and enhanced developer experience.

### `react-hook-form`
A performant form management library for React. It's used to manage form state, validation, and submission.

### `@hookform/resolvers`
Provides schema validation support for `react-hook-form`. Used alongside Zod for type-safe validation.

### `zod`
Schema validation library for TypeScript. Used to define and validate form schemas in a type-safe manner.

### `axios`
Promise-based HTTP client used for fetching and sending data to the backend API (e.g., for track metadata and audio file upload).

### `react-modal`
Accessible modal component used for forms like “Create Track” and “Edit Track”.

---

## 🛠 Development Tools

### `eslint` + `eslint-plugin-react-hooks`
Used to maintain code quality and enforce best practices for hooks and general JavaScript/TypeScript code.

### `@vitejs/plugin-react`
Adds React Fast Refresh and JSX transform support for Vite.

### `@types/*`
Type definitions for React, Node, and other libraries to enable full TypeScript support.

---

## 📁 Project Structure (simplified)

```
src/ 
├── api/ # API requests and service functions using Axios 
├── components/ # Reusable UI components (buttons, modals, forms, etc.) 
├── contex/ # React context for global state management 
├── hooks/ # Custom reusable React hooks  
├── types/ # Global TypeScript types and interfaces 
├── utils/ # Utility functions and helpers 
├── App.tsx # Main application component 
└── main.tsx # Entry point for rendering ReactDOM
```


