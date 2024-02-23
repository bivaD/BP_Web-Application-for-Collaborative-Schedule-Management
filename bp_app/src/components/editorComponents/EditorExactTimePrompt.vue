<!--
 - @file EditorExactTimePromp.vue
 - @description In this file is component with prompt for placing lecture to exact time.
 - @author David Novák
 - @created 9. March 2023
 - 
 - This code is part of a bachelor's thesis at the FIT BUT.
-->
<template>
	<div v-if="isToggled" class="prompt-wrapper">
		<div class="prompt">
			<h4>Umístění lekce {{ unitId }} na konkrétní čas:</h4>
			<label class="m-1 column-align">Čas začátku": </label>
			<TimeInput v-model:value="time" v-model:valid="timeValid" :min-time="1"/>

			<button class="btn btn-secondary m-1 mt-3" @click="close()">
				Zavřít
			</button>
			<button class="btn btn-dark m-1 mt-3" @click="saveAndClose()">
				Přemístit a zavřít
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, toRefs, type Ref } from 'vue';
import { useSocketioStore } from '@/stores/SocketioStore';
import TimeInput from '../formComponents/TimeInput.vue';

interface Props {
	isToggled: boolean,
	unitId: string
}
const props = defineProps<Props>()
const { isToggled, unitId } = toRefs(props);

//getting time
var time: Ref<number> = ref(600);
var timeValid: Ref<boolean> = ref(true);

//closing and saving
const emit = defineEmits<{
	(e: 'save', unitId: string, time: number): void,
	(e: 'close'): void
}>()

function saveAndClose() {
	if(timeValid.value){
	emit('save', unitId.value, time.value);
	emit('close');
	}
}
var ioStore = useSocketioStore();
function close() {
	ioStore.unlockUnit(unitId.value);
	emit('close');
}
</script>

<style scoped>
.prompt-wrapper {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 42;
	background-color: rgba(0, 0, 0, 0.425);

	display: flex;
	align-items: center;
	justify-content: center;
}

.prompt {
	background: white;
	padding: 3rem;
	border: 1px black solid;
	border-radius: 2rem;
}
</style>