import { BannerSubmitEvent } from '@src/tracking/events/BannerSubmitEvent';
import { CloseEvent } from '@src/tracking/events/CloseEvent';
import { MobileMiniBannerExpandedEvent } from '@src/tracking/events/MobileMiniBannerExpandedEvent';
import { NotShownEvent } from '@src/tracking/events/NotShownEvent';
import { createViewportInfo } from '@src/tracking/LegacyEventTracking/createViewportInfo';
import { mapCloseEvent } from '@src/tracking/LegacyEventTracking/mapCloseEvent';
import { mapNotShownEvent } from '@src/tracking/LegacyEventTracking/mapNotShownEvent';
import { TrackingEventConverterFactory } from '@src/tracking/LegacyTrackerWPORG';
import { WMDESizeIssueEvent } from '@src/tracking/WPORG/WMDEBannerSizeIssue';
import { WMDELegacyBannerEvent } from '@src/tracking/WPORG/WMDELegacyBannerEvent';

export default new Map<string, TrackingEventConverterFactory>( [
	[ CloseEvent.EVENT_NAME, mapCloseEvent ],
	[ NotShownEvent.EVENT_NAME, mapNotShownEvent ],
	[ MobileMiniBannerExpandedEvent.EVENT_NAME,
		( e: MobileMiniBannerExpandedEvent ): WMDELegacyBannerEvent => new WMDELegacyBannerEvent( e.eventName + ( e.userChoice !== '' ? `-${e.userChoice}` : '' ), 1 ) ],
	[ BannerSubmitEvent.EVENT_NAME, (): WMDESizeIssueEvent => new WMDESizeIssueEvent( `submit`, createViewportInfo(), 1 ) ]
] );
