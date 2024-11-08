<template>
	<div class="wmde-banner-fallback">
		<ButtonClose @close="onClose"/>

		<div class="wmde-banner-fallback-small" v-if="!onLargeScreen">
			<KeenSlider
				:with-pagination="false"
				:play="slideshowShouldPlay"
				:interval="10000"
				:delay="2000"
				@slideChanged="onSlideChange"
			>
				<template #slides="{ currentSlide }: any">
					<FallbackSlides :current-slide="currentSlide"/>
				</template>

				<template #left-icon>
					<ChevronLeftIcon :fill="'#990a00'"/>
				</template>

				<template #right-icon>
					<ChevronRightIcon :fill="'#990a00'"/>
				</template>
			</KeenSlider>

			<FallbackButton @buttonClicked="onSubmit"/>

			<SmallFooter :slide-index="slideIndex" :slide-count="slideCount" @useOfFundsButtonClicked="isFundsModalVisible = true"/>
		</div>

		<div class="wmde-banner-fallback-large" v-if="onLargeScreen">
			<div class="wmde-banner-fallback-message">
				<FallbackText/>
			</div>

			<LargeFooter @useOfFundsButtonClicked="isFundsModalVisible = true" @submitButtonClicked="onSubmit"/>
		</div>

		<FundsModal
			:content="useOfFundsContent"
			:is-funds-modal-visible="isFundsModalVisible"
			@hideFundsModal="isFundsModalVisible = false"
		>
			<template #infographic>
				<WMDEFundsForwardingDE/>
			</template>
		</FundsModal>

	</div>
</template>

<script setup lang="ts">

import { computed, inject, ref } from 'vue';
import { BannerStates } from '@src/components/BannerConductor/StateMachine/BannerStates';
import ButtonClose from '@src/components/ButtonClose/ButtonClose.vue';
import { useDisplaySwitch } from '@src/components/composables/useDisplaySwitch';
import FallbackButton from '@src/components/FallbackBanner/FallbackButton.vue';
import LargeFooter from '@src/components/FallbackBanner/LargeFooter.vue';
import SmallFooter from '@src/components/FallbackBanner/SmallFooter.vue';
import ChevronLeftIcon from '@src/components/Icons/ChevronLeftIcon.vue';
import ChevronRightIcon from '@src/components/Icons/ChevronRightIcon.vue';
import KeenSlider from '@src/components/Slider/KeenSlider.vue';
import FundsModal from '@src/components/UseOfFunds/FundsModal.vue';
import WMDEFundsForwardingDE from '@src/components/UseOfFunds/Infographics/WMDEFundsForwardingDE.vue';
import { CloseChoices } from '@src/domain/CloseChoices';
import { UseOfFundsContent as useOfFundsContentInterface } from '@src/domain/UseOfFunds/UseOfFundsContent';
import { CloseEvent } from '@src/tracking/events/CloseEvent';
import { FallbackBannerSubmitEvent } from '@src/tracking/events/FallbackBannerSubmitEvent';
import { Tracker } from '@src/tracking/Tracker';
import FallbackSlides from '../content/FallbackSlides.vue';
import FallbackText from '../content/FallbackText.vue';

interface Props {
	bannerState: BannerStates;
	useOfFundsContent: useOfFundsContentInterface;
	donationLink: string;
}

const props = defineProps<Props>();
const emit = defineEmits( [ 'bannerClosed' ] );

const tracker = inject<Tracker>( 'tracker' );
const slideIndex = ref<number>( 0 );
const slideCount = ref<number>( 0 );
const slideShowStopped = ref<boolean>( false );
const slideshowShouldPlay = computed( () => props.bannerState === BannerStates.Visible && !slideShowStopped.value );
const isFundsModalVisible = ref<boolean>( false );

const onLargeScreen = useDisplaySwitch( 799 );

function onClose(): void {
	emit( 'bannerClosed', new CloseEvent( 'FallbackBanner', CloseChoices.Close ) );
}

function onSlideChange( newIndex: number, newSlideCount: number ): void {
	slideIndex.value = newIndex;
	slideCount.value = newSlideCount;
}

function onSubmit(): void {
	tracker.trackEvent( new FallbackBannerSubmitEvent() );
	window.location.href = props.donationLink;
}

</script>
