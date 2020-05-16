/**
 * This file contains rather loose declarations for Extended StyleSheets.
 *
 * Writing strict declarations is a tricky (impossible?) task,
 * because EStyleSheet actively operates with dynamic keys:
 * - variables (started with "$...")
 * - media queries (started with "@media...")
 * - underscored output keys (started with "_...")
 *
 * Adding key augmention is tracked here: https://github.com/Microsoft/TypeScript/issues/12754
 */

import {StyleSheet, ImageStyle, TextStyle, ViewStyle} from 'react-native';

export = EStyleSheet;

declare namespace EStyleSheet {
    type Event = 'build';

    type Function<K> = () => K
    type Value<T> = T | string & {}
    type Variable<T> = Value<T> | Function<Value<T>>
    type Extended<T> = { [K in keyof T]: Variable<T[K]> }

    type AnyStyle = ImageStyle & TextStyle & ViewStyle
    type AnyStyleSet = { [key: string]: AnyStyle }

    type EStyleSet<T = any> = { [K in keyof T]:
      T[K] extends Variable<number> ? T[K] :
      T[K] extends MediaQuery ? T[K] :
      Extended<AnyStyle> & EStyleSet
    }

    type StyleSet<T = any> = { [K in keyof T]:
      T[K] extends number ? T[K] :
      T[K] extends string ? T[K] :
      T[K] extends Function<number> ? number :
      T[K] extends Function<string> ? string :
      T[K] extends MediaQuery ? any :
      AnyStyle
    }

    export type MediaQuery = { [key: string]: Extended<AnyStyle> }

    export function create<T = EStyleSet>(styles: EStyleSet<T>): StyleSet<T>;
    export function build<T>(rawGlobalVars?: T): void;
    export function value(expr: any, prop?: string): any;
    export function child<T>(styles: T, styleName: string, index: number, count: number): T;
    export function subscribe(event: Event, listener: () => any): void;
    export function clearCache(): void;

    // inherited from StyleSheet
    export const flatten: typeof StyleSheet.flatten;
    export const setStyleAttributePreprocessor: typeof StyleSheet.setStyleAttributePreprocessor;
    export const hairlineWidth: typeof StyleSheet.hairlineWidth;
    export const absoluteFillObject: typeof StyleSheet.absoluteFillObject;
    export const absoluteFill: typeof StyleSheet.absoluteFill;
}
