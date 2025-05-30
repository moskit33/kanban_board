<template>
  <div class="column" @dragover.prevent="dragOver" @drop.prevent="drop">
    <div class="filter" :class="{ 'disabled-filter': isDisabled }"></div>
    <div class="column-header">
      <h3
        class="column-header__title"
        :class="{ 'column-header__title--editing': isEditing }"
        @click="startEditing"
        @keydown.enter.prevent="updateColumnTitle"
        @blur="cancelEditing"
        :contenteditable="isEditing"
        ref="titleInput"
      >
        {{ column.title }}
      </h3>
      <span class="column-header__count">{{ column.cards.length }}</span>
      <BaseButton
        class="column-header__button column-header__button--toggle"
        :text="isDisabled ? 'Unlock Column' : 'Disable Editing'"
        :icon="isDisabled ? 'resume' : 'disable'"
        @click="toggleEditingDisabled"
      />
      <BaseButton
        class="column-header__button"
        text="Delete Column"
        icon="cancel"
        :disabled="isDisabled"
        @click="deleteColumn"
      />
    </div>
    <div class="cards-list">
      <Card
        v-for="card in sortedCards"
        :key="card.id"
        :card="card"
        :columnId="column.id"
        :isColumnDisabled="isDisabled"
      />
    </div>
    <BaseButton
      class="new-card-button"
      text="New Card"
      icon="create"
      :disabled="isNewCardDisabled"
      @click="addCard"
    />
    <div class="column-actions">
      <BaseButton
        class="column-actions__button"
        icon="sort"
        :disabled="isDisabled"
        @click="handleToggleSortBy"
      >
        Sort
        <span class="column-actions__button--sorting">{{
          column.sortBy === SORT_BY.ASC ? "Ascending" : "Descending"
        }}</span>
      </BaseButton>
      <BaseButton
        text="Clear All"
        icon="clear"
        :disabled="isDisabled"
        @click="handleClearCards"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, inject, watch, nextTick } from "vue";
import BaseButton from "./BaseButton.vue";
import Card from "./Card.vue";
import { useDragAndDrop } from "../composables/useDragAndDrop.js";
import { SORT_BY } from "../constants";

const props = defineProps({
  column: {
    type: Object,
    required: true,
  },
});

const kanbanBoard = inject("kanbanBoard");

const { handleDragOver, handleDrop } = useDragAndDrop();

const titleInput = ref(null);
const isEditing = ref(false);
const isDisabled = computed(() => props.column.editingDisabled);
const isNewCardDisabled = computed(() => {
  return isDisabled.value || kanbanBoard.hasActiveEditing.value;
});
const sortedCards = computed(() => {
  const originalCards = [...props.column.cards];

  const newCardIndex = originalCards.findIndex((card) => card.isNew);
  const newCard =
    newCardIndex !== -1 ? originalCards.splice(newCardIndex, 1)[0] : null;

  const sortedExistingCards = originalCards.sort((a, b) => {
    return props.column.sortBy === SORT_BY.ASC
      ? a.title.localeCompare(b.title)
      : b.title.localeCompare(a.title);
  });

  return newCard ? [...sortedExistingCards, newCard] : sortedExistingCards;
});

const column = props.column;

watch(isDisabled, (isDisabled) => {
  if (isDisabled && isEditing.value) {
    cancelEditing();
  }
});

const cancelEditing = () => {
  if (!isEditing.value) return;

  titleInput.value.textContent = column.title;
  isEditing.value = false;
};

const startEditing = () => {
  if (isDisabled.value) return;

  isEditing.value = true;
  nextTick(() => {
    titleInput.value.focus();
  });
};

const updateColumnTitle = () => {
  if (!titleInput.value) return;

  const newTitle = titleInput.value.textContent.trim();

  if (newTitle) {
    kanbanBoard.updateColumnTitle(newTitle, column.id);
  } else {
    titleInput.value.textContent = column.title;
  }
  isEditing.value = false;
};

const toggleEditingDisabled = () => {
  // Cancel any active editing before toggling
  if (kanbanBoard.hasActiveEditing.value) {
    kanbanBoard.cancelCurrentEditing();
  }

  kanbanBoard.toggleColumnEditing(column.id);
};

const addCard = () => {
  if (isNewCardDisabled.value) return;

  kanbanBoard.addCard(column.id);
};

const deleteColumn = () => {
  if (isDisabled.value) return;
  // Check if active editing before column delete
  if (kanbanBoard.hasActiveEditing.value) {
    kanbanBoard.cancelCurrentEditing();
  }

  kanbanBoard.deleteColumn(column.id);
};

const handleClearCards = () => {
  if (isDisabled.value) return;
  // Cancel any active editing before clearing cards
  if (kanbanBoard.hasActiveEditing.value) {
    kanbanBoard.cancelCurrentEditing();
  }

  kanbanBoard.clearCards(column.id);
};

const handleToggleSortBy = () => {
  if (isDisabled.value) return;
  // Cancel any active editing before sorting
  if (kanbanBoard.hasActiveEditing.value) {
    kanbanBoard.cancelCurrentEditing();
  }

  kanbanBoard.toggleSortBy(column.id);
};

const dragOver = (event) => {
  if (isDisabled.value) return;

  handleDragOver(event);
};

const drop = (event) => {
  if (isDisabled.value) return;
  // Cancel any active editing before handling drop
  if (kanbanBoard.hasActiveEditing.value) {
    kanbanBoard.cancelCurrentEditing();
  }

  const dropData = handleDrop(event);
  if (dropData) {
    kanbanBoard.handleCardDrop({
      ...dropData,
      toColumnId: column.id,
    });
  }
};
</script>

<style>
.column {
  display: flex;
  flex-direction: column;
  min-width: 448px;
  background-color: #eceff2;
  border-radius: 12px;
  padding: 16px;
  margin: 0 12px;
  height: 100%;
  position: relative;
}
.disabled-filter {
  opacity: 0.5;
  pointer-events: none;
  filter: grayscale(0.5);
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 5;
  background: rgba(0, 0, 0, 0.3);
  border-radius: inherit;
}

.column-header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 16px;
}
.column-header__title {
  font-size: 13px;
  font-weight: 600;
  color: #a6a8aa;
  margin: 0;
  min-width: 40px;
  max-width: 125px;
  text-align: left;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.5;
  max-height: 3em;
  word-break: break-word;
  overflow-wrap: break-word;
}
.column-header__title--editing {
  outline: 2px solid #007bff;
  background: #fff;
  padding: 0 2px;
  display: block;
  -webkit-line-clamp: none;
  line-clamp: none;
  max-height: none;
  overflow: visible;
}
.column-header__count {
  font-size: 13px;
  font-weight: 600;
  color: #5e6061;
  margin-left: 8px;
  margin-right: auto;
}
.cards-list {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.cards-list > *:last-child {
  margin-bottom: 0 !important;
}

.column-header__button:last-child {
  margin-right: 0;
}

.column-header__button--toggle {
  z-index: 10;
}

.new-card-button {
  width: 100%;
  border-radius: 8px;
  outline-color: #ced9e3;
  background-color: #ced9e3;
  padding: 8px;
  margin: 8px 0;
}
.column-actions {
  margin-top: auto;
}
.column-actions__button--sorting {
  color: #b3b3b3;
  padding-left: 6px;
}
</style>
