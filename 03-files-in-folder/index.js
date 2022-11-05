const fs = require('fs');
const path = require('path');
const { stdout } = require('process');

const truePath = path.resolve(__dirname, 'secret-folder');

fs.readdir(truePath, { withFileTypes: true }, (err, files) => {
    if (err) throw new Error(err);

    files.forEach(item => {
        const currentPath = path.resolve(truePath, item.name);
        const ext = path.parse(currentPath);

        if (!item.isFile()) return;

        fs.stat(currentPath, (err, stats) => {
            if (err) throw new Error(err);
            let size = stats.size / 1024;
            stdout.write(`${item.name} - ${ext.ext.replace('.', '')} - ${size.toFixed(3)}kb\n`)
        });
    })
})