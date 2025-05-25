<template>
  <div class="column">
    <div class="filter" :class="{ 'disabled-filter': isDisabled }"></div>
    <div class="column-header">
      <h3
        class="column-header__title"
        @keydown.enter.prevent="updateColumnTitle"
        @blur="updateColumnTitle"
        :contenteditable="!isDisabled"
        ref="titleInput"
      >
        {{ props.columnData.title }}
      </h3>
      <span class="column-header__count">{{
        props.columnData.cards.length
      }}</span>
      <BaseButton
        class="column-header__button column-header__button--disable"
        :text="isDisabled ? 'Unlock Column' : 'Disable Editing'"
        :icon="isDisabled ? 'resume' : 'disable'"
        @click="toogleEditingDisabled"
      />
      <BaseButton
        class="column-header__button"
        text="Delete Column"
        icon="cancel"
        :disabled="isDisabled"
        @click="emit('delete-column', props.columnData.id)"
      />
    </div>

    <div class="cards-list">
      <Card
        v-for="card in props.columnData.cards"
        :key="card.id"
        :card="card"
        :isDisabled="isDisabled"
        @update-card="emit('update-card', props.columnData.id, $event)"
        @delete-card="emit('delete-card', props.columnData.id, $event)"
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
          props.columnData.sortBy === 'asc'
            ? 'Sort Ascending'
            : 'Sort Descending'
        "
        icon="sort"
        :disabled="isDisabled"
        @click="emit('sort-cards', props.columnData.id)"
      />
      <BaseButton
        text="Clear All"
        icon="clear"
        :disabled="isDisabled"
        @click="emit('clear-cards', props.columnData.id)"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import BaseButton from "./BaseButton.vue";
import Card from "./Card.vue";

const props = defineProps({
  columnData: {
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
]);

const titleInput = ref(null);
const isDisabled = computed(() => props.columnData.isEditingDisabled);

onMounted(() => {
  console.log("Column mounted with columnData:", props.columnData);

  if (props.columnData.isNew && titleInput.value) {
    titleInput.value.focus();
    titleInput.value.textContent = "";
  }
});

function updateColumnTitle() {
  if (!titleInput.value) return;

  const newTitle = titleInput.value.textContent.trim();
  if (newTitle) {
    console.log("Updating column title to:", props);

    emit("update-title", newTitle, props.columnData.id);
    titleInput.value.blur();
  } else {
    titleInput.value.textContent = props.columnData.title; // Reset to original title
  }
}
function toogleEditingDisabled() {
  emit("toggle-editing", props.columnData.id);
}

function addCard() {
  if (isDisabled.value) return;

  emit("add-card", props.columnData.id);
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
  color: rgba(0, 0, 0, 0.6);
  margin: 0 auto 0 0;
  width: 140px;
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
}
.cards-list {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.cards-list > *:last-child {
  margin-bottom: 0 !important;
}

.column-header__button--disable {
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
