#!/bin/bash

set -e

if ! command -v bun &> /dev/null; then
    echo "Error: bun is not installed"
    exit 1
fi

if ! command -v docker &> /dev/null; then
    echo "Error: docker is not installed"
    exit 1
fi

if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo "Created .env from .env.example"
    else
        echo "DATABASE_URL=\"postgresql://postgres:postgres@localhost:5439/ecrit\"" > .env
        echo "Created .env with default database URL"
    fi
fi

echo "Installing dependencies..."
bun install

echo "Starting database..."
docker compose up -d

echo "Waiting for database to be ready..."
sleep 3

echo "Running database migrations..."
bun run db:push

echo "Starting development server..."
bun run dev
