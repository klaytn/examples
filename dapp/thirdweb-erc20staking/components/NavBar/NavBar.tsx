import { ConnectWallet } from "@thirdweb-dev/react";
import styles from './NavBar.module.css'

export default function NavBar() {
    return (
        <div className={styles.header}>
            <h1 className={styles.header_title}>Staking dApp</h1>
            <div className="header-connect-btn">
                <ConnectWallet />
            </div>
        </div>
    )
}
