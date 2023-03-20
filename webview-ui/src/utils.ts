import type { ABI } from "../../src/types";

export const isMethod = (fn: ABI['abi']['fns'][number]) => fn.mutability === "Mutable"

export const shortenAddress = (address: string) =>
    `${address.slice(0, 4)}...${address.slice(
        address.length - 6,
        address.length
    )}`