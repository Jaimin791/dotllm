/**
 * php-specific coding rules
 */

import type { RuleSection } from '../../types/index.js';

export const phpRules: RuleSection = {
  id: 'php',
  title: 'PHP Rules',
  description: 'PHP coding standards and best practices',
  rules: [
    { text: 'Follow PSR-12 coding standards', isProhibition: false, source: 'PSR-12' },
    {
      text: 'Use strict types declaration for new files',
      isProhibition: false,
      source: 'PHP 7.0+ Best Practices',
    },
    {
      text: 'Use type hints for function parameters and return types',
      isProhibition: false,
      source: 'PHP 7.0+ Type Declarations',
    },
    { text: 'Use namespaces for all classes', isProhibition: false, source: 'PSR-4' },
    {
      text: 'Prefer composition over inheritance',
      isProhibition: false,
      source: 'SOLID Principles',
    },
    {
      text: 'Use exceptions for error handling, not return codes',
      isProhibition: false,
      source: 'Modern PHP Practices',
    },
  ],
  antiPatterns: [
    {
      text: 'Use `mysql_*` functions - use PDO or MySQLi instead',
      isProhibition: true,
      source: 'PHP Manual',
    },
    {
      text: 'Mix PHP logic with HTML without templates',
      isProhibition: true,
      source: 'MVC Pattern',
    },
    {
      text: 'Use global variables or `$_POST`/`$_GET` directly',
      isProhibition: true,
      source: 'Security Best Practices',
    },
    { text: 'Ignore error reporting in production', isProhibition: true, source: 'PHP Security' },
  ],
};
