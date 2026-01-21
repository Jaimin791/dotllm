/**
 * React and Next.js specific coding rules
 */

import type { RuleSection } from '../../types/index.js';

export const reactRules: RuleSection = {
    id: 'react',
    title: 'React Rules',
    description: 'React component and hook standards',
    rules: [
        { text: 'Use functional components exclusively', isProhibition: false },
        { text: 'Use named exports for components', isProhibition: false },
        { text: 'Colocate component files: `ComponentName/index.tsx`, `ComponentName.tsx`, or similar', isProhibition: false },
        { text: 'Use custom hooks to extract reusable stateful logic', isProhibition: false },
        { text: 'Memoize expensive computations with `useMemo`', isProhibition: false },
        { text: 'Memoize callback functions passed to children with `useCallback`', isProhibition: false },
        { text: 'Use React.memo() for components that render often with the same props', isProhibition: false },
        { text: 'Keep components focused on a single responsibility', isProhibition: false },
        { text: 'Use composition over prop drilling for complex component trees', isProhibition: false },
        { text: 'Handle loading and error states explicitly in UI', isProhibition: false },
        { text: 'Use semantic HTML elements for accessibility', isProhibition: false },
    ],
    antiPatterns: [
        { text: 'Use class components - use functional components with hooks', isProhibition: true },
        { text: 'Store derived state - compute on render or use useMemo', isProhibition: true },
        { text: 'Use `useEffect` for data fetching without proper cleanup', isProhibition: true },
        { text: 'Mutate props or state directly', isProhibition: true },
        { text: 'Use index as key for dynamic lists that can be reordered', isProhibition: true },
        { text: 'Create components inside other components', isProhibition: true },
        { text: 'Put business logic inside components - extract to hooks or utilities', isProhibition: true },
        { text: 'Use anonymous functions in JSX that are recreated every render', isProhibition: true },
    ],
};

export const nextjsRules: RuleSection = {
    id: 'nextjs',
    title: 'Next.js Rules',
    description: 'Next.js 13+ App Router standards',
    rules: [
        { text: 'Use App Router conventions (`app/` directory)', isProhibition: false },
        { text: 'Default to Server Components - they\'re faster and reduce bundle size', isProhibition: false },
        { text: 'Use `\'use client\'` directive only when necessary (hooks, browser APIs, events)', isProhibition: false },
        { text: 'Use `next/image` for all images with proper width/height or fill', isProhibition: false },
        { text: 'Use `next/font` for font optimization', isProhibition: false },
        { text: 'Use `next/link` for client-side navigation', isProhibition: false },
        { text: 'Use Route Handlers (`app/api/`) for API endpoints', isProhibition: false },
        { text: 'Use Server Actions for form submissions and mutations', isProhibition: false },
        { text: 'Use `loading.tsx` for Suspense boundaries', isProhibition: false },
        { text: 'Use `error.tsx` for error boundaries', isProhibition: false },
        { text: 'Use `generateMetadata` for dynamic SEO metadata', isProhibition: false },
        { text: 'Use `generateStaticParams` for static generation of dynamic routes', isProhibition: false },
    ],
    antiPatterns: [
        { text: 'Use `getServerSideProps`, `getStaticProps`, or `getInitialProps` - these are Pages Router patterns', isProhibition: true },
        { text: 'Mix Pages Router and App Router patterns in the same route', isProhibition: true },
        { text: 'Use `<img>` tags - use `next/image` component', isProhibition: true },
        { text: 'Use `<a>` tags for internal navigation - use `next/link`', isProhibition: true },
        { text: 'Import client-only libraries (e.g., browser APIs) in Server Components', isProhibition: true },
        { text: 'Use `useState` or `useEffect` in Server Components', isProhibition: true },
        { text: 'Pass functions as props from Server to Client Components', isProhibition: true },
        { text: 'Fetch data on the client when it can be done on the server', isProhibition: true },
    ],
};

export const vueRules: RuleSection = {
    id: 'vue',
    title: 'Vue.js Rules',
    description: 'Vue 3 Composition API standards',
    rules: [
        { text: 'Use Composition API with `<script setup>` syntax', isProhibition: false },
        { text: 'Use `ref` for primitives, `reactive` for objects', isProhibition: false },
        { text: 'Use composables (`use*`) for reusable stateful logic', isProhibition: false },
        { text: 'Use `computed` for derived state', isProhibition: false },
        { text: 'Use `defineProps` and `defineEmits` with TypeScript types', isProhibition: false },
        { text: 'Use `v-model` for two-way binding', isProhibition: false },
        { text: 'Use scoped styles with `<style scoped>`', isProhibition: false },
    ],
    antiPatterns: [
        { text: 'Use Options API in new components - use Composition API', isProhibition: true },
        { text: 'Use `this` in `<script setup>` - use refs and reactive directly', isProhibition: true },
        { text: 'Mutate props directly - emit events to parent', isProhibition: true },
    ],
};

export const angularRules: RuleSection = {
    id: 'angular',
    title: 'Angular Rules',
    description: 'Angular framework standards',
    rules: [
        { text: 'Use standalone components by default', isProhibition: false },
        { text: 'Use signals for state management in Angular 16+', isProhibition: false },
        { text: 'Use dependency injection for services', isProhibition: false },
        { text: 'Use RxJS operators properly - avoid nested subscribes', isProhibition: false },
        { text: 'Use `OnPush` change detection strategy for performance', isProhibition: false },
        { text: 'Use Angular CLI for generating components and services', isProhibition: false },
        { text: 'Use `async` pipe in templates for observables', isProhibition: false },
    ],
    antiPatterns: [
        { text: 'Subscribe manually without unsubscribing in lifecycle hooks', isProhibition: true },
        { text: 'Use nested subscribes - use RxJS operators like `switchMap`', isProhibition: true },
        { text: 'Put business logic in components - move to services', isProhibition: true },
    ],
};
