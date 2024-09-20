function crackHash() {
    const hash = document.getElementById('hash').value;
    const maxTestLength = parseInt(document.getElementById('max-test-to').value);
    const testNumbers = document.getElementById('test-numbers').checked;
    const testLetters = document.getElementById('test-letters').checked;
    const testCapitals = document.getElementById('test-capitals').checked;
    const testSpecial = document.getElementById('test-special').checked;
    let result = document.getElementById('result');
    let found = false;
    let characters = '';

    if (!testNumbers && !testLetters && !testCapitals && !testSpecial) {
        document.getElementById('alert-message').style.display = 'block';
        return;
    } else {
        document.getElementById('alert-message').style.display = 'none';
    }

    if (testNumbers) characters += '0123456789';
    if (testLetters) characters += 'abcdefghijklmnopqrstuvwxyz';
    if (testCapitals) characters += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (testSpecial) characters += '!\"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~';

    if (hash.length === 64 || hash.length === 32) {
        startTime = new Date();
        hashes = 0;

        for (let length = 1; length <= maxTestLength; length++) {
            console.log(`Starting cracking with length ${length}`);
            if (found) break;
            generateCombinations('', length);
        }

        if (!found) {
            result.innerHTML = 'Hash not found.';
        }
    } else {
        result.innerHTML = 'Please enter a valid SHA256 or MD5 hash';
        return;
    }

    function generateCombinations(prefix, length) {
        if (found) return;
        if (length === 0) {
            const testHash = (hash.length === 64) ? CryptoJS.SHA256(prefix).toString() : CryptoJS.MD5(prefix).toString();
            hashes++;
            console.log(`Tested hash: ${prefix}`);

            if (testHash === hash) {
                result.innerHTML = `Cracked hash: ${prefix}`;
                found = true;
                updateSpeed();
                return;
            }
        } else {
            for (let i = 0; i < characters.length; i++) {
                const combination = prefix + characters[i];
                const testHash = (hash.length === 64) ? CryptoJS.SHA256(combination).toString() : CryptoJS.MD5(combination).toString();
                hashes++;
                console.log(`Tested hash: ${testHash}`);

                if (testHash === hash) {
                    result.innerHTML = `Cracked hash: ${combination}`;
                    found = true;
                    updateSpeed();
                    return;
                }

                generateCombinations(combination, length - 1);
            }
        }
    }
}

function updateSpeed() {
    const time = new Date() - startTime;
    const speed = Math.round(hashes / time * 1000);
    document.getElementById('speed').innerHTML = `Hashes per second: ${speed}`;
}
