import type { ABI } from "../../src/types";

export const isInstantiationFunction = (abi: ABI, fn: ABI['abi']['fns'][number]) => !fn.mutability && fn.ident === `instantiate_${abi.blueprint_name.toLowerCase()}`

export const isMethod = (fn: ABI['abi']['fns'][number]) => fn.mutability === "Mutable"