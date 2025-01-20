import { Tracker } from '@src/tracking/Tracker';
import { TrackingEvent } from '@src/tracking/TrackingEvent';
import { CustomAmountChangedEvent } from '@src/tracking/events/CustomAmountChangedEvent';
import { CloseEvent } from '@src/tracking/events/CloseEvent';
import { FormStepShownEvent } from '@src/tracking/events/FormStepShownEvent';
import { RuntimeEnvironment } from '@src/utils/RuntimeEnvironment';
import { ShownEvent } from '@src/tracking/events/ShownEvent';

interface Window {
	[ key: string ]: any;
}
declare let window: Window;

interface PageTracker {
	trackEvent( category: string, eventName: string, bannerName: string ): void;
	trackContentImpression( category: string, bannerName: string ): void;
}

type TrackingRatesForEvents = Map<string, number>;
type TrackerFunction = ( tracker: PageTracker ) => void;

export class TrackerWPDE implements Tracker {

	private readonly _trackerName: string;
	private readonly _bannerName: string;
	private readonly _trackingRatesForEvents: TrackingRatesForEvents;
	private _preInitialisationEventQueue: TrackerFunction[];
	private _trackerFindCounter: number;
	private _hasFoundTracker: boolean;
	private _tracker: PageTracker;
	private _runtimeEnvironment: RuntimeEnvironment;

	public constructor( trackerName: string, bannerName: string, trackingRatesForEvents: TrackingRatesForEvents, runtimeEnvironment: RuntimeEnvironment ) {
		this._trackerName = trackerName;
		this._bannerName = bannerName;
		this._trackingRatesForEvents = trackingRatesForEvents;
		this._hasFoundTracker = false;
		this._tracker = null;
		this._trackerFindCounter = 0;
		this._preInitialisationEventQueue = [];
		this._runtimeEnvironment = runtimeEnvironment;

		this.waitForTrackerToInit();
	}

	public waitForTrackerToInit(): void {
		if ( !this.trackerLibraryIsLoaded( this._trackerName ) ) {
			if ( this._trackerFindCounter < 10 ) {
				this._trackerFindCounter++;
				this.scheduleRetryWithBackoff();
			}
			return;
		}
		this._tracker = window[ this._trackerName ];
		this._hasFoundTracker = true;
		this.trackItemsInEventQueue();
	}

	public trackEvent( event: TrackingEvent ): void {
		if ( !this._trackingRatesForEvents.has( event.eventName ) ) {
			return;
		}

		if ( !this.shouldTrackEvent( event.eventName ) ) {
			return;
		}

		if ( event.eventName === ShownEvent.EVENT_NAME ) {
			this.trackOrStore( ( tracker: PageTracker ): void => tracker.trackContentImpression( 'Banners', this._bannerName ) );
		} else {
			this.trackOrStore( ( tracker: PageTracker ): void => tracker.trackEvent( 'Banners', this.convertEventNameForTracker( event ), this._bannerName ) );
		}
	}

	private shouldTrackEvent( eventName: string ): boolean {
		const eventRate = this._trackingRatesForEvents.get( eventName );

		// Never track 0 rated events, even in devMode
		if ( eventRate === 0 ) {
			return false;
		}

		return this._runtimeEnvironment.isInDevMode || Math.random() <= eventRate;
	}

	private trackItemsInEventQueue(): void {
		this._preInitialisationEventQueue.forEach( trackFn => trackFn( this._tracker ) );
		this._preInitialisationEventQueue.splice( 0, this._preInitialisationEventQueue.length );
	}

	private trackerLibraryIsLoaded( trackerName: string ): boolean {
		return typeof window[ trackerName ] !== 'undefined' && window[ trackerName ] !== null;
	}

	private trackOrStore( trackFn: TrackerFunction ): void {
		if ( !this._hasFoundTracker ) {
			this._preInitialisationEventQueue.push( trackFn );
			return;
		}
		trackFn( this._tracker );
	}

	/**
	 * Tracking on WPDE only knows event names and can't handle our complex banner events
	 * with action, feature, userChoice, customData, etc. This method converts complex banner events
	 * into event names.
	 *
	 * Since we only have 2 channels on WPDE we decided to share the code.
	 *
	 * We should regularly clean up this method and remove unused events!
	 *
	 * @param {TrackingEvent} event
	 * @private
	 */
	private convertEventNameForTracker( event: TrackingEvent<void> ): string {
		switch ( event.eventName ) {
			case CustomAmountChangedEvent.EVENT_NAME:
				return event.userChoice + '-amount';
			case CloseEvent.EVENT_NAME:
				return 'banner-closed-' + event.userChoice;
			case FormStepShownEvent.EVENT_NAME:
				return event.eventName + '-' + event.feature;
			default:
				return event.eventName + ( event.userChoice !== '' ? '-' + event.userChoice : '' );
		}
	}

	/**
	 * This makes the retry interval longer every time it is called
	 */
	private scheduleRetryWithBackoff(): void {
		const RETRY_INTERVAL = 100;
		setTimeout(
			this.waitForTrackerToInit.bind( this ),
			RETRY_INTERVAL * ( this._trackerFindCounter + 1 )
		);
	}
}
