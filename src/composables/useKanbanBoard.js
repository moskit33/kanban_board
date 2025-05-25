import { ref } from "vue";
import { useColumns } from "./useColumns.js";
import { useCards } from "./useCards.js";
import { useLocalStorage } from "./useLocalStorage.js";

export function useKanbanBoard() {
  const {
    columns,
    nextColumnId,
    hasColumns,
    findColumnById,
    createDefaultColumns,
    addColumn,
    deleteColumn,
    updateColumnTitle,
    shuffleColumns,
    toggleColumnEditing,
  } = useColumns();

  const {
    nextCardId,
    totalCards,
    addCard,
    deleteCard,
    updateCard,
    sortCards,
    clearCards,
    shuffleCards,
    handleCardDrop,
  } = useCards(columns, findColumnById);

  const { loadFromLocalStorage, setupAutoSave } = useLocalStorage();

  const isDisabledGlobal = ref(false);

  const toggleEditingGlobal = () => {
    isDisabledGlobal.value = !isDisabledGlobal.value;
    columns.forEach((column) => {
      column.editingDisabled = isDisabledGlobal.value;
    });
  };

  const getStateForStorage = () => ({
    columns: columns,
    nextColumnId: nextColumnId.value,
    nextCardId: nextCardId.value,
    isDisabledGlobal: isDisabledGlobal.value,
  });

  const initializeBoard = async () => {
    const savedState = loadFromLocalStorage();

    if (savedState) {
      columns.splice(0, columns.length, ...savedState.columns);
      nextColumnId.value = savedState.nextColumnId || 1;
      nextCardId.value = savedState.nextCardId || 1;
      isDisabledGlobal.value = savedState.isDisabledGlobal || false;
    } else {
      createDefaultColumns();
    }

    setupAutoSave(columns, getStateForStorage);
  };

  return {
    // State
    columns,
    nextColumnId,
    nextCardId,
    isDisabledGlobal,

    // Computed
    totalCards,
    hasColumns,

    // Column methods
    addColumn,
    deleteColumn,
    updateColumnTitle,
    shuffleColumns,
    toggleColumnEditing,

    // Card methods
    addCard,
    deleteCard,
    updateCard,
    sortCards,
    clearCards,
    shuffleCards,

    // Drag&drop
    handleCardDrop,

    // Toggle disabled state
    toggleEditingGlobal,

    // Utils
    findColumnById,
    initializeBoard,
  };
}
