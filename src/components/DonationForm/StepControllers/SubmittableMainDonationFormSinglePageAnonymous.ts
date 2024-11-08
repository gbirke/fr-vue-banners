import { StepController } from '@src/components/DonationForm/StepController';
import { StepAction } from '@src/components/DonationForm/StepNavigation';
import { BannerSubmitEvent } from '@src/tracking/events/BannerSubmitEvent';
import { AddressTypes } from '@src/utils/FormItemsBuilder/fields/AddressTypes';
import { PaymentMethods } from '@src/utils/FormItemsBuilder/fields/PaymentMethods';
import { FormModel } from '@src/utils/FormModel/FormModel';

export function createSubmittableMainDonationFormSinglePageAnonymous( formModel: FormModel ): StepController {
	return {
		async submit( navigation: StepAction ): Promise<void> {
			if ( !paymentMethodRequiresAddress( formModel ) ) {
				formModel.addressType.value = AddressTypes.ANONYMOUS.value;
			}
			await navigation.submit( new BannerSubmitEvent( 'MainDonationForm' ) );
		},
		async previous(): Promise<void> {
			return Promise.reject( 'Single page forms cannot go to previous. This should never happen.' );
		}
	};
}
function paymentMethodRequiresAddress( formModel: FormModel ): boolean {
	return formModel.paymentMethod.value === PaymentMethods.DIRECT_DEBIT.value;
}
