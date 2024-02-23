<!--
 - @file EditSubject.vue
 - @description In this file is component for editing subject.
 - @author David Novák
 - @created 9. March 2023
 - 
 - This code is part of a bachelor's thesis at the FIT BUT.
-->

<template>
    <div>
        <FormAlerts ref="alerts" />
        <label class="m-1 column-align">Celý název:</label>
        <AlphaNumericInput v-model:value="subject.name" v-model:valid="nameValid"/>
        <br />
        <button class="btn btn-success m-1" @click="clickedSubmit">Upravit předmět</button>
        <button class="btn btn-danger m-1" @click="deleteSubject()">Smazat předmět</button>
    </div>
</template>

<script setup lang="ts">
import FormAlerts from '../formComponents/FormAlerts.vue';
import { onMounted, ref, toRefs, type ComponentPublicInstance } from 'vue'
import type { Ref } from 'vue'
import axios from 'axios';
import type { ISubject } from '@/interfaces/dataTypesFE';
import AlphaNumericInput from '../formComponents/AlphaNumericInput.vue';

//data
interface Props {
    abbreviation: string,
}
const props = defineProps<Props>()
const { abbreviation } = toRefs(props);

const alerts = ref<ComponentPublicInstance<typeof FormAlerts & { displaySuccessAlert: (alert: string) => void, displayFailureAlert: (alert: string) => void }>>()

var nameValid: Ref<boolean> = ref(true);
//fetch data
var subject: Ref<ISubject> = ref({ abbreviation: 'Neodařilo se načíst', name: 'Neodařilo se načíst' });
onMounted(async () => {
    await axios
        .get('http://localhost:3000/subjects/' + abbreviation.value)
        .then(response => {
            subject.value = response.data;
        })
        .catch((error) => {
            if (error.response) {
                alerts.value?.displayFailureAlert(error.response.data);
            }
        })
})
//updating data
function clickedSubmit() {
    if (nameValid.value) {
        axios.put('http://localhost:3000/subjects/' + abbreviation.value, {
            name: subject.value.name
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
        alerts.value?.displayFailureAlert('Pro upravení předmětu musí mít všechny kolonky validní hodnotu.');
    }
};

//delete subject
function deleteSubject() {
    axios.delete('http://localhost:3000/subjects/' + abbreviation.value)
        .then(response => {
            alerts.value?.displaySuccessAlert(response.data);
        })
        .catch((error) => {
            if (error.response) {
                alerts.value?.displayFailureAlert(error.response.data);
            }
        })
}
</script>

<style scoped>
.column-align {
    width: 10rem;
}
</style>