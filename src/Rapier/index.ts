import { TRapier } from "./types";

let RAPIER: TRapier | null = null;

export const initRapier = async (): Promise<TRapier> => {
  if (RAPIER) {
    return RAPIER;
  }

  const rapier = await import("@dimforge/rapier3d");

  return rapier;
};
