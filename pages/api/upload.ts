import HttpStatus from 'http-status-codes'
import middleware from '../../middleware/middleware'
import nextConnect from 'next-connect';

const handler = nextConnect();

handler.use(middleware);

handler.post("/api/upload", async(req, res) => {
    console.log(Object.keys(req));
    try {
        // @ts-ignore
        const body = req.body
        // @ts-ignore
        const files = req.files
        console.log("Got files!");
        console.log(req.files); // Your files here
        // do stuff with files and body
        // @ts-ignore
        res.status(HttpStatus.OK).json({files: req.files});
    } catch (err) {
        // @ts-ignore
        res.status(HttpStatus.BAD_REQUEST).json({error: err.message});
    }
    res.status(HttpStatus.OK).json({});
});

export const config = {
    api: {
        bodyParser: false, // Disallow body parsing, consume as stream
    },
};

export default handler;