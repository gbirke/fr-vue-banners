<template>
	<div class="wmde-banner-wrapper" :class="contentState">
		<SetCookieImage v-if="showSetCookieImage"/>
		<SetAlreadyDonatedCookieImage v-if="showAlreadyDonatedCookieImage"/>
		<SetMaybeLaterCookieImage v-if="showMaybeLaterCookieImage"/>
		<MainBanner
			@close="onCloseMain"
			@form-interaction="$emit( 'bannerContentChanged' )"
			:bannerState="bannerState"
			v-if="contentState === ContentStates.Main"
		>
			<template #banner-text>
				<BannerText/>
			</template>

			<template #banner-slides="{ play }: any">
				<KeenSlider :with-navigation="true" :play="play" :interval="10000">

					<template #slides="{ currentSlide }: any">
						<BannerSlides :currentSlide="currentSlide"/>
					</template>

					<template #left-icon>
						<ChevronLeftIcon :fill="'#990a00'"/>
					</template>

					<template #right-icon>
						<ChevronRightIcon :fill="'#990a00'"/>
					</template>

				</KeenSlider>
			</template>

			<template #progress>
				<ProgressBar amount-to-show-on-right="TARGET"/>
			</template>

			<template #donation-form="{ formInteraction }: any">
				<MultiStepDonation :step-controllers="stepControllers" @form-interaction="formInteraction">

					<template #[FormStepNames.MainDonationFormStep]="{ pageIndex, submit, isCurrent, previous }: any">
						<MainDonationForm :page-index="pageIndex" @submit="submit" :is-current="isCurrent" @previous="previous"/>
					</template>

					<template #[FormStepNames.UpgradeToYearlyFormStep]="{ pageIndex, submit, isCurrent, previous }: any">
						<UpgradeToYearlyForm :page-index="pageIndex" @submit="submit" :is-current="isCurrent" @previous="previous"/>
					</template>

					<template #[FormStepNames.CustomAmountFormStep]="{ pageIndex, submit, isCurrent, previous }: any">
						<CustomAmountForm :page-index="pageIndex" @submit="submit" :is-current="isCurrent" @previous="previous"/>
					</template>

				</MultiStepDonation>
			</template>

			<template #footer>
				<FooterAlreadyDonated
					@showFundsModal="isFundsModalVisible = true"
					@clickedAlreadyDonatedLink="isAlreadyDonatedModalVisible = true"
				/>
			</template>

		</MainBanner>

		<FundsModal
			:content="useOfFundsContent"
			:is-funds-modal-visible="isFundsModalVisible"
			@hideFundsModal="isFundsModalVisible = false"
		>
			<template #infographic>
				<WMDEFundsForwardingDE/>
			</template>
		</FundsModal>

		<SoftClose
			v-if="contentState === ContentStates.SoftClosing"
			@close="() => onClose( 'SoftClose', CloseChoices.Close )"
			@maybe-later="() => onClose( 'SoftClose', CloseChoices.MaybeLater )"
			@time-out-close="() => onClose( 'SoftClose', CloseChoices.TimeOut )"
		/>

		<AlreadyDonatedModal
			:is-visible="isAlreadyDonatedModalVisible"
			@hideAlreadyDonatedModal="isAlreadyDonatedModalVisible = false"
			@goAway="() => onClose( 'AlreadyDonatedModal', CloseChoices.NoMoreBannersForCampaign )"
			@maybeLater="() => onClose( 'AlreadyDonatedModal', CloseChoices.Close )"
		>
			<template #already-donated-content>
				<AlreadyDonatedContent/>
			</template>
		</AlreadyDonatedModal>
	</div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import AlreadyDonatedModal from '@src/components/AlreadyDonatedModal/AlreadyDonatedModal.vue';
import { BannerStates } from '@src/components/BannerConductor/StateMachine/BannerStates';
import { useFormModel } from '@src/components/composables/useFormModel';
import CustomAmountForm from '@src/components/DonationForm/Forms/CustomAmountForm.vue';
import MainDonationForm from '@src/components/DonationForm/Forms/MainDonationForm.vue';
import UpgradeToYearlyForm from '@src/components/DonationForm/Forms/UpgradeToYearlyForm.vue';
import MultiStepDonation from '@src/components/DonationForm/MultiStepDonation.vue';
import { createSubmittableCustomAmount } from '@src/components/DonationForm/StepControllers/SubmittableCustomAmount';
import {
	createSubmittableMainDonationForm
} from '@src/components/DonationForm/StepControllers/SubmittableMainDonationForm';
import {
	createSubmittableUpgradeToYearly
} from '@src/components/DonationForm/StepControllers/SubmittableUpgradeToYearly';
import FooterAlreadyDonated from '@src/components/Footer/FooterAlreadyDonated.vue';
import ChevronLeftIcon from '@src/components/Icons/ChevronLeftIcon.vue';
import ChevronRightIcon from '@src/components/Icons/ChevronRightIcon.vue';
import ProgressBar from '@src/components/ProgressBar/ProgressBar.vue';
import SetAlreadyDonatedCookieImage from '@src/components/SetWPDECookieImage/SetAlreadyDonatedCookieImage.vue';
import SetCookieImage from '@src/components/SetWPDECookieImage/SetCookieImage.vue';
import SetMaybeLaterCookieImage from '@src/components/SetWPDECookieImage/SetMaybeLaterCookieImage.vue';
import KeenSlider from '@src/components/Slider/KeenSlider.vue';
import SoftClose from '@src/components/SoftClose/SoftClose.vue';
import FundsModal from '@src/components/UseOfFunds/FundsModal.vue';
import WMDEFundsForwardingDE from '@src/components/UseOfFunds/Infographics/WMDEFundsForwardingDE.vue';
import { CloseChoices } from '@src/domain/CloseChoices';
import { UseOfFundsContent as useOfFundsContentInterface } from '@src/domain/UseOfFunds/UseOfFundsContent';
import { CloseEvent } from '@src/tracking/events/CloseEvent';
import { TrackingFeatureName } from '@src/tracking/TrackingEvent';
import MainBanner from './MainBanner.vue';
import AlreadyDonatedContent from '../content/AlreadyDonatedContent.vue';
import BannerSlides from '../content/BannerSlides.vue';
import BannerText from '../content/BannerText.vue';

enum ContentStates {
	Main = 'wmde-banner-wrapper--main',
	SoftClosing = 'wmde-banner-wrapper--soft-closing'
}

enum FormStepNames {
	CustomAmountFormStep = 'CustomAmountForm',
	MainDonationFormStep = 'MainDonationForm',
	UpgradeToYearlyFormStep = 'UpgradeToYearlyForm'
}

interface Props {
	bannerState: BannerStates;
	useOfFundsContent: useOfFundsContentInterface;
	remainingImpressions: number;
}

const props = defineProps<Props>();
const emit = defineEmits( [ 'bannerClosed', 'bannerContentChanged' ] );

const isFundsModalVisible = ref<boolean>( false );
const isAlreadyDonatedModalVisible = ref<boolean>( false );
const showSetCookieImage = ref<boolean>( false );
const showAlreadyDonatedCookieImage = ref<boolean>( false );
const showMaybeLaterCookieImage = ref<boolean>( false );
const contentState = ref<ContentStates>( ContentStates.Main );
const formModel = useFormModel();
const stepControllers = [
	createSubmittableMainDonationForm( formModel, FormStepNames.UpgradeToYearlyFormStep ),
	createSubmittableUpgradeToYearly( formModel, FormStepNames.CustomAmountFormStep, FormStepNames.MainDonationFormStep ),
	createSubmittableCustomAmount( formModel, FormStepNames.UpgradeToYearlyFormStep )
];

watch( contentState, async () => {
	emit( 'bannerContentChanged' );
} );

function onCloseMain(): void {
	if ( props.remainingImpressions > 0 ) {
		contentState.value = ContentStates.SoftClosing;
	} else {
		onClose( 'MainBanner', CloseChoices.Close );
	}
}

function onClose( feature: TrackingFeatureName, userChoice: CloseChoices ): void {
	emit( 'bannerClosed', new CloseEvent( feature, userChoice ) );

	switch ( userChoice ) {
		case CloseChoices.MaybeLater:
			showMaybeLaterCookieImage.value = true;
			break;
		case CloseChoices.Close:
		case CloseChoices.Hide:
		case CloseChoices.TimeOut:
			showSetCookieImage.value = true;
			break;
		case CloseChoices.NoMoreBannersForCampaign:
			showAlreadyDonatedCookieImage.value = true;
			break;

	}
}

</script>
