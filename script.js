/* ================= DOM ELEMENTS ================= */

const home =
    document.getElementById("home");

const uploadScreen =
    document.getElementById("uploadScreen");

const questions =
    document.getElementById("questions");

const loading =
    document.getElementById("loading");

const result =
    document.getElementById("result");

const jugButton =
    document.getElementById("jugButton");

const uploadBox =
    document.getElementById("uploadBox");

const fileInput =
    document.getElementById("fileInput");

const preview =
    document.getElementById("preview");

const previewContainer =
    document.getElementById("previewContainer");

const analysisCanvas =
    document.getElementById("analysisCanvas");

const continueBtn =
    document.getElementById("continueBtn");

const progressBar =
    document.getElementById("progressBar");

const resultNumber =
    document.getElementById("resultNumber");

const message =
    document.getElementById("message");

const loadingText =
    document.getElementById("loadingText");

const againBtn =
    document.getElementById("againBtn");


let confidence = "";
let reason = "";
let calculatedDrops = 0;


/* ================= AUDIO ================= */

let audioCtx = null;

function unlockAudio() {

    if (!audioCtx) {

        const AudioContext =
            window.AudioContext ||
            window.webkitAudioContext;

        if (AudioContext) {
            audioCtx = new AudioContext();
        }
    }

    if (
        audioCtx &&
        audioCtx.state === "suspended"
    ) {
        audioCtx.resume();
    }
}


function dropSound() {

    unlockAudio();

    if (!audioCtx) return;

    try {

        const oscillator =
            audioCtx.createOscillator();

        const gain =
            audioCtx.createGain();

        oscillator.type = "sine";

        oscillator.frequency.setValueAtTime(
            700,
            audioCtx.currentTime
        );

        oscillator.frequency.exponentialRampToValueAtTime(
            200,
            audioCtx.currentTime + .12
        );

        gain.gain.setValueAtTime(
            .001,
            audioCtx.currentTime
        );

        gain.gain.exponentialRampToValueAtTime(
            .15,
            audioCtx.currentTime + .01
        );

        gain.gain.exponentialRampToValueAtTime(
            .001,
            audioCtx.currentTime + .14
        );

        oscillator.connect(gain);

        gain.connect(audioCtx.destination);

        oscillator.start();

        oscillator.stop(
            audioCtx.currentTime + .15
        );

    } catch (e) {

        console.warn(
            "Audio Context Error:",
            e
        );

    }
}


/* ================= SCREEN SWITCH ================= */

function show(screen) {

    document
        .querySelectorAll(".screen")
        .forEach(function(item) {

            item.classList.remove("active");

        });

    screen.classList.add("active");

    window.scrollTo(0, 0);
}


/* ================= HOME ================= */

jugButton.addEventListener(
    "click",
    function() {

        unlockAudio();

        dropSound();

        setTimeout(
            function() {

                show(uploadScreen);

            },
            250
        );

    }
);


/* ================= UPLOAD ================= */

uploadBox.addEventListener(
    "click",
    function() {

        fileInput.click();

    }
);


fileInput.addEventListener(
    "change",
    function() {

        const file =
            fileInput.files[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {

            alert(
                "Please select a valid image file."
            );

            fileInput.value = "";

            return;
        }

        const reader =
            new FileReader();

        reader.onload =
            function(event) {

                preview.src =
                    event.target.result;

                previewContainer.style.display =
                    "block";

                continueBtn.style.display =
                    "block";

                uploadBox.innerHTML = `
                    <div class="upload-icon">✅</div>
                    <strong>Image loaded!</strong>
                    <p>Ready to analyze pixels.</p>
                `;

            };

        reader.readAsDataURL(file);

    }
);


/* ================= CONTINUE ================= */

continueBtn.addEventListener(
    "click",
    function() {

        show(questions);

    }
);


/* ================= QUESTION 1 ================= */

document
    .querySelectorAll(".confidence")
    .forEach(function(button) {

        button.addEventListener(
            "click",
            function() {

                confidence =
                    button.dataset.value;

                document
                    .querySelectorAll(".confidence")
                    .forEach(function(item) {

                        item.classList.remove(
                            "selected"
                        );

                    });

                button.classList.add(
                    "selected"
                );

                setTimeout(
                    function() {

                        document
                            .getElementById("q1")
                            .classList
                            .remove("active");

                        document
                            .getElementById("q2")
                            .classList
                            .add("active");

                        progressBar.style.width =
                            "100%";

                    },
                    200
                );

            }
        );

    });


/* ================= QUESTION 2 ================= */

document
    .querySelectorAll(".reason")
    .forEach(function(button) {

        button.addEventListener(
            "click",
            function() {

                reason =
                    button.dataset.value;

                document
                    .querySelectorAll(".reason")
                    .forEach(function(item) {

                        item.classList.remove(
                            "selected"
                        );

                    });

                button.classList.add(
                    "selected"
                );

                setTimeout(
                    function() {

                        processImageAndCalculate();

                    },
                    250
                );

            }
        );

    });


/* ================= IMAGE ANALYSIS ================= */

function processImageAndCalculate() {

    show(loading);

    loadingText.innerText =
        "Extracting RGB pixel data...";

    setTimeout(
        function() {

            loadingText.innerText =
                "Filtering white liquid density spectrum...";

        },
        600
    );

    setTimeout(
        function() {

            loadingText.innerText =
                "Computing total volume in milk drops...";

        },
        1200
    );

    setTimeout(
        function() {

            const canvas =
                analysisCanvas;

            const ctx =
                canvas.getContext("2d");

            canvas.width =
                preview.naturalWidth || 300;

            canvas.height =
                preview.naturalHeight || 300;

            ctx.drawImage(
                preview,
                0,
                0,
                canvas.width,
                canvas.height
            );

            const imgData =
                ctx.getImageData(
                    0,
                    0,
                    canvas.width,
                    canvas.height
                );

            const data =
                imgData.data;

            let whitePixelCount = 0;

            const totalPixels =
                canvas.width *
                canvas.height;


            for (
                let i = 0;
                i < data.length;
                i += 4
            ) {

                const r =
                    data[i];

                const g =
                    data[i + 1];

                const b =
                    data[i + 2];


                const brightness =
                    (r + g + b) / 3;


                const maxDiff =
                    Math.max(
                        Math.abs(r - g),
                        Math.abs(g - b),
                        Math.abs(b - r)
                    );


                if (
                    brightness > 160 &&
                    maxDiff < 30
                ) {

                    whitePixelCount++;

                }

            }


            let ratio =
                whitePixelCount /
                totalPixels;


            if (ratio < 0.02) {

                ratio =
                    0.05 +
                    Math.random() * 0.05;

            }


            const calculatedML =
                Math.round(
                    ratio * 1500
                );


            calculatedDrops =
                Math.round(
                    calculatedML * 20
                );


            showResult(
                calculatedDrops
            );

        },
        1800
    );
}


/* ================= RESULT ================= */

function showResult(drops) {

    resultNumber.innerText =
        "0";


    if (reason === "hackathon") {

        message.innerText =
            "🎓 ഇത്രേ ഉള്ളൂ... 😜";

    }

    else if (reason === "curiosity") {

        message.innerText =
            "🤓 Pixel spectrum analysis completed! Humanity now knows the drop count of your photo.";

    }

    else {

        message.innerText =
            "🗿 You analyzed an image for milk drops for no reason. Pure dedication.";

    }


    show(result);


    const duration =
        1200;

    const startTime =
        performance.now();


    function animate(currentTime) {

        const progress =
            Math.min(
                (currentTime - startTime) /
                duration,
                1
            );


        const currentVal =
            Math.floor(
                drops * progress
            );


        resultNumber.innerText =
            currentVal.toLocaleString();


        if (progress < 1) {

            requestAnimationFrame(
                animate
            );

        }

    }


    requestAnimationFrame(
        animate
    );


    setTimeout(
        function() {

            dropSound();

        },
        200
    );
}


/* ================= RESET ================= */

againBtn.addEventListener(
    "click",
    function() {

        confidence = "";

        reason = "";

        calculatedDrops = 0;


        document
            .querySelectorAll(".option")
            .forEach(function(item) {

                item.classList.remove(
                    "selected"
                );

            });


        fileInput.value = "";

        preview.src = "";

        previewContainer.style.display =
            "none";

        continueBtn.style.display =
            "none";


        uploadBox.innerHTML = `
            <div class="upload-icon">🥛</div>
            <strong>Touch me...🫣</strong>
            <p>JPG, PNG or WEBP</p>
        `;


        progressBar.style.width =
            "50%";


        document
            .getElementById("q1")
            .classList
            .add("active");


        document
            .getElementById("q2")
            .classList
            .remove("active");


        show(home);

    }
);