Adding API endpoints
=====================

The convention we are using for this project is one API Call <====> one file. 

1. Write the API method in this folder (`/routes/api`). 

2. Suppose we have the method `foo.js`. Add the line `exports.foo = require('./foo.js');` to the file `index.js` in this folder.

3. Inside `/routes/index.js`, add a route to `/api/foo` with some logic regarding how you want the user to interact with that API endpoint.