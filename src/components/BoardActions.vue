<template>
  <div class="board-actions">
    <BaseButton
      class="board-actions__button"
      text="New Column"
      icon="create"
      @click="handleAddColumn"
    />

    <BaseButton
      class="board-actions__button"
      text="Shuffle Columns"
      icon="shuffle"
      :disabled="!kanbanBoard.hasColumns"
      @click="handleShuffleColumns"
    />

    <BaseButton
      class="board-actions__button"
      text="Shuffle Cards"
      icon="shuffle"
      :disabled="kanbanBoard.totalCards === 0"
      @click="handleShuffleCards"
    />

    <BaseButton
      class="board-actions__button"
      :text="
        kanbanBoard.isDisabledGlobal.value
          ? 'Enable Editing'
          : 'Disable Editing'
      "
      :icon="kanbanBoard.isDisabledGlobal.value ? 'resume' : 'disable'"
      @click="handleToggleDisableGlobal"
    />
  </div>
  <h4 class="board-actions__title">Board Actions</h4>
</template>

<script setup>
import { inject } from "vue";
import BaseButton from "./BaseButton.vue";

const kanbanBoard = inject("kanbanBoard");

// handler that cancels active editing before action
const withEditingCancel = (action) => {
  return () => {
    if (kanbanBoard.hasActiveEditing.value) {
      kanbanBoard.cancelCurrentEditing();
    }
    action();
  };
};

// Handler methods
const handleAddColumn = withEditingCancel(() => kanbanBoard.addColumn());
const handleShuffleColumns = withEditingCancel(() =>
  kanbanBoard.shuffleColumns()
);
const handleShuffleCards = withEditingCancel(() => kanbanBoard.shuffleCards());
const handleToggleDisableGlobal = withEditingCancel(() =>
  kanbanBoard.toggleDisableGlobal()
);
</script>

<style scoped>
.board-actions {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin: 22px 0 10px;
  flex-wrap: wrap;
}

.board-actions__button {
  margin: 0 4px;
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
  margin: 0 0 22px;
}
</style>
