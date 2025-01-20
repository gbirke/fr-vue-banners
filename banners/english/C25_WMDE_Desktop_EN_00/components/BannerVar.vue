<template>
	<div class="wmde-banner-wrapper" :class="contentState">
		<MainBanner
			@close="onCloseMain"
			@form-interaction="$emit( 'bannerContentChanged' )"
			:banner-state="bannerState"
			v-if="contentState === ContentStates.Main"
		>
			<template #banner-text>
				<BannerText/>
			</template>

			<template #banner-slides="{ play }: any">
				<KeenSlider :with-navigation="true" :play="play" :interval="10000" :delay="2000">

					<template #slides="{ currentSlide }: any">
						<BannerSlides :currentSlide="currentSlide"/>
					</template>

				</KeenSlider>
			</template>

			<template #progress>
				<DoubleProgressBar />
			</template>

			<template #donation-form="{ formInteraction }: any">
				<MultiStepDonation
					:step-controllers="stepControllers"
					:form-action-override="formAction"
					@form-interaction="formInteraction"
				>

					<template #[FormStepNames.MainDonationFormStep]="{ pageIndex, submit, isCurrent, previous }: any">
						<MainDonationForm :page-index="pageIndex" @submit="submit" :is-current="isCurrent" :show-receipt-checkbox-below="minimumAmount" @previous="previous">
							<template #label-payment-ppl>
								<span class="wmde-banner-select-group-label with-logos paypal"><PayPalLogo/></span>
							</template>

							<template #label-payment-mcp>
								<span class="wmde-banner-select-group-label with-logos credit-cards">
									<VisaLogo/>
									<MastercardLogo/>
								</span>
							</template>
						</MainDonationForm>
					</template>

					<template #[FormStepNames.UpgradeToYearlyFormStep]="{ pageIndex, submit, isCurrent, previous }: any">
						<UpgradeToYearlyButtonForm
							:page-index="pageIndex"
							:is-current="isCurrent"
							:show-manual-upgrade-option="false"
							@submit="submit"
							@previous="previous"
						/>
					</template>

				</MultiStepDonation>
			</template>
			<template #footer>
				<FooterAlreadyDonated
					@showFundsModal="onOpenUseOfFunds"
					@clickedAlreadyDonatedLink="onClose( 'AlreadyDonated', CloseChoices.AlreadyDonated )"
				/>
			</template>
		</MainBanner>

		<SoftClose
			v-if="contentState === ContentStates.SoftClosing"
			:show-close-icon="true"
			@close="() => onClose( 'SoftClose', CloseChoices.Close )"
			@maybe-later="() => onClose( 'SoftClose', CloseChoices.MaybeLater )"
			@time-out-close="() => onClose( 'SoftClose', CloseChoices.TimeOut )"
		/>

		<FundsModal
			:content="useOfFundsContent"
			:is-funds-modal-visible="isFundsModalVisible"
			@hideFundsModal="onCloseUseOfFunds"
		>
			<template #infographic>
				<WMDEFundsForwardingEN/>
			</template>
		</FundsModal>
	</div>
</template>

<script setup lang="ts">
import { BannerStates } from '@src/components/BannerConductor/StateMachine/BannerStates';
import { inject, ref, watch } from 'vue';
import MainBanner from './MainBanner.vue';
import FundsModal from '@src/components/UseOfFunds/FundsModal.vue';
import { UseOfFundsContent as useOfFundsContentInterface } from '@src/domain/UseOfFunds/UseOfFundsContent';
import UpgradeToYearlyButtonForm from '@src/components/DonationForm/Forms/UpgradeToYearlyButtonForm.vue';
import BannerSlides from '../content/BannerSlides.vue';
import MainDonationForm from './MainDonationFormReceiptAboveValue.vue';
import MultiStepDonation from '@src/components/DonationForm/MultiStepDonation.vue';
import BannerText from '../content/BannerText.vue';
import KeenSlider from '@src/components/Slider/KeenSlider.vue';
import FooterAlreadyDonated from '@src/components/Footer/FooterAlreadyDonated.vue';
import { useFormModel } from '@src/components/composables/useFormModel';
import {
	createSubmittableMainDonationForm
} from '@src/components/DonationForm/StepControllers/SubmittableMainDonationForm';
import {
	createSubmittableUpgradeToYearly
} from '@src/components/DonationForm/StepControllers/SubmittableUpgradeToYearly';
import { CloseChoices } from '@src/domain/CloseChoices';
import { CloseEvent } from '@src/tracking/events/CloseEvent';
import { TrackingFeatureName } from '@src/tracking/TrackingEvent';
import VisaLogo from '@src/components/PaymentLogos/VisaLogo.vue';
import MastercardLogo from '@src/components/PaymentLogos/MastercardLogo.vue';
import PayPalLogo from '@src/components/PaymentLogos/PayPalLogo.vue';
import DoubleProgressBar from '@src/components/ProgressBar/DoubleProgressBar.vue';
import SoftClose from '@src/components/SoftClose/SoftClose.vue';
import WMDEFundsForwardingEN from '@src/components/UseOfFunds/Infographics/WMDEFundsForwardingEN.vue';
import { useBannerHider } from '@src/components/composables/useBannerHider';
import { useFormAction } from '../useFormAction';
import { FormActions } from '@src/domain/FormActions';

const minimumAmount = 10;

enum ContentStates {
	Main = 'wmde-banner-wrapper--main',
	SoftClosing = 'wmde-banner-wrapper--soft-closing'
}

enum FormStepNames {
	MainDonationFormStep = 'MainDonationForm',
	UpgradeToYearlyFormStep = 'UpgradeToYearlyForm'
}

interface Props {
	bannerState: BannerStates;
	useOfFundsContent: useOfFundsContentInterface;
	remainingImpressions: number;
}

const props = defineProps<Props>();
const emit = defineEmits( [ 'bannerClosed', 'maybeLater', 'bannerContentChanged', 'modalOpened', 'modalClosed' ] );
useBannerHider( 800, emit );

const isFundsModalVisible = ref<boolean>( false );
const contentState = ref<ContentStates>( ContentStates.Main );
const formModel = useFormModel();
const stepControllers = [
	createSubmittableMainDonationForm( formModel, FormStepNames.UpgradeToYearlyFormStep ),
	createSubmittableUpgradeToYearly( formModel, FormStepNames.MainDonationFormStep, FormStepNames.MainDonationFormStep )
];

const { formAction } = useFormAction( inject<FormActions>( 'formActions' ), minimumAmount );

watch( contentState, async () => {
	emit( 'bannerContentChanged' );
} );

function onOpenUseOfFunds(): void {
	isFundsModalVisible.value = true;
	emit( 'modalOpened' );
}

function onCloseUseOfFunds(): void {
	isFundsModalVisible.value = false;
	emit( 'modalClosed' );
}

function onCloseMain(): void {
	if ( props.remainingImpressions > 0 ) {
		contentState.value = ContentStates.SoftClosing;
	} else {
		onClose( 'MainBanner', CloseChoices.Close );
	}
}

function onClose( feature: TrackingFeatureName, userChoice: CloseChoices ): void {
	emit( 'bannerClosed', new CloseEvent( feature, userChoice ) );
}

</script>
