# Contributing to écrit

Thank you for your interest in contributing to écrit! This document provides guidelines and information for contributors.

## Code of Conduct

Be respectful, inclusive, and constructive. We're all here to build something great together.

## Getting Started

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/yourusername/ecrit.git
   ```
3. Create a branch for your feature:
   ```bash
   git checkout -b feature/your-feature-name
   ```
4. Install dependencies:
   ```bash
   bun install
   ```
5. Set up the database:
   ```bash
   docker compose up -d
   bun run db:push
   ```

## Development Workflow

### Running the App

```bash
# Standard development
bun run dev

# With HTTPS (required for voice features)
bun run dev:https
```

### Code Style

We use Biome for linting and formatting:

```bash
# Check for issues
bun run lint

# Format code
bun run format
```

### Database Changes

When modifying the schema:

```bash
# Generate migrations
bun run db:generate

# Apply migrations
bun run db:migrate

# Push schema directly (development)
bun run db:push

# View database
bun run db:studio
```

## Pull Request Process

1. **Create a focused PR** – One feature or fix per PR.
2. **Write clear commit messages** – Describe what and why.
3. **Update documentation** – If your change affects usage.
4. **Test your changes** – Make sure everything works.
5. **Keep it simple** – écrit values minimalism.

### PR Title Format

```
feat: add new feature
fix: resolve bug
docs: update documentation
refactor: improve code structure
style: formatting changes
```

## Architecture Guidelines

### Philosophy

écrit is built on these principles:

- **Minimal** – Less is more. Don't add features unless necessary.
- **Fast** – Performance matters. Keep things snappy.
- **Keyboard-first** – Everything should be accessible via shortcuts.
- **Invisible UI** – The interface should disappear while writing.

### Code Conventions

- Use TypeScript for all code
- Prefer `const` over `let`
- Use early returns for cleaner code
- Name event handlers with `handle` prefix (e.g., `handleClick`)
- Use descriptive variable names
- Keep components small and focused

### Component Structure

```tsx
"use client";

import { useState } from "react";
// ... other imports

type Props = {
  // Define props
};

export const MyComponent = ({ prop }: Props) => {
  // State
  const [state, setState] = useState();

  // Handlers
  const handleClick = () => {
    // ...
  };

  // Early returns
  if (!data) return null;

  // Render
  return <div>{/* ... */}</div>;
};
```

### Adding Keyboard Shortcuts

1. Add the shortcut to `hooks/use-shortcuts.tsx`:

   ```tsx
   {
     key: "x",
     ctrl: true,
     modal: "your-modal",
     requiresAuth: true,
   }
   ```

2. Add the modal type to `lib/types.ts`:

   ```tsx
   export type ModalTypes = "..." | "your-modal";
   ```

3. Create the modal component in `components/modals/`

4. Register it in `components/modals/index.tsx`

## Reporting Issues

When reporting bugs, include:

- Steps to reproduce
- Expected behavior
- Actual behavior
- Browser/OS information
- Screenshots if applicable

## Feature Requests

Before requesting a feature, consider:

- Does it align with écrit's minimal philosophy?
- Is it essential for writing?
- Can it be controlled via keyboard?

## Questions?

Open an issue with the `question` label or start a discussion.

---

Thank you for contributing to écrit! 🖊️
