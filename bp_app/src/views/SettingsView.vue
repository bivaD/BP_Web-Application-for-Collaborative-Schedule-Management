<template>
    <div>
        <TopPanel  :selected="'settings'"/>
        <SettingsDay/>
    </div>
</template>

<script setup lang="ts">
    import TopPanel from '@/components/TopPanel.vue';
    import SettingsDay from '@/components/SettingsDay.vue';
</script>

<style scoped>

</style>