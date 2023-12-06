import {
  Web3Button,
  useAddress,
  useContract,
  useContractRead,
  useTokenBalance,
} from "@thirdweb-dev/react";
import {
  STAKE_TOKEN_ADDRESS,
  REWARD_TOKEN_ADDRESS,
  STAKE_CONTRACT_ADDRESS,
} from "../../constants/contract-addresses";
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import styles from "./Stake.module.css";

export default function Stake() {
  const address = useAddress();

  const { contract: stakeTokenContract } = useContract(
    STAKE_TOKEN_ADDRESS,
    "token"
  );
  const { contract: rewardStakeTokenContract } = useContract(
    REWARD_TOKEN_ADDRESS,
    "token"
  );
  const { contract: stakeContract } = useContract(
    STAKE_CONTRACT_ADDRESS,
    "custom"
  );

  const {
    data: stakeInfo,
    refetch: refetchStakeInfo,
    isLoading: loadingStakeInfo,
  } = useContractRead(stakeContract, "getStakeInfo", [address]);

  const { data: stakeTokenBalance, isLoading: loadingStakeTokenBalance } =
    useTokenBalance(stakeTokenContract, address);

  const {
    data: rewardStakeTokenBalance,
    isLoading: loadingRewardStakeTokenBalance,
  } = useTokenBalance(rewardStakeTokenContract, address);

  useEffect(() => {
    setInterval(() => {
      refetchStakeInfo();
    }, 10000);
  }, []);

  const [stakeAmount, setStakeAmount] = useState<string>("0");
  const [unstakeAmount, setUnstakeAmount] = useState<string>("0");

  function resetValue() {
    setStakeAmount("0");
    setUnstakeAmount("0");
  }

  return (
    <div>
      <h2 className={styles.stakeCenterText}>Earn Reward Tokens</h2>
      <div className={styles.stakeCenter}>
        <div>
          <p>Stake Token:</p>
          {!loadingStakeInfo && !loadingStakeTokenBalance ? (
            <div>
              {stakeInfo && stakeInfo[0] ? (
                <p>
                  {ethers.utils.formatEther(stakeInfo[0])}{" "}
                  {"$ " + stakeTokenBalance?.symbol}
                </p>
              ) : (
                <p>0</p>
              )}
            </div>
          ) : (
            <p>loading...</p>
          )}
          <div className={styles.stakeContentCenter}>
            <div className={styles.stakeForm}>
              <input
                type="number"
                max={stakeTokenBalance?.displayValue}
                value={stakeAmount}
                onChange={(e) => {
                  setStakeAmount(e.target.value);
                }}
              />

              <Web3Button
                contractAddress={STAKE_CONTRACT_ADDRESS}
                action={async (contract) => {
                  await stakeTokenContract?.setAllowance(
                    STAKE_CONTRACT_ADDRESS,
                    stakeAmount
                  );
                  await contract.call("stake", [
                    ethers.utils.parseEther(stakeAmount),
                  ]);

                  resetValue();
                }}
                onSuccess={() => {
                  alert("Staking was successful");
                }}
              >
                Stake
              </Web3Button>
            </div>
            <div className={styles.unstakeForm}>
              <input
                type="number"
                value={unstakeAmount}
                onChange={(e) => {
                  setUnstakeAmount(e.target.value);
                }}
              />

              <Web3Button
                contractAddress={STAKE_CONTRACT_ADDRESS}
                action={async (contract) => {
                  await contract.call("withdraw", [
                    ethers.utils.parseEther(unstakeAmount),
                  ]);

                  resetValue();
                }}
                onSuccess={() => {
                  alert("Unstake was successful");
                }}
              >
                UnStake
              </Web3Button>
            </div>
          </div>
        </div>
        <div>
          <p>Reward Token</p>
          {!loadingStakeInfo && !loadingStakeTokenBalance ? (
            <div>
              {stakeInfo && stakeInfo[0] ? (
                <p>
                  {ethers.utils.formatEther(stakeInfo[1])}{" "}
                  {"$ " + rewardStakeTokenBalance?.symbol}
                </p>
              ) : (
                <p>0</p>
              )}
            </div>
          ) : (
            <p>loading...</p>
          )}

          <Web3Button
            contractAddress={STAKE_CONTRACT_ADDRESS}
            action={async (contract) => {
              await contract.call("claimRewards");
              resetValue();
            }}
            onSuccess={() => {
              alert("Claim Reward was successful");
            }}
          >
            Claim
          </Web3Button>
        </div>
      </div>
    </div>
  );
}
