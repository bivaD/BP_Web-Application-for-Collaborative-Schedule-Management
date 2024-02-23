<template>
    <div class="editor">
        <TopPanel class="top"  :selected="'editor'"/>
        <EditorMain class="bottom" />
    </div>
</template>

<script setup lang="ts">
import EditorMain from '@/components/editorComponents/EditorMain.vue';
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