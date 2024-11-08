import { beforeEach, describe, expect, it, test, vi } from 'vitest';
import { useFormModel } from '@src/components/composables/useFormModel';
import {
	createIntermediateMainDonationForm
} from '@src/components/DonationForm/StepControllers/IntermediateMainDonationForm';
import { StepAction } from '@src/components/DonationForm/StepNavigation';
import { Intervals } from '@src/utils/FormItemsBuilder/fields/Intervals';
import { PaymentMethods } from '@src/utils/FormItemsBuilder/fields/PaymentMethods';
import { resetFormModel } from '@test/resetFormModel';

const formModel = useFormModel();

describe( 'IntermediateMainDonationForm', () => {
	let stepNavigation: StepAction;

	// The model values are in the global scope, and they need to be reset before each test
	beforeEach( () => {
		resetFormModel( formModel );
		stepNavigation = {
			goToStep: vi.fn(),
			submit: vi.fn()
		};
	} );

	test.each( [
		[ PaymentMethods.PAYPAL.value, 'yearly' ],
		[ PaymentMethods.SOFORT.value, 'address' ],
		[ PaymentMethods.BANK_TRANSFER.value, 'yearly' ],
		[ PaymentMethods.CREDIT_CARD.value, 'yearly' ],
		[ PaymentMethods.DIRECT_DEBIT.value, 'yearly' ]
	] )( 'goes to address page when payment method is Sofort', async ( paymentMethod: string, expectedStep: string ) => {
		formModel.paymentMethod.value = paymentMethod;
		formModel.interval.value = Intervals.ONCE.value;
		const donationForm = createIntermediateMainDonationForm( formModel, 'yearly', 'address' );

		await donationForm.submit( stepNavigation, {} );

		expect( stepNavigation.goToStep ).toHaveBeenCalledOnce();
		expect( stepNavigation.goToStep ).toHaveBeenCalledWith( expectedStep );
	} );

	test.each( [
		[ Intervals.ONCE.value, 'yearly' ],
		[ Intervals.MONTHLY.value, 'address' ],
		[ Intervals.QUARTERLY.value, 'address' ],
		[ Intervals.BIANNUAL.value, 'address' ],
		[ Intervals.YEARLY.value, 'address' ]
	] )( 'goes to address page when interval is not once', async ( interval: string, expectedStep: string ) => {
		formModel.interval.value = interval;
		formModel.paymentMethod.value = PaymentMethods.PAYPAL.value;
		const donationForm = createIntermediateMainDonationForm( formModel, 'yearly', 'address' );

		await donationForm.submit( stepNavigation, {} );

		expect( stepNavigation.goToStep ).toHaveBeenCalledOnce();
		expect( stepNavigation.goToStep ).toHaveBeenCalledWith( expectedStep );
	} );

	it( 'rejects calls to previous', async () => {
		const donationForm = createIntermediateMainDonationForm( formModel, 'yearly', 'address' );

		expect( donationForm.previous( stepNavigation ) ).rejects.toEqual( 'we can\'t go to previous! This should never happen' );
	} );
} );
