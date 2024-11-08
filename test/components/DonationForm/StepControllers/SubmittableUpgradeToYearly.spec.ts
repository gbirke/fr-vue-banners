import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useFormModel } from '@src/components/composables/useFormModel';
import {
	createSubmittableUpgradeToYearly
} from '@src/components/DonationForm/StepControllers/SubmittableUpgradeToYearly';
import { StepAction } from '@src/components/DonationForm/StepNavigation';
import { BannerSubmitEvent } from '@src/tracking/events/BannerSubmitEvent';
import { Intervals } from '@src/utils/FormItemsBuilder/fields/Intervals';
import { resetFormModel } from '@test/resetFormModel';

const formModel = useFormModel();

describe( 'SubmittableUpgradeToYearly', () => {
	let stepNavigation: StepAction;

	// The model values are in the global scope, and they need to be reset before each test
	beforeEach( () => {
		resetFormModel( formModel );
		stepNavigation = {
			goToStep: vi.fn(),
			submit: vi.fn()
		};
	} );

	it( 'submits when user selects option', async () => {
		const upgrade = createSubmittableUpgradeToYearly( formModel, 'link', 'previous' );

		await upgrade.submit( stepNavigation, {} );

		expect( stepNavigation.submit ).toHaveBeenCalledOnce();
	} );

	it( 'goes to link step when user clicks link', async () => {
		const upgrade = createSubmittableUpgradeToYearly( formModel, 'link', 'previous' );

		await upgrade.submit( stepNavigation, { changeOfAmount: 'true' } );

		expect( stepNavigation.goToStep ).toHaveBeenCalledOnce();
		expect( stepNavigation.goToStep ).toHaveBeenCalledWith( 'link' );
	} );

	it( 'sets form interval to once on previous', async () => {
		formModel.interval.value = Intervals.YEARLY.value;
		const upgrade = createSubmittableUpgradeToYearly( formModel, 'link', 'previous' );

		await upgrade.previous( stepNavigation );

		expect( formModel.interval.value ).toBe( Intervals.ONCE.value );
	} );

	it( 'goes to previous step on previous', async () => {
		formModel.interval.value = Intervals.YEARLY.value;
		const upgrade = createSubmittableUpgradeToYearly( formModel, 'link', 'previous' );

		await upgrade.previous( stepNavigation );

		expect( stepNavigation.goToStep ).toHaveBeenCalledOnce();
		expect( stepNavigation.goToStep ).toHaveBeenCalledWith( 'previous' );
	} );

	describe( 'tracking events', function () {
		it( 'converts recurring interval to "submit" event with the correct option selected', async () => {
			const upgrade = createSubmittableUpgradeToYearly( formModel, 'link', 'previous' );

			await upgrade.submit( stepNavigation, { upgradeToYearlyInterval: Intervals.YEARLY.value } );

			expect( stepNavigation.submit ).toHaveBeenCalledWith( new BannerSubmitEvent( 'UpgradeToYearlyForm', 'recurring' ) );
		} );

		it( 'converts non-recurring interval to "submit" event with the correct option selected', async () => {
			const upgrade = createSubmittableUpgradeToYearly( formModel, 'link', 'previous' );

			await upgrade.submit( stepNavigation, { upgradeToYearlyInterval: Intervals.ONCE.value } );

			expect( stepNavigation.submit ).toHaveBeenCalledWith( new BannerSubmitEvent( 'UpgradeToYearlyForm', 'non-recurring' ) );
		} );
	} );
} );
