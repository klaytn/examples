export const stepData = [
	{ rangeTo: 50, price: 0 }, // Since price is 0, the first 50 tokens will be allocated to the creator
	{ rangeTo: 100, price: 0.01 }, // 0.01 WKLAY for the next 50 tokens
	{ rangeTo: 1000, price: 0.1 }, // 0.1 WKLAY for the next 900 tokens
	{ rangeTo: 10_000, price: 1 }, // 1 WKLAY for the next 9000 tokens
]
 
export const curveData = {
	curveType: 'LINEAR', 
	stepCount: 10,
	maxSupply: 10_000,
	initialMintingPrice: 0.01, // 0.01 WKLAY 
	finalMintingPrice: 0.1, // 0.1 WKLAY
	creatorAllocation: 100,
}