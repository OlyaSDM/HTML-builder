const fsModule = require('fs');
const pathModule = require('path');

const textFilePath = pathModule.resolve(__dirname, 'text.txt');

const fileStream = fsModule.createReadStream(textFilePath);

fileStream.on('data', (dataChunk) => {
    console.log(dataChunk.toString());
});

