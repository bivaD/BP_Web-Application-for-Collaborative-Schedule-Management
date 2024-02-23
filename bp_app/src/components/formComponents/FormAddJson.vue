<!--
 - @file FormAddJson.vue
 - @description In this file is component with file import field.
 - @author David Novák
 - @created 9. March 2023
 - 
 - This code is part of a bachelor's thesis at the FIT BUT.
-->

<template>
    <div>
        <FormAlerts ref="alerts" />
        <div class="shorter-please">
            <div class="input-group">
                <label class="input-group-text custom-file-button" for="x">Vyber soubor</label>
                <input type="file" class="form-control" id="x" title="Není vybrán žádný soubor." style="color:transparent;"
                    onchange="this.style.color = 'black';" @change="onChange">
                <button class="btn btn-dark" type="button" @click="submitFile()">Vlož soubor</button>
            </div>
        </div>
    </div>
</template>
  
<script setup lang="ts">
import axios from "axios";
import { ref, type ComponentPublicInstance, type Ref } from "vue";
import FormAlerts from "./FormAlerts.vue";
import type { IDatabaseData } from "@/interfaces/DatabaseExportFE";

var result: Ref<IDatabaseData> = ref({settings: [], rooms: [], lecturers: [], subjects: [], units:[], suitableRooms: [], sharedStudents: []});
var files: Ref<Blob[]> = ref([]);

function onChange(e: any) {
    files.value = e.target.files || e.dataTransfer.files;
}

const alerts = ref<ComponentPublicInstance<typeof FormAlerts & { displaySuccessAlert: (alert: string) => void, displayFailureAlert: (alert: string) => void }>>()

function submitFile() {
    if (files.value.length > 0) {
        var reader = new FileReader();
        reader.onload = (e: any) => {
            result.value = JSON.parse(e.target.result);
            axios.post('http://localhost:3000/database', {
            data: result.value
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
        };
        reader.readAsText(files.value[0]);
    }
}
</script>

<style scoped>
input::file-selector-button {
    display: none;
}

.shorter-please {
    width: 25rem !important;
}
</style>
  