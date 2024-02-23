<!--
 - @file AplhaNumericInput.vue
 - @description In this file is component inserting strings with basic validation.
 - @author David Novák
 - @created 9. March 2023
 - 
 - This code is part of a bachelor's thesis at the FIT BUT.
-->

<template>
    <div>
        <input type="text" :class="`m-1 ${valid ? '' : 'border-danger'}`" @input="checkInput" :value="value" />
        <label class="text-danger m-1"> {{ alert }}</label>
    </div>
</template>

<script setup lang="ts">
import { ref, toRefs } from 'vue'
import type { Ref } from 'vue'

// reactive variables
var alert: Ref<string> = ref('');

function checkInput(event: Event) {
    const minLenght: number = 3;
    const maxLenght: number = 255;
    const voluntaryField: boolean = (voluntary != undefined ? voluntary.value : false) ?? false;
    const currentValue: string = ((event.target as HTMLInputElement).value).trim();

    if (!voluntaryField) {
        if (currentValue.length < minLenght || currentValue.length > maxLenght) {
            alert.value = `Hodnota musí být delší než ${minLenght} a kratší než ${maxLenght} znaků.`;
            emit('update:valid', false);
        } else if (!(/^[\-a-zA-Z\s0-9./,_À-ʼ]+$/.test(currentValue))) {
            alert.value = `Hodnota může obsahovat pouze alfanumerické znaky až na některé výjimky, např.: .-/,_`;
            emit('update:valid', false);
        } else {
            alert.value = '';
            emit('update:valid', true);
        }
    } else {
        if (currentValue.length == 0) {
            alert.value = '';
            emit('update:valid', true);
        } else if (currentValue.length < minLenght || currentValue.length > maxLenght && voluntaryField) {
            alert.value = `Hodnota může být prázdná nebo delší než ${minLenght} a kratší než ${maxLenght} znaků.`;
            emit('update:valid', false);
        } else if (!(/^[\-a-zA-Z\s0-9./,_À-ʼ]+$/.test(currentValue)) && voluntaryField) {
            alert.value = `Hodnota může být prázdná nebo obsahovat pouze alfanumerické znaky až na některé výjimky, např.: .-/,_`;
            emit('update:valid', false);
        } else {
            alert.value = '';
            emit('update:valid', true);
        }
    }
    emit('update:value', currentValue);
}

//properties
interface Props {
    voluntary?: boolean,
    value: string,
    valid: boolean
}
const props = defineProps<Props>()
const { voluntary, value, valid } = toRefs(props);

//emiting events
const emit = defineEmits<{
    (e: 'update:value', result: string): void,
    (e: 'update:valid', result: boolean): void
}>()
</script>

 
{"settings":[{"name":"název-nastavení","value":"hodnota-nastavení-jako-string"},],"rooms":[{"name":"název-místnosti","capacity":42,"reservedHours":["reserved","reserved","reserved","reserved","reserved","reserved","free","free","free","free","free","free","free","free","free","free","free","free","free","free","free","reserved","reserved","reserved","reserved","reserved","reserved","reserved","reserved","reserved","free","free","free","free","free","free","free","free","free","free","free","free","free","free","free","reserved","reserved","reserved","reserved","reserved","reserved","reserved","reserved","reserved","free","free","free","free","free","free","free","free","free","free","free","free","free","free","free","reserved","reserved","reserved","reserved","reserved","reserved","reserved","reserved","reserved","free","free","free","free","free","free","free","free","free","free","free","free","free","free","free","reserved","reserved","reserved","reserved","reserved","reserved","reserved","reserved","reserved","free","free","free","free","free","free","free","free","free","free","free","free","free","free","free","reserved","reserved","reserved","reserved","reserved","reserved","reserved","reserved","reserved","free","free","free","free","free","free","free","free","free","free","free","free","reserved","reserved","reserved","reserved","reserved","reserved","reserved","reserved","reserved","reserved","reserved","reserved","free","free","free","free","free","free","free","free","free","free","free","free","reserved","reserved","reserved","reserved","reserved","reserved"]},{"name":"unsorted","capacity":424242,"reservedHours":[]}],"subjects":[{"abbreviation":"zkratka-předmětu","name":"celý-název-předmětu"}],"lecturers":[{"id":"73e65aac-1a53-4338-a598-0047d9f70628","name":"jméno","surname":"příjmení","titlesBefore":"tituly-před-jménem","titlesAfter":"tituly-za-jménem","timePriorities":["0","0","0","0","0","0","0","2","3","5","5","5","3","5","5","5","4","3","3","2","1","0","0","0","0","0","0","0","0","0","0","2","3","5","5","5","3","5","5","5","4","3","3","2","1","0","0","0","0","0","0","0","0","0","0","2","3","5","5","5","3","5","5","5","4","3","3","2","1","0","0","0","0","0","0","0","0","0","0","2","3","5","5","5","3","5","5","5","4","3","3","2","1","0","0","0","0","0","0","0","0","0","0","2","3","5","5","5","3","3","2","2","2","2","2","2","1","0","0","0","0","0","0","0","0","0","0","0","1","2","2","2","1","2","2","2","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0"]}],"units":[{"id":"4854f0f6-9ac2-4c74-9372-c561c133878f","type":0,"requiredCapacity":42,"duration":83,"periodic":true,"compulsory":true,"frozen":false,"weeks":["1","2","3","4","5","6"],"day":2,"startTime":754,"room":{"name":"název-místnosti","capacity":42,"reservedHours":["reserved","reserved","reserved","reserved","reserved","reserved","free","free","free","free","free","free","free","free","free","free","free","free","free","free","free","reserved","reserved","reserved","reserved","reserved","reserved","reserved","reserved","reserved","free","free","free","free","free","free","free","free","free","free","free","free","free","free","free","reserved","reserved","reserved","reserved","reserved","reserved","reserved","reserved","reserved","free","free","free","free","free","free","free","free","free","free","free","free","free","free","free","reserved","reserved","reserved","reserved","reserved","reserved","reserved","reserved","reserved","free","free","free","free","free","free","free","free","free","free","free","free","free","free","free","reserved","reserved","reserved","reserved","reserved","reserved","reserved","reserved","reserved","free","free","free","free","free","free","free","free","free","free","free","free","free","free","free","reserved","reserved","reserved","reserved","reserved","reserved","reserved","reserved","reserved","free","free","free","free","free","free","free","free","free","free","free","free","reserved","reserved","reserved","reserved","reserved","reserved","reserved","reserved","reserved","reserved","reserved","reserved","free","free","free","free","free","free","free","free","free","free","free","free","reserved","reserved","reserved","reserved","reserved","reserved"]},"subject":{"abbreviation":"zkratka-předmětu","name":"celý-název-předmětu"},"lecturers":[{"id":"73e65aac-1a53-4338-a598-0047d9f70628","name":"jméno","surname":"příjmení","titlesBefore":"tituly-před-jménem","titlesAfter":"tituly-za-jménem","timePriorities":["0","0","0","0","0","0","0","2","3","5","5","5","3","5","5","5","4","3","3","2","1","0","0","0","0","0","0","0","0","0","0","2","3","5","5","5","3","5","5","5","4","3","3","2","1","0","0","0","0","0","0","0","0","0","0","2","3","5","5","5","3","5","5","5","4","3","3","2","1","0","0","0","0","0","0","0","0","0","0","2","3","5","5","5","3","5","5","5","4","3","3","2","1","0","0","0","0","0","0","0","0","0","0","2","3","5","5","5","3","3","2","2","2","2","2","2","1","0","0","0","0","0","0","0","0","0","0","0","1","2","2","2","1","2","2","2","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0"]}]},{"id":"706ddf87-2acc-435b-88b9-78f4ca0a472b","type":3,"requiredCapacity":24,"duration":201,"periodic":false,"compulsory":false,"frozen":false,"weeks":[],"day":0,"startTime":-1,"room":{"name":"unsorted","capacity":424242,"reservedHours":[]},"subject":{"abbreviation":"zkratka-předmětu","name":"celý-název-předmětu"},"lecturers":[{"id":"73e65aac-1a53-4338-a598-0047d9f70628","name":"jméno","surname":"příjmení","titlesBefore":"tituly-před-jménem","titlesAfter":"tituly-za-jménem","timePriorities":["0","0","0","0","0","0","0","2","3","5","5","5","3","5","5","5","4","3","3","2","1","0","0","0","0","0","0","0","0","0","0","2","3","5","5","5","3","5","5","5","4","3","3","2","1","0","0","0","0","0","0","0","0","0","0","2","3","5","5","5","3","5","5","5","4","3","3","2","1","0","0","0","0","0","0","0","0","0","0","2","3","5","5","5","3","5","5","5","4","3","3","2","1","0","0","0","0","0","0","0","0","0","0","2","3","5","5","5","3","3","2","2","2","2","2","2","1","0","0","0","0","0","0","0","0","0","0","0","1","2","2","2","1","2","2","2","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0"]}]}],"sharedStudents":[{"id":"f8acaba1-683a-46d4-88cb-9d977720f1da","count":7,"unitA":{"id":"4854f0f6-9ac2-4c74-9372-c561c133878f","type":0,"requiredCapacity":42,"duration":83,"periodic":true,"compulsory":true,"frozen":false,"weeks":["1","2","3","4","5","6"],"day":2,"startTime":754},"unitB":{"id":"706ddf87-2acc-435b-88b9-78f4ca0a472b","type":3,"requiredCapacity":24,"duration":201,"periodic":false,"compulsory":false,"frozen":false,"weeks":[],"day":0,"startTime":-1}}],"suitableRooms":[{"id":"f037c332-b617-4588-853b-8e3cb0118580","unitType":0,"room":{"name":"název-místnosti","capacity":42,"reservedHours":["reserved","reserved","reserved","reserved","reserved","reserved","free","free","free","free","free","free","free","free","free","free","free","free","free","free","free","reserved","reserved","reserved","reserved","reserved","reserved","reserved","reserved","reserved","free","free","free","free","free","free","free","free","free","free","free","free","free","free","free","reserved","reserved","reserved","reserved","reserved","reserved","reserved","reserved","reserved","free","free","free","free","free","free","free","free","free","free","free","free","free","free","free","reserved","reserved","reserved","reserved","reserved","reserved","reserved","reserved","reserved","free","free","free","free","free","free","free","free","free","free","free","free","free","free","free","reserved","reserved","reserved","reserved","reserved","reserved","reserved","reserved","reserved","free","free","free","free","free","free","free","free","free","free","free","free","free","free","free","reserved","reserved","reserved","reserved","reserved","reserved","reserved","reserved","reserved","free","free","free","free","free","free","free","free","free","free","free","free","reserved","reserved","reserved","reserved","reserved","reserved","reserved","reserved","reserved","reserved","reserved","reserved","free","free","free","free","free","free","free","free","free","free","free","free","reserved","reserved","reserved","reserved","reserved","reserved"]},"subject":{"abbreviation":"zkratka-předmětu","name":"celý-název-předmětu"}}]}
