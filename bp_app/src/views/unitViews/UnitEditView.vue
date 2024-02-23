<!--
 - @file UnitEditView.vue
 - @description In this file is view for editing units.
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
            <h3 class="mt-3">Upravit lekci s identifikátorem {{ id }}</h3>
            <EditUnit :unitId="id"/>
        </div>
    </div>
</template>

<script setup lang="ts">
import TopPanel from '@/components/TopPanel.vue';
import EditUnit from '@/components/editComponents/EditUnit.vue';
import { toRefs } from 'vue';

interface Props {
    id: string,
}
const props = defineProps<Props>()
const { id } = toRefs(props);
</script>

  