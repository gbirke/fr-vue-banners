<template>
	<div>
		<header class="header">
			<div class="header-left">
				<h1>FUN Forge</h1>
				<a
					class="header-link header-git"
					target="_blank"
					:href="`https://github.com/wmde/fundraising-banners/tree/${branchName}`">
					<IconGit /> {{ branchName }}
				</a>
			</div>
			<div class="header-right">
				<a href="https://meta.wikimedia.org/w/index.php?title=Special:CentralNotice" class="header-link">CN</a>
				<a href="https://meta.wikimedia.org/wiki/Special:CentralNoticeBanners" class="header-link">CN Banners</a>
				<a href="#" class="header-link header-link-refresh" @click.prevent="refresh"><IconRefresh /></a>
			</div>
		</header>

		<section class="content">
			<div class="campaigns">
				<BannerCampaign
					v-if="currentCampaign"
					class="campaign current-branch"
					:campaign="currentCampaign"
					:compile-info="compileInfo[ currentCampaign.banners.ctrl.pageName ]"
					:pull-request-url="campaignUrlMap[ currentCampaign.campaign ]"
					:style="{ '--index': 0 }"
					@doScreenshots="onDoScreenshots"
				/>
				<BannerCampaign
					v-for="( campaign, index ) in filteredCampaignList"
					:key="campaign.campaign"
					class="campaign"
					:campaign="campaign"
					:compile-info="compileInfo[ campaign.banners.ctrl.pageName ]"
					:pull-request-url="campaignUrlMap[ campaign.campaign ]"
					:style="{ '--index': Number( index ) + 1 }"
					@doScreenshots="onDoScreenshots"
				/>
			</div>
		</section>

		<footer class="footer">
			<div class="footer-left">Welcome to the Fun Forge, we got fun campaigns!</div>
			<div class="footer-right"><a href="#" class="footer-link">Docs</a></div>
		</footer>
	</div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import BannerCampaign from './BannerCampaign.vue';
import IconGit from './IconGit.vue';
import IconRefresh from './IconRefresh.vue';
import type { Campaign, CampaignConfig } from '../../webpack/campaign_config_types';
import { CompileInfo, parseCompileInfo } from '../util';

const props = defineProps<{ campaigns: CampaignConfig, gitBranch: string }>();
let branchName = ref<string>( props.gitBranch );
const compileInfo = ref<Record<string, CompileInfo>>( {} );
const gitFailurePrefix = /^UNKNOWN -/;

const campaignList = computed( (): Campaign[] => Object.values( props.campaigns ) );
const currentCampaign = computed( (): Campaign =>
	campaignList.value.find( ( c: Campaign ) => c.campaign === branchName.value ) );
const filteredCampaignList = computed( (): Campaign[] =>
	campaignList.value.filter( ( c: Campaign ) => c.campaign !== branchName.value ) );

const campaignUrlMap = ref<Record<string, string>>( {} );

const updateFileList = async (): Promise<void> => {
	const fileList = await fetch( '/compiled-banners/' ).then( response => response.ok ? response.text() : '' );
	if ( fileList ) {
		compileInfo.value = parseCompileInfo( fileList );
	}
};

const updatePullRequestInfo = async (): Promise<void> => {
	const allPullRequests = await fetch( 'https://api.github.com/repos/wmde/fundraising-banners/pulls?state=all' )
		.then( response => response.json() );

	if ( allPullRequests ) {
		campaignList.value.forEach( ( campaign: Campaign ) => {
			const matchingPr = allPullRequests.find( ( pr: { title: string; html_url: string } ) =>
				campaign.campaign === pr.title );
			campaignUrlMap.value[ campaign.campaign ] =
				matchingPr ? matchingPr.html_url : 'https://github.com/wmde/fundraising-banners/pulls';
		} );
	}
};

onMounted( async () => {
	try {
		await Promise.all( [ updateFileList(), updatePullRequestInfo() ] );
	} catch ( error ) {
		console.error( 'Error:', error.message );
	}
} );

const onDoScreenshots = ( campaignName: string ): void => {
	navigator.clipboard.writeText( `ssh -t funweb3-deploy "queue_screenshots ${ campaignName }"` )
		.then( () => {
			// TODO indicate the copying was successful by making something flash
		} );
};

if ( props.gitBranch.match( gitFailurePrefix ) ) {
	branchName.value = props.gitBranch.replace( gitFailurePrefix, '' );
}

const refresh = ( e: Event ): void => {
	e.preventDefault();
	window.location.reload();
};

</script>
