<template>
	<KeenSliderSlide :is-current="currentSlide === 0">
		<p><strong>Vielen Dank für Ihre tolle Unterstützung!</strong></p>
		<slot name="progress"/>
	</KeenSliderSlide>
	<KeenSliderSlide :is-current="currentSlide === 1">
		<p><strong>Rund {{ numberOfDonors }} Menschen</strong> haben gespendet und Wikipedia ihre Wertschätzung erwiesen.</p>
	</KeenSliderSlide>
	<KeenSliderSlide :is-current="currentSlide === 2">
		<HeartIcon/>
		<p>Ihnen danken wir von ganzem Herzen!</p>
	</KeenSliderSlide>
</template>

<script setup lang="ts">
import HeartIcon from '@banners/thank_you/components/icons/HeartIcon.vue';
import KeenSliderSlide from '@src/components/Slider/KeenSliderSlide.vue';

interface Props {
	currentSlide: number;
	numberOfDonors: string;
}

defineProps<Props>();

</script>
