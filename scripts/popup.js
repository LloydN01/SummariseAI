const apiUrl = "https://api.nlpcloud.io/v1/bart-large-cnn/summarization";
const token = "";

const summariseText = (textToSummarize) => {
    const summarised_text = "";

    fetch(apiUrl, {
        method: "POST",
        headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            text: `${textToSummarize}`,
        }),
    })
        .then((response) => response.json())
        .then((data) => {
            summarised_text = data.summary_text;
        })
        .catch((error) => {
            console.error("Error:", error);
        });

    return summarised_text
}

const addText = (text) => {
    const textbox = document.getElementById("summarised-text");
    textbox.value = text;
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
        return; // ignoring an unsupported page like chrome://extensions
    }
    addText(result);
    const summariseBtn = document.getElementById("summarise-btn");
    summariseBtn.style.visibility = "visible";
};

document.getElementById("summarise-btn").onclick = () => {
    const textToSummarize = document.getElementById("summarised-text").value;
    const summarised_text = summariseText(textToSummarize);
    addText(summarised_text)
}