<template>
	<div class="wmde-banner-wrapper" :class="contentState">
		<MiniBanner
			@close="onCloseMiniBanner"
			@show-full-page-banner="onshowFullPageBanner"
			@show-full-page-banner-preselected="onshowFullPageBannerPreselected"
		>
			<template #banner-slides>
				<KeenSlider :with-navigation="false" :play="slideshowShouldPlay" :interval="5000">

					<template #slides="{ currentSlide }: any">
						<BannerSlides :currentSlide="currentSlide" :play-live-text="contentState === ContentStates.Mini"/>
					</template>

				</KeenSlider>
			</template>
		</MiniBanner>

		<FullPageBanner
			@showFundsModal="isFundsModalVisible = true"
			@close="() => onClose( 'FullPageBanner', CloseChoices.Hide )"
		>
			<template #banner-text>
				<BannerText :play-live-text="contentState === ContentStates.FullPage"/>
			</template>

			<template #progress>
				<ProgressBar amount-to-show-on-right="TARGET"/>
			</template>

			<template #donation-form="{ formInteraction }: any">
				<MultiStepDonation :step-controllers="stepControllers" @form-interaction="formInteraction" :page-scroller="pageScroller">

					<template #[FormStepNames.MainDonationFormStep]="{ pageIndex, submit, isCurrent, previous }: any">
						<MainDonationForm :page-index="pageIndex" @submit="submit" :is-current="isCurrent" @previous="previous">

							<template #button>
								<MainDonationFormPaymentMethodLabeledButton/>
							</template>

						</MainDonationForm>
					</template>

					<template #[FormStepNames.UpgradeToYearlyFormStep]="{ pageIndex, submit, isCurrent, previous }: any">
						<UpgradeToYearlyButtonForm
							:show-manual-upgrade-option = false
							:page-index="pageIndex"
							@submit="submit"
							:is-current="isCurrent"
							@previous="previous"
						>
							<template #back>
								<ChevronLeftIcon/> {{ $translate( 'back-button' ) }}
							</template>
						</UpgradeToYearlyButtonForm>
					</template>

				</MultiStepDonation>
			</template>

			<template #footer>
				<BannerFooter :show-funds-link="false"/>
			</template>
		</FullPageBanner>

		<SoftClose
			v-if="contentState === ContentStates.SoftClosing"
			:show-close-icon="true"
			@close="() => onClose( 'SoftClose', CloseChoices.Close )"
			@maybe-later="() => onClose( 'SoftClose', CloseChoices.MaybeLater )"
			@time-out-close="() => onClose( 'SoftClose', CloseChoices.TimeOut )"
		>
			<template #buttons="{ timer }: any">
				<button
					class="wmde-banner-soft-close-button wmde-banner-soft-close-button-maybe-later"
					@click="() => onSoftCloseClose( timer, 'SoftClose', CloseChoices.MaybeLater )">
					{{ $translate( 'soft-close-button-maybe-later' ) }}
				</button>
				<button
					class="wmde-banner-soft-close-button wmde-banner-soft-close-button-close"
					@click="() => onSoftCloseClose( timer, 'SoftClose', CloseChoices.Close )">
					{{ $translate( 'soft-close-button-close' ) }}
				</button>
				<button
					class="wmde-banner-soft-close-button wmde-banner-soft-close-button-already-donated"
					@click="() => onSoftCloseClose( timer, 'SoftClose', CloseChoices.NoMoreBannersForCampaign )">
					{{ $translate( 'soft-close-button-already-donated' ) }}
				</button>
			</template>
		</SoftClose>

		<FundsModal
			:content="useOfFundsContent"
			:is-funds-modal-visible="isFundsModalVisible"
			@hideFundsModal="onHideFundsModal"
		>
			<template #infographic>
				<WMDEFundsForwardingDE/>
			</template>
		</FundsModal>
	</div>
</template>

<script setup lang="ts">
import { computed, inject, ref, watch } from 'vue';
import { BannerStates } from '@src/components/BannerConductor/StateMachine/BannerStates';
import { useAnonymousAddressTypeSetter } from '@src/components/composables/useAnonymousAddressTypeSetter';
import { useFormModel } from '@src/components/composables/useFormModel';
import MainDonationForm from '@src/components/DonationForm/Forms/MainDonationForm.vue';
import MainDonationFormPaymentMethodLabeledButton
	from '@src/components/DonationForm/Forms/MainDonationFormPaymentMethodLabeledButton.vue';
import UpgradeToYearlyButtonForm from '@src/components/DonationForm/Forms/UpgradeToYearlyButtonForm.vue';
import MultiStepDonation from '@src/components/DonationForm/MultiStepDonation.vue';
import {
	createSubmittableMainDonationForm
} from '@src/components/DonationForm/StepControllers/SubmittableMainDonationForm';
import {
	createSubmittableUpgradeToYearly
} from '@src/components/DonationForm/StepControllers/SubmittableUpgradeToYearly';
import BannerFooter from '@src/components/Footer/BannerFooter.vue';
import ChevronLeftIcon from '@src/components/Icons/ChevronLeftIcon.vue';
import ProgressBar from '@src/components/ProgressBar/ProgressBar.vue';
import KeenSlider from '@src/components/Slider/KeenSlider.vue';
import SoftClose from '@src/components/SoftClose/SoftClose.vue';
import FundsModal from '@src/components/UseOfFunds/FundsModal.vue';
import WMDEFundsForwardingDE from '@src/components/UseOfFunds/Infographics/WMDEFundsForwardingDE.vue';
import { UseOfFundsCloseSources } from '@src/components/UseOfFunds/UseOfFundsCloseSources';
import { CloseChoices } from '@src/domain/CloseChoices';
import { UseOfFundsContent as useOfFundsContentInterface } from '@src/domain/UseOfFunds/UseOfFundsContent';
import { CloseEvent } from '@src/tracking/events/CloseEvent';
import { MobileMiniBannerExpandedEvent } from '@src/tracking/events/MobileMiniBannerExpandedEvent';
import { Tracker } from '@src/tracking/Tracker';
import { TrackingFeatureName } from '@src/tracking/TrackingEvent';
import { PageScroller } from '@src/utils/PageScroller/PageScroller';
import FullPageBanner from './FullPageBanner.vue';
import MiniBanner from './MiniBanner.vue';
import BannerSlides from '../content/BannerSlides.vue';
import BannerText from '../content/BannerText.vue';

enum ContentStates {
	Mini = 'wmde-banner-wrapper--mini',
	FullPage = 'wmde-banner-wrapper--full-page',
	SoftClosing = 'wmde-banner-wrapper--soft-closing'
}

enum FormStepNames {
	MainDonationFormStep = 'MainDonationForm',
	UpgradeToYearlyFormStep = 'UpgradeToYearlyForm'
}

interface Props {
	bannerState: BannerStates;
	useOfFundsContent: useOfFundsContentInterface;
	pageScroller: PageScroller;
	remainingImpressions: number;
}

const props = defineProps<Props>();
const emit = defineEmits( [ 'bannerClosed', 'bannerContentChanged' ] );

const tracker = inject<Tracker>( 'tracker' );

const isFundsModalVisible = ref<boolean>( false );
const slideShowStopped = ref<boolean>( false );
const slideshowShouldPlay = computed( () => props.bannerState === BannerStates.Visible && !slideShowStopped.value );
const contentState = ref<ContentStates>( ContentStates.Mini );
const formModel = useFormModel();
const stepControllers = [
	createSubmittableMainDonationForm( formModel, FormStepNames.UpgradeToYearlyFormStep ),
	createSubmittableUpgradeToYearly( formModel, FormStepNames.MainDonationFormStep, FormStepNames.MainDonationFormStep )
];

useAnonymousAddressTypeSetter();

watch( contentState, async () => {
	emit( 'bannerContentChanged' );
} );

function onCloseMiniBanner(): void {
	if ( props.remainingImpressions > 0 ) {
		contentState.value = ContentStates.SoftClosing;
	} else {
		onClose( 'MainBanner', CloseChoices.Close );
	}
}

function onClose( feature: TrackingFeatureName, userChoice: CloseChoices ): void {
	emit( 'bannerClosed', new CloseEvent( feature, userChoice ) );
}

function onSoftCloseClose( timer: number, feature: TrackingFeatureName, userChoice: CloseChoices ): void {
	window.clearInterval( timer );
	onClose( feature, userChoice );
}

function onshowFullPageBanner(): void {
	slideShowStopped.value = true;
	contentState.value = ContentStates.FullPage;
	tracker.trackEvent( new MobileMiniBannerExpandedEvent() );
}

function onshowFullPageBannerPreselected(): void {
	slideShowStopped.value = true;
	formModel.selectedAmount.value = '10';
	contentState.value = ContentStates.FullPage;
	tracker.trackEvent( new MobileMiniBannerExpandedEvent( 'preselected' ) );
}

const onHideFundsModal = ( payload: { source: UseOfFundsCloseSources } ): void => {
	props.pageScroller.scrollIntoView( payload.source === UseOfFundsCloseSources.callToAction ?
		'.wmde-banner-form' :
		'.wmde-banner-full-small-print .wmde-banner-footer-usage-link'
	);
	isFundsModalVisible.value = false;
};

</script>
