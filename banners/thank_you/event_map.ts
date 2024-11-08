import { BannerSubmitEvent } from '@src/tracking/events/BannerSubmitEvent';
import { CloseEvent } from '@src/tracking/events/CloseEvent';
import { NotShownEvent } from '@src/tracking/events/NotShownEvent';
import { ThankYouModalShownEvent } from '@src/tracking/events/ThankYouModalShownEvent';
import { createViewportInfo } from '@src/tracking/LegacyEventTracking/createViewportInfo';
import { mapCloseEvent } from '@src/tracking/LegacyEventTracking/mapCloseEvent';
import { mapNotShownEvent } from '@src/tracking/LegacyEventTracking/mapNotShownEvent';
import { TrackingEventConverterFactory } from '@src/tracking/LegacyTrackerWPORG';
import { WMDESizeIssueEvent } from '@src/tracking/WPORG/WMDEBannerSizeIssue';
import { WMDELegacyBannerEvent } from '@src/tracking/WPORG/WMDELegacyBannerEvent';

export default new Map<string, TrackingEventConverterFactory>( [
	[ NotShownEvent.EVENT_NAME, mapNotShownEvent ],
	[ CloseEvent.EVENT_NAME, mapCloseEvent ],
	[
		BannerSubmitEvent.EVENT_NAME,
		( e: BannerSubmitEvent ): WMDESizeIssueEvent => {
			return new WMDESizeIssueEvent( `submit-${e.userChoice}`, createViewportInfo(), 1 );
		}
	],
	[
		ThankYouModalShownEvent.EVENT_NAME,
		( e: ThankYouModalShownEvent ): WMDELegacyBannerEvent => new WMDELegacyBannerEvent( e.eventName, 1 )
	]
] );
