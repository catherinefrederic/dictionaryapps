const url = "https://api.dictionaryapi.dev/api/v2/entries/en/";
const result = document.getElementById("result");
const sound = document.getElementById("sound");
const btn = document.getElementById("search-btn");

btn.addEventListener("click", () => {
    let inpWord = document.getElementById("inp-word").value.trim();
    if (!inpWord) return;

    fetch(`${url}${inpWord}`)
        .then((response) => response.json())
        .then((data) => {
            console.log(data);

            // Cari phonetic dan audio yang valid
            let phoneticText = data[0].phonetic || '';
            let audioSrc = '';
            for (let phon of data[0].phonetics) {
                if (phon.audio) {
                    audioSrc = phon.audio.startsWith('https') ? phon.audio : `https:${phon.audio}`;
                    if (!phoneticText && phon.text) phoneticText = phon.text;
                    break;
                }
            }

            result.innerHTML = `
                <div class="word">
                    <h3>${inpWord}</h3>
                    <button onclick="playSound()" ${audioSrc ? '' : 'disabled'}>
                        <i class="fas fa-volume-up"></i>
                    </button>
                </div>
                <div class="details">
                    <p>${data[0].meanings[0].partOfSpeech}</p>
                    <p>/${phoneticText}/</p>
                </div>
                <p class="word-meaning">
                    ${data[0].meanings[0].definitions[0].definition}
                </p>
                <p class="word-example">
                    ${data[0].meanings[0].definitions[0].example || ""}
                </p>`;

            if (audioSrc) {
                sound.setAttribute("src", audioSrc);
            } else {
                sound.removeAttribute("src");
            }
        })
        .catch((err) => {
            console.error(err);
            result.innerHTML = `<h3 class="error">Couldn't Find The Word</h3>`;
            sound.removeAttribute("src");
        });
});

function playSound() {
    if (sound.src) {
        sound.play();
    }
}
