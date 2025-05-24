<template>
  <div class="card">
    <p class="card__title">{{ title }}</p>
    <p class="card__description">{{ description }}</p>
  </div>
</template>

<script setup>
import { ref } from "vue";
import BaseButton from "./BaseButton.vue";

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
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
}
.card__title {
  font-weight: 600;
  color: rgba(0, 0, 0, 0.9);
  margin: 0 0 4px;
}
.card__description {
  color: rgba(0, 0, 0, 0.3);
  margin: 0;
}
</style>
