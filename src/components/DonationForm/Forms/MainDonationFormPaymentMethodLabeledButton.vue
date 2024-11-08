<template>
	<button class="wmde-banner-form-button t-submit-main-donation" type="submit">
		{{ submitButtonLabel }}
	</button>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue';
import { useFormModel } from '@src/components/composables/useFormModel';
import { Translator } from '@src/Translator';
import { Intervals } from '@src/utils/FormItemsBuilder/fields/Intervals';
import { PaymentMethods } from '@src/utils/FormItemsBuilder/fields/PaymentMethods';

const formModel = useFormModel();
const translator = inject<Translator>( 'translator' );
const { paymentMethod, interval } = formModel;

const submitButtonLabel = computed( (): string => {
	if ( interval.value === Intervals.ONCE.value ) {
		return translator.translate( 'submit-label' );
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
	return translator.translate( 'submit-label' );
} );
</script>
