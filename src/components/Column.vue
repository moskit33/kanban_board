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
        {{ props.column.title }}
      </h3>
      <span class="column-header__count">{{ props.column.cards.length }}</span>
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
        v-for="card in props.column.cards"
        :key="card.id"
        :card="card"
        :isDisabled="isDisabled"
        :columnId="props.column.id"
        @update-card="emit('update-card', props.column.id, $event)"
        @delete-card="emit('delete-card', props.column.id, $event)"
        @dragstart="dragStart"
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
        :text="
          props.column.sortBy === 'asc' ? 'Sort Ascending' : 'Sort Descending'
        "
        icon="sort"
        :disabled="isDisabled"
        @click="emit('sort-cards', props.column.id)"
      />
      <BaseButton
        text="Clear All"
        icon="clear"
        :disabled="isDisabled"
        @click="emit('clear-cards', props.column.id)"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import BaseButton from "./BaseButton.vue";
import Card from "./Card.vue";

const props = defineProps({
  column: {
    type: Object,
    required: true,
  },
  isDisabledGlobal: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits([
  "update-title",
  "delete-column",
  "toggle-editing",
  "add-card",
  "sort-cards",
  "clear-cards",
  "update-card",
  "delete-card",
  "card-drop",
]);

const titleInput = ref(null);
const isDisabled = computed(() => props.column.editingDisabled);

onMounted(() => {
  if (props.column.isNew && titleInput.value) {
    titleInput.value.focus();
  }
});

function updateColumnTitle() {
  if (!titleInput.value) return;

  const newTitle = titleInput.value.textContent.trim();

  if (newTitle) {
    emit("update-title", newTitle, props.column.id);
  } else {
    titleInput.value.textContent = props.column.title || "New Column";
    if (!props.column.title) {
      emit("update-title", "New Column", props.column.id);
    }
  }
  titleInput.value.blur();
}

function toggleEditingDisabled() {
  emit("toggle-editing", props.column.id);
}

function addCard() {
  if (isDisabled.value) return;

  emit("add-card", props.column.id);
}

function deleteColumn() {
  if (isDisabled.value) return;

  emit("delete-column", props.column.id);
}

function dragStart(event) {
  if (props.editingDisabled) {
    event.preventDefault();
    return;
  }
}

function dragOver(event) {
  if (props.editingDisabled) return;
  event.dataTransfer.dropEffect = "move";
}

function drop(event) {
  if (props.editingDisabled) return;

  const cardId = parseInt(event.dataTransfer.getData("cardId"), 10);
  const fromColumnId = parseInt(event.dataTransfer.getData("columnId"), 10);


  emit("card-drop", {
    cardId,
    fromColumnId,
    toColumnId: props.column.id,
  });
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
  max-width: 140px;
  text-align: left;
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
  border-width: 0;
  background-color: #ced9e3;
  padding: 8px;
  margin: 8px 0;
}
.column-actions {
  margin-top: auto;
}
</style>
