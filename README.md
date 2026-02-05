# Cloudflare React Starter

[cloudflarebutton]

A production-ready starter template for building full-stack applications on Cloudflare Workers using React, TypeScript, Tailwind CSS, and shadcn/ui. Optimized for performance, scalability, and developer experience with Bun.

## Key Features

- **Type-Safe Development**: Full TypeScript support with modern tooling
- **Modern UI**: Pre-configured shadcn/ui components and Tailwind CSS for rapid UI development
- **Fast Builds**: Powered by Vite for lightning-fast development and production builds
- **Cloudflare Native**: Seamless integration with Cloudflare Workers for edge deployment
- **Bun-First**: Uses Bun for installation, development, and building for superior speed
- **Production Ready**: Includes error handling, JSDoc comments, and best practices

## Tech Stack

- **Runtime**: Cloudflare Workers
- **Frontend**: React 18, Vite
- **Styling**: Tailwind CSS, shadcn/ui
- **Language**: TypeScript
- **Package Manager**: Bun
- **Deployment**: Cloudflare Workers/Pages, Wrangler

## Quick Start

1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd <project-name>
   ```

2. **Install dependencies**:
   ```bash
   bun install
   ```

3. **Start development server**:
   ```bash
   bun dev
   ```
   Open [http://localhost:5173](http://localhost:5173) to view the app.

4. **Build for production**:
   ```bash
   bun run build
   ```

## Development

- **Hot Reload**: `bun dev` enables Vite's HMR for instant updates
- **Type Checking**: Runs automatically; use `bun run type-check` for explicit checks
- **Linting & Formatting**: Prettier and ESLint configured; `bun run lint` to check
- **Adding shadcn/ui Components**: Use `bunx shadcn-ui@latest add <component>` (pre-installed components available)

Customize `src/App.tsx` and components in `src/components/` to build your app.

## Deployment

Deploy instantly to Cloudflare Workers with zero configuration.

[cloudflarebutton]

### Manual Deployment with Wrangler

1. **Install Wrangler**:
   ```bash
   bun add -g wrangler
   ```

2. **Login to Cloudflare**:
   ```bash
   wrangler login
   ```

3. **Deploy**:
   ```bash
   bun run build
   wrangler deploy
   ```

### GitHub Integration

1. Push to GitHub
2. Connect repository in [Cloudflare Dashboard](https://dash.cloudflare.com)
3. Deploy to Workers or Pages automatically on push

Your app will be live on the global Cloudflare edge network.

## Contributing

1. Fork the project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`bun run lint && git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## License

MIT License - see [LICENSE](LICENSE) for details.