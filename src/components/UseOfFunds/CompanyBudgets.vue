<template>
	<ul class="company-budgets">
		<li
			class="company-budgets-row"
			v-for="company in companies"
			:key="company.name"
			:class="`company-budgets-row-${ company.name.toLowerCase() }`"
		>
			<span class="company-budgets-col-company">{{ company.name }}</span>
			<span class="company-budgets-col-graph">
				<span class="company-budgets-budget-line" :style="{ width: ( company.budget / highestBudget * 100 ) + '%' }">&#xa0;</span>
			</span>
			<span class="company-budgets-col-number">
				{{ company.budgetString }}
			</span>
			<span class="company-budgets-col-citation">
				<CompanyCitation :company="company" :citation-label="citationLabel"/>
			</span>
		</li>
	</ul>
</template>

<script setup lang="ts">

import { computed } from 'vue';
import CompanyCitation from '@src/components/UseOfFunds/CompanyCitation.vue';
import { Company } from '@src/domain/UseOfFunds/Company';

interface Props {
	companies: Company[];
	citationLabel: string;
}

const props = defineProps<Props>();

const highestBudget = computed( () => props.companies.reduce( ( budget: number, company: Company ) =>
	Math.max( budget, company.budget ), 0 )
);

</script>
