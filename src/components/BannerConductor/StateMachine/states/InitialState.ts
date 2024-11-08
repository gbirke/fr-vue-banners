import { BannerStates } from '@src/components/BannerConductor/StateMachine/BannerStates';
import { BannerState } from '@src/components/BannerConductor/StateMachine/states/BannerState';

export class InitialState extends BannerState {
	public readonly stateName: BannerStates = BannerStates.Initial;

	public constructor() {
		super();

		this.canMoveToStates.push( BannerStates.Pending );
	}

	public enter(): Promise<any> {
		return Promise.resolve( true );
	}
	public exit(): Promise<any> {
		return Promise.resolve( true );
	}

}
