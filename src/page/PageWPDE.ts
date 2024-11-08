import { getCampaignParameterOverride } from '@environment/CampaignParameterOverride';
import { CampaignParameters } from '@src/domain/CampaignParameters';
import { TrackingParameters } from '@src/domain/TrackingParameters';
import { Page } from '@src/page/Page';
import { BannerNotShownReasons } from './BannerNotShownReasons';

export const bannerHeightCssVariable = '--wmde-banner-height';
export const showBannerClass = 'wmde-show-banner';

export interface WpdeWindow extends Window {
	campaignParameters: CampaignParameters;
}

declare let window: WpdeWindow;

class PageWPDE implements Page {

	public constructor( private readonly trackingParams: TrackingParameters ) {
	}

	public getBannerContainer(): string {
		return '#WMDE-Banner-Container';
	}

	public shouldShowBanner(): boolean {
		return true;
	}

	public trackEvent(): void {
	}

	public trackSizeIssue(): void {
	}

	public onPageEventThatShouldHideBanner(): void {
	}

	public removePageEventListeners(): Page {
		return this;
	}

	public setSpace( space: number ): Page {
		document.body.style.setProperty( bannerHeightCssVariable, `${space}px` );
		return this;
	}

	public setAnimated(): Page {
		return this;
	}

	public unsetAnimated(): Page {
		return this;
	}

	public setTransitionDuration(): Page {
		return this;
	}

	public showBanner(): Page {
		document.body.classList.add( showBannerClass );
		return this;
	}

	public getReasonToNotShowBanner(): BannerNotShownReasons | null {
		return null;
	}

	public preventImpressionCountForHiddenBanner: () => Page;

	public setCloseCookieIfNecessary(): Page {
		// our WPDE banner server does not have the "close cookie" feature
		return this;
	}

	public getCampaignParameters(): CampaignParameters {
		if ( !window.campaignParameters ) {
			throw new Error( 'Campaign parameters are not set globally' );
		}

		return getCampaignParameterOverride( window.campaignParameters );
	}

	public getTracking(): TrackingParameters {
		return this.trackingParams;
	}

	public getMaxBannerImpressions(): number {
		// WPDE banners have a hardcoded limit of 7
		return 7;
	}

	public setModalOpened(): void {
	}

	public setModalClosed(): void {
	}
}

export default PageWPDE;
