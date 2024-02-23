<!--
 - @file FormAddSubject.vue
 - @description In this file is component with form for inserting subject.
 - @author David Novák
 - @created 9. March 2023
 - 
 - This code is part of a bachelor's thesis at the FIT BUT.
-->

<template>
    <div>
        <FormAlerts ref="alerts" />

        <form @submit.prevent="clickedSubmit">
            <label class="m-1 column-align">Zkratka:</label>
            <AlphaNumericInput v-model:value="subject.abbreviation" v-model:valid="abbreviationValid"/>
            <br />
            <label class="m-1 column-align">Celý název:</label>
            <AlphaNumericInput v-model:value="subject.name" v-model:valid="nameValid"/>
            <br />
            <button class="btn btn-dark mt-3">Přidat předmět</button>
        </form>
    </div>
</template>

<script setup lang="ts">
import FormAlerts from './FormAlerts.vue';
import { ref, type ComponentPublicInstance } from 'vue'
import type { Ref } from 'vue'
import axios from 'axios';
import AlphaNumericInput from './AlphaNumericInput.vue';
import type { ISubject } from '@/interfaces/dataTypesFE';


var abbreviationValid: Ref<boolean> = ref(false);
var nameValid: Ref<boolean> = ref(false);

var subject: Ref<ISubject> = ref({ abbreviation: '', name: '' });

const alerts = ref<ComponentPublicInstance<typeof FormAlerts & { displaySuccessAlert: (alert: string) => void, displayFailureAlert: (alert: string) => void }>>()

function clickedSubmit() {
    if (abbreviationValid.value && nameValid.value) {
        axios.post('http://localhost:3000/subjects/', {
            abbreviation: subject.value.abbreviation,
            name: subject.value.name
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                alerts.value?.displaySuccessAlert(response.data);
            })
            .catch((error) => {
                if (error.response) {
                    alerts.value?.displayFailureAlert(error.response.data);
                }
            })
    } else {
        alerts.value?.displayFailureAlert('Pro přidání předmětu musí mít všechny kolonky validní hodnotu.');
    }
}
</script>

<style scoped>
.column-align {
    width: 6rem;
}
</style>