const fs = require('fs');
const path = require('path');
const fsPromises = fs.promises;

(async function copyDirectory() {
    const basicPath = path.resolve(__dirname, 'files');
    const copyBasicPath = path.resolve(__dirname, 'files-copy');

    deleteFolder(copyBasicPath, basicPath);

    async function deleteFolder(copyDirectoryName, basicDirectoryName) {
        fs.stat(copyDirectoryName, (err) => {
            if (!err) {
                fs.rm(copyDirectoryName, { recursive: true }, (err) => {
                    if (err) console.log(err);
                    createFolder(copyDirectoryName, basicDirectoryName);
                })
            } else {
                createFolder(copyDirectoryName, basicDirectoryName)
            }
        })
    }

    async function createFolder(copyDirectoryName, basicDirectoryName) {
        fsPromises.mkdir(copyDirectoryName, { recursive: true }, (err) => {
            if (err) console.log(err);
        }).then(() => readDirectory(copyDirectoryName, basicDirectoryName))
    }

    async function readDirectory(copyDirectoryName, basicDirectoryName) {
        fs.readdir(basicDirectoryName, { withFileTypes: true }, (err, files) => {
            if (err) {
                console.log(err)
            } else {
                files.forEach(it => {
                    const pathToOriginalFile = path.join(basicDirectoryName, it.name);
                    const pathToCopyFile = path.join(copyDirectoryName, it.name);
                    if (it.isFile()) {
                        copyFile(pathToCopyFile, pathToOriginalFile)
                    } else {
                        deleteFolder(pathToCopyFile, pathToOriginalFile);
                    }
                })
            }
        })
    }

    async function copyFile(pathToCopyFile, pathToOriginalFile) {
        fs.copyFile(pathToOriginalFile, pathToCopyFile, (err) => {
            if (err) console.log(err)
        })
    }
})();






