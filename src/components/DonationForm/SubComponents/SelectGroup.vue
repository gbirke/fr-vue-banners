<template>
	<div :class="[
		'wmde-banner-select-group-container',
		fieldName,
		{ 'wmde-banner-select-group-container--with-error': !isValid }
	]">
		<div class="wmde-banner-select-group">
			<div v-for="{ value, label, className, notice } in selectionItems" :key="value" :class="[
				'wmde-banner-select-group-option',
				className,
				{
					'wmde-banner-disabled': disabledOptions.indexOf( value ) > -1,
					'active': value === inputValue
				}
			]">
				<label>
					<input
						type="radio"
						@change="onChange"
						:checked="value === inputValue"
						:name="fieldName"
						:value="value"
						:disabled="disabledOptions.indexOf( value ) > -1"
						class="wmde-banner-select-group-input"
					/>
					<slot name="select-group-label" :label="label" :slotName="className">
						<span class="wmde-banner-select-group-label">{{ label }}</span>
					</slot>
				</label>
				<span v-if="notice" class="wmde-banner-select-group-notice" :class="{ selected: value === inputValue }">
					{{ notice }}
				</span>
			</div>
			<slot/>
		</div>

		<span v-if="errorMessage" class="wmde-banner-select-group-error-message">
			<span class="wmde-banner-error-icon">{{ errorMessage }}</span>
		</span>

	</div>
</template>

<script setup lang="ts">
import { FormItem } from '@src/utils/FormItemsBuilder/FormItem';

interface Props {
	fieldName: string;
	isValid: boolean;
	selectionItems: FormItem[];
	disabledOptions?: string[];
	errorMessage?: string;
	inputValue: string;
}

withDefaults( defineProps<Props>(),
	{
		disabledOptions: (): string[] => []
	}
);

const emit = defineEmits( [ 'update:inputValue' ] );

const onChange = ( e: Event ): void => {
	emit( 'update:inputValue', ( e.target as HTMLInputElement ).value );
};

</script>
