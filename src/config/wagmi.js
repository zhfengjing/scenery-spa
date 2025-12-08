import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { hardhat, mainnet, sepolia } from "wagmi/chains";


// 定义支持的网络
export const supportedChains = [sepolia, hardhat, mainnet];

export const config = getDefaultConfig({
	appName: "Web3 University",
	projectId: process.env.WALLETCONNECT_PROJECT_ID || "YOUR_PROJECT_ID",
	chains: supportedChains,
	ssr: false,
});
