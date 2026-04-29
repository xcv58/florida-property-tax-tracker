import statusData from "../../data/status.json";
import timelineData from "../../data/timeline.json";
import proposalsData from "../../data/proposals.json";
import countiesData from "../../data/counties.json";
import updateLogData from "../../data/update-log.json";
import glossaryData from "../../data/glossary.json";
import { claims, claimById, getClaims, getClaimSources } from "./claims";
import { getSources, sourceById, sources, sourceTypeLabel } from "./sources";

export const status = statusData;
export const timeline = timelineData;
export const proposals = proposalsData;
export const counties = countiesData;
export const updateLog = updateLogData;
export const glossary = glossaryData;

export {
  claims,
  claimById,
  getClaims,
  getClaimSources,
  getSources,
  sourceById,
  sources,
  sourceTypeLabel,
};

export type TimelineItem = (typeof timelineData)[number];
export type Proposal = (typeof proposalsData)[number];
export type County = (typeof countiesData)[number];
export type UpdateLogEntry = (typeof updateLogData)[number];
