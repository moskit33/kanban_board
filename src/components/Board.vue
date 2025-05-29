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
</style>
