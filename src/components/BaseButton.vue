<template>
  <button
    class="base-button"
    :class="{ 'with-icon': icon }"
    @click="handleClick"
    :disabled="disabled"
  >
    <img v-if="IconComponent" :src="IconComponent" class="button-icon" />
    <span v-if="text" class="button-text">{{ text }}</span>
  </button>
</template>

<script setup>
import { computed } from "vue";
import CancelIcon from "../assets/icons/cancel.svg";
import ClearIcon from "../assets/icons/clear.svg";
import CreateIcon from "../assets/icons/create.svg";
import DisableIcon from "../assets/icons/disable.svg";
import ResumeIcon from "../assets/icons/resume.svg";
import SaveIcon from "../assets/icons/save.svg";
import ShuffleIcon from "../assets/icons/shuffle.svg";
import SortIcon from "../assets/icons/sort.svg";

const icons = {
  cancel: CancelIcon,
  clear: ClearIcon,
  create: CreateIcon,
  disable: DisableIcon,
  resume: ResumeIcon,
  save: SaveIcon,
  shuffle: ShuffleIcon,
  sort: SortIcon,
};

const props = defineProps({
  text: {
    type: String,
    default: "",
  },
  icon: {
    type: String,
    default: "",
  },
  callback: {
    type: Function,
    default: null,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const IconComponent = computed(() => icons[props.icon] || null);

const handleClick = (event) => props.callback?.(event);
</script>

<style>
.base-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 2px 6px;
  border-radius: 50px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: #fff;
  color: #000;
  border: 2px solid rgba(0, 0, 0, 0.05);
  outline: none;
}

.base-button:hover {
  border-color: blue;
}

.base-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.button-icon {
  width: 16px;
  height: 16px;
  margin-right: 4px;
}

.button-text {
  line-height: 1;
}
</style>
