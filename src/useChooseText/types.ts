import type {
  ChooseTextControllerOptions,
  ChooseTextSnapshot,
} from '@fringeworks/text-fitting';
import type { RefCallback } from 'react';

/**
 * useChooseText関数のオプション\
 * createChooseTextController のオプションと同じ
 */
export type UseChooseTextOptions = ChooseTextControllerOptions;

/**
 * useChooseText関数の戻り値
 */
export type UseChooseTextResult = ChooseTextSnapshot & {
  /**
   * 表示する要素に渡す ref
   */
  ref: RefCallback<HTMLElement>;

  /**
   * 今の候補とオプションで、その場で計測し直す
   */
  refresh: () => void;
};
