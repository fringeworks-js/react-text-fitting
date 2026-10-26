import type {
  TruncateTextControllerOptions,
  TruncateTextSnapshot,
} from '@fringeworks/text-fitting';
import type { RefCallback } from 'react';

/**
 * useTruncateText関数のオプション\
 * createTruncateTextController のオプションと同じ
 */
export type UseTruncateTextOptions = TruncateTextControllerOptions;

/**
 * useTruncateText関数の戻り値
 */
export type UseTruncateTextResult = TruncateTextSnapshot & {
  /**
   * 表示する要素に渡す ref
   */
  ref: RefCallback<HTMLElement>;

  /**
   * 今の文字列とオプションで、その場で計測し直す
   */
  refresh: () => void;
};
