# écrit – Writing Without Friction

écrit is a minimal, distraction-free writing app built for people who just want to write. Most note apps become bloated over time and force you to navigate menus and interfaces before you can even start. écrit removes all of that.

**You open it and write instantly. The UI stays invisible until you call it.**

## Features

- **Instant Writing** – No menus, no setup. Just open and write.
- **Keyboard-First** – Everything is controlled via shortcuts.
- **Voice Transcription** – Speak and watch your words appear.
- **Autosave** – Your work is always safe.
- **Minimal UI** – The interface stays out of your way.

## Keyboard Shortcuts

| Shortcut           | Action                 |
| ------------------ | ---------------------- |
| `Ctrl + K`         | Open notes search      |
| `Ctrl + Alt + N`   | Create new note        |
| `Ctrl + Shift + P` | Open settings          |
| `Ctrl + S`         | Save note              |
| `Esc + Esc`        | Toggle voice recording |

écrit## Tech Stack

- **Framework** – Next.js 16 with React 19
- **Database** – PostgreSQL with Drizzle ORM
- **Auth** – Better Auth
- **Editor** – Novel (Tiptap-based)
- **Styling** – Tailwind CSS
- **State** – Zustand + TanStack Query

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- PostgreSQL database
- Docker (optional)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/ecrit.git
cd ecrit
```

2. Install dependencies:

```bash
bun install
```

3. Set up environment variables:

```bash
cp .env.example .env
```

4. Start the database (using Docker):

```bash
docker compose up -d
```

5. Run database migrations:

```bash
bun run db:push
```

6. Start the development server:

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) to start writing.

### HTTPS Development (for voice recording)

Voice transcription requires HTTPS. Run with:

```bash
bun run dev:https
```

## Project Structure

```
ecrit/
├── app/                 # Next.js app router
│   ├── (app)/          # Authenticated routes
│   ├── (auth)/         # Auth routes
│   └── api/            # API routes
├── components/         # React components
│   ├── editor/         # Novel editor
│   ├── modals/         # Modal dialogs
│   └── ui/             # UI primitives
├── db/                 # Database schema
├── hooks/              # Custom hooks
├── lib/                # Utilities
└── contex/             # React contexts
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

MIT

---

**écrit is writing the way it should be.**
