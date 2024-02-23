<!--
 - @file RoomEditView.vue
 - @description In this file is view for editing rooms.
 - @author David Novák
 - @created 9. March 2023
 - 
 - This code is part of a bachelor's thesis at the FIT BUT.
-->

<template>
    <div>
        <TopPanel  :selected="'data'"/>
        <div class="m-5">
            <button class="btn btn-dark bi-arrow-left" @click="$router.back">{{ ' Zpět ' }}</button>
            <h3 class="mt-3">Upravit místnost {{ name }}</h3>
            <EditRoom :roomName="name"/>
        </div>
    </div>
</template>

<script setup lang="ts">
import TopPanel from '@/components/TopPanel.vue';
import { toRefs } from 'vue';
import EditRoom from '@/components/editComponents/EditRoom.vue';

interface Props {
    name: string,
}
const props = defineProps<Props>()
const { name } = toRefs(props);

</script>

 