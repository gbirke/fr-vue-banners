tart<template>
	<div class="wmde-banner-main">
		<slot name="close-button"/>
		<div class="wmde-banner-content">
			<div class="wmde-banner-column-left">
				<slot name="banner-text" v-if="onLargeScreen"/>
				<slot name="banner-slides" v-else :play="slideshowShouldPlay"/>
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
import { useDisplaySwitch } from '@src/components/composables/useDisplaySwitch';

interface Props {
	bannerState: BannerStates;
}

const props = defineProps<Props>();
const emit = defineEmits( [ 'formInteraction' ] );

const slideShowStopped = ref<boolean>( false );
const slideshowShouldPlay = computed( () => props.bannerState === BannerStates.Visible && !slideShowStopped.value );

const onLargeScreen = useDisplaySwitch( 1300 );

const onFormInteraction = (): void => {
	slideShowStopped.value = true;

	nextTick( () => {
		emit( 'formInteraction' );
	} );
};

</script>
