<template>
	<div class="campaign">
		<div class="campaign-title">
			<div class="campaign-icon">
				<DeviceMobile v-if="campaign.icon === 'mobile'"/>
				<DevicePad v-else-if="campaign.icon === 'pad'"/>
				<DeviceDesktop v-else/>
			</div>
			<div :title="campaign.name">{{ campaign.name }}
				<pre class="campaign-cn-link" v-if="campaign.banners.ctrl.pageName.includes('WPDE')">{{ campaign.campaign }}</pre>
				<a
					v-else
					class="campaign-cn-link"
					:href="`https://meta.wikimedia.org/w/index.php?title=Special:CentralNotice&subaction=noticeDetail&notice=${campaign.campaign}`"
					target="_blank"
					data-tooltip="View Central Notice Settings"
				>
					{{ campaign.campaign }}
				</a>
				<a v-if="pullRequestUrl==='https://github.com/wmde/fundraising-banners/pulls'"
					class="pr-icon"
					data-tooltip="Go to PR overview"
					:href="pullRequestUrl"
					target="_blank"
					title="Go to PR overview"
				>
					<IconPullRequest/>
				</a>
				<a v-else
					class="pr-icon"
					data-tooltip="Go to GitHub PR"
					:href="pullRequestUrl"
					target="_blank"
					title="Go to GitHub PR"
				>
					<IconPullRequest/>
				</a>
			</div>
			<div class="campaign-title-icons">
				<span :data-tooltip="campaign.description" class="link-icon link-icon-large">
					<IconInfo/>
				</span>
				<a
					:href="`https://shutterbug.wikimedia.de/#/slides/${campaign.tracking}`"
					target="_blank"
					class="link-icon link-icon-large"
					data-tooltip="View in Shutterbug"
				>
					<IconShutterbug />
				</a>
				<a
					href="#"
					class="link-icon link-icon-large"
					data-tooltip="Copy Shutterbug Command"
					@click.prevent="$emit('doScreenshots', campaign.name)"
				>
					<IconCommand />
				</a>
			</div>
		</div>
		<div class="campaign-content">
			<div class="campaign-banners">
				<div class="campaign-banner">
					<BannerActions
						:campaign="campaign"
						:banner="campaign.banners.ctrl"
						:compileInfo="compileInfo"
						:isWPDE="campaign.banners.ctrl.pageName.includes('WPDE')"
					/>
				</div>
				<div class="campaign-banner" v-if="campaign.banners.var">
					<BannerActions
						:campaign="campaign"
						:banner="campaign.banners.var"
						:compileInfo="compileInfo"
						:isWPDE="campaign.banners.var.pageName.includes('WPDE')"
					/>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">

import BannerActions from './BannerActions.vue';
import DeviceDesktop from './DeviceDesktop.vue';
import DeviceMobile from './DeviceMobile.vue';
import DevicePad from './DevicePad.vue';
import IconCommand from './IconCommand.vue';
import IconInfo from './IconInfo.vue';
import IconPullRequest from './IconPullRequest.vue';
import IconShutterbug from './IconShutterbug.vue';
import { Campaign } from '../../webpack/campaign_config_types';
import { CompileInfo } from '../util';

interface Props {
	campaign: Campaign,
	compileInfo?: CompileInfo,
	pullRequestUrl?: string
}

defineProps<Props>();

defineEmits( [ 'doScreenshots' ] );

</script>
