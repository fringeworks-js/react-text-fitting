import { playwright } from '@vitest/browser-playwright';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { configDefaults, defineConfig } from 'vitest/config';

/**
 * ブラウザーで実行するテスト（実際のレイアウトで文字列を測る）
 */
const BROWSER_TEST = 'src/**/*.browser.test.{ts,tsx}';

const dirname =
  typeof __dirname !== 'undefined'
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url));

// ブラウザーのテストでカバレッジを取るときに、ブラウザーが読み込む coverage-v8 の場所。
// パッケージにも pnpm-workspace.yaml があるので、Vite はパッケージのフォルダーをルートとみなし、
// ワークスペースのルートの node_modules にあるこのファイルを読める範囲（server.fs.allow）から外してしまう
const coverageDir = path.dirname(
  createRequire(import.meta.url).resolve('@vitest/coverage-v8/package.json'),
);

export default defineConfig({
  server: { fs: { allow: [dirname, coverageDir] } },
  // link:で参照したパッケージが別のReactを読み込まないようにする
  resolve: { dedupe: ['react', 'react-dom'] },
  test: {
    globals: true,
    coverage: { enabled: true },
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          exclude: [...configDefaults.exclude, BROWSER_TEST],
        },
      },
      {
        extends: true,
        test: {
          name: 'browser',
          include: [BROWSER_TEST],
          browser: {
            enabled: true,
            headless: true,
            provider: playwright(),
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
  },
});
