<template>
	<div class="wmde-banner-main">
		<ButtonClose @close="$emit( 'close' )"/>
		<div class="wmde-banner-content">
			<div class="wmde-banner-column-left">
				<slot name="banner-slides" :play="slideshowShouldPlay"/>
				<slot name="progress"/>
			</div>
			<div class="wmde-banner-column-right">
				<slot name="donation-form" :form-interaction="onFormInteraction"/>
			</div>
		</div>
		<slot name="footer"/>
	</div>
</template>

<script setup lang="ts">

import { computed, nextTick, ref } from 'vue';
import { BannerStates } from '@src/components/BannerConductor/StateMachine/BannerStates';
import ButtonClose from '@src/components/ButtonClose/ButtonClose.vue';

interface Props {
	bannerState: BannerStates;
}

const props = defineProps<Props>();
const emit = defineEmits( [ 'close', 'formInteraction' ] );

const slideShowStopped = ref<boolean>( false );
const slideshowShouldPlay = computed( () => props.bannerState === BannerStates.Visible && !slideShowStopped.value );

const onFormInteraction = (): void => {
	slideShowStopped.value = true;

	nextTick( () => {
		emit( 'formInteraction' );
	} );
};

</script>
