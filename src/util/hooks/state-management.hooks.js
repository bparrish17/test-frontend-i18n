import { useState, useEffect, useCallback, useRef, createRef } from 'react';
import { debounce, minBy, range } from 'lodash-es';
import { scrollRefIntoView } from '@util/helpers';

export function useArrayState(initialValue = []) {
  const [addedItems, setAddedItems] = useState(initialValue);

  const _getItemIndexByProp = (itemValue, itemProp) => {
    return addedItems.findIndex((item) => item[itemProp] === itemValue);
  };

  const addItems = (...items) => {
    setAddedItems([...addedItems, ...items]);
  };

  const removeItem = (index) => {
    const updated = [...addedItems];
    updated.splice(index, 1);
    setAddedItems(updated);
  };

  const removeItemByProp = (itemValue, itemProp) => {
    const updated = [...addedItems];
    const indexToRemove = _getItemIndexByProp(itemValue, itemProp);
    if (indexToRemove > -1) {
      updated.splice(indexToRemove, 1);
      setAddedItems(updated);
    }
  };

  const hasItem = (itemValue, itemProp) => {
    return _getItemIndexByProp(itemValue, itemProp) > -1;
  };

  return { addedItems, hasItem, addItems, removeItem, removeItemByProp };
}

export function useSelectedItems(initialArray = []) {
  const [addedItems, setAddedItems] = useState(new Set(initialArray));

  const addItem = (id) => {
    const updated = new Set(addedItems);
    updated.add(id);
    setAddedItems(updated);
  };

  const removeItem = (id) => {
    const updated = new Set(addedItems);
    updated.delete(id);
    setAddedItems(updated);
  };

  return { addedItems, addItem, removeItem };
}

export const useDebouncedProp = (prop, wait = 300) => {
  const [debouncedProp, setDebouncedProp] = useState();

  const debouncePropChange = useCallback(
    debounce((_searchVal) => {
      setDebouncedProp(_searchVal);
    }, wait),
    []
  );

  useEffect(() => debouncePropChange(prop), [prop]);

  return [debouncedProp];
};

export const useListRefs = (itemList) => {
  const refs = useRef([]);
  const itemListDep = JSON.stringify(itemList);

  useEffect(() => {
    if (itemList) {
      refs.current = itemList?.map((_, i) => refs.current[i] || createRef());
    }
  }, [itemListDep]);

  const handleScrollToRef = (itemIndex, options) => {
    const ref = refs?.current[itemIndex];
    scrollRefIntoView(ref, { behavior: 'smooth', block: 'start', ...options });
  };

  const checkIfRefIsInView = useCallback(
    (index) => {
      const el = refs.current[index]?.current;
      if (!el) {
        return;
      }

      const rect = el.getBoundingClientRect();
      return rect.top < window.innerHeight && rect.bottom >= 0;
    },
    [itemListDep]
  );

  const getClosestRefIndex = useCallback(() => {
    const refElements = refs?.current;
    const scrollPosition = window.scrollY + window.innerHeight / 2; // Midpoint of the viewport

    return minBy(range(refElements.length), (refIndex) => {
      const rect = refElements[refIndex]?.current?.getBoundingClientRect();
      const divTopCenter = rect?.top + window.scrollY + rect?.height / 4;
      return Math.abs(scrollPosition - divTopCenter);
    });
  }, [itemListDep]);

  return {
    refs,
    handleScrollToRef,
    checkIfRefIsInView,
    getClosestRefIndex
  };
};

export const useUndoRedo = (initialValue) => {
  const [initialized, setInitialized] = useState(false);
  const [currentState, setCurrentState] = useState(initialValue);
  const [pastStates, setPastStates] = useState([]);
  const [futureStates, setFutureStates] = useState([]);

  const canUndo = pastStates.length > 0;
  const canRedo = futureStates.length > 0;

  const setState = (newState) => {
    // If the state is being set for the first time, don't add it to the past states
    if (!initialized) {
      setInitialized(true);
    } else {
      setPastStates([...pastStates, currentState]);
    }
    setCurrentState(newState);
    setFutureStates([]);
  };

  const undo = () => {
    if (!canUndo) {
      return;
    }

    const previous = pastStates[pastStates.length - 1];
    const newPastStates = pastStates.slice(0, pastStates.length - 1);

    setPastStates(newPastStates);
    setFutureStates([currentState, ...futureStates]);
    setCurrentState(previous);
  };

  const redo = () => {
    if (!canRedo) {
      return;
    }

    const next = futureStates[0];
    const newFutureStates = futureStates.slice(1);

    setPastStates([...pastStates, currentState]);
    setFutureStates(newFutureStates);
    setCurrentState(next);
  };

  const prevState = pastStates[pastStates.length - 1];
  const nextState = futureStates[0];

  const reset = () => {
    setInitialized(false);
    setCurrentState(initialValue);
    setPastStates([]);
    setFutureStates([]);
  };

  return {
    state: currentState,
    setState,
    undo,
    redo,
    canUndo,
    canRedo,
    prevState,
    nextState,
    pastStates,
    futureStates,
    reset
  };
};
