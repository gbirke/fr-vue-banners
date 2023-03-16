import { Page } from '@src/page/Page';
import WPDE from '@src/page/skin/WPDE';
import { Skin } from '@src/page/skin/Skin';

class PageDe implements Page {
	skin: Skin = new WPDE();

	getBannerContainer() {
		return '#WMDE-Banner-Container';
	}

	shouldShowBanner(): boolean {
		return true;
	}

	trackEvent(): void {
	}

	trackSizeIssue(): void {
	}

	onPageEventThatShouldHideBanner( hideBannerListener: () => void ): void {
	}

	setSpace(): Page {
		return this;
	}

	setAnimated(): Page {
		return this;
	}

	unsetAnimated(): Page {
		return this;
	}

	setTransitionDuration(): Page {
		return this;
	}

	showBanner(): Page {
		return this;
	}
}

export default PageDe;