import { afterEach, beforeEach, describe, expect, it, test, vi } from 'vitest';
import { ClickAlreadyDonatedEvent } from '@src/tracking/events/ClickAlreadyDonatedEvent';
import { CloseEvent } from '@src/tracking/events/CloseEvent';
import { CustomAmountChangedEvent } from '@src/tracking/events/CustomAmountChangedEvent';
import { FormStepShownEvent } from '@src/tracking/events/FormStepShownEvent';
import { ShownEvent } from '@src/tracking/events/ShownEvent';
import { TrackerWPDE } from '@src/tracking/TrackerWPDE';
import { TrackingEvent } from '@src/tracking/TrackingEvent';

interface Window {
	[ key: string ]: any;
}
declare let window: Window;

describe( 'TrackerWPDE', function () {

	beforeEach( () => {
		window.TestTracker = { trackEvent: vi.fn(), trackContentImpression: vi.fn() };
		vi.useFakeTimers();
	} );

	afterEach( () => {
		vi.useRealTimers();
	} );

	it( 'tracks shown event using trackContentImpression', () => {
		const event = new ShownEvent( 'Page' );
		const tracker = new TrackerWPDE(
			'TestTracker',
			'TestBanner05',
			new Map<string, number>( [ [ event.eventName, 1 ] ] ),
			{ isInDevMode: false, runsInDevEnvironment: false }
		);

		tracker.trackEvent( event );

		expect( window.TestTracker.trackContentImpression ).toBeCalledWith( 'Banners', 'TestBanner05' );
	} );

	it( 'tracks other events using trackEvent', () => {
		const tracker = new TrackerWPDE(
			'TestTracker',
			'TestBanner05',
			new Map<string, number>( [ [ 'some-action', 1 ] ] ),
			{ isInDevMode: false, runsInDevEnvironment: false }
		);

		tracker.trackEvent( { eventName: 'some-action', feature: '', userChoice: '', customData: undefined } );

		expect( window.TestTracker.trackEvent ).toBeCalledWith( 'Banners', 'some-action', 'TestBanner05' );
	} );

	test.each( [
		[ new CloseEvent( 'SoftClose', 'close' ), 'banner-closed-close' ],
		[ new CustomAmountChangedEvent( 'increased' ), 'increased-amount' ],
		[ new CustomAmountChangedEvent( 'decreased' ), 'decreased-amount' ],
		[ new FormStepShownEvent( 'UpgradeToYearlyForm' ), 'form-step-shown-UpgradeToYearlyForm' ],
		[ { eventName: 'some-action', feature: '', userChoice: '', customData: {} }, 'some-action' ],
		[ { eventName: 'some-action', feature: '', userChoice: 'with-choice', customData: {} }, 'some-action-with-choice' ]
	] )( 'converts events', ( event: TrackingEvent, expectedName: string ) => {
		const tracker = new TrackerWPDE(
			'TestTracker',
			'TestBanner05',
			new Map<string, number>( [ [ event.eventName, 1 ] ] ),
			{ isInDevMode: false, runsInDevEnvironment: false }
		);

		tracker.trackEvent( event );

		expect( window.TestTracker.trackEvent ).toBeCalledWith( 'Banners', expectedName, 'TestBanner05' );
	} );

	it( 'collects tracking events until the tracker becomes available', async () => {
		const neverCalledTrackerSpy = { trackEvent: vi.fn(), trackContentImpression: vi.fn() };
		window.TestTracker = undefined;

		const tracker = new TrackerWPDE(
			'TestTracker',
			'TestBanner05',
			new Map<string, number>( [ [ 'action-1', 1 ], [ 'action-2', 1 ] ] ),
			{ isInDevMode: false, runsInDevEnvironment: false }
		);

		// Inject the neverCalledTrackerSpy into the tracker, so we can make sure it's not called until it finds the window tracker
		Object.defineProperty( tracker, '_tracker', { writable: true, configurable: true, value: neverCalledTrackerSpy } );

		tracker.trackEvent( { eventName: 'action-1', feature: '', userChoice: '', customData: undefined } );
		tracker.trackEvent( { eventName: 'action-2', feature: '', userChoice: '', customData: undefined } );

		await vi.runOnlyPendingTimersAsync();

		expect( neverCalledTrackerSpy.trackEvent ).not.toHaveBeenCalled();

		window.TestTracker = { trackEvent: vi.fn() };

		await vi.runOnlyPendingTimersAsync();

		expect( neverCalledTrackerSpy.trackEvent ).not.toHaveBeenCalled();
		expect( window.TestTracker.trackEvent ).toHaveBeenCalledTimes( 2 );
	} );

	it( 'aborts trying to find the tracker when the retry times out', async () => {
		const tracker = new TrackerWPDE(
			'TestTracker',
			'TestBanner05',
			new Map<string, number>( [ [ 'action-1', 1 ], [ 'action-2', 1 ] ] ),
			{ isInDevMode: false, runsInDevEnvironment: false }
		);

		Object.defineProperty( tracker, '_trackerFindCounter', { writable: true, configurable: true, value: 10 } );

		tracker.trackEvent( { eventName: 'action-1', feature: '', userChoice: '', customData: undefined } );
		tracker.trackEvent( { eventName: 'action-2', feature: '', userChoice: '', customData: undefined } );

		window.TestTracker = { trackEvent: vi.fn() };

		await vi.runAllTimersAsync();

		expect( window.TestTracker.trackEvent ).not.toHaveBeenCalled();
	} );

	test.each( [
		[ new CustomAmountChangedEvent( 'increased' ), CustomAmountChangedEvent.EVENT_NAME, 'increased-amount' ],
		[ new CustomAmountChangedEvent( 'decreased' ), CustomAmountChangedEvent.EVENT_NAME, 'decreased-amount' ],
		[ new ClickAlreadyDonatedEvent(), ClickAlreadyDonatedEvent.EVENT_NAME, ClickAlreadyDonatedEvent.EVENT_NAME ]
	] )( 'should generate event identifiers from tracking data, data set %#',
		( trackingEvent: TrackingEvent<void>, allowedAction: string, expectedId: string ) => {
			const tracker = new TrackerWPDE(
				'TestTracker',
				'TestBanner05',
				new Map<string, number>( [ [ allowedAction, 1 ] ] ),
				{ isInDevMode: false, runsInDevEnvironment: false }
			);

			tracker.trackEvent( trackingEvent );

			expect( window.TestTracker.trackEvent ).toBeCalledWith( 'Banners', expectedId, 'TestBanner05' );
		} );

	test.each( [
		[ 0.5, 1, true ],
		[ 0.7777, 0, false ],
		[ 0.7777, 0.01, false ],
		[ 0.009, 0.01, true ],
		[ 0.1, 0.1, true ]
	] )( 'should only do tracking when the random threshold (%f) is smaller the tracking rate (%f)',
		( randomValue: number, trackingRate: number, wasTracked: boolean ) => {
			const oldRandom = Math.random;
			Math.random = vi.fn( () => randomValue );
			const tracker = new TrackerWPDE(
				'TestTracker',
				'TestBanner05',
				new Map<string, number>( [ [ 'some-action', trackingRate ] ] ),
				{ isInDevMode: false, runsInDevEnvironment: false }
			);

			tracker.trackEvent( { eventName: 'some-action', feature: '', userChoice: '', customData: undefined } );

			expect( window.TestTracker.trackEvent ).toHaveBeenCalledTimes( wasTracked ? 1 : 0 );

			Math.random = oldRandom;
		} );

	it( 'should always track in "devMode" and ignore tracking rate', () => {
		const tracker = new TrackerWPDE(
			'TestTracker',
			'TestBanner05',
			new Map<string, number>( [ [ 'some-action', 0.1 ] ] ),
			{ isInDevMode: true, runsInDevEnvironment: true }
		);

		tracker.trackEvent( { eventName: 'some-action', feature: '', userChoice: '', customData: undefined } );

		expect( window.TestTracker.trackEvent ).toHaveBeenCalled();
	} );

	it( 'should never track events with 0 tracking rate even when in "devMode"', () => {
		const tracker = new TrackerWPDE(
			'TestTracker',
			'TestBanner05',
			new Map<string, number>( [ [ 'some-action', 0 ] ] ),
			{ isInDevMode: true, runsInDevEnvironment: true }
		);

		tracker.trackEvent( { eventName: 'some-action', feature: '', userChoice: '', customData: undefined } );

		expect( window.TestTracker.trackEvent ).not.toHaveBeenCalled();
	} );

	it( 'only tracks known events', () => {
		const tracker = new TrackerWPDE(
			'TestTracker',
			'TestBanner05',
			new Map<string, number>( [ [ 'some-action', 1 ] ] ),
			{ isInDevMode: true, runsInDevEnvironment: true }
		);

		tracker.trackEvent( { eventName: 'unknown-event', feature: '', userChoice: '', customData: undefined } );

		expect( window.TestTracker.trackEvent ).not.toHaveBeenCalled();
	} );
} );
