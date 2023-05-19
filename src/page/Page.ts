import { CampaignParameters } from '@src/domain/CampaignParameters';
import { BannerNotShownReasons } from '@src/page/BannerNotShownReasons';
import { Vector2 } from '@src/utils/Vector2';
import { TrackingParameters } from '@src/domain/TrackingParameters';
import { TrackingEvent } from '@src/tracking/TrackingEvent';

export interface Page {
	getReasonToNotShowBanner: ( bannerDimensions: Vector2 ) => BannerNotShownReasons|null;
	getBannerContainer: () => string;
	onPageEventThatShouldHideBanner: ( hideBannerListener: () => void ) => void;
	removePageEventListeners: () => Page;
	setSpace: ( space: number ) => Page;
	setTransitionDuration: ( duration: number ) => Page;
	setAnimated: () => Page;
	unsetAnimated: () => Page;
	showBanner: () => Page;
	preventImpressionCountForHiddenBanner: () => Page;
	setCloseCookieIfNecessary: ( closeEvent: TrackingEvent ) => Page;
	getCampaignParameters: () => CampaignParameters;
	getTracking: () => TrackingParameters;
}
