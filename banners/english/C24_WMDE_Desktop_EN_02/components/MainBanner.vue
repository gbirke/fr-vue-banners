<template>
	<div class="wmde-banner-main">
		<slot name="close-button">
			<ButtonClose @close="$emit( 'close' )"/>
		</slot>
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
import ButtonClose from '@src/components/ButtonClose/ButtonClose.vue';
import { useDisplaySwitch } from '@src/components/composables/useDisplaySwitch';

interface Props {
	bannerState: BannerStates;
	minWidthForLargeScreen?: number;
}

const props = withDefaults( defineProps<Props>(), {
	minWidthForLargeScreen: 1300
} );
const emit = defineEmits( [ 'close', 'formInteraction' ] );

const slideShowStopped = ref<boolean>( false );
const slideshowShouldPlay = computed( () => props.bannerState === BannerStates.Visible && !slideShowStopped.value );

const onLargeScreen = useDisplaySwitch( props.minWidthForLargeScreen );

const onFormInteraction = (): void => {
	slideShowStopped.value = true;

	nextTick( () => {
		emit( 'formInteraction' );
	} );
};

</script>
