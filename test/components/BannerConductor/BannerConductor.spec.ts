import { mount, VueWrapper } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { defineComponent, markRaw, nextTick } from 'vue';
import BannerConductor from '@src/components/BannerConductor/BannerConductor.vue';
import { newBannerStateMachine } from '@src/components/BannerConductor/StateMachine/BannerStateMachine';
import { BannerStates } from '@src/components/BannerConductor/StateMachine/BannerStates';
import { BannerState } from '@src/components/BannerConductor/StateMachine/states/BannerState';
import { ReactiveProperty } from '@src/domain/StateMachine/ReactiveProperty';
import { BannerNotShownReasons } from '@src/page/BannerNotShownReasons';
import { Page } from '@src/page/Page';
import { CloseEvent } from '@src/tracking/events/CloseEvent';
import { ResizeHandler } from '@src/utils/ResizeHandler';
import { BannerStateMachineSpy } from '@test/fixtures/BannerStateMachineSpy';
import { ImpressionCountStub } from '@test/fixtures/ImpressionCountStub';
import { PageStub } from '@test/fixtures/PageStub';
import { ResizeHandlerStub } from '@test/fixtures/ResizeHandlerStub';
import { TimerStub } from '@test/fixtures/TimerStub';
import { TrackerStub } from '@test/fixtures/TrackerStub';

vi.mock( '@src/components/BannerConductor/StateMachine/BannerStateMachine', async () => {
	const actual = await vi.importActual( '@src/components/BannerConductor/StateMachine/BannerStateMachine' );
	return {
		// @ts-ignore
		...actual,
		newBannerStateMachine: vi.fn()
	};
} );

describe( 'BannerConductor.vue', () => {

	let stateMachineSpy: BannerStateMachineSpy;

	async function getShownBannerWrapper( page: Page|null = null, resizeHandler: ResizeHandler|null = null ): Promise<VueWrapper<any>> {
		const banner = defineComponent( {
			props: {
				bannerState: String
			},
			emits: [
				'bannerClosed',
				'bannerContentChanged',
				'modalOpened',
				'modalClosed'
			],
			methods: {
				onClose() {
					this.$emit( 'bannerClosed', new CloseEvent( 'MainBanner', 'closed' ) );
				}
			},
			template: `<div class="test-banner" style="height: 100px">
				Hello, world!
				<button class="emit-banner-closed" @click="onClose"></button>
				<button class="emit-banner-content-changed" @click="$emit( 'bannerContentChanged' )"></button>
				<button class="emit-banner-modal-open" @click="$emit( 'modalOpened' )"></button>
				<button class="emit-banner-modal-closed" @click="$emit( 'modalClosed' )"></button>
			</div>`
		} );
		const wrapper = mount( BannerConductor, {
			props: {
				page: page ?? new PageStub(),
				bannerConfig: { delay: 42, transitionDuration: 5 },
				resizeHandler: resizeHandler ?? new ResizeHandlerStub(),
				banner: markRaw( banner ),
				impressionCount: new ImpressionCountStub()
			},
			global: {
				provide: {
					tracker: new TrackerStub(),
					timer: new TimerStub()
				}
			}
		} );

		// We need to await a few times and run out timers because the banner display flow is asynchronous
		await nextTick();
		await nextTick();
		await nextTick();
		await vi.runAllTimersAsync();

		return Promise.resolve( wrapper );
	}

	beforeEach( () => {
		vi.mocked( newBannerStateMachine ).mockImplementation( ( stateRef: ReactiveProperty<BannerState> ) => {
			stateMachineSpy = new BannerStateMachineSpy( stateRef );
			return stateMachineSpy;
		} );
		vi.useFakeTimers();
	} );

	afterEach( () => {
		vi.restoreAllMocks();
	} );

	it( 'runs through correct state flow on mounted', async () => {
		const wrapper = await getShownBannerWrapper();

		expect( stateMachineSpy.statesCalled ).toEqual( [
			BannerStates.Pending,
			BannerStates.Showing,
			BannerStates.Visible
		] );

		expect( wrapper.classes() ).toContain( 'wmde-banner--visible' );
	} );

	it( 'runs through correct state flow on mounted when there is a reason to not show banner', async () => {
		const page = new PageStub();
		page.getReasonToNotShowBanner = vi.fn().mockReturnValue( BannerNotShownReasons.SizeIssue );

		const wrapper = await getShownBannerWrapper( page );

		expect( stateMachineSpy.statesCalled ).toEqual( [
			BannerStates.Pending,
			BannerStates.NotShown
		] );

		expect( wrapper.classes() ).toContain( BannerStates.NotShown );
	} );

	it( 'passes the banner height to the page on load', async () => {
		const page = new PageStub();
		page.setSpace = vi.fn();

		await getShownBannerWrapper( page );

		// This will be 0 because jsdom doesn't set this value
		expect( page.setSpace ).toHaveBeenCalledWith( 0 );
	} );

	it( 'shows the page animated with a transition duration', async () => {
		const page = new PageStub();
		page.setAnimated = vi.fn().mockReturnValue( page );
		page.setTransitionDuration = vi.fn().mockReturnValue( page );
		page.showBanner = vi.fn();

		await getShownBannerWrapper( page );

		expect( page.setAnimated ).toHaveBeenCalled();
		expect( page.setTransitionDuration ).toHaveBeenCalledWith( 5 );
		expect( page.showBanner ).toHaveBeenCalled();
	} );

	it( 'updates the page with a new height on window resize', async () => {
		const page = new PageStub();
		page.setSpace = vi.fn().mockReturnValue( page );
		const resizeHandler = new ResizeHandlerStub();
		const wrapper = await getShownBannerWrapper( page, resizeHandler );

		Object.defineProperty( wrapper.element, 'offsetHeight', { value: 100, writable: true, configurable: true } );
		resizeHandler.callOnResize();

		Object.defineProperty( wrapper.element, 'offsetHeight', { value: 42, writable: true, configurable: true } );
		resizeHandler.callOnResize();

		expect( page.setSpace ).toHaveBeenCalledTimes( 3 );
		expect( page.setSpace ).toHaveBeenCalledWith( 100 );
		expect( page.setSpace ).toHaveBeenCalledWith( 42 );
	} );

	it( 'updates the page with a new height on content change', async () => {
		const page = new PageStub();
		page.setSpace = vi.fn().mockReturnValue( page );
		const wrapper = await getShownBannerWrapper( page );

		Object.defineProperty( wrapper.element, 'offsetHeight', { value: 100, writable: true, configurable: true } );
		await wrapper.find( '.emit-banner-content-changed' ).trigger( 'click' );

		Object.defineProperty( wrapper.element, 'offsetHeight', { value: 42, writable: true, configurable: true } );
		await wrapper.find( '.emit-banner-content-changed' ).trigger( 'click' );

		expect( page.setSpace ).toHaveBeenCalledTimes( 3 );
		expect( page.setSpace ).toHaveBeenCalledWith( 100 );
		expect( page.setSpace ).toHaveBeenCalledWith( 42 );
	} );

	it( 'moves to closed state when donor closes banner', async () => {
		const wrapper = await getShownBannerWrapper();
		await wrapper.find( '.emit-banner-closed' ).trigger( 'click' );

		expect( stateMachineSpy.statesCalled ).toEqual( [
			BannerStates.Pending,
			BannerStates.Showing,
			BannerStates.Visible,
			BannerStates.Closed
		] );

		expect( wrapper.classes() ).toContain( BannerStates.Closed );
	} );

	it( 'asks the page to set the close cookie when the donor closes banner', async () => {
		const page = new PageStub();
		page.setCloseCookieIfNecessary = vi.fn().mockReturnValue( page );
		const wrapper = await getShownBannerWrapper( page );
		await wrapper.find( '.emit-banner-closed' ).trigger( 'click' );

		expect( page.setCloseCookieIfNecessary ).toHaveBeenCalledWith( new CloseEvent( 'MainBanner', 'closed' ) );
	} );

	it( 'moves to closed state when an page event that should hide the banner happens', async () => {
		const page = new PageStub();
		const wrapper = await getShownBannerWrapper( page );

		await page.hideBannerCallback();

		expect( stateMachineSpy.statesCalled ).toEqual( [
			BannerStates.Pending,
			BannerStates.Showing,
			BannerStates.Visible,
			BannerStates.Closed
		] );

		expect( wrapper.classes() ).toContain( BannerStates.Closed );
	} );

	it( 'tells the page that a modal was opened', async () => {
		const page = new PageStub();
		page.setModalOpened = vi.fn();
		const wrapper = await getShownBannerWrapper( page );

		await wrapper.find( '.emit-banner-modal-open' ).trigger( 'click' );

		expect( page.setModalOpened ).toHaveBeenCalledOnce();
	} );

	it( 'tells the page that a modal was closed', async () => {
		const page = new PageStub();
		page.setModalOpened = vi.fn();
		const wrapper = await getShownBannerWrapper( page );

		await wrapper.find( '.emit-banner-modal-open' ).trigger( 'click' );

		expect( page.setModalOpened ).toHaveBeenCalledOnce();
	} );
} );
