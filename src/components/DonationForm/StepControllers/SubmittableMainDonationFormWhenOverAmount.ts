import { StepController } from '@src/components/DonationForm/StepController';
import { StepAction } from '@src/components/DonationForm/StepNavigation';
import { BannerSubmitEvent } from '@src/tracking/events/BannerSubmitEvent';
import { Intervals } from '@src/utils/FormItemsBuilder/fields/Intervals';
import { PaymentMethods } from '@src/utils/FormItemsBuilder/fields/PaymentMethods';
import { FormModel } from '@src/utils/FormModel/FormModel';

const shouldSubmit = ( formModel: FormModel, submitWhenOverAmount: number ): boolean => {
	if ( formModel.interval.value !== Intervals.ONCE.value ) {
		return true;
	}

	if ( formModel.paymentMethod.value === PaymentMethods.SOFORT.value ) {
		return true;
	}

	if ( formModel.numericAmount.value >= submitWhenOverAmount ) {
		return true;
	}

	return false;
};

export function createSubmittableMainDonationFormWhenOverAmount( formModel: FormModel, stepNameOfUpgradeToYearly: string, submitWhenOverAmount: number ): StepController {
	return {
		async submit( navigation: StepAction ): Promise<void> {
			if ( shouldSubmit( formModel, submitWhenOverAmount ) ) {
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
