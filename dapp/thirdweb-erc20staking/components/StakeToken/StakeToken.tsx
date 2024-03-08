import { useAddress, useContract, useTokenBalance } from "@thirdweb-dev/react";
import { STAKE_TOKEN_ADDRESS } from "../../constants/contract-addresses";
import styles from "./StakeToken.module.css";

export default function StakeToken() {
  const address = useAddress();
  const { contract: stakeTokenContract, isLoading: loadingStakeToken } =
    useContract(STAKE_TOKEN_ADDRESS);
  const { data: tokenBalance, isLoading: loadingTokenBalance } =
    useTokenBalance(stakeTokenContract, address);

  const { contract: stakeTokenCont, isLoading: loadingStakeTok } =
    useContract(STAKE_TOKEN_ADDRESS);

  return (
    <div className={styles.stakeTokenCard}>
      <h2>Stake Tokens</h2>
      {!loadingStakeToken && !loadingTokenBalance ? (
        <div className={styles.stakeTokenBalance}>
          <p>${tokenBalance?.symbol}</p>
          <p>{tokenBalance?.displayValue}</p>
        </div>
      ) : (
        <p>loading....</p>
      )}
    </div>
  );
}
