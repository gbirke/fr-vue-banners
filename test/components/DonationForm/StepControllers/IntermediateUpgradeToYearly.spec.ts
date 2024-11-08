import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useFormModel } from '@src/components/composables/useFormModel';
import {
	createIntermediateUpgradeToYearly
} from '@src/components/DonationForm/StepControllers/IntermediateUpgradeToYearly';
import { StepAction } from '@src/components/DonationForm/StepNavigation';
import { Intervals } from '@src/utils/FormItemsBuilder/fields/Intervals';
import { resetFormModel } from '@test/resetFormModel';

const formModel = useFormModel();

describe( 'IntermediateUpgradeToYearly', () => {
	let stepNavigation: StepAction;

	// The model values are in the global scope, and they need to be reset before each test
	beforeEach( () => {
		resetFormModel( formModel );
		stepNavigation = {
			goToStep: vi.fn(),
			submit: vi.fn()
		};
	} );

	it( 'goes to next step when user selects option', async () => {
		const upgrade = createIntermediateUpgradeToYearly( formModel, 'link', 'next', 'previous' );

		await upgrade.submit( stepNavigation, {} );

		expect( stepNavigation.goToStep ).toHaveBeenCalledOnce();
		expect( stepNavigation.goToStep ).toHaveBeenCalledWith( 'next' );
	} );

	it( 'goes to next step when user clicks link', async () => {
		const upgrade = createIntermediateUpgradeToYearly( formModel, 'link', 'next', 'previous' );

		await upgrade.submit( stepNavigation, { changeOfAmount: 'true' } );

		expect( stepNavigation.goToStep ).toHaveBeenCalledOnce();
		expect( stepNavigation.goToStep ).toHaveBeenCalledWith( 'link' );
	} );

	it( 'sets form interval to once on previous', async () => {
		formModel.interval.value = Intervals.YEARLY.value;
		const upgrade = createIntermediateUpgradeToYearly( formModel, 'link', 'next', 'previous' );

		await upgrade.previous( stepNavigation );

		expect( formModel.interval.value ).toBe( Intervals.ONCE.value );
	} );

	it( 'goes to previous step on previous', async () => {
		formModel.interval.value = Intervals.YEARLY.value;
		const upgrade = createIntermediateUpgradeToYearly( formModel, 'link', 'next', 'previous' );

		await upgrade.previous( stepNavigation );

		expect( stepNavigation.goToStep ).toHaveBeenCalledOnce();
		expect( stepNavigation.goToStep ).toHaveBeenCalledWith( 'previous' );
	} );
} );
