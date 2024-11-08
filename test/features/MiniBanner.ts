import { VueWrapper } from '@vue/test-utils';
import { expect } from 'vitest';
import { BannerStates } from '@src/components/BannerConductor/StateMachine/BannerStates';

const expectSlideShowPlaysWhenMiniBannerBecomesVisible = async ( wrapper: VueWrapper<any> ): Promise<any> => {
	await wrapper.setProps( { bannerState: BannerStates.Visible } );

	expect( wrapper.find( '.wmde-banner-slider--playing' ).exists() ).toBeTruthy();
};

const expectSlideShowStopsWhenFullBannerBecomesVisible = async ( wrapper: VueWrapper<any> ): Promise<any> => {
	await wrapper.setProps( { bannerState: BannerStates.Visible } );
	await wrapper.find( '.wmde-banner-mini-button' ).trigger( 'click' );

	expect( wrapper.find( '.wmde-banner-slider--stopped' ).exists() ).toBeTruthy();
};

const expectShowsFullPageWhenCallToActionIsClicked = async ( wrapper: VueWrapper<any> ): Promise<any> => {
	await wrapper.find( '.wmde-banner-mini-button' ).trigger( 'click' );

	expect( wrapper.classes() ).toContain( 'wmde-banner-wrapper--full-page' );
};

const expectEmitsBannerContentChangedEventWhenCallToActionIsClicked = async ( wrapper: VueWrapper<any> ): Promise<any> => {
	await wrapper.find( '.wmde-banner-mini-button' ).trigger( 'click' );

	expect( wrapper.emitted( 'bannerContentChanged' ).length ).toBe( 1 );
};

export const miniBannerFeatures: Record<string, ( wrapper: VueWrapper<any> ) => Promise<any>> = {
	expectSlideShowPlaysWhenMiniBannerBecomesVisible,
	expectSlideShowStopsWhenFullBannerBecomesVisible,
	expectShowsFullPageWhenCallToActionIsClicked,
	expectEmitsBannerContentChangedEventWhenCallToActionIsClicked
};
