'use client';

import { withTruncateText } from '../withTruncateText';

/**
 * 要素の大きさ（幅・高さ）と行数に収まるように、文字列を省略するコンポーネント（`div` を描く）
 *
 * `withTruncateText('div')` で作ったもの。ほかの要素やコンポーネントで描く場合は、withTruncateText を使う
 */
const TruncateText = withTruncateText('div', { displayName: 'TruncateText' });

export default TruncateText;
