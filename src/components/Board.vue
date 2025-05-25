<template>
  <div class="board">
    <div class="column-container">
      <Column
        v-for="column in columns"
        :columnData="column"
        :key="column.id"
        :isDisabledGlobal="isDisabledGlobal"
        @update-title="updateTitle"
        @delete-column="deleteColumn"
        @toggle-editing="toggleColumnEditing"
        @add-card="addCard"
        @sort-cards="sortCards"
        @clear-cards="clearCards"
        @update-card="updateCard"
        @delete-card="deleteCard"
      />
    </div>
    <div class="board-actions">
      <BaseButton
        class="board-actions__button"
        text="New Column"
        icon="create"
        :disabled="isDisabledGlobal"
        @click="addColumn"
      />
      <BaseButton
        class="board-actions__button"
        text="Shuffle Columns"
        icon="shuffle"
        @click="shuffleColumns"
      />
      <BaseButton
        class="board-actions__button"
        text="Shuffle Cards"
        icon="shuffle"
        @click=""
      />
      <BaseButton
        class="board-actions__button"
        :text="isDisabledGlobal ? 'Resume Editing' : 'Disable Editing'"
        :icon="isDisabledGlobal ? 'resume' : 'disable'"
        @click="toggleEditingGlobal"
      />
    </div>
    <div class="board-actions__title-wrapper">
      <h6 class="board-actions__title">Board Actions</h6>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive, onMounted } from "vue";
import Column from "./Column.vue";
import BaseButton from "./BaseButton.vue";

const initialColumns = ["TO DO", "In Progress", "Done"];
const columns = reactive([]);
const newColumnId = ref(1);
const newCardId = ref(1);
const isDisabledGlobal = ref(false);

onMounted(() => {
  initialColumns.forEach((title, index) => {
    columns.push({
      id: newColumnId.value++,
      title: title,
      cards: [],
      isNew: false,
      editingDisabled: false,
      sortBy: "asc",
    });
  });
});

function addColumn() {
  columns.push({
    id: newColumnId.value++,
    title: "",
    cards: [],
    isNew: true,
    sortBy: "asc",
  });
}

function updateTitle(newTitle, columnId) {
  const column = columns.find((col) => col.id === columnId);
  if (!column) return;

  column.title = newTitle;
  column.isNew = false;
}

function deleteColumn(columnId) {
  const index = columns.findIndex((col) => col.id === columnId);
  if (index !== -1) columns.splice(index, 1);
}

function shuffleColumns() {
  columns.sort(() => Math.random() - 0.5);
}

function toggleEditingGlobal() {
  isDisabledGlobal.value = !isDisabledGlobal.value;
  columns.forEach((column) => {
    column.editingDisabled = isDisabledGlobal.value;
  });
}

function toggleColumnEditing(columnId) {
  const column = columns.find((col) => col.id === columnId);
  if (column) column.editingDisabled = !column.editingDisabled;
}

function addCard(columnId) {
  const column = columns.find((col) => col.id === columnId);
  if (!column) return;

  column.cards.push({
    id: newCardId.value++,
    title: "",
    description: "",
    isNew: true,
  });
}

function sortCards(columnId) {
  const column = columns.find((col) => col.id === columnId);
  if (!column) return;

  column.sortBy = column.sortBy === "asc" ? "desc" : "asc";
  column.cards.sort((a, b) =>
    column.sortBy === "asc"
      ? a.title.localeCompare(b.title)
      : b.title.localeCompare(a.title)
  );
}

function clearCards(columnId) {
  const column = columns.find((col) => col.id === columnId);
  if (column) column.cards.splice(0, column.cards.length);
}

function updateCard(columnId, cardData) {
  const column = columns.find((col) => col.id === columnId);
  if (!column) return;

  const card = column.cards.find((c) => c.id === cardData.id);
  if (!card) return;

  card.title = cardData.title;
  card.description = cardData.description;
  card.isNew = false;
}

function deleteCard(columnId, cardId) {
  const column = columns.find((col) => col.id === columnId);
  if (!column) return;

  const index = column.cards.findIndex((c) => c.id === cardId);
  if (index !== -1) column.cards.splice(index, 1);
}
</script>
<style>
.board {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100%;
}
.column-container {
  display: flex;
  flex-direction: row;
  width: 100%;
  overflow-x: auto;
  padding: 16px;
  height: 100vh;
}
.board-actions {
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-top: 16px;
}

.board-actions__button {
  margin: 0 2px;
}

.board-actions__title {
  font-size: 14px;
  font-weight: 600;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 1) 0%,
    rgba(0, 0, 0, 0.4) 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
  margin: 10px 0;
}
</style>
