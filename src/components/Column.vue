<template>
  <div class="column" @dragover.prevent="dragOver" @drop.prevent="drop">
    <div class="filter" :class="{ 'disabled-filter': isDisabled }"></div>
    <div class="column-header">
      <h3
        class="column-header__title"
        @keydown.enter.prevent="updateColumnTitle"
        @blur="updateColumnTitle"
        :contenteditable="!isDisabled"
        ref="titleInput"
      >
        {{ column.title }}
      </h3>
      <span class="column-header__count">{{ column.cards.length }}</span>
      <BaseButton
        class="column-header__button column-header__button--toggle-disable"
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
        v-for="card in column.cards"
        :key="card.id"
        :card="card"
        :columnId="column.id"
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
        :text="column.sortBy === 'asc' ? 'Sort Ascending' : 'Sort Descending'"
        icon="sort"
        :disabled="isDisabled"
        @click="kanbanBoard.sortCards(column.id)"
      />
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
import { ref, onMounted, computed, inject } from "vue";
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
const isDisabled = computed(() => props.column.editingDisabled);

const column = props.column;

onMounted(() => {
  if (column.isNew && titleInput.value) {
    titleInput.value.focus();
  }
});

function updateColumnTitle() {
  if (!titleInput.value) return;

  const newTitle = titleInput.value.textContent.trim();

  if (newTitle) {
    kanbanBoard.updateColumnTitle(newTitle, column.id);
  } else {
    titleInput.value.textContent = column.title || "New Column";
    if (!column.title) {
      kanbanBoard.updateColumnTitle("New Column", column.id);
    }
  }
  titleInput.value.blur();
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
  color: rgba(0, 0, 0, 0.4);
  margin: 0;
  min-width: 40px;
  max-width: 125px;
  text-align: left;
  min-height: 20px;
  max-height: 60px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  white-space: normal;
}
.column-header__title:focus {
  outline: 2px solid #007bff;
}
.column-header__count {
  font-size: 13px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.6);
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

.column-header__button--toggle-disable {
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
</style>
