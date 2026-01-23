/**
 * React and Next.js specific coding rules
 */

import type { RuleSection } from '../../types/index.js';

export const reactRules: RuleSection = {
    id: 'react',
    title: 'React Rules',
    description: 'React component and hook standards',
    rules: [
        { text: 'Components must be pure - they should return the same output for the same inputs', isProhibition: false, source: 'Official React Docs' },
        { text: 'Use functional components exclusively', isProhibition: false, source: 'React Community Best Practices' },
        { text: 'Colocate component files: `ComponentName/index.tsx` or `ComponentName.tsx`', isProhibition: false },
        { text: 'Use custom hooks to extract reusable stateful logic', isProhibition: false, source: 'Official React Docs' },
        { text: 'Memoize expensive computations with `useMemo`', isProhibition: false, source: 'Official React Docs' },
        { text: 'Use React.memo() for components that render often with the same props', isProhibition: false },
        { text: 'Handle loading and error states explicitly', isProhibition: false },
        { text: 'Only call Hooks at the top level of your component', isProhibition: false, source: 'Rules of Hooks' },
        { text: 'Only call Hooks from React functions', isProhibition: false, source: 'Rules of Hooks' },
    ],
    antiPatterns: [
        { text: 'Mutate props or state directly - treat them as immutable', isProhibition: true, source: 'Official React Docs' },
        { text: 'Call Hooks inside loops, conditions, or nested functions', isProhibition: true, source: 'Rules of Hooks' },
        { text: 'Store derived state - compute on render instead', isProhibition: true, source: 'React Docs: Choosing State Structure' },
        { text: 'Use index as key for dynamic lists that can be reordered', isProhibition: true, source: 'React Docs: Rendering Lists' },
        { text: 'Create components inside other components', isProhibition: true, source: 'React Performance' },
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
