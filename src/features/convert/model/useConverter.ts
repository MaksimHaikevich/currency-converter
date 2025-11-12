import { useContext } from 'react';
import { StateCtx, DispatchCtx } from './converter-store';

export function useConverterState() {
  const ctx = useContext(StateCtx);
  if (!ctx) throw new Error('useConverterState must be used within ConverterProvider');
  return ctx;
}

export function useConverterDispatch() {
  const ctx = useContext(DispatchCtx);
  if (!ctx) throw new Error('useConverterDispatch must be used within ConverterProvider');
  return ctx;
}

export function useConverter() {
  return { state: useConverterState(), dispatch: useConverterDispatch() };
}
