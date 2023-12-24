// & Create unchanging variables to add functionality to the webpage
// ~ document.querySelector method returns the first element within the document that matches the specified selector
const light = document.querySelector(".light");
const dark = document.querySelector(".dark");
const sizes = document.querySelector(".sizes");
const qrText = document.querySelector(".qr-text");
const qrContainer = document.querySelector("#qr-code");
const download = document.querySelector(".download");
const shareBtn = document.querySelector(".share-btn");

// & Event listeners -> this method waits for an event to occur and then responds to it
light.addEventListener("input", handleLightColor);
dark.addEventListener("input", handleDarkColor);
sizes.addEventListener("change", handleSize);
qrText.addEventListener("input", handleQRText);
shareBtn.addEventListener("click", handleShare);

// & Create the default Url
const defaultUrl = "https://www.linkedin.com/in/rochelle-l-beckford/";
let colorLight = "#fff",
    // * bugs -> forgot the # and once added the qr code became visible
    colorDark = "#000",
    text = defaultUrl,
    size = 300;

// & set of statements that performs a task -> a function should take in an input and return and output for event listeners
function handleLightColor(e) {
    colorLight = e.target.value;
    generateQRCode();
}

function handleDarkColor(e) {
    colorDark = e.target.value;
    generateQRCode();
}

function handleQRText(e) {
    const value = e.target.value;
    text = value;

    if (!value) {
        text = defaultUrl;
    }
    generateQRCode();
}

/* 
& async function
~ allows a program to run a function without freezing the entire program
~ returns a promise and wraps non-promises in it
*/
async function generateQRCode() {
    qrContainer.innerHTML = "";

    new QRCode("qr-code", {
        text,
        height: size,
        width: size,
        colorLight,
        colorDark,
    });

    // & await function -> pauses the async function until the promise is settled [fulfilled or rejected] before running the next line of code
    download.href = await resolveDataUrl();
}

// & async function for handleShare
async function handleShare() {
    setTimeout(async () => {
        // ~ try -> while the code is being run at the same time the defined block of code to be tested for errors -> might cause an exception or where something that might go wrong.
        try {
            const base64url = await resolveDataUrl();
            const blob = await (await fetch(base64url)).blob();
            const file = new File([blob], "QRCode.png", {
                type: blob.type,
            });
            // * bugs -> once added this await I was able to share the file [chrome doesn't allow me to share but the prompt pops up thus it still works]
            await navigator.share ({
                files: [file],
                title: text,
            });

        // ~ catch -> this set of code handles the exception that might be caused from the try
        } catch (error) {
            alert("Your browser doesn't support sharing.");
        } 
        // ~ 100 -> the amount of seconds to wait before executing this function
    }, 100);
}

function handleSize(e) {
    size = e.target.value;
    generateQRCode();
}

function resolveDataUrl() {
    return new Promise ((resolve, reject) => {
        setTimeout(() => {
            const img = document.querySelector("#qr-code img");

            if (img.currentSrc) {
                resolve(img.currentSrc);
                return;
            }

            const canvas = document.querySelector("canvas");
            resolve(canvas.toDataURL());
        }, 50);
    });
}

generateQRCode();