<template>
	<form @submit.prevent="onSubmit" class="wmde-banner-sub-form wmde-banner-form-address-type">
		<div class="wmde-banner-form-address-type-title">
			<a tabIndex="-1" href="#" class="previous" @click.prevent="onPrevious">
				<FormPreviousIcon/>
				{{ $translate( 'back-button' ) }}
			</a>
			{{ $translate( 'address-type-label' ) }}
		</div>

		<div class="wmde-banner-form-address-type-buttons">
			<div
				v-for="item in formItems.addressType"
				:key="item.value"
				:class="[ 'wmde-banner-form-address-type-button', {
					'wmde-banner-form-address-type-button--disabled': disabledAddressTypes.indexOf( item.value ) > -1
				} ]"
			>
				<button
					type="submit"
					tabIndex="-1"
					:class="[ 'wmde-banner-form-button', `t-submit-address-type-${ item.value }` ]"
					:value="item.value"
					:disabled="disabledAddressTypes.indexOf( item.value ) > -1"
				>
					{{ $translate( item.label ) }}
				</button>
				<div class="wmde-banner-form-address-type-button-notice"> {{ $translate( item.notice ) }} </div>
			</div>
		</div>

		<div class="wmde-banner-form-address-type-notice">{{ formNotice }}</div>
	</form>

</template>

<script lang="ts">
// All form components must have names
export default {
	name: 'AddressTypeButtonForm'
};
</script>

<script setup lang="ts">
import { computed, inject } from 'vue';
import { DonationFormItems } from '@src/utils/FormItemsBuilder/DonationFormItems';
import { useFormModel } from '@src/components/composables/useFormModel';
import { PaymentMethods } from '@src/utils/FormItemsBuilder/fields/PaymentMethods';
import { Translator } from '@src/Translator';
import { Tracker } from '@src/tracking/Tracker';
import { useFormStepShownEvent } from '@src/components/DonationForm/Forms/useFormStepShownEvent';
import FormPreviousIcon from '@src/components/Icons/FormPreviousIcon.vue';

interface Props {
	// eslint-disable-next-line vue/no-unused-properties
	isCurrent: boolean
}
const props = defineProps<Props>();
const emit = defineEmits( [ 'submit', 'previous' ] );

const tracker = inject<Tracker>( 'tracker' );
const formItems = inject<DonationFormItems>( 'formItems' );
const translator = inject<Translator>( 'translator' );
const formModel = useFormModel();
const { addressType, paymentMethod, disabledAddressTypes } = formModel;

useFormStepShownEvent( 'AddressTypeForm', tracker, props );

const onPrevious = (): void => {
	emit( 'previous' );
};

const onSubmit = ( e: SubmitEvent ): void => {
	addressType.value = ( e.submitter as HTMLInputElement ).value;
	emit( 'submit' );
};

const formNotice = computed( (): string => {
	if ( paymentMethod.value === PaymentMethods.DIRECT_DEBIT.value ) {
		return translator.translate( 'address-type-notice-direct-debit' );
	}
	return '';
} );

</script>
