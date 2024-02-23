<!--
 - @file UnitAddView.vue
 - @description In this file is view for adding units.
 - @author David Novák
 - @created 9. March 2023
 - 
 - This code is part of a bachelor's thesis at the FIT BUT.
-->
<template>
    <div>
        <TopPanel  :selected="'data'"/>
        <div class="m-5">
            <button class="btn btn-dark bi-arrow-left" @click="$router.back">{{ '  Zpět ' }}</button>
            <h3 class="mt-3">Přidat lekci</h3>
            <FormAddUnit />
        </div>
    </div>
</template>

<script setup lang="ts">
import TopPanel from '@/components/TopPanel.vue';
import FormAddUnit from '@/components/formComponents/FormAddUnit.vue';
</script>

 