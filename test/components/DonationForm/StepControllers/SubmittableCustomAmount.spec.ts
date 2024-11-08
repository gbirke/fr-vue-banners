import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useFormModel } from '@src/components/composables/useFormModel';
import { createSubmittableCustomAmount } from '@src/components/DonationForm/StepControllers/SubmittableCustomAmount';
import { StepAction } from '@src/components/DonationForm/StepNavigation';
import { Intervals } from '@src/utils/FormItemsBuilder/fields/Intervals';
import { resetFormModel } from '@test/resetFormModel';

const formModel = useFormModel();

describe( 'SubmittableCustomAmount', () => {
	let stepNavigation: StepAction;

	// The model values are in the global scope, and they need to be reset before each test
	beforeEach( () => {
		resetFormModel( formModel );
		stepNavigation = {
			goToStep: vi.fn(),
			submit: vi.fn()
		};
	} );

	it( 'sets form model data on submit', async () => {
		formModel.interval.value = Intervals.MONTHLY.value;
		formModel.customAmount.value = '13';
		const customAmount = createSubmittableCustomAmount( formModel, 'previous' );

		await customAmount.submit( stepNavigation, { newCustomAmount: '42' } );

		expect( formModel.interval.value ).toBe( Intervals.YEARLY.value );
		expect( formModel.customAmount.value ).toBe( '42' );
	} );

	it( 'submits on submit', async () => {
		const customAmount = createSubmittableCustomAmount( formModel, 'previous' );

		await customAmount.submit( stepNavigation, { newCustomAmount: '42' } );

		expect( stepNavigation.submit ).toHaveBeenCalledOnce();
	} );

	it( 'goes to previous on previous', async () => {
		const customAmount = createSubmittableCustomAmount( formModel, 'previous' );

		await customAmount.previous( stepNavigation );

		expect( stepNavigation.goToStep ).toHaveBeenCalledOnce();
		expect( stepNavigation.goToStep ).toHaveBeenCalledWith( 'previous' );
	} );
} );
