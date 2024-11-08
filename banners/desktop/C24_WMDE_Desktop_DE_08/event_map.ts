import { AlreadyDonatedShownEvent } from '@src/tracking/events/AlreadyDonatedShownEvent';
import { BannerSubmitEvent } from '@src/tracking/events/BannerSubmitEvent';
import { BannerSubmitOnReturnEvent } from '@src/tracking/events/BannerSubmitOnReturnEvent';
import { CloseEvent } from '@src/tracking/events/CloseEvent';
import { CustomAmountChangedEvent } from '@src/tracking/events/CustomAmountChangedEvent';
import { FallbackBannerSubmitEvent } from '@src/tracking/events/FallbackBannerSubmitEvent';
import { FormStepShownEvent } from '@src/tracking/events/FormStepShownEvent';
import { NotShownEvent } from '@src/tracking/events/NotShownEvent';
import { ShownEvent } from '@src/tracking/events/ShownEvent';
import { createViewportInfo } from '@src/tracking/LegacyEventTracking/createViewportInfo';
import { mapCloseEvent } from '@src/tracking/LegacyEventTracking/mapCloseEvent';
import { mapFormStepShownEvent } from '@src/tracking/LegacyEventTracking/mapFormStepShownEvent';
import { mapNotShownEvent } from '@src/tracking/LegacyEventTracking/mapNotShownEvent';
import { mapShownEvent } from '@src/tracking/LegacyEventTracking/mapShownEvent';
import { TrackingEventConverterFactory } from '@src/tracking/LegacyTrackerWPORG';
import { WMDESizeIssueEvent } from '@src/tracking/WPORG/WMDEBannerSizeIssue';
import { WMDELegacyBannerEvent } from '@src/tracking/WPORG/WMDELegacyBannerEvent';

export default new Map<string, TrackingEventConverterFactory>( [
	[ ShownEvent.EVENT_NAME, mapShownEvent ],
	[ CloseEvent.EVENT_NAME, mapCloseEvent ],
	[ FormStepShownEvent.EVENT_NAME, mapFormStepShownEvent ],
	[ CustomAmountChangedEvent.EVENT_NAME,
		( e: CustomAmountChangedEvent ): WMDELegacyBannerEvent =>
			new WMDELegacyBannerEvent( e.userChoice + '-amount', 1 )
	],
	[ AlreadyDonatedShownEvent.EVENT_NAME, ( e: AlreadyDonatedShownEvent ): WMDELegacyBannerEvent => new WMDELegacyBannerEvent( e.eventName, 1 ) ],
	[ NotShownEvent.EVENT_NAME, mapNotShownEvent ],
	[ BannerSubmitEvent.EVENT_NAME, ( e: BannerSubmitEvent ): WMDESizeIssueEvent => {
		switch ( e.feature ) {
			case 'UpgradeToYearlyForm':
				return new WMDESizeIssueEvent( `submit-${e.userChoice}`, createViewportInfo(), 1 );
			case 'UpgradeToMonthlyForm':
				return new WMDESizeIssueEvent( `submit-${e.userChoice}`, createViewportInfo(), 1 );
			default:
				return new WMDESizeIssueEvent( `submit`, createViewportInfo(), 1 );
		}
	} ],
	[ FallbackBannerSubmitEvent.EVENT_NAME,
		( e: FallbackBannerSubmitEvent ): WMDESizeIssueEvent =>
			new WMDESizeIssueEvent( e.eventName, createViewportInfo(), 1 )
	],
	[ BannerSubmitOnReturnEvent.EVENT_NAME,
		( e: BannerSubmitOnReturnEvent ): WMDELegacyBannerEvent =>
			new WMDELegacyBannerEvent( e.eventName + ( e.userChoice !== '' ? `-${e.userChoice}` : '' ), 1 )
	]
] );
