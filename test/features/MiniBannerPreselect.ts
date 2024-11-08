import { VueWrapper } from '@vue/test-utils';
import { expect } from 'vitest';
import { MobileMiniBannerExpandedEvent } from '@src/tracking/events/MobileMiniBannerExpandedEvent';
import { Tracker } from '@src/tracking/Tracker';

const expectShowsFullPageWhenPreselectIsClicked = async ( wrapper: VueWrapper<any> ): Promise<any> => {
	await wrapper.find( '.wmde-banner-mini-button-preselect' ).trigger( 'click' );

	expect( wrapper.classes() ).toContain( 'wmde-banner-wrapper--full-page' );
};

const expectShowsFullPageInfoWhenNextIsClicked = async ( wrapper: VueWrapper<any> ): Promise<any> => {
	await wrapper.find( '.wmde-banner-mini-button' ).trigger( 'click' );

	expect( wrapper.find( '.wmde-banner-full' ).classes() ).not.toContain( 'wmde-banner-full-from-preselect' );
	expect( wrapper.find( '.wmde-banner-full-info' ).exists() ).toBeTruthy();
};

const expectHidesFullPageInfoWhenPreselectIsClicked = async ( wrapper: VueWrapper<any> ): Promise<any> => {
	await wrapper.find( '.wmde-banner-mini-button-preselect' ).trigger( 'click' );

	expect( wrapper.find( '.wmde-banner-full' ).classes() ).toContain( 'wmde-banner-full-from-preselect' );
	expect( wrapper.find( '.wmde-banner-full-info' ).exists() ).toBeFalsy();
};

const expectPreselectsAmountWhenPreselectIsClicked = async ( wrapper: VueWrapper<any> ): Promise<any> => {
	await wrapper.find( '.wmde-banner-mini-button-preselect' ).trigger( 'click' );

	expect( wrapper.find<HTMLInputElement>( '.wmde-banner-select-group-input:checked' ).element.value ).toStrictEqual( '10' );
};

const expectTrackingEventIsFiredWhenPreselectIsClicked = async ( wrapper: VueWrapper<any>, tracker: Tracker ): Promise<any> => {
	await wrapper.find( '.wmde-banner-mini-button-preselect' ).trigger( 'click' );

	expect( tracker.trackEvent ).toHaveBeenCalledOnce();
	expect( tracker.trackEvent ).toHaveBeenCalledWith( new MobileMiniBannerExpandedEvent( 'preselected' ) );
};

export const miniBannerPreselectFeatures: Record<string, ( wrapper: VueWrapper<any>, tracker: Tracker ) => Promise<any>> = {
	expectShowsFullPageWhenPreselectIsClicked,
	expectShowsFullPageInfoWhenNextIsClicked,
	expectHidesFullPageInfoWhenPreselectIsClicked,
	expectPreselectsAmountWhenPreselectIsClicked,
	expectTrackingEventIsFiredWhenPreselectIsClicked
};
