import { AmountValidity } from '@src/utils/FormModel/AmountValidity';
import { FormModel } from '@src/utils/FormModel/FormModel';
import { Validity } from '@src/utils/FormModel/Validity';

export function resetFormModel( formModel: FormModel ): void {
	formModel.interval.value = '';
	formModel.intervalValidity.value = Validity.Unset;
	formModel.selectedAmount.value = '';
	formModel.amountValidity.value = AmountValidity.Unset;
	formModel.customAmount.value = '';
	formModel.paymentMethod.value = '';
	formModel.paymentMethodValidity.value = Validity.Unset;
	formModel.addressType.value = '';
	formModel.addressTypeValidity.value = Validity.Unset;
	formModel.hasTransactionFee.value = false;
}
