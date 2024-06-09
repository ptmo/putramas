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
              alert('Please switch to Ethereum Mainnet, BSC Mainnet, or Polygon Mainnet.');
              const network = getNetworkSwitchParams();
              await ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: network.chainId }]
              });

              const newChainId = await web3.eth.getChainId();
              if (allowedNetworks.includes(newChainId.toString())) {
                const accounts = await web3.eth.getAccounts();
                const account = accounts[0];
                const message = 'Please sign this message to log in Putramas Official.';
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
                alert('Network switch failed. Please switch to Ethereum Mainnet, BSC Mainnet, or Polygon Mainnet manually.');
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
        const balance = await web3.eth.getBalance(account);

        document.getElementById('account-address').innerText = account;
        document.getElementById('account-balance').innerText = web3.utils.fromWei(balance, 'ether') + ' ETH';
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
          if (!['1', '56', '137', '43114', '250', '204', '42161', '5000', '5001', '324', '10', '97'].includes(chainId)) {
            localStorage.removeItem('isLoggedIn');
            document.getElementById('auth-container').style.display = 'block';
            document.getElementById('portfolio-details-content').style.display = 'none';
          }
        });
      }

  function getNetworkSwitchParams() {
    return {
      chainId: '1',
      chainName: 'Ethereum Mainnet',
      nativeCurrency: {
        name: 'Ether',
        symbol: 'ETH',
        decimals: 18
      },
      networks: {
        56: {
          chainId: '56',
          chainName: 'Binance Smart Chain',
          nativeCurrency: {
            name: 'BNB',
            symbol: 'BNB',
            decimals: 18
          },
          rpcUrls: ['https://bsc-dataseed.binance.org/'],
          blockExplorerUrls: ['https://bscscan.com/']
        },
        137: {
          chainId: '137',
          chainName: 'Polygon',
          nativeCurrency: {
            name: 'Matic',
            symbol: 'MATIC',
            decimals: 18
          },
          rpcUrls: ['https://rpc-mainnet.matic.network'],
          blockExplorerUrls: ['https://explorer.matic.network/']
        },
        43114: {
          chainId: '43114',
          chainName: 'Avalanche Mainnet',
          nativeCurrency: {
            name: 'AVAX',
            symbol: 'AVAX',
            decimals: 18
          },
          rpcUrls: ['https://api.avax.network/ext/bc/C/rpc'],
          blockExplorerUrls: ['https://cchain.explorer.avax.network/']
        },
        250: {
          chainId: '250',
          chainName: 'Fantom Opera',
          nativeCurrency: {
            name: 'FTM',
            symbol: 'FTM',
            decimals: 18
          },
          rpcUrls: ['https://rpc.ftm.tools'],
          blockExplorerUrls: ['https://ftmscan.com/']
        },
        43113: {
          chainId: '204',
          chainName: 'OpBNB Mainnet',
          nativeCurrency: {
            name: 'OpBNB',
            symbol: 'BNB',
            decimals: 18
          },
          rpcUrls: ['https://opbnb-mainnet-rpc.bnbchain.org'],
          blockExplorerUrls: ['https://opbnb.bscscan.com/']
        },
        42161: {
          chainId: '42161',
          chainName: 'Arbitrum One',
          nativeCurrency: {
            name: 'ETH',
            symbol: 'ETH',
            decimals: 18
          },
          rpcUrls: ['https://arb1.arbitrum.io/rpc'],
          blockExplorerUrls: ['https://arbiscan.io/']
        },
        64: {
          chainId: '5000',
          chainName: 'Mantle',
          nativeCurrency: {
            name: 'MNT',
            symbol: 'MNT',
            decimals: 18
          },
          rpcUrls: ['https://rpc.mantle.xyz/'],
          blockExplorerUrls: ['https://explorer.mantle.xyz/']
        },
        421611: {
          chainId: '5001',
          chainName: 'Mantle Testnet',
          nativeCurrency: {
            name: 'MNT',
            symbol: 'MNT',
            decimals: 18
          },
          rpcUrls: ['https://rpc.testnet.mantle.xyz/'],
          blockExplorerUrls: ['https://explorer.testnet.mantle.xyz/']
        },
        3125659152: {
          chainId: '324',
          chainName: 'zkSync Mainnet',
          nativeCurrency: {
            name: 'ETH',
            symbol: 'ETH',
            decimals: 18
          },
          rpcUrls: ['https://api.zksync.io'],
          blockExplorerUrls: ['https://zkscan.io/']
        },
        66: {
          chainId: '10',
          chainName: 'Optimistic Ethereum',
          nativeCurrency: {
            name: 'ETH',
            symbol: 'ETH',
            decimals: 18
          },
          rpcUrls: ['https://mainnet.optimism.io'],
          blockExplorerUrls: ['https://optimistic.etherscan.io/']
        },
        97: {
          chainId: '97',
          chainName: 'Binance Smart Chain Testnet',
          nativeCurrency: {
            name: 'tBNB',
            symbol: 'tBNB',
            decimals: 18
          },
          rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
          blockExplorerUrls: ['https://testnet.bscscan.com/']
        }
      }
    };
  }
