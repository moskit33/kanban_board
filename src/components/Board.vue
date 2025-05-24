<template>
  <div class="board">
    <div class="column-container">
      <Column
        v-for="column in columns"
        :key="column.id"
        :title="column.title"
        :cards="column.cards"
      />
    </div>
    <div class="board-actions">
      <BaseButton
        class="board-actions__button"
        text="New Column"
        icon="create"
        @click=""
      />
      <BaseButton
        class="board-actions__button"
        text="Shuffle Columns"
        icon="shuffle"
        @click=""
      />
      <BaseButton
        class="board-actions__button"
        text="Shuffle Cards"
        icon="shuffle"
        @click=""
      />
      <BaseButton
        class="board-actions__button"
        text="Disable Editing"
        icon="disable"
        @click=""
      />
    </div>
    <div class="board-actions__title-wrapper">
      <h6 class="board-actions__title">Board Actions</h6>
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";
import Column from "./Column.vue";
import BaseButton from "./BaseButton.vue";

const columns = ref([
  {
    id: 1,
    title: "TO DO",
    cards: [{ id: 1, title: "Task 1", description: "Add description" }],
  },
  { id: 2, title: "In Progress", cards: [] },
  { id: 3, title: "Done", cards: [] },
]);
</script>
<style>
.board {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100%;
}
.column-container {
  display: flex;
  flex-direction: row;
  width: 100%;
  overflow-x: auto;
  padding: 16px;
  height: 100vh;
}
.board-actions {
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-top: 16px;
}

.board-actions__button {
  margin: 0 2px;
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
  margin: 10px 0;
}
</style>
