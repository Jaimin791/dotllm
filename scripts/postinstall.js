#!/usr/bin/env node
/**
 * Post-install script for dotai
 * 
 * Displays a welcome message after package installation.
 * This runs automatically after `npm install dotai`.
 */

const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';
const DIM = '\x1b[2m';
const CYAN = '\x1b[36m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const WHITE = '\x1b[37m';

const pkg = {
    name: 'dotai',
    version: '1.0.0',
};

console.log();
console.log(`${DIM}╭──────────────────────────────────────────────────────────────────╮${RESET}`);
console.log(`${DIM}│${RESET}                                                                  ${DIM}│${RESET}`);
console.log(`${DIM}│${RESET}   ${CYAN}${BOLD}dotai${RESET} ${DIM}v${pkg.version}${RESET}                                       ${DIM}│${RESET}`);
console.log(`${DIM}│${RESET}   ${WHITE}Give your AI the context it deserves.${RESET}                         ${DIM}│${RESET}`);
console.log(`${DIM}│${RESET}                                                                  ${DIM}│${RESET}`);
console.log(`${DIM}├──────────────────────────────────────────────────────────────────┤${RESET}`);
console.log(`${DIM}│${RESET}                                                                  ${DIM}│${RESET}`);
console.log(`${DIM}│${RESET}   ${GREEN}✓${RESET} Successfully installed!                                       ${DIM}│${RESET}`);
console.log(`${DIM}│${RESET}                                                                  ${DIM}│${RESET}`);
console.log(`${DIM}│${RESET}   ${BOLD}Quick Start:${RESET}                                                    ${DIM}│${RESET}`);
console.log(`${DIM}│${RESET}                                                                  ${DIM}│${RESET}`);
console.log(`${DIM}│${RESET}   ${YELLOW}$${RESET} ${CYAN}npx dotai${RESET}                                         ${DIM}│${RESET}`);
console.log(`${DIM}│${RESET}                                                                  ${DIM}│${RESET}`);
console.log(`${DIM}│${RESET}   This will analyze your codebase and generate:                 ${DIM}│${RESET}`);
console.log(`${DIM}│${RESET}                                                                  ${DIM}│${RESET}`);
console.log(`${DIM}│${RESET}   ${DIM}•${RESET} ${WHITE}AI_CODING_RULES.md${RESET}    ${DIM}– Stack-specific coding rules${RESET}         ${DIM}│${RESET}`);
console.log(`${DIM}│${RESET}   ${DIM}•${RESET} ${WHITE}AI_PROJECT_CONTEXT.md${RESET} ${DIM}– Project structure & context${RESET}        ${DIM}│${RESET}`);
console.log(`${DIM}│${RESET}                                                                  ${DIM}│${RESET}`);
console.log(`${DIM}├──────────────────────────────────────────────────────────────────┤${RESET}`);
console.log(`${DIM}│${RESET}                                                                  ${DIM}│${RESET}`);
console.log(`${DIM}│${RESET}   ${BOLD}Available Commands:${RESET}                                             ${DIM}│${RESET}`);
console.log(`${DIM}│${RESET}                                                                  ${DIM}│${RESET}`);
console.log(`${DIM}│${RESET}   ${CYAN}npx dotai${RESET}        ${DIM}Generate context files${RESET}            ${DIM}│${RESET}`);
console.log(`${DIM}│${RESET}   ${CYAN}npx dotai scan${RESET}   ${DIM}Preview detected stack${RESET}            ${DIM}│${RESET}`);
console.log(`${DIM}│${RESET}   ${CYAN}npx dotai update${RESET} ${DIM}Regenerate (overwrite)${RESET}            ${DIM}│${RESET}`);
console.log(`${DIM}│${RESET}                                                                  ${DIM}│${RESET}`);
console.log(`${DIM}├──────────────────────────────────────────────────────────────────┤${RESET}`);
console.log(`${DIM}│${RESET}                                                                  ${DIM}│${RESET}`);
console.log(`${DIM}│${RESET}   ${DIM}📚 Docs:${RESET}  ${CYAN}https://github.com/Jaimin791/dotai${RESET}    ${DIM}│${RESET}`);
console.log(`${DIM}│${RESET}   ${DIM}⭐ Star:${RESET}  ${DIM}If you find this useful, please star the repo!${RESET}      ${DIM}│${RESET}`);
console.log(`${DIM}│${RESET}                                                                  ${DIM}│${RESET}`);
console.log(`${DIM}╰──────────────────────────────────────────────────────────────────╯${RESET}`);
console.log();
