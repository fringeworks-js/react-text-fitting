'use client';

import { withResizeText } from '../withResizeText';

/**
 * 要素の大きさ（幅・高さ）と行数に収まるように、文字の大きさ（font-size）を変えるコンポーネント（`div` を描く）
 *
 * `withResizeText('div')` で作ったもの。ほかの要素やコンポーネントで描く場合は、withResizeText を使う
 */
const ResizeText = withResizeText('div', { displayName: 'ResizeText' });

export default ResizeText;
