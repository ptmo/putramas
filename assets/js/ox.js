        function createWallet() {
            const wallet = ethers.Wallet.createRandom(); // Generate random wallet
            const privateKey = wallet.privateKey;
            const mnemonic = wallet.mnemonic.phrase.split(" "); // Get the 12-word recovery phrase as an array of words
            const address = wallet.address;

            // Display recovery phrase in a 3x4 grid layout
            const recoveryPhraseDiv = document.getElementById('recoveryPhrase');
            recoveryPhraseDiv.innerHTML = ''; // Clear previous content
            mnemonic.forEach((word, index) => {
                const wordDiv = document.createElement('div');
                wordDiv.classList.add('recovery-word');
                wordDiv.textContent = word;
                recoveryPhraseDiv.appendChild(wordDiv);

                // Insert line break after every 4 words
                if ((index + 1) % 4 === 0) {
                    recoveryPhraseDiv.appendChild(document.createElement('br'));
                }
            });

            document.getElementById('privateKey').textContent = privateKey;
            document.getElementById('address').textContent = address;
        }

        function copyToClipboard(elementId) {
            const el = document.getElementById(elementId);
            const selection = window.getSelection();
            const range = document.createRange();
            range.selectNodeContents(el);
            selection.removeAllRanges();
            selection.addRange(range);
            document.execCommand('copy');
            selection.removeAllRanges();
        }

        function copyRecoveryPhrase() {
            const recoveryPhraseDiv = document.getElementById('recoveryPhrase');
            const range = document.createRange();
            range.selectNodeContents(recoveryPhraseDiv);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            document.execCommand('copy');
            selection.removeAllRanges();
        }
