<template>
	<div class="wmde-banner-selection-input"
		:class="{ focused: focused }">
		<span class="wmde-banner-selection-input-text">{{ value }}</span>
		<input
			class="wmde-banner-selection-input-input"
			type="text"
			readonly
			:value="focusedValue || value"
			@focus="handleFocus"
			@blur="handleBlur"
			ref="inputRef"
		/>
	</div>
</template>

<script setup lang="ts">

import { inject, ref } from 'vue';
import { Timer } from '@src/utils/Timer';

interface Props {
	value: string;
	focusedValue?: string;
}

defineProps<Props>();

const inputRef = ref<HTMLInputElement>( null );
const focused = ref<boolean>( false );
const timer = inject<Timer>( 'timer' );

const handleFocus = (): void => {
	timer.setTimeout( () => inputRef.value.setSelectionRange( 0, 9999 ), 1 );
	focused.value = true;
};

const handleBlur = (): void => {
	focused.value = false;
};

</script>
