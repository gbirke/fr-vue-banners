<template>
	<div class="wmde-banner-mini">
		<div class="wmde-banner-mini-content">
			<div class="wmde-banner-mini-close">
				<button class="wmde-banner-mini-close-button t-close-main-banner" @click.prevent="$emit( 'close' )">
					<CloseIconCircle/>
				</button>
			</div>

			<button @click="$emit( 'showUseOfFunds' )" class="wmde-banner-headline">
				<span class="wmde-banner-headline-icon"><SimpleInfoIcon/></span> <span class="wmde-banner-headline-link">Why</span> even &euro;10 makes a difference
			</button>

			<div class="wmde-banner-mini-slideshow">
				<slot name="banner-slides"/>
			</div>

			<div class="wmde-banner-mini-button-group">
				<button class="wmde-banner-mini-button-preselect" @click="$emit( 'showFullPageBannerPreselectedAmount' )">
					Donate €10
				</button>
				<button class="wmde-banner-mini-button" @click="$emit( 'showFullPageBanner' )">
					Different Amount
				</button>
			</div>

			<div class="wmde-banner-mini-payment-icons">
				<div><PayPalLogo/></div>
				<div><VisaLogo/></div>
				<div><MastercardLogo/></div>
				<div><SmsIcon/></div>
			</div>

		</div>
	</div>
</template>

<script setup lang="ts">

import CloseIconCircle from '@src/components/Icons/CloseIconCircle.vue';
import SmsIcon from '@src/components/Icons/SmsIcon.vue';
import MastercardLogo from '@src/components/PaymentLogos/MastercardLogo.vue';
import PayPalLogo from '@src/components/PaymentLogos/PayPalLogo.vue';
import VisaLogo from '@src/components/PaymentLogos/VisaLogo.vue';
import SimpleInfoIcon from './SimpleInfoIcon.vue';

defineEmits( [ 'showFullPageBanner', 'showFullPageBannerPreselectedAmount', 'close', 'showUseOfFunds' ] );

</script>
