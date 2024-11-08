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
const { interval, paymentMethod, numericAmount } = formModel;

interface Props {
	maxAmount: number;
}

const props = defineProps<Props>();

const submitButtonLabel = computed( (): string => {
	if ( interval.value !== Intervals.ONCE.value ) {
		return translator.translate( 'submit-label' );
	}

	if ( paymentMethod.value === PaymentMethods.SOFORT.value ) {
		return translator.translate( 'submit-label' );
	}

	if ( numericAmount.value >= props.maxAmount ) {
		return translator.translate( 'submit-label' );
	}

	return translator.translate( 'submit-label-short' );
} );
</script>
