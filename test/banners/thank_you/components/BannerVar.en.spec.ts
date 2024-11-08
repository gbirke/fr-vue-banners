import { mount, VueWrapper } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import BannerCtrl from '@banners/thank_you/components/BannerVar.en.vue';
import FullPageBannerTextLose from '@banners/thank_you/content/lose/FullPageBannerText.en.vue';
import MiniBannerSlidesLose from '@banners/thank_you/content/lose/MiniBannerSlides.en.vue';
import MiniBannerTextLose from '@banners/thank_you/content/lose/MiniBannerText.en.vue';
import FullPageBannerTextWin from '@banners/thank_you/content/win/FullPageBannerText.en.vue';
import MiniBannerSlidesWin from '@banners/thank_you/content/win/MiniBannerSlides.en.vue';
import MiniBannerTextWin from '@banners/thank_you/content/win/MiniBannerText.en.vue';
import { MembershipFormActions } from '@banners/thank_you/MembershipFormActions';
import { BannerStates } from '@src/components/BannerConductor/StateMachine/BannerStates';
import { CloseChoices } from '@src/domain/CloseChoices';
import { BannerSubmitEvent } from '@src/tracking/events/BannerSubmitEvent';
import { CloseEvent } from '@src/tracking/events/CloseEvent';
import { ThankYouModalShownEvent } from '@src/tracking/events/ThankYouModalShownEvent';
import { Tracker } from '@src/tracking/Tracker';
import { TimerStub } from '@test/fixtures/TimerStub';

const formActions: MembershipFormActions = {
	create: ( extraUrlParameters: Record<string, string> ) => `URL [ ${ extraUrlParameters?.interval }, ${ extraUrlParameters?.fee } ]`
};

describe( 'BannerVar.en.vue', () => {
	let tracker: Tracker;

	const getWrapper = ( progressBarPercentage: number = 80 ): VueWrapper<any> => {
		tracker = { trackEvent: vi.fn() };
		return mount( BannerCtrl, {
			props: {
				bannerState: BannerStates.Pending,
				settings: {
					numberOfDonors: '42',
					progressBarPercentage
				},
				subscribeURL: 'SUBSCRIBE URL',
				useOfFundsURL: 'USE OF FUNDS'
			},
			global: {
				mocks: {
					$translate: ( key: string ): string => key
				},
				provide: {
					tracker: tracker,
					formActions,
					timer: new TimerStub()
				}
			}
		} );
	};

	it( 'emits close event', () => {
		const wrapper = getWrapper();

		wrapper.find( '.wmde-banner-close' ).trigger( 'click' );

		expect( wrapper.emitted( 'bannerClosed' ).length ).toStrictEqual( 1 );
		expect( wrapper.emitted( 'bannerClosed' )[ 0 ][ 0 ] ).toStrictEqual( new CloseEvent( 'MainBanner', CloseChoices.Close ) );
	} );

	it( 'shows text win content', () => {
		Object.defineProperty( window, 'innerWidth', { writable: true, configurable: true, value: 751 } );
		const wrapper = getWrapper( 100 );

		expect( wrapper.findComponent( MiniBannerTextWin ).exists() ).toBeTruthy();
		expect( wrapper.findComponent( FullPageBannerTextWin ).exists() ).toBeTruthy();
		expect( wrapper.findComponent( MiniBannerTextLose ).exists() ).toBeFalsy();
		expect( wrapper.findComponent( FullPageBannerTextLose ).exists() ).toBeFalsy();
		expect( wrapper.findAll( '.wmde-banner-firework' ).length ).toStrictEqual( 5 );
	} );

	it( 'shows slider win content', () => {
		Object.defineProperty( window, 'innerWidth', { writable: true, configurable: true, value: 750 } );
		const wrapper = getWrapper( 100 );

		expect( wrapper.findComponent( MiniBannerSlidesWin ).exists() ).toBeTruthy();
		expect( wrapper.findComponent( FullPageBannerTextWin ).exists() ).toBeTruthy();
		expect( wrapper.findComponent( MiniBannerSlidesLose ).exists() ).toBeFalsy();
		expect( wrapper.findComponent( FullPageBannerTextLose ).exists() ).toBeFalsy();
		expect( wrapper.findAll( '.wmde-banner-firework' ).length ).toStrictEqual( 5 );
	} );

	it( 'shows text lose content', () => {
		Object.defineProperty( window, 'innerWidth', { writable: true, configurable: true, value: 751 } );
		const wrapper = getWrapper( 99 );

		expect( wrapper.findComponent( MiniBannerTextWin ).exists() ).toBeFalsy();
		expect( wrapper.findComponent( FullPageBannerTextWin ).exists() ).toBeFalsy();
		expect( wrapper.findComponent( MiniBannerTextLose ).exists() ).toBeTruthy();
		expect( wrapper.findComponent( FullPageBannerTextLose ).exists() ).toBeTruthy();
		expect( wrapper.findAll( '.wmde-banner-firework' ).length ).toStrictEqual( 0 );
	} );

	it( 'shows slider lose content', () => {
		Object.defineProperty( window, 'innerWidth', { writable: true, configurable: true, value: 750 } );
		const wrapper = getWrapper( 99 );

		expect( wrapper.findComponent( MiniBannerSlidesWin ).exists() ).toBeFalsy();
		expect( wrapper.findComponent( FullPageBannerTextWin ).exists() ).toBeFalsy();
		expect( wrapper.findComponent( MiniBannerSlidesLose ).exists() ).toBeTruthy();
		expect( wrapper.findComponent( FullPageBannerTextLose ).exists() ).toBeTruthy();
		expect( wrapper.findAll( '.wmde-banner-firework' ).length ).toStrictEqual( 0 );
	} );

	it( 'emits modal shown events', () => {
		const wrapper = getWrapper();

		wrapper.find( '.wmde-banner-button' ).trigger( 'click' );

		expect( tracker.trackEvent ).toHaveBeenCalledOnce();
		expect( tracker.trackEvent ).toHaveBeenCalledWith( new ThankYouModalShownEvent() );
		expect( wrapper.emitted( 'modalOpened' ).length ).toStrictEqual( 1 );
	} );

	it( 'emits modal hidden events', () => {
		const wrapper = getWrapper();

		wrapper.find( '.wmde-banner-full .wmde-banner-close' ).trigger( 'click' );

		expect( wrapper.emitted( 'modalClosed' ).length ).toStrictEqual( 1 );
	} );

	it( 'sets progress bar fill percentage on slider', () => {
		Object.defineProperty( window, 'innerWidth', { writable: true, configurable: true, value: 750 } );
		const wrapper = getWrapper();

		expect( wrapper.find( '.wmde-banner-progress-bar' ).attributes( 'style' ) ).toStrictEqual( '--wmde-banner-progress-bar-width: 80%;' );
	} );

	it( 'sets progress bar fill percentage on text', () => {
		Object.defineProperty( window, 'innerWidth', { writable: true, configurable: true, value: 751 } );
		const wrapper = getWrapper();

		expect( wrapper.find( '.wmde-banner-progress-bar' ).attributes( 'style' ) ).toStrictEqual( '--wmde-banner-progress-bar-width: 80%;' );
	} );

	it( 'redirects when membership buttons are clicked', async () => {
		const location = { href: '' };
		Object.defineProperty( window, 'location', { writable: true, configurable: true, value: location } );
		const wrapper = getWrapper();

		await wrapper.find( '.wmde-banner-full-cta-buttons .wmde-banner-button:first-child' ).trigger( 'click' );

		expect( location.href ).toStrictEqual( 'URL [ 1, 200 ]' );

		await wrapper.find( '.wmde-banner-full-cta-buttons .wmde-banner-button:nth-child( 2 )' ).trigger( 'click' );

		expect( location.href ).toStrictEqual( 'URL [ 1, 500 ]' );

		await wrapper.find( '.wmde-banner-full-cta-buttons .wmde-banner-button:last-child' ).trigger( 'click' );

		expect( location.href ).toStrictEqual( 'URL [ undefined, undefined ]' );
	} );

	it( 'tracks when membership buttons are clicked', async () => {
		Object.defineProperty( window, 'location', { writable: true, configurable: true, value: { href: '' } } );
		const wrapper = getWrapper();

		await wrapper.find( '.wmde-banner-full-cta-buttons .wmde-banner-button:first-child' ).trigger( 'click' );
		await wrapper.find( '.wmde-banner-full-cta-buttons .wmde-banner-button:nth-child( 2 )' ).trigger( 'click' );
		await wrapper.find( '.wmde-banner-full-cta-buttons .wmde-banner-button:last-child' ).trigger( 'click' );

		expect( tracker.trackEvent ).toBeCalledTimes( 3 );
		expect( tracker.trackEvent ).toBeCalledWith( new BannerSubmitEvent( 'ThankYouBanner', 'with-amount-2' ) );
		expect( tracker.trackEvent ).toBeCalledWith( new BannerSubmitEvent( 'ThankYouBanner', 'with-amount-5' ) );
		expect( tracker.trackEvent ).toBeCalledWith( new BannerSubmitEvent( 'ThankYouBanner', 'without-amount' ) );
	} );

	it( 'tracks and redirects when subscribe link is clicked', async () => {
		const location = { href: '' };
		Object.defineProperty( window, 'location', { writable: true, configurable: true, value: location } );
		const wrapper = getWrapper();

		await wrapper.find( '.wmde-banner-full-subscribe a:first-child' ).trigger( 'click' );

		expect( location.href ).toStrictEqual( 'SUBSCRIBE URL' );
		expect( tracker.trackEvent ).toBeCalledTimes( 1 );
		expect( tracker.trackEvent ).toBeCalledWith( new BannerSubmitEvent( 'ThankYouBanner', 'subscribe' ) );
	} );

	it( 'tracks and redirects when use of funds link is clicked', async () => {
		const location = { href: '' };
		Object.defineProperty( window, 'location', { writable: true, configurable: true, value: location } );
		const wrapper = getWrapper();

		await wrapper.find( '.wmde-banner-full-subscribe a:last-child' ).trigger( 'click' );

		expect( location.href ).toStrictEqual( 'USE OF FUNDS' );
		expect( tracker.trackEvent ).toBeCalledTimes( 1 );
		expect( tracker.trackEvent ).toBeCalledWith( new BannerSubmitEvent( 'ThankYouBanner', 'use-of-funds' ) );
	} );
} );
