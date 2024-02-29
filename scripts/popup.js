const apiUrl = "https://api.nlpcloud.io/v1/bart-large-cnn/summarization";
const token = "";

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
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
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
    const loader = document.getElementById("loading-icon");
    
    textBox.style.display = "none";
    loader.style.display = "block";
    const summarised_text = await summariseText(textBox.value);
    loader.style.display = "none"
    textBox.style.display = "block"

    addText(summarised_text);
};
