import type {
  ResizeTextControllerOptions,
  ResizeTextSnapshot,
} from '@fringeworks/text-fitting';
import type { RefCallback } from 'react';

/**
 * useResizeText関数のオプション\
 * createResizeTextController のオプションと同じ
 */
export type UseResizeTextOptions = ResizeTextControllerOptions;

/**
 * useResizeText関数の戻り値
 */
export type UseResizeTextResult = ResizeTextSnapshot & {
  /**
   * 表示する要素に渡す ref
   */
  ref: RefCallback<HTMLElement>;

  /**
   * 今の文字列とオプションで、その場で計測し直す
   */
  refresh: () => void;
};
