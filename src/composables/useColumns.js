import { ref, reactive, computed } from "vue";

const INITIAL_COLUMNS = ["TODO", "In progress", "Done"];

export function useColumns() {
  const columns = reactive([]);
  const nextColumnId = ref(1);

  const hasColumns = computed(() => columns.length > 0);

  const findColumnById = (columnId) => {
    return columns.find((col) => col.id === columnId) || null;
  };

  const createDefaultColumns = () => {
    INITIAL_COLUMNS.forEach((title) => {
      columns.push({
        id: nextColumnId.value++,
        title,
        cards: [],
        isNew: false,
        editingDisabled: false,
        sortBy: "asc",
      });
    });
  };

  const addColumn = () => {
    columns.push({
      id: nextColumnId.value++,
      title: "",
      cards: [],
      isNew: true,
      editingDisabled: false,
      sortBy: "asc",
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
