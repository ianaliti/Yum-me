<template>
  <svg
    width="17"
    height="18"
    viewBox="0 0 17 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M16.2461 13.2276C16.2836 12.9005 16.2462 12.5695 16.1367 12.2576C16.0271 11.9457 15.848 11.6602 15.6116 11.421C15.6116 10.8489 15.6431 9.7005 15.6431 9.17574C15.6431 3.23563 13.8251 0.5 8.38011 0.5C2.93511 0.5 1.11711 3.22273 1.11711 9.17574C1.11711 9.7048 1.11711 10.8489 1.14861 11.421C0.912255 11.6602 0.733098 11.9457 0.623543 12.2576C0.513987 12.5695 0.47665 12.9005 0.514113 13.2276C0.514113 14.8578 2.96211 15.3352 5.43711 15.4772C5.74311 16.5052 6.94011 17.2751 8.38011 17.2751C9.82011 17.2751 11.0171 16.5052 11.3231 15.4772C13.7801 15.3395 16.2461 14.8578 16.2461 13.2276Z"
      fill="#003459"
      stroke="white"
      stroke-miterlimit="10"
    />
    <path
      d="M7.16956 15.3398H8.38006H9.59056"
      stroke="white"
      stroke-miterlimit="10"
      stroke-linecap="round"
    />
    <path
      d="M10.3601 1.8418C11.6336 2.16439 12.5426 2.70206 12.9296 3.21822"
      stroke="white"
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
  color: "#003459",
});

const currentColor = computed(() => props.color);
</script>
