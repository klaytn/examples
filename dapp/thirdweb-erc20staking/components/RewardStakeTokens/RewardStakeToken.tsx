import { useAddress, useContract, useTokenBalance } from "@thirdweb-dev/react";
import { REWARD_TOKEN_ADDRESS } from "../../constants/contract-addresses";
import styles from "./RewardStakeToken.module.css";

export default function RewardStakeToken() {
  const address = useAddress();
  const { contract: rewardStakeTokenContract, isLoading: loadingStakeToken } =
    useContract(REWARD_TOKEN_ADDRESS);
  const { data: tokenBalance, isLoading: loadingTokenBalance } =
    useTokenBalance(rewardStakeTokenContract, address);

  return (
    <div className={styles.rewardStakeTokenCard}>
      <h2>Reward Tokens</h2>
      {!loadingStakeToken && !loadingTokenBalance ? (
        <div className={styles.rewardStakeTokenBalance}>
          <p>${tokenBalance?.symbol}</p>
          <p>{Number(tokenBalance?.displayValue).toFixed(1)}</p>
        </div>
      ) : (
        <p>loading....</p>
      )}
    </div>
  );
}
