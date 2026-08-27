// @ts-check
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintPluginAstro from 'eslint-plugin-astro';

export default tseslint.config(
  {
    // .claude/worktrees/** は並行実装エージェント用の一時worktree
    // （WORKTREE_AGENT_PLAN.md）。各worktreeが自分のtsconfig.jsonを持つため、
    // 除外しないとtypescript-eslintが「複数のtsconfigRootDir候補がある」
    // として本体側の型定義ファイルまでパースエラーにすることを実機で確認した
    // （2026-08-27、feature/content-guide-and-sponsored-results QA中に発見）。
    ignores: ['dist/**', '.astro/**', 'node_modules/**', '.claude/worktrees/**'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...eslintPluginAstro.configs.recommended,
  {
    // Astroのfrontmatterはコンポーネントスクリプトであり、未使用exportが
    // 誤検出されやすいためastroファイルのみ緩和する。
    files: ['**/*.astro'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },
);
