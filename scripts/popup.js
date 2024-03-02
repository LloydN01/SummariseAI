let modelName = 'bart-large-cnn'; // Default model to use
const token =  '44c7b10d01e88ac8c87f2956b4e2f77fea285471' 

const summariseText = (textToSummarize) => {
    return fetch(`https://api.nlpcloud.io/v1/${modelName}/summarization`, {
        method: 'POST',
        headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            text: textToSummarize,
        }),
    })
        .then((response) => response.json())
        .then((data) => data.summary_text)
        .catch((error) => {
            console.error('Error:', error);
            return 'Error when summarising text';
        });
};

const addText = (text) => {
    const textBox = document.getElementById('text-box');
    textBox.value = text;
};

const toggleSettings = () => {
    const settingsBtn = document.getElementById('settings');
    const settingsContent = document.getElementById('settings-content');
    if (settingsContent.style.display == 'none') {
        settingsBtn.classList.add('fa-spin');
        settingsContent.style.display = 'block';
    } else {
        settingsBtn.classList.remove('fa-spin');
        settingsContent.style.display = 'none';
    }
};

document.getElementById('copy-btn').onclick = async () => {
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
    const summariseBtn = document.getElementById('summarise-btn');
    summariseBtn.style.visibility = 'visible';
};

document.getElementById('summarise-btn').onclick = async () => {
    const textBox = document.getElementById('text-box');
    const btnGroup = document.getElementsByClassName('main-btn-group');
    const loader = document.getElementById('loader');

    loader.style.visibility = 'visible';
    for (let i = 0; i < btnGroup.length; i++) {
        btnGroup[i].classList.add('disabled');
    }
    textBox.classList.add('disabled');

    const summarised_text = await summariseText(textBox.value);

    loader.style.visibility = 'hidden';
    for (let i = 0; i < btnGroup.length; i++) {
        btnGroup[i].classList.remove('disabled');
    }
    textBox.classList.remove('disabled');

    addText(summarised_text);
};

document.getElementById('settings').onclick = () => {
    const settingsContent = document.getElementById('settings-content');

    for(let i = 0; i < settingsContent.childElementCount; i++) {
        if (settingsContent.children[i].id === modelName) {
            settingsContent.children[i].classList.add('selected');
        } else {
            settingsContent.children[i].classList.remove('selected');
        }
    }
    
    toggleSettings();
};

window.onload = () => {
    const settingContent = document.getElementById('settings-content');
    const textArea = document.getElementById('text-box');
    settingContent.style.display = 'none';

    for (let i = 0; i < settingContent.childElementCount; i++) {
        settingContent.children[i].onclick = () => {
            modelName = settingContent.children[i].id;
            textArea.placeholder = `Summarising using ${modelName}`;
            toggleSettings();
        };
    }
}