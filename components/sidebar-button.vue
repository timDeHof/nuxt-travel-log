<script setup lang="ts">
const props = defineProps<{
  to: string;
  icon: string;
  label: string;
  showLabel: boolean;
}>();

const route = useRoute();
</script>

<template>
  <div
    class="tooltip-right"
    :data-tip="showLabel ? undefined : props.label"
    :class="{ tooltip: !showLabel }"
  >
    <NuxtLink
      :to="props.to"
      :class="{ 'bg-base-200': route.path === props.to, 'justify-center': !props.showLabel, 'justify-start': props.showLabel }"
      class="flex gap-2 p-2 hover:bg-base-300 hover:cursor-pointer flex-nowrap"
    >
      <Icon :name="props.icon" size="24" />
      <Transition name="grow">
        <span v-if="props.showLabel" class="ml-2">{{ props.label }}</span>
      </Transition>
    </NuxtLink>
  </div>
</template>

<style scoped>
 .grow-enter-active {
  animation: grow 0.1s;
}

.grow-leave-active {
  animation: grow 0.1s reverse;
}
@keyframes grow {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
