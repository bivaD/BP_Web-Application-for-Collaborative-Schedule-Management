<!--
 - @file SubjectDetailView.vue
 - @description In this file is view for subject detail.
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
            <h3 class="mt-3">Detail předmětu {{ abbreviation }}</h3>
            <DetailSubjectVue :abbreviation="abbreviation"/>
        </div>
    </div>
</template>

<script setup lang="ts">
import TopPanel from '@/components/TopPanel.vue';
import { toRefs } from 'vue';
import DetailSubjectVue from '@/components/detailComponents/DetailSubject.vue';

interface Props {
    abbreviation: string,
}
const props = defineProps<Props>()
const { abbreviation } = toRefs(props);
</script>