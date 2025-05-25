<template>
  <div
    class="card"
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
import { ref, onMounted, nextTick } from "vue";
import BaseButton from "./BaseButton.vue";

const props = defineProps({
  card: {
    type: Object,
    default: () => ({}),
  },
  columnId: {
    type: Number,
    required: true,
  },
  isDisabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update-card", "delete-card", "dragstart"]);

const titleInput = ref(null);
const descriptionInput = ref(null);
const isEditing = ref(false);
const originalTitle = ref("");
const originalDescription = ref("");
const hasChanges = ref(false);

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
  if (!hasChanges) return;

  const updatedCard = {
    id: props.card.id,
    title: titleInput.value?.textContent?.trim() || "",
    description: descriptionInput.value?.textContent?.trim() || "",
  };

  emit("update-card", updatedCard);

  isEditing.value = false;
  hasChanges.value = false;
}

function onEdit(event) {
  if (props.isDisabled || isEditing.value) return;

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
    return emit("delete-card", props.card.id);
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
  emit("delete-card", props.card.id);
}

function dragStart(event) {
  if (props.editingDisabled) {
    event.preventDefault();
    return;
  }

  // Set the drag data
  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.setData("text/plain", "dragging");
  event.dataTransfer.setData("cardId", String(props.card.id));
  event.dataTransfer.setData("columnId", String(props.columnId));

  // Create a custom drag image
  const dragImage = createDragImage(event.target);
  event.dataTransfer.setDragImage(
    dragImage,
    dragImage.offsetWidth / 2,
    dragImage.offsetHeight / 2
  );
  setTimeout(() => document.body.removeChild(dragImage), 0);

  addDraggingClass(event);
  emit("dragstart", event);
  event.target.addEventListener("dragend", removeDraggingClass, { once: true });
}

function createDragImage(sourceNode) {
  const node = sourceNode.cloneNode(true);
  node.style.position = "absolute";
  node.style.top = "-9999px";
  node.style.left = "-9999px";
  node.style.width = "300px";
  node.style.minHeight = "80px";
  node.style.opacity = "1";
  node.style.pointerEvents = "none";
  node.style.boxShadow =
    "0 16px 48px 0 rgba(0,123,255,0.55), 0 2px 8px 0 rgba(0,0,0,0.18)";
  node.style.border = "3px solid #007bff";
  node.style.background = "#eaf4ff";
  node.style.transform = "scale(1.07)";
  node.style.zIndex = "9999";
  document.body.appendChild(node);
  return node;
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
