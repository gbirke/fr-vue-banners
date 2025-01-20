<template>
	<form @submit.prevent="onSubmit" class="wmde-banner-sub-form wmde-banner-form-upgrade">
		<a tabIndex="-1" href="#" class="wmde-banner-form-upgrade-back" @click.prevent="onPrevious">
			<FormPreviousIcon/>
		</a>
		<div class="wmde-banner-form-upgrade-notice">
			<p><strong>{{ $translate( 'upgrade-to-yearly-header', { amount: secondPageAmount } ) }}</strong></p>
			<p v-html="$translate( 'upgrade-to-yearly-copy' )"></p>
		</div>

		<div class="wmde-banner-form-upgrade-options">
			<div :class="[
				'wmde-banner-select-group-container',
				{ 'wmde-banner-select-group-container--with-error': intervalValidity === Validity.Invalid }
			]">
				<div class="wmde-banner-select-group">
					<div
						class="wmde-banner-select-group-option wmde-banner-select-group-option-no"
						:class="{ 'active': interval === Intervals.ONCE.value }"
					>
						<label class="t-annual-upgrade-no">
							<input
								tabIndex="-1"
								type="radio"
								v-model="interval"
								name="alternative"
								:value="Intervals.ONCE.value"
								class="wmde-banner-select-group-input"
								@change="onChange"
							/>
							<span class="wmde-banner-select-group-label">
								{{ $translate( 'upgrade-to-yearly-no', { amount: secondPageAmount } ) }}
							</span>
						</label>
					</div>
					<div
						class="wmde-banner-select-group-option wmde-banner-select-group-option-yes"
						:class="{ 'active': interval === Intervals.YEARLY.value }"
					>
						<label class="t-annual-upgrade-yes">
							<input
								tabIndex="-1"
								type="radio"
								v-model="interval"
								name="alternative"
								:value="Intervals.YEARLY.value"
								class="wmde-banner-select-group-input"
								@change="onChange"
							/>
							<span class="wmde-banner-select-group-label">
								{{ $translate( 'upgrade-to-yearly-yes', { amount: secondPageAmount } ) }}
							</span>
						</label>
					</div>
				</div>
			</div>
		</div>

		<a
			tabIndex="-1"
			href="#"
			class="wmde-banner-form-upgrade-custom t-annual-upgrade-yes-custom"
			:class="{ 'wmde-banner-form-upgrade-custom--with-error': intervalValidity === Validity.Invalid }"
			@click.prevent="onGoToChangeOfAmount"
		>
			{{ $translate( 'upgrade-to-yearly-link' ) }}
		</a>

		<span v-if="intervalValidity === Validity.Invalid" class="wmde-banner-select-group-error-message">
			<span class="wmde-banner-error-icon">
				{{ $translate( 'upgrade-to-yearly-error' ) }}
			</span>
		</span>

		<div class="wmde-banner-form-button-container upgrade-to-yearly-button">
			<button tabIndex="-1" class="wmde-banner-form-button t-submit-upgrade-to-yearly" type="submit">
				{{ $translate( 'upgrade-to-yearly-button' ) }}
			</button>
		</div>

	</form>
</template>

<script lang="ts">
// All form components must have names
export default {
	name: 'UpgradeToYearlyForm'
};
</script>

<script setup lang="ts">

import { computed, inject, ref } from 'vue';
import { useFormModel } from '@src/components/composables/useFormModel';
import { Validity } from '@src/utils/FormModel/Validity';
import { Intervals } from '@src/utils/FormItemsBuilder/fields/Intervals';
import { Currency } from '@src/utils/DynamicContent/formatters/Currency';
import { Tracker } from '@src/tracking/Tracker';
import { UpgradeToYearlyEvent } from '@src/tracking/events/UpgradeToYearlyEvent';
import { useFormStepShownEvent } from '@src/components/DonationForm/Forms/useFormStepShownEvent';
import FormPreviousIcon from '@src/components/Icons/FormPreviousIcon.vue';

interface Props {
	// eslint-disable-next-line vue/no-unused-properties
	isCurrent: boolean
}

const props = defineProps<Props>();
const emit = defineEmits( [ 'submit', 'previous' ] );

const tracker = inject<Tracker>( 'tracker' );
const interval = ref<string>( '' );
const intervalValidity = ref<Validity>( Validity.Unset );

useFormStepShownEvent( 'UpgradeToYearlyForm', tracker, props );

const onSubmit = (): void => {
	intervalValidity.value = interval.value ? Validity.Valid : Validity.Invalid;
	if ( intervalValidity.value === Validity.Invalid ) {
		return;
	}

	tracker.trackEvent( new UpgradeToYearlyEvent(
		interval.value === Intervals.ONCE.value ? 'not-upgraded-to-yearly' : 'upgraded-to-yearly'
	) );

	emit( 'submit', {
		changeOfAmount: false,
		upgradeToYearlyInterval: interval.value
	} );
};

const onGoToChangeOfAmount = (): void => {
	intervalValidity.value = Validity.Valid;
	emit( 'submit', {
		changeOfAmount: true,
		upgradeToYearlyInterval: Intervals.YEARLY.value
	} );
};

const onChange = (): void => {
	intervalValidity.value = Validity.Valid;
};

const onPrevious = (): void => {
	intervalValidity.value = Validity.Unset;
	interval.value = null;
	emit( 'previous' );
};

const { totalNumericAmount } = useFormModel();
const currencyFormatter = inject<Currency>( 'currencyFormatter' );
const secondPageAmount = computed( (): string => currencyFormatter.euroAmount( totalNumericAmount.value ) );

</script>
