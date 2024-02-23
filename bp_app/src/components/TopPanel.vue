<!--
 - @file TopPanel.vue
 - @description In this file is component for top panel/menu.
 - @author David Novák
 - @created 9. March 2023
 - 
 - This code is part of a bachelor's thesis at the FIT BUT.
-->


<template>
    <nav class="navbar navbar-expand bg-dark navigation-sticky sticky-top">
        <ul class="navbar-nav mx-5">
        <li class="nav-item active">
            <button :class="calculateClass('home')" @click="$router.push('/home')"> Domů </button>
        </li>
        <li class="nav-item active">
            <button :class="calculateClass('editor')" @click="$router.push('/editor')"> Editor </button>
        </li>
        <li class="nav-item active">
            <button :class="calculateClass('data')" @click="$router.push('/data/rooms/table')"> Data </button>
        </li>
        <li class="nav-item active">
            <button :class="calculateClass('settings')" @click="$router.push('/settings')"> Nastavení </button>
        </li>
        </ul>
    </nav>
</template>

<script setup lang="ts">
import { toRefs } from 'vue';


//properties
interface Props {
    selected: string,
}
const props = defineProps<Props>()
const { selected } = toRefs(props);

function calculateClass(btnName: string): string{
    if(btnName == selected.value){
        return 'btn btn-secondary m-1';
    } else {
        return 'btn btn-light m-1';
    }
}
</script>

<style scoped>

</style>