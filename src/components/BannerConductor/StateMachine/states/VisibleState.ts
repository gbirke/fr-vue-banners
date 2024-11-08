import { BannerStates } from '@src/components/BannerConductor/StateMachine/BannerStates';
import { BannerState } from '@src/components/BannerConductor/StateMachine/states/BannerState';
import { Page } from '@src/page/Page';
import { ShownEvent } from '@src/tracking/events/ShownEvent';
import { Tracker } from '@src/tracking/Tracker';
import { TrackingFeatureName } from '@src/tracking/TrackingEvent';
import { ImpressionCount } from '@src/utils/ImpressionCount';

export class VisibleState extends BannerState {
	public readonly stateName: BannerStates = BannerStates.Visible;
	private readonly _shownEventFeature: TrackingFeatureName;
	private _page: Page;
	private _impressionCount: ImpressionCount;
	private _tracker: Tracker;

	public constructor( shownEventFeature: TrackingFeatureName, page: Page, impressionCount: ImpressionCount, tracker: Tracker ) {
		super();
		this._shownEventFeature = shownEventFeature;
		this._page = page;
		this._impressionCount = impressionCount;
		this._tracker = tracker;

		this.canMoveToStates.push( BannerStates.Closed );
	}

	public enter(): Promise<any> {
		this._tracker.trackEvent( new ShownEvent( this._shownEventFeature ) );
		this._impressionCount.incrementImpressionCounts();
		return Promise.resolve();
	}

	public exit(): Promise<any> {
		return Promise.resolve();
	}

	public onResize( space: number ): void {
		this._page.unsetAnimated().setSpace( space );
	}

	public onContentChanged( space: number ): void {
		this._page.unsetAnimated().setSpace( space );
	}
}
