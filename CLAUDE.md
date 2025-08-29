# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

### Development
- `npm run dev` - Start the development server on http://localhost:3000
- `npm install` - Install all dependencies

### Building and Production
- `npm run build` - Build the production application
- `npm start` - Start the production server

### Code Quality
- `npm run lint` - Run ESLint to check for code issues
- `npm run fix` - Run ESLint and automatically fix fixable issues
- `npm run eslint-fix` - Alternative command to fix ESLint issues

### Docker
- Build: `docker build . -t <DOCKER_HUB_REPO>/webapp-conversation:latest`
- Run: `docker run -p 3000:3000 <DOCKER_HUB_REPO>/webapp-conversation:latest`

## Architecture Overview

This is a Next.js 14 conversation web application that connects to the Dify.ai platform. The application provides a chat interface for the J.Hilburn Educational Stylist Support Interface (JESSI).

### Key Components

**API Integration**
- Uses `dify-client` package to communicate with Dify.ai backend
- Configuration via environment variables: `NEXT_PUBLIC_APP_ID`, `NEXT_PUBLIC_APP_KEY`, `NEXT_PUBLIC_API_URL`
- API routes in `/app/api/` handle server-side communication with Dify

**Main Application Flow**
- `/app/components/index.tsx` - Main chat component that manages conversation state, handles message sending/receiving, and coordinates the UI
- Supports streaming responses with SSE (Server-Sent Events)
- Manages conversation history and switching between conversations
- Handles file uploads and vision-enabled chat features

**State Management**
- Uses React hooks and `immer` for immutable state updates
- Conversation state persisted to localStorage
- Uses `ahooks` for enhanced React hooks functionality

**Internationalization**
- i18next configuration for multi-language support
- Languages supported: English, Spanish, Japanese, Vietnamese, Chinese
- Language files in `/i18n/lang/`

**UI Components**
- Custom chat interface components in `/app/components/chat/`
- Markdown rendering with syntax highlighting support
- Code editor with Monaco Editor integration
- Responsive design with Tailwind CSS

## Configuration

Before running the application:
1. Copy `.env.example` to `.env.local`
2. Set required environment variables for Dify.ai integration
3. Configure app settings in `/config/index.ts` (title, description, language, etc.)

## Important Notes

- ESLint uses @antfu config with React hooks rules
- TypeScript build errors are currently ignored in production builds (see next.config.js)
- Husky is configured for git hooks with lint-staged
- The application uses session cookies for user identification