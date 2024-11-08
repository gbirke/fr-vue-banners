import { VueWrapper } from '@vue/test-utils';
import { expect, vi } from 'vitest';
import { DynamicContent } from '@src/utils/DynamicContent/DynamicContent';
import { Timer } from '@src/utils/Timer';
import { TimerSpy } from '@test/fixtures/TimerSpy';

const expectSetsCookieImageOnSoftCloseClose = async ( getWrapper: () => VueWrapper<any> ): Promise<any> => {
	const wrapper = getWrapper();

	await wrapper.find( '.wmde-banner-mini-close-button' ).trigger( 'click' );
	await wrapper.find( '.wmde-banner-soft-close-button-close' ).trigger( 'click' );

	expect( wrapper.find( '.wmde-banner-set-cookie-image' ).exists() ).toBeTruthy();
};

const expectSetsCookieImageOnSoftCloseTimeOut = async ( getWrapper: ( dynamicContent: DynamicContent, timer: Timer ) => VueWrapper<any> ): Promise<any> => {
	const timer = new TimerSpy();
	const wrapper = getWrapper( null, timer );

	await wrapper.find( '.wmde-banner-mini-close-button' ).trigger( 'click' );

	// The soft close counts down over 15 seconds so we need to keep advancing until it runs out
	for ( let i: number = 0; i < 15; i++ ) {
		await timer.advanceInterval();
	}

	expect( wrapper.find( '.wmde-banner-set-cookie-image' ).exists() ).toBeTruthy();

	vi.restoreAllMocks();
};

const expectDoesNotSetCookieImageOnSoftCloseMaybeLater = async ( getWrapper: () => VueWrapper<any> ): Promise<any> => {
	const wrapper = getWrapper();

	await wrapper.find( '.wmde-banner-mini-close-button' ).trigger( 'click' );
	await wrapper.find( '.wmde-banner-soft-close-button-maybe-later' ).trigger( 'click' );

	expect( wrapper.find( '.wmde-banner-set-cookie-image' ).exists() ).toBeFalsy();
};

export const setCookieImageFeatures: Record<string, ( getWrapper: () => VueWrapper<any> ) => Promise<any>> = {
	expectSetsCookieImageOnSoftCloseClose,
	expectSetsCookieImageOnSoftCloseTimeOut,
	expectDoesNotSetCookieImageOnSoftCloseMaybeLater
};
