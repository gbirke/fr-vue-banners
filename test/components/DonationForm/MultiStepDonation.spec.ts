import { mount, VueWrapper } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import MultiStepDonation from '@src/components/DonationForm/MultiStepDonation.vue';
import { StepController } from '@src/components/DonationForm/StepController';
import { PageScroller } from '@src/utils/PageScroller/PageScroller';
import { StepControllerSpy } from '@test/fixtures/StepControllerSpy';
import SubFormStub from '@test/fixtures/SubFormStub.vue';
import { TimerStub } from '@test/fixtures/TimerStub';
import { TrackerSpy } from '@test/fixtures/TrackerSpy';

const subFormEmitterTemplate = `<template #form-page-1="{ pageIndex, submit, previous }">
	<button
		class="emitting-sub-form"
		@submit="() => submit( { itsaMe: 'Mario' } )"
		@previous="() => previous()"
    />
</template>`;

describe( 'MultistepDonation.vue', () => {
	let pageScroller: PageScroller;
	let tracker: TrackerSpy;

	beforeEach( () => {
		pageScroller = {
			scrollIntoView: vi.fn(),
			scrollToTop: vi.fn()
		};
		tracker = new TrackerSpy();
	} );

	const getWrapper = ( forms: Record<string, any> = {}, stepControllers: StepController[] = [] ): VueWrapper<any> => {
		return mount( MultiStepDonation, {
			props: {
				stepControllers,
				pageScroller
			},
			slots: forms,
			global: {
				provide: {
					formActions: {
						donateWithAddressAction: `https://example.com/withAddress`,
						donateWithoutAddressAction: `https://example.com/?withoutAddress=okay`
					},
					tracker,
					timer: new TimerStub()
				}
			}
		} );
	};

	it( 'passes submit event to step controller', async () => {
		const stepController = new StepControllerSpy();
		const wrapper = getWrapper( { form: subFormEmitterTemplate }, [ stepController ] );

		await wrapper.find( '.emitting-sub-form' ).trigger( 'submit' );

		expect( ( stepController.submitWasCalled ) ).toBeTruthy();
		expect( ( stepController.submitData ) ).toEqual( { itsaMe: 'Mario' } );
	} );

	it( 'calls the pageScroller scroll method on submit', async () => {
		const wrapper = getWrapper( { form: subFormEmitterTemplate }, [ new StepControllerSpy() ] );

		await wrapper.find( '.emitting-sub-form' ).trigger( 'submit' );

		expect( pageScroller.scrollIntoView ).toHaveBeenCalledOnce();
		expect( pageScroller.scrollIntoView ).toHaveBeenCalledWith( '.wmde-banner-form' );
	} );

	it( 'passes previous event to page controller', async () => {
		const stepController = new StepControllerSpy();
		const wrapper = getWrapper( { form: subFormEmitterTemplate }, [ stepController ] );

		await wrapper.find( '.emitting-sub-form' ).trigger( 'previous' );

		expect( stepController.previousWasCalled ).toBeTruthy();
	} );

	it( 'should render the sub form pages', function () {
		const wrapper = getWrapper( { form01: SubFormStub, form02: SubFormStub, form03: SubFormStub } );

		expect( wrapper.findAll( '.wmde-banner-form-page' ).length ).toBe( 3 );
	} );

	it( 'should emit a form interaction event on click', async function () {
		vi.useFakeTimers();

		const wrapper = getWrapper( { form: subFormEmitterTemplate }, [ new StepControllerSpy() ] );

		await wrapper.find( '.wmde-banner-form' ).trigger( 'click' );
		await vi.runAllTimers();

		expect( wrapper.emitted( 'formInteraction' ).length ).toBe( 1 );

		vi.restoreAllMocks();
	} );

	it( 'should submit when submit navigation is invoked', async function () {
		const stepController = new StepControllerSpy();
		const wrapper = getWrapper( { form: subFormEmitterTemplate }, [ stepController ] );
		const submitForm = wrapper.find<HTMLFormElement>( '.wmde-banner-submit-form' );
		submitForm.element.submit = vi.fn();

		// We submit a sub form once to cache the navigation callbacks in the StepControllerSpy
		await wrapper.find( '.emitting-sub-form' ).trigger( 'submit' );
		await stepController.callSubmit( { customData: undefined, eventName: 'mushroom', feature: 'MainDonationForm', userChoice: 'badchoice' } );

		expect( submitForm.element.submit ).toHaveBeenCalledOnce();
	} );

	it( 'should call the submit callback when submit navigation is invoked', async function () {
		const stepController = new StepControllerSpy();
		const wrapper = getWrapper( { form: subFormEmitterTemplate }, [ stepController ] );
		let callbackWasCalled = false;
		await wrapper.setProps( { submitCallback: () => {
			callbackWasCalled = true;
		} } );
		const submitForm = wrapper.find<HTMLFormElement>( '.wmde-banner-submit-form' );
		submitForm.element.submit = vi.fn();

		// We submit a sub form once to cache the navigation callbacks in the StepControllerSpy
		await wrapper.find( '.emitting-sub-form' ).trigger( 'submit' );
		await stepController.callSubmit( { customData: undefined, eventName: 'mushroom', feature: 'MainDonationForm', userChoice: 'badchoice' } );

		expect( callbackWasCalled ).toBeTruthy();
	} );

	it( 'should track event data when submit navigation is invoked', async function () {
		const stepController = new StepControllerSpy();
		const wrapper = getWrapper( { form: subFormEmitterTemplate }, [ stepController ] );
		const submitForm = wrapper.find<HTMLFormElement>( '.wmde-banner-submit-form' );
		submitForm.element.submit = vi.fn();

		// We submit a sub form once to cache the navigation callbacks in the StepControllerSpy
		await wrapper.find( '.emitting-sub-form' ).trigger( 'submit' );
		await stepController.callSubmit( { customData: undefined, eventName: 'mushroom', feature: 'MainDonationForm', userChoice: 'goodChoice' } );

		expect( tracker.hasTrackedEvent( 'mushroom' ) ).toBeTruthy();
		expect( tracker.getTrackedEvent( 'mushroom' ).feature ).toBe( 'MainDonationForm' );
		expect( tracker.getTrackedEvent( 'mushroom' ).userChoice ).toBe( 'goodChoice' );
		expect( tracker.getTrackedEvent( 'mushroom' ).customData ).toBeUndefined();
	} );

	it( 'should go to specified step when goToStep callback is invoked', async function () {
		const stepController = new StepControllerSpy();
		const wrapper = getWrapper( { form01: subFormEmitterTemplate, form02: SubFormStub }, [ stepController, new StepControllerSpy() ] );

		// We submit a sub form once to cache the navigation callbacks in the StepControllerSpy
		await wrapper.find( '.emitting-sub-form' ).trigger( 'submit' );
		await stepController.callGoToStep( 'form02' );

		expect( wrapper.find( '.wmde-banner-form-page:nth-child(2)' ).attributes( 'class' ) )
			.toContain( 'wmde-banner-form-page--current' );
	} );

	it( 'should render isCurrent for each form', () => {
		const dummyForms = {
			form1: `
			<template #form-page-1="{ pageIndex, submit, previous, isCurrent }">
				<form id="form1" :class="{current: isCurrent}" />
			</template>`,
			form2: `
			<template #form-page-2="{ pageIndex, submit, previous, isCurrent }">
				<form id="form2" :class="{current: isCurrent}" />
			</template>`,
			form3: `
			<template #form-page-3="{ pageIndex, submit, previous, isCurrent }">
				<form id="form3" :class="{current: isCurrent}" />
			</template>`
		};
		const wrapper = getWrapper( dummyForms );

		expect( wrapper.find( '#form1' ).classes() ).toHaveLength( 1 );
		expect( wrapper.find( '#form2' ).classes() ).toHaveLength( 0 );
		expect( wrapper.find( '#form3' ).classes() ).toHaveLength( 0 );
	} );

	it( 'should render the default form URL', () => {
		const wrapper = getWrapper( { form01: SubFormStub, form02: SubFormStub, form03: SubFormStub } );

		expect( wrapper.find( '.wmde-banner-submit-form' ).attributes( 'action' ) )
			.toContain( 'example.com/withAddress' );
	} );

	it( 'should render the URL override', async () => {
		const wrapper = getWrapper( { form01: SubFormStub, form02: SubFormStub, form03: SubFormStub } );

		await wrapper.setProps( { formActionOverride: 'https://example.com/withBellsAndWhistles' } );

		expect( wrapper.find( '.wmde-banner-submit-form' ).attributes( 'action' ) )
			.toContain( 'https://example.com/withBellsAndWhistles' );
	} );
} );
