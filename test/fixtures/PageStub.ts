import { Page } from '@src/page/Page';
import { BannerNotShownReasons } from '@src/page/BannerNotShownReasons';
import { CampaignParameters } from '@src/CampaignParameters';

export class PageStub implements Page {
	public getBannerContainer(): string {
		return '';
	}

	public getReasonToNotShowBanner(): BannerNotShownReasons|null {
		return null;
	}

	public preventImpressionCountForHiddenBanner(): Page {
		return this;
	}

	public onPageEventThatShouldHideBanner(): void {
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
				baseDate: '',
				baseDonationSum: 0,
				donationAmountPerMinute: 0,
				donorsBase: 0,
				donorsPerMinute: 0,
				goalDonationSum: 0
			},
			endDate: '',
			millionImpressionsPerDay: 0,
			numberOfMembers: 0,
			startDate: ''
		};
	}

}
