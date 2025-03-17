const date = document.querySelector('.date');

function formatDate() {
    const date = new Date();

    const formattedDate = date.toLocaleDateString('en-US', {
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric'
    });
    
    const formattedTime = date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });

    return `${formattedDate} ${formattedTime}`;
}

date.textContent = formatDate();


const softText = document.querySelector('.tittle span');
softText.textContent = `Professional Soft`;

const newsList = document.querySelectorAll('#content .col1 div');
newsList.forEach(element => element.remove());

const dataSite = {
    proSoft: [
        "Firewall",
        "Antivirus",
        "VPN"
    ],
    whyUs: [
        "High quality",
        "Reliable",
        "Fast"
    ]
};

const profList = document.querySelector('.prof-soft-list');

dataSite.proSoft.sort().forEach((item, index) => {
    profList.children[index].textContent = `${index + 1}. ${item}`;
});

const whyList = document.querySelector('.list1');

dataSite.whyUs.sort().forEach((item, index) => {
    whyList.children[index].innerHTML = `<a href="#">${item}</a>`;
});

const image = document.querySelector(`#myRoundabout li img`);
image.setAttribute('src', `images/bg-soft.png`);