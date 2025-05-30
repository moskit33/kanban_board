import { ref, reactive, computed } from "vue";
import { DEFAULT_COLUMNS, SORT_BY } from "../constants";

export function useColumns(isDisabledGlobal = ref(false)) {
  const columns = reactive([]);
  const nextColumnId = ref(1);

  const hasColumns = computed(() => columns.length > 0);

  const findColumnById = (columnId) => {
    return columns.find((col) => col.id === columnId) || null;
  };

  const createDefaultColumns = () => {
    DEFAULT_COLUMNS.forEach((title) => {
      columns.push({
        id: nextColumnId.value++,
        title,
        cards: [],
        isNew: false,
        editingDisabled: isDisabledGlobal.value,
        sortBy: SORT_BY.ASC,
      });
    });
  };

  const addColumn = () => {
    columns.push({
      id: nextColumnId.value++,
      title: "New Column",
      cards: [],
      editingDisabled: isDisabledGlobal.value,
      sortBy: SORT_BY.ASC,
    });
  };

  const deleteColumn = (columnId) => {
    const index = columns.findIndex((col) => col.id === columnId);
    if (index !== -1) {
      columns.splice(index, 1);
    }
  };

  const updateColumnTitle = (newTitle, columnId) => {
    const column = findColumnById(columnId);
    if (column) {
      column.title = newTitle;
      column.isNew = false;
    }
  };

  const shuffleColumns = () => {
    for (let i = columns.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [columns[i], columns[j]] = [columns[j], columns[i]];
    }
  };

  const toggleColumnEditing = (columnId) => {
    const column = findColumnById(columnId);
    if (column) {
      column.editingDisabled = !column.editingDisabled;
    }
  };

  return {
    // State
    columns,
    nextColumnId,

    // Computed
    hasColumns,

    // Methods
    findColumnById,
    createDefaultColumns,
    addColumn,
    deleteColumn,
    updateColumnTitle,
    shuffleColumns,
    toggleColumnEditing,
  };
}
