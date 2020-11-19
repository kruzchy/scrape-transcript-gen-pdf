const maxListeners = 32
require("events").EventEmitter.defaultMaxListeners = maxListeners;
const path = require("path");
const fs = require('fs');
const html_to_pdf = require('html-pdf-node');
const pLimit = require('p-limit');

const limit = pLimit(maxListeners-10);
const pdfsPath = path.resolve(__dirname, "pdfs");

const createDirectoryIfNotExists = (directory) => {
    try {
        fs.accessSync(directory, fs.constants.F_OK)
    } catch (e) {
        fs.mkdirSync(directory)
    }
}
createDirectoryIfNotExists(pdfsPath);

const getTranscript = async (id)=>{
    const marginSize = 25;
    await html_to_pdf.generatePdf({url: `http://examsportal.vidyanikethan.edu/verify/getRecord.asp?htno=${id}`},
        {
            format: "A4",
            margin: {
                top: marginSize,
                right: marginSize,
                bottom: marginSize,
                left: marginSize
            },
            path: path.resolve(pdfsPath, `${id}.pdf`)});
    console.log(`>>>"${id}.pdf" Downloaded`);
};

const main = async () => {
    const promiseArray = [];
    for (let i=1; i<=10; i++) {
        let Astr = "14121A05A";
        let Bstr = "14121A05B";
        let _5Str = "14121A05";

        if (i!==10) {
            promiseArray.push(limit(()=>getTranscript(Astr+i)));
            promiseArray.push(limit(()=>getTranscript(Bstr+i)));
            promiseArray.push(limit(()=>getTranscript(_5Str+'0'+i)));
        } else {
            promiseArray.push(limit(()=>getTranscript(_5Str+`10`)));
        }

    }
    await Promise.all(promiseArray);
};

main();

