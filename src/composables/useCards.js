import { ref, computed } from "vue";
import { SORT_BY } from "../constants";

export function useCards(columns, findColumnById) {
  const nextCardId = ref(1);

  const totalCards = computed(() =>
    columns.reduce((total, column) => total + column.cards.length, 0)
  );

  const addCard = (columnId) => {
    const column = findColumnById(columnId);
    if (!column) return;

    column.cards.push({
      id: nextCardId.value++,
      title: "",
      description: "",
      isNew: true,
    });
  };

  const deleteCard = (columnId, cardId) => {
    const column = findColumnById(columnId);
    if (!column) return;

    const cardIndex = column.cards.findIndex((card) => card.id === cardId);
    if (cardIndex !== -1) {
      column.cards.splice(cardIndex, 1);
    }
  };

  const updateCard = (columnId, cardData) => {
    const column = findColumnById(columnId);
    if (!column) return;

    const card = column.cards.find((c) => c.id === cardData.id);
    if (card) {
      Object.assign(card, {
        title: cardData.title,
        description: cardData.description,
        isNew: false,
      });
    }
  };

  const toggleSortBy = (columnId) => {
    const column = findColumnById(columnId);
    if (!column) return;

    column.sortBy = column.sortBy === SORT_BY.ASC ? SORT_BY.DESC : SORT_BY.ASC;
  };

  const clearCards = (columnId) => {
    const column = findColumnById(columnId);
    if (column) {
      column.cards.splice(0, column.cards.length);
    }
  };

  const shuffleCards = () => {
    const allCards = columns.flatMap((col) =>
      col.cards.splice(0, col.cards.length)
    );
    while (allCards.length) {
      const randomCardIdx = Math.floor(Math.random() * allCards.length);
      const randomColIdx = Math.floor(Math.random() * columns.length);
      columns[randomColIdx].cards.push(allCards[randomCardIdx]);
      allCards.splice(randomCardIdx, 1);
    }
  };

  const handleCardDrop = ({ cardId, fromColumnId, toColumnId }) => {
    if (fromColumnId === toColumnId) return;

    const fromColumn = findColumnById(fromColumnId);
    const toColumn = findColumnById(toColumnId);

    if (!fromColumn || !toColumn) return;

    const cardIndex = fromColumn.cards.findIndex((card) => card.id === cardId);
    if (cardIndex !== -1) {
      const [card] = fromColumn.cards.splice(cardIndex, 1);
      toColumn.cards.push(card);
    }
  };

  return {
    // State
    nextCardId,

    // Computed
    totalCards,

    // Methods
    addCard,
    deleteCard,
    updateCard,
    toggleSortBy,
    clearCards,
    shuffleCards,
    handleCardDrop,
  };
}
