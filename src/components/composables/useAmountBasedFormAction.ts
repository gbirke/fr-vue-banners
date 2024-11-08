import { computed, Ref } from 'vue';
import { useFormModel } from '@src/components/composables/useFormModel';
import { FormActions } from '@src/domain/FormActions';
import { AddressTypes } from '@src/utils/FormItemsBuilder/fields/AddressTypes';
import { PaymentMethods } from '@src/utils/FormItemsBuilder/fields/PaymentMethods';

export function useFormAction( formActions: FormActions, minimumAmount: number, extraURLParameters: { smallAmount: string, largeAmount: string } ): { formAction: Ref<string> } {
	const formModel = useFormModel();
	const formAction = computed( (): string => {

		let URL: string = formActions.donateAnonymouslyAction;

		if ( formModel.addressType.value !== AddressTypes.ANONYMOUS.value ) {
			URL = formActions.donateWithAddressAction;
		}

		if ( formModel.paymentMethod.value === PaymentMethods.DIRECT_DEBIT.value ) {
			URL = formActions.donateWithAddressAction;
		}

		URL += '&' + ( formModel.numericAmount.value > minimumAmount ? extraURLParameters.largeAmount : extraURLParameters.smallAmount );

		return URL;
	} );

	return {
		formAction
	};
}
