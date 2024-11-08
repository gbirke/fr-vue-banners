import { StepController } from '@src/components/DonationForm/StepController';
import { StepAction } from '@src/components/DonationForm/StepNavigation';
import { BannerSubmitEvent } from '@src/tracking/events/BannerSubmitEvent';
import { Intervals } from '@src/utils/FormItemsBuilder/fields/Intervals';
import { PaymentMethods } from '@src/utils/FormItemsBuilder/fields/PaymentMethods';
import { FormModel } from '@src/utils/FormModel/FormModel';

export function createSubmittableMainDonationForm( formModel: FormModel, stepNameOfUpgradeToYearly: string ): StepController {
	return {
		async submit( navigation: StepAction ): Promise<void> {
			if ( formModel.interval.value !== Intervals.ONCE.value || formModel.paymentMethod.value === PaymentMethods.SOFORT.value ) {
				await navigation.submit( new BannerSubmitEvent( 'MainDonationForm' ) );
				return;
			}
			await navigation.goToStep( stepNameOfUpgradeToYearly );
		},
		async previous(): Promise<void> {
			return Promise.reject( 'we can\'t go to previous! This should never happen' );
		}
	};
}
