'use client';

import { withChooseText } from '../withChooseText';

/**
 * 要素の大きさ（幅・高さ）と行数に収まる表現を、候補から選ぶコンポーネント（`div` を描く）
 *
 * `withChooseText('div')` で作ったもの。ほかの要素やコンポーネントで描く場合は、withChooseText を使う
 */
const ChooseText = withChooseText('div', { displayName: 'ChooseText' });

export default ChooseText;
