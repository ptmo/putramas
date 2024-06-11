document.addEventListener('DOMContentLoaded', () => {
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  if (isLoggedIn === 'true') {
    document.getElementById('auth-container').style.display = 'none';
    document.getElementById('portfolio-details-content').style.display = 'block';
    updateWalletInfo();
  }

  document.getElementById('loginButton').onclick = async () => {
    if (typeof window.ethereum !== 'undefined') {
      const web3 = new Web3(window.ethereum);
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const chainId = await web3.eth.getChainId();
        const allowedNetworks = ['1', '56', '137', '43114', '250', '204', '42161', '5000', '5001', '324', '10', '97'];

        if (allowedNetworks.includes(chainId.toString())) {
          const accounts = await web3.eth.getAccounts();
          const account = accounts[0];
          const message = 'https://wwww.putramas.my.id sign this message to log in Putramas Official.';
          const signature = await web3.eth.personal.sign(message, account, '');

          const signer = await web3.eth.personal.ecRecover(message, signature);
          if (signer.toLowerCase() === account.toLowerCase()) {
            document.getElementById('auth-container').style.display = 'none';
            document.getElementById('portfolio-details-content').style.display = 'block';

            localStorage.setItem('isLoggedIn', 'true');
            updateWalletInfo();
          } else {
            alert('Signature verification failed. Please try again.');
          }
        } else {
          alert('Please switch to an allowed network.');
          const network = getNetworkSwitchParams(chainId);
          await ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: Web3.utils.toHex(network.chainId) }]
          });

          const newChainId = await web3.eth.getChainId();
          if (allowedNetworks.includes(newChainId.toString())) {
            const accounts = await web3.eth.getAccounts();
            const account = accounts[0];
            const message = 'Please sign this message to log in.';
            const signature = await web3.eth.personal.sign(message, account, '');

            const signer = await web3.eth.personal.ecRecover(message, signature);
            if (signer.toLowerCase() === account.toLowerCase()) {
              document.getElementById('auth-container').style.display = 'none';
              document.getElementById('portfolio-details-content').style.display = 'block';

              localStorage.setItem('isLoggedIn', 'true');
              updateWalletInfo();
            } else {
              alert('Signature verification failed. Please try again.');
            }
          } else {
            alert('Network switch failed. Please switch to an allowed network manually.');
          }
        }
      } catch (error) {
        console.error(error);
        alert('An error occurred while connecting to MetaMask.');
      }
    } else {
      alert('Please install MetaMask!');
    }
  };

  document.getElementById('logoutButton').onclick = () => {
    localStorage.removeItem('isLoggedIn');
    document.getElementById('auth-container').style.display = 'block';
    document.getElementById('portfolio-details-content').style.display = 'none';
  };

  async function updateWalletInfo() {
    const web3 = new Web3(window.ethereum);
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];
    const chainId = await web3.eth.getChainId();
    const nativeCurrency = getNativeCurrency(chainId);
    const balance = await web3.eth.getBalance(account);

    document.getElementById('account-address').innerText = account;
    document.getElementById('account-balance').innerText = web3.utils.fromWei(balance, 'ether') + ' ' + nativeCurrency;
  }

  if (typeof window.ethereum !== 'undefined') {
    window.ethereum.on('accountsChanged', (accounts) => {
      if (accounts.length === 0) {
        localStorage.removeItem('isLoggedIn');
        document.getElementById('auth-container').style.display = 'block';
        document.getElementById('portfolio-details-content').style.display = 'none';
      } else {
        updateWalletInfo();
      }
    });

    window.ethereum.on('chainChanged', (chainId) => {
      if (!['1', '56', '137', '43114', '250', '204', '42161', '5000', '5001', '324', '10', '97'].includes(chainId.toString())) {
        localStorage.removeItem('isLoggedIn');
        document.getElementById('auth-container').style.display = 'block';
        document.getElementById('portfolio-details-content').style.display = 'none';
      } else {
        updateWalletInfo();
      }
    });
  }

  function getNativeCurrency(chainId) {
    const nativeCurrencies = {
      '1': 'ETH',
      '56': 'BNB',
      '137': 'MATIC',
      '43114': 'AVAX',
      '250': 'FTM',
      '204': 'BNB',
      '42161': 'ETH',
      '5000': 'MNT',
      '5001': 'MNT',
      '324': 'ETH',
      '10': 'ETH',
      '97': 'tBNB'
    };
    return nativeCurrencies[chainId.toString()] || 'ETH';
  }

      function getNetworkSwitchParams(chainId) {
        const networks = {
          1: { chainId: '0x1', chainName: 'Ethereum Mainnet', nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 }, rpcUrls: ['https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID'], blockExplorerUrls: ['https://etherscan.io'] },
          56: { chainId: '0x38', chainName: 'Binance Smart Chain', nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 }, rpcUrls: ['https://bsc-dataseed.binance.org/'], blockExplorerUrls: ['https://bscscan.com/'] },
          137: { chainId: '0x89', chainName: 'Polygon', nativeCurrency: { name: 'Matic', symbol: 'MATIC', decimals: 18 }, rpcUrls: ['https://rpc-mainnet.matic.network'], blockExplorerUrls: ['https://explorer.matic.network/'] },
          43114: { chainId: '0xa86a', chainName: 'Avalanche Mainnet', nativeCurrency: { name: 'AVAX', symbol: 'AVAX', decimals: 18 }, rpcUrls: ['https://api.avax.network/ext/bc/C/rpc'], blockExplorerUrls: ['https://cchain.explorer.avax.network/'] },
          250: { chainId: '0xfa', chainName: 'Fantom Opera', nativeCurrency: { name: 'FTM', symbol: 'FTM', decimals: 18 }, rpcUrls: ['https://rpc.ftm.tools'], blockExplorerUrls: ['https://ftmscan.com/'] },
          204: { chainId: '0xcc', chainName: 'OpBNB Mainnet', nativeCurrency: { name: 'OpBNB', symbol: 'BNB', decimals: 18 }, rpcUrls: ['https://opbnb-mainnet-rpc.bnbchain.org'], blockExplorerUrls: ['https://opbnb.bscscan.com/'] },
          42161: { chainId: '0xa4b1', chainName: 'Arbitrum One', nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 }, rpcUrls: ['https://arb1.arbitrum.io/rpc'], blockExplorerUrls: ['https://arbiscan.io/'] },
          5000: { chainId: '0x1388', chainName: 'Mantle', nativeCurrency: { name: 'MNT', symbol: 'MNT', decimals: 18 }, rpcUrls: ['https://rpc.mantle.xyz/'], blockExplorerUrls: ['https://explorer.mantle.xyz/'] },
          5001: { chainId: '0x1389', chainName: 'Mantle Testnet', nativeCurrency: { name: 'MNT', symbol: 'MNT', decimals: 18 }, rpcUrls: ['https://rpc.testnet.mantle.xyz/'], blockExplorerUrls: ['https://explorer.testnet.mantle.xyz/'] },
          324: { chainId: '0x144', chainName: 'zkSync Mainnet', nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 }, rpcUrls: ['https://api.zksync.io'], blockExplorerUrls: ['https://zkscan.io/'] },
          10: { chainId: '0xa', chainName: 'Optimistic Ethereum', nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 }, rpcUrls: ['https://mainnet.optimism.io'], blockExplorerUrls: ['https://optimistic.etherscan.io/'] },
          97: { chainId: '0x61', chainName: 'Binance Smart Chain Testnet', nativeCurrency: { name: 'tBNB', symbol: 'tBNB', decimals: 18 }, rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'], blockExplorerUrls: ['https://testnet.bscscan.com/'] }
        };
        return networks[chainId] || networks[1];
      }
    });
