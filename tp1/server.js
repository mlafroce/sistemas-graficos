 var connect = require('connect');
 var serveStatic = require('serve-static');

 connect()
     .use(serveStatic(__dirname + "/dist"))
     .listen(8080, () => console.log('Server running on http://localhost:8080 ...'));
