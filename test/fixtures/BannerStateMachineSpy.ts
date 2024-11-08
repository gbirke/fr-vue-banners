import { BannerStateMachine } from '@src/components/BannerConductor/StateMachine/BannerStateMachine';
import { BannerStates } from '@src/components/BannerConductor/StateMachine/BannerStates';
import { BannerState } from '@src/components/BannerConductor/StateMachine/states/BannerState';

export class BannerStateMachineSpy extends BannerStateMachine {
	public statesCalled: BannerStates[] = [];

	public async changeState( state: BannerState ): Promise<any> {
		this.statesCalled.push( state.stateName );
		return super.changeState( state );
	}
}
