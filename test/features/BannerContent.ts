import { VueWrapper } from '@vue/test-utils';
import { BannerStates } from '@src/components/BannerConductor/StateMachine/BannerStates';
import { expect, vi } from 'vitest';
import { newDynamicContent } from '@test/banners/dynamicCampaignContent';
import { DynamicContent } from '@src/utils/DynamicContent/DynamicContent';
import { Timer } from '@src/utils/Timer';
import { TimerSpy } from '@test/fixtures/TimerSpy';

const expectSlideShowPlaysWhenBecomesVisible = async ( wrapper: VueWrapper<any> ): Promise<any> => {
	await wrapper.setProps( { bannerState: BannerStates.Visible } );

	expect( wrapper.find( '.wmde-banner-slider--playing' ).exists() ).toBeTruthy();
};

const expectSlideShowStopsOnFormInteraction = async ( wrapper: VueWrapper<any> ): Promise<any> => {
	await wrapper.setProps( { bannerState: BannerStates.Visible } );
	await wrapper.find( '.wmde-banner-form' ).trigger( 'click' );

	expect( wrapper.find( '.wmde-banner-slider--stopped' ).exists() ).toBeTruthy();
};

const expectShowsSlideShowOnSmallSizes = async ( getWrapper: () => VueWrapper<any>, minWidthForLargeScreen: number ): Promise<any> => {
	Object.defineProperty( window, 'innerWidth', { writable: true, configurable: true, value: minWidthForLargeScreen } );
	const wrapper = getWrapper();

	expect( wrapper.find( '.wmde-banner-slider' ).exists() ).toBeTruthy();
};

const expectShowsMessageOnLargeSizes = async ( getWrapper: () => VueWrapper<any>, minWidthForLargeScreen: number ): Promise<any> => {
	Object.defineProperty( window, 'innerWidth', { writable: true, configurable: true, value: minWidthForLargeScreen + 1 } );
	const wrapper = getWrapper();

	expect( wrapper.find( '.wmde-banner-message' ).exists() ).toBeTruthy();
};

const expectHidesAnimatedVisitorsVsDonorsSentenceInMessage = async ( getWrapper: ( dynamicContent: DynamicContent ) => VueWrapper<any> ): Promise<any> => {
	Object.defineProperty( window, 'innerWidth', { writable: true, configurable: true, value: 1301 } );
	const wrapper = getWrapper( null );

	expect( wrapper.find( '.wmde-banner-message .wmde-banner-text-animated-highlight' ).exists() ).toBeFalsy();
};
const expectShowsAnimatedVisitorsVsDonorsSentenceInMessage = async ( getWrapper: ( dynamicContent: DynamicContent ) =>
VueWrapper<any>, minWidthForLargeScreen: number = 1301 ): Promise<any> => {
	Object.defineProperty( window, 'innerWidth', { writable: true, configurable: true, value: minWidthForLargeScreen } );
	const localDynamicContent = newDynamicContent();
	localDynamicContent.visitorsVsDonorsSentence = 'Visitors vs donors sentence';
	const wrapper = getWrapper( localDynamicContent );

	expect( wrapper.find( '.wmde-banner-message .wmde-banner-text-animated-highlight' ).exists() ).toBeTruthy();
};

const expectHidesAnimatedVisitorsVsDonorsSentenceInSlideShow = async ( getWrapper: ( dynamicContent: DynamicContent ) => VueWrapper<any> ): Promise<any> => {
	Object.defineProperty( window, 'innerWidth', { writable: true, configurable: true, value: 1300 } );
	const wrapper = getWrapper( null );

	expect( wrapper.find( '.wmde-banner-slider .wmde-banner-text-animated-highlight' ).exists() ).toBeFalsy();
};
const expectShowsAnimatedVisitorsVsDonorsSentenceInSlideShow = async ( getWrapper: ( dynamicContent: DynamicContent ) => VueWrapper<any> ): Promise<any> => {
	Object.defineProperty( window, 'innerWidth', { writable: true, configurable: true, value: 1300 } );
	const localDynamicContent = newDynamicContent();
	localDynamicContent.visitorsVsDonorsSentence = 'Visitors vs donors sentence';
	const wrapper = getWrapper( localDynamicContent );

	expect( wrapper.find( '.wmde-banner-slider .wmde-banner-text-animated-highlight' ).exists() ).toBeTruthy();
};

const expectShowsLiveDateAndTimeInMessage = async ( getWrapper: ( dynamicContent: DynamicContent, timer: Timer ) => VueWrapper<any> ): Promise<any> => {
	Object.defineProperty( window, 'innerWidth', { writable: true, configurable: true, value: 1301 } );
	const localDynamicContent = newDynamicContent();
	localDynamicContent.getCurrentDateAndTime = vi.fn().mockReturnValueOnce( { currentDate: 'Initial Date', currentTime: 'Initial Time' } )
		.mockReturnValueOnce( { currentDate: 'Second Date', currentTime: 'Second Time' } )
		.mockReturnValueOnce( { currentDate: 'Third Date', currentTime: 'Third Time' } );

	const timerSpy = new TimerSpy();
	const wrapper = getWrapper( localDynamicContent, timerSpy );

	expect( wrapper.find( '.wmde-banner-message' ).text() ).toContain( 'Initial Date' );
	expect( wrapper.find( '.wmde-banner-message' ).text() ).toContain( 'Initial Time' );

	await timerSpy.advanceInterval();

	expect( wrapper.find( '.wmde-banner-message' ).text() ).toContain( 'Second Date' );
	expect( wrapper.find( '.wmde-banner-message' ).text() ).toContain( 'Second Time' );

	await timerSpy.advanceInterval();

	expect( wrapper.find( '.wmde-banner-message' ).text() ).toContain( 'Third Date' );
	expect( wrapper.find( '.wmde-banner-message' ).text() ).toContain( 'Third Time' );
};

const expectShowsLiveDateAndTimeInSlideshow = async ( getWrapper: ( dynamicContent: DynamicContent, timer: Timer ) => VueWrapper<any> ): Promise<any> => {
	Object.defineProperty( window, 'innerWidth', { writable: true, configurable: true, value: 1300 } );
	const localDynamicContent = newDynamicContent();
	localDynamicContent.getCurrentDateAndTime = vi.fn().mockReturnValueOnce( { currentDate: 'Initial Date', currentTime: 'Initial Time' } )
		.mockReturnValueOnce( { currentDate: 'Second Date', currentTime: 'Second Time' } )
		.mockReturnValueOnce( { currentDate: 'Third Date', currentTime: 'Third Time' } );

	const timerSpy = new TimerSpy();
	const wrapper = getWrapper( localDynamicContent, timerSpy );

	expect( wrapper.find( '.wmde-banner-slider' ).text() ).toContain( 'Initial Date' );
	expect( wrapper.find( '.wmde-banner-slider' ).text() ).toContain( 'Initial Time' );

	await timerSpy.advanceInterval();

	expect( wrapper.find( '.wmde-banner-slider' ).text() ).toContain( 'Second Date' );
	expect( wrapper.find( '.wmde-banner-slider' ).text() ).toContain( 'Second Time' );

	await timerSpy.advanceInterval();

	expect( wrapper.find( '.wmde-banner-slider' ).text() ).toContain( 'Third Date' );
	expect( wrapper.find( '.wmde-banner-slider' ).text() ).toContain( 'Third Time' );
};

const expectShowsLiveDateAndTimeInTitle = async ( getWrapper: ( dynamicContent: DynamicContent, timer: Timer ) => VueWrapper<any> ): Promise<any> => {
	Object.defineProperty( window, 'innerWidth', { writable: true, configurable: true, value: 1301 } );
	const localDynamicContent = newDynamicContent();
	localDynamicContent.getCurrentDateAndTime = vi.fn().mockReturnValueOnce( { currentDate: 'Initial Date', currentTime: 'Initial Time' } )
		.mockReturnValueOnce( { currentDate: 'Second Date', currentTime: 'Second Time' } )
		.mockReturnValueOnce( { currentDate: 'Third Date', currentTime: 'Third Time' } );

	const timerSpy = new TimerSpy();
	const wrapper = getWrapper( localDynamicContent, timerSpy );

	expect( wrapper.find( '.wmde-banner-message-header' ).text() ).toContain( 'Initial Date' );
	expect( wrapper.find( '.wmde-banner-message-header' ).text() ).toContain( 'Initial Time' );

	await timerSpy.advanceInterval();

	expect( wrapper.find( '.wmde-banner-message-header' ).text() ).toContain( 'Second Date' );
	expect( wrapper.find( '.wmde-banner-message-header' ).text() ).toContain( 'Second Time' );

	await timerSpy.advanceInterval();

	expect( wrapper.find( '.wmde-banner-message-header' ).text() ).toContain( 'Third Date' );
	expect( wrapper.find( '.wmde-banner-message-header' ).text() ).toContain( 'Third Time' );
};

const expectShowsAverageDonationInMessage = async ( getWrapper: ( dynamicContent: DynamicContent ) => VueWrapper<any> ): Promise<any> => {
	Object.defineProperty( window, 'innerWidth', { writable: true, configurable: true, value: 1301 } );
	const localDynamicContent = newDynamicContent();
	localDynamicContent.averageDonation = '== Average Donation ==';

	const wrapper = getWrapper( localDynamicContent );

	expect( wrapper.find( '.wmde-banner-message' ).text() ).toContain( '== Average Donation ==' );
};

const expectShowsAverageDonationInSlideshow = async ( getWrapper: ( dynamicContent: DynamicContent ) => VueWrapper<any> ): Promise<any> => {
	Object.defineProperty( window, 'innerWidth', { writable: true, configurable: true, value: 1300 } );
	const localDynamicContent = newDynamicContent();
	localDynamicContent.averageDonation = '== Average Donation ==';

	const wrapper = getWrapper( localDynamicContent );

	expect( wrapper.find( '.wmde-banner-slider' ).text() ).toContain( '== Average Donation ==' );
};

const expectShowsLiveDateAndTimeInMiniBanner = async ( getWrapper: ( dynamicContent: DynamicContent, timer: Timer ) => VueWrapper<any> ): Promise<any> => {
	const localDynamicContent = newDynamicContent();
	// There are 2 live text elements mounted at the same time in the mobile banners meaning it will be initialised twice
	localDynamicContent.getCurrentDateAndTime = vi.fn().mockReturnValueOnce( { currentDate: 'Initial Date', currentTime: 'Initial Time' } )
		.mockReturnValueOnce( { currentDate: 'Initial Date', currentTime: 'Initial Time' } )
		.mockReturnValueOnce( { currentDate: 'Second Date', currentTime: 'Second Time' } )
		.mockReturnValueOnce( { currentDate: 'Third Date', currentTime: 'Third Time' } );

	const timerSpy = new TimerSpy();
	const wrapper = getWrapper( localDynamicContent, timerSpy );

	expect( wrapper.find( '.wmde-banner-mini-slideshow' ).text() ).toContain( 'Initial Date' );
	expect( wrapper.find( '.wmde-banner-mini-slideshow' ).text() ).toContain( 'Initial Time' );

	await timerSpy.advanceInterval();

	expect( wrapper.find( '.wmde-banner-mini-slideshow' ).text() ).toContain( 'Second Date' );
	expect( wrapper.find( '.wmde-banner-mini-slideshow' ).text() ).toContain( 'Second Time' );

	await timerSpy.advanceInterval();

	expect( wrapper.find( '.wmde-banner-mini-slideshow' ).text() ).toContain( 'Third Date' );
	expect( wrapper.find( '.wmde-banner-mini-slideshow' ).text() ).toContain( 'Third Time' );
};

const expectShowsLiveDateAndTimeInFullPageBanner = async ( getWrapper: ( dynamicContent: DynamicContent, timer: Timer ) => VueWrapper<any> ): Promise<any> => {
	const localDynamicContent = newDynamicContent();
	// There are 2 live text elements mounted at the same time in the mobile banners meaning it will be initialised twice
	localDynamicContent.getCurrentDateAndTime = vi.fn().mockReturnValueOnce( { currentDate: 'Initial Date', currentTime: 'Initial Time' } )
		.mockReturnValueOnce( { currentDate: 'Initial Date', currentTime: 'Initial Time' } )
		.mockReturnValueOnce( { currentDate: 'Second Date', currentTime: 'Second Time' } )
		.mockReturnValueOnce( { currentDate: 'Third Date', currentTime: 'Third Time' } );

	const timerSpy = new TimerSpy();
	const wrapper = getWrapper( localDynamicContent, timerSpy );

	await wrapper.find( '.wmde-banner-mini-button' ).trigger( 'click' );

	expect( wrapper.find( '.wmde-banner-message' ).text() ).toContain( 'Initial Date' );
	expect( wrapper.find( '.wmde-banner-message' ).text() ).toContain( 'Initial Time' );

	await timerSpy.advanceInterval();

	expect( wrapper.find( '.wmde-banner-message' ).text() ).toContain( 'Second Date' );
	expect( wrapper.find( '.wmde-banner-message' ).text() ).toContain( 'Second Time' );

	await timerSpy.advanceInterval();

	expect( wrapper.find( '.wmde-banner-message' ).text() ).toContain( 'Third Date' );
	expect( wrapper.find( '.wmde-banner-message' ).text() ).toContain( 'Third Time' );
};

export const bannerContentFeatures: Record<string, ( wrapper: VueWrapper<any> ) => Promise<any>> = {
	expectSlideShowPlaysWhenBecomesVisible,
	expectSlideShowStopsOnFormInteraction
};

export const bannerContentDisplaySwitchFeatures: Record<string, ( getWrapper: () => VueWrapper<any>, minWidthForLargeScreen: number ) => Promise<any>> = {
	expectShowsSlideShowOnSmallSizes,
	expectShowsMessageOnLargeSizes
};

export const bannerContentAverageDonationFeatures: Record<string, ( getWrapper: () => VueWrapper<any> ) => Promise<any>> = {
	expectShowsAverageDonationInMessage,
	expectShowsAverageDonationInSlideshow
};

export const bannerContentAnimatedTextFeatures: Record<string, ( getWrapper: () =>
VueWrapper<any>, minWidthForLargeScreen: number|void ) => Promise<any>> = {
	expectHidesAnimatedVisitorsVsDonorsSentenceInMessage,
	expectShowsAnimatedVisitorsVsDonorsSentenceInMessage,
	expectHidesAnimatedVisitorsVsDonorsSentenceInSlideShow,
	expectShowsAnimatedVisitorsVsDonorsSentenceInSlideShow
};

export const bannerContentDateAndTimeFeatures: Record<string, ( getWrapper: () => VueWrapper<any> ) => Promise<any>> = {
	expectShowsLiveDateAndTimeInMessage,
	expectShowsLiveDateAndTimeInSlideshow,
	expectShowsLiveDateAndTimeInTitle,
	expectShowsLiveDateAndTimeInMiniBanner,
	expectShowsLiveDateAndTimeInFullPageBanner
};
