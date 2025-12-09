<template>
  <svg
    width="19"
    height="19"
    viewBox="0 0 19 19"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M17.8769 0.704437C17.6 0.196023 16.1231 0.734942 14.9 1.24336C13.9031 1.65517 12.7446 2.18392 12.2 2.7686C11.6554 2.18392 10.4969 1.65517 9.5 1.24336C8.63624 0.862617 7.72665 0.622828 6.8 0.531576C5.87335 0.622828 4.96376 0.862617 4.1 1.24336C2.87692 1.75177 1.4 2.42288 1.12308 3.17025C0.569231 4.03455 0.5 8.54418 0.5 10.9897C0.5 13.4351 0.569231 17.8888 1.12308 18.2956C1.4 18.804 2.87692 18.2651 4.1 17.7566C5.09692 17.3448 6.25538 16.8161 6.8 16.2314C7.34462 16.8161 8.50308 17.3448 9.5 17.7566C10.3638 18.1374 11.2734 18.3772 12.2 18.4684C13.1267 18.3772 14.0362 18.1374 14.9 17.7566C16.1231 17.2482 17.6 16.5771 17.8769 15.8298C18.4308 14.9655 18.5 10.4558 18.5 8.01035C18.5 5.56488 18.4308 1.11117 17.8769 0.704437Z"
      :fill="currentColor"
      stroke="#FFFDF9"
      stroke-miterlimit="10"
    />
    <path d="M6.73077 13.3132V4.06006Z" :fill="currentColor" />
    <path
      d="M6.73077 13.3132V4.06006"
      stroke="#FFFDF9"
      stroke-miterlimit="10"
      stroke-linecap="round"
    />
    <path d="M12.2692 14.9401V5.68701Z" :fill="currentColor" />
    <path
      d="M12.2692 14.9401V5.68701"
      stroke="#FFFDF9"
      stroke-miterlimit="10"
      stroke-linecap="round"
    />
    <path
      d="M15.7308 2.65682C16.9077 2.08231 16.8569 1.74168 16.8569 4.53795Z"
      :fill="currentColor"
    />
    <path
      d="M15.7308 2.65682C16.9077 2.08231 16.8569 1.74168 16.8569 4.53795"
      stroke="#FFFDF9"
      stroke-miterlimit="10"
      stroke-linecap="round"
    />
  </svg>
</template>

<script setup lang="ts">
interface Props {
  size?: number | string;
  color?: string;
}

const props = withDefaults(defineProps<Props>(), {
  size: 24,
  color: "currentColor",
});

const currentColor = computed(() => props.color);
</script>
