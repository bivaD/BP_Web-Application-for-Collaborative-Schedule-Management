<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import { useSettingsStore } from "./stores/SettingsStore";
//importing bootstrap 5
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";


var settingsStore = useSettingsStore();
settingsStore.synchronizeSettings();
</script>

<template>
  <div>
    <RouterView />
  </div>
</template>

<style scoped>

</style>
