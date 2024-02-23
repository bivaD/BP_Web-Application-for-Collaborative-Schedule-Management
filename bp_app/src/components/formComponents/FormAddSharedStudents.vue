<!--
 - @file FormAddSharedStudents.vue
 - @description In this file is component with form for inserting shared students between two lectures.
 - @author David Novák
 - @created 9. March 2023
 - 
 - This code is part of a bachelor's thesis at the FIT BUT.
-->

<template>
    <div>
        <FormAlerts ref="alerts" />
        <label class="label my-2">Identifikátor první lekce:</label>
        <AlphaNumericInput v-model:value="unitAId" v-model:valid="unitAIdValid"/>
        <br />
        <label class="label my-2">Identifikátor druhé lekce:</label>
        <AlphaNumericInput v-model:value="unitBId" v-model:valid="unitBIdValid"/>
        <br />
        <label class="my-2">Počet studentů navštěvující obě lekce současně:</label><br />
        <NumberInput v-model:value="count" v-model:valid="countValid" :min="0" />
        <br />
        <button class="btn btn-dark mt-3" @click="clickedSubmit">Přidat</button>

    </div>
</template>

<script setup lang="ts">
import { ref, type ComponentPublicInstance } from 'vue'
import type { Ref } from 'vue'
import axios from 'axios';
import FormAlerts from './FormAlerts.vue';
import NumberInput from './NumberInput.vue';
import AlphaNumericInput from './AlphaNumericInput.vue';

var count: Ref<number> = ref(0);
var unitAId: Ref<string> = ref('');
var unitBId: Ref<string> = ref('');

const alerts = ref<ComponentPublicInstance<typeof FormAlerts & { displaySuccessAlert: (alert: string) => void, displayFailureAlert: (alert: string) => void }>>()
var countValid: Ref<boolean> = ref(true);
var unitAIdValid: Ref<boolean> = ref(false);
var unitBIdValid: Ref<boolean> = ref(false);


function clickedSubmit() {
    if (countValid.value && unitAIdValid && unitBIdValid) {
        axios.post('http://localhost:3000/units/sharedStudents/', {
            unitAId: unitAId.value,
            unitBId: unitBId.value,
            count: count.value,
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
        });
    } else {
        alerts.value?.displayFailureAlert('Pro přidání společných studentů musí mít všechny kolonky validní hodnotu.');
    }
}
</script>

<style scoped>
.label {
    width: 12rem;
}
</style>