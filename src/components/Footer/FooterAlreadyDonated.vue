<template>
	<div class="wmde-banner-footer">
		<div class="wmde-banner-footer-bank">
			<label class="wmde-banner-footer-bank-item account">{{ $translate( 'donation-account' ) }}:
				<SelectionInput :value="'Wikimedia e. V.'"/>
			</label>
			<label class="wmde-banner-footer-bank-item bic">BIC:
				<SelectionInput :value="'BFSWDE33XXX'"/>
			</label>
			<label class="wmde-banner-footer-bank-item iban">IBAN:
				<SelectionInput :value="'DE09 3702 0500 0003 2873 00'" :focusedValue="'DE09370205000003287300'"/>
			</label>
			<a
				href="#"
				class="wmde-banner-footer-already-donated"
				@click.prevent="onClickAlreadyDonated"
				:title="$translate( 'already-donated-description' )"
			>
				<TickIcon :fill="'#5B5B5B'"/> {{ $translate( 'already-donated-open-link' ) }}
			</a>
		</div>

		<div class="wmde-banner-footer-usage">
			<div class="wmde-banner-footer-item">
				<a
					id="application-of-funds-link"
					class="wmde-banner-footer-usage-link t-use-of-funds-link"
					@click.prevent="$emit( 'showFundsModal' )"
					:title="$translate( 'use-of-funds-link-description' )"
				>
					{{ $translate( 'use-of-funds-link' ) }}
				</a>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import SelectionInput from '@src/components/Footer/SelectionInput.vue';
import TickIcon from '@src/components/Icons/TickIcon.vue';
import { inject } from 'vue';
import { Tracker } from '@src/tracking/Tracker';
import { ClickAlreadyDonatedEvent } from '@src/tracking/events/ClickAlreadyDonatedEvent';

const tracker = inject<Tracker>( 'tracker' );

const emit = defineEmits( [ 'clickedAlreadyDonatedLink', 'showFundsModal' ] );

const onClickAlreadyDonated = (): void => {
	tracker.trackEvent( new ClickAlreadyDonatedEvent() );
	emit( 'clickedAlreadyDonatedLink' );
};
</script>
