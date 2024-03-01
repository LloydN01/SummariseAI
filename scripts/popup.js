const apiUrl = "https://api.nlpcloud.io/v1/bart-large-cnn/summarization";
const token = "YOUR_API_KEY";

const summariseText = (textToSummarize) => {
    return fetch(apiUrl, {
        method: "POST",
        headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            text: textToSummarize,
        }),
    })
        .then((response) => response.json())
        .then((data) => data.summary_text)
        .catch((error) => {
            console.error("Error:", error);
            return "Error when summarising text";
        });
};

const addText = (text) => {
    const textBox = document.getElementById("text-box");
    textBox.value = text;
};

document.getElementById("copy-btn").onclick = async () => {
    const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
    });
    let result;
    try {
        [{ result }] = await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: () => getSelection().toString(),
        });
    } catch (e) {
        return;
    }
    addText(result);
    const summariseBtn = document.getElementById("summarise-btn");
    summariseBtn.style.visibility = "visible";
};

document.getElementById("summarise-btn").onclick = async () => {
    const textBox = document.getElementById("text-box");
    const btnGroup = document.getElementsByClassName("main-btn-group");
    const loader = document.getElementById("loader");

    loader.style.visibility = "visible";
    for (let i = 0; i < btnGroup.length; i++) {
        btnGroup[i].classList.add("disabled");
    };

    const summarised_text = await summariseText(textBox.value);

    loader.style.visibility = "hidden";
    for (let i = 0; i < btnGroup.length; i++) {
        btnGroup[i].classList.remove("disabled");
    };

    addText(summarised_text);
};
