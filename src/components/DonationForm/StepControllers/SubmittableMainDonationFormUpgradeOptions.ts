import { StepController } from '@src/components/DonationForm/StepController';
import { StepAction } from '@src/components/DonationForm/StepNavigation';
import { BannerSubmitEvent } from '@src/tracking/events/BannerSubmitEvent';
import { Intervals } from '@src/utils/FormItemsBuilder/fields/Intervals';
import { PaymentMethods } from '@src/utils/FormItemsBuilder/fields/PaymentMethods';
import { FormModel } from '@src/utils/FormModel/FormModel';

const shouldLeadToMonthlyUpgradePage = ( formModel: FormModel, lowerAmountLimit: number, upperAmountLimit: number ): boolean => {
	if ( formModel.interval.value !== Intervals.ONCE.value ) {
		return false;
	}
	return formModel.numericAmount.value >= lowerAmountLimit && formModel.numericAmount.value <= upperAmountLimit;
};
export function createSubmittableMainDonationFormUpgradeOptions(
	formModel: FormModel,
	stepNameOfUpgradeToYearly: string,
	stepNameOfUpgradeToMonthly: string,
	lowerAmountLimit: number,
	upperAmountLimit: number
): StepController {
	return {
		async submit( navigation: StepAction ): Promise<void> {
			if ( formModel.interval.value !== Intervals.ONCE.value || formModel.paymentMethod.value === PaymentMethods.SOFORT.value ) {
				await navigation.submit( new BannerSubmitEvent( 'MainDonationForm' ) );
				return;
			}
			if ( shouldLeadToMonthlyUpgradePage( formModel, lowerAmountLimit, upperAmountLimit ) ) {
				await navigation.goToStep( stepNameOfUpgradeToMonthly );
				return;
			}
			await navigation.goToStep( stepNameOfUpgradeToYearly );
		},
		async previous(): Promise<void> {
			return Promise.reject( 'we can\'t go to previous! This should never happen' );
		}
	};
}
