import { useCallback, useRef, useState } from 'react';

let idCounter = 0;

export default function useToast() {
  const [toasts, setToasts] = useState([]);
  const timers = useRef({});

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    clearTimeout(timers.current[id]);
    delete timers.current[id];
  }, []);

  const push = useCallback(
    (toast) => {
      const id = ++idCounter;
      const duration = toast.duration ?? 2400;
      setToasts((prev) => [...prev, { id, ...toast }]);
      timers.current[id] = setTimeout(() => dismiss(id), duration);
      return id;
    },
    [dismiss]
  );

  return { toasts, push, dismiss };
}
