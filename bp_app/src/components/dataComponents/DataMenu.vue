<!--
 - @file DataUnitsMenu.vue
 - @description In this file is component for menu in data view.
 - @author David Novák
 - @created 9. March 2023
 - 
 - This code is part of a bachelor's thesis at the FIT BUT.
-->

<template>
    <div class="topControls">
        <div>
            <h3>Data v databázi</h3>
            <button class="btn btn-secondary btn-sm m-1" @click="$router.push('/data/rooms/table')">Místnosti</button>
            <button class="btn btn-secondary btn-sm m-1" @click="$router.push('/data/subjects/table')">Předměty</button>
            <button class="btn btn-secondary btn-sm m-1" @click="$router.push('/data/units/table')">Lekce</button>
            <button class="btn btn-secondary btn-sm m-1"
                @click="$router.push('/data/lecturers/table')">Přednášející</button>
            <button class="btn btn-secondary btn-sm m-1" @click="$router.push('/data/sharedStudents/table')">Sdílení
                studenti</button>
            <button class="btn btn-secondary btn-sm m-1" @click="$router.push('/data/suitableRooms/table')">Vhodné
                místnosti</button>
        </div>
        <div>
            <button class="btn btn-dark btn-lg m-1" @click="downloadDatabase()">Stáhnout data</button>
            <button class="btn btn-dark btn-lg m-1" @click="$router.push('/data/add')">Přidat data</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import FileSaver from 'file-saver';

function downloadDatabase() {
    axios
        .get('http://localhost:3000/database/')
        .then(response => {
            const blob: Blob = new Blob([JSON.stringify(response.data) as unknown as BlobPart], { type: 'application/JSON' });
            FileSaver.saveAs(blob, "exportedData.json");
        }).catch((error) => {
            if (error.response) {
                console.log(error.response.data);
            }
        })
}
</script>

<style scoped>
.topControls {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
}</style>