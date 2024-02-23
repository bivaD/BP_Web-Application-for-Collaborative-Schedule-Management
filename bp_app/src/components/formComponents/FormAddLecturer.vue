<!--
 - @file FormAddLecturer.vue
 - @description In this file is component with form for inserting lecturer.
 - @author David Novák
 - @created 9. March 2023
 - 
 - This code is part of a bachelor's thesis at the FIT BUT.
-->

<template>
    <div>
        <FormAlerts ref="alerts" />
        <label class="m-1 column-align">Jméno: </label>
        <AlphaNumericInput v-model:value="lecturer.name" v-model:valid="lecturerNameValid"/>
        <br />
        <label class="m-1 column-align">Příjmení: </label>
        <AlphaNumericInput v-model:value="lecturer.surname" v-model:valid="lecturerSurnameValid"/>
        <br />
        <label class="m-1 column-align">Tituly před jménem: </label>
        <AlphaNumericInput  :voluntary="true" v-model:value="lecturer.titlesBefore" v-model:valid="lecturerTitlesBeforeValid"/>
        <br />
        <label class="m-1 column-align">Tituly za jménem: </label>
        <AlphaNumericInput  :voluntary="true" v-model:value="lecturer.titlesAfter" v-model:valid="lecturerTitlesAfterValid"/>
        <h5 class="mt-3">Časové priority:</h5>
        <FormAddLecturerPriorities @prioritiesChange="(newPriorities) => lecturer.timePriorities = newPriorities"
            :currentPriorities="lecturer.timePriorities" />
        <button class="btn btn-dark" @click="clickedSubmit">Přidat přednášejícího</button>
    </div>
</template>

<script setup lang="ts">
import FormAlerts from './FormAlerts.vue';
import { ref, type ComponentPublicInstance } from 'vue'
import type { Ref } from 'vue'
import axios from 'axios';
import { useSettingsStore } from '@/stores/SettingsStore';
import FormAddLecturerPriorities from './FormAddLecturerPriorities.vue';
import AlphaNumericInput from './AlphaNumericInput.vue';
import type { ILecturer } from '@/interfaces/dataTypesFE';

var settingsStore = useSettingsStore()

var lecturerNameValid: Ref<boolean> = ref(true);
var lecturerSurnameValid: Ref<boolean> = ref(true);
var lecturerTitlesBeforeValid: Ref<boolean> = ref(true);
var lecturerTitlesAfterValid: Ref<boolean> = ref(true);

var lecturer: Ref<ILecturer> = ref({ id: '', name: '', surname: '', titlesBefore: '', titlesAfter: '', timePriorities: settingsStore.getDefaultPriorities });

const alerts = ref<ComponentPublicInstance<typeof FormAlerts & { displaySuccessAlert: (alert: string) => void, displayFailureAlert: (alert: string) => void }>>()

function clickedSubmit() {
    if (lecturerNameValid.value && lecturerSurnameValid.value && lecturerTitlesBeforeValid.value && lecturerTitlesAfterValid.value) {
        axios.post('http://localhost:3000/lecturers/', {
            name: lecturer.value.name,
            surname: lecturer.value.surname,
            titlesAfter: lecturer.value.titlesAfter,
            titlesBefore: lecturer.value.titlesBefore,
            timePriorities: lecturer.value.timePriorities
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            alerts.value?.displaySuccessAlert(response.data);
        }).catch((error) => {
            if (error.response) {
                alerts.value?.displayFailureAlert(error.response.data);
            }
        })
    } else {
        alerts.value?.displayFailureAlert('Pro vložení přednášejícího musí mít všechny kolonky validní hodnotu.');
    }
}
</script>

<style scoped>
.column-align {
    width: 10rem;
}
</style>