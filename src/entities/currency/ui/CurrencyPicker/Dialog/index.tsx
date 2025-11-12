import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { SearchIcon } from '@/shared/assets/icons/SearchIcon.tsx';
import { CrossIcon } from '@/shared/assets/icons/CrossIcon.tsx';

import { OptionRow } from '../OptionRow';
import { filterByQuery } from '../helpers';
import type { CurrencyOption } from '../types';

import styles from './styles.module.scss';

type Props = {
  title?: string;
  value: string;
  onSelect: (code: string) => void;
  onClose: () => void;
};

export const Dialog: React.FC<Props> = ({
  title = 'Select currency',
  value,
  onSelect,
  onClose,
}) => {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  const activeRef = useRef(0);
  useEffect(() => {
    activeRef.current = activeIndex;
  }, [activeIndex]);

  const searchRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const rowStepRef = useRef<number>(36);

  const list: CurrencyOption[] = useMemo(() => filterByQuery(query), [query]);

  useEffect(() => {
    searchRef.current?.focus();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  useEffect(() => {
    const wrap = listRef.current;
    if (!wrap) return;

    const foundIndex = list.findIndex((c) => c.code === value);
    const fallback = Math.min(activeRef.current, Math.max(0, list.length - 1));
    const nextIndex = foundIndex >= 0 ? foundIndex : fallback;

    setActiveIndex(nextIndex);

    requestAnimationFrame(() => {
      const first = wrap.querySelector<HTMLElement>('[data-idx="0"]');
      const second = wrap.querySelector<HTMLElement>('[data-idx="1"]');

      if (first && second) {
        rowStepRef.current = Math.max(1, second.offsetTop - first.offsetTop);
      } else if (first) {
        rowStepRef.current = first.offsetHeight || rowStepRef.current || 36;
      }

      const step = rowStepRef.current;
      const targetTop = nextIndex * step - (wrap.clientHeight - step) / 2;
      wrap.scrollTop = clamp(targetTop, 0, wrap.scrollHeight - wrap.clientHeight);
    });
  }, [list, value]);

  function clamp(n: number, min: number, max: number) {
    return Math.max(min, Math.min(max, n));
  }

  function getViewportIndexes() {
    const wrap = listRef.current!;
    const step = rowStepRef.current || 36;
    const first = Math.floor(wrap.scrollTop / step);
    const last = Math.floor((wrap.scrollTop + wrap.clientHeight - 1) / step);
    return { first, last, step };
  }

  function moveActive(dir: -1 | 1) {
    const wrap = listRef.current;
    if (!wrap || list.length === 0) return;

    const next = clamp(activeIndex + dir, 0, list.length - 1);
    if (next === activeIndex) return;

    setActiveIndex(next);

    requestAnimationFrame(() => {
      const { first, last, step } = getViewportIndexes();
      if (next > last) wrap.scrollTop = wrap.scrollTop + step;
      else if (next < first) wrap.scrollTop = Math.max(0, wrap.scrollTop - step);
    });
  }

  const onKeyDownLocal = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      e.stopPropagation();
      moveActive(1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      e.stopPropagation();
      moveActive(-1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      const item = list[activeIndex];
      if (item) onSelect(item.code);
    }
  };

  const onBackdrop = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  const body = (
    <div className={styles.backdrop} onMouseDown={onBackdrop}>
      <div
        role="dialog"
        aria-modal="true"
        className={styles.modal}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          <div className={styles.title}>{title}</div>
          <button type="button" className={styles.close} aria-label="Close" onClick={onClose}>
            <CrossIcon />
          </button>
        </div>

        <p className={styles.subtitle}>
          Choose a currency from the list below or use the search bar to find a specific currency.
        </p>

        <div className={styles.searchWrap}>
          <span className={styles.searchIcon} aria-hidden>
            <SearchIcon />
          </span>
          <input
            ref={searchRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={styles.searchInput}
            placeholder="Search code or name"
            onKeyDown={onKeyDownLocal}
            aria-activedescendant={`currency-opt-${activeIndex}`}
          />
        </div>

        <div
          ref={listRef}
          id="currency-listbox"
          className={styles.list}
          tabIndex={0}
          onKeyDown={onKeyDownLocal}
          role="listbox"
        >
          {list.length === 0 && <div className={styles.empty}>Nothing found</div>}
          {list.map((currency, i) => (
            <OptionRow
              key={currency.code}
              item={currency}
              index={i}
              active={i === activeIndex}
              selected={currency.code === value}
              onHover={setActiveIndex}
              onSelect={onSelect}
            />
          ))}
        </div>
      </div>
    </div>
  );

  return createPortal(body, document.body);
};
