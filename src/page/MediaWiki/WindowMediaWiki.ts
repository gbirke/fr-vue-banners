import { BannerEvent } from '@src/page/MediaWiki/BannerEvent';
import { createImageCookieSetter } from '@src/page/MediaWiki/createImageCookieSetter';
import { LegacyBannerEvent } from '@src/page/MediaWiki/LegacyBannerEvent';
import { MediaWiki } from '@src/page/MediaWiki/MediaWiki';
import { setCookie } from '@src/page/MediaWiki/setCookie';
import { SizeIssue } from '@src/page/MediaWiki/SizeIssue';

interface MediaWikiTools {
	config: { get: ( item: string ) => any };
	track: ( name: string, trackingData: BannerEvent|LegacyBannerEvent|SizeIssue ) => void;
	centralNotice: { setBannerLoadedButHidden: () => void };
}

interface MwWindow extends Window {
	mw: MediaWikiTools;
}

declare let window: MwWindow;

export class WindowMediaWiki implements MediaWiki {
	public getConfigItem( name: string ): any {
		return window.mw.config.get( name );
	}

	public isContentHiddenByLightbox(): boolean {
		// mw-mvv-lightbox-open is the CSS class name of the overlay on desktop
		// media-viewer is the CSS class name of the overlay on mobile
		return document.getElementsByClassName( 'mw-mmv-lightbox-open' ).length > 0 ||
			document.getElementsByClassName( 'media-viewer' ).length > 0;
	}

	public isInArticleNamespace(): boolean {
		const namespaceNumber = this.getConfigItem( 'wgNamespaceNumber' );
		const pageName = this.getConfigItem( 'wgRelevantPageName' );

		if ( namespaceNumber === 0 ) {
			return true;
		}

		// dewiki main page is in nameSpace 4, and we show banners there
		if ( namespaceNumber === 4 && pageName === 'Wikipedia:Hauptseite' ) {
			return true;
		}

		return false;
	}

	public isShowingContentPage(): boolean {
		return this.getConfigItem( 'wgAction' ) === 'view';
	}

	public track( name: string, trackingData: LegacyBannerEvent | SizeIssue ): void {
		window.mw.track( name, trackingData );
	}

	public preventBannerDisplayForPeriod(): void {
		this.hideBanner( 'close', this.getConfigItem( 'wgNoticeCookieDurations' ).close );
	}

	public preventBannerDisplayUntilEndOfCampaign(): void {
		const endOfYear = new Date( new Date().getFullYear(), 11, 31, 23, 59, 59 );
		const secondsToEndOfYear = Math.abs( ( endOfYear.getTime() - Date.now() ) / 1000 );
		this.hideBanner( 'donate', secondsToEndOfYear );
	}

	public preventBannerDisplayForHours( hours: number ): void {
		const until = new Date();
		until.setHours( until.getHours() + hours );
		const secondsToHideBannerFor = Math.abs( ( until.getTime() - Date.now() ) / 1000 );
		this.hideBanner( 'donate', secondsToHideBannerFor );
	}

	public setBannerLoadedButHidden(): void {
		window.mw.centralNotice.setBannerLoadedButHidden();
	}

	private hideBanner( reason: string, durationInSeconds: number ): void {
		setCookie( reason, new Date(), durationInSeconds );
		createImageCookieSetter( reason, durationInSeconds, this.getConfigItem( 'wgNoticeHideUrls' )[ 0 ] );
	}
}
