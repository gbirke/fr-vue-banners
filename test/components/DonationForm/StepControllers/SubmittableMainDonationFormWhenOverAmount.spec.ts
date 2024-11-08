import { beforeEach, describe, expect, it, test, vi } from 'vitest';
import { useFormModel } from '@src/components/composables/useFormModel';
import {
	createSubmittableMainDonationFormWhenOverAmount
} from '@src/components/DonationForm/StepControllers/SubmittableMainDonationFormWhenOverAmount';
import { StepAction } from '@src/components/DonationForm/StepNavigation';
import { Intervals } from '@src/utils/FormItemsBuilder/fields/Intervals';
import { PaymentMethods } from '@src/utils/FormItemsBuilder/fields/PaymentMethods';
import { resetFormModel } from '@test/resetFormModel';

const formModel = useFormModel();

describe( 'SubmittableMainDonationFormWhenOverAmount', () => {
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
		[ PaymentMethods.PAYPAL.value ],
		[ PaymentMethods.BANK_TRANSFER.value ],
		[ PaymentMethods.CREDIT_CARD.value ],
		[ PaymentMethods.DIRECT_DEBIT.value ]
	] )( 'goes to upgrade when payment method is not Sofort', async ( paymentMethod: string ) => {
		formModel.paymentMethod.value = paymentMethod;
		formModel.interval.value = Intervals.ONCE.value;
		const donationForm = createSubmittableMainDonationFormWhenOverAmount( formModel, 'yearly', 100 );

		await donationForm.submit( stepNavigation, {} );

		expect( stepNavigation.goToStep ).toHaveBeenCalledOnce();
		expect( stepNavigation.goToStep ).toHaveBeenCalledWith( 'yearly' );
	} );

	it( 'submits when payment method is Sofort', async () => {
		formModel.paymentMethod.value = PaymentMethods.SOFORT.value;
		formModel.interval.value = Intervals.ONCE.value;
		const donationForm = createSubmittableMainDonationFormWhenOverAmount( formModel, 'yearly', 100 );

		await donationForm.submit( stepNavigation, {} );

		expect( stepNavigation.submit ).toHaveBeenCalledOnce();
	} );

	test.each( [
		[ Intervals.MONTHLY.value ],
		[ Intervals.QUARTERLY.value ],
		[ Intervals.BIANNUAL.value ],
		[ Intervals.YEARLY.value ]
	] )( 'submits when interval is not once', async ( interval: string ) => {
		formModel.interval.value = interval;
		formModel.paymentMethod.value = PaymentMethods.PAYPAL.value;
		const donationForm = createSubmittableMainDonationFormWhenOverAmount( formModel, 'yearly', 100 );

		await donationForm.submit( stepNavigation, {} );

		expect( stepNavigation.submit ).toHaveBeenCalledOnce();
	} );

	it( 'goes to upgrade when interval is once', async () => {
		formModel.interval.value = Intervals.ONCE.value;
		formModel.paymentMethod.value = PaymentMethods.PAYPAL.value;
		const donationForm = createSubmittableMainDonationFormWhenOverAmount( formModel, 'yearly', 100 );

		await donationForm.submit( stepNavigation, {} );

		expect( stepNavigation.goToStep ).toHaveBeenCalledOnce();
		expect( stepNavigation.goToStep ).toHaveBeenCalledWith( 'yearly' );
	} );

	it( 'submits when amount is hits max amount', async () => {
		formModel.interval.value = Intervals.MONTHLY.value;
		formModel.paymentMethod.value = PaymentMethods.PAYPAL.value;
		formModel.selectedAmount.value = '100';
		const donationForm = createSubmittableMainDonationFormWhenOverAmount( formModel, 'yearly', 100 );

		await donationForm.submit( stepNavigation, {} );

		expect( stepNavigation.submit ).toHaveBeenCalledOnce();
	} );

	it( 'goes to upgrade when amount is under max amount', async () => {
		formModel.interval.value = Intervals.MONTHLY.value;
		formModel.paymentMethod.value = PaymentMethods.PAYPAL.value;
		formModel.selectedAmount.value = '99';
		const donationForm = createSubmittableMainDonationFormWhenOverAmount( formModel, 'yearly', 100 );

		await donationForm.submit( stepNavigation, {} );

		expect( stepNavigation.submit ).toHaveBeenCalledOnce();
	} );

	it( 'rejects calls to previous', async () => {
		const donationForm = createSubmittableMainDonationFormWhenOverAmount( formModel, 'yearly', 100 );

		expect( donationForm.previous( stepNavigation ) ).rejects.toEqual( 'we can\'t go to previous! This should never happen' );
	} );
} );
