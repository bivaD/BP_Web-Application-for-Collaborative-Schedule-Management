<template>
    <div>
        <TopPanel  :selected="'data'"/>
        <div class="m-5">
            <button class="btn btn-dark bi-arrow-left" @click="$router.back">{{ '  Zpět ' }}</button>
            <h3 class="mt-4">Přidat pomocí formuláře</h3>
            <div class="my-1">
                <button class="btn btn-dark m-1" @click="$router.push('/data/rooms/add')">Místnost</button>
                <button class="btn btn-dark m-1" @click="$router.push('/data/suitableRooms/add')">Vhodnou místnost</button>
                <button class="btn btn-dark m-1" @click="$router.push('/data/lecturers/add')">Přednášejícího</button>
                <button class="btn btn-dark m-1" @click="$router.push('/data/subjects/add')">Předmět</button>
                <button class="btn btn-dark m-1" @click="$router.push('/data/units/add')">Lekci</button>
                <button class="btn btn-dark m-1" @click="$router.push('/data/sharedStudents/add')">Sdílené studenty</button>
            </div>
            <div>
                <h3 class="mt-4">Přidat jako JSON</h3>
                <FormAddJson></FormAddJson>
            </div>
            <h5 class="mt-2">Požadovaný formát JSONu:</h5>
            <pre>{
   "settings":[
      {
         "name":"název-nastavení",
         "value":"hodnota-nastavení-jako-string"
      }
   ],
   "rooms":[
      {
         "name":"název-místnosti",
         "capacity":42,
         "reservedHours":[
            "reserved",
            "free",
            ...168x
         ]
      }
   ],
   "subjects":[
      {
         "abbreviation":"zkratka-předmětu",
         "name":"celý-název-předmětu"
      }
   ],
   "lecturers":[
      {
         "id":"73e65aac-1a53-4338-a598-0047d9f70628",
         "name":"jméno",
         "surname":"příjmení",
         "titlesBefore":"tituly-před-jménem",
         "titlesAfter":"tituly-za-jménem",
         "timePriorities":[
            "0",
            "1",
            "5",
            ...168x
         ]
      }
   ],
   "units":[
      {
         "id":"4854f0f6-9ac2-4c74-9372-c561c133878f",
         "type":0,
         "requiredCapacity":42,
         "duration":83,
         "periodic":true,
         "compulsory":true,
         "frozen":false,
         "weeks":[
            "1",
            "2",
            "3",
            "4",
            "5",
            "6"
         ],
         "day":2,
         "startTime":754,
         "room":{
                "name":"název-místnosti",
                "capacity":42,
                "reservedHours":[
                "reserved",
                "free",
                ...168x
            ]
         },
         "subject":{
            "abbreviation":"zkratka-předmětu",
            "name":"celý-název-předmětu"
         },
         "lecturers":[
            {
               "id":"73e65aac-1a53-4338-a598-0047d9f70628",
               "name":"jméno",
               "surname":"příjmení",
               "titlesBefore":"tituly-před-jménem",
               "titlesAfter":"tituly-za-jménem",
               "timePriorities":[
                    "0",
                    "1",
                    "5",
                    ...168x
                ]
            }
        ]
      },
      {
         "id":"706ddf87-2acc-435b-88b9-78f4ca0a472b",
         "type":3,
         "requiredCapacity":24,
         "duration":201,
         "periodic":false,
         "compulsory":false,
         "frozen":false,
         "weeks":[
            
         ],
         "day":0,
         "startTime":-1,
         "room":{
            "name":"unsorted",
            "capacity":424242,
            "reservedHours":[
               
            ]
         },
         "subject":{
            "abbreviation":"zkratka-předmětu",
            "name":"celý-název-předmětu"
         },
         "lecturers":[
            {
               "id":"73e65aac-1a53-4338-a598-0047d9f70628",
               "name":"jméno",
               "surname":"příjmení",
               "titlesBefore":"tituly-před-jménem",
               "titlesAfter":"tituly-za-jménem",
               "timePriorities":[
                    "0",
                    "1",
                    "5",
                    ...168x
                ]
            }
         ]
      }
   ],
   "sharedStudents":[
      {
         "id":"f8acaba1-683a-46d4-88cb-9d977720f1da",
         "count":7,
         "unitA":{
            "id":"4854f0f6-9ac2-4c74-9372-c561c133878f",
            "type":0,
            "requiredCapacity":42,
            "duration":83,
            "periodic":true,
            "compulsory":true,
            "frozen":false,
            "weeks":[
               "1",
               "2",
               "3",
               "4",
               "5",
               "6"
            ],
            "day":2,
            "startTime":754
         },
         "unitB":{
            "id":"706ddf87-2acc-435b-88b9-78f4ca0a472b",
            "type":3,
            "requiredCapacity":24,
            "duration":201,
            "periodic":false,
            "compulsory":false,
            "frozen":false,
            "weeks":[
               
            ],
            "day":0,
            "startTime":-1
         }
      }
   ],
   "suitableRooms":[
      {
         "id":"f037c332-b617-4588-853b-8e3cb0118580",
         "unitType":0,
         "room":{
            "name":"název-místnosti",
            "capacity":42,
            "reservedHours":[
            "reserved",
            "free",
            ...168x
         ]
         },
         "subject":{
            "abbreviation":"zkratka-předmětu",
            "name":"celý-název-předmětu"
         }
      }
   ]
}</pre>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Ref } from 'vue'
import TopPanel from '@/components/TopPanel.vue';
import FormAddJson from '@/components/formComponents/FormAddJson.vue';


</script>

 