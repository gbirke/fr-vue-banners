import { TrackingEvent } from '@src/tracking/TrackingEvent';

/**
 * Implementations of this interface will send tracking data to external
 * tracking system, e.g. MediaWiki event tracking (on mw.org) or Matomo (on mw.de)
 */
export interface Tracker {
	trackEvent: ( trackingData: TrackingEvent<any> ) => void;
}
