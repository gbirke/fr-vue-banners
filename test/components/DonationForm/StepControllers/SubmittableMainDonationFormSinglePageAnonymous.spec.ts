import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useFormModel } from '@src/components/composables/useFormModel';
import {
	createSubmittableMainDonationFormSinglePageAnonymous
} from '@src/components/DonationForm/StepControllers/SubmittableMainDonationFormSinglePageAnonymous';
import { BannerSubmitEvent } from '@src/tracking/events/BannerSubmitEvent';
import { AddressTypes } from '@src/utils/FormItemsBuilder/fields/AddressTypes';
import { PaymentMethods } from '@src/utils/FormItemsBuilder/fields/PaymentMethods';
import { resetFormModel } from '@test/resetFormModel';

const formModel = useFormModel();

describe( 'SubmittableMainDonationFormSinglePageAnonymous', () => {

	beforeEach( () => {
		resetFormModel( formModel );
	} );

	it( 'Submits', async () => {
		const stepNavigation = { goToStep: vi.fn(), submit: vi.fn() };
		const controller = createSubmittableMainDonationFormSinglePageAnonymous( formModel );

		await controller.submit( stepNavigation, {} );

		expect( stepNavigation.submit ).toHaveBeenCalledOnce();
		expect( stepNavigation.submit ).toHaveBeenCalledWith( new BannerSubmitEvent( 'MainDonationForm' ) );
	} );

	it( 'Sets the address type to anonymous on submit', async () => {
		const stepNavigation = { goToStep: vi.fn(), submit: vi.fn() };
		const controller = createSubmittableMainDonationFormSinglePageAnonymous( formModel );

		expect( formModel.addressType.value ).toEqual( '' );

		formModel.paymentMethod.value = PaymentMethods.CREDIT_CARD.value;
		await controller.submit( stepNavigation, {} );

		expect( formModel.addressType.value ).toEqual( AddressTypes.ANONYMOUS.value );
	} );

	it( 'Will not set the address type to anonymous on submit when payment method is direct debit', async () => {
		const stepNavigation = { goToStep: vi.fn(), submit: vi.fn() };
		const controller = createSubmittableMainDonationFormSinglePageAnonymous( formModel );

		expect( formModel.addressType.value ).toEqual( '' );

		formModel.paymentMethod.value = PaymentMethods.DIRECT_DEBIT.value;
		await controller.submit( stepNavigation, {} );

		expect( formModel.addressType.value ).toEqual( '' );
	} );

	it( 'Rejects go to page', async () => {
		const stepNavigation = { goToStep: vi.fn(), submit: vi.fn() };
		const controller = createSubmittableMainDonationFormSinglePageAnonymous( formModel );

		expect( controller.previous( stepNavigation ) ).rejects.toEqual( 'Single page forms cannot go to previous. This should never happen.' );
	} );
} );
