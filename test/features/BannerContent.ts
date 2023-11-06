import { VueWrapper } from '@vue/test-utils';
import { BannerStates } from '@src/components/BannerConductor/StateMachine/BannerStates';
import { expect, vi } from 'vitest';
import { newDynamicContent } from '@test/banners/dynamicCampaignContent';
import { DynamicContent } from '@src/utils/DynamicContent/DynamicContent';

const expectSlideShowPlaysWhenBecomesVisible = async ( wrapper: VueWrapper<any> ): Promise<any> => {
	await wrapper.setProps( { bannerState: BannerStates.Visible } );

	await vi.runOnlyPendingTimersAsync();

	expect( wrapper.find( '.wmde-banner-slider--playing' ).exists() ).toBeTruthy();
};

const expectSlideShowStopsOnFormInteraction = async ( wrapper: VueWrapper<any> ): Promise<any> => {
	await wrapper.setProps( { bannerState: BannerStates.Visible } );
	await wrapper.find( '.wmde-banner-form' ).trigger( 'click' );

	await vi.runAllTimersAsync();

	expect( wrapper.find( '.wmde-banner-slider--stopped' ).exists() ).toBeTruthy();
};

const expectShowsSlideShowOnSmallSizes = async ( getWrapper: () => VueWrapper<any> ): Promise<any> => {
	Object.defineProperty( window, 'innerWidth', { writable: true, configurable: true, value: 1300 } );
	const wrapper = getWrapper();

	expect( wrapper.find( '.wmde-banner-slider' ).exists() ).toBeTruthy();
};

const expectShowsMessageOnSmallSizes = async ( getWrapper: () => VueWrapper<any> ): Promise<any> => {
	Object.defineProperty( window, 'innerWidth', { writable: true, configurable: true, value: 1301 } );
	const wrapper = getWrapper();

	expect( wrapper.find( '.wmde-banner-message' ).exists() ).toBeTruthy();
};

const expectHidesAnimatedVisitorsVsDonorsSentenceInMessage = async ( getWrapper: ( dynamicContent: DynamicContent ) => VueWrapper<any> ): Promise<any> => {
	Object.defineProperty( window, 'innerWidth', { writable: true, configurable: true, value: 1301 } );
	const wrapper = getWrapper( null );

	expect( wrapper.find( '.wmde-banner-message .wmde-banner-text-animated-highlight' ).exists() ).toBeFalsy();
};
const expectShowsAnimatedVisitorsVsDonorsSentenceInMessage = async ( getWrapper: ( dynamicContent: DynamicContent ) => VueWrapper<any> ): Promise<any> => {
	Object.defineProperty( window, 'innerWidth', { writable: true, configurable: true, value: 1301 } );
	const dynamicContent = newDynamicContent();
	dynamicContent.visitorsVsDonorsSentence = 'Visitors vs donors sentence';
	const wrapper = getWrapper( dynamicContent );

	expect( wrapper.find( '.wmde-banner-message .wmde-banner-text-animated-highlight' ).exists() ).toBeTruthy();
};

const expectHidesAnimatedVisitorsVsDonorsSentenceInSlideShow = async ( getWrapper: ( dynamicContent: DynamicContent ) => VueWrapper<any> ): Promise<any> => {
	Object.defineProperty( window, 'innerWidth', { writable: true, configurable: true, value: 1300 } );
	const wrapper = getWrapper( null );

	expect( wrapper.find( '.wmde-banner-slider .wmde-banner-text-animated-highlight' ).exists() ).toBeFalsy();
};
const expectShowsAnimatedVisitorsVsDonorsSentenceInSlideShow = async ( getWrapper: ( dynamicContent: DynamicContent ) => VueWrapper<any> ): Promise<any> => {
	Object.defineProperty( window, 'innerWidth', { writable: true, configurable: true, value: 1300 } );
	const dynamicContent = newDynamicContent();
	dynamicContent.visitorsVsDonorsSentence = 'Visitors vs donors sentence';
	const wrapper = getWrapper( dynamicContent );

	expect( wrapper.find( '.wmde-banner-slider .wmde-banner-text-animated-highlight' ).exists() ).toBeTruthy();
};

export const bannerContentFeatures: Record<string, ( wrapper: VueWrapper<any> ) => Promise<any>> = {
	expectSlideShowPlaysWhenBecomesVisible,
	expectSlideShowStopsOnFormInteraction
};

export const bannerContentDisplaySwitchFeatures: Record<string, ( getWrapper: () => VueWrapper<any> ) => Promise<any>> = {
	expectShowsSlideShowOnSmallSizes,
	expectShowsMessageOnSmallSizes
};

export const bannerContentAnimatedTextFeatures: Record<string, ( getWrapper: () => VueWrapper<any> ) => Promise<any>> = {
	expectHidesAnimatedVisitorsVsDonorsSentenceInMessage,
	expectShowsAnimatedVisitorsVsDonorsSentenceInMessage,
	expectHidesAnimatedVisitorsVsDonorsSentenceInSlideShow,
	expectShowsAnimatedVisitorsVsDonorsSentenceInSlideShow
};
