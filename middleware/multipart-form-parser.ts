import  formidable  from  'formidable';

const  form = formidable({ multiples:  true }); // multiples means req.files will be an array

export  default  async  function  parseMultipartForm(req: any, res: any, next: any) {
    const  contentType = req.headers['content-type']
    req.body = "Modified";
    req.files = [];
    if (contentType && contentType.startsWith('multipart/form-data')) {
        form.parse(req, (err: any, fields: any, files: any) => {
            if (!err) {
                req.body = fields; // sets the body field in the request object
                req.files = files; // sets the files field in the request object
            }
            next(); // continues to the next middleware or to the route
        })
    } else {
        next();
    }
}