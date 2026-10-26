'use client';

import { withFitText } from '../withFitText';

/**
 * 候補を選ぶ・文字の大きさを変える・省略するを組み合わせて、要素の大きさ（幅・高さ）と行数に文字列を収めるコンポーネント（`div` を描く）
 *
 * `withFitText('div')` で作ったもの。ほかの要素やコンポーネントで描く場合は、withFitText を使う
 */
const FitText = withFitText('div', { displayName: 'FitText' });

export default FitText;
