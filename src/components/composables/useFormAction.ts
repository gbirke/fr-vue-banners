import { computed, Ref } from 'vue';
import { useFormModel } from '@src/components/composables/useFormModel';
import { FormActions } from '@src/domain/FormActions';
import { AddressTypes } from '@src/utils/FormItemsBuilder/fields/AddressTypes';
import { PaymentMethods } from '@src/utils/FormItemsBuilder/fields/PaymentMethods';

export function useFormAction( formActions: FormActions ): { formAction: Ref<string> } {
	const formModel = useFormModel();
	const formAction = computed( (): string => {
		if ( formModel.addressType.value !== AddressTypes.ANONYMOUS.value ) {
			return formActions.donateWithAddressAction;
		}

		if ( formModel.paymentMethod.value === PaymentMethods.DIRECT_DEBIT.value ) {
			return formActions.donateWithAddressAction;
		}

		return formActions.donateAnonymouslyAction;
	} );

	return {
		formAction
	};
}
