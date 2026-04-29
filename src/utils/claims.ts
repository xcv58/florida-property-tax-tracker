import claimsData from "../../data/claims.json";
import { getSources } from "./sources";

export type Claim = (typeof claimsData)[number];

export const claims = claimsData;
export const claimById = new Map(claims.map((claim) => [claim.id, claim]));

export function getClaims(claimIds: string[] = []): Claim[] {
  return claimIds
    .map((claimId) => claimById.get(claimId))
    .filter((claim): claim is Claim => Boolean(claim));
}

export function getClaimSources(claim: Claim) {
  return getSources(claim.source_ids);
}
