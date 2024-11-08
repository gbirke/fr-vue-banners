<template>
	<div class="use-of-funds">
		<div class="use-of-funds-section">
			<div class="use-of-funds-section-intro">
				<h2 v-if="content.provisional !== ''" v-html="content.intro.dynamicHeadline.provisional"></h2>
				<h2 v-else v-html="content.intro.dynamicHeadline.published"></h2>
				<div>{{ content.intro.text }}</div>
			</div>
		</div>

		<FundsDistributionAccordion :application-of-funds-data="content.applicationOfFundsData" />

		<div class="use-of-funds-section">
			<p class="use-of-funds-info-text" v-html="content.detailedReports.mixed.text"></p>
		</div>
		<div class="use-of-funds-section use-of-funds-section-two-cols">
			<div class="use-of-funds-column">
				<div class="use-of-funds-benefits-list">
					<h2>{{ content.benefitsList.headline }}</h2>
					<ul class="use-of-funds-icon-list">
						<li
							v-for="benefit in content.benefitsList.benefits"
							:key=benefit.text
						>
							<BenefitsIcon :icon="benefit.icon"/>
							<span>{{ benefit.text }}</span>
						</li>
					</ul>
				</div>
			</div>
			<div class="use-of-funds-column">
				<div class="use-of-funds-comparison">
					<h2>{{ content.comparison.headline }}</h2>
					<div>
						<p v-for="text in content.comparison.paragraphs" :key="text">{{ text }}</p>
						<h3>{{ content.comparison.subhead }}</h3>
					</div>
					<CompanyBudgets
						:companies="content.comparison.companies"
						:citation-label="content.comparison.citationLabel"
					/>
				</div>
			</div>
		</div>
		<div class="use-of-funds-section use-of-funds-section-orgchart">
			<div class="use-of-funds-orgchart-text">
				<h2>{{ content.orgchart.headline }}</h2>
				<div>
					<p v-for="( paragraph, idx ) in content.orgchart.paragraphs" :key="idx" v-html="replaceOrganisations( paragraph )"></p>
				</div>
			</div>
			<div class="use-of-funds-orgchart-image">
				<slot name="infographic"/>
			</div>
		</div>
		<div class="banner_model-section use-of-funds-section-call-to-action">
			<button class="use-of-funds-button" @click="$emit( 'hideFundsModal' )">{{ content.callToAction }}</button>
		</div>
		<div v-if="content.provisional !== ''" class="use-of-funds-provisional">{{ content.provisional }}</div>
	</div>
</template>

<script setup lang="ts">

import BenefitsIcon from '@src/components/UseOfFunds/BenefitsIcon.vue';
import CompanyBudgets from '@src/components/UseOfFunds/CompanyBudgets.vue';
import FundsDistributionAccordion from '@src/components/UseOfFunds/FundsDistributionAccordion.vue';
import { UseOfFundsContent } from '@src/domain/UseOfFunds/UseOfFundsContent';

interface Props {
	content: UseOfFundsContent;
}

defineProps<Props>();
defineEmits( [ 'hideFundsModal' ] );

const replaceOrganisations = ( content: string ): string => {
	return content.replace( /<(wmf|wmde)>([^<]*)<\/\1>/g, '<span class="use-of-funds-org-$1">$2</span>' );
};

</script>
