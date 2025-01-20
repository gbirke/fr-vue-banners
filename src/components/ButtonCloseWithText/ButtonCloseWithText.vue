<template>
	<button class="wmde-banner-close wmde-banner-close-with-text t-close-main-banner" @click.prevent="$emit( 'close' )">
		<span class="wmde-banner-close-button-text">{{ buttonText }}</span>
		<slot>
			<CloseIconDefault/>
		</slot>
	</button>
</template>

<script setup lang="ts">
import CloseIconDefault from '@src/components/Icons/CloseIconDefault.vue';

interface Props {
	buttonText: string;
}

withDefaults( defineProps<Props>(), {
	buttonText: ''
} );

defineEmits( [ 'close' ] );
</script>
