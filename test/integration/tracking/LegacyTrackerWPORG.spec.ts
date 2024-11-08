import { describe, expect, it, test, vi } from 'vitest';
import { ClickAlreadyDonatedEvent } from '@src/tracking/events/ClickAlreadyDonatedEvent';
import { LegacyTrackerWPORG, TrackingEventConverterFactory } from '@src/tracking/LegacyTrackerWPORG';
import { WMDELegacyBannerEvent } from '@src/tracking/WPORG/WMDELegacyBannerEvent';
import { MediaWikiStub } from '@test/fixtures/MediaWikiStub';

describe( 'LegacyTrackerWPORG', function () {

	it( 'tracks events', () => {
		const mediaWikiStub = new MediaWikiStub();
		mediaWikiStub.track = vi.fn();
		const runtimeEnvironmentStub = { isInDevMode: false, runsInDevEnvironment: false };
		const legacyWMDEBannerEvent = new WMDELegacyBannerEvent( 'eventName', 1 );
		const trackingEventConverterFactory = vi.fn( () => legacyWMDEBannerEvent );
		const clickAlreadyDonatedEvent = new ClickAlreadyDonatedEvent();
		const eventNameMap = new Map<string, TrackingEventConverterFactory>( [ [ ClickAlreadyDonatedEvent.EVENT_NAME, trackingEventConverterFactory ] ] );
		const tracker = new LegacyTrackerWPORG( mediaWikiStub, 'somebannername', eventNameMap, runtimeEnvironmentStub );

		tracker.trackEvent( clickAlreadyDonatedEvent );

		expect( trackingEventConverterFactory ).toBeCalledWith( clickAlreadyDonatedEvent );
		expect( mediaWikiStub.track ).toBeCalledWith(
			'event.WMDEBannerEvents',
			{
				bannerAction: 'eventName',
				bannerName: 'somebannername',
				eventRate: 1,
				finalSlide: 0,
				slidesShown: 0
			}
		);
	} );

	it( 'drops events that are not in the list of allowed events', () => {
		const mediaWikiStub = new MediaWikiStub();
		mediaWikiStub.track = vi.fn();
		const runtimeEnvironmentStub = { isInDevMode: false, runsInDevEnvironment: false };
		const emptyEventMap = new Map<string, TrackingEventConverterFactory>();
		const tracker = new LegacyTrackerWPORG( mediaWikiStub, 'somebannername', emptyEventMap, runtimeEnvironmentStub );

		tracker.trackEvent( new ClickAlreadyDonatedEvent() );

		expect( mediaWikiStub.track ).not.toHaveBeenCalled();
	} );

	test.each( [
		[ 0.5, 1, true ],
		[ 0.7777, 0, false ],
		[ 0.7777, 0.01, false ],
		[ 0.009, 0.01, true ],
		[ 0.1, 0.1, true ]
	] )( 'should only do tracking when the random threshold (%f) is smaller the tracking rate (%f)', ( randomValue: number, trackingRate: number, wasTracked: boolean ) => {
		const oldRandom = Math.random;
		Math.random = vi.fn( () => randomValue );
		const mediaWikiStub = new MediaWikiStub();
		mediaWikiStub.track = vi.fn();
		const runtimeEnvironmentStub = { isInDevMode: false, runsInDevEnvironment: false };
		const trackingEventConverter = vi.fn( () => new WMDELegacyBannerEvent( 'test', trackingRate ) );
		const eventNameMap = new Map<string, TrackingEventConverterFactory>( [ [ ClickAlreadyDonatedEvent.EVENT_NAME, trackingEventConverter ] ] );
		const tracker = new LegacyTrackerWPORG( mediaWikiStub, 'somebannername', eventNameMap, runtimeEnvironmentStub );

		tracker.trackEvent( new ClickAlreadyDonatedEvent() );

		expect( mediaWikiStub.track ).toHaveBeenCalledTimes( wasTracked ? 1 : 0 );

		Math.random = oldRandom;
	} );

	it( 'should always track in "devMode" and ignore tracking rate when rate is > 0', () => {
		const mediaWikiStub = new MediaWikiStub();
		mediaWikiStub.track = vi.fn();
		const runtimeEnvironmentStub = { isInDevMode: true, runsInDevEnvironment: true };
		const trackingEventConverter = vi.fn( () => new WMDELegacyBannerEvent( 'test', 0.1 ) );
		const eventNameMap = new Map<string, TrackingEventConverterFactory>( [ [ ClickAlreadyDonatedEvent.EVENT_NAME, trackingEventConverter ] ] );
		const tracker = new LegacyTrackerWPORG( mediaWikiStub, 'someotherweirdbannername05', eventNameMap, runtimeEnvironmentStub );

		tracker.trackEvent( new ClickAlreadyDonatedEvent() );

		expect( mediaWikiStub.track ).toHaveBeenCalled();
	} );

	it( 'should never track when event tracking rate is 0', () => {
		const mediaWikiStub = new MediaWikiStub();
		mediaWikiStub.track = vi.fn();
		const runtimeEnvironmentStub = { isInDevMode: true, runsInDevEnvironment: true };
		const trackingEventConverter = vi.fn( () => new WMDELegacyBannerEvent( 'test', 0 ) );
		const eventNameMap = new Map<string, TrackingEventConverterFactory>( [ [ ClickAlreadyDonatedEvent.EVENT_NAME, trackingEventConverter ] ] );
		const tracker = new LegacyTrackerWPORG( mediaWikiStub, 'someotherweirdbannername05', eventNameMap, runtimeEnvironmentStub );

		tracker.trackEvent( new ClickAlreadyDonatedEvent() );

		expect( mediaWikiStub.track ).not.toHaveBeenCalled();
	} );

} );
