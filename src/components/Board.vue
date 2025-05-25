<template>
  <div class="board">
    <div class="column-container">
      <Column
        v-for="column in kanbanBoard.columns"
        :key="column.id"
        :column="column"
      />
    </div>

    <BoardActions />
  </div>
</template>
<script setup>
import { provide, onMounted } from "vue";
import Column from "./Column.vue";
import BoardActions from "./BoardActions.vue";
import { useKanbanBoard } from "../composables/useKanbanBoard.js";

const kanbanBoard = useKanbanBoard();

provide("kanbanBoard", kanbanBoard);

onMounted(() => {
  kanbanBoard.initializeBoard();
});
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
  padding: 16px 12px;
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
