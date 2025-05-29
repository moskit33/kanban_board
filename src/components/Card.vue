<template>
  <div
    class="card"
    :class="{ 'card--disable': isDisabled, 'card--editing': isEditing }"
    @contextmenu.prevent="onDelete"
    @dragstart="dragStart"
    @dblclick="onEdit"
    :draggable="!isDisabled"
  >
    <p
      class="card__title"
      :contenteditable="isEditing"
      @keydown.enter.prevent="updateCard"
      @input="onInput"
      ref="titleInput"
      data-placeholder="Add Title"
    >
      {{ card.title }}
    </p>
    <p
      class="card__description"
      :contenteditable="isEditing"
      @keydown.enter.prevent="updateCard"
      @input="onInput"
      ref="descriptionInput"
      data-placeholder="Add Description"
    >
      {{ card.description }}
    </p>
    <div class="card__actions" v-if="isEditing">
      <BaseButton
        class="card__button"
        text="Save Changes"
        icon="save"
        @click="updateCard"
        :disabled="!hasChanges"
      />
      <BaseButton
        class="card__button"
        text="Cancel"
        icon="cancel"
        @click="cancelEditing"
      />
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  onMounted,
  nextTick,
  computed,
  inject,
  watch,
  onUnmounted,
} from "vue";
import BaseButton from "./BaseButton.vue";
import { useDragAndDrop } from "../composables/useDragAndDrop.js";

const props = defineProps({
  card: {
    type: Object,
    default: () => ({}),
  },
  columnId: {
    type: Number,
    required: true,
  },
  isColumnDisabled: {
    type: Boolean,
    default: false,
  },
});

const kanbanBoard = inject("kanbanBoard");

const { startCardDrag } = useDragAndDrop();

const titleInput = ref(null);
const descriptionInput = ref(null);
const isEditing = ref(false);
const originalTitle = ref("");
const originalDescription = ref("");
const hasChanges = ref(false);

// Computed
const isDisabled = computed(() => props.isColumnDisabled);

onMounted(() => {
  window.addEventListener("beforeunload", cancelEditing);
  if (props.card.isNew && titleInput.value) {
    startEditing();
  }
});

watch(
  () => isDisabled.value,
  (isDisabled) => {
    // If the column is disabled and currently being edited, reset the state
    if (isDisabled && isEditing.value) {
      cancelEditing();
    }
  }
);

function startEditing(event) {
  isEditing.value = true;
  originalTitle.value = props.card.title;
  originalDescription.value = props.card.description;

  nextTick(() => {
    // Focus the title input if it's a new card or the event target is not focused
    props.card.isNew ? titleInput.value.focus() : event?.target?.focus();
  });
}

function resetState() {
  isEditing.value = false;
  hasChanges.value = false;
  originalTitle.value = "";
  originalDescription.value = "";
}

function updateCard() {
  if (!hasChanges.value) return;

  const titleValue = titleInput.value?.textContent?.trim() || "";
  const descriptionValue = descriptionInput.value?.textContent?.trim() || "";
  // For new cards title required
  if (props.card.isNew && !titleValue) return;

  const updatedCard = {
    id: props.card.id,
    title: titleValue,
    description: descriptionValue,
  };

  kanbanBoard.updateCard(props.columnId, updatedCard);

  resetState();
}

function onEdit(event) {
  if (isDisabled.value || isEditing.value) return;

  startEditing(event);
}

function cancelEditing() {
  if (!isEditing.value) return;

  if (props.card.isNew) {
    return kanbanBoard.deleteCard(props.columnId, props.card.id);
  }

  restoreOriginalData();
  resetState();
}

function restoreOriginalData() {
  titleInput.value.textContent = props.card.title;
  descriptionInput.value.textContent = props.card.description;
}

function onInput() {
  if (!isEditing.value) return;

  const currentContent = {
    title: titleInput.value?.textContent?.trim() || "",
    description: descriptionInput.value?.textContent?.trim() || "",
  };
  hasChanges.value = hasContentChanged(currentContent);
}

function hasContentChanged(currentContent) {
  // Required title for cards
  if (!currentContent.title) return false;

  return (
    currentContent.title !== originalTitle.value ||
    currentContent.description !== originalDescription.value
  );
}

function onDelete() {
  if (isDisabled.value) return;

  kanbanBoard.deleteCard(props.columnId, props.card.id);
}

function dragStart(event) {
  if (isDisabled.value) {
    event.preventDefault();
    return;
  }

  startCardDrag(event, props.card.id, props.columnId);
}

onUnmounted(() => {
  window.removeEventListener("beforeunload", cancelEditing);
});
</script>

<style>
.card {
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 8px;
  text-align: left;
  font-size: 14px;
  position: relative;
  min-width: 200px;
}
.card--disable::after {
  pointer-events: none;
}
.card::after {
  content: "";
  display: block;
  width: 50px;
  height: 50px;
  position: absolute;
  cursor: grab;
  top: 0;
  right: 0;
  background: url("../assets/icons/drag&drop.svg") no-repeat center center;
}
.card.dragging {
  opacity: 0.9;
  box-shadow: 0 8px 24px 0 rgba(0, 123, 255, 0.25),
    0 1.5px 6px 0 rgba(0, 0, 0, 0.08);
  transform: scale(0.97);
  transition: box-shadow 0.2s, opacity 0.2s, transform 0.2s;
  z-index: 1000;
  cursor: grabbing;
}
.card.dragging::after {
  cursor: grabbing;
}

.card__title {
  color: #1a1a1a;
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 4px;
}
.card__description {
  font-size: 14px;
  font-weight: 500;
  color: #b3b3b3;
  margin: 0;
}

.card--editing {
  outline: 2px solid #007bff;
  outline-offset: -2px;
}
.card--editing::after {
  display: none;
}
.card--editing > .card__title,
.card--editing > .card__description {
  outline: none;
  background-color: #f0f8ff;
  padding: 2px 4px;
}

.card__description:empty:not(:focus):before {
  content: attr(data-placeholder);
  pointer-events: none;
  font-weight: 600;
}

.card__actions {
  display: flex;
  justify-content: flex-start;
  margin-top: 8px;
}
.card__button:first-child {
  margin-left: 0;
}
</style>
