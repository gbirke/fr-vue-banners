import { VueWrapper } from '@vue/test-utils';
import { expect, vi } from 'vitest';
import { BannerStates } from '@src/components/BannerConductor/StateMachine/BannerStates';
import { CloseChoices } from '@src/domain/CloseChoices';
import { CloseEvent } from '@src/tracking/events/CloseEvent';
import { FallbackBannerSubmitEvent } from '@src/tracking/events/FallbackBannerSubmitEvent';
import { Tracker } from '@src/tracking/Tracker';
import { DynamicContent } from '@src/utils/DynamicContent/DynamicContent';
import { Timer } from '@src/utils/Timer';
import { newDynamicContent } from '@test/banners/dynamicCampaignContent';
import { TimerSpy } from '@test/fixtures/TimerSpy';
import { TrackerSpy } from '@test/fixtures/TrackerSpy';

const showsTheSmallBanner = async ( getWrapperAtWidth: ( width: number ) => VueWrapper<any> ): Promise<any> => {
	const wrapper = getWrapperAtWidth( 799 );

	expect( wrapper.find( '.wmde-banner-fallback-small' ).exists() ).toBeTruthy();
	expect( wrapper.find( '.wmde-banner-fallback-large' ).exists() ).toBeFalsy();
};

const showsTheLargeBanner = async ( getWrapperAtWidth: ( width: number ) => VueWrapper<any> ): Promise<any> => {
	const wrapper = getWrapperAtWidth( 800 );

	expect( wrapper.find( '.wmde-banner-fallback-small' ).exists() ).toBeFalsy();
	expect( wrapper.find( '.wmde-banner-fallback-large' ).exists() ).toBeTruthy();
};

const emitsTheBannerCloseEvent = async ( getWrapperAtWidth: ( width: number ) => VueWrapper<any> ): Promise<any> => {
	const wrapper = getWrapperAtWidth( 799 );

	await wrapper.find( '.wmde-banner-close' ).trigger( 'click' );

	expect( wrapper.emitted( 'bannerClosed' ).length ).toStrictEqual( 1 );
	expect( wrapper.emitted( 'bannerClosed' )[ 0 ][ 0 ] ).toStrictEqual( new CloseEvent( 'FallbackBanner', CloseChoices.Close ) );
};

const playsTheSlideshowWhenBecomesVisible = async ( getWrapperAtWidth: ( width: number ) => VueWrapper<any> ): Promise<any> => {
	const wrapper = getWrapperAtWidth( 799 );

	await wrapper.setProps( { bannerState: BannerStates.Visible } );

	expect( wrapper.find( '.wmde-banner-slider--playing' ).exists() ).toBeTruthy();
};

const showsUseOfFundsFromSmallBanner = async ( getWrapperAtWidth: ( width: number ) => VueWrapper<any> ): Promise<any> => {
	const wrapper = getWrapperAtWidth( 799 );

	await wrapper.find( '.wmde-banner-fallback-small .wmde-banner-fallback-usage-link' ).trigger( 'click' );

	expect( wrapper.find( '.banner-modal' ).classes() ).toContain( 'is-visible' );
};

const hidesUseOfFundsFromSmallBanner = async ( getWrapperAtWidth: ( width: number ) => VueWrapper<any> ): Promise<any> => {
	const wrapper = getWrapperAtWidth( 799 );

	await wrapper.find( '.wmde-banner-fallback-small .wmde-banner-fallback-usage-link' ).trigger( 'click' );
	await wrapper.find( '.banner-modal-close-link' ).trigger( 'click' );

	expect( wrapper.find( '.banner-modal' ).classes() ).not.toContain( 'is-visible' );
};

const showsUseOfFundsFromLargeBanner = async ( getWrapperAtWidth: ( width: number ) => VueWrapper<any> ): Promise<any> => {
	const wrapper = getWrapperAtWidth( 800 );

	await wrapper.find( '.wmde-banner-fallback-large .wmde-banner-fallback-usage-link' ).trigger( 'click' );

	expect( wrapper.find( '.banner-modal' ).classes() ).toContain( 'is-visible' );
};

const hidesUseOfFundsFromLargeBanner = async ( getWrapperAtWidth: ( width: number ) => VueWrapper<any> ): Promise<any> => {
	const wrapper = getWrapperAtWidth( 800 );

	await wrapper.find( '.wmde-banner-fallback-large .wmde-banner-fallback-usage-link' ).trigger( 'click' );
	await wrapper.find( '.banner-modal-close-link' ).trigger( 'click' );

	expect( wrapper.find( '.banner-modal' ).classes() ).not.toContain( 'is-visible' );
};

const showsTheAnimatedHighlightInLargeBanner = async ( getWrapperAtWidth: ( width: number, dynamicContent: DynamicContent ) => VueWrapper<any> ): Promise<any> => {
	const dynamicContent = newDynamicContent();
	dynamicContent.visitorsVsDonorsSentence = 'Visitors vs donors sentence';
	const wrapper = getWrapperAtWidth( 800, dynamicContent );

	expect( wrapper.find( '.wmde-banner-message .wmde-banner-text-animated-highlight' ).exists() ).toBeTruthy();
};

const showsLiveTimeInLargeBanner = async ( getWrapperAtWidth: (
	width: number,
	dynamicContent: DynamicContent,
	tracker: Tracker,
	timer: Timer
) => VueWrapper<any> ): Promise<any> => {
	const dynamicContent = newDynamicContent();
	dynamicContent.getCurrentDateAndTime = vi.fn().mockReturnValueOnce( { currentDate: 'Initial Date', currentTime: 'Initial Time' } )
		.mockReturnValueOnce( { currentDate: 'Second Date', currentTime: 'Second Time' } )
		.mockReturnValueOnce( { currentDate: 'Third Date', currentTime: 'Third Time' } );

	const timer = new TimerSpy();
	const wrapper = getWrapperAtWidth( 800, dynamicContent, null, timer );

	expect( wrapper.find( '.wmde-banner-message' ).text() ).toContain( 'Initial Date' );
	expect( wrapper.find( '.wmde-banner-message' ).text() ).toContain( 'Initial Time' );

	await timer.advanceInterval();

	expect( wrapper.find( '.wmde-banner-message' ).text() ).toContain( 'Second Date' );
	expect( wrapper.find( '.wmde-banner-message' ).text() ).toContain( 'Second Time' );

	await timer.advanceInterval();

	expect( wrapper.find( '.wmde-banner-message' ).text() ).toContain( 'Third Date' );
	expect( wrapper.find( '.wmde-banner-message' ).text() ).toContain( 'Third Time' );
};

const submitsFromLargeBanner = async ( getWrapperAtWidth: ( width: number, dynamicContent: DynamicContent, tracker: Tracker ) => VueWrapper<any> ): Promise<any> => {
	const location = { href: '' };
	Object.defineProperty( window, 'location', { writable: true, configurable: true, value: location } );
	const tracker = new TrackerSpy();
	const wrapper = getWrapperAtWidth( 800, null, tracker );

	await wrapper.find( '.wmde-banner-fallback-large .wmde-banner-fallback-button' ).trigger( 'click' );

	expect( tracker.hasTrackedEvent( FallbackBannerSubmitEvent.EVENT_NAME ) );
	expect( location.href ).toStrictEqual( 'https://spenden.wikimedia.de' );
};

const submitsFromSmallBanner = async ( getWrapperAtWidth: ( width: number, dynamicContent: DynamicContent, tracker: Tracker ) => VueWrapper<any> ): Promise<any> => {
	const location = { href: '' };
	Object.defineProperty( window, 'location', { writable: true, configurable: true, value: location } );
	const tracker = new TrackerSpy();
	const wrapper = getWrapperAtWidth( 799, null, tracker );

	await wrapper.find( '.wmde-banner-fallback-small .wmde-banner-fallback-button' ).trigger( 'click' );

	expect( tracker.hasTrackedEvent( FallbackBannerSubmitEvent.EVENT_NAME ) );
	expect( location.href ).toStrictEqual( 'https://spenden.wikimedia.de' );
};

export const fallbackBannerFeatures: Record<string, ( getWrapperAtWidth: ( width: number ) => VueWrapper<any> ) => Promise<any>> = {
	showsTheSmallBanner,
	showsTheLargeBanner,
	emitsTheBannerCloseEvent,
	playsTheSlideshowWhenBecomesVisible,
	showsUseOfFundsFromSmallBanner,
	hidesUseOfFundsFromSmallBanner,
	showsUseOfFundsFromLargeBanner,
	hidesUseOfFundsFromLargeBanner
};

export const dynamicContentFeatures: Record<string, ( getWrapperAtWidth: ( width: number, dynamicContent: DynamicContent ) => VueWrapper<any> ) => Promise<any>> = {
	showsTheAnimatedHighlightInLargeBanner,
	showsLiveTimeInLargeBanner
};

export const submitFeatures: Record<string, ( getWrapperAtWidth: (
	width: number,
	dynamicContent: DynamicContent,
	tracker: Tracker
) => VueWrapper<any> ) => Promise<any>> = {
	submitsFromLargeBanner,
	submitsFromSmallBanner
};
