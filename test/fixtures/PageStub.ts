import { CampaignParameters } from '@src/domain/CampaignParameters';
import { TrackingParameters } from '@src/domain/TrackingParameters';
import { BannerNotShownReasons } from '@src/page/BannerNotShownReasons';
import { Page } from '@src/page/Page';

export class PageStub implements Page {
	public hideBannerCallback: () => void;

	public getBannerContainer(): string {
		return '';
	}

	public getReasonToNotShowBanner(): BannerNotShownReasons|null {
		return null;
	}

	public preventImpressionCountForHiddenBanner(): Page {
		return this;
	}

	public onPageEventThatShouldHideBanner( hideBannerListener: () => void ): void {
		this.hideBannerCallback = hideBannerListener;
	}

	public removePageEventListeners(): Page {
		return this;
	}

	public setAnimated(): Page {
		return this;
	}

	public setSpace(): Page {
		return this;
	}

	public setTransitionDuration(): Page {
		return this;
	}

	public showBanner(): Page {
		return this;
	}

	public unsetAnimated(): Page {
		return this;
	}

	public setCloseCookieIfNecessary(): Page {
		return this;
	}

	public trackEvent(): void {
	}

	public getCampaignParameters(): CampaignParameters {
		return {
			campaignProjection: {
				averageAmountPerDonation: 0,
				updatedAt: '',
				donationSumBase: 0,
				donationAmountPerMinute: 0,
				donationCountBase: 0,
				donationCountPerMinute: 0,
				donationTarget: 0
			},
			endDate: '',
			millionImpressionsPerDay: 0,
			numberOfMembers: 0,
			startDate: '',
			isLateProgress: false,
			thankYouCampaign: {
				progressBarPercentage: 0,
				numberOfDonors: 0
			}
		};
	}

	public getTracking(): TrackingParameters {
		return {
			campaign: 'funny-campaign',
			keyword: 'tracking-keyword-ctrl'
		};
	}

	public getMaxBannerImpressions(): number {
		return 10;
	}

	public setModalOpened(): void {
	}

	public setModalClosed(): void {
	}

}
