import { beforeEach, describe, expect, it, vitest } from 'vitest';
import { ShowingState } from '@src/components/BannerConductor/StateMachine/states/ShowingState';
import { Page } from '@src/page/Page';
import { PageStub } from '@test/fixtures/PageStub';
import { TimerSpy } from '@test/fixtures/TimerSpy';
import { TimerStub } from '@test/fixtures/TimerStub';

describe( 'ShowingState', function () {
	let page: Page;

	beforeEach( () => {
		page = new PageStub();
		page.setSpace = vitest.fn().mockReturnValue( page );
		page.setAnimated = vitest.fn().mockReturnValue( page );
		page.setTransitionDuration = vitest.fn().mockReturnValue( page );
		page.showBanner = vitest.fn();
	} );

	it( 'shows banner on enter', async () => {
		const showingState = new ShowingState( page, 1, new TimerStub() );

		await showingState.enter();

		expect( page.setAnimated ).toHaveBeenCalledOnce();
		expect( page.setTransitionDuration ).toHaveBeenCalledOnce();
		expect( page.setTransitionDuration ).toHaveBeenCalledWith( 1 );
		expect( page.showBanner ).toHaveBeenCalledOnce();
	} );

	it( 'starts transitionDuration timeout on enter', async () => {
		const timerSpy = new TimerSpy();

		const showingState = new ShowingState( page, 1, timerSpy );

		await showingState.enter();

		expect( timerSpy.setTimeoutCalls.length ).toStrictEqual( 1 );
		expect( timerSpy.setTimeoutCalls[ 0 ] ).toStrictEqual( 1 );
	} );

	it( 'stops delay timeout on exit', async () => {
		const timerSpy = new TimerSpy();
		const showingState = new ShowingState( page, 1, timerSpy );

		await showingState.enter();
		await showingState.exit();

		expect( timerSpy.clearTimeoutIds.length ).toStrictEqual( 1 );
		expect( timerSpy.clearTimeoutIds[ 0 ] ).toStrictEqual( 0 );
	} );

	it( 'sets banner size on resize', () => {
		const showingState = new ShowingState( page, 1, new TimerStub() );

		showingState.onResize( 42 );

		expect( page.setSpace ).toHaveBeenCalledOnce();
		expect( page.setSpace ).toHaveBeenCalledWith( 42 );
	} );

	it( 'sets banner size on content changed', () => {
		const showingState = new ShowingState( page, 1, new TimerStub() );

		showingState.onContentChanged( 42 );

		expect( page.setSpace ).toHaveBeenCalledOnce();
		expect( page.setSpace ).toHaveBeenCalledWith( 42 );
	} );
} );
