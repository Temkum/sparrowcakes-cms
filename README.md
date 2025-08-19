# Sparrow Cakes Buea

A modern web application for managing and showcasing cakes, events, and services by Sparrow Cakes Buea. Built with React, TypeScript, and Vite for a fast, maintainable, and scalable frontend experience.

## What Does This Project Do?

Sparrow Cakes Buea is a full-featured CMS and storefront for a cake business. It allows users to:

- Browse cake products and services
- View company information and reviews
- Register and log in to manage their profile
- Access admin features (if authorized)
- Contact the business and view social media links

The codebase is organized for maintainability, with clear separation of components, pages, services, and state management. It uses modern React patterns and best practices.

## Tech Stack & Upsides

- **React**: Declarative UI, component-based architecture, huge ecosystem
- **TypeScript**: Type safety, better developer experience, fewer runtime errors
- **Vite**: Lightning-fast dev server, instant HMR, optimized builds
- **Zustand**: Simple and scalable state management
- **React Router**: Client-side routing for SPA experience
- **Tailwind CSS**: Utility-first styling, rapid UI development
- **ESLint**: Enforced code quality and consistency
- **Radix UI**: Accessible, unstyled UI primitives for custom design

**Upsides:**

- Fast development and build times
- Type safety and maintainability
- Easy to extend and refactor
- Modern UI/UX with accessibility in mind
- Clear separation of concerns

## How to Run the Project

1. **Install dependencies**

   ```bash
   pnpm install
   # or
   npm install
   # or
   yarn install
   ```

2. **Start the development server**

   ```bash
   pnpm dev
   # or
   npm run dev
   # or
   yarn dev
   ```

   The app will be available at `http://localhost:5173` (or the port shown in your terminal).

3. **Build for production**

   ```bash
   pnpm build
   # or
   npm run build
   # or
   yarn build
   ```

4. **Preview the production build**

   ```bash
   pnpm preview
   # or
   npm run preview
   # or
   yarn preview
   ```

## Project Structure

- `src/components/` - Reusable UI components
- `src/pages/` - Page-level components for routing
- `src/services/` - API and business logic
- `src/store/` - State management (Zustand)
- `src/routes/` - Route definitions
- `src/styles/` - Custom styles
- `public/` - Static assets

## Additional Notes

- Environment variables can be set in `.env` files for API endpoints and secrets.
- Linting and formatting are enforced via ESLint and Prettier.
- For deployment, see `netlify.toml` or your preferred static hosting provider.

---

For questions or contributions, open an issue or pull request!
