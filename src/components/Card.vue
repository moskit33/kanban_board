<template>
  <div
    class="card"
    @dblclick="startEditing"
    @contextmenu.prevent="onDelete"
    @blur="updateCard"
  >
    <p
      class="card__title"
      :contenteditable="isEditing"
      @keydown.enter.prevent="updateCard"
      @input="onInput"
      ref="titleInput"
    >
      {{ card.title }}
    </p>
    <p
      class="card__description"
      :contenteditable="isEditing"
      @keydown.enter.prevent="updateCard"
      @input="onInput"
      ref="descriptionInput"
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
  isDisabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update-card", "delete-card"]);

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

function startEditing() {
  if (props.isDisabled) return;

  isEditing.value = true;
  originalTitle.value = props.card.title;
  originalDescription.value = props.card.description;

  nextTick(() => {
    titleInput.value.focus();
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

.card__actions {
  display: flex;
  justify-content: flex-start;
  margin-top: 8px;
}
.card__button {
  margin-right: 4px;
}
</style>
