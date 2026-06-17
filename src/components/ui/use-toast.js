import { useState, useEffect } from 'react';

const listeners = new Set();

let memoryState = { toasts: [] };

function dispatch(action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_TOAST':
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, 3), // max 3 toasts at once
      };
    case 'REMOVE_TOAST':
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };
    default:
      return state;
  }
}

export function toast({ title, description, variant = 'default' }) {
  const id = Math.random().toString(36).substr(2, 9);
  
  dispatch({
    type: 'ADD_TOAST',
    toast: {
      id,
      title,
      description,
      variant,
    },
  });

  setTimeout(() => {
    dispatch({ type: 'REMOVE_TOAST', toastId: id });
  }, 3000);
}

export function dismissToast(id) {
  dispatch({ type: 'REMOVE_TOAST', toastId: id });
}

export function useToast() {
  const [state, setState] = useState(memoryState);

  useEffect(() => {
    listeners.add(setState);
    return () => {
      listeners.delete(setState);
    };
  }, []);

  return {
    ...state,
    toast,
    dismissToast,
  };
}
