<template>
	<div class="wmde-banner-wrapper" :class="contentState" :style="colors">
		<MiniBanner
			:show-fireworks="showSuccessContent"
			:banner-state="bannerState"
			@close="onClose"
			@show-modal="onShowModal"
		>

			<template #text>
				<MiniBannerTextWin v-if="showSuccessContent" :number-of-donors="settings.numberOfDonors"/>
				<MiniBannerTextLose v-else :number-of-donors="settings.numberOfDonors"/>
			</template>

			<template #progress>
				<ProgressBar :fill-percentage="settings.progressBarPercentage"/>
			</template>

			<template #slides="{ play }: any">
				<KeenSlider :with-navigation="true" :play="play" :interval="10000" :delay="2000">

					<template #slides="{ currentSlide }: any">
						<MiniBannerSlidesWin v-if="showSuccessContent" :currentSlide="currentSlide" :number-of-donors="settings.numberOfDonors">
							<template #progress>
								<ProgressBar :fill-percentage="settings.progressBarPercentage"/>
							</template>
						</MiniBannerSlidesWin>
						<MiniBannerSlidesLose v-else :currentSlide="currentSlide" :number-of-donors="settings.numberOfDonors">
							<template #progress>
								<ProgressBar :fill-percentage="settings.progressBarPercentage"/>
							</template>
						</MiniBannerSlidesLose>
					</template>

				</KeenSlider>
			</template>

		</MiniBanner>

		<FullPageBanner @close="onHideModal">

			<template #text>
				<FullPageBannerTextWin v-if="showSuccessContent"/>
				<FullPageBannerTextLose v-else/>
			</template>

			<template #benefits><MembershipBenefits/></template>

			<template #membership-buttons>
				<MembershipFormButton
					:label="$translate( 'call-to-action-button-amount-per-month', { amount: 2 } )"
					:extra-url-parameters="{
						interval: '1',
						fee: '200',
						type: 'sustaining'
					}"
					@submit="submitWithAmount"
				/>
				<MembershipFormButton
					:label="$translate( 'call-to-action-button-different-amount' )"
					:extra-url-parameters="{ type: 'sustaining' }"
					@submit="submitWithoutAmount"
				/>
			</template>

			<template #subscribe>
				<a :href="subscribeURL" @click.prevent="onSubscribe">{{ $translate( 'call-to-action-more-info' ) }}</a><br>
				<a :href="useOfFundsURL" @click.prevent="onUseOfFunds">{{ $translate( 'use-of-funds' ) }}</a>
			</template>

		</FullPageBanner>
	</div>
</template>

<script setup lang="ts">
import { inject, ref } from 'vue';
import { BannerStates } from '@src/components/BannerConductor/StateMachine/BannerStates';
import KeenSlider from '@src/components/Slider/KeenSlider.vue';
import { CloseChoices } from '@src/domain/CloseChoices';
import { BannerSubmitEvent } from '@src/tracking/events/BannerSubmitEvent';
import { CloseEvent } from '@src/tracking/events/CloseEvent';
import { ThankYouModalShownEvent } from '@src/tracking/events/ThankYouModalShownEvent';
import { Tracker } from '@src/tracking/Tracker';
import FullPageBanner from './FullPageBanner.vue';
import MembershipFormButton from './MembershipButton.vue';
import MiniBanner from './MiniBanner.vue';
import ProgressBar from './ProgressBar.vue';
import FullPageBannerTextLose from '../content/lose/FullPageBannerText.de.vue';
import MiniBannerSlidesLose from '../content/lose/MiniBannerSlides.de.vue';
import MiniBannerTextLose from '../content/lose/MiniBannerText.de.vue';
import MembershipBenefits from '../content/MembershipBenefits.de.vue';
import FullPageBannerTextWin from '../content/win/FullPageBannerText.de.vue';
import MiniBannerSlidesWin from '../content/win/MiniBannerSlides.de.vue';
import MiniBannerTextWin from '../content/win/MiniBannerText.de.vue';
import { ThankYouSettings } from '../settings';
import colors from '../styles/settings/colors';

enum ContentStates {
	Mini = 'wmde-banner-wrapper--mini',
	Full = 'wmde-banner-wrapper--full-page'
}

interface Props {
	bannerState: BannerStates;
	settings: ThankYouSettings;
	subscribeURL: string;
	useOfFundsURL: string;
}

const props = defineProps<Props>();
const emit = defineEmits( [ 'bannerClosed', 'modalOpened', 'modalClosed' ] );
const tracker = inject<Tracker>( 'tracker' );
const contentState = ref<ContentStates>( ContentStates.Mini );
const showSuccessContent = props.settings.progressBarPercentage === 100;

const onClose = (): void => {
	emit( 'bannerClosed', new CloseEvent( 'MainBanner', CloseChoices.Close ) );
};

const onShowModal = (): void => {
	tracker.trackEvent( new ThankYouModalShownEvent() );
	emit( 'modalOpened' );
	contentState.value = ContentStates.Full;
};

const onHideModal = (): void => {
	emit( 'modalClosed' );
	contentState.value = ContentStates.Mini;
};

const onSubmit = ( url: string, userChoice: string ): void => {
	tracker.trackEvent( new BannerSubmitEvent( 'ThankYouBanner', userChoice ) );
	window.location.href = url;
};

const submitWithAmount = ( url: string ): void => {
	onSubmit( url, 'with-amount-2' );
};

const submitWithoutAmount = ( url: string ): void => {
	onSubmit( url, 'without-amount' );
};

const onSubscribe = (): void => {
	onSubmit( props.subscribeURL, 'subscribe' );
};

const onUseOfFunds = (): void => {
	onSubmit( props.useOfFundsURL, 'use-of-funds' );
};

</script>
