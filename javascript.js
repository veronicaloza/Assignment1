const toggleButton = document.getElementById("text");
const intro = document.querySelector(".intro");

toggleButton.addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");
    toggleButton.textContent = toggleButton.textContent === "ON" ? "OFF" : "ON";

    // Toggle the display of the .intro element
    if (intro.style.display === "none") {
        intro.style.display = "block";
    } else {
        intro.style.display = "none";
    }
});


alert('Read Text Out loud for Interactivity & Enjoy!');
const fonts = [
    '"erotica-big", sans-serif',
    // '"glammo", sans-serif',
    // '"am-serie-610", sans-serif',
    '"jacquarda-bastarda-9", sans-serif',
    '"dazzle-unicase", sans-serif',
    '"courier-std", monospace',

];

let currentRMS = 0;

document.querySelectorAll('.letter-wrapper').forEach(wrapper => {
    const letters = wrapper.querySelectorAll('.letter');

    let currentFontIndex = Math.floor(Math.random() * fonts.length);
    letters[0].style.fontFamily = fonts[currentFontIndex];

    function updateLetter() {

        if (currentRMS < 0.02) {

            setTimeout(updateLetter, 100);
            return;
        }

        const nextFontIndex = (currentFontIndex + 1) % fonts.length;
        let visibleEl, hiddenEl;
        if (letters[0].classList.contains('visible')) {
            visibleEl = letters[0];
            hiddenEl = letters[1];
        } else {
            visibleEl = letters[1];
            hiddenEl = letters[0];
        }


        hiddenEl.textContent = visibleEl.textContent;
        hiddenEl.style.fontFamily = fonts[nextFontIndex];
        hiddenEl.classList.remove('visible');


        void hiddenEl.offsetWidth;


        visibleEl.classList.remove('visible');
        hiddenEl.classList.add('visible');


        currentFontIndex = nextFontIndex;


        const delay = Math.random() * (3000 * (1 - currentRMS)) + 100;
        setTimeout(updateLetter, delay);
    }


    setTimeout(updateLetter, 1000);
});


navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
        const audioCtx = new AudioContext();
        const source = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;
        source.connect(analyser);


        const dataArray = new Uint8Array(analyser.fftSize);


        const debugBarContainer = document.createElement('div');
        // debugBarContainer.style.position = 'fixed';
        // debugBarContainer.style.top = '50%';
        // debugBarContainer.style.right = '20px';
        // debugBarContainer.style.transform = 'translateY(-50%)';
        // debugBarContainer.style.width = '30px';
        // debugBarContainer.style.height = '200px';
        // debugBarContainer.style.backgroundColor = '#eee';
        // debugBarContainer.style.border = '1px solid #aaa';
        document.body.appendChild(debugBarContainer);

        const levelIndicator = document.createElement('div');
        levelIndicator.style.width = '100%';
        levelIndicator.style.height = '0%';
        levelIndicator.style.backgroundColor = 'red';
        debugBarContainer.appendChild(levelIndicator);


        function updateDebugBar() {
            analyser.getByteTimeDomainData(dataArray);

            let sumSquares = 0;
            for (let i = 0; i < dataArray.length; i++) {

                const normalized = (dataArray[i] - 128) / 128;
                sumSquares += normalized * normalized;
            }
            const rms = Math.sqrt(sumSquares / dataArray.length);


            currentRMS = rms;


            const heightPercent = Math.min(100, rms * 100);
            levelIndicator.style.height = `${heightPercent}%`;

            requestAnimationFrame(updateDebugBar);
        }
        updateDebugBar();
    })
    .catch(err => {
        console.error('Error accessing microphone:', err);
    });

