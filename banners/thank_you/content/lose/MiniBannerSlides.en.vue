<template>
	<KeenSliderSlide :is-current="currentSlide === 0">
		<p><strong>We're so grateful for your amazing support!</strong></p>
		<slot name="progress"/>
	</KeenSliderSlide>
	<KeenSliderSlide :is-current="currentSlide === 1">
		<p><strong>Around {{ numberOfDonors }} people</strong> have donated and shown their appreciation for Wikipedia.</p>
	</KeenSliderSlide>
	<KeenSliderSlide :is-current="currentSlide === 2">
		<HeartIcon/>
		<p>We thank you all from the bottom of our hearts!</p>
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
