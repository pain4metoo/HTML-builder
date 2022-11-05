(async function buildProject() {
    const fs = require('fs');
    const fsPromises = fs.promises;
    const path = require('path');

    const pathToDist = path.join(__dirname, 'project-dist');

    createDist(pathToDist);

    async function createDist(pathToDist) {
        fs.stat(pathToDist, (err) => {
            if (!err) {
                fsPromises.rm(pathToDist, { recursive: true }, (err) => {
                    if (err) console.log(err);
                }).then(() => {
                    fsPromises.mkdir(pathToDist, { recursive: true }, (err) => {
                        if (err) console.log(err);
                    }).then(() => {
                        createHTML(pathToDist)
                        createCSS(pathToDist)
                        copyFiles(pathToDist)
                    })
                })
                return
            }
            fsPromises.mkdir(pathToDist, { recursive: true }, (err) => {
                if (err) console.log(err);
            }).then(() => {
                createHTML(pathToDist)
                createCSS(pathToDist)
                copyFiles(pathToDist)
            })
        })
    }

    async function createHTML(pathToDist) {
        const pathToDirTemplate = path.join(__dirname, 'components');
        const pathToTemplate = path.join(__dirname, 'template.html');
        const pathToIndex = path.join(pathToDist, 'index.html');

        fs.open(pathToIndex, 'w', (err) => {
            if (err) {
                console.log(err)
            } else {
                replaceTemp(pathToDirTemplate, pathToTemplate, pathToIndex)
            }
        })

        async function replaceTemp(pathToDirTemplate, pathToTemplate, pathToIndex) {
            fsPromises.readdir(pathToDirTemplate, { withFileTypes: true }, (err) => {
                if (err) console.log(err);
            }).then((files) => {
                let newHTML = '';

                fsPromises.readFile(pathToTemplate, 'utf-8', (err) => {
                    if (err) console.log(err);
                }).then(data => {
                    newHTML = data;
                    files.forEach((it, index) => {
                        const pathToTemplateItem = path.join(pathToDirTemplate, it.name);
                        const ext = path.parse(pathToTemplateItem).ext;
                        if (it.isFile() && ext === ".html") {
                            const templateBaseName = path.basename(pathToTemplateItem, '.html');
                            fsPromises.readFile(pathToTemplateItem, 'utf-8', (err) => {
                                if (err) console.log(err);
                            }).then((data) => {
                                newHTML = newHTML.replace(`{{${templateBaseName}}}`, data)
                                if (index === files.length - 1) {
                                    writeFile(pathToIndex, newHTML)
                                }
                            })
                        }
                    })
                })
            })
        }

        async function writeFile(pathToIndex, html) {
            fs.writeFile(pathToIndex, html, (err) => {
                if (err) console.log(err);
            })
        }
    }

    async function createCSS(pathToDist) {
        const pathToStyles = path.join(__dirname, 'styles');
        const pathToBundle = pathToDist;

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
                        readFile(pathToFile, path.join(bundlePath, 'style.css'));
                    }
                })
            })
        }

        async function createBundle(bundlePath) {
            const pathToBundleFile = path.join(bundlePath, 'style.css');
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
    }

    async function copyFiles(pathToDist) {
        const basicPath = path.resolve(__dirname, 'assets');
        const copyBasicPath = path.resolve(pathToDist, 'assets');

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
    }
}())