import styles from "../styles/Home.module.css";
import StakeToken from "../components/StakeToken/StakeToken";
import RewardStakeToken from "../components/RewardStakeTokens/RewardStakeToken";
import Stake from "../components/Stake/Stake";
import { NextPage } from "next";
import { useAddress } from "@thirdweb-dev/react";

const Home: NextPage = () => {
  const address = useAddress()

  if (!address) {
    return (
      <p className={styles.connect_text}><strong>Please Connect Your Wallet</strong></p>
    )
  }

  return (
    <main className={styles.mainContainer}>
      <div className={styles.container}>
        <StakeToken/>
        <RewardStakeToken /> 
      </div>
        <div className={styles.stakeContainer}>
          <Stake/>
        </div>
    </main>
  );
};

export default Home;
