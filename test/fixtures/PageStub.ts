import { Page } from '@src/page/Page';
import { BannerNotShownReasons } from '@src/page/BannerNotShownReasons';

export class PageStub implements Page {
	getBannerContainer(): string {
		return '';
	}

	getReasonToNotShowBanner(): BannerNotShownReasons|null {
		return null;
	}

	preventImpressionCountForHiddenBanner(): void {
	}

	onPageEventThatShouldHideBanner(): void {
	}

	removePageEventListeners(): void {
	}

	setAnimated(): Page {
		return this;
	}

	setSpace(): Page {
		return this;
	}

	setTransitionDuration(): Page {
		return this;
	}

	showBanner(): Page {
		return this;
	}

	unsetAnimated(): Page {
		return this;
	}

	setCloseCookieIfNecessary(): void {
	}

	trackEvent(): void {
	}

}
