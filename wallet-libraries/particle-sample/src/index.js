import React from 'react';
import ReactDOM from 'react-dom/client';
import { ModalProvider } from '@particle-network/connectkit';
import '@particle-network/connectkit/dist/index.css';
import { Klaytn, KlaytnTestnet} from '@particle-network/chains';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <ModalProvider
            options={{
                projectId: 'replace with your projectId',
                clientKey: 'replace with your clientKey',
                appId: 'replace with your appId',
                chains: [KlaytnTestnet, Klaytn],
                wallet: {
                    visible: true,
                    supportChains: [KlaytnTestnet, Klaytn],
                    customStyle: {},
                },
                promptSettingConfig: {
                    promptPaymentPasswordSettingWhenSign: 1,
                    promptMasterPasswordSettingWhenLogin: 1
                },
                connectors: evmWallets({ 
                    projectId: 'replace with your walletconnect projectId',
                    showQrModal: false
                }),
            }}
            theme={'light'}
            language={'en'}
            walletSort={['Particle Auth', 'Wallet']}
        >
            <App />
        </ModalProvider>
    </React.StrictMode>
);

