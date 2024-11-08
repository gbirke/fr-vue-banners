import { VueWrapper } from '@vue/test-utils';
import { expect, vi } from 'vitest';
import { CloseChoices } from '@src/domain/CloseChoices';
import { BannerSubmitOnReturnEvent } from '@src/tracking/events/BannerSubmitOnReturnEvent';
import { Tracker } from '@src/tracking/Tracker';
import { Intervals } from '@src/utils/FormItemsBuilder/fields/Intervals';
import { PaymentMethods } from '@src/utils/FormItemsBuilder/fields/PaymentMethods';
import { LocalCloseTracker } from '@src/utils/LocalCloseTracker';
import { submitMainDonationForm } from '@test/features/forms/subForms/MainDonationForm';

const expectStoresCloseChoiceInBannerWithoutSoftClose = async ( wrapper: VueWrapper<any> ): Promise<any> => {
	const localCloseTracker: LocalCloseTracker = {
		getItem: vi.fn(),
		setItem: vi.fn()
	};
	await wrapper.setProps( { localCloseTracker } );
	await wrapper.find( '.wmde-banner-close' ).trigger( 'click' );

	expect( localCloseTracker.setItem ).toHaveBeenCalledWith( 'MainBanner', CloseChoices.Close );
};

const expectEmitsBannerSubmitOnReturnEvent = async ( wrapper: VueWrapper<any>, tracker: Tracker ): Promise<any> => {
	const localCloseTracker: LocalCloseTracker = {
		getItem: () => 'I chose not to choose a close choice',
		setItem: vi.fn()
	};
	await wrapper.setProps( { localCloseTracker } );
	const submitForm = wrapper.find<HTMLFormElement>( '.wmde-banner-submit-form' );
	submitForm.element.submit = vi.fn();

	await submitMainDonationForm( wrapper, Intervals.YEARLY, '5', PaymentMethods.PAYPAL );

	expect( tracker.trackEvent ).toHaveBeenCalledWith( new BannerSubmitOnReturnEvent( 'I chose not to choose a close choice' ) );
};

const expectDoesNotEmitsBannerSubmitOnReturnEventWhenLocalStorageItemIsMissing = async ( wrapper: VueWrapper<any>, tracker: Tracker ): Promise<any> => {
	const localCloseTracker: LocalCloseTracker = {
		getItem: () => '',
		setItem: vi.fn()
	};
	await wrapper.setProps( { localCloseTracker } );
	const submitForm = wrapper.find<HTMLFormElement>( '.wmde-banner-submit-form' );
	submitForm.element.submit = vi.fn();

	await submitMainDonationForm( wrapper, Intervals.YEARLY, '5', PaymentMethods.PAYPAL );

	expect( tracker.trackEvent ).not.toHaveBeenCalledWith( new BannerSubmitOnReturnEvent( '' ) );
};

export const softCloseSubmitTrackingFeaturesDesktop: Record<string, ( wrapper: VueWrapper<any>, tracker: Tracker ) => Promise<any>> = {
	expectStoresCloseChoiceInBannerWithoutSoftClose,
	expectEmitsBannerSubmitOnReturnEvent,
	expectDoesNotEmitsBannerSubmitOnReturnEventWhenLocalStorageItemIsMissing
};
