(async function mergeStyles() {
    const fs = require('fs');
    const fsPromises = fs.promises;
    const path = require('path');

    const pathToStyles = path.join(__dirname, 'styles');
    const pathToBundle = path.join(__dirname, 'project-dist');

    readDirectory(pathToStyles, pathToBundle);

    async function readDirectory(stylesPath, bundlePath) {
        fsPromises.readdir(stylesPath, { withFileTypes: true }, (err) => {
            if (err) console.log(err);
        }).then((files) => {
            createBundle(bundlePath);
            files.forEach(async it => {
                const pathToFile = path.join(stylesPath, it.name);
                const ext = path.parse(pathToFile).ext;

                if (it.isFile() && ext === '.css') {
                    readFile(pathToFile, path.join(bundlePath, 'bundle.css'));
                }
            })
        })
    }

    async function createBundle(bundlePath) {
        const pathToBundleFile = path.join(bundlePath, 'bundle.css');
        fs.access(pathToBundleFile, fs.F_OK, (err) => {
            if (!err) {
                fsPromises.unlink(pathToBundleFile, (err) => {
                    if (err) console.log(err);
                }).then(() => {
                    fs.open(pathToBundleFile, 'w', (err) => {
                        if (err) console.log(err);
                    })
                })
            } else {
                fs.open(pathToBundleFile, 'w', (err) => {
                    if (err) console.log(err);
                })
            }
        })
    }

    async function readFile(pathToFile, bundlePath) {
        const stream = fs.createReadStream(pathToFile, 'utf-8', (err) => {
            if (err) console.log(err)
        })

        stream.on('data', (chunk) => {
            writeFile(bundlePath, chunk);
        })
    }

    async function writeFile(bundlePath, dataStyle) {
        fs.appendFile(bundlePath, dataStyle + '\n', (err) => {
            if (err) console.log(err)
        })
    }
})()