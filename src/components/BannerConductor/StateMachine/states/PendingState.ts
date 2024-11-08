import { BannerStates } from '@src/components/BannerConductor/StateMachine/BannerStates';
import { BannerState } from '@src/components/BannerConductor/StateMachine/states/BannerState';
import { Page } from '@src/page/Page';
import { Timer } from '@src/utils/Timer';

export class PendingState extends BannerState {
	public readonly stateName: BannerStates = BannerStates.Pending;
	private _timer: Timer;
	private _timerId: number;
	private _page: Page;
	private readonly _bannerHeight: number;
	private readonly _delay: number;

	public constructor( page: Page, bannerHeight: number, delay: number, timer: Timer ) {
		super();

		this._page = page;
		this._bannerHeight = bannerHeight;
		this._delay = delay;
		this._timer = timer;

		this.canMoveToStates.push( BannerStates.Showing );
		this.canMoveToStates.push( BannerStates.Closed );
		this.canMoveToStates.push( BannerStates.NotShown );
	}

	public enter(): Promise<any> {
		this._page.setSpace( this._bannerHeight );

		return new Promise( ( resolve ) => {
			this._timerId = this._timer.setTimeout( () => resolve( true ), this._delay );
		} );
	}

	public exit(): Promise<any> {
		this._timer.clearTimeout( this._timerId );
		return Promise.resolve();
	}

	public onResize( space: number ): void {
		this._page.setSpace( space );
	}
}
