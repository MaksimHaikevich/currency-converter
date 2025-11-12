import React, { useEffect, useReducer } from 'react';

import { LS_CONVERTER, LS_SELECTION, saveJSON, useLocalStorage } from '@/shared/lib';

import { StateCtx, DispatchCtx, DEFAULT_STATE, reducer } from './converter-store';

export const ConverterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [persisted, setPersisted] = useLocalStorage(LS_CONVERTER, DEFAULT_STATE);
  const [state, dispatch] = useReducer(reducer, persisted);

  useEffect(() => {
    setPersisted({ from: state.from, to: state.to, amount: state.amount });
  }, [state.from, state.to, state.amount, setPersisted]);

  useEffect(() => {
    saveJSON(LS_SELECTION, { from: state.from, to: state.to });
  }, [state.from, state.to]);

  return (
    <StateCtx.Provider value={state}>
      <DispatchCtx.Provider value={dispatch}>{children}</DispatchCtx.Provider>
    </StateCtx.Provider>
  );
};
