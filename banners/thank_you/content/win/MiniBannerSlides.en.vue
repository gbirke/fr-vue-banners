<template>
	<KeenSliderSlide :is-current="currentSlide === 0">
		<p><strong>Thank you!</strong></p>
		<slot name="progress"/>
	</KeenSliderSlide>
	<KeenSliderSlide :is-current="currentSlide === 1">
		<p><strong>Around {{ numberOfDonors }} people</strong> showed their appreciation for Wikipedia by donating in the last few weeks.</p>
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
