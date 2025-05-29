import { watch } from "vue";
import { debounce } from "../utils/debounce.js";
import { STORAGE_KEY } from "../constants";

export function useLocalStorage() {
  const saveToLocalStorage = (state) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error("Error localStorage saving", error);
    }
  };

  const loadFromLocalStorage = () => {
    try {
      const savedState = localStorage.getItem(STORAGE_KEY);
      if (!savedState) return null;

      return JSON.parse(savedState);
    } catch (error) {
      console.error("Error localStorage loading", error);
      return null;
    }
  };

  const setupAutoSave = (columns, getState) => {
    // Debounce save in localStorage
    const debouncedSave = debounce(() => {
      const state = getState();
      saveToLocalStorage(state);
    }, 500);

    watch(
      columns,
      () => {
        debouncedSave();
      },
      { deep: true }
    );
  };

  return {
    loadFromLocalStorage,
    setupAutoSave,
  };
}
