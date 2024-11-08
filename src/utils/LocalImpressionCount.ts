import { ImpressionCount } from '@src/utils/ImpressionCount';
import { RuntimeEnvironment } from '@src/utils/RuntimeEnvironment';
import hasLocalStorage from './hasLocalStorage';

export class LocalImpressionCount implements ImpressionCount {
	private readonly _bannerName: string;
	private _overallCount: number;
	private _bannerCount: number;
	private _runtimeEnvironment: RuntimeEnvironment;

	public constructor( bannerName: string, runtimeEnvironment: RuntimeEnvironment ) {
		this._bannerName = bannerName;
		this._overallCount = 0;
		this._bannerCount = 0;
		this._runtimeEnvironment = runtimeEnvironment;

		if ( !hasLocalStorage() ) {
			return;
		}

		let overallCount = this.getItem( 'fundraising.overallCount', '0' );
		// This is a fix for a local storage issue where NaN was being stored
		// and once it was in there it would remain NaN forever and always
		if ( isNaN( parseInt( overallCount ) ) ) {
			overallCount = '0';
		}
		this._overallCount = parseInt( overallCount, 10 );
		const bannerCount = this.getItem( 'fundraising.bannerCount', '0' ) || '';
		if ( bannerCount.indexOf( '|' ) === -1 ) {
			return;
		}
		const [ lastSeenBannerName, lastBannerCount ] = bannerCount.split( '|', 2 );
		if ( lastSeenBannerName === bannerName ) {
			this._bannerCount = parseInt( lastBannerCount, 10 );
		}
	}

	private getItem( name: string, defaultValue: string ): string {
		try {
			return window.localStorage.getItem( name ) || defaultValue;
		} catch {
			return defaultValue;
		}
	}

	public incrementImpressionCounts(): void {
		this._overallCount++;
		this._bannerCount++;

		if ( !hasLocalStorage() ) {
			return;
		}

		try {
			window.localStorage.setItem( 'fundraising.overallCount', this._overallCount.toFixed( 0 ) );
			window.localStorage.setItem( 'fundraising.bannerCount', this._bannerName + '|' + this._bannerCount );
		} catch {
			// Don't throw localStorage exceptions
		}
	}

	public get bannerCount(): number {
		return this._bannerCount;
	}

	public get overallCount(): number {
		return this._overallCount;
	}

	public get bannerCountIncremented(): number {
		return this._bannerCount + 1;
	}

	public get overallCountIncremented(): number {
		return this._overallCount + 1;
	}

	public getRemainingImpressions( maxImpressions: number ): number {
		if ( this._runtimeEnvironment.isInDevMode ) {
			return maxImpressions;
		}
		return Math.max( 0, maxImpressions - this.overallCountIncremented );
	}
}
