import { useState, useEffect, useCallback } from "react";

function readStoredValue(key, initialValue) {
  if (typeof window === "undefined") return initialValue;

  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : initialValue;
  } catch {
    return initialValue;
  }
}

/**
 * Auto-sync state to localStorage with JSON serialization.
 * @param {string} key - localStorage key
 * @param {*} initialValue - Fallback when key is absent
 * @returns {[*, Function, Function]} [value, setValue, removeValue]
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => readStoredValue(key, initialValue));

  const setValue = useCallback(
    (value) => {
      setStoredValue((prev) => {
        const next = value instanceof Function ? value(prev) : value;
        try {
          if (typeof window !== "undefined") {
            window.localStorage.setItem(key, JSON.stringify(next));
          }
        } catch (error) {
          console.warn(`useLocalStorage: failed to set "${key}"`, error);
        }
        return next;
      });
    },
    [key]
  );

  const removeValue = useCallback(() => {
    setStoredValue(initialValue);
    try {
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.warn(`useLocalStorage: failed to remove "${key}"`, error);
    }
  }, [key, initialValue]);

  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === key) {
        setStoredValue(readStoredValue(key, initialValue));
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}

export default useLocalStorage;
