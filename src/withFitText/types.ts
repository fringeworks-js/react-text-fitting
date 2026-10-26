import type { ElementType } from 'react';
import type { FittingComponent, FittingProps } from '../types';
import type { UseFitTextOptions } from '../useFitText';

/**
 * withFitText で作ったコンポーネントのプロパティ\
 * 包んだコンポーネントのプロパティ、useFitText のオプション、`value`（表示する文字列か、1つの値の表現の候補（望ましい順））
 */
export type FitTextProps<C extends ElementType> = FittingProps<
  C,
  string | readonly string[],
  UseFitTextOptions
>;

/**
 * withFitText で作ったコンポーネント
 */
export type FitTextComponent<C extends ElementType> = FittingComponent<
  C,
  string | readonly string[],
  UseFitTextOptions
>;
