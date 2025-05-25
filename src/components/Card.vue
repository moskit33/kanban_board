<template>
  <div
    class="card"
    :class="{ 'card--disable': isDisabled }"
    @contextmenu.prevent="onDelete"
    @blur="updateCard"
    @dragstart="dragStart"
    draggable="true"
  >
    <p
      class="card__title"
      :contenteditable="isEditing"
      @keydown.enter.prevent="updateCard"
      @input="onInput"
      @dblclick="onEdit"
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
      @dblclick="onEdit"
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
import { ref, onMounted, nextTick, computed, inject } from "vue";
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
const isDisabled = computed(
  () =>
    kanbanBoard.isDisabledGlobal.value ||
    kanbanBoard.findColumnById(props.columnId)?.editingDisabled
);

onMounted(() => {
  if (props.card.isNew && titleInput.value) {
    isEditing.value = true;
    nextTick(() => {
      if (titleInput.value) {
        titleInput.value.focus();
        titleInput.value.textContent = "";
      }
    });
  }
});

function updateCard() {
  if (!hasChanges.value) return;

  const updatedCard = {
    id: props.card.id,
    title: titleInput.value?.textContent?.trim() || "",
    description: descriptionInput.value?.textContent?.trim() || "",
  };

  kanbanBoard.updateCard(props.columnId, updatedCard);

  isEditing.value = false;
  hasChanges.value = false;
}

function onEdit(event) {
  if (isDisabled.value || isEditing.value) return;

  isEditing.value = true;
  originalTitle.value = props.card.title;
  originalDescription.value = props.card.description;

  nextTick(() => {
    if (props.card.isNew) titleInput.value.focus();
    else {
      event?.target?.focus();
    }
  });
}

function cancelEditing() {
  if (props.card.isNew) {
    return kanbanBoard.deleteCard(props.columnId, props.card.id);
  }

  restoreOriginalData();

  isEditing.value = false;
  hasChanges.value = false;
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
  return (
    currentContent.title !== originalTitle.value ||
    currentContent.description !== originalDescription.value
  );
}

function onDelete() {
  kanbanBoard.deleteCard(props.columnId, props.card.id);
}

function dragStart(event) {
  startCardDrag(event, props.card.id, props.columnId);
}

function addDraggingClass(event) {
  event.target.classList.add("dragging");
}

function removeDraggingClass(event) {
  event.target.classList.remove("dragging");
}
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
.card--disable {
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
  font-weight: 600;
  color: rgba(0, 0, 0, 0.9);
  margin: 0 0 4px;
  min-height: 20px;
}
.card__description {
  color: rgba(0, 0, 0, 0.3);
  margin: 0;
  min-height: 20px;
  font-weight: 600;
}

.card__title:focus,
.card__description:focus {
  outline: 2px solid #007bff;
}

.card__title:empty:not(:focus):before,
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
.card__button {
  margin-right: 4px;
}
</style>
