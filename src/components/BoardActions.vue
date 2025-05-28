<template>
  <div class="board-actions">
    <BaseButton
      class="board-actions__button"
      text="New Column"
      icon="create"
      @click="kanbanBoard.addColumn"
    />

    <BaseButton
      class="board-actions__button"
      text="Shuffle Columns"
      icon="shuffle"
      :disabled="!kanbanBoard.hasColumns"
      @click="kanbanBoard.shuffleColumns"
    />

    <BaseButton
      class="board-actions__button"
      text="Shuffle Cards"
      icon="shuffle"
      :disabled="kanbanBoard.totalCards === 0"
      @click="kanbanBoard.shuffleCards"
    />

    <BaseButton
      class="board-actions__button"
      :text="
        kanbanBoard.isDisabledGlobal ? 'Enable Editing' : 'Disable Editing'
      "
      :icon="kanbanBoard.isDisabledGlobal ? 'resume' : 'disable'"
      @click="kanbanBoard.toggleEditingGlobal"
    />
  </div>
  <h4 class="board-actions__title">Board Actions</h4>
</template>

<script setup>
import { inject } from "vue";
import BaseButton from "./BaseButton.vue";

const kanbanBoard = inject("kanbanBoard");
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
