<template>
	<div class="wmde-banner-mini">
		<div class="wmde-banner-mini-content">
			<div class="wmde-banner-mini-close">
				<button class="wmde-banner-mini-close-button t-close-main-banner" @click.prevent="$emit( 'close' )">
					<CloseIconCircle/>
				</button>
			</div>

			<header class="wmde-banner-headline">
				<span class="wmde-banner-headline-content">Is Wikipedia worth €10 to you?</span>
			</header>

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

defineEmits( [ 'showFullPageBanner', 'showFullPageBannerPreselectedAmount', 'close' ] );

</script>
