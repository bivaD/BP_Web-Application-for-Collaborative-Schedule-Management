<!--
 - @file MyTemplateScriptSetup.vue
 - @description In this file is component template. Better than v-base.
 - @author David Novák
 - @created 9. March 2023
 - 
 - This code is part of a bachelor's thesis at the FIT BUT.
-->

<template>
    <div>

    </div>
</template>

<script setup lang="ts">
import { ref, toRefs } from 'vue'
import type { Ref } from 'vue'

// reactive variables
var variableNAme:Ref<string> = ref('default value');

//properties
interface Props {
    propertyName: boolean,
}
const props = defineProps<Props>()
const { propertyName } = toRefs(props);

//emiting events
const emit = defineEmits<{
    (e: 'emitName', propertyName: number): void
}>()

function emitEvent(eventProperty: number) {
    emit('emitName', eventProperty);
}

</script>

<style scoped>

</style>