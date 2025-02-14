import { warn } from 'vue'
import { fromPairs } from 'lodash-unified'
import { isArray, isFunction } from '../../types'

import type { PropType } from 'vue'
import type { Default, DefaultFactory, EpProp, EpPropOptions, Value } from './types'

type PruneProp<P> = P extends EpPropOptions<infer T, any, any> ? {
      [K in Exclude<keyof P, 'validator' | 'values'>]: K extends 'type'
        ? (P['values'] extends readonly unknown[] ? PropType<Exclude<T, PrimitiveUnion<P['values'][number]>> | P['values'][number]> : P[K]):P[K]
  } : never
export const definePropType = <T>(val: any): PropType<T> => val
export const defineEpProp = <P extends EpProp<unknown, V, D>, const V extends Value<unknown>, const D extends Default<unknown, V>>(
  prop: P & constraintsP<P>
) => prop as P

type PrimitiveUnion<T> = T extends string ? string : T extends number ? number : T extends boolean ? boolean : never;

/**
 * @description Build prop. It can better optimize prop types
 * @description 生成 prop，能更好地优化类型
 * @example
  // limited options
  // the type will be PropType<'light' | 'dark'>
  buildProp({
    type: String,
    values: ['light', 'dark'],
  } as const)
  * @example
  // limited options and other types
  // the type will be PropType<'small' | 'large' | number>
  buildProp({
    type: [String, Number],
    values: ['small', 'large'],
    validator: (val: unknown): val is number => typeof val === 'number',
  } as const)
  @link see more: https://github.com/element-plus/element-plus/pull/3341
 */
export const buildProp = <T, V extends Value<T>, D extends Default<T,V>>(prop: EpProp<T, V, D>, key: string) => {
  if (isFunction(prop) || isArray(prop) || !prop.values) return prop

  const { values, validator } = prop
  const _validator = (val: T) => {
    let valid = false
    let allowValuesText = ''

    valid ||= values.includes(val)
    if (!valid) {
      allowValuesText = values.map((value) => JSON.stringify(value)).join(', ')
    }
    if (validator) valid ||= validator(val)

    if (!valid && allowValuesText) {
      warn(
        `Invalid prop: validation failed${
          key ? ` for prop "${key}"` : ''
        }. Expected one of [${allowValuesText}], got value ${JSON.stringify(
          val
        )}.`
      )
    }
    return valid
  }

  return {
    ...prop,
    validator: _validator,
  }
}

type constraintsPP<PP extends Record<string, unknown>> = { [K in keyof PP]: PP[K] extends EpProp<infer T, infer V, infer D> ? EpProp<T, V, D> : never }
type constraintsP<P> = P extends EpProp<infer T, infer V, infer D> ? EpProp<T, V, D> : never 

export const buildProps = <PP extends Record<string, EpProp<unknown, V, D | DA | DefaultFactory<T, V>>>, const T extends unknown[], const V extends Value<unknown>, const D extends Default<unknown, V>, DA extends Default<unknown[], V>>(props: PP & constraintsPP<PP>) => { 
  return fromPairs(
    Object.entries(props).map(([key, option]) => [key, buildProp(option, key)])
  ) as { [K in keyof PP]: PP[K] extends PropType<unknown> ? PP[K] : PruneProp<PP[K]> }
}