const fetch = require("node-fetch")
const fs = require('fs');

const URLsToBeScraped = [{
        url: "https://www.cellartracker.com/popup/findpicker.asp?EditField=Type&iUserOverride=0&fInStock=0&Table=Pivot&Pivot1=Producer&BeginConsume=&EndConsume=&iAJAX=1",
        file: "colorAndType.json"
    },
    {
        url: "https://www.cellartracker.com/popup/findpicker.asp?iAJAX=1&EditField=Varietal&szPickSearch=&iUserOverride=0&fInStock=0&Table=Pivot&Pivot1=Producer&BeginConsume=&EndConsume=",
        file: "varaety.json"
    },
    {
        url: "https://www.cellartracker.com/popup/findpicker.asp?EditField=Country&iUserOverride=0&fInStock=0&Table=Pivot&Pivot1=Producer&BeginConsume=&EndConsume=&iAJAX=1",
        file: "country.json"
    },
    {
        url: "https://www.cellartracker.com/popup/findpicker.asp?EditField=Region&iUserOverride=0&fInStock=0&Table=Pivot&Pivot1=Producer&BeginConsume=&EndConsume=&iAJAX=1",
        file: "region.json"
    },
    {
        url: "https://www.cellartracker.com/popup/findpicker.asp?EditField=SubRegion&iUserOverride=0&fInStock=0&Table=Pivot&Pivot1=Producer&BeginConsume=&EndConsume=&iAJAX=1",
        file: "sub-region.json"
    },
    {
        url: "https://www.cellartracker.com/popup/findpicker.asp?EditField=Appellation&iUserOverride=0&fInStock=0&Table=Pivot&Pivot1=Producer&BeginConsume=&EndConsume=&iAJAX=1",
        file: "appellation.json"
    },
    {
        url: "https://www.cellartracker.com/popup/findpicker.asp?iAJAX=1&EditField=Producer&szPickSearch=&iUserOverride=0&fInStock=0&Table=Pivot&Pivot1=Producer&BeginConsume=&EndConsume=",
        file: "producer.json"
    }
]

function makeRequest(url) {
    return new Promise((resolve, reject) => {
        fetch(url)
            .then(res => resolve(res.text()))
            .catch(err => reject(err))
    })
}

function writeFile(filePath, data) {
    return new Promise(function (resolve, reject) {
        fs.writeFile(filePath, data, function (err) {
            if (err) reject(err);
            else resolve("done writting to: " + filePath);
        });
    });
}

function cleanUpCharCodes(filtered) {
    for (let i = 0; i < filtered.length; i++) {
        let matched = filtered[i].match(/&#.+?(?=);/g)
        if (matched) {
            for (let j = 0; j < matched.length; j++) {
                let number = String(matched[j]).replace(/&#|;/g, '');
                let char = String.fromCharCode(number)
                filtered[i] = filtered[i].replace(matched[j], char)
            }
        }
    }

    return filtered;
}

async function scrape(url, file) {
    let data = await makeRequest(url)
    let filtered = data.match(/(?<=(<option>))(\w|\d|\n|[().,\-:;@#$%^&*\[\]"'+–/\/®°⁰!?{}|`~]| )+?(?=(<\/option>))/g)

    cleanUpCharCodes(filtered)

    let resp = await writeFile(`data/${file}`, JSON.stringify(filtered))

    console.log(resp)
}

(async function main() {
    for (const data of URLsToBeScraped) {
        //no need to wait for other calls to complete
        scrape(data.url, data.file)
    }
})()