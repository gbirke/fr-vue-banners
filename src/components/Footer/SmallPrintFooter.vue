<template>
	<div class="wmde-banner-footer">
		<div v-if="showFundsLink" class="wmde-banner-footer-usage">
			<div class="first-row-items">
				<div class="wmde-banner-footer-item">
					<a
						id="application-of-funds-link"
						class="wmde-banner-footer-usage-link t-use-of-funds-link"
						@click.prevent="$emit( 'showFundsModal' )"
						:title="$translate( 'use-of-funds-link-description' )"
					>
						{{ $translate( 'use-of-funds-link' ) }}
					</a>
				</div>
				<div class="wmde-banner-footer-item wmde-banner-footer-faq-link-item">
					<span class="link-separator"> | </span>
					<a
						id="faq-page-link"
						class="wmde-banner-footer-usage-link"
						:href="faqPageLink"
						target="_blank"
						:title="$translate( 'faq-page-link-description' )"
					>
						{{ $translate( 'faq-page-link' ) }}
					</a>
				</div>
				<div class="wmde-banner-footer-item bold text-explanation">
					<span class="link-separator "> | </span>
					Eine Dauerspende ist jederzeit formlos kündbar. Sie gehen kein Risiko ein.
				</div>
			</div>
			<div class="second-row-items">
				<div class="wmde-banner-footer-item">
					<span>Wikimedia Deutschland ist der gemeinnützige Verein hinter Wikipedia. Jede Spende ist steuerlich
						absetzbar. Auf Wunsch erhalten Sie von uns eine Spendenquittung.</span>
				</div>
			</div>
		</div>

		<div class="wmde-banner-footer-bank">
			<label class="wmde-banner-footer-bank-item account">{{ $translate( 'donation-account' ) }}:
				<SelectionInput :value="'Wikimedia e. V.'"/>
			</label>
			<div class="wmde-banner-footer-bank-item iban-and-bic">
				<label class="wmde-banner-footer-bank-item iban">IBAN:
					<SelectionInput
						:value="'DE09 3702 0500 0003 2873 00'"
						:focusedValue="'DE09370205000003287300'"
					/>
				</label>
				<label class="wmde-banner-footer-bank-item bic">BIC:
					<SelectionInput :value="'BFSWDE33XXX'"/>
				</label>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import SelectionInput from '@src/components/Footer/SelectionInput.vue';

interface Props {
	faqPageLink: string,
	showFundsLink?: boolean,
}

withDefaults( defineProps<Props>(), {
	faqPageLink: '',
	showFundsLink: true
} );

defineEmits( [ 'showFundsModal' ] );

</script>
