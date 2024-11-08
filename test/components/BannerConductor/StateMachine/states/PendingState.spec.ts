import { beforeEach, describe, expect, it, vitest } from 'vitest';
import { PendingState } from '@src/components/BannerConductor/StateMachine/states/PendingState';
import { Page } from '@src/page/Page';
import { TimerSpy } from '@test/fixtures/TimerSpy';
import { TimerStub } from '@test/fixtures/TimerStub';

describe( 'PendingState', function () {
	let page: Page;

	beforeEach( () => {
		page = { setSpace: vitest.fn() } as unknown as Page;
	} );

	it( 'sets banner height on enter', async () => {
		const pendingState = new PendingState( page, 60, 1, new TimerStub() );

		await pendingState.enter();

		expect( page.setSpace ).toHaveBeenCalledOnce();
		expect( page.setSpace ).toHaveBeenCalledWith( 60 );
	} );

	it( 'starts delay timeout on enter', async () => {
		const timerSpy = new TimerSpy();

		const pendingState = new PendingState( page, 60, 1, timerSpy );

		await pendingState.enter();

		expect( timerSpy.setTimeoutCalls.length ).toStrictEqual( 1 );
		expect( timerSpy.setTimeoutCalls[ 0 ] ).toStrictEqual( 1 );
	} );

	it( 'stops delay timeout on exit', async () => {
		const timerSpy = new TimerSpy();
		const pendingState = new PendingState( page, 60, 1, timerSpy );

		await pendingState.enter();
		await pendingState.exit();

		expect( timerSpy.clearTimeoutIds.length ).toStrictEqual( 1 );
		expect( timerSpy.clearTimeoutIds[ 0 ] ).toStrictEqual( 0 );
	} );

	it( 'sets banner size on resize', () => {
		const pendingState = new PendingState( page, 60, 1, new TimerStub() );

		pendingState.onResize( 42 );

		expect( page.setSpace ).toHaveBeenCalledOnce();
		expect( page.setSpace ).toHaveBeenCalledWith( 42 );
	} );
} );
