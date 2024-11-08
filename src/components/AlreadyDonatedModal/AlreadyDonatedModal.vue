<template>
	<div :class="[ 'wmde-banner-already-donated', {
		'wmde-banner-already-donated--is-visible': isVisible
	} ]">
		<div class="wmde-banner-already-donated-content">
			<ButtonClose @close="onHideClick"/>
			<slot name="already-donated-content"/>
			<div class="wmde-banner-already-donated-buttons">
				<button
					class="wmde-banner-already-donated-button wmde-banner-already-donated-button-maybe-later"
					@click="onMaybeLaterClick"
				>
					{{ $translate( 'already-donated-maybe-later-button' ) }}
				</button>
				<button
					class="wmde-banner-already-donated-button wmde-banner-already-donated-button-go-away"
					@click="onGoAwayClick"
				>
					{{ $translate( 'already-donated-go-away-button' ) }}
				</button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">

import { inject, ref, watch } from 'vue';
import ButtonClose from '@src/components/ButtonClose/ButtonClose.vue';
import { AlreadyDonatedShownEvent } from '@src/tracking/events/AlreadyDonatedShownEvent';
import { Tracker } from '@src/tracking/Tracker';

interface Props {
	isVisible: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits( [ 'hideAlreadyDonatedModal', 'maybeLater', 'goAway' ] );
const tracker = inject<Tracker>( 'tracker' );
const eventWasFired = ref<boolean>( false );

const onHideClick = (): void => {
	emit( 'hideAlreadyDonatedModal' );
};

const onMaybeLaterClick = (): void => {
	emit( 'maybeLater' );
};

const onGoAwayClick = (): void => {
	emit( 'goAway' );
};

watch( () => props.isVisible, ( isVisible: boolean ) => {
	if ( !eventWasFired.value && isVisible ) {
		tracker.trackEvent( new AlreadyDonatedShownEvent() );
		eventWasFired.value = true;
	}
} );

</script>
