<template>
    <div class="editor">
        <TopPanel class="top"  :selected="'editor'"/>
        <div class="m-5">
        <h1>Oops. Na této adrese žádná stránka není.</h1> 
        <label>Můžeš zkusit</label>
        <button class="btn btn-dark m-2" @click="$router.back"> jít zpět </button>
        <label>nebo</label>
        <button class="btn btn-dark m-1" @click="$router.push('/home')"> přejít na domovskou stránku aplikace </button></div>
    </div>
</template>

<script setup lang="ts">
import TopPanel from '@/components/TopPanel.vue';


</script>

<style scoped>
.editor{
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
}
</style>