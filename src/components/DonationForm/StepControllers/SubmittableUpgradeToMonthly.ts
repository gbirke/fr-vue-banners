import { StepController } from '@src/components/DonationForm/StepController';
import { StepAction } from '@src/components/DonationForm/StepNavigation';
import { BannerSubmitEvent } from '@src/tracking/events/BannerSubmitEvent';
import { Intervals } from '@src/utils/FormItemsBuilder/fields/Intervals';
import { FormModel } from '@src/utils/FormModel/FormModel';

export function createSubmittableUpgradeToMonthly( formModel: FormModel, stepNameOfLinkClick: string, stepNameOfPreviousPage: string ): StepController {
	return {
		async submit( navigation: StepAction, submitData: Record<string, string> ): Promise<void> {
			formModel.interval.value = submitData.upgradeToMonthlyInterval;
			if ( submitData.changeOfAmount ) {
				await navigation.goToStep( stepNameOfLinkClick );
				return;
			}
			formModel.customAmount.value = String( submitData.newNumericAmount );
			await navigation.submit( new BannerSubmitEvent(
				'UpgradeToMonthlyForm',
				formModel.interval.value === Intervals.MONTHLY.value ? 'recurring' : 'non-recurring'
			) );
		},
		async previous( navigation: StepAction ): Promise<void> {
			formModel.interval.value = Intervals.ONCE.value;
			await navigation.goToStep( stepNameOfPreviousPage );

		}
	};
}
