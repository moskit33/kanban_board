import { ref, computed } from "vue";
import { useColumns } from "./useColumns.js";
import { useCards } from "./useCards.js";
import { useLocalStorage } from "./useLocalStorage.js";

export function useKanbanBoard() {
  const isDisabledGlobal = ref(false);
  const currentEditingCard = ref(null); // { cardId, columnId, isNew }

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
  } = useColumns(isDisabledGlobal);
  const {
    nextCardId,
    totalCards,
    addCard,
    deleteCard,
    updateCard,
    toggleSortBy,
    clearCards,
    shuffleCards,
    handleCardDrop,
  } = useCards(columns, findColumnById, currentEditingCard);
  const { loadFromLocalStorage, setupAutoSave } = useLocalStorage();

  // Computed properties
  const hasActiveEditing = computed(() => currentEditingCard.value !== null);

  // Methods for managing card editing state
  const setCurrentEditingCard = (cardId, columnId, isNew) => {
    currentEditingCard.value = { cardId, columnId, isNew };
  };

  const clearCurrentEditingCard = () => {
    currentEditingCard.value = null;
  };

  const isCardCurrentlyEditing = (cardId, columnId) => {
    return (
      currentEditingCard.value?.cardId === cardId &&
      currentEditingCard.value?.columnId === columnId
    );
  };

  const cancelCurrentEditing = () => {
    if (!currentEditingCard.value) return;

    const { cardId, columnId, isNew } = currentEditingCard.value;

    if (cardId && isNew) {
      // If the card is new and not saved, delete it
      deleteCard(columnId, cardId);
    }
    clearCurrentEditingCard();
  };

  const toggleDisableGlobal = () => {
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
    currentEditingCard,

    // Computed
    totalCards,
    hasColumns,
    hasActiveEditing,

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
    toggleSortBy,
    clearCards,
    shuffleCards,

    // Drag&drop
    handleCardDrop,

    // Toggle disabled state
    toggleDisableGlobal,

    // Editing state management
    setCurrentEditingCard,
    clearCurrentEditingCard,
    isCardCurrentlyEditing,
    cancelCurrentEditing,

    // Utils
    findColumnById,
    initializeBoard,
  };
}
