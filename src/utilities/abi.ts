import { BlueprintT } from "../types";

export const instantiationFunctionName = (blueprint: BlueprintT) => `instantiate_${blueprint.name.toLowerCase()}`