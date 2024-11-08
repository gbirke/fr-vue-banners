import { beforeEach, describe, expect, it, vitest } from 'vitest';
import { VisibleState } from '@src/components/BannerConductor/StateMachine/states/VisibleState';
import { ShownEvent } from '@src/tracking/events/ShownEvent';
import { Tracker } from '@src/tracking/Tracker';
import { ImpressionCountStub } from '@test/fixtures/ImpressionCountStub';
import { PageStub } from '@test/fixtures/PageStub';

describe( 'VisibleState', function () {
	let tracker: Tracker;

	beforeEach( () => {
		tracker = { trackEvent: vitest.fn() };
	} );

	it( 'sets banner size on resize', () => {
		const page = new PageStub();
		page.setSpace = vitest.fn( () => page );
		const visibleState = new VisibleState( 'Page', page, new ImpressionCountStub(), tracker );

		visibleState.onResize( 42 );

		expect( page.setSpace ).toHaveBeenCalledOnce();
		expect( page.setSpace ).toHaveBeenCalledWith( 42 );
	} );

	it( 'sets banner size on content change', () => {
		const page = new PageStub();
		page.setSpace = vitest.fn( () => page );
		const visibleState = new VisibleState( 'Page', page, new ImpressionCountStub(), tracker );

		visibleState.onContentChanged( 42 );

		expect( page.setSpace ).toHaveBeenCalledOnce();
		expect( page.setSpace ).toHaveBeenCalledWith( 42 );
	} );

	it( 'fires shown event on enter', async () => {
		const visibleState = new VisibleState( 'Page', new PageStub(), new ImpressionCountStub(), tracker );
		const shownEvent = new ShownEvent( 'Page' );

		await visibleState.enter();

		expect( tracker.trackEvent ).toHaveBeenCalledOnce();
		expect( tracker.trackEvent ).toHaveBeenCalledWith( shownEvent );
	} );

	it( 'increases banner impression count on enter', async () => {
		const impressionCountStub = new ImpressionCountStub();
		impressionCountStub.incrementImpressionCounts = vitest.fn();
		const visibleState = new VisibleState( 'Page', new PageStub(), impressionCountStub, tracker );

		await visibleState.enter();

		expect( impressionCountStub.incrementImpressionCounts ).toHaveBeenCalledOnce();
	} );
} );
