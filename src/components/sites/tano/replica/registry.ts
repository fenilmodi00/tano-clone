import type { ComponentType } from "react";

import { HomeReplica } from "./HomeReplica";
import { CareersReplica } from "./CareersReplica";
import { CareersProductEngineerReplica } from "./CareersProductEngineerReplica";
import { CareersProductSecurityEngineerReplica } from "./CareersProductSecurityEngineerReplica";
import { CareersSeniorAccountManagerReplica } from "./CareersSeniorAccountManagerReplica";
import { CaseStudiesReplica } from "./CaseStudiesReplica";
import { CaseStudiesBloomAndWildReplica } from "./CaseStudiesBloomAndWildReplica";
import { CaseStudiesHellofreshReplica } from "./CaseStudiesHellofreshReplica";
import { CaseStudiesPapierReplica } from "./CaseStudiesPapierReplica";
import { CaseStudiesSkinAndMeReplica } from "./CaseStudiesSkinAndMeReplica";
import { CompareReplica } from "./CompareReplica";
import { CompareAgentioVsTanoReplica } from "./CompareAgentioVsTanoReplica";
import { CompareGrinVsTanoReplica } from "./CompareGrinVsTanoReplica";
import { CompareLtkVsTanoReplica } from "./CompareLtkVsTanoReplica";
import { CompareShopmyVsTanoReplica } from "./CompareShopmyVsTanoReplica";
import { ForCreatorsReplica } from "./ForCreatorsReplica";
import { GuidesReplica } from "./GuidesReplica";
import { GuidesCreatorAdsReplica } from "./GuidesCreatorAdsReplica";
import { GuidesCreatorProgrammeCostReplica } from "./GuidesCreatorProgrammeCostReplica";
import { GuidesInfluencerAgencyOrPlatformReplica } from "./GuidesInfluencerAgencyOrPlatformReplica";
import { GuidesKeepCreatorsLongTermReplica } from "./GuidesKeepCreatorsLongTermReplica";
import { GuidesMetaCreatorMarketingHubReplica } from "./GuidesMetaCreatorMarketingHubReplica";
import { GuidesMetaMuseCreatorMarketingReplica } from "./GuidesMetaMuseCreatorMarketingReplica";
import { GuidesMetaMuseCreatorsBriefReplica } from "./GuidesMetaMuseCreatorsBriefReplica";
import { GuidesMetaMuseNanoMicroCreatorsReplica } from "./GuidesMetaMuseNanoMicroCreatorsReplica";
import { GuidesOutgrownInfluencerAgencyReplica } from "./GuidesOutgrownInfluencerAgencyReplica";
import { GuidesScaleCreatorProgrammeWithoutHeadcountReplica } from "./GuidesScaleCreatorProgrammeWithoutHeadcountReplica";
import { GuidesTrybeAlternativesReplica } from "./GuidesTrybeAlternativesReplica";
import { GuidesUgcAiShoppingAgentsReplica } from "./GuidesUgcAiShoppingAgentsReplica";
import { GuidesUsageRightsPricingReplica } from "./GuidesUsageRightsPricingReplica";
import { GuidesWinOnMetaMuseWithCreatorsReplica } from "./GuidesWinOnMetaMuseWithCreatorsReplica";
import { NewsReplica } from "./NewsReplica";
import { NewsTanoRaises4mSeedRoundReplica } from "./NewsTanoRaises4mSeedRoundReplica";
import { PlaybooksReplica } from "./PlaybooksReplica";
import { PlaybooksContentAnalysisFrameworkReplica } from "./PlaybooksContentAnalysisFrameworkReplica";
import { PlaybooksCreatorDiscoveryReplica } from "./PlaybooksCreatorDiscoveryReplica";
import { PlaybooksCreatorPartnershipAdsReplica } from "./PlaybooksCreatorPartnershipAdsReplica";
import { PlaybooksRebriefingReplica } from "./PlaybooksRebriefingReplica";
import { PlaybooksSelfFundingSeedingAffiliateReplica } from "./PlaybooksSelfFundingSeedingAffiliateReplica";
import { PrivacyPolicyReplica } from "./PrivacyPolicyReplica";
import { TalkToUsReplica } from "./TalkToUsReplica";
import { UseCasesCreativeVelocityReplica } from "./UseCasesCreativeVelocityReplica";
import { UseCasesDriveRevenueReplica } from "./UseCasesDriveRevenueReplica";
import { WebinarsReplica } from "./WebinarsReplica";

export const replicas: Record<string, ComponentType> = {
  "/": HomeReplica,
  "/careers": CareersReplica,
  "/careers/product-engineer": CareersProductEngineerReplica,
  "/careers/product-security-engineer": CareersProductSecurityEngineerReplica,
  "/careers/senior-account-manager": CareersSeniorAccountManagerReplica,
  "/case-studies": CaseStudiesReplica,
  "/case-studies/bloom-and-wild": CaseStudiesBloomAndWildReplica,
  "/case-studies/hellofresh": CaseStudiesHellofreshReplica,
  "/case-studies/papier": CaseStudiesPapierReplica,
  "/case-studies/skin-and-me": CaseStudiesSkinAndMeReplica,
  "/compare": CompareReplica,
  "/compare/agentio-vs-tano": CompareAgentioVsTanoReplica,
  "/compare/grin-vs-tano": CompareGrinVsTanoReplica,
  "/compare/ltk-vs-tano": CompareLtkVsTanoReplica,
  "/compare/shopmy-vs-tano": CompareShopmyVsTanoReplica,
  "/for-creators": ForCreatorsReplica,
  "/guides": GuidesReplica,
  "/guides/creator-ads": GuidesCreatorAdsReplica,
  "/guides/creator-programme-cost": GuidesCreatorProgrammeCostReplica,
  "/guides/influencer-agency-or-platform": GuidesInfluencerAgencyOrPlatformReplica,
  "/guides/keep-creators-long-term": GuidesKeepCreatorsLongTermReplica,
  "/guides/meta-creator-marketing-hub": GuidesMetaCreatorMarketingHubReplica,
  "/guides/meta-muse-creator-marketing": GuidesMetaMuseCreatorMarketingReplica,
  "/guides/meta-muse-creators-brief": GuidesMetaMuseCreatorsBriefReplica,
  "/guides/meta-muse-nano-micro-creators": GuidesMetaMuseNanoMicroCreatorsReplica,
  "/guides/outgrown-influencer-agency": GuidesOutgrownInfluencerAgencyReplica,
  "/guides/scale-creator-programme-without-headcount": GuidesScaleCreatorProgrammeWithoutHeadcountReplica,
  "/guides/trybe-alternatives": GuidesTrybeAlternativesReplica,
  "/guides/ugc-ai-shopping-agents": GuidesUgcAiShoppingAgentsReplica,
  "/guides/usage-rights-pricing": GuidesUsageRightsPricingReplica,
  "/guides/win-on-meta-muse-with-creators": GuidesWinOnMetaMuseWithCreatorsReplica,
  "/news": NewsReplica,
  "/news/tano-raises-4m-seed-round": NewsTanoRaises4mSeedRoundReplica,
  "/playbooks": PlaybooksReplica,
  "/playbooks/content-analysis-framework": PlaybooksContentAnalysisFrameworkReplica,
  "/playbooks/creator-discovery": PlaybooksCreatorDiscoveryReplica,
  "/playbooks/creator-partnership-ads": PlaybooksCreatorPartnershipAdsReplica,
  "/playbooks/rebriefing": PlaybooksRebriefingReplica,
  "/playbooks/self-funding-seeding-affiliate": PlaybooksSelfFundingSeedingAffiliateReplica,
  "/privacy-policy": PrivacyPolicyReplica,
  "/talk-to-us": TalkToUsReplica,
  "/use-cases/creative-velocity": UseCasesCreativeVelocityReplica,
  "/use-cases/drive-revenue": UseCasesDriveRevenueReplica,
  "/webinars": WebinarsReplica,
};
