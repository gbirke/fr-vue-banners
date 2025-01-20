<template>
	<form
		method="post"
		class="wmde-banner-sub-form wmde-banner-sub-form-donation"
		@submit.prevent="validate"
	>
		<fieldset class="wmde-banner-form-field-group">
			<legend class="wmde-banner-form-field-group-legend">{{ $translate( 'intervals-header' ) }}</legend>
			<SelectGroup
				:field-name="'select-interval'"
				:selectionItems="formItems.intervals"
				:isValid="isValidOrUnset( intervalValidity )"
				:errorMessage="$translate( 'no-interval-message' )"
				v-model:inputValue="interval"
				:disabledOptions="disabledIntervals"
			/>
		</fieldset>

		<fieldset class="wmde-banner-form-field-group">
			<legend class="wmde-banner-form-field-group-legend">{{ $translate( 'amounts-header' ) }}</legend>
			<SelectGroup
				fieldName="select-amount"
				:selectionItems="formItems.amounts"
				:isValid="isValidOrUnset( amountValidity )"
				:errorMessage="$translate( amountValidityMessageKey( amountValidity ) )"
				v-model:inputValue="selectedAmount"
			>
				<SelectCustomAmount
					fieldName="select-amount"
					v-model:inputValue="customAmount"
					@focus="clearSelectedAmount"
					@blur="formatCustomAmount"
					:placeholder="$translate( customAmountPlaceholderKey )"
				/>
			</SelectGroup>
		</fieldset>

		<fieldset class="wmde-banner-form-field-group">
			<legend class="wmde-banner-form-field-group-legend">{{ $translate( 'payments-header' ) }}</legend>
			<SelectGroup
				:field-name="'select-payment-method'"
				:selectionItems="formItems.paymentMethods"
				:isValid="isValidOrUnset( paymentMethodValidity )"
				:errorMessage="$translate( 'no-payment-type-message' )"
				v-model:inputValue="paymentMethod"
				:disabledOptions="disabledPaymentMethods"
			>
				<template #select-group-label="{ label, slotName }: any">
					<slot :name="'label-' + slotName" :label="label"/>
				</template>
				<SmsBox>
					<template #sms-icon>
						<slot name="sms-icon"/>
					</template>
				</SmsBox>
			</SelectGroup>
		</fieldset>

		<div class="wmde-banner-form-transaction-fee" v-show="numericAmount > 0 && transactionFee > 0">
			<input
				class="wmde-banner-form-field-checkbox"
				type="checkbox"
				value="1"
				name="cover-transaction-fee"
				id="wmde-banner-form-cover-transaction-costs"
				v-model="hasTransactionFee"
			>
			<label for="wmde-banner-form-cover-transaction-costs">
				{{ $translate( 'cover-transaction-costs', { transactionCosts: currencyFormatter.euroAmount( transactionFee ) } ) }}
			</label>
		</div>

		<div class="wmde-banner-form-button-container">
			<slot name="button">
				<MainDonationFormButtonMultiStep/>
			</slot>
			<button v-if="!isFormValid && showErrorScrollLink" class="wmde-banner-form-button-error">
				{{ $translate( 'global-error' ) }}
			</button>
		</div>
	</form>
</template>

<script lang="ts">
// All form components must have names
export default {
	name: 'MainDonationFormTransactionFees'
};
</script>

<script setup lang="ts">

import { inject, ref } from 'vue';
import SelectGroup from '@src/components/DonationForm/SubComponents/SelectGroup.vue';
import { DonationFormItems } from '@src/utils/FormItemsBuilder/DonationFormItems';
import SelectCustomAmount from '@src/components/DonationForm/SubComponents/SelectCustomAmount.vue';
import SmsBox from '@src/components/DonationForm/SubComponents/SmsBox.vue';
import { useFormModel } from '@src/components/composables/useFormModel';
import { newDonationFormValidator } from '@src/validation/DonationFormValidator';
import { amountValidityMessageKey } from '@src/utils/amountValidityMessageKey';
import { isValidOrUnset } from '@src/components/DonationForm/Forms/isValidOrUnset';
import { Currency } from '@src/utils/DynamicContent/formatters/Currency';
import MainDonationFormButtonMultiStep from '@src/components/DonationForm/Forms/MainDonationFormButtonMultiStep.vue';

interface Props {
	showErrorScrollLink?: boolean;
	customAmountPlaceholderKey?: string;
}

withDefaults( defineProps<Props>(), {
	showErrorScrollLink: false,
	customAmountPlaceholderKey: 'custom-amount-placeholder'
} );
const emit = defineEmits( [ 'submit' ] );

const currencyFormatter = inject<Currency>( 'currencyFormatter' );
const formItems = inject<DonationFormItems>( 'formItems' );
const formModel = useFormModel();
const validator = newDonationFormValidator( formModel );
const isFormValid = ref<boolean>( true );

const validate = (): void => {
	isFormValid.value = validator.validate();

	if ( isFormValid.value ) {
		emit( 'submit' );
	}
};

const {
	interval, intervalValidity, disabledIntervals,
	selectedAmount, customAmount, numericAmount, amountValidity,
	paymentMethod, paymentMethodValidity, disabledPaymentMethods,
	transactionFee, hasTransactionFee
} = formModel;

const clearSelectedAmount = (): void => {
	selectedAmount.value = '';
};

const formatCustomAmount = (): void => {
	if ( customAmount.value !== '' ) {
		customAmount.value = currencyFormatter.customAmountInput( numericAmount.value );
	}
};

</script>
