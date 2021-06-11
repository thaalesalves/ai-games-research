fs = require('fs');

const inputPath = process.argv.slice(2)[0];
const outputPath = process.argv.slice(2)[1];
const rl = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout
});

fs.readFile(inputPath, 'utf8', (err, data) => {
    const content = JSON.parse(data);
    if (err) {
        return console.log(err);
    }

    console.log("===============================================");
    for (var i = 0; i < content.length; i++) {
        console.log(`${i}. ${content[i].title}`);
    }
    console.log("===============================================");

    rl.question("Which adventure would you like to convert? ", (option) => {
        const story = content[option];
        let extractedActions = [];
        for (var i = 1; i < story.actions.length; i++) {
            extractedActions.push(removeAccents(story.actions[i].text));
        }

        let worldInfo = [];
        for (var i = 0; i < story.worldInfo.length; i++) {
            worldInfo.push({
                key: story.worldInfo[i].keys,
                content: story.worldInfo[i].entry
            });
        }

        converted = {
            gamestarted: true,
            prompt: story.actions[0].text,
            memory: story.memory,
            authorsnote: story.authorsNote,
            actions: extractedActions,
            worldinfo: worldInfo,
        };

        const outputFile = `${outputPath}/${story.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${getDateString()}.json`;
        fs.writeFile(`${outputFile}`, JSON.stringify(converted), (err) => {
            if (err) {
                return console.log(err);
            }

            console.log(`File converted. You will find it at: ${outputFile}`);
            process.exit(0);
        });
    });
});

const removeAccents = (str) => {
    const map = {
        '-': ' ',
        '-': '_',
        'a': 'á|à|ã|â|ä',
        'e': 'é|è|ê|ë',
        'i': 'í|ì|î|ï',
        'o': 'ó|ò|ô|õ|ö',
        'u': 'ú|ù|û|ü',
        'c': 'ç',
        'n': 'ñ',
        'A': 'À|Á|Ã|Â|Ä',
        'E': 'É|È|Ê|Ë',
        'I': 'Í|Ì|Î|Ï',
        'O': 'Ó|Ò|Ô|Õ|Ö',
        'U': 'Ú|Ù|Û|Ü',
        'C': 'Ç',
        'N': 'Ñ'
    };

    for (var pattern in map) {
        str = str.replace(new RegExp(map[pattern], 'g'), pattern);
    }

    return str;
}

const getDateString = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${year}${month}${day}`
}