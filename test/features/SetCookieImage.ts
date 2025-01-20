import { VueWrapper } from '@vue/test-utils';
import { expect } from 'vitest';
import { TimerSpy } from '@test/fixtures/TimerSpy';
import { DynamicContent } from '@src/utils/DynamicContent/DynamicContent';
import { Timer } from '@src/utils/Timer';

const expectSetsCookieImageOnSoftCloseClose = async ( getWrapper: () => VueWrapper<any> ): Promise<any> => {
	const wrapper = getWrapper();

	await wrapper.find( '.wmde-banner-close' ).trigger( 'click' );
	await wrapper.find( '.wmde-banner-soft-close-button-close' ).trigger( 'click' );

	expect( wrapper.find( '.wmde-banner-set-cookie-image' ).exists() ).toBeTruthy();
};

const expectSetsCookieImageOnSoftCloseTimeOut = async ( getWrapper: ( dynamicContent: DynamicContent, timer: Timer ) => VueWrapper<any> ): Promise<any> => {
	const timerSpy = new TimerSpy();
	const wrapper = getWrapper( null, timerSpy );

	await wrapper.find( '.wmde-banner-close' ).trigger( 'click' );

	// The soft close counts down over 15 seconds so we need to keep advancing until it runs out
	for ( let i: number = 0; i < 15; i++ ) {
		await timerSpy.advanceInterval();
	}

	expect( wrapper.find( '.wmde-banner-set-cookie-image' ).exists() ).toBeTruthy();
};

const expectDoesNotSetCookieImageOnSoftCloseMaybeLater = async ( getWrapper: () => VueWrapper<any> ): Promise<any> => {
	const wrapper = getWrapper();

	await wrapper.find( '.wmde-banner-close' ).trigger( 'click' );
	await wrapper.find( '.wmde-banner-soft-close-button-maybe-later' ).trigger( 'click' );

	expect( wrapper.find( '.wmde-banner-set-cookie-image' ).exists() ).toBeFalsy();
};

const expectSetCookieImageOnAlreadyDonatedMaybeLater = async ( getWrapper: () => VueWrapper<any> ): Promise<any> => {
	const wrapper = getWrapper();

	await wrapper.find( '.wmde-banner-already-donated-button-maybe-later' ).trigger( 'click' );

	expect( wrapper.find( '.wmde-banner-set-cookie-image' ).exists() ).toBeTruthy();
};

const expectSetAlreadyDonatedCookieImageOnAlreadyDonatedNoMoreBanners = async ( getWrapper: () => VueWrapper<any> ): Promise<any> => {
	const wrapper = getWrapper();

	await wrapper.find( '.wmde-banner-already-donated-button-go-away' ).trigger( 'click' );

	expect( wrapper.find( '.wmde-banner-set-cookie-image-already-donated' ).exists() ).toBeTruthy();
};

const expectSetCookieImageOnAlreadyDonatedLink = async ( getWrapper: () => VueWrapper<any> ): Promise<any> => {
	const wrapper = getWrapper();

	await wrapper.find( '.wmde-banner-footer-already-donated' ).trigger( 'click' );

	expect( wrapper.find( '.wmde-banner-set-cookie-image-already-donated' ).exists() ).toBeTruthy();
};

const expectSetsMaybeLaterCookieOnSoftCloseMaybeLater = async ( getWrapper: () => VueWrapper<any> ): Promise<any> => {
	const wrapper = getWrapper();

	await wrapper.find( '.wmde-banner-close' ).trigger( 'click' );
	await wrapper.find( '.wmde-banner-soft-close-button-maybe-later' ).trigger( 'click' );

	expect( wrapper.find( '.wmde-banner-set-cookie-image' ).exists() ).toBeFalsy();
};

export const setCookieImageFeatures: Record<string, ( getWrapper: () => VueWrapper<any> ) => Promise<any>> = {
	expectSetsCookieImageOnSoftCloseClose,
	expectSetsCookieImageOnSoftCloseTimeOut,
	expectDoesNotSetCookieImageOnSoftCloseMaybeLater,
	expectSetCookieImageOnAlreadyDonatedMaybeLater,
	expectSetAlreadyDonatedCookieImageOnAlreadyDonatedNoMoreBanners,
	expectSetCookieImageOnAlreadyDonatedLink,
	expectSetsMaybeLaterCookieOnSoftCloseMaybeLater
};
