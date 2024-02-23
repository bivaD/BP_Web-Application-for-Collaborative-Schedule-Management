<!--
 - @file EditorConsole.vue
 - @description In this file is component for console, which is in editor displaying collisions.
 - @author David Novák
 - @created 9. March 2023
 - 
 - This code is part of a bachelor's thesis at the FIT BUT.
-->
<template>
    <div class="console">
        <button class="btn btn-danger bi-x-lg btn-sm close-button sticky-top m-0" @click="$emit('close')"></button>
        <p class="message" v-for="message in collisionsStore.getCollisionMessages" :key="message">
        {{ message }}
        </p>
    </div>
</template>

<script setup lang="ts">
import { useCollisionStore } from '@/stores/CollisionStore';
var collisionsStore = useCollisionStore();

const emit = defineEmits<{
    (e: 'close'): void
}>()
</script>

<style scoped>
.message{
    color: red;
    margin: 0;
}
.console{
    overflow-y: scroll;
    border: 1px black solid;
    border-top-right-radius: 2rem;
    border-top-left-radius: 2rem;
    padding: 1rem 1rem 0 1rem;
    margin: 1rem;

}
.close-button{
    float: right;
}
</style>