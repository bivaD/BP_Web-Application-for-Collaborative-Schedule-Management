<!--
 - @file FormAlerts.vue
 - @description In this file is component with alerts and displaying them.
 - @author David Novák
 - @created 9. March 2023
 - 
 - This code is part of a bachelor's thesis at the FIT BUT.
-->

<template>
    <div>
        <p v-if="successAlert != ''" class="alert alert-success mt-2"> {{ successAlert }} </p>
        <p v-if="failureAlert != ''" class="alert alert-danger mt-2"> {{ failureAlert }} </p>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Ref } from 'vue'
import { useSettingsStore } from '@/stores/SettingsStore';
import { defineExpose } from 'vue';

var settingsStore = useSettingsStore();

var successAlert: Ref<string> = ref('');
var failureAlert: Ref<string> = ref('');
function displayFailureAlert(alert: string) {
    failureAlert.value = alert;
    setTimeout(() => { failureAlert.value = '' }, settingsStore.alertDisplayTime);
    window.scrollTo(0, 0);
}
function displaySuccessAlert(alert: string) {
    successAlert.value = alert;
    setTimeout(() => { successAlert.value = '' }, settingsStore.alertDisplayTime);
    window.scrollTo(0, 0);
}

defineExpose({
    displayFailureAlert, displaySuccessAlert
    });
</script>

<style scoped>
    .alert{
        white-space: pre-wrap
    }
</style>