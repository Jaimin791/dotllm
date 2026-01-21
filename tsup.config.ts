import { defineConfig } from 'tsup';

export default defineConfig([
    // CLI entry - with shebang
    {
        entry: {
            'cli/index': 'src/cli/index.ts',
        },
        format: ['esm'],
        dts: true,
        clean: true,
        splitting: false,
        sourcemap: true,
        minify: false,
        target: 'node18',
        outDir: 'dist',
        shims: true,
        banner: {
            js: '#!/usr/bin/env node\n',
        },
    },
    // Library entry - no shebang
    {
        entry: {
            'index': 'src/index.ts',
        },
        format: ['esm'],
        dts: true,
        clean: false, // Don't clean to preserve CLI output
        splitting: false,
        sourcemap: true,
        minify: false,
        target: 'node18',
        outDir: 'dist',
    },
]);
