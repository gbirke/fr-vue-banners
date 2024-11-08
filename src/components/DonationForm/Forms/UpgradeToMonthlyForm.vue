<template>
	<form @submit.prevent="onSubmit" class="wmde-banner-sub-form wmde-banner-form-upgrade">
		<a tabIndex="-1" href="#" class="wmde-banner-form-upgrade-back" @click.prevent="onPrevious">
			<ChevronLeftIcon/>
		</a>
		<div class="wmde-banner-form-upgrade-notice">
			<p><strong>{{ $translate( 'upgrade-to-monthly-header', { amount: secondPageAmountMonthlyFraction } ) }}</strong></p>
			<p>{{ $translate( 'upgrade-to-monthly-copy' ) }}</p>
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
                                {{ $translate( 'upgrade-to-monthly-no', { amount: secondPageAmount } ) }}
                            </span>
						</label>
					</div>
					<div
						class="wmde-banner-select-group-option wmde-banner-select-group-option-yes"
						:class="{ 'active': interval === Intervals.MONTHLY.value }"
					>
						<label class="t-annual-upgrade-yes">
							<input
								tabIndex="-1"
								type="radio"
								v-model="interval"
								name="alternative"
								:value="Intervals.MONTHLY.value"
								class="wmde-banner-select-group-input"
								@change="onChange"
							/>
							<span class="wmde-banner-select-group-label">
                                {{ $translate( 'upgrade-to-monthly-yes', { amount: secondPageAmountMonthlyFraction } ) }}
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
			{{ $translate( 'upgrade-to-monthly-link' ) }}
		</a>

		<span v-if="intervalValidity === Validity.Invalid" class="wmde-banner-select-group-error-message">
            <span class="wmde-banner-error-icon">
                {{ $translate( 'upgrade-to-monthly-error' ) }}
            </span>
        </span>

		<div class="wmde-banner-form-button-container upgrade-to-yearly-button">
			<button tabIndex="-1" class="wmde-banner-form-button t-submit-upgrade-to-yearly" type="submit">
				{{ $translate( 'upgrade-to-monthly-button' ) }}
			</button>
		</div>

	</form>
</template>

<script lang="ts">
// All form components must have names
export default {
	name: 'UpgradeToMonthlyForm'
};
</script>
<script setup lang="ts">

import { inject, ref, watch } from 'vue';
import { useFormModel } from '@src/components/composables/useFormModel';
import { useFormStepShownEvent } from '@src/components/DonationForm/Forms/useFormStepShownEvent';
import ChevronLeftIcon from '@src/components/Icons/ChevronLeftIcon.vue';
import { UpgradeToMonthlyEvent } from '@src/tracking/events/UpgradeToMonthlyEvent';
import { Tracker } from '@src/tracking/Tracker';
import { Currency } from '@src/utils/DynamicContent/formatters/Currency';
import { Intervals } from '@src/utils/FormItemsBuilder/fields/Intervals';
import { Validity } from '@src/utils/FormModel/Validity';

interface AmountSuggestion {
	lowerRangeLimit: number,
	upperRangeLimit: number,
	suggestedAmount: number
}

interface Props {
	isCurrent: boolean,
	suggestions: AmountSuggestion[]
}

const props = defineProps<Props>();
const emit = defineEmits( [ 'submit', 'previous' ] );

const tracker = inject<Tracker>( 'tracker' );
const interval = ref<string>( '' );
const intervalValidity = ref<Validity>( Validity.Unset );

const { numericAmount } = useFormModel();
const currencyFormatter = inject<Currency>( 'currencyFormatter' );
const suggestedMonthlyFraction = ref( 0 );

const secondPageAmount = ref( currencyFormatter.euroAmount( numericAmount.value ) );
const secondPageAmountMonthlyFraction = ref( '' );

useFormStepShownEvent( 'UpgradeToMonthlyForm', tracker, props );

// dynamic read-only access for the template variables (so they don't update when the user updates the amount selection on the second page)
watch( numericAmount, () => {
	if ( !props.isCurrent ) {

		const suggestionsItem = props.suggestions.find(
			( s: AmountSuggestion ) => numericAmount.value >= s.lowerRangeLimit && numericAmount.value <= s.upperRangeLimit );
		suggestedMonthlyFraction.value = suggestionsItem ? suggestionsItem.suggestedAmount : numericAmount.value;

		secondPageAmount.value = currencyFormatter.euroAmount( numericAmount.value );
		secondPageAmountMonthlyFraction.value = currencyFormatter.euroAmount( suggestedMonthlyFraction.value );
	}
} );

const onSubmit = (): void => {
	intervalValidity.value = interval.value ? Validity.Valid : Validity.Invalid;
	if ( intervalValidity.value === Validity.Invalid ) {
		return;
	}

	tracker.trackEvent( new UpgradeToMonthlyEvent(
		interval.value === Intervals.ONCE.value ? 'not-upgraded-to-monthly' : 'upgraded-to-monthly'
	) );

	emit( 'submit', {
		changeOfAmount: false,
		upgradeToMonthlyInterval: interval.value,
		newNumericAmount: interval.value === Intervals.MONTHLY.value ? suggestedMonthlyFraction.value : numericAmount.value
	} );
};

const onGoToChangeOfAmount = (): void => {
	intervalValidity.value = Validity.Valid;
	emit( 'submit', {
		changeOfAmount: true,
		upgradeToMonthlyInterval: Intervals.MONTHLY.value
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

</script>
