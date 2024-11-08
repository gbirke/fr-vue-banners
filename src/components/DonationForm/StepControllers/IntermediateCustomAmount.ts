import { StepController } from '@src/components/DonationForm/StepController';
import { StepAction } from '@src/components/DonationForm/StepNavigation';
import { Intervals } from '@src/utils/FormItemsBuilder/fields/Intervals';
import { FormModel } from '@src/utils/FormModel/FormModel';

export function createIntermediateCustomAmount( formModel: FormModel, stepNameOfNext: string, stepNameOfPreviousPage: string ): StepController {
	return {
		async submit( navigation: StepAction, submitData: Record<string, string> ): Promise<void> {
			formModel.interval.value = Intervals.YEARLY.value;
			formModel.customAmount.value = submitData.newCustomAmount;
			await navigation.goToStep( stepNameOfNext );
		},
		async previous( navigation: StepAction ): Promise<void> {
			await navigation.goToStep( stepNameOfPreviousPage );
		}

	};
}
