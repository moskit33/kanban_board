import { watch } from "vue";

const STORAGE_KEY = "board-state";

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
    watch(
      columns,
      () => {
        const state = getState();
        saveToLocalStorage(state);
      },
      { deep: true }
    );
  };

  return {
    loadFromLocalStorage,
    setupAutoSave,
  };
}
