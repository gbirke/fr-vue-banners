<template>
	<button class="wmde-banner-close t-close-main-banner" @click.prevent="$emit( 'close' )">
		<slot>
			<CloseIconDefault/>
		</slot>
	</button>
</template>

<script setup lang="ts">
import CloseIconDefault from '@src/components/Icons/CloseIconDefault.vue';

defineEmits( [ 'close' ] );
</script>
