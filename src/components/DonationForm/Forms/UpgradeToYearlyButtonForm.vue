<template>
	<form @submit.prevent="onSubmit" class="wmde-banner-sub-form wmde-banner-form-upgrade">
		<div class="wmde-banner-form-upgrade-title">
			<a tabIndex="-1" href="#" class="previous" @click.prevent="onPrevious">
				<slot name="back">
					<FormPreviousIcon/>
				</slot>
			</a>
			{{ $translate( 'upgrade-to-yearly-header', { amount: secondPageAmount } ) }}
		</div>
		<div class="wmde-banner-form-upgrade-notice" v-html="$translate( 'upgrade-to-yearly-copy' )"/>

		<div class="wmde-banner-form-upgrade-buttons">
			<button
				type="submit"
				tabIndex="-1"
				class="wmde-banner-form-button t-annual-upgrade-no"
				:value="Intervals.ONCE.value"
			>
				{{ $translate( 'upgrade-to-yearly-no', { amount: secondPageAmount } ) }}
			</button>

			<button
				type="submit"
				tabIndex="-1"
				class="wmde-banner-form-button t-annual-upgrade-yes"
				:value="Intervals.YEARLY.value"
			>
				{{ $translate( 'upgrade-to-yearly-yes', { amount: secondPageAmount } ) }}
			</button>

			<a
				v-if="showManualUpgradeOption"
				tabIndex="-1"
				href="#"
				class="wmde-banner-form-upgrade-custom t-annual-upgrade-yes-custom"
				@click.prevent="onGoToChangeOfAmount"
			>
				{{ $translate( 'upgrade-to-yearly-link' ) }}
			</a>
		</div>
	</form>
</template>

<script setup lang="ts">
import { computed, inject, ref } from 'vue';
import { useFormModel } from '@src/components/composables/useFormModel';
import { Intervals } from '@src/utils/FormItemsBuilder/fields/Intervals';
import { Currency } from '@src/utils/DynamicContent/formatters/Currency';
import { useFormStepShownEvent } from '@src/components/DonationForm/Forms/useFormStepShownEvent';
import { Tracker } from '@src/tracking/Tracker';
import { UpgradeToYearlyEvent } from '@src/tracking/events/UpgradeToYearlyEvent';
import FormPreviousIcon from '@src/components/Icons/FormPreviousIcon.vue';

interface Props {
	// eslint-disable-next-line vue/no-unused-properties
	isCurrent: boolean;
	showManualUpgradeOption?: boolean;
}

const props = withDefaults( defineProps<Props>(), {
	showManualUpgradeOption: true
} );
const emit = defineEmits( [ 'submit', 'previous' ] );

const tracker = inject<Tracker>( 'tracker' );
const interval = ref<string>( '' );

useFormStepShownEvent( 'UpgradeToYearlyForm', tracker, props );

const onSubmit = ( e: SubmitEvent ): void => {
	const submitValue = ( e.submitter as HTMLInputElement ).value;

	tracker.trackEvent( new UpgradeToYearlyEvent(
		submitValue === Intervals.YEARLY.value ? 'upgraded-to-yearly' : 'not-upgraded-to-yearly'
	) );

	emit( 'submit', { upgradeToYearlyInterval: submitValue } );
};

const onGoToChangeOfAmount = (): void => {
	emit( 'submit', {
		changeOfAmount: true,
		upgradeToYearlyInterval: Intervals.YEARLY.value
	} );
};

const onPrevious = (): void => {
	interval.value = null;
	emit( 'previous' );
};

const { totalNumericAmount } = useFormModel();
const currencyFormatter = inject<Currency>( 'currencyFormatter' );
const secondPageAmount = computed( (): string => currencyFormatter.euroAmount( totalNumericAmount.value ) );

</script>
