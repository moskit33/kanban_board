<template>
  <div class="column" @dragover.prevent="dragOver" @drop.prevent="drop">
    <div class="filter" :class="{ 'disabled-filter': isDisabled }"></div>
    <div class="column-header">
      <h3
        class="column-header__title"
        :class="{ 'column-header__title--editing': isEditing }"
        @click="startEditing"
        @keydown.enter.prevent="updateColumnTitle"
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
      :disabled="isDisabled"
      @click="addCard"
    />
    <div class="column-actions">
      <BaseButton
        class="column-actions__button"
        icon="sort"
        :disabled="isDisabled"
        @click="kanbanBoard.toggleSortBy(column.id)"
      >
        Sort
        <span class="column-actions__button--sorting">{{
          column.sortBy === "asc" ? "Ascending" : "Descending"
        }}</span>
      </BaseButton>
      <BaseButton
        text="Clear All"
        icon="clear"
        :disabled="isDisabled"
        @click="kanbanBoard.clearCards(column.id)"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, inject, watch, nextTick } from "vue";
import BaseButton from "./BaseButton.vue";
import Card from "./Card.vue";
import { useDragAndDrop } from "../composables/useDragAndDrop.js";

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
const sortedCards = computed(() => {
  return props.column.cards.sort((a, b) => {
    return props.column.sortBy === "asc"
      ? a.title.localeCompare(b.title)
      : b.title.localeCompare(a.title);
  });
});

const column = props.column;

watch(
  () => isDisabled.value,
  (isDisabled) => {
    if (isDisabled && isEditing.value) {
      titleInput.value.textContent = column.title;
      isEditing.value = false;
    }
  }
);

function startEditing() {
  if (isDisabled.value) return;

  isEditing.value = true;
  nextTick(() => {
    titleInput.value.focus();
  });
}

function updateColumnTitle() {
  if (!titleInput.value) return;

  const newTitle = titleInput.value.textContent.trim();

  if (newTitle) {
    kanbanBoard.updateColumnTitle(newTitle, column.id);
  } else {
    titleInput.value.textContent = column.title;
  }
  isEditing.value = false;
}

function toggleEditingDisabled() {
  kanbanBoard.toggleColumnEditing(column.id);
}

function addCard() {
  if (isDisabled.value) return;

  kanbanBoard.addCard(column.id);
}

function deleteColumn() {
  if (isDisabled.value) return;

  kanbanBoard.deleteColumn(column.id);
}

function dragOver(event) {
  handleDragOver(event, isDisabled.value);
}

function drop(event) {
  if (isDisabled.value) return;

  const dropData = handleDrop(event);
  if (dropData) {
    kanbanBoard.handleCardDrop({
      ...dropData,
      toColumnId: column.id,
    });
  }
}
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
  min-height: 20px;
  max-height: 60px;
  overflow: hidden;
  line-clamp: 3;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  white-space: normal;
}
.column-header__title--editing {
  outline: 2px solid #007bff;
  background: #fff;
  padding: 0 2px;
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
