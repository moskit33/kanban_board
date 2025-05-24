<template>
  <div class="column">
    <div class="column-header">
      <h3 class="column-header__title">
        {{ title }} <span class="column-header__count">{{ cards.length }}</span>
      </h3>
      <BaseButton
        class="column-header__button"
        text="Disable Editing"
        icon="disable"
      />
      <BaseButton
        class="column-header__button"
        text="Delete Column"
        icon="cancel"
      />
    </div>

    <div class="cards-list">
      <Card
        v-for="card in cards"
        :key="card.id"
        :title="card.title"
        :description="card.description"
      />
    </div>
    <BaseButton class="new-card-button" text="New Card" icon="create" />
    <div class="column-actions">
      <BaseButton text="Sort" icon="sort" />
      <BaseButton text="Clear All" icon="clear" />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import BaseButton from "./BaseButton.vue";
import Card from "./Card.vue";

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  cards: {
    type: Array,
    default: () => [],
  },
});
</script>

<style>
.column {
  display: flex;
  flex-direction: column;
  min-width: 448px;
  background-color: #eceff2;
  border-radius: 12px;
  padding: 16px;
  margin: 0 12px;
  height: 100%;
}
.column-header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 16px;
}
.column-header__title {
  font-size: 13px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.3);
  margin: 0 auto 0 0;
}
.column-header__count {
  font-size: 13px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.6);
  margin-left: 8px;
}
.cards-list {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.cards-list > *:last-child {
  margin-bottom: 0 !important;
}

.new-card-button {
  width: 100%;
  border-radius: 8px;
  border-width: 0;
  background-color: #ced9e3;
  padding: 8px;
  margin: 8px 0;
}
.column-actions {
  margin-top: auto;
}
</style>
