import { JSDOM } from 'jsdom';
import { beforeEach, describe, expect, it, vi, vitest } from 'vitest';
import { CloseChoices } from '@src/domain/CloseChoices';
import { BannerNotShownReasons } from '@src/page/BannerNotShownReasons';
import { MediaWiki } from '@src/page/MediaWiki/MediaWiki';
import PageWPORG, { bannerAppId } from '@src/page/PageWPORG';
import { CloseEvent } from '@src/tracking/events/CloseEvent';
import { Vector2 } from '@src/utils/Vector2';
import { SizeIssueCheckerStub } from '@test/fixtures/SizeIssueCheckerStub';
import { SkinStub } from '@test/fixtures/SkinStub';

describe( 'PageWPORG', function () {
	let mediaWiki: MediaWiki;

	beforeEach( () => {
		mediaWiki = {
			isInArticleNamespace(): boolean {
				return true;
			},
			isShowingContentPage(): boolean {
				return false;
			},
			isContentHiddenByLightbox(): boolean {
				return false;
			},
			getConfigItem: vitest.fn(),
			track: vitest.fn(),
			preventBannerDisplayForPeriod: vitest.fn(),
			preventBannerDisplayForHours: vitest.fn(),
			preventBannerDisplayUntilEndOfCampaign: vitest.fn(),
			setBannerLoadedButHidden: vitest.fn()
		};
	} );

	it( 'shows when appropriate', function () {
		mediaWiki.isInArticleNamespace = vitest.fn().mockReturnValue( true );
		mediaWiki.isShowingContentPage = vitest.fn().mockReturnValue( true );
		mediaWiki.isContentHiddenByLightbox = vitest.fn().mockReturnValue( false );

		expect( ( new PageWPORG( mediaWiki, new SkinStub(), new SizeIssueCheckerStub() ) ).getReasonToNotShowBanner( Vector2.ZERO ) )
			.toBe( null );
	} );

	it( 'hides when not in article namespace', function () {
		mediaWiki.isInArticleNamespace = vitest.fn().mockReturnValue( false );
		mediaWiki.isShowingContentPage = vitest.fn().mockReturnValue( true );
		mediaWiki.isContentHiddenByLightbox = vitest.fn().mockReturnValue( false );

		expect( ( new PageWPORG( mediaWiki, new SkinStub(), new SizeIssueCheckerStub() ) ).getReasonToNotShowBanner( Vector2.ZERO ) )
			.toBe( BannerNotShownReasons.DisallowedNamespace );
	} );

	it( 'hides when not on content page', function () {
		mediaWiki.isInArticleNamespace = vitest.fn().mockReturnValue( true );
		mediaWiki.isShowingContentPage = vitest.fn().mockReturnValue( false );
		mediaWiki.isContentHiddenByLightbox = vitest.fn().mockReturnValue( false );

		expect( ( new PageWPORG( mediaWiki, new SkinStub(), new SizeIssueCheckerStub() ) ).getReasonToNotShowBanner( Vector2.ZERO ) )
			.toBe( BannerNotShownReasons.UserInteraction );
	} );

	it( 'hides when content is hidden by lightbox', function () {
		mediaWiki.isInArticleNamespace = vitest.fn().mockReturnValue( true );
		mediaWiki.isShowingContentPage = vitest.fn().mockReturnValue( true );
		mediaWiki.isContentHiddenByLightbox = vitest.fn().mockReturnValue( true );

		expect( ( new PageWPORG( mediaWiki, new SkinStub(), new SizeIssueCheckerStub() ) ).getReasonToNotShowBanner( Vector2.ZERO ) )
			.toBe( BannerNotShownReasons.UserInteraction );
	} );

	it( 'hides when there is a size issue', function () {
		mediaWiki.isInArticleNamespace = vitest.fn().mockReturnValue( true );
		mediaWiki.isShowingContentPage = vitest.fn().mockReturnValue( true );
		mediaWiki.isContentHiddenByLightbox = vitest.fn().mockReturnValue( false );

		expect( ( new PageWPORG( mediaWiki, new SkinStub(), new SizeIssueCheckerStub( true ) ) ).getReasonToNotShowBanner( Vector2.ZERO ) )
			.toBe( BannerNotShownReasons.SizeIssue );
	} );

	it( 'creates a mount point when getBannerContainer() is called', function () {
		const page = new PageWPORG( mediaWiki, new SkinStub(), new SizeIssueCheckerStub() );
		const id = page.getBannerContainer();

		expect( id ).toBe( '#' + bannerAppId );
		expect( document.body.innerHTML ).toBe( `<div id="${ bannerAppId }"></div>` );
	} );

	it( 'stores "close" cookie for already donated "enough for this year" events', () => {
		const page = new PageWPORG( mediaWiki, new SkinStub(), new SizeIssueCheckerStub() );

		page.setCloseCookieIfNecessary( new CloseEvent( 'AlreadyDonated', CloseChoices.NoMoreBannersForCampaign ) );

		expect( mediaWiki.preventBannerDisplayUntilEndOfCampaign ).toHaveBeenCalledOnce();
	} );

	it( 'does not store cookie for the AlreadyDonated "Maybe Later" event', () => {
		const page = new PageWPORG( mediaWiki, new SkinStub(), new SizeIssueCheckerStub() );

		page.setCloseCookieIfNecessary( new CloseEvent( 'AlreadyDonated', CloseChoices.MaybeLater ) );

		expect( mediaWiki.preventBannerDisplayUntilEndOfCampaign ).not.toHaveBeenCalledOnce();
	} );

	it( 'does not store cookie for the "Hide" event', () => {
		const page = new PageWPORG( mediaWiki, new SkinStub(), new SizeIssueCheckerStub() );

		page.setCloseCookieIfNecessary( new CloseEvent( 'FullPageBanner', CloseChoices.Hide ) );

		expect( mediaWiki.preventBannerDisplayUntilEndOfCampaign ).not.toHaveBeenCalledOnce();
	} );

	it( 'stores close cookie when user closes soft close', () => {
		const page = new PageWPORG( mediaWiki, new SkinStub(), new SizeIssueCheckerStub() );

		page.setCloseCookieIfNecessary( new CloseEvent( 'SoftClose', CloseChoices.Close ) );

		expect( mediaWiki.preventBannerDisplayForPeriod ).toHaveBeenCalledOnce();
	} );

	it( 'stores close cookie when user ignores soft close', () => {
		const page = new PageWPORG( mediaWiki, new SkinStub(), new SizeIssueCheckerStub() );

		page.setCloseCookieIfNecessary( new CloseEvent( 'SoftClose', CloseChoices.TimeOut ) );

		expect( mediaWiki.preventBannerDisplayForPeriod ).toHaveBeenCalledOnce();
	} );

	it( 'stores close cookie when user closes main banner', () => {
		const page = new PageWPORG( mediaWiki, new SkinStub(), new SizeIssueCheckerStub() );

		page.setCloseCookieIfNecessary( new CloseEvent( 'MainBanner', CloseChoices.Close ) );

		expect( mediaWiki.preventBannerDisplayForPeriod ).toHaveBeenCalledOnce();
	} );

	it( 'stores close cookie when user closes mini banner', () => {
		const page = new PageWPORG( mediaWiki, new SkinStub(), new SizeIssueCheckerStub() );

		page.setCloseCookieIfNecessary( new CloseEvent( 'MiniBanner', CloseChoices.Close ) );

		expect( mediaWiki.preventBannerDisplayForPeriod ).toHaveBeenCalledOnce();
	} );

	it( 'stores close cookie when user closes with maybe later', () => {
		const page = new PageWPORG( mediaWiki, new SkinStub(), new SizeIssueCheckerStub() );

		page.setCloseCookieIfNecessary( new CloseEvent( 'SoftClose', CloseChoices.MaybeLater ) );

		expect( mediaWiki.preventBannerDisplayForHours ).toHaveBeenCalledOnce();
		expect( mediaWiki.preventBannerDisplayForHours ).toHaveBeenCalledWith( 6 );
	} );

	it( 'returns campaign parameters', () => {
		const dom = new JSDOM( `<!DOCTYPE html><p id="wmde-campaign-parameters" data-start-date="2084-12-12">Hello world</p>` );
		vitest.stubGlobal( 'document', dom.window.document );
		const page = new PageWPORG( mediaWiki, new SkinStub(), new SizeIssueCheckerStub() );

		const retrievedCampaignParameters = page.getCampaignParameters();

		expect( retrievedCampaignParameters.startDate ).toBe( '2084-12-12' );
	} );

	it( 'throws error if campaign parameters element not found', () => {
		const dom = new JSDOM( `<!DOCTYPE html><p data-start-date="2084-12-12">Hello world</p>` );
		vitest.stubGlobal( 'document', dom.window.document );
		const page = new PageWPORG( mediaWiki, new SkinStub(), new SizeIssueCheckerStub() );

		expect( () => page.getCampaignParameters() ).toThrow( 'Campaign data element not found' );
	} );

	it( 'returns banner tracking keyword and campaign', () => {
		const dom = new JSDOM( `<!DOCTYPE html><p id="WMDE-Banner-Container" data-tracking="org-00-2023-blabla-ctrl" data-campaign-tracking="a-campaign">Hello world</p>` );
		vitest.stubGlobal( 'document', dom.window.document );
		const page = new PageWPORG( mediaWiki, new SkinStub(), new SizeIssueCheckerStub() );

		const retrievedTrackingKeyword = page.getTracking();

		expect( retrievedTrackingKeyword.keyword ).toBe( 'org-00-2023-blabla-ctrl' );
		expect( retrievedTrackingKeyword.campaign ).toBe( 'a-campaign' );
	} );

	it( 'throws error if banner tracking can not be retrieved', () => {
		const dom = new JSDOM( `<!DOCTYPE html><p data-tracking="org-00-2023-blabla-ctrl">Hello world</p>` );
		vitest.stubGlobal( 'document', dom.window.document );
		const page = new PageWPORG( mediaWiki, new SkinStub(), new SizeIssueCheckerStub() );

		expect( () => page.getTracking() ).toThrow( 'Banner container element not found' );
	} );

	it( 'Sets the body to fixed when a modal is opened', () => {
		Object.defineProperty( window, 'scrollY', { writable: true, configurable: true, value: 42 } );
		const page = new PageWPORG( mediaWiki, new SkinStub(), new SizeIssueCheckerStub() );

		page.setModalOpened();

		expect( document.body.style.getPropertyValue( 'position' ) ).toStrictEqual( 'fixed' );
		expect( document.body.style.getPropertyValue( 'top' ) ).toStrictEqual( '-42px' );
	} );

	it( 'Removes the fixed from the body when a modal is closed', () => {
		document.body.style.position = 'fixed';
		document.body.style.top = '-42px';
		const scrollTo = vi.fn();
		Object.defineProperty( window, 'scrollTo', { writable: true, configurable: true, value: scrollTo } );
		const page = new PageWPORG( mediaWiki, new SkinStub(), new SizeIssueCheckerStub() );

		page.setModalClosed();

		expect( document.body.style.getPropertyValue( 'position' ) ).toStrictEqual( '' );
		expect( document.body.style.getPropertyValue( 'top' ) ).toStrictEqual( '' );
		expect( scrollTo ).toHaveBeenCalledOnce();
		expect( scrollTo ).toHaveBeenCalledWith( 0, 42 );
	} );
} );
