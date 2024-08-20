const { createServer } = require('http');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const port = process.env.PORT || 44321;
const hostname = process.env.HOSTNAME || 'localhost';

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();
app.prepare().then(() => {
    // const port = process.env.PORT || 44321;
    createServer((req, res) => {
        handle(req, res);
    }).listen(port, (err) => {
        if (err) throw err;

        console.log(`Ready at url localhost:${port} `);
    });
});
