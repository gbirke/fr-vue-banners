import { mount, VueWrapper } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';
import KeenSlider from '@src/components/Slider/KeenSlider.vue';
import { Timer } from '@src/utils/Timer';
import { TimerSpy } from '@test/fixtures/TimerSpy';
import { TimerStub } from '@test/fixtures/TimerStub';

describe( 'KeenSlider', () => {

	beforeEach( () => {
		vi.useFakeTimers();
	} );

	afterEach( () => {
		vi.restoreAllMocks();
		vi.useRealTimers();
	} );

	const getWrapper = ( timer: Timer = null ): VueWrapper<any> => {
		return mount( KeenSlider, {
			props: {
				withNavigation: true,
				play: false,
				interval: 200
			},
			slots: {
				slides: `<template #slides="{ currentSlide }">
					<div class="wmde-banner-slide keen-slider__slide">
						<div class="wmde-banner-slide-content keen-slider__slide-content" :class="{ 'wmde-banner-slide--current': currentSlide === 0 }">First Slide</div>
					</div>
					<div class="wmde-banner-slide keen-slider__slide">
						<div class="wmde-banner-slide-content keen-slider__slide-content" :class="{ 'wmde-banner-slide--current': currentSlide === 1 }">Second Slide</div>
					</div>
				</template>`
			},
			global: {
				provide: {
					timer: timer ?? new TimerStub()
				}
			}
		} );
	};

	it( 'should mark the first slide as the current slide on initialization', () => {
		const wrapper = getWrapper();

		const firstSlideContent = wrapper.find( '.wmde-banner-slide-content' );

		expect( firstSlideContent.attributes().class ).toContain( 'wmde-banner-slide--current' );
	} );

	it( 'should advance the slides after the interval when the slider has started', async () => {
		const timerSpy = new TimerSpy();
		timerSpy.setTimeout = ( fn: () => void ): number => {
			fn();
			return 0;
		};

		const wrapper = getWrapper( timerSpy );
		await wrapper.setProps( { play: true } );

		expect( timerSpy.setIntervalCalls.length ).toStrictEqual( 1 );
		expect( timerSpy.setIntervalCalls[ 0 ] ).toStrictEqual( 200 );
	} );

	/**
	 * We can't test this as it requires an internal function in Keen that waits for the slide animation
	 * which seems to take a very long time in the test environment.
	 */
	it.skip( 'should emit when the slide changes', async () => {
		const wrapper = getWrapper();
		await wrapper.setProps( { play: true } );

		await wrapper.find( '.wmde-banner-slider-navigation-next' ).trigger( 'click' );

		expect( wrapper.emitted( 'slide-changed' ).length ).toBe( 1 );
		expect( wrapper.emitted( 'slide-changed' )[ 0 ][ 0 ] ).toBe( 1 );
	} );

	it( 'should start after a delay if one is passed', async () => {
		const timerSpy = new TimerSpy();
		const wrapper = getWrapper( timerSpy );

		await wrapper.setProps( { startDelay: 100 } );
		await wrapper.setProps( { play: true } );

		expect( timerSpy.setTimeoutCalls.length ).toStrictEqual( 1 );
		expect( timerSpy.setTimeoutCalls[ 0 ] ).toStrictEqual( 100 );
	} );

	it( 'should show a pagination dot for each exising slide', async () => {
		const wrapper = getWrapper();

		await nextTick();
		const paginationElements = wrapper.findAll( '.wmde-banner-slider-pagination-dot' );

		expect( paginationElements.length ).toBe( 2 );
		expect( paginationElements[ 0 ].attributes().class ).toContain( 'is-active' );
	} );

	it( 'should render navigation', async function () {
		const wrapper = getWrapper();

		await wrapper.setProps( { withNavigation: false } );

		expect( wrapper.find( '.wmde-banner-slider-navigation-previous' ).exists() ).toBe( false );
		expect( wrapper.find( '.wmde-banner-slider-navigation-next' ).exists() ).toBe( false );

		await wrapper.setProps( { withNavigation: true } );

		expect( wrapper.find( '.wmde-banner-slider-navigation-previous' ).exists() ).toBe( true );
		expect( wrapper.find( '.wmde-banner-slider-navigation-next' ).exists() ).toBe( true );
	} );

	it( 'should render pagination', async function () {
		const wrapper = getWrapper();

		await wrapper.setProps( { withPagination: false } );

		expect( wrapper.find( '.wmde-banner-slider-pagination' ).exists() ).toBeFalsy();

		await wrapper.setProps( { withPagination: true } );

		expect( wrapper.find( '.wmde-banner-slider-pagination' ).exists() ).toBeTruthy();
	} );

	it( 'should stop the auto play when the slider is clicked', async () => {
		const wrapper = getWrapper();

		await wrapper.find( '.wmde-banner-slider-container' ).trigger( 'mousedown' );

		expect( wrapper.find( '.wmde-banner-slider--stopped' ).exists() ).toBeTruthy();
	} );

	it( 'should stop the auto play when the slider is touched', async () => {
		const wrapper = getWrapper();
		await wrapper.setProps( { play: true } );

		await wrapper.find( '.wmde-banner-slider-container' ).trigger( 'touchstart' );

		expect( wrapper.find( '.wmde-banner-slider--stopped' ).exists() ).toBeTruthy();
	} );

	it( 'should stop the auto play when a pagination dot is clicked', async () => {
		const wrapper = getWrapper();
		await wrapper.setProps( { play: true } );

		await wrapper.find( '.wmde-banner-slider-pagination button:nth-child(2)' ).trigger( 'click' );

		expect( wrapper.find( '.wmde-banner-slider--stopped' ).exists() ).toBeTruthy();
	} );

	it( 'should stop the auto play when previous is clicked', async () => {
		const wrapper = getWrapper();
		await wrapper.setProps( { play: true } );

		await wrapper.find( '.wmde-banner-slider-navigation-previous' ).trigger( 'click' );

		expect( wrapper.find( '.wmde-banner-slider--stopped' ).exists() ).toBeTruthy();
	} );

	it( 'should stop the auto play when next is clicked', async () => {
		const wrapper = getWrapper();
		await wrapper.setProps( { play: true } );

		await wrapper.find( '.wmde-banner-slider-navigation-next' ).trigger( 'click' );

		expect( wrapper.find( '.wmde-banner-slider--stopped' ).exists() ).toBeTruthy();
	} );
} );
