import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useFormModel } from '@src/components/composables/useFormModel';
import { createIntermediateCustomAmount } from '@src/components/DonationForm/StepControllers/IntermediateCustomAmount';
import { StepAction } from '@src/components/DonationForm/StepNavigation';
import { Intervals } from '@src/utils/FormItemsBuilder/fields/Intervals';
import { resetFormModel } from '@test/resetFormModel';

const formModel = useFormModel();

describe( 'IntermediateCustomAmount', () => {
	let stepNavigation: StepAction;

	// The model values are in the global scope, and they need to be reset before each test
	beforeEach( () => {
		resetFormModel( formModel );
		stepNavigation = {
			goToStep: vi.fn(),
			submit: vi.fn()
		};
	} );

	it( 'updates form model values on submit', async () => {
		const customAmount = createIntermediateCustomAmount( formModel, 'nextStepMagoo', 'previousStepMacPageName' );

		await customAmount.submit( stepNavigation, { newCustomAmount: '400' } );

		expect( formModel.interval.value ).toBe( Intervals.YEARLY.value );
		expect( formModel.customAmount.value ).toBe( '400' );
	} );

	it( 'goes to step on submit', async () => {
		const customAmount = createIntermediateCustomAmount( formModel, 'nextStepMagoo', 'previousStepMacPageName' );

		await customAmount.submit( stepNavigation, { newCustomAmount: '400' } );

		expect( stepNavigation.goToStep ).toHaveBeenCalledOnce();
		expect( stepNavigation.goToStep ).toHaveBeenCalledWith( 'nextStepMagoo' );
	} );

	it( 'goes to step on previous', async () => {
		const customAmount = createIntermediateCustomAmount( formModel, 'nextStepMagoo', 'previousStepMacPageName' );

		await customAmount.previous( stepNavigation );

		expect( stepNavigation.goToStep ).toHaveBeenCalledOnce();
		expect( stepNavigation.goToStep ).toHaveBeenCalledWith( 'previousStepMacPageName' );
	} );
} );
