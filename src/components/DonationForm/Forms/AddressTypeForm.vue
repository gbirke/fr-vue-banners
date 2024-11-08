<template>
	<form @submit.prevent="onSubmit" class="wmde-banner-sub-form wmde-banner-form-address-type">
		<div class="wmde-banner-form-address-type-back">
			<a tabIndex="-1" href="#" class="previous" @click.prevent="onPrevious">
				<ChevronLeftIcon/>
			</a>
		</div>

		<div class="wmde-banner-form-address-type-title">
			<p><strong>{{ $translate( 'address-type-label' ) }}</strong></p>
		</div>

		<fieldset class="wmde-banner-form-field-group">
			<legend class="wmde-banner-form-field-group-legend">{{ $translate( 'address-type-header' ) }}</legend>
			<SelectGroup
				fieldName="select-address-option"
				:selectionItems="formItems.addressType"
				:isValid="isValidOrUnset( addressTypeValidity )"
				:errorMessage="''"
				v-model:inputValue="addressType"
				@change="onChange"
				:disabledOptions="disabledAddressTypes"
			/>
		</fieldset>

		<div v-if="formNotice !== ''" class="wmde-banner-form-address-type-notice">{{ formNotice }}</div>

		<div v-if="!isValidOrUnset( addressTypeValidity )" class="wmde-banner-form-address-type-error">{{ $translate( 'address-type-error-message' ) }}</div>

		<div class="wmde-banner-form-button-container wmde-banner-form-address-type-button">
			<button tabIndex="-1" class="wmde-banner-form-button t-submit-address-type" type="submit">
				{{ buttonText }}
			</button>
		</div>
	</form>

</template>

<script lang="ts">
// All form components must have names
export default {
	name: 'AddressTypeForm'
};
</script>

<script setup lang="ts">
import { computed, inject } from 'vue';
import { useFormModel } from '@src/components/composables/useFormModel';
import { isValidOrUnset } from '@src/components/DonationForm/Forms/isValidOrUnset';
import { useFormStepShownEvent } from '@src/components/DonationForm/Forms/useFormStepShownEvent';
import SelectGroup from '@src/components/DonationForm/SubComponents/SelectGroup.vue';
import ChevronLeftIcon from '@src/components/Icons/ChevronLeftIcon.vue';
import { Tracker } from '@src/tracking/Tracker';
import { Translator } from '@src/Translator';
import { DonationFormItems } from '@src/utils/FormItemsBuilder/DonationFormItems';
import { AddressTypes } from '@src/utils/FormItemsBuilder/fields/AddressTypes';
import { PaymentMethods } from '@src/utils/FormItemsBuilder/fields/PaymentMethods';
import { Validity } from '@src/utils/FormModel/Validity';

interface Props {
	isCurrent: boolean
}

const props = defineProps<Props>();
const emit = defineEmits( [ 'submit', 'previous' ] );

const tracker = inject<Tracker>( 'tracker' );
const formItems = inject<DonationFormItems>( 'formItems' );
const translator = inject<Translator>( 'translator' );
const formModel = useFormModel();
const {
	addressType, addressTypeValidity,
	paymentMethod, disabledAddressTypes
} = formModel;

useFormStepShownEvent( 'AddressTypeForm', tracker, props );

const onPrevious = (): void => {
	emit( 'previous' );
};

const onSubmit = (): void => {
	addressTypeValidity.value = addressType.value === '' ? Validity.Invalid : Validity.Valid;
	if ( addressTypeValidity.value === Validity.Valid ) {
		emit( 'submit' );
	}
};

const onChange = (): void => {
	addressTypeValidity.value = Validity.Valid;
};

const formNotice = computed( (): string => {
	if ( paymentMethod.value === PaymentMethods.DIRECT_DEBIT.value ) {
		return translator.translate( 'address-type-notice-direct-debit' );
	}
	return '';
} );

const buttonText = computed( (): string => {
	if ( addressType.value !== AddressTypes.ANONYMOUS.value ) {
		return translator.translate( 'submit-label-default' );
	}
	if ( paymentMethod.value === PaymentMethods.PAYPAL.value ) {
		return translator.translate( 'submit-label-paypal' );
	} else if ( paymentMethod.value === PaymentMethods.CREDIT_CARD.value ) {
		return translator.translate( 'submit-label-credit-card' );
	} else if ( paymentMethod.value === PaymentMethods.SOFORT.value ) {
		return translator.translate( 'submit-label-sofort' );
	} else if ( paymentMethod.value === PaymentMethods.BANK_TRANSFER.value ) {
		return translator.translate( 'submit-label-bank-transfer' );
	}
	return translator.translate( 'submit-label-default' );
} );

</script>
