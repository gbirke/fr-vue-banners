import { StepController } from '@src/components/DonationForm/StepController';
import { StepAction } from '@src/components/DonationForm/StepNavigation';
import { BannerSubmitEvent } from '@src/tracking/events/BannerSubmitEvent';
import { FormModel } from '@src/utils/FormModel/FormModel';
import { Validity } from '@src/utils/FormModel/Validity';

export function createSubmittableAddressType( formModel: FormModel, pageIndexForPrevious: string ): StepController {
	return {
		async submit( navigation: StepAction ): Promise<void> {
			await navigation.submit( new BannerSubmitEvent( 'AddressTypeForm' ) );
		},
		async previous( navigation: StepAction ): Promise<void> {
			formModel.addressType.value = '';
			formModel.addressTypeValidity.value = Validity.Unset;
			// TODO reset any changes that were potentially made in some Upsell form step before
			await navigation.goToStep( pageIndexForPrevious );
		}
	};
}
