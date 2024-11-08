import { BannerSubmitEvent } from '@src/tracking/events/BannerSubmitEvent';
import { CloseEvent } from '@src/tracking/events/CloseEvent';
import { FormStepShownEvent } from '@src/tracking/events/FormStepShownEvent';
import { MobileMiniBannerExpandedEvent } from '@src/tracking/events/MobileMiniBannerExpandedEvent';
import { NotShownEvent } from '@src/tracking/events/NotShownEvent';
import { createViewportInfo } from '@src/tracking/LegacyEventTracking/createViewportInfo';
import { mapCloseEvent } from '@src/tracking/LegacyEventTracking/mapCloseEvent';
import { mapFormStepShownEvent } from '@src/tracking/LegacyEventTracking/mapFormStepShownEvent';
import { mapNotShownEvent } from '@src/tracking/LegacyEventTracking/mapNotShownEvent';
import { TrackingEventConverterFactory } from '@src/tracking/LegacyTrackerWPORG';
import { WMDESizeIssueEvent } from '@src/tracking/WPORG/WMDEBannerSizeIssue';
import { WMDELegacyBannerEvent } from '@src/tracking/WPORG/WMDELegacyBannerEvent';

export default new Map<string, TrackingEventConverterFactory>( [
	[ CloseEvent.EVENT_NAME, mapCloseEvent ],
	[ MobileMiniBannerExpandedEvent.EVENT_NAME,
		( e: MobileMiniBannerExpandedEvent ): WMDELegacyBannerEvent => new WMDELegacyBannerEvent( e.eventName + ( e.userChoice !== '' ? `-${e.userChoice}` : '' ), 1 ) ],
	[ FormStepShownEvent.EVENT_NAME, mapFormStepShownEvent ],
	[ NotShownEvent.EVENT_NAME, mapNotShownEvent ],

	[ BannerSubmitEvent.EVENT_NAME, ( e: BannerSubmitEvent ): WMDESizeIssueEvent => {
		switch ( e.feature ) {
			case 'MiniBanner':
			case 'UpgradeToYearlyForm':
				return new WMDESizeIssueEvent( `submit-${e.userChoice}`, createViewportInfo(), 1 );
			default:
				return new WMDESizeIssueEvent( `submit`, createViewportInfo(), 1 );
		}
	} ]
] );
