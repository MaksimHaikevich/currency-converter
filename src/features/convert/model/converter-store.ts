import React, { createContext } from 'react';
import { DEFAULT_AMOUNT, DEFAULT_FROM, DEFAULT_TO } from '@/shared/lib';

export type State = {
  from: string;
  to: string;
  amount: string;
};

export type Action =
  | { type: 'setFrom'; value: string }
  | { type: 'setTo'; value: string }
  | { type: 'setAmount'; value: string }
  | { type: 'swap' };

export const DEFAULT_STATE: State = {
  from: DEFAULT_FROM,
  to: DEFAULT_TO,
  amount: DEFAULT_AMOUNT,
};

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'setFrom':
      return { ...state, from: action.value };
    case 'setTo':
      return { ...state, to: action.value };
    case 'setAmount':
      return { ...state, amount: action.value };
    case 'swap':
      return { ...state, from: state.to, to: state.from };
    default:
      return state;
  }
}

export const StateCtx = createContext<State | null>(null);
export const DispatchCtx = createContext<React.Dispatch<Action> | null>(null);
