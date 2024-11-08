import { ShownEvent } from '@src/tracking/events/ShownEvent';
import { createViewportInfo } from '@src/tracking/LegacyEventTracking/createViewportInfo';
import { WMDESizeIssueEvent } from '@src/tracking/WPORG/WMDEBannerSizeIssue';
import { WMDELegacyBannerEvent } from '@src/tracking/WPORG/WMDELegacyBannerEvent';

export function mapShownEvent( shownEvent: ShownEvent ): WMDESizeIssueEvent|WMDELegacyBannerEvent {
	if ( shownEvent.feature === 'FallbackBanner' ) {
		return new WMDESizeIssueEvent( `fallback-banner-shown`, createViewportInfo(), 1 );
	}

	// We don't track other "shown" events, hence the trackingRate of 0
	return new WMDELegacyBannerEvent( 'untracked-shown-event', 0 );
}
