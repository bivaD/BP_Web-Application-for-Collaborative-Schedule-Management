<!--
 - @file EditorStackHeader.vue
 - @description In this file is component for header of the stack.
 - @author David Novák
 - @created 9. March 2023
 - 
 - This code is part of a bachelor's thesis at the FIT BUT.
-->

<template>
    <div class="sticky-top pt-2">
        <h3 class="m-0">Zásobník lekcí</h3>
        <label class="my-1 mb-2 mr-1">Řadit podle:</label>
        <select @change="changeFilter()" v-model="filterType" class="m-1">
            <option value="nameA">Název A-Z</option>
            <option value="nameZ">Název Z-A</option>
            <option value="durationA">Délka sestupně</option>
            <option value="durationZ">Délka vzestupně</option>
            <option value="studentsA">Počet studentů sestupně</option>
            <option value="studentsZ">Počet studentů vzestupně</option>
        </select>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { Ref } from 'vue'

var filterType:Ref<string> = ref('nameA');

//emiting events
const emit = defineEmits<{
    (e: 'changeFilter', filterName: string): void
}>()

onMounted(()=>{
    emit('changeFilter', filterType.value);
});

function changeFilter() {
    emit('changeFilter', filterType.value);
}
</script>

<style scoped>

</style>