import type {
  FitTextControllerOptions,
  FitTextSnapshot,
} from '@fringeworks/text-fitting';
import type { RefCallback } from 'react';

/**
 * useFitText関数のオプション\
 * createFitTextController のオプションと同じ
 */
export type UseFitTextOptions = FitTextControllerOptions;

/**
 * useFitText関数の戻り値
 */
export type UseFitTextResult = FitTextSnapshot & {
  /**
   * 表示する要素に渡す ref
   */
  ref: RefCallback<HTMLElement>;

  /**
   * 今の文字列とオプションで、その場で計測し直す
   */
  refresh: () => void;
};
