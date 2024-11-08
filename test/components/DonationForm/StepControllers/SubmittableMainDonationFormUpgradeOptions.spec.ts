import { beforeEach, describe, expect, it, test, vi } from 'vitest';
import { useFormModel } from '@src/components/composables/useFormModel';
import {
	createSubmittableMainDonationFormUpgradeOptions
} from '@src/components/DonationForm/StepControllers/SubmittableMainDonationFormUpgradeOptions';
import { StepAction } from '@src/components/DonationForm/StepNavigation';
import { Intervals } from '@src/utils/FormItemsBuilder/fields/Intervals';
import { PaymentMethods } from '@src/utils/FormItemsBuilder/fields/PaymentMethods';
import { resetFormModel } from '@test/resetFormModel';

const formModel = useFormModel();

describe( 'SubmittableMainDonationFormUpgradeOptions', () => {
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
		[ PaymentMethods.PAYPAL.value, '10', 'yearly' ],
		[ PaymentMethods.BANK_TRANSFER.value, '10', 'yearly' ],
		[ PaymentMethods.CREDIT_CARD.value, '10', 'yearly' ],
		[ PaymentMethods.DIRECT_DEBIT.value, '10', 'yearly' ],
		[ PaymentMethods.PAYPAL.value, '101', 'yearly' ],
		[ PaymentMethods.BANK_TRANSFER.value, '101', 'yearly' ],
		[ PaymentMethods.CREDIT_CARD.value, '101', 'yearly' ],
		[ PaymentMethods.DIRECT_DEBIT.value, '101', 'yearly' ],
		[ PaymentMethods.PAYPAL.value, '12', 'monthly' ],
		[ PaymentMethods.BANK_TRANSFER.value, '12', 'monthly' ],
		[ PaymentMethods.CREDIT_CARD.value, '12', 'monthly' ],
		[ PaymentMethods.DIRECT_DEBIT.value, '12', 'monthly' ]
	] )( 'goes to correct step when payment method is not Sofort', async ( paymentMethod: string, selectedAmount: string, expectedPage: string ) => {
		formModel.paymentMethod.value = paymentMethod;
		formModel.interval.value = Intervals.ONCE.value;
		formModel.selectedAmount.value = selectedAmount;
		const donationForm = createSubmittableMainDonationFormUpgradeOptions(
			formModel,
			'yearly',
			'monthly',
			11,
			100
		);

		await donationForm.submit( stepNavigation, {} );

		expect( stepNavigation.goToStep ).toHaveBeenCalledOnce();
		expect( stepNavigation.goToStep ).toHaveBeenCalledWith( expectedPage );
	} );

	test.each( [
		[ PaymentMethods.SOFORT.value, '10' ],
		[ PaymentMethods.SOFORT.value, '12' ],
		[ PaymentMethods.SOFORT.value, '101' ]
	] )( 'submits when payment method is sofort', async ( paymentMethod: string, selectedAmount: string ) => {
		formModel.interval.value = Intervals.ONCE.value;
		formModel.paymentMethod.value = paymentMethod;
		formModel.selectedAmount.value = selectedAmount;
		const donationForm = createSubmittableMainDonationFormUpgradeOptions(
			formModel,
			'yearly',
			'monthly',
			11,
			100
		);

		await donationForm.submit( stepNavigation, {} );

		expect( stepNavigation.submit ).toHaveBeenCalledOnce();
	} );

	test.each( [
		[ Intervals.MONTHLY.value, '10' ],
		[ Intervals.QUARTERLY.value, '10' ],
		[ Intervals.BIANNUAL.value, '10' ],
		[ Intervals.YEARLY.value, '10' ],
		[ Intervals.MONTHLY.value, '11' ],
		[ Intervals.QUARTERLY.value, '11' ],
		[ Intervals.BIANNUAL.value, '11' ],
		[ Intervals.YEARLY.value, '11' ],
		[ Intervals.MONTHLY.value, '101' ],
		[ Intervals.QUARTERLY.value, '101' ],
		[ Intervals.BIANNUAL.value, '101' ],
		[ Intervals.YEARLY.value, '101' ]
	] )( 'submits when interval is not once', async ( interval: string ) => {
		formModel.interval.value = interval;
		formModel.paymentMethod.value = PaymentMethods.PAYPAL.value;
		const donationForm = createSubmittableMainDonationFormUpgradeOptions(
			formModel,
			'yearly',
			'monthly',
			11,
			100
		);

		await donationForm.submit( stepNavigation, {} );

		expect( stepNavigation.submit ).toHaveBeenCalledOnce();
	} );

	it( 'rejects calls to previous', async () => {
		const donationForm = createSubmittableMainDonationFormUpgradeOptions(
			formModel,
			'yearly',
			'monthly',
			11,
			100
		);

		expect( donationForm.previous( stepNavigation ) ).rejects.toEqual( 'we can\'t go to previous! This should never happen' );
	} );
} );
