var Express = require('express');
var cors = require('cors');
var bodyParser = require("body-parser");
const multer = require('multer');
var querystring = require('querystring');
var fs = require('fs');
var Ipconfig = require('./default.config.json');

// import express from 'express';
// import bodyParser from 'body-parser';
// var urlencode = require('urlencode');
// var json = require('json-middleware');
// var multipart = require('connect-multiparty');
// var multipartMiddleware = multipart();

// app.use(json);
// app.use(urlencode);
// app.use('/url/that/accepts/form-data', multipartMiddleware);

const https = Ipconfig.UseHttpsOrHttpToCallCsharpBackend ? require('http') : require('https');

var app = Express();

// var app = express.createServer();

app.use(cors());

//app.use(bodyParser.json());
//app.use(Express().json());
//app.use(bodyParser.urlencoded({extended: true}));
//app.use(express.urlencoded())

// app.use(express.bodyParser());

// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

// app.use(bodyParser.json({ limit: '50mb' }));
// app.use(bodyParser.urlencoded({
//     extended: true
// }));

app.use(bodyParser.json({ limit: Ipconfig.Server_Datalimit }));
app.use(bodyParser.urlencoded({ limit: Ipconfig.Server_Datalimit, extended: Ipconfig.Server_DataExtended }));

// app.use(bodyParser.json({ limit: "50mb" }));
// app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));

// app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }))
// app.use(bodyParser.json({ limit: "50mb", extended: true, parameterLimit: 50000 }))

// app.use(bodyParser.json({ limit: 1024 * 1024 * 20, type: 'application/json' }));
// app.use(bodyParser.urlencoded({ extended: true, limit: 1024 * 1024 * 20, type: 'application/x-www-form-urlencoding' }));

// app.use(bodyParser.json({ limit: '50gb' }));
// app.use(bodyParser.urlencoded({ limit: '50gb', extended: true }));
// app.use(bodyParser.urlencoded({ limit: '50gb', extended: true, parameterLimit: 50000000 }))
// app.use(express.json());

const controllerName = Ipconfig.Project_controller;

let BackendHost = Ipconfig.IsProducOrDev ? Ipconfig.Produc_ipaddress : Ipconfig.Dev_ipaddress;
let BackendPort = Ipconfig.IsProducOrDev ? Ipconfig.Produc_port : Ipconfig.Dev_port;
//Ipconfig.Project_IPAddress;
//Ipconfig.Project_Port;
const ipAddress = process.env.HOST || '127.0.0.1'; //The '127.0.0.1' is a loopback address. This is required when the IP we specified in the ecosystem is not available.
const port1 = process.env.PORT || 3000; //Same thing for the port

let Server = app.listen(port1, ipAddress, () => {

    var port = Server.address().port;
    //  var address = Server.address().address;

    console.log('Web App Hosted at http://localhost:%s', port);
    console.log('Lapo Backend Server is running on port ' + port);
    console.log(`Lapo Backend Server is running on http://localhost: ${port}.`);

    // Test 'http://192.168.1.28:8034' Production 'http://10.0.0.131:8015'
    console.log(`Server is running at http://${ipAddress}:${port}`);
    console.log('Https: ', BackendHost + ":" + BackendPort);
});


// Get Sample Data from Angular
app.get(controllerName + '/SampleData', (req, res) => {

    var postheaders2 = {
        'Content-Type': 'application/json; charset=UTF-8',
        // Authorization: auth,
        // 'X-Api-Key': 'dajzmj6gfuzmbfnhamsbuxivc', // if authentication needed
        // 'Content-Length': Buffer.byteLength(postData, 'utf8'), // postData.length
        "Access-Control-Allow-Origin": "*"
    };

    // req.query.accountId

    const options = {
        hostname: BackendHost,
        port: BackendPort,
        path: '/api/AcctSecurity/AutoAdminCreateAcct?data=' + req.query.accountId,
        method: 'GET',
        rejectUnauthorized: false,
        requestCert: true,
        agent: false,
        // key: '013a1e504621b27334a883444253a3d511270634474fef539d470c956ead6122',
        ca: 'adb73ef9ac148216277ba89cd041f4c8dd6c64f7767a652749e4358dd6f5127a',
        body: null,
        headers: postheaders2,
    };

    const reqHttp = https.request(options, (reshttp) => {
        console.log(`STATUS: ${reshttp.statusCode}`);
        console.log(`HEADERS: ${JSON.stringify(reshttp.headers)}`);
        console.log('Status Code:', reshttp.statusCode);

        let data = '';
        reshttp.setEncoding('utf8');
        reshttp.on('data', (chunk) => {
            console.log(`BODY: ${chunk}`);
            data += chunk;
        });

        reshttp.on('end', (d) => {
            console.log('No more data in response.', d);
            console.log('Body: ', JSON.parse(data));
            res.send(JSON.parse(data));
        });

    }).on("error", (err) => {
        console.log("Error now is 1: ", err.message);
    });

    reqHttp.on('error', (err) => {
        console.error(`Problem with request now is:  ${err.message}`);
        console.log("Error now is: ", err.message);
        res.send(JSON.parse({
            message: 'Error',
            tryCatchMessage: "Service can't be reached at this time. You should try again.",
            isActive: false,
            data: null,
            dataLoad: null,
            status: 404,
            statusMgs: 'Error',
            isTwoFactorAuth: false
        }));
    });

    reqHttp.on('socket', (err) => {

    });

    reqHttp.on('timeout', (err) => {
        res.send(JSON.parse({
            message: 'Error',
            tryCatchMessage: "Timeout: Service can't be reached at this time. You should try again.",
            isActive: false,
            data: null,
            dataLoad: null,
            status: 404,
            statusMgs: 'Error',
            isTwoFactorAuth: false
        }));
    });

    reqHttp.write("");
    reqHttp.end();
});













// Post 2
app.post(controllerName + '/InnerChangePassword', multer().none(), (req, res) => {

    const postData = JSON.stringify(req.body);

    //querystring.stringify(req.body);
    // console.log(JSON.stringify(req.body));

    // const auth = `Basic: ${Buffer.from('foo:myPass1234', 'utf8').toString('base64')}`;
    var postheaders2 = {
        'Content-Type': 'application/json; charset=UTF-8',
        //Authorization: auth,
        //'X-Api-Key': 'dajzmj6gfuzmbfnhamsbuxivc', // if authentication needed
        'Content-Length': Buffer.byteLength(postData, 'utf8'), //postData.length
        "Access-Control-Allow-Origin": "*"
    };

    const options = {
        hostname: BackendHost,
        port: BackendPort,
        path: '/api/AcctSecurity/InnerChangePassword',
        method: 'POST',
        rejectUnauthorized: false,
        requestCert: true,
        agent: false,
        // key: '013a1e504621b27334a883444253a3d511270634474fef539d470c956ead6122',
        ca: 'adb73ef9ac148216277ba89cd041f4c8dd6c64f7767a652749e4358dd6f5127a',
        body: postData,
        headers: postheaders2,
    };

    console.info('Post Options', options);

    const reqHttp = https.request(options, (reshttp) => {
        console.log(`STATUS: ${reshttp.statusCode}`);
        console.log(`HEADERS: ${JSON.stringify(reshttp.headers)}`);
        console.log('Status Code:', reshttp.statusCode);

        let data = '';
        reshttp.setEncoding('utf8');
        reshttp.on('data', (chunk) => {
            console.log(`BODY: ${chunk}`);
            data += chunk;
        });
        reshttp.on('end', (d) => {
            console.log('No more data in response.', d);
            console.log('Body: ', JSON.parse(data));
            res.send(JSON.parse(data));
        });

    }).on("error", (err) => {
        console.log("Error now is 1: ", err.message);
    });

    reqHttp.on('error', (err) => {
        console.error(`Problem with request now is:  ${err.message}`);
        console.log("Error now is: ", err.message);
        res.send(JSON.parse({
            message: 'Error',
            tryCatchMessage: "Service can't be reached at this time. You should try again.",
            isActive: false,
            data: null,
            dataLoad: null,
            status: 404,
            statusMgs: 'Error',
            isTwoFactorAuth: false
        }));
    });

    reqHttp.on('socket', (err) => {

    });

    reqHttp.on('timeout', (err) => {
        res.send(JSON.parse({
            message: 'Error',
            tryCatchMessage: "Timeout: Service can't be reached at this time. You should try again.",
            isActive: false,
            data: null,
            dataLoad: null,
            status: 404,
            statusMgs: 'Error',
            isTwoFactorAuth: false
        }));
    });

    reqHttp.write(postData);
    reqHttp.end();

});

app.post(controllerName + '/SetLoanPrinterArrangement', multer().none(), (req, res) => {

    const postData = JSON.stringify(req.body);

    //querystring.stringify(req.body);
    // console.log(JSON.stringify(req.body));

    // const auth = `Basic: ${Buffer.from('foo:myPass1234', 'utf8').toString('base64')}`;
    var postheaders2 = {
        'Content-Type': 'application/json; charset=UTF-8',
        //Authorization: auth,
        //'X-Api-Key': 'dajzmj6gfuzmbfnhamsbuxivc', // if authentication needed
        'Content-Length': Buffer.byteLength(postData, 'utf8'), //postData.length
        "Access-Control-Allow-Origin": "*"
    };

    const options = {
        hostname: BackendHost,
        port: BackendPort,
        path: '/api/PrintService/SetLoanPrinterArrangement',
        method: 'POST',
        rejectUnauthorized: false,
        requestCert: true,
        agent: false,
        // key: '013a1e504621b27334a883444253a3d511270634474fef539d470c956ead6122',
        ca: 'adb73ef9ac148216277ba89cd041f4c8dd6c64f7767a652749e4358dd6f5127a',
        body: postData,
        headers: postheaders2,
    };

    console.info('Post Options', options);

    const reqHttp = https.request(options, (reshttp) => {
        console.log(`STATUS: ${reshttp.statusCode}`);
        console.log(`HEADERS: ${JSON.stringify(reshttp.headers)}`);
        console.log('Status Code:', reshttp.statusCode);

        let data = '';
        reshttp.setEncoding('utf8');
        reshttp.on('data', (chunk) => {
            console.log(`BODY: ${chunk}`);
            data += chunk;
        });
        reshttp.on('end', (d) => {
            console.log('No more data in response.', d);
            console.log('Body: ', JSON.parse(data));
            res.send(JSON.parse(data));
        });

    }).on("error", (err) => {
        console.log("Error now is 1: ", err.message);
    });

    reqHttp.on('error', (err) => {
        console.error(`Problem with request now is:  ${err.message}`);
        console.log("Error now is: ", err.message);
        res.send(JSON.parse({
            message: 'Error',
            tryCatchMessage: "Service can't be reached at this time. You should try again.",
            isActive: false,
            data: null,
            dataLoad: null,
            status: 404,
            statusMgs: 'Error',
            isTwoFactorAuth: false
        }));
    });

    reqHttp.on('socket', (err) => {

    });

    reqHttp.on('timeout', (err) => {
        res.send(JSON.parse({
            message: 'Error',
            tryCatchMessage: "Timeout: Service can't be reached at this time. You should try again.",
            isActive: false,
            data: null,
            dataLoad: null,
            status: 404,
            statusMgs: 'Error',
            isTwoFactorAuth: false
        }));
    });

    reqHttp.write(postData);
    reqHttp.end();

});

// Get
app.get(controllerName + '/GetUserPermissionDetails', (req, res) => {

    // req.body.params
    // querystring.stringify(req.body);
    // console.log(JSON.stringify(req.body));

    // const auth = `Basic: ${Buffer.from('foo:myPass1234', 'utf8').toString('base64')}`;

    var postheaders2 = {
        'Content-Type': 'application/json; charset=UTF-8',
        // Authorization: auth,
        // 'X-Api-Key': 'dajzmj6gfuzmbfnhamsbuxivc', // if authentication needed
        // 'Content-Length': Buffer.byteLength(postData, 'utf8'), // postData.length
        "Access-Control-Allow-Origin": "*"
    };

    const options = {
        hostname: BackendHost,
        port: BackendPort,
        path: '/api/AcctSecurity/GetUserPermissionDetails?AccounttId=' + req.query.AccounttId,
        method: 'GET',
        rejectUnauthorized: false,
        requestCert: true,
        agent: false,
        // key: '013a1e504621b27334a883444253a3d511270634474fef539d470c956ead6122',
        ca: 'adb73ef9ac148216277ba89cd041f4c8dd6c64f7767a652749e4358dd6f5127a',
        body: null,
        headers: postheaders2,
    };

    console.info('Get Options', options);

    const reqHttp = https.request(options, (reshttp) => {
        console.log(`STATUS: ${reshttp.statusCode}`);
        console.log(`HEADERS: ${JSON.stringify(reshttp.headers)}`);
        console.log('Status Code:', reshttp.statusCode);

        let data = '';
        reshttp.setEncoding('utf8');
        reshttp.on('data', (chunk) => {
            console.log(`BODY: ${chunk}`);
            data += chunk;
        });

        reshttp.on('end', (d) => {
            console.log('No more data in response.', d);
            console.log('Body: ', JSON.parse(data));
            res.send(JSON.parse(data));
        });

    }).on("error", (err) => {
        console.log("Error now is 1: ", err.message);
    });

    reqHttp.on('error', (err) => {
        console.error(`Problem with request now is:  ${err.message}`);
        console.log("Error now is: ", err.message);
        res.send(JSON.parse({
            message: 'Error',
            tryCatchMessage: "Service can't be reached at this time. You should try again.",
            isActive: false,
            data: null,
            dataLoad: null,
            status: 404,
            statusMgs: 'Error',
            isTwoFactorAuth: false
        }));
    });

    reqHttp.on('socket', (err) => {

    });

    reqHttp.on('timeout', (err) => {
        res.send(JSON.parse({
            message: 'Error',
            tryCatchMessage: "Timeout: Service can't be reached at this time. You should try again.",
            isActive: false,
            data: null,
            dataLoad: null,
            status: 404,
            statusMgs: 'Error',
            isTwoFactorAuth: false
        }));
    });

    reqHttp.write("");
    reqHttp.end();

});

// Get
app.get(controllerName + '/UserTwoFactorActivator', (req, res) => {

    // req.body.params
    // querystring.stringify(req.body);
    // console.log(JSON.stringify(req.body));

    // const auth = `Basic: ${Buffer.from('foo:myPass1234', 'utf8').toString('base64')}`;

    var postheaders2 = {
        'Content-Type': 'application/json; charset=UTF-8',
        // Authorization: auth,
        // 'X-Api-Key': 'dajzmj6gfuzmbfnhamsbuxivc', // if authentication needed
        // 'Content-Length': Buffer.byteLength(postData, 'utf8'), // postData.length
        "Access-Control-Allow-Origin": "*"
    };

    const options = {
        hostname: BackendHost,
        port: BackendPort,
        path: '/api/AcctSecurity/UserTwoFactorActivator?AccounttId=' + req.query.AccounttId,
        method: 'GET',
        rejectUnauthorized: false,
        requestCert: true,
        agent: false,
        // key: '013a1e504621b27334a883444253a3d511270634474fef539d470c956ead6122',
        ca: 'adb73ef9ac148216277ba89cd041f4c8dd6c64f7767a652749e4358dd6f5127a',
        body: null,
        headers: postheaders2,
    };

    console.info('Get Options', options);

    const reqHttp = https.request(options, (reshttp) => {
        console.log(`STATUS: ${reshttp.statusCode}`);
        console.log(`HEADERS: ${JSON.stringify(reshttp.headers)}`);
        console.log('Status Code:', reshttp.statusCode);

        let data = '';
        reshttp.setEncoding('utf8');
        reshttp.on('data', (chunk) => {
            console.log(`BODY: ${chunk}`);
            data += chunk;
        });

        reshttp.on('end', (d) => {
            console.log('No more data in response.', d);
            console.log('Body: ', JSON.parse(data));
            res.send(JSON.parse(data));
        });

    }).on("error", (err) => {
        console.log("Error now is 1: ", err.message);
    });

    reqHttp.on('error', (err) => {
        console.error(`Problem with request now is:  ${err.message}`);
        console.log("Error now is: ", err.message);
        res.send(JSON.parse({
            message: 'Error',
            tryCatchMessage: "Service can't be reached at this time. You should try again.",
            isActive: false,
            data: null,
            dataLoad: null,
            status: 404,
            statusMgs: 'Error',
            isTwoFactorAuth: false
        }));
    });

    reqHttp.on('socket', (err) => {

    });

    reqHttp.on('timeout', (err) => {
        res.send(JSON.parse({
            message: 'Error',
            tryCatchMessage: "Timeout: Service can't be reached at this time. You should try again.",
            isActive: false,
            data: null,
            dataLoad: null,
            status: 404,
            statusMgs: 'Error',
            isTwoFactorAuth: false
        }));
    });

    reqHttp.write("");
    reqHttp.end();

});

// Post 2
app.post(controllerName + '/ChangeProfileDetails1', multer().none(), (req, res) => {

    const postData = JSON.stringify(req.body);

    //querystring.stringify(req.body);
    // console.log(JSON.stringify(req.body));

    // const auth = `Basic: ${Buffer.from('foo:myPass1234', 'utf8').toString('base64')}`;
    var postheaders2 = {
        'Content-Type': 'application/json; charset=UTF-8',
        //Authorization: auth,
        //'X-Api-Key': 'dajzmj6gfuzmbfnhamsbuxivc', // if authentication needed
        'Content-Length': Buffer.byteLength(postData, 'utf8'), //postData.length
        "Access-Control-Allow-Origin": "*"
    };

    const options = {
        hostname: BackendHost,
        port: BackendPort,
        path: '/api/AcctSecurity/ChangeProfileDetails1',
        method: 'POST',
        rejectUnauthorized: false,
        requestCert: true,
        agent: false,
        // key: '013a1e504621b27334a883444253a3d511270634474fef539d470c956ead6122',
        ca: 'adb73ef9ac148216277ba89cd041f4c8dd6c64f7767a652749e4358dd6f5127a',
        body: postData,
        headers: postheaders2,
    };

    console.info('Post Options', options);

    const reqHttp = https.request(options, (reshttp) => {
        console.log(`STATUS: ${reshttp.statusCode}`);
        console.log(`HEADERS: ${JSON.stringify(reshttp.headers)}`);
        console.log('Status Code:', reshttp.statusCode);

        let data = '';
        reshttp.setEncoding('utf8');
        reshttp.on('data', (chunk) => {
            console.log(`BODY: ${chunk}`);
            data += chunk;
        });
        reshttp.on('end', (d) => {
            console.log('No more data in response.', d);
            console.log('Body: ', JSON.parse(data));
            res.send(JSON.parse(data));
        });

    }).on("error", (err) => {
        console.log("Error now is 1: ", err.message);
    });

    reqHttp.on('error', (err) => {
        console.error(`Problem with request now is:  ${err.message}`);
        console.log("Error now is: ", err.message);
        res.send(JSON.parse({
            message: 'Error',
            tryCatchMessage: "Service can't be reached at this time. You should try again.",
            isActive: false,
            data: null,
            dataLoad: null,
            status: 404,
            statusMgs: 'Error',
            isTwoFactorAuth: false
        }));
    });

    reqHttp.on('socket', (err) => {

    });

    reqHttp.on('timeout', (err) => {
        res.send(JSON.parse({
            message: 'Error',
            tryCatchMessage: "Timeout: Service can't be reached at this time. You should try again.",
            isActive: false,
            data: null,
            dataLoad: null,
            status: 404,
            statusMgs: 'Error',
            isTwoFactorAuth: false
        }));
    });

    reqHttp.write(postData);
    reqHttp.end();

});

// Post Validate File Upload Image **********************************************
app.post(controllerName + '/ValidateFileUploadImage', multer().none(), (req, res) => {

    const postData = JSON.stringify(req.body);

    //querystring.stringify(req.body);
    // console.log(JSON.stringify(req.body));

    // const auth = `Basic: ${Buffer.from('foo:myPass1234', 'utf8').toString('base64')}`;
    var postheaders2 = {
        'Content-Type': 'application/json; charset=UTF-8',
        //Authorization: auth,
        //'X-Api-Key': 'dajzmj6gfuzmbfnhamsbuxivc', // if authentication needed
        'Content-Length': Buffer.byteLength(postData, 'utf8'), //postData.length
        "Access-Control-Allow-Origin": "*"
    };

    const options = {
        hostname: BackendHost,
        port: BackendPort,
        path: '/api/FileValidation/ValidateFileUploadImage',
        method: 'POST',
        rejectUnauthorized: false,
        requestCert: true,
        agent: false,
        // key: '013a1e504621b27334a883444253a3d511270634474fef539d470c956ead6122',
        ca: 'adb73ef9ac148216277ba89cd041f4c8dd6c64f7767a652749e4358dd6f5127a',
        body: postData,
        headers: postheaders2,
    };

    console.info('Post Options', options);

    const reqHttp = https.request(options, (reshttp) => {
        console.log(`STATUS: ${reshttp.statusCode}`);
        console.log(`HEADERS: ${JSON.stringify(reshttp.headers)}`);
        console.log('Status Code:', reshttp.statusCode);

        let data = '';
        reshttp.setEncoding('utf8');
        reshttp.on('data', (chunk) => {
            console.log(`BODY: ${chunk}`);
            data += chunk;
        });
        reshttp.on('end', (d) => {
            console.log('No more data in response.', d);
            console.log('Body: ', JSON.parse(data));
            res.send(JSON.parse(data));
        });

    }).on("error", (err) => {
        console.log("Error now is 1: ", err.message);
    });

    reqHttp.on('error', (err) => {
        console.error(`Problem with request now is:  ${err.message}`);
        console.log("Error now is: ", err.message);
        res.send(JSON.parse({
            message: 'Error',
            tryCatchMessage: "Service can't be reached at this time. You should try again.",
            isActive: false,
            data: null,
            dataLoad: null,
            status: 404,
            statusMgs: 'Error',
            isTwoFactorAuth: false
        }));
    });

    reqHttp.on('socket', (err) => {

    });

    reqHttp.on('timeout', (err) => {
        res.send(JSON.parse({
            message: 'Error',
            tryCatchMessage: "Timeout: Service can't be reached at this time. You should try again.",
            isActive: false,
            data: null,
            dataLoad: null,
            status: 404,
            statusMgs: 'Error',
            isTwoFactorAuth: false
        }));
    });

    reqHttp.write(postData);
    reqHttp.end();

});

// Post 
app.post(controllerName + '/ValidateSlipFileImage1', multer().none(), (req, res) => {

    const postData = JSON.stringify(req.body);

    //querystring.stringify(req.body);
    // console.log(JSON.stringify(req.body));

    // const auth = `Basic: ${Buffer.from('foo:myPass1234', 'utf8').toString('base64')}`;
    var postheaders2 = {
        'Content-Type': 'application/json; charset=UTF-8',
        //Authorization: auth,
        //'X-Api-Key': 'dajzmj6gfuzmbfnhamsbuxivc',            // if authentication needed
        'Content-Length': Buffer.byteLength(postData, 'utf8'), //postData.length
        "Access-Control-Allow-Origin": "*"
    };

    const options = {
        hostname: BackendHost,
        port: BackendPort,
        path: '/api/FileValidation/ValidateSlipFileImage1',
        method: 'POST',
        rejectUnauthorized: false,
        requestCert: true,
        agent: false,
        // key: '013a1e504621b27334a883444253a3d511270634474fef539d470c956ead6122',
        ca: 'adb73ef9ac148216277ba89cd041f4c8dd6c64f7767a652749e4358dd6f5127a',
        body: postData,
        headers: postheaders2,
    };

    console.info('Post Options', options);

    const reqHttp = https.request(options, (reshttp) => {
        console.log(`STATUS: ${reshttp.statusCode}`);
        console.log(`HEADERS: ${JSON.stringify(reshttp.headers)}`);
        console.log('Status Code:', reshttp.statusCode);

        let data = '';
        reshttp.setEncoding('utf8');
        reshttp.on('data', (chunk) => {
            console.log(`BODY: ${chunk}`);
            data += chunk;
        });
        reshttp.on('end', (d) => {
            console.log('No more data in response.', d);
            console.log('Body: ', JSON.parse(data));
            res.send(JSON.parse(data));
        });

    }).on("error", (err) => {
        console.log("Error now is 1: ", err.message);
    });

    reqHttp.on('error', (err) => {
        console.error(`Problem with request now is:  ${err.message}`);
        console.log("Error now is: ", err.message);
        res.send(JSON.parse({
            message: 'Error',
            tryCatchMessage: "Service can't be reached at this time. You should try again.",
            isActive: false,
            data: null,
            dataLoad: null,
            status: 404,
            statusMgs: 'Error',
            isTwoFactorAuth: false
        }));
    });

    reqHttp.on('socket', (err) => {

    });

    reqHttp.on('timeout', (err) => {
        res.send(JSON.parse({
            message: 'Error',
            tryCatchMessage: "Timeout: Service can't be reached at this time. You should try again.",
            isActive: false,
            data: null,
            dataLoad: null,
            status: 404,
            statusMgs: 'Error',
            isTwoFactorAuth: false
        }));
    });

    reqHttp.write(postData);
    reqHttp.end();

});

// Get
app.get(controllerName + '/GetUserProfileDetails', (req, res) => {

    // req.body.params
    // querystring.stringify(req.body);
    // console.log(JSON.stringify(req.body));

    // const auth = `Basic: ${Buffer.from('foo:myPass1234', 'utf8').toString('base64')}`;

    var postheaders2 = {
        'Content-Type': 'application/json; charset=UTF-8',
        // Authorization: auth,
        // 'X-Api-Key': 'dajzmj6gfuzmbfnhamsbuxivc', // if authentication needed
        // 'Content-Length': Buffer.byteLength(postData, 'utf8'), // postData.length
        "Access-Control-Allow-Origin": "*"
    };

    const options = {
        hostname: BackendHost,
        port: BackendPort,
        path: '/api/AcctSecurity/GetUserProfileDetails?AccounttId=' + req.query.AccounttId,
        method: 'GET',
        rejectUnauthorized: false,
        requestCert: true,
        agent: false,
        // key: '013a1e504621b27334a883444253a3d511270634474fef539d470c956ead6122',
        ca: 'adb73ef9ac148216277ba89cd041f4c8dd6c64f7767a652749e4358dd6f5127a',
        body: null,
        headers: postheaders2,
    };

    console.info('Get Options', options);

    const reqHttp = https.request(options, (reshttp) => {
        console.log(`STATUS: ${reshttp.statusCode}`);
        console.log(`HEADERS: ${JSON.stringify(reshttp.headers)}`);
        console.log('Status Code:', reshttp.statusCode);

        let data = '';
        reshttp.setEncoding('utf8');
        reshttp.on('data', (chunk) => {
            console.log(`BODY: ${chunk}`);
            data += chunk;
        });

        reshttp.on('end', (d) => {
            console.log('No more data in response.', d);
            console.log('Body: ', JSON.parse(data));
            res.send(JSON.parse(data));
        });

    }).on("error", (err) => {
        console.log("Error now is 1: ", err.message);
    });

    reqHttp.on('error', (err) => {
        console.error(`Problem with request now is:  ${err.message}`);
        console.log("Error now is: ", err.message);
        res.send(JSON.parse({
            message: 'Error',
            tryCatchMessage: "Service can't be reached at this time. You should try again.",
            isActive: false,
            data: null,
            dataLoad: null,
            status: 404,
            statusMgs: 'Error',
            isTwoFactorAuth: false
        }));
    });

    reqHttp.on('socket', (err) => {

    });

    reqHttp.on('timeout', (err) => {
        res.send(JSON.parse({
            message: 'Error',
            tryCatchMessage: "Timeout: Service can't be reached at this time. You should try again.",
            isActive: false,
            data: null,
            dataLoad: null,
            status: 404,
            statusMgs: 'Error',
            isTwoFactorAuth: false
        }));
    });

    reqHttp.write("");
    reqHttp.end();

});

// Get
app.get(controllerName + '/AdminLoanMethodListApp', (req, res) => {

    // req.body.params
    // querystring.stringify(req.body);
    // console.log(JSON.stringify(req.body));

    // const auth = `Basic: ${Buffer.from('foo:myPass1234', 'utf8').toString('base64')}`;

    var postheaders2 = {
        'Content-Type': 'application/json; charset=UTF-8',
        // Authorization: auth,
        // 'X-Api-Key': 'dajzmj6gfuzmbfnhamsbuxivc', // if authentication needed
        // 'Content-Length': Buffer.byteLength(postData, 'utf8'), // postData.length
        "Access-Control-Allow-Origin": "*"
    };

    const options = {
        hostname: BackendHost,
        port: BackendPort,
        path: '/api/AcctSecurity/AdminLoanMethodListApp?AcctId=' + req.query.AcctId,
        method: 'GET',
        rejectUnauthorized: false,
        requestCert: true,
        agent: false,
        // key: '013a1e504621b27334a883444253a3d511270634474fef539d470c956ead6122',
        ca: 'adb73ef9ac148216277ba89cd041f4c8dd6c64f7767a652749e4358dd6f5127a',
        body: null,
        headers: postheaders2,
    };

    console.info('Get Options', options);

    const reqHttp = https.request(options, (reshttp) => {
        console.log(`STATUS: ${reshttp.statusCode}`);
        console.log(`HEADERS: ${JSON.stringify(reshttp.headers)}`);
        console.log('Status Code:', reshttp.statusCode);

        let data = '';
        reshttp.setEncoding('utf8');
        reshttp.on('data', (chunk) => {
            console.log(`BODY: ${chunk}`);
            data += chunk;
        });

        reshttp.on('end', (d) => {
            console.log('No more data in response.', d);
            console.log('Body: ', JSON.parse(data));
            res.send(JSON.parse(data));
        });

    }).on("error", (err) => {
        console.log("Error now is 1: ", err.message);
    });

    reqHttp.on('error', (err) => {
        console.error(`Problem with request now is:  ${err.message}`);
        console.log("Error now is: ", err.message);
        res.send(JSON.parse({
            message: 'Error',
            tryCatchMessage: "Service can't be reached at this time. You should try again.",
            isActive: false,
            data: null,
            dataLoad: null,
            status: 404,
            statusMgs: 'Error',
            isTwoFactorAuth: false
        }));
    });

    reqHttp.on('socket', (err) => {

    });

    reqHttp.on('timeout', (err) => {
        res.send(JSON.parse({
            message: 'Error',
            tryCatchMessage: "Timeout: Service can't be reached at this time. You should try again.",
            isActive: false,
            data: null,
            dataLoad: null,
            status: 404,
            statusMgs: 'Error',
            isTwoFactorAuth: false
        }));
    });

    reqHttp.write("");
    reqHttp.end();

});

// Get
app.get(controllerName + '/LoanAppDetails', (req, res) => {

    // req.body.params
    // querystring.stringify(req.body);
    // console.log(JSON.stringify(req.body));

    // const auth = `Basic: ${Buffer.from('foo:myPass1234', 'utf8').toString('base64')}`;

    var postheaders2 = {
        'Content-Type': 'application/json; charset=UTF-8',
        // Authorization: auth,
        // 'X-Api-Key': 'dajzmj6gfuzmbfnhamsbuxivc', // if authentication needed
        // 'Content-Length': Buffer.byteLength(postData, 'utf8'), // postData.length
        "Access-Control-Allow-Origin": "*"
    };

    const options = {
        hostname: BackendHost,
        port: BackendPort,
        path: '/api/AcctSecurity/LoanAppDetails?AppHeaderId=' + req.query.AppHeaderId + "&AcctId=" + req.query.AcctId,
        method: 'GET',
        rejectUnauthorized: false,
        requestCert: true,
        agent: false,
        // key: '013a1e504621b27334a883444253a3d511270634474fef539d470c956ead6122',
        ca: 'adb73ef9ac148216277ba89cd041f4c8dd6c64f7767a652749e4358dd6f5127a',
        body: null,
        headers: postheaders2,
    };

    console.info('Get Options', options);

    const reqHttp = https.request(options, (reshttp) => {
        console.log(`STATUS: ${reshttp.statusCode}`);
        console.log(`HEADERS: ${JSON.stringify(reshttp.headers)}`);
        console.log('Status Code:', reshttp.statusCode);

        let data = '';
        reshttp.setEncoding('utf8');
        reshttp.on('data', (chunk) => {
            console.log(`BODY: ${chunk}`);
            data += chunk;
        });

        reshttp.on('end', (d) => {
            console.log('No more data in response.', d);
            console.log('Body: ', JSON.parse(data));
            res.send(JSON.parse(data));
        });

    }).on("error", (err) => {
        console.log("Error now is 1: ", err.message);
    });

    reqHttp.on('error', (err) => {
        console.error(`Problem with request now is:  ${err.message}`);
        console.log("Error now is: ", err.message);
        res.send(JSON.parse({
            message: 'Error',
            tryCatchMessage: "Service can't be reached at this time. You should try again.",
            isActive: false,
            data: null,
            dataLoad: null,
            status: 404,
            statusMgs: 'Error',
            isTwoFactorAuth: false
        }));
    });

    reqHttp.on('socket', (err) => {

    });

    reqHttp.on('timeout', (err) => {
        res.send(JSON.parse({
            message: 'Error',
            tryCatchMessage: "Timeout: Service can't be reached at this time. You should try again.",
            isActive: false,
            data: null,
            dataLoad: null,
            status: 404,
            statusMgs: 'Error',
            isTwoFactorAuth: false
        }));
    });

    reqHttp.write("");
    reqHttp.end();

});

// Post 
app.post(controllerName + '/CalculateScheduledLoanAmount', multer().none(), (req, res) => {

    const postData = JSON.stringify(req.body);

    //querystring.stringify(req.body);
    // console.log(JSON.stringify(req.body));

    // const auth = `Basic: ${Buffer.from('foo:myPass1234', 'utf8').toString('base64')}`;
    var postheaders2 = {
        'Content-Type': 'application/json; charset=UTF-8',
        //Authorization: auth,
        //'X-Api-Key': 'dajzmj6gfuzmbfnhamsbuxivc',            // if authentication needed
        'Content-Length': Buffer.byteLength(postData, 'utf8'), //postData.length
        "Access-Control-Allow-Origin": "*"
    };

    const options = {
        hostname: BackendHost,
        port: BackendPort,
        path: '/api/LoanScheduled/CalculateScheduledLoanAmount',
        method: 'POST',
        rejectUnauthorized: false,
        requestCert: true,
        agent: false,
        // key: '013a1e504621b27334a883444253a3d511270634474fef539d470c956ead6122',
        ca: 'adb73ef9ac148216277ba89cd041f4c8dd6c64f7767a652749e4358dd6f5127a',
        body: postData,
        headers: postheaders2,
    };

    console.info('Post Options', options);

    const reqHttp = https.request(options, (reshttp) => {
        console.log(`STATUS: ${reshttp.statusCode}`);
        console.log(`HEADERS: ${JSON.stringify(reshttp.headers)}`);
        console.log('Status Code:', reshttp.statusCode);

        let data = '';
        reshttp.setEncoding('utf8');
        reshttp.on('data', (chunk) => {
            console.log(`BODY: ${chunk}`);
            data += chunk;
        });
        reshttp.on('end', (d) => {
            console.log('No more data in response.', d);
            console.log('Body: ', JSON.parse(data));
            res.send(JSON.parse(data));
        });

    }).on("error", (err) => {
        console.log("Error now is 1: ", err.message);
    });

    reqHttp.on('error', (err) => {
        console.error(`Problem with request now is:  ${err.message}`);
        console.log("Error now is: ", err.message);
        res.send(JSON.parse({
            message: 'Error',
            tryCatchMessage: "Service can't be reached at this time. You should try again.",
            isActive: false,
            data: null,
            dataLoad: null,
            status: 404,
            statusMgs: 'Error',
            isTwoFactorAuth: false
        }));
    });

    reqHttp.on('socket', (err) => {

    });

    reqHttp.on('timeout', (err) => {
        res.send(JSON.parse({
            message: 'Error',
            tryCatchMessage: "Timeout: Service can't be reached at this time. You should try again.",
            isActive: false,
            data: null,
            dataLoad: null,
            status: 404,
            statusMgs: 'Error',
            isTwoFactorAuth: false
        }));
    });

    reqHttp.write(postData);
    reqHttp.end();

});

// Post AllOngoingAndCompletedLoanAppList
app.post(controllerName + '/GetBankAcctName', multer().none(), (req, res) => {

    const postData = JSON.stringify(req.body);

    //querystring.stringify(req.body);
    // console.log(JSON.stringify(req.body));

    // const auth = `Basic: ${Buffer.from('foo:myPass1234', 'utf8').toString('base64')}`;
    var postheaders2 = {
        'Content-Type': 'application/json; charset=UTF-8',
        //Authorization: auth,
        //'X-Api-Key': 'dajzmj6gfuzmbfnhamsbuxivc',            // if authentication needed
        'Content-Length': Buffer.byteLength(postData, 'utf8'), //postData.length
        "Access-Control-Allow-Origin": "*"
    };

    const options = {
        hostname: BackendHost,
        port: BackendPort,
        path: '/api/AcctSecurity/GetBankAcctName',
        method: 'POST',
        rejectUnauthorized: false,
        requestCert: true,
        agent: false,
        // key: '013a1e504621b27334a883444253a3d511270634474fef539d470c956ead6122',
        ca: 'adb73ef9ac148216277ba89cd041f4c8dd6c64f7767a652749e4358dd6f5127a',
        body: postData,
        headers: postheaders2,
    };

    console.info('Post Options', options);

    const reqHttp = https.request(options, (reshttp) => {
        console.log(`STATUS: ${reshttp.statusCode}`);
        console.log(`HEADERS: ${JSON.stringify(reshttp.headers)}`);
        console.log('Status Code:', reshttp.statusCode);

        let data = '';
        reshttp.setEncoding('utf8');
        reshttp.on('data', (chunk) => {
            console.log(`BODY: ${chunk}`);
            data += chunk;
        });
        reshttp.on('end', (d) => {
            console.log('No more data in response.', d);
            console.log('Body: ', JSON.parse(data));
            res.send(JSON.parse(data));
        });

    }).on("error", (err) => {
        console.log("Error now is 1: ", err.message);
    });

    reqHttp.on('error', (err) => {
        console.error(`Problem with request now is:  ${err.message}`);
        console.log("Error now is: ", err.message);
        res.send(JSON.parse({
            message: 'Error',
            tryCatchMessage: "Service can't be reached at this time. You should try again.",
            isActive: false,
            data: null,
            dataLoad: null,
            status: 404,
            statusMgs: 'Error',
            isTwoFactorAuth: false
        }));
    });

    reqHttp.on('socket', (err) => {

    });

    reqHttp.on('timeout', (err) => {
        res.send(JSON.parse({
            message: 'Error',
            tryCatchMessage: "Timeout: Service can't be reached at this time. You should try again.",
            isActive: false,
            data: null,
            dataLoad: null,
            status: 404,
            statusMgs: 'Error',
            isTwoFactorAuth: false
        }));
    });

    reqHttp.write(postData);
    reqHttp.end();

});

// Post 
app.post(controllerName + '/RetrivetedBankAcctName', multer().none(), (req, res) => {

    const postData = JSON.stringify(req.body);

    //querystring.stringify(req.body);
    // console.log(JSON.stringify(req.body));

    // const auth = `Basic: ${Buffer.from('foo:myPass1234', 'utf8').toString('base64')}`;
    var postheaders2 = {
        'Content-Type': 'application/json; charset=UTF-8',
        //Authorization: auth,
        //'X-Api-Key': 'dajzmj6gfuzmbfnhamsbuxivc', // if authentication needed
        'Content-Length': Buffer.byteLength(postData, 'utf8'), //postData.length
        "Access-Control-Allow-Origin": "*"
    };

    const options = {
        hostname: BackendHost,
        port: BackendPort,
        path: '/api/HubTeam/RetrivetedBankAcctName',
        method: 'POST',
        rejectUnauthorized: false,
        requestCert: true,
        agent: false,
        // key: '013a1e504621b27334a883444253a3d511270634474fef539d470c956ead6122',
        ca: 'adb73ef9ac148216277ba89cd041f4c8dd6c64f7767a652749e4358dd6f5127a',
        body: postData,
        headers: postheaders2,
    };

    console.info('Post Options', options);

    const reqHttp = https.request(options, (reshttp) => {
        console.log(`STATUS: ${reshttp.statusCode}`);
        console.log(`HEADERS: ${JSON.stringify(reshttp.headers)}`);
        console.log('Status Code:', reshttp.statusCode);

        let data = '';
        reshttp.setEncoding('utf8');
        reshttp.on('data', (chunk) => {
            console.log(`BODY: ${chunk}`);
            data += chunk;
        });
        reshttp.on('end', (d) => {
            console.log('No more data in response.', d);
            console.log('Body: ', JSON.parse(data));
            res.send(JSON.parse(data));
        });

    }).on("error", (err) => {
        console.log("Error now is 1: ", err.message);
    });

    reqHttp.on('error', (err) => {
        console.error(`Problem with request now is:  ${err.message}`);
        console.log("Error now is: ", err.message);
        res.send(JSON.parse({
            message: 'Error',
            tryCatchMessage: "Service can't be reached at this time. You should try again.",
            isActive: false,
            data: null,
            dataLoad: null,
            status: 404,
            statusMgs: 'Error',
            isTwoFactorAuth: false
        }));
    });

    reqHttp.on('socket', (err) => {

    });

    reqHttp.on('timeout', (err) => {
        res.send(JSON.parse({
            message: 'Error',
            tryCatchMessage: "Timeout: Service can't be reached at this time. You should try again.",
            isActive: false,
            data: null,
            dataLoad: null,
            status: 404,
            statusMgs: 'Error',
            isTwoFactorAuth: false
        }));
    });

    reqHttp.write(postData);
    reqHttp.end();

});

// Get
app.get(controllerName + '/CheckIfOfficerMember', (req, res) => {

    // req.body.params
    // querystring.stringify(req.body);
    // console.log(JSON.stringify(req.body));

    // const auth = `Basic: ${Buffer.from('foo:myPass1234', 'utf8').toString('base64')}`;

    var postheaders2 = {
        'Content-Type': 'application/json; charset=UTF-8',
        // Authorization: auth,
        // 'X-Api-Key': 'dajzmj6gfuzmbfnhamsbuxivc', // if authentication needed
        // 'Content-Length': Buffer.byteLength(postData, 'utf8'), // postData.length
        "Access-Control-Allow-Origin": "*"
    };

    const options = {
        hostname: BackendHost,
        port: BackendPort,
        path: '/api/HubTeam/CheckIfOfficerMember?OffFirstName=' + req.query.OffFirstName + '&OffOther=' + req.query.OffOther,
        method: 'GET',
        rejectUnauthorized: false,
        requestCert: true,
        agent: false,
        // key: '013a1e504621b27334a883444253a3d511270634474fef539d470c956ead6122',
        ca: 'adb73ef9ac148216277ba89cd041f4c8dd6c64f7767a652749e4358dd6f5127a',
        body: null,
        headers: postheaders2,
    };

    console.info('Get Options', options);

    const reqHttp = https.request(options, (reshttp) => {
        console.log(`STATUS: ${reshttp.statusCode}`);
        console.log(`HEADERS: ${JSON.stringify(reshttp.headers)}`);
        console.log('Status Code:', reshttp.statusCode);

        let data = '';
        reshttp.setEncoding('utf8');
        reshttp.on('data', (chunk) => {
            console.log(`BODY: ${chunk}`);
            data += chunk;
        });

        reshttp.on('end', (d) => {
            console.log('No more data in response.', d);
            console.log('Body: ', JSON.parse(data));
            res.send(JSON.parse(data));
        });

    }).on("error", (err) => {
        console.log("Error now is 1: ", err.message);
    });

    reqHttp.on('error', (err) => {
        console.error(`Problem with request now is:  ${err.message}`);
        console.log("Error now is: ", err.message);
        res.send(JSON.parse({
            message: 'Error',
            tryCatchMessage: "Service can't be reached at this time. You should try again.",
            isActive: false,
            data: null,
            dataLoad: null,
            status: 404,
            statusMgs: 'Error',
            isTwoFactorAuth: false
        }));
    });

    reqHttp.on('socket', (err) => {

    });

    reqHttp.on('timeout', (err) => {
        res.send(JSON.parse({
            message: 'Error',
            tryCatchMessage: "Timeout: Service can't be reached at this time. You should try again.",
            isActive: false,
            data: null,
            dataLoad: null,
            status: 404,
            statusMgs: 'Error',
            isTwoFactorAuth: false
        }));
    });

    reqHttp.write("");
    reqHttp.end();

});

// Get
app.get(controllerName + '/CheckIfBankAccountIsOk', (req, res) => {

    // req.body.params
    // querystring.stringify(req.body);
    // console.log(JSON.stringify(req.body));

    // const auth = `Basic: ${Buffer.from('foo:myPass1234', 'utf8').toString('base64')}`;

    var postheaders2 = {
        'Content-Type': 'application/json; charset=UTF-8',
        // Authorization: auth,
        // 'X-Api-Key': 'dajzmj6gfuzmbfnhamsbuxivc', // if authentication needed
        // 'Content-Length': Buffer.byteLength(postData, 'utf8'), // postData.length
        "Access-Control-Allow-Origin": "*"
    };

    const options = {
        hostname: BackendHost,
        port: BackendPort,
        path: '/api/AcctSecurity/CheckIfBankAccountIsOk?AcctId=' + req.query.AcctId,
        method: 'GET',
        rejectUnauthorized: false,
        requestCert: true,
        agent: false,
        // key: '013a1e504621b27334a883444253a3d511270634474fef539d470c956ead6122',
        ca: 'adb73ef9ac148216277ba89cd041f4c8dd6c64f7767a652749e4358dd6f5127a',
        body: null,
        headers: postheaders2,
    };

    console.info('Get Options', options);

    const reqHttp = https.request(options, (reshttp) => {
        console.log(`STATUS: ${reshttp.statusCode}`);
        console.log(`HEADERS: ${JSON.stringify(reshttp.headers)}`);
        console.log('Status Code:', reshttp.statusCode);

        let data = '';
        reshttp.setEncoding('utf8');
        reshttp.on('data', (chunk) => {
            console.log(`BODY: ${chunk}`);
            data += chunk;
        });

        reshttp.on('end', (d) => {
            console.log('No more data in response.', d);
            console.log('Body: ', JSON.parse(data));
            res.send(JSON.parse(data));
        });

    }).on("error", (err) => {
        console.log("Error now is 1: ", err.message);
    });

    reqHttp.on('error', (err) => {
        console.error(`Problem with request now is:  ${err.message}`);
        console.log("Error now is: ", err.message);
        res.send(JSON.parse({
            message: 'Error',
            tryCatchMessage: "Service can't be reached at this time. You should try again.",
            isActive: false,
            data: null,
            dataLoad: null,
            status: 404,
            statusMgs: 'Error',
            isTwoFactorAuth: false
        }));
    });

    reqHttp.on('socket', (err) => {

    });

    reqHttp.on('timeout', (err) => {
        res.send(JSON.parse({
            message: 'Error',
            tryCatchMessage: "Timeout: Service can't be reached at this time. You should try again.",
            isActive: false,
            data: null,
            dataLoad: null,
            status: 404,
            statusMgs: 'Error',
            isTwoFactorAuth: false
        }));
    });

    reqHttp.write("");
    reqHttp.end();

});

// Get
app.get(controllerName + '/GetLoanSetting', (req, res) => {

    // req.body.params
    // querystring.stringify(req.body);
    // console.log(JSON.stringify(req.body));

    // const auth = `Basic: ${Buffer.from('foo:myPass1234', 'utf8').toString('base64')}`;

    var postheaders2 = {
        'Content-Type': 'application/json; charset=UTF-8',
        // Authorization: auth,
        // 'X-Api-Key': 'dajzmj6gfuzmbfnhamsbuxivc', // if authentication needed
        // 'Content-Length': Buffer.byteLength(postData, 'utf8'), // postData.length
        "Access-Control-Allow-Origin": "*"
    };

    const options = {
        hostname: BackendHost,
        port: BackendPort,
        path: '/api/AcctSecurity/GetLoanSetting?Id=' + req.query.Id,
        method: 'GET',
        rejectUnauthorized: false,
        requestCert: true,
        agent: false,
        // key: '013a1e504621b27334a883444253a3d511270634474fef539d470c956ead6122',
        ca: 'adb73ef9ac148216277ba89cd041f4c8dd6c64f7767a652749e4358dd6f5127a',
        body: null,
        headers: postheaders2,
    };

    console.info('Get Options', options);

    const reqHttp = https.request(options, (reshttp) => {
        console.log(`STATUS: ${reshttp.statusCode}`);
        console.log(`HEADERS: ${JSON.stringify(reshttp.headers)}`);
        console.log('Status Code:', reshttp.statusCode);

        let data = '';
        reshttp.setEncoding('utf8');
        reshttp.on('data', (chunk) => {
            console.log(`BODY: ${chunk}`);
            data += chunk;
        });

        reshttp.on('end', (d) => {
            console.log('No more data in response.', d);
            console.log('Body: ', JSON.parse(data));
            res.send(JSON.parse(data));
        });

    }).on("error", (err) => {
        console.log("Error now is 1: ", err.message);
    });

    reqHttp.on('error', (err) => {
        console.error(`Problem with request now is:  ${err.message}`);
        console.log("Error now is: ", err.message);
        res.send(JSON.parse({
            message: 'Error',
            tryCatchMessage: "Service can't be reached at this time. You should try again.",
            isActive: false,
            data: null,
            dataLoad: null,
            status: 404,
            statusMgs: 'Error',
            isTwoFactorAuth: false
        }));
    });

    reqHttp.on('socket', (err) => {

    });

    reqHttp.on('timeout', (err) => {
        res.send(JSON.parse({
            message: 'Error',
            tryCatchMessage: "Timeout: Service can't be reached at this time. You should try again.",
            isActive: false,
            data: null,
            dataLoad: null,
            status: 404,
            statusMgs: 'Error',
            isTwoFactorAuth: false
        }));
    });

    reqHttp.write("");
    reqHttp.end();

});

// Post 
app.post(controllerName + '/CancelLoanAppRequest', multer().none(), (req, res) => {

    const postData = JSON.stringify(req.body);

    //querystring.stringify(req.body);
    // console.log(JSON.stringify(req.body));

    // const auth = `Basic: ${Buffer.from('foo:myPass1234', 'utf8').toString('base64')}`;
    var postheaders2 = {
        'Content-Type': 'application/json; charset=UTF-8',
        //Authorization: auth,
        //'X-Api-Key': 'dajzmj6gfuzmbfnhamsbuxivc', // if authentication needed
        'Content-Length': Buffer.byteLength(postData, 'utf8'), //postData.length
        "Access-Control-Allow-Origin": "*"
    };

    const options = {
        hostname: BackendHost,
        port: BackendPort,
        path: '/api/AcctSecurity/CancelLoanAppRequest',
        method: 'POST',
        rejectUnauthorized: false,
        requestCert: true,
        agent: false,
        // key: '013a1e504621b27334a883444253a3d511270634474fef539d470c956ead6122',
        ca: 'adb73ef9ac148216277ba89cd041f4c8dd6c64f7767a652749e4358dd6f5127a',
        body: postData,
        headers: postheaders2,
    };

    console.info('Post Options', options);

    const reqHttp = https.request(options, (reshttp) => {
        console.log(`STATUS: ${reshttp.statusCode}`);
        console.log(`HEADERS: ${JSON.stringify(reshttp.headers)}`);
        console.log('Status Code:', reshttp.statusCode);

        let data = '';
        reshttp.setEncoding('utf8');
        reshttp.on('data', (chunk) => {
            console.log(`BODY: ${chunk}`);
            data += chunk;
        });
        reshttp.on('end', (d) => {
            console.log('No more data in response.', d);
            console.log('Body: ', JSON.parse(data));
            res.send(JSON.parse(data));
        });

    }).on("error", (err) => {
        console.log("Error now is 1: ", err.message);
    });

    reqHttp.on('error', (err) => {
        console.error(`Problem with request now is:  ${err.message}`);
        console.log("Error now is: ", err.message);
        res.send(JSON.parse({
            message: 'Error',
            tryCatchMessage: "Service can't be reached at this time. You should try again.",
            isActive: false,
            data: null,
            dataLoad: null,
            status: 404,
            statusMgs: 'Error',
            isTwoFactorAuth: false
        }));
    });

    reqHttp.on('socket', (err) => {

    });

    reqHttp.on('timeout', (err) => {
        res.send(JSON.parse({
            message: 'Error',
            tryCatchMessage: "Timeout: Service can't be reached at this time. You should try again.",
            isActive: false,
            data: null,
            dataLoad: null,
            status: 404,
            statusMgs: 'Error',
            isTwoFactorAuth: false
        }));
    });

    reqHttp.write(postData);
    reqHttp.end();

});

// Post
app.post(controllerName + '/CustomerdashboardLoanApp', multer().none(), (req, res) => {

    const postData = JSON.stringify(req.body);

    //querystring.stringify(req.body);
    // console.log(JSON.stringify(req.body));

    // const auth = `Basic: ${Buffer.from('foo:myPass1234', 'utf8').toString('base64')}`;
    var postheaders2 = {
        'Content-Type': 'application/json; charset=UTF-8',
        //Authorization: auth,
        //'X-Api-Key': 'dajzmj6gfuzmbfnhamsbuxivc', // if authentication needed
        'Content-Length': Buffer.byteLength(postData, 'utf8'), //postData.length
        "Access-Control-Allow-Origin": "*"
    };

    const options = {
        hostname: BackendHost,
        port: BackendPort,
        path: '/api/AcctSecurity/CustomerdashboardLoanApp',
        method: 'POST',
        rejectUnauthorized: false,
        requestCert: true,
        agent: false,
        // key: '013a1e504621b27334a883444253a3d511270634474fef539d470c956ead6122',
        ca: 'adb73ef9ac148216277ba89cd041f4c8dd6c64f7767a652749e4358dd6f5127a',
        body: postData,
        headers: postheaders2,
    };

    console.info('Post Options', options);

    const reqHttp = https.request(options, (reshttp) => {
        console.log(`STATUS: ${reshttp.statusCode}`);
        console.log(`HEADERS: ${JSON.stringify(reshttp.headers)}`);
        console.log('Status Code:', reshttp.statusCode);

        let data = '';
        reshttp.setEncoding('utf8');
        reshttp.on('data', (chunk) => {
            console.log(`BODY: ${chunk}`);
            data += chunk;
        });
        reshttp.on('end', (d) => {
            console.log('No more data in response.', d);
            console.log('Body: ', JSON.parse(data));
            res.send(JSON.parse(data));
        });

    }).on("error", (err) => {
        console.log("Error now is 1: ", err.message);
    });

    reqHttp.on('error', (err) => {
        console.error(`Problem with request now is:  ${err.message}`);
        console.log("Error now is: ", err.message);
        res.send(JSON.parse({
            message: 'Error',
            tryCatchMessage: "Service can't be reached at this time. You should try again.",
            isActive: false,
            data: null,
            dataLoad: null,
            status: 404,
            statusMgs: 'Error',
            isTwoFactorAuth: false
        }));
    });

    reqHttp.on('socket', (err) => {

    });

    reqHttp.on('timeout', (err) => {
        res.send(JSON.parse({
            message: 'Error',
            tryCatchMessage: "Timeout: Service can't be reached at this time. You should try again.",
            isActive: false,
            data: null,
            dataLoad: null,
            status: 404,
            statusMgs: 'Error',
            isTwoFactorAuth: false
        }));
    });

    reqHttp.write(postData);
    reqHttp.end();

});

// Post
app.post(controllerName + '/AllLoanApp', multer().none(), (req, res) => {

    const postData = JSON.stringify(req.body);

    //querystring.stringify(req.body);
    // console.log(JSON.stringify(req.body));

    // const auth = `Basic: ${Buffer.from('foo:myPass1234', 'utf8').toString('base64')}`;
    var postheaders2 = {
        'Content-Type': 'application/json; charset=UTF-8',
        //Authorization: auth,
        //'X-Api-Key': 'dajzmj6gfuzmbfnhamsbuxivc', // if authentication needed
        'Content-Length': Buffer.byteLength(postData, 'utf8'), //postData.length
        "Access-Control-Allow-Origin": "*"
    };

    const options = {
        hostname: BackendHost,
        port: BackendPort,
        path: '/api/AcctSecurity/AllLoanApp',
        method: 'POST',
        rejectUnauthorized: false,
        requestCert: true,
        agent: false,
        // key: '013a1e504621b27334a883444253a3d511270634474fef539d470c956ead6122',
        ca: 'adb73ef9ac148216277ba89cd041f4c8dd6c64f7767a652749e4358dd6f5127a',
        body: postData,
        headers: postheaders2,
    };

    console.info('Post Options', options);

    const reqHttp = https.request(options, (reshttp) => {
        console.log(`STATUS: ${reshttp.statusCode}`);
        console.log(`HEADERS: ${JSON.stringify(reshttp.headers)}`);
        console.log('Status Code:', reshttp.statusCode);

        let data = '';
        reshttp.setEncoding('utf8');
        reshttp.on('data', (chunk) => {
            console.log(`BODY: ${chunk}`);
            data += chunk;
        });
        reshttp.on('end', (d) => {
            console.log('No more data in response.', d);
            console.log('Body: ', JSON.parse(data));
            res.send(JSON.parse(data));
        });

    }).on("error", (err) => {
        console.log("Error now is 1: ", err.message);
    });

    reqHttp.on('error', (err) => {
        console.error(`Problem with request now is:  ${err.message}`);
        console.log("Error now is: ", err.message);
        res.send(JSON.parse({
            message: 'Error',
            tryCatchMessage: "Service can't be reached at this time. You should try again.",
            isActive: false,
            data: null,
            dataLoad: null,
            status: 404,
            statusMgs: 'Error',
            isTwoFactorAuth: false
        }));
    });

    reqHttp.on('socket', (err) => {

    });

    reqHttp.on('timeout', (err) => {
        res.send(JSON.parse({
            message: 'Error',
            tryCatchMessage: "Timeout: Service can't be reached at this time. You should try again.",
            isActive: false,
            data: null,
            dataLoad: null,
            status: 404,
            statusMgs: 'Error',
            isTwoFactorAuth: false
        }));
    });

    reqHttp.write(postData);
    reqHttp.end();

});

// Get
app.get(controllerName + '/ListOfNarrationList', (req, res) => {

    // req.body.params
    // querystring.stringify(req.body);
    // console.log(JSON.stringify(req.body));

    // const auth = `Basic: ${Buffer.from('foo:myPass1234', 'utf8').toString('base64')}`;

    var postheaders2 = {
        'Content-Type': 'application/json; charset=UTF-8',
        // Authorization: auth,
        // 'X-Api-Key': 'dajzmj6gfuzmbfnhamsbuxivc', // if authentication needed
        // 'Content-Length': Buffer.byteLength(postData, 'utf8'), // postData.length
        "Access-Control-Allow-Origin": "*"
    };

    const options = {
        hostname: BackendHost,
        port: BackendPort,
        path: '/api/AcctSecurity/ListOfNarrationList?AcctId=' + req.query.AcctId,
        method: 'GET',
        rejectUnauthorized: false,
        requestCert: true,
        agent: false,
        // key: '013a1e504621b27334a883444253a3d511270634474fef539d470c956ead6122',
        ca: 'adb73ef9ac148216277ba89cd041f4c8dd6c64f7767a652749e4358dd6f5127a',
        body: null,
        headers: postheaders2,
    };

    console.info('Get Options', options);

    const reqHttp = https.request(options, (reshttp) => {
        console.log(`STATUS: ${reshttp.statusCode}`);
        console.log(`HEADERS: ${JSON.stringify(reshttp.headers)}`);
        console.log('Status Code:', reshttp.statusCode);

        let data = '';
        reshttp.setEncoding('utf8');
        reshttp.on('data', (chunk) => {
            console.log(`BODY: ${chunk}`);
            data += chunk;
        });

        reshttp.on('end', (d) => {
            console.log('No more data in response.', d);
            console.log('Body: ', JSON.parse(data));
            res.send(JSON.parse(data));
        });

    }).on("error", (err) => {
        console.log("Error now is 1: ", err.message);
    });

    reqHttp.on('error', (err) => {
        console.error(`Problem with request now is:  ${err.message}`);
        console.log("Error now is: ", err.message);
        res.send(JSON.parse({
            message: 'Error',
            tryCatchMessage: "Service can't be reached at this time. You should try again.",
            isActive: false,
            data: null,
            dataLoad: null,
            status: 404,
            statusMgs: 'Error',
            isTwoFactorAuth: false
        }));
    });

    reqHttp.on('socket', (err) => {

    });

    reqHttp.on('timeout', (err) => {
        res.send(JSON.parse({
            message: 'Error',
            tryCatchMessage: "Timeout: Service can't be reached at this time. You should try again.",
            isActive: false,
            data: null,
            dataLoad: null,
            status: 404,
            statusMgs: 'Error',
            isTwoFactorAuth: false
        }));
    });

    reqHttp.write("");
    reqHttp.end();

});

// Get
app.get(controllerName + '/GetBusinessSegments', (req, res) => {

    // req.body.params
    // querystring.stringify(req.body);
    // console.log(JSON.stringify(req.body));

    // const auth = `Basic: ${Buffer.from('foo:myPass1234', 'utf8').toString('base64')}`;

    var postheaders2 = {
        'Content-Type': 'application/json; charset=UTF-8',
        // Authorization: auth,
        // 'X-Api-Key': 'dajzmj6gfuzmbfnhamsbuxivc', // if authentication needed
        // 'Content-Length': Buffer.byteLength(postData, 'utf8'), // postData.length
        "Access-Control-Allow-Origin": "*"
    };

    const options = {
        hostname: BackendHost,
        port: BackendPort,
        path: '/api/AcctSecurity/GetBusinessSegments',
        method: 'GET',
        rejectUnauthorized: false,
        requestCert: true,
        agent: false,
        // key: '013a1e504621b27334a883444253a3d511270634474fef539d470c956ead6122',
        ca: 'adb73ef9ac148216277ba89cd041f4c8dd6c64f7767a652749e4358dd6f5127a',
        body: null,
        headers: postheaders2,
    };

    console.info('Get Options', options);

    const reqHttp = https.request(options, (reshttp) => {
        console.log(`STATUS: ${reshttp.statusCode}`);
        console.log(`HEADERS: ${JSON.stringify(reshttp.headers)}`);
        console.log('Status Code:', reshttp.statusCode);

        let data = '';
        reshttp.setEncoding('utf8');
        reshttp.on('data', (chunk) => {
            console.log(`BODY: ${chunk}`);
            data += chunk;
        });

        reshttp.on('end', (d) => {
            console.log('No more data in response.', d);
            console.log('Body: ', JSON.parse(data));
            res.send(JSON.parse(data));
        });

    }).on("error", (err) => {
        console.log("Error now is 1: ", err.message);
    });

    reqHttp.on('error', (err) => {
        console.error(`Problem with request now is:  ${err.message}`);
        console.log("Error now is: ", err.message);
        res.send(JSON.parse({
            message: 'Error',
            tryCatchMessage: "Service can't be reached at this time. You should try again.",
            isActive: false,
            data: null,
            dataLoad: null,
            status: 404,
            statusMgs: 'Error',
            isTwoFactorAuth: false
        }));
    });

    reqHttp.on('socket', (err) => {

    });

    reqHttp.on('timeout', (err) => {
        res.send(JSON.parse({
            message: 'Error',
            tryCatchMessage: "Timeout: Service can't be reached at this time. You should try again.",
            isActive: false,
            data: null,
            dataLoad: null,
            status: 404,
            statusMgs: 'Error',
            isTwoFactorAuth: false
        }));
    });

    reqHttp.write("");
    reqHttp.end();

});

// Get
app.get(controllerName + '/GetBusinessTypes', (req, res) => {

    // req.body.params
    // querystring.stringify(req.body);
    // console.log(JSON.stringify(req.body));

    // const auth = `Basic: ${Buffer.from('foo:myPass1234', 'utf8').toString('base64')}`;

    var postheaders2 = {
        'Content-Type': 'application/json; charset=UTF-8',
        // Authorization: auth,
        // 'X-Api-Key': 'dajzmj6gfuzmbfnhamsbuxivc', // if authentication needed
        // 'Content-Length': Buffer.byteLength(postData, 'utf8'), // postData.length
        "Access-Control-Allow-Origin": "*"
    };

    const options = {
        hostname: BackendHost,
        port: BackendPort,
        path: '/api/AcctSecurity/GetBusinessTypes',
        method: 'GET',
        rejectUnauthorized: false,
        requestCert: true,
        agent: false,
        // key: '013a1e504621b27334a883444253a3d511270634474fef539d470c956ead6122',
        ca: 'adb73ef9ac148216277ba89cd041f4c8dd6c64f7767a652749e4358dd6f5127a',
        body: null,
        headers: postheaders2,
    };

    console.info('Get Options', options);

    const reqHttp = https.request(options, (reshttp) => {
        console.log(`STATUS: ${reshttp.statusCode}`);
        console.log(`HEADERS: ${JSON.stringify(reshttp.headers)}`);
        console.log('Status Code:', reshttp.statusCode);

        let data = '';
        reshttp.setEncoding('utf8');
        reshttp.on('data', (chunk) => {
            console.log(`BODY: ${chunk}`);
            data += chunk;
        });

        reshttp.on('end', (d) => {
            console.log('No more data in response.', d);
            console.log('Body: ', JSON.parse(data));
            res.send(JSON.parse(data));
        });

    }).on("error", (err) => {
        console.log("Error now is 1: ", err.message);
    });

    reqHttp.on('error', (err) => {
        console.error(`Problem with request now is:  ${err.message}`);
        console.log("Error now is: ", err.message);
        res.send(JSON.parse({
            message: 'Error',
            tryCatchMessage: "Service can't be reached at this time. You should try again.",
            isActive: false,
            data: null,
            dataLoad: null,
            status: 404,
            statusMgs: 'Error',
            isTwoFactorAuth: false
        }));
    });

    reqHttp.on('socket', (err) => {

    });

    reqHttp.on('timeout', (err) => {
        res.send(JSON.parse({
            message: 'Error',
            tryCatchMessage: "Timeout: Service can't be reached at this time. You should try again.",
            isActive: false,
            data: null,
            dataLoad: null,
            status: 404,
            statusMgs: 'Error',
            isTwoFactorAuth: false
        }));
    });

    reqHttp.write("");
    reqHttp.end();

});

// Get
app.get(controllerName + '/GetStates', (req, res) => {

    // req.body.params
    // querystring.stringify(req.body);
    // console.log(JSON.stringify(req.body));

    // const auth = `Basic: ${Buffer.from('foo:myPass1234', 'utf8').toString('base64')}`;

    var postheaders2 = {
        'Content-Type': 'application/json; charset=UTF-8',
        // Authorization: auth,
        // 'X-Api-Key': 'dajzmj6gfuzmbfnhamsbuxivc', // if authentication needed
        // 'Content-Length': Buffer.byteLength(postData, 'utf8'), // postData.length
        "Access-Control-Allow-Origin": "*"
    };

    const options = {
        hostname: BackendHost,
        port: BackendPort,
        path: '/api/AcctSecurity/GetStates',
        method: 'GET',
        rejectUnauthorized: false,
        requestCert: true,
        agent: false,
        // key: '013a1e504621b27334a883444253a3d511270634474fef539d470c956ead6122',
        ca: 'adb73ef9ac148216277ba89cd041f4c8dd6c64f7767a652749e4358dd6f5127a',
        body: null,
        headers: postheaders2,
    };

    console.info('Get Options', options);

    const reqHttp = https.request(options, (reshttp) => {
        console.log(`STATUS: ${reshttp.statusCode}`);
        console.log(`HEADERS: ${JSON.stringify(reshttp.headers)}`);
        console.log('Status Code:', reshttp.statusCode);

        let data = '';
        reshttp.setEncoding('utf8');
        reshttp.on('data', (chunk) => {
            console.log(`BODY: ${chunk}`);
            data += chunk;
        });

        reshttp.on('end', (d) => {
            console.log('No more data in response.', d);
            console.log('Body: ', JSON.parse(data));
            res.send(JSON.parse(data));
        });

    }).on("error", (err) => {
        console.log("Error now is 1: ", err.message);
    });

    reqHttp.on('error', (err) => {
        console.error(`Problem with request now is:  ${err.message}`);
        console.log("Error now is: ", err.message);
        res.send(JSON.parse({
            message: 'Error',
            tryCatchMessage: "Service can't be reached at this time. You should try again.",
            isActive: false,
            data: null,
            dataLoad: null,
            status: 404,
            statusMgs: 'Error',
            isTwoFactorAuth: false
        }));
    });

    reqHttp.on('socket', (err) => {

    });

    reqHttp.on('timeout', (err) => {
        res.send(JSON.parse({
            message: 'Error',
            tryCatchMessage: "Timeout: Service can't be reached at this time. You should try again.",
            isActive: false,
            data: null,
            dataLoad: null,
            status: 404,
            statusMgs: 'Error',
            isTwoFactorAuth: false
        }));
    });

    reqHttp.write("");
    reqHttp.end();

});

// Get
app.get(controllerName + '/GetCitiesByStates', (req, res) => {

    // req.body.params
    // querystring.stringify(req.body);
    // console.log(JSON.stringify(req.body));

    // const auth = `Basic: ${Buffer.from('foo:myPass1234', 'utf8').toString('base64')}`;

    var postheaders2 = {
        'Content-Type': 'application/json; charset=UTF-8',
        // Authorization: auth,
        // 'X-Api-Key': 'dajzmj6gfuzmbfnhamsbuxivc', // if authentication needed
        // 'Content-Length': Buffer.byteLength(postData, 'utf8'), // postData.length
        "Access-Control-Allow-Origin": "*"
    };

    const options = {
        hostname: BackendHost,
        port: BackendPort,
        path: '/api/AcctSecurity/GetCitiesByStates?Id=' + req.query.Id,
        method: 'GET',
        rejectUnauthorized: false,
        requestCert: true,
        agent: false,
        // key: '013a1e504621b27334a883444253a3d511270634474fef539d470c956ead6122',
        ca: 'adb73ef9ac148216277ba89cd041f4c8dd6c64f7767a652749e4358dd6f5127a',
        body: null,
        headers: postheaders2,
    };

    console.info('Get Options', options);

    const reqHttp = https.request(options, (reshttp) => {
        console.log(`STATUS: ${reshttp.statusCode}`);
        console.log(`HEADERS: ${JSON.stringify(reshttp.headers)}`);
        console.log('Status Code:', reshttp.statusCode);

        let data = '';
        reshttp.setEncoding('utf8');
        reshttp.on('data', (chunk) => {
            console.log(`BODY: ${chunk}`);
            data += chunk;
        });

        reshttp.on('end', (d) => {
            console.log('No more data in response.', d);
            console.log('Body: ', JSON.parse(data));
            res.send(JSON.parse(data));
        });

    }).on("error", (err) => {
        console.log("Error now is 1: ", err.message);
    });

    reqHttp.on('error', (err) => {
        console.error(`Problem with request now is:  ${err.message}`);
        console.log("Error now is: ", err.message);
        res.send(JSON.parse({
            message: 'Error',
            tryCatchMessage: "Service can't be reached at this time. You should try again.",
            isActive: false,
            data: null,
            dataLoad: null,
            status: 404,
            statusMgs: 'Error',
            isTwoFactorAuth: false
        }));
    });

    reqHttp.on('socket', (err) => {

    });

    reqHttp.on('timeout', (err) => {
        res.send(JSON.parse({
            message: 'Error',
            tryCatchMessage: "Timeout: Service can't be reached at this time. You should try again.",
            isActive: false,
            data: null,
            dataLoad: null,
            status: 404,
            statusMgs: 'Error',
            isTwoFactorAuth: false
        }));
    });

    reqHttp.write("");
    reqHttp.end();

});

// Post
app.post(controllerName + '/SignInAuth', multer().none(), (req, res) => {

    const postData = JSON.stringify(req.body);

    //querystring.stringify(req.body);
    // console.log(JSON.stringify(req.body));

    // const auth = `Basic: ${Buffer.from('foo:myPass1234', 'utf8').toString('base64')}`;
    var postheaders2 = {
        'Content-Type': 'application/json; charset=UTF-8',
        //Authorization: auth,
        //'X-Api-Key': 'dajzmj6gfuzmbfnhamsbuxivc', // if authentication needed
        'Content-Length': Buffer.byteLength(postData, 'utf8'), //postData.length
        "Access-Control-Allow-Origin": "*"
    };

    const options = {
        hostname: BackendHost,
        port: BackendPort,
        path: '/api/AcctSecurity/SignInAuth',
        method: 'POST',
        rejectUnauthorized: false,
        requestCert: true,
        agent: false,
        // key: '013a1e504621b27334a883444253a3d511270634474fef539d470c956ead6122',
        ca: 'adb73ef9ac148216277ba89cd041f4c8dd6c64f7767a652749e4358dd6f5127a',
        body: postData,
        headers: postheaders2,
    };

    console.info('Post Options', options);

    const reqHttp = https.request(options, (reshttp) => {
        console.log(`STATUS: ${reshttp.statusCode}`);
        console.log(`HEADERS: ${JSON.stringify(reshttp.headers)}`);
        console.log('Status Code:', reshttp.statusCode);

        let data = '';
        reshttp.setEncoding('utf8');
        reshttp.on('data', (chunk) => {
            console.log(`BODY: ${chunk}`);
            data += chunk;
        });
        reshttp.on('end', (d) => {
            console.log('No more data in response.', d);
            console.log('Body: ', JSON.parse(data));
            res.send(JSON.parse(data));
        });

    }).on("error", (err) => {
        console.log("Error now is 1: ", err.message);
    });

    reqHttp.on('error', (err) => {
        console.error(`Problem with request now is:  ${err.message}`);
        console.log("Error now is: ", err.message);
        res.send(JSON.parse({
            message: 'Error',
            tryCatchMessage: "Service can't be reached at this time. You should try again.",
            isActive: false,
            data: null,
            dataLoad: null,
            status: 404,
            statusMgs: 'Error',
            isTwoFactorAuth: false
        }));
    });

    reqHttp.on('socket', (err) => {

    });

    reqHttp.on('timeout', (err) => {
        res.send(JSON.parse({
            message: 'Error',
            tryCatchMessage: "Timeout: Service can't be reached at this time. You should try again.",
            isActive: false,
            data: null,
            dataLoad: null,
            status: 404,
            statusMgs: 'Error',
            isTwoFactorAuth: false
        }));
    });

    reqHttp.write(postData);
    reqHttp.end();

});

// Post
app.post(controllerName + '/Register', multer().none(), (req, res) => {

    const postData = JSON.stringify(req.body);

    //querystring.stringify(req.body);
    // console.log(JSON.stringify(req.body));

    // const auth = `Basic: ${Buffer.from('foo:myPass1234', 'utf8').toString('base64')}`;
    var postheaders2 = {
        'Content-Type': 'application/json; charset=UTF-8',
        //Authorization: auth,
        //'X-Api-Key': 'dajzmj6gfuzmbfnhamsbuxivc', // if authentication needed
        'Content-Length': Buffer.byteLength(postData, 'utf8'), //postData.length
        "Access-Control-Allow-Origin": "*"
    };

    const options = {
        hostname: BackendHost,
        port: BackendPort,
        path: '/api/AcctSecurity/Register',
        method: 'POST',
        rejectUnauthorized: false,
        requestCert: true,
        agent: false,
        // key: '013a1e504621b27334a883444253a3d511270634474fef539d470c956ead6122',
        ca: 'adb73ef9ac148216277ba89cd041f4c8dd6c64f7767a652749e4358dd6f5127a',
        body: postData,
        headers: postheaders2,
    };

    console.info('Post Options', options);

    const reqHttp = https.request(options, (reshttp) => {
        console.log(`STATUS: ${reshttp.statusCode}`);
        console.log(`HEADERS: ${JSON.stringify(reshttp.headers)}`);
        console.log('Status Code:', reshttp.statusCode);

        let data = '';
        reshttp.setEncoding('utf8');
        reshttp.on('data', (chunk) => {
            console.log(`BODY: ${chunk}`);
            data += chunk;
        });
        reshttp.on('end', (d) => {
            console.log('No more data in response.', d);
            console.log('Body: ', JSON.parse(data));
            res.send(JSON.parse(data));
        });

    }).on("error", (err) => {
        console.log("Error now is 1: ", err.message);
    });

    reqHttp.on('error', (err) => {
        console.error(`Problem with request now is:  ${err.message}`);
        console.log("Error now is: ", err.message);
        res.send(JSON.parse({
            message: 'Error',
            tryCatchMessage: "Service can't be reached at this time. You should try again.",
            isActive: false,
            data: null,
            dataLoad: null,
            status: 404,
            statusMgs: 'Error',
            isTwoFactorAuth: false
        }));
    });

    reqHttp.on('socket', (err) => {

    });

    reqHttp.on('timeout', (err) => {
        res.send(JSON.parse({
            message: 'Error',
            tryCatchMessage: "Timeout: Service can't be reached at this time. You should try again.",
            isActive: false,
            data: null,
            dataLoad: null,
            status: 404,
            statusMgs: 'Error',
            isTwoFactorAuth: false
        }));
    });

    reqHttp.write(postData);
    reqHttp.end();

});

// Post
app.post(controllerName + '/ConfirmTwoFactorAuth', multer().none(), (req, res) => {

    const postData = JSON.stringify(req.body);

    //querystring.stringify(req.body);
    // console.log(JSON.stringify(req.body));

    // const auth = `Basic: ${Buffer.from('foo:myPass1234', 'utf8').toString('base64')}`;
    var postheaders2 = {
        'Content-Type': 'application/json; charset=UTF-8',
        //Authorization: auth,
        //'X-Api-Key': 'dajzmj6gfuzmbfnhamsbuxivc', // if authentication needed
        'Content-Length': Buffer.byteLength(postData, 'utf8'), //postData.length
        "Access-Control-Allow-Origin": "*"
    };

    const options = {
        hostname: BackendHost,
        port: BackendPort,
        path: '/api/AcctSecurity/ConfirmTwoFactorAuth',
        method: 'POST',
        rejectUnauthorized: false,
        requestCert: true,
        agent: false,
        // key: '013a1e504621b27334a883444253a3d511270634474fef539d470c956ead6122',
        ca: 'adb73ef9ac148216277ba89cd041f4c8dd6c64f7767a652749e4358dd6f5127a',
        body: postData,
        headers: postheaders2,
    };

    console.info('Post Options', options);

    const reqHttp = https.request(options, (reshttp) => {
        console.log(`STATUS: ${reshttp.statusCode}`);
        console.log(`HEADERS: ${JSON.stringify(reshttp.headers)}`);
        console.log('Status Code:', reshttp.statusCode);

        let data = '';
        reshttp.setEncoding('utf8');
        reshttp.on('data', (chunk) => {
            console.log(`BODY: ${chunk}`);
            data += chunk;
        });
        reshttp.on('end', (d) => {
            console.log('No more data in response.', d);
            console.log('Body: ', JSON.parse(data));
            res.send(JSON.parse(data));
        });

    }).on("error", (err) => {
        console.log("Error now is 1: ", err.message);
    });

    reqHttp.on('error', (err) => {
        console.error(`Problem with request now is:  ${err.message}`);
        console.log("Error now is: ", err.message);
        res.send(JSON.parse({
            message: 'Error',
            tryCatchMessage: "Service can't be reached at this time. You should try again.",
            isActive: false,
            data: null,
            dataLoad: null,
            status: 404,
            statusMgs: 'Error',
            isTwoFactorAuth: false
        }));
    });

    reqHttp.on('socket', (err) => {

    });

    reqHttp.on('timeout', (err) => {
        res.send(JSON.parse({
            message: 'Error',
            tryCatchMessage: "Timeout: Service can't be reached at this time. You should try again.",
            isActive: false,
            data: null,
            dataLoad: null,
            status: 404,
            statusMgs: 'Error',
            isTwoFactorAuth: false
        }));
    });

    reqHttp.write(postData);
    reqHttp.end();

});

// Post
app.post(controllerName + '/RebroundBankList', multer().none(), (req, res) => {

    const postData = JSON.stringify(req.body);

    //querystring.stringify(req.body);
    // console.log(JSON.stringify(req.body));

    // const auth = `Basic: ${Buffer.from('foo:myPass1234', 'utf8').toString('base64')}`;
    var postheaders2 = {
        'Content-Type': 'application/json; charset=UTF-8',
        //Authorization: auth,
        //'X-Api-Key': 'dajzmj6gfuzmbfnhamsbuxivc', // if authentication needed
        'Content-Length': Buffer.byteLength(postData, 'utf8'), //postData.length
        "Access-Control-Allow-Origin": "*"
    };

    const options = {
        hostname: BackendHost,
        port: BackendPort,
        path: '/api/AcctSecurity/RebroundBankList',
        method: 'POST',
        rejectUnauthorized: false,
        requestCert: true,
        agent: false,
        // key: '013a1e504621b27334a883444253a3d511270634474fef539d470c956ead6122',
        ca: 'adb73ef9ac148216277ba89cd041f4c8dd6c64f7767a652749e4358dd6f5127a',
        body: postData,
        headers: postheaders2,
    };

    console.info('Post Options', options);

    const reqHttp = https.request(options, (reshttp) => {
        console.log(`STATUS: ${reshttp.statusCode}`);
        console.log(`HEADERS: ${JSON.stringify(reshttp.headers)}`);
        console.log('Status Code:', reshttp.statusCode);

        let data = '';
        reshttp.setEncoding('utf8');
        reshttp.on('data', (chunk) => {
            console.log(`BODY: ${chunk}`);
            data += chunk;
        });
        reshttp.on('end', (d) => {
            console.log('No more data in response.', d);
            console.log('Body: ', JSON.parse(data));
            res.send(JSON.parse(data));
        });

    }).on("error", (err) => {
        console.log("Error now is 1: ", err.message);
    });

    reqHttp.on('error', (err) => {
        console.error(`Problem with request now is:  ${err.message}`);
        console.log("Error now is: ", err.message);
        res.send(JSON.parse({
            message: 'Error',
            tryCatchMessage: "Service can't be reached at this time. You should try again.",
            isActive: false,
            data: null,
            dataLoad: null,
            status: 404,
            statusMgs: 'Error',
            isTwoFactorAuth: false
        }));
    });

    reqHttp.on('socket', (err) => {

    });

    reqHttp.on('timeout', (err) => {
        res.send(JSON.parse({
            message: 'Error',
            tryCatchMessage: "Timeout: Service can't be reached at this time. You should try again.",
            isActive: false,
            data: null,
            dataLoad: null,
            status: 404,
            statusMgs: 'Error',
            isTwoFactorAuth: false
        }));
    });

    reqHttp.write(postData);
    reqHttp.end();

});

// Post
app.post(controllerName + '/BankAcctDetailsByAccountNo', multer().none(), (req, res) => {

    const postData = JSON.stringify(req.body);

    //querystring.stringify(req.body);
    // console.log(JSON.stringify(req.body));

    // const auth = `Basic: ${Buffer.from('foo:myPass1234', 'utf8').toString('base64')}`;
    var postheaders2 = {
        'Content-Type': 'application/json; charset=UTF-8',
        //Authorization: auth,
        //'X-Api-Key': 'dajzmj6gfuzmbfnhamsbuxivc', // if authentication needed
        'Content-Length': Buffer.byteLength(postData, 'utf8'), //postData.length
        "Access-Control-Allow-Origin": "*"
    };

    const options = {
        hostname: BackendHost,
        port: BackendPort,
        path: '/api/AcctSecurity/BankAcctDetailsByAccountNo',
        method: 'POST',
        rejectUnauthorized: false,
        requestCert: true,
        agent: false,
        // key: '013a1e504621b27334a883444253a3d511270634474fef539d470c956ead6122',
        ca: 'adb73ef9ac148216277ba89cd041f4c8dd6c64f7767a652749e4358dd6f5127a',
        body: postData,
        headers: postheaders2,
    };

    console.info('Post Options', options);

    const reqHttp = https.request(options, (reshttp) => {
        console.log(`STATUS: ${reshttp.statusCode}`);
        console.log(`HEADERS: ${JSON.stringify(reshttp.headers)}`);
        console.log('Status Code:', reshttp.statusCode);

        let data = '';
        reshttp.setEncoding('utf8');
        reshttp.on('data', (chunk) => {
            console.log(`BODY: ${chunk}`);
            data += chunk;
        });
        reshttp.on('end', (d) => {
            console.log('No more data in response.', d);
            console.log('Body: ', JSON.parse(data));
            res.send(JSON.parse(data));
        });

    }).on("error", (err) => {
        console.log("Error now is 1: ", err.message);
    });

    reqHttp.on('error', (err) => {
        console.error(`Problem with request now is:  ${err.message}`);
        console.log("Error now is: ", err.message);
        res.send(JSON.parse({
            message: 'Error',
            tryCatchMessage: "Service can't be reached at this time. You should try again.",
            isActive: false,
            data: null,
            dataLoad: null,
            status: 404,
            statusMgs: 'Error',
            isTwoFactorAuth: false
        }));
    });

    reqHttp.on('socket', (err) => {

    });

    reqHttp.on('timeout', (err) => {
        res.send(JSON.parse({
            message: 'Error',
            tryCatchMessage: "Timeout: Service can't be reached at this time. You should try again.",
            isActive: false,
            data: null,
            dataLoad: null,
            status: 404,
            statusMgs: 'Error',
            isTwoFactorAuth: false
        }));
    });

    reqHttp.write(postData);
    reqHttp.end();

});

// Post
app.post(controllerName + '/newLoanApplication', multer().none(), (req, res) => {

    const postData = JSON.stringify(req.body);

    //querystring.stringify(req.body);
    // console.log(JSON.stringify(req.body));

    // const auth = `Basic: ${Buffer.from('foo:myPass1234', 'utf8').toString('base64')}`;
    var postheaders2 = {
        'Content-Type': 'application/json; charset=UTF-8',
        //Authorization: auth,
        //'X-Api-Key': 'dajzmj6gfuzmbfnhamsbuxivc', // if authentication needed
        'Content-Length': Buffer.byteLength(postData, 'utf8'), //postData.length
        "Access-Control-Allow-Origin": "*"
    };

    const options = {
        hostname: BackendHost,
        port: BackendPort,
        path: '/api/AcctSecurity/newLoanApplication',
        method: 'POST',
        rejectUnauthorized: false,
        requestCert: true,
        agent: false,
        // key: '013a1e504621b27334a883444253a3d511270634474fef539d470c956ead6122',
        ca: 'adb73ef9ac148216277ba89cd041f4c8dd6c64f7767a652749e4358dd6f5127a',
        body: postData,
        headers: postheaders2,
    };

    console.info('Post Options', options);

    const reqHttp = https.request(options, (reshttp) => {
        console.log(`STATUS: ${reshttp.statusCode}`);
        console.log(`HEADERS: ${JSON.stringify(reshttp.headers)}`);
        console.log('Status Code:', reshttp.statusCode);

        let data = '';
        reshttp.setEncoding('utf8');
        reshttp.on('data', (chunk) => {
            console.log(`BODY: ${chunk}`);
            data += chunk;
        });
        reshttp.on('end', (d) => {
            console.log('No more data in response.', d);
            console.log('Body: ', JSON.parse(data));
            res.send(JSON.parse(data));
        });

    }).on("error", (err) => {
        console.log("Error now is 1: ", err.message);
    });

    reqHttp.on('error', (err) => {
        console.error(`Problem with request now is:  ${err.message}`);
        console.log("Error now is: ", err.message);
        res.send(JSON.parse({
            message: 'Error',
            tryCatchMessage: "Service can't be reached at this time. You should try again.",
            isActive: false,
            data: null,
            dataLoad: null,
            status: 404,
            statusMgs: 'Error',
            isTwoFactorAuth: false
        }));
    });

    reqHttp.on('socket', (err) => {

    });

    reqHttp.on('timeout', (err) => {
        res.send(JSON.parse({
            message: 'Error',
            tryCatchMessage: "Timeout: Service can't be reached at this time. You should try again.",
            isActive: false,
            data: null,
            dataLoad: null,
            status: 404,
            statusMgs: 'Error',
            isTwoFactorAuth: false
        }));
    });

    reqHttp.write(postData);
    reqHttp.end();

});

// Get
app.get(controllerName + '/AutoAdminCreateAcct', (req, res) => {

    // req.body.params
    // querystring.stringify(req.body);
    // console.log(JSON.stringify(req.body));

    // const auth = `Basic: ${Buffer.from('foo:myPass1234', 'utf8').toString('base64')}`;

    var postheaders2 = {
        'Content-Type': 'application/json; charset=UTF-8',
        // Authorization: auth,
        // 'X-Api-Key': 'dajzmj6gfuzmbfnhamsbuxivc', // if authentication needed
        // 'Content-Length': Buffer.byteLength(postData, 'utf8'), // postData.length
        "Access-Control-Allow-Origin": "*"
    };

    const options = {
        hostname: BackendHost,
        port: BackendPort,
        path: '/api/AcctSecurity/AutoAdminCreateAcct?data=' + req.query.data,
        method: 'GET',
        rejectUnauthorized: false,
        requestCert: true,
        agent: false,
        // key: '013a1e504621b27334a883444253a3d511270634474fef539d470c956ead6122',
        ca: 'adb73ef9ac148216277ba89cd041f4c8dd6c64f7767a652749e4358dd6f5127a',
        body: null,
        headers: postheaders2,
    };

    console.info('Get Options', options);

    const reqHttp = https.request(options, (reshttp) => {
        console.log(`STATUS: ${reshttp.statusCode}`);
        console.log(`HEADERS: ${JSON.stringify(reshttp.headers)}`);
        console.log('Status Code:', reshttp.statusCode);

        let data = '';
        reshttp.setEncoding('utf8');
        reshttp.on('data', (chunk) => {
            console.log(`BODY: ${chunk}`);
            data += chunk;
        });

        reshttp.on('end', (d) => {
            console.log('No more data in response.', d);
            console.log('Body: ', JSON.parse(data));
            res.send(JSON.parse(data));
        });

    }).on("error", (err) => {
        console.log("Error now is 1: ", err.message);
    });

    reqHttp.on('error', (err) => {
        console.error(`Problem with request now is:  ${err.message}`);
        console.log("Error now is: ", err.message);
        res.send(JSON.parse({
            message: 'Error',
            tryCatchMessage: "Service can't be reached at this time. You should try again.",
            isActive: false,
            data: null,
            dataLoad: null,
            status: 404,
            statusMgs: 'Error',
            isTwoFactorAuth: false
        }));
    });

    reqHttp.on('socket', (err) => {

    });

    reqHttp.on('timeout', (err) => {
        res.send(JSON.parse({
            message: 'Error',
            tryCatchMessage: "Timeout: Service can't be reached at this time. You should try again.",
            isActive: false,
            data: null,
            dataLoad: null,
            status: 404,
            statusMgs: 'Error',
            isTwoFactorAuth: false
        }));
    });

    reqHttp.write("");
    reqHttp.end();

});

// Get
app.get(controllerName + '/ConvertedLoanAmount', (req, res) => {

    // req.body.params
    // querystring.stringify(req.body);
    // console.log(JSON.stringify(req.body));

    // const auth = `Basic: ${Buffer.from('foo:myPass1234', 'utf8').toString('base64')}`;

    var postheaders2 = {
        'Content-Type': 'application/json; charset=UTF-8',
        // Authorization: auth,
        // 'X-Api-Key': 'dajzmj6gfuzmbfnhamsbuxivc', // if authentication needed
        // 'Content-Length': Buffer.byteLength(postData, 'utf8'), // postData.length
        "Access-Control-Allow-Origin": "*"
    };

    const options = {
        hostname: BackendHost,
        port: BackendPort,
        path: '/api/AcctSecurity/ConvertedLoanAmount?Amount=' + req.query.Amount,
        method: 'GET',
        rejectUnauthorized: false,
        requestCert: true,
        agent: false,
        // key: '013a1e504621b27334a883444253a3d511270634474fef539d470c956ead6122',
        ca: 'adb73ef9ac148216277ba89cd041f4c8dd6c64f7767a652749e4358dd6f5127a',
        body: null,
        headers: postheaders2,
    };

    console.info('Get Options', options);

    const reqHttp = https.request(options, (reshttp) => {
        console.log(`STATUS: ${reshttp.statusCode}`);
        console.log(`HEADERS: ${JSON.stringify(reshttp.headers)}`);
        console.log('Status Code:', reshttp.statusCode);

        let data = '';
        reshttp.setEncoding('utf8');
        reshttp.on('data', (chunk) => {
            console.log(`BODY: ${chunk}`);
            data += chunk;
        });

        reshttp.on('end', (d) => {
            console.log('No more data in response.', d);
            console.log('Body: ', JSON.parse(data));
            res.send(JSON.parse(data));
        });

    }).on("error", (err) => {
        console.log("Error now is 1: ", err.message);
    });

    reqHttp.on('error', (err) => {
        console.error(`Problem with request now is:  ${err.message}`);
        console.log("Error now is: ", err.message);
        res.send(JSON.parse({
            message: 'Error',
            tryCatchMessage: "Service can't be reached at this time. You should try again.",
            isActive: false,
            data: null,
            dataLoad: null,
            status: 404,
            statusMgs: 'Error',
            isTwoFactorAuth: false
        }));
    });

    reqHttp.on('socket', (err) => {

    });

    reqHttp.on('timeout', (err) => {
        res.send(JSON.parse({
            message: 'Error',
            tryCatchMessage: "Timeout: Service can't be reached at this time. You should try again.",
            isActive: false,
            data: null,
            dataLoad: null,
            status: 404,
            statusMgs: 'Error',
            isTwoFactorAuth: false
        }));
    });

    reqHttp.write("");
    reqHttp.end();

});

// Get
app.get(controllerName + '/LoadSpinnerRound', (req, res) => {

    // req.body.params
    // querystring.stringify(req.body);
    // console.log(JSON.stringify(req.body));

    // const auth = `Basic: ${Buffer.from('foo:myPass1234', 'utf8').toString('base64')}`;

    var postheaders2 = {
        'Content-Type': 'application/json; charset=UTF-8',
        // Authorization: auth,
        // 'X-Api-Key': 'dajzmj6gfuzmbfnhamsbuxivc', // if authentication needed
        // 'Content-Length': Buffer.byteLength(postData, 'utf8'), // postData.length
        "Access-Control-Allow-Origin": "*"
    };

    const options = {
        hostname: BackendHost,
        port: BackendPort,
        path: '/api/AcctSecurity/LoadSpinnerRound?Lenght=' + req.query.Lenght,
        method: 'GET',
        rejectUnauthorized: false,
        requestCert: true,
        agent: false,
        // key: '013a1e504621b27334a883444253a3d511270634474fef539d470c956ead6122',
        ca: 'adb73ef9ac148216277ba89cd041f4c8dd6c64f7767a652749e4358dd6f5127a',
        body: null,
        headers: postheaders2,
    };

    console.info('Get Options', options);

    const reqHttp = https.request(options, (reshttp) => {
        console.log(`STATUS: ${reshttp.statusCode}`);
        console.log(`HEADERS: ${JSON.stringify(reshttp.headers)}`);
        console.log('Status Code:', reshttp.statusCode);

        let data = '';
        reshttp.setEncoding('utf8');
        reshttp.on('data', (chunk) => {
            console.log(`BODY: ${chunk}`);
            data += chunk;
        });

        reshttp.on('end', (d) => {
            console.log('No more data in response.', d);
            console.log('Body: ', JSON.parse(data));
            res.send(JSON.parse(data));
        });

    }).on("error", (err) => {
        console.log("Error now is 1: ", err.message);
    });

    reqHttp.on('error', (err) => {
        console.error(`Problem with request now is:  ${err.message}`);
        console.log("Error now is: ", err.message);
        res.send(JSON.parse({
            message: 'Error',
            tryCatchMessage: "Service can't be reached at this time. You should try again.",
            isActive: false,
            data: null,
            dataLoad: null,
            status: 404,
            statusMgs: 'Error',
            isTwoFactorAuth: false
        }));
    });

    reqHttp.on('socket', (err) => {

    });

    reqHttp.on('timeout', (err) => {
        res.send(JSON.parse({
            message: 'Error',
            tryCatchMessage: "Timeout: Service can't be reached at this time. You should try again.",
            isActive: false,
            data: null,
            dataLoad: null,
            status: 404,
            statusMgs: 'Error',
            isTwoFactorAuth: false
        }));
    });

    reqHttp.write("");
    reqHttp.end();

});

// Get
app.get(controllerName + '/GetAllBanksNameLists', (req, res) => {

    // req.body.params
    // querystring.stringify(req.body);
    // console.log(JSON.stringify(req.body));

    // const auth = `Basic: ${Buffer.from('foo:myPass1234', 'utf8').toString('base64')}`;

    var postheaders2 = {
        'Content-Type': 'application/json; charset=UTF-8',
        // Authorization: auth,
        // 'X-Api-Key': 'dajzmj6gfuzmbfnhamsbuxivc', // if authentication needed
        // 'Content-Length': Buffer.byteLength(postData, 'utf8'), // postData.length
        "Access-Control-Allow-Origin": "*"
    };

    const options = {
        hostname: BackendHost,
        port: BackendPort,
        path: '/api/HubTeam/GetAllBanksNameLists?Number=' + req.query.Number,
        method: 'GET',
        rejectUnauthorized: false,
        requestCert: true,
        agent: false,
        // key: '013a1e504621b27334a883444253a3d511270634474fef539d470c956ead6122',
        ca: 'adb73ef9ac148216277ba89cd041f4c8dd6c64f7767a652749e4358dd6f5127a',
        body: null,
        headers: postheaders2,
    };

    console.info('Get Options', options);

    const reqHttp = https.request(options, (reshttp) => {
        console.log(`STATUS: ${reshttp.statusCode}`);
        console.log(`HEADERS: ${JSON.stringify(reshttp.headers)}`);
        console.log('Status Code:', reshttp.statusCode);

        let data = '';
        reshttp.setEncoding('utf8');
        reshttp.on('data', (chunk) => {
            console.log(`BODY: ${chunk}`);
            data += chunk;
        });

        reshttp.on('end', (d) => {
            console.log('No more data in response.', d);
            console.log('Body: ', JSON.parse(data));
            res.send(JSON.parse(data));
        });

    }).on("error", (err) => {
        console.log("Error now is 1: ", err.message);
    });

    reqHttp.on('error', (err) => {
        console.error(`Problem with request now is:  ${err.message}`);
        console.log("Error now is: ", err.message);
        res.send(JSON.parse({
            message: 'Error',
            tryCatchMessage: "Service can't be reached at this time. You should try again.",
            isActive: false,
            data: null,
            dataLoad: null,
            status: 404,
            statusMgs: 'Error',
            isTwoFactorAuth: false
        }));
    });

    reqHttp.on('socket', (err) => {

    });

    reqHttp.on('timeout', (err) => {
        res.send(JSON.parse({
            message: 'Error',
            tryCatchMessage: "Timeout: Service can't be reached at this time. You should try again.",
            isActive: false,
            data: null,
            dataLoad: null,
            status: 404,
            statusMgs: 'Error',
            isTwoFactorAuth: false
        }));
    });

    reqHttp.write("");
    reqHttp.end();

});

// Get
app.get(controllerName + '/GetAllBanks', (req, res) => {

    // req.body.params
    // querystring.stringify(req.body);
    // console.log(JSON.stringify(req.body));

    // const auth = `Basic: ${Buffer.from('foo:myPass1234', 'utf8').toString('base64')}`;

    var postheaders2 = {
        'Content-Type': 'application/json; charset=UTF-8',
        // Authorization: auth,
        // 'X-Api-Key': 'dajzmj6gfuzmbfnhamsbuxivc', // if authentication needed
        // 'Content-Length': Buffer.byteLength(postData, 'utf8'), // postData.length
        "Access-Control-Allow-Origin": "*"
    };

    const options = {
        hostname: BackendHost,
        port: BackendPort,
        path: '/api/AcctSecurity/GetAllBanks',
        method: 'GET',
        rejectUnauthorized: false,
        requestCert: true,
        agent: false,
        // key: '013a1e504621b27334a883444253a3d511270634474fef539d470c956ead6122',
        ca: 'adb73ef9ac148216277ba89cd041f4c8dd6c64f7767a652749e4358dd6f5127a',
        body: null,
        headers: postheaders2,
    };

    console.info('Get Options', options);

    const reqHttp = https.request(options, (reshttp) => {
        console.log(`STATUS: ${reshttp.statusCode}`);
        console.log(`HEADERS: ${JSON.stringify(reshttp.headers)}`);
        console.log('Status Code:', reshttp.statusCode);

        let data = '';
        reshttp.setEncoding('utf8');
        reshttp.on('data', (chunk) => {
            console.log(`BODY: ${chunk}`);
            data += chunk;
        });

        reshttp.on('end', (d) => {
            console.log('No more data in response.', d);
            console.log('Body: ', JSON.parse(data));
            res.send(JSON.parse(data));
        });

    }).on("error", (err) => {
        console.log("Error now is 1: ", err.message);
    });

    reqHttp.on('error', (err) => {
        console.error(`Problem with request now is:  ${err.message}`);
        console.log("Error now is: ", err.message);
        res.send(JSON.parse({
            message: 'Error',
            tryCatchMessage: "Service can't be reached at this time. You should try again.",
            isActive: false,
            data: null,
            dataLoad: null,
            status: 404,
            statusMgs: 'Error',
            isTwoFactorAuth: false
        }));
    });

    reqHttp.on('socket', (err) => {

    });

    reqHttp.on('timeout', (err) => {
        res.send(JSON.parse({
            message: 'Error',
            tryCatchMessage: "Timeout: Service can't be reached at this time. You should try again.",
            isActive: false,
            data: null,
            dataLoad: null,
            status: 404,
            statusMgs: 'Error',
            isTwoFactorAuth: false
        }));
    });

    reqHttp.write("");
    reqHttp.end();

});

// Get
app.get(controllerName + '/ValidatePFNumberByProvider', (req, res) => {

    // req.body.params
    // querystring.stringify(req.body);
    // console.log(JSON.stringify(req.body));

    // const auth = `Basic: ${Buffer.from('foo:myPass1234', 'utf8').toString('base64')}`;

    var postheaders2 = {
        'Content-Type': 'application/json; charset=UTF-8',
        // Authorization: auth,
        // 'X-Api-Key': 'dajzmj6gfuzmbfnhamsbuxivc', // if authentication needed
        // 'Content-Length': Buffer.byteLength(postData, 'utf8'), // postData.length
        "Access-Control-Allow-Origin": "*"
    };

    const options = {
        hostname: BackendHost,
        port: BackendPort,
        path: '/api/AcctSecurity/ValidatePFNumberByProvider?Number=' + req.query.Number,
        method: 'GET',
        rejectUnauthorized: false,
        requestCert: true,
        agent: false,
        // key: '013a1e504621b27334a883444253a3d511270634474fef539d470c956ead6122',
        ca: 'adb73ef9ac148216277ba89cd041f4c8dd6c64f7767a652749e4358dd6f5127a',
        body: null,
        headers: postheaders2,
    };

    console.info('Get Options', options);

    const reqHttp = https.request(options, (reshttp) => {
        console.log(`STATUS: ${reshttp.statusCode}`);
        console.log(`HEADERS: ${JSON.stringify(reshttp.headers)}`);
        console.log('Status Code:', reshttp.statusCode);

        let data = '';
        reshttp.setEncoding('utf8');
        reshttp.on('data', (chunk) => {
            console.log(`BODY: ${chunk}`);
            data += chunk;
        });

        reshttp.on('end', (d) => {
            console.log('No more data in response.', d);
            console.log('Body: ', JSON.parse(data));
            res.send(JSON.parse(data));
        });

    }).on("error", (err) => {
        console.log("Error now is 1: ", err.message);
    });

    reqHttp.on('error', (err) => {
        console.error(`Problem with request now is:  ${err.message}`);
        console.log("Error now is: ", err.message);
        res.send(JSON.parse({
            message: 'Error',
            tryCatchMessage: "Service can't be reached at this time. You should try again.",
            isActive: false,
            data: null,
            dataLoad: null,
            status: 404,
            statusMgs: 'Error',
            isTwoFactorAuth: false
        }));
    });

    reqHttp.on('socket', (err) => {

    });

    reqHttp.on('timeout', (err) => {
        res.send(JSON.parse({
            message: 'Error',
            tryCatchMessage: "Timeout: Service can't be reached at this time. You should try again.",
            isActive: false,
            data: null,
            dataLoad: null,
            status: 404,
            statusMgs: 'Error',
            isTwoFactorAuth: false
        }));
    });

    reqHttp.write("");
    reqHttp.end();

});

// Get
app.get(controllerName + '/FetchAccountDetails', (req, res) => {

    // req.body.params
    // querystring.stringify(req.body);
    // console.log(JSON.stringify(req.body));

    // const auth = `Basic: ${Buffer.from('foo:myPass1234', 'utf8').toString('base64')}`;

    var postheaders2 = {
        'Content-Type': 'application/json; charset=UTF-8',
        // Authorization: auth,
        // 'X-Api-Key': 'dajzmj6gfuzmbfnhamsbuxivc', // if authentication needed
        // 'Content-Length': Buffer.byteLength(postData, 'utf8'), // postData.length
        "Access-Control-Allow-Origin": "*"
    };

    const options = {
        hostname: BackendHost,
        port: BackendPort,
        path: '/api/AcctSecurity/FetchAccountDetails?AcctId=' + req.query.AcctId,
        method: 'GET',
        rejectUnauthorized: false,
        requestCert: true,
        agent: false,
        // key: '013a1e504621b27334a883444253a3d511270634474fef539d470c956ead6122',
        ca: 'adb73ef9ac148216277ba89cd041f4c8dd6c64f7767a652749e4358dd6f5127a',
        body: null,
        headers: postheaders2,
    };

    console.info('Get Options', options);

    const reqHttp = https.request(options, (reshttp) => {
        console.log(`STATUS: ${reshttp.statusCode}`);
        console.log(`HEADERS: ${JSON.stringify(reshttp.headers)}`);
        console.log('Status Code:', reshttp.statusCode);

        let data = '';
        reshttp.setEncoding('utf8');
        reshttp.on('data', (chunk) => {
            console.log(`BODY: ${chunk}`);
            data += chunk;
        });

        reshttp.on('end', (d) => {
            console.log('No more data in response.', d);
            console.log('Body: ', JSON.parse(data));
            res.send(JSON.parse(data));
        });

    }).on("error", (err) => {
        console.log("Error now is 1: ", err.message);
    });

    reqHttp.on('error', (err) => {
        console.error(`Problem with request now is:  ${err.message}`);
        console.log("Error now is: ", err.message);
        res.send(JSON.parse({
            message: 'Error',
            tryCatchMessage: "Service can't be reached at this time. You should try again.",
            isActive: false,
            data: null,
            dataLoad: null,
            status: 404,
            statusMgs: 'Error',
            isTwoFactorAuth: false
        }));
    });

    reqHttp.on('socket', (err) => {

    });

    reqHttp.on('timeout', (err) => {
        res.send(JSON.parse({
            message: 'Error',
            tryCatchMessage: "Timeout: Service can't be reached at this time. You should try again.",
            isActive: false,
            data: null,
            dataLoad: null,
            status: 404,
            statusMgs: 'Error',
            isTwoFactorAuth: false
        }));
    });

    reqHttp.write("");
    reqHttp.end();

});

// Get
app.get(controllerName + '/emailacctverify', (req, res) => {

    // req.body.params
    // querystring.stringify(req.body);
    // console.log(JSON.stringify(req.body));

    // const auth = `Basic: ${Buffer.from('foo:myPass1234', 'utf8').toString('base64')}`;

    var postheaders2 = {
        'Content-Type': 'application/json; charset=UTF-8',
        // Authorization: auth,
        // 'X-Api-Key': 'dajzmj6gfuzmbfnhamsbuxivc', // if authentication needed
        // 'Content-Length': Buffer.byteLength(postData, 'utf8'), // postData.length
        "Access-Control-Allow-Origin": "*"
    };

    const options = {
        hostname: BackendHost,
        port: BackendPort,
        path: '/api/AcctSecurity/emailacctverify?AcctId=' + req.query.AcctId,
        method: 'GET',
        rejectUnauthorized: false,
        requestCert: true,
        agent: false,
        // key: '013a1e504621b27334a883444253a3d511270634474fef539d470c956ead6122',
        ca: 'adb73ef9ac148216277ba89cd041f4c8dd6c64f7767a652749e4358dd6f5127a',
        body: null,
        headers: postheaders2,
    };

    console.info('Get Options', options);

    const reqHttp = https.request(options, (reshttp) => {
        console.log(`STATUS: ${reshttp.statusCode}`);
        console.log(`HEADERS: ${JSON.stringify(reshttp.headers)}`);
        console.log('Status Code:', reshttp.statusCode);

        let data = '';
        reshttp.setEncoding('utf8');
        reshttp.on('data', (chunk) => {
            console.log(`BODY: ${chunk}`);
            data += chunk;
        });

        reshttp.on('end', (d) => {
            console.log('No more data in response.', d);
            console.log('Body: ', JSON.parse(data));
            res.send(JSON.parse(data));
        });

    }).on("error", (err) => {
        console.log("Error now is 1: ", err.message);
    });

    reqHttp.on('error', (err) => {
        console.error(`Problem with request now is:  ${err.message}`);
        console.log("Error now is: ", err.message);
        res.send(JSON.parse({
            message: 'Error',
            tryCatchMessage: "Service can't be reached at this time. You should try again.",
            isActive: false,
            data: null,
            dataLoad: null,
            status: 404,
            statusMgs: 'Error',
            isTwoFactorAuth: false
        }));
    });

    reqHttp.on('socket', (err) => {

    });

    reqHttp.on('timeout', (err) => {
        res.send(JSON.parse({
            message: 'Error',
            tryCatchMessage: "Timeout: Service can't be reached at this time. You should try again.",
            isActive: false,
            data: null,
            dataLoad: null,
            status: 404,
            statusMgs: 'Error',
            isTwoFactorAuth: false
        }));
    });

    reqHttp.write("");
    reqHttp.end();

});

// Get
app.get(controllerName + '/CheckIfAcctIsActive', (req, res) => {

    // req.body.params
    // querystring.stringify(req.body);
    // console.log(JSON.stringify(req.body));

    // const auth = `Basic: ${Buffer.from('foo:myPass1234', 'utf8').toString('base64')}`;

    var postheaders2 = {
        'Content-Type': 'application/json; charset=UTF-8',
        // Authorization: auth,
        // 'X-Api-Key': 'dajzmj6gfuzmbfnhamsbuxivc', // if authentication needed
        // 'Content-Length': Buffer.byteLength(postData, 'utf8'), // postData.length
        "Access-Control-Allow-Origin": "*"
    };

    const options = {
        hostname: BackendHost,
        port: BackendPort,
        path: '/api/AcctSecurity/CheckIfAcctIsActive?AcctId=' + req.query.AcctId,
        method: 'GET',
        rejectUnauthorized: false,
        requestCert: true,
        agent: false,
        // key: '013a1e504621b27334a883444253a3d511270634474fef539d470c956ead6122',
        ca: 'adb73ef9ac148216277ba89cd041f4c8dd6c64f7767a652749e4358dd6f5127a',
        body: null,
        headers: postheaders2,
    };

    console.info('Get Options', options);

    const reqHttp = https.request(options, (reshttp) => {
        console.log(`STATUS: ${reshttp.statusCode}`);
        console.log(`HEADERS: ${JSON.stringify(reshttp.headers)}`);
        console.log('Status Code:', reshttp.statusCode);

        let data = '';
        reshttp.setEncoding('utf8');
        reshttp.on('data', (chunk) => {
            console.log(`BODY: ${chunk}`);
            data += chunk;
        });

        reshttp.on('end', (d) => {
            console.log('No more data in response.', d);
            console.log('Body: ', JSON.parse(data));
            res.send(JSON.parse(data));
        });

    }).on("error", (err) => {
        console.log("Error now is 1: ", err.message);
    });

    reqHttp.on('error', (err) => {
        console.error(`Problem with request now is:  ${err.message}`);
        console.log("Error now is: ", err.message);
        res.send(JSON.parse({
            message: 'Error',
            tryCatchMessage: "Service can't be reached at this time. You should try again.",
            isActive: false,
            data: null,
            dataLoad: null,
            status: 404,
            statusMgs: 'Error',
            isTwoFactorAuth: false
        }));
    });

    reqHttp.on('socket', (err) => {

    });

    reqHttp.on('timeout', (err) => {
        res.send(JSON.parse({
            message: 'Error',
            tryCatchMessage: "Timeout: Service can't be reached at this time. You should try again.",
            isActive: false,
            data: null,
            dataLoad: null,
            status: 404,
            statusMgs: 'Error',
            isTwoFactorAuth: false
        }));
    });

    reqHttp.write("");
    reqHttp.end();

});

// Get
app.get(controllerName + '/Updateemailacctverify', (req, res) => {

    // req.body.params
    // querystring.stringify(req.body);
    // console.log(JSON.stringify(req.body));

    // const auth = `Basic: ${Buffer.from('foo:myPass1234', 'utf8').toString('base64')}`;

    var postheaders2 = {
        'Content-Type': 'application/json; charset=UTF-8',
        // Authorization: auth,
        // 'X-Api-Key': 'dajzmj6gfuzmbfnhamsbuxivc', // if authentication needed
        // 'Content-Length': Buffer.byteLength(postData, 'utf8'), // postData.length
        "Access-Control-Allow-Origin": "*"
    };

    const options = {
        hostname: BackendHost,
        port: BackendPort,
        path: '/api/AcctSecurity/Updateemailacctverify?data=' + req.query.data,
        method: 'GET',
        rejectUnauthorized: false,
        requestCert: true,
        agent: false,
        // key: '013a1e504621b27334a883444253a3d511270634474fef539d470c956ead6122',
        ca: 'adb73ef9ac148216277ba89cd041f4c8dd6c64f7767a652749e4358dd6f5127a',
        body: null,
        headers: postheaders2,
    };

    console.info('Get Options', options);

    const reqHttp = https.request(options, (reshttp) => {
        console.log(`STATUS: ${reshttp.statusCode}`);
        console.log(`HEADERS: ${JSON.stringify(reshttp.headers)}`);
        console.log('Status Code:', reshttp.statusCode);

        let data = '';
        reshttp.setEncoding('utf8');
        reshttp.on('data', (chunk) => {
            console.log(`BODY: ${chunk}`);
            data += chunk;
        });

        reshttp.on('end', (d) => {
            console.log('No more data in response.', d);
            console.log('Body: ', JSON.parse(data));
            res.send(JSON.parse(data));
        });

    }).on("error", (err) => {
        console.log("Error now is 1: ", err.message);
    });

    reqHttp.on('error', (err) => {
        console.error(`Problem with request now is:  ${err.message}`);
        console.log("Error now is: ", err.message);
        res.send(JSON.parse({
            message: 'Error',
            tryCatchMessage: "Service can't be reached at this time. You should try again.",
            isActive: false,
            data: null,
            dataLoad: null,
            status: 404,
            statusMgs: 'Error',
            isTwoFactorAuth: false
        }));
    });

    reqHttp.on('socket', (err) => {

    });

    reqHttp.on('timeout', (err) => {
        res.send(JSON.parse({
            message: 'Error',
            tryCatchMessage: "Timeout: Service can't be reached at this time. You should try again.",
            isActive: false,
            data: null,
            dataLoad: null,
            status: 404,
            statusMgs: 'Error',
            isTwoFactorAuth: false
        }));
    });

    reqHttp.write("");
    reqHttp.end();

});

// Get
app.get(controllerName + '/ReSendTwoFactorCode', (req, res) => {

    // req.body.params
    // querystring.stringify(req.body);
    // console.log(JSON.stringify(req.body));

    // const auth = `Basic: ${Buffer.from('foo:myPass1234', 'utf8').toString('base64')}`;

    var postheaders2 = {
        'Content-Type': 'application/json; charset=UTF-8',
        // Authorization: auth,
        // 'X-Api-Key': 'dajzmj6gfuzmbfnhamsbuxivc', // if authentication needed
        // 'Content-Length': Buffer.byteLength(postData, 'utf8'), // postData.length
        "Access-Control-Allow-Origin": "*"
    };

    const options = {
        hostname: BackendHost,
        port: BackendPort,
        path: '/api/AcctSecurity/ReSendTwoFactorCode?AcctId=' + req.query.AcctId + "&message=" + req.query.message,
        method: 'GET',
        rejectUnauthorized: false,
        requestCert: true,
        agent: false,
        // key: '013a1e504621b27334a883444253a3d511270634474fef539d470c956ead6122',
        ca: 'adb73ef9ac148216277ba89cd041f4c8dd6c64f7767a652749e4358dd6f5127a',
        body: null,
        headers: postheaders2,
    };

    console.info('Get Options', options);

    const reqHttp = https.request(options, (reshttp) => {
        console.log(`STATUS: ${reshttp.statusCode}`);
        console.log(`HEADERS: ${JSON.stringify(reshttp.headers)}`);
        console.log('Status Code:', reshttp.statusCode);

        let data = '';
        reshttp.setEncoding('utf8');
        reshttp.on('data', (chunk) => {
            console.log(`BODY: ${chunk}`);
            data += chunk;
        });

        reshttp.on('end', (d) => {
            console.log('No more data in response.', d);
            console.log('Body: ', JSON.parse(data));
            res.send(JSON.parse(data));
        });

    }).on("error", (err) => {
        console.log("Error now is 1: ", err.message);
    });

    reqHttp.on('error', (err) => {
        console.error(`Problem with request now is:  ${err.message}`);
        console.log("Error now is: ", err.message);
        res.send(JSON.parse({
            message: 'Error',
            tryCatchMessage: "Service can't be reached at this time. You should try again.",
            isActive: false,
            data: null,
            dataLoad: null,
            status: 404,
            statusMgs: 'Error',
            isTwoFactorAuth: false
        }));
    });

    reqHttp.on('socket', (err) => {

    });

    reqHttp.on('timeout', (err) => {
        res.send(JSON.parse({
            message: 'Error',
            tryCatchMessage: "Timeout: Service can't be reached at this time. You should try again.",
            isActive: false,
            data: null,
            dataLoad: null,
            status: 404,
            statusMgs: 'Error',
            isTwoFactorAuth: false
        }));
    });

    reqHttp.write("");
    reqHttp.end();

});

// Post
app.post(controllerName + '/RequestBvn', multer().none(), (req, res) => {

    const postData = JSON.stringify(req.body);

    //querystring.stringify(req.body);
    // console.log(JSON.stringify(req.body));

    // const auth = `Basic: ${Buffer.from('foo:myPass1234', 'utf8').toString('base64')}`;

    var postheaders2 = {
        'Content-Type': 'application/json; charset=UTF-8',
        //Authorization: auth,
        //'X-Api-Key': 'dajzmj6gfuzmbfnhamsbuxivc', // if authentication needed
        'Content-Length': Buffer.byteLength(postData, 'utf8'), //postData.length
        "Access-Control-Allow-Origin": "*"
    };

    const options = {
        hostname: BackendHost,
        port: BackendPort,
        path: '/api/AcctSecurity/RequestBvn',
        method: 'POST',
        rejectUnauthorized: false,
        requestCert: true,
        agent: false,
        // key: '013a1e504621b27334a883444253a3d511270634474fef539d470c956ead6122',
        ca: 'adb73ef9ac148216277ba89cd041f4c8dd6c64f7767a652749e4358dd6f5127a',
        body: postData,
        headers: postheaders2,
    };

    console.info('Post Options', options);

    const reqHttp = https.request(options, (reshttp) => {
        console.log(`STATUS: ${reshttp.statusCode}`);
        console.log(`HEADERS: ${JSON.stringify(reshttp.headers)}`);
        console.log('Status Code:', reshttp.statusCode);

        let data = '';
        reshttp.setEncoding('utf8');
        reshttp.on('data', (chunk) => {
            console.log(`BODY: ${chunk}`);
            data += chunk;
        });
        reshttp.on('end', (d) => {
            console.log('No more data in response.', d);
            console.log('Body: ', JSON.parse(data));
            res.send(JSON.parse(data));
        });

    }).on("error", (err) => {
        console.log("Error now is 1: ", err.message);
    });

    reqHttp.on('error', (err) => {
        console.error(`Problem with request now is:  ${err.message}`);
        console.log("Error now is: ", err.message);
        res.send(JSON.parse({
            message: 'Error',
            tryCatchMessage: "Service can't be reached at this time. You should try again.",
            isActive: false,
            data: null,
            dataLoad: null,
            status: 404,
            statusMgs: 'Error',
            isTwoFactorAuth: false
        }));
    });

    reqHttp.on('socket', (err) => {

    });

    reqHttp.on('timeout', (err) => {
        res.send(JSON.parse({
            message: 'Error',
            tryCatchMessage: "Timeout: Service can't be reached at this time. You should try again.",
            isActive: false,
            data: null,
            dataLoad: null,
            status: 404,
            statusMgs: 'Error',
            isTwoFactorAuth: false
        }));
    });

    reqHttp.write(postData);
    reqHttp.end();

});

// Post
app.post(controllerName + '/BvnSettledment', multer().none(), (req, res) => {

    const postData = JSON.stringify(req.body);

    //querystring.stringify(req.body);
    // console.log(JSON.stringify(req.body));

    // const auth = `Basic: ${Buffer.from('foo:myPass1234', 'utf8').toString('base64')}`;

    var postheaders2 = {
        'Content-Type': 'application/json; charset=UTF-8',
        //Authorization: auth,
        //'X-Api-Key': 'dajzmj6gfuzmbfnhamsbuxivc', // if authentication needed
        'Content-Length': Buffer.byteLength(postData, 'utf8'), //postData.length
        "Access-Control-Allow-Origin": "*"
    };

    const options = {
        hostname: BackendHost,
        port: BackendPort,
        path: '/api/AcctSecurity/BvnSettledment',
        method: 'POST',
        rejectUnauthorized: false,
        requestCert: true,
        agent: false,
        // key: '013a1e504621b27334a883444253a3d511270634474fef539d470c956ead6122',
        ca: 'adb73ef9ac148216277ba89cd041f4c8dd6c64f7767a652749e4358dd6f5127a',
        body: postData,
        headers: postheaders2,
    };

    console.info('Post Options', options);

    const reqHttp = https.request(options, (reshttp) => {
        console.log(`STATUS: ${reshttp.statusCode}`);
        console.log(`HEADERS: ${JSON.stringify(reshttp.headers)}`);
        console.log('Status Code:', reshttp.statusCode);

        let data = '';
        reshttp.setEncoding('utf8');
        reshttp.on('data', (chunk) => {
            console.log(`BODY: ${chunk}`);
            data += chunk;
        });
        reshttp.on('end', (d) => {
            console.log('No more data in response.', d);
            console.log('Body: ', JSON.parse(data));
            res.send(JSON.parse(data));
        });

    }).on("error", (err) => {
        console.log("Error now is 1: ", err.message);
    });

    reqHttp.on('error', (err) => {
        console.error(`Problem with request now is:  ${err.message}`);
        console.log("Error now is: ", err.message);
        res.send(JSON.parse({
            message: 'Error',
            tryCatchMessage: "Service can't be reached at this time. You should try again.",
            isActive: false,
            data: null,
            dataLoad: null,
            status: 404,
            statusMgs: 'Error',
            isTwoFactorAuth: false
        }));
    });

    reqHttp.on('socket', (err) => {

    });

    reqHttp.on('timeout', (err) => {
        res.send(JSON.parse({
            message: 'Error',
            tryCatchMessage: "Timeout: Service can't be reached at this time. You should try again.",
            isActive: false,
            data: null,
            dataLoad: null,
            status: 404,
            statusMgs: 'Error',
            isTwoFactorAuth: false
        }));
    });

    reqHttp.write(postData);
    reqHttp.end();

});

// Post
app.post(controllerName + '/SendBvnAuthentication', multer().none(), (req, res) => {

    const postData = JSON.stringify(req.body);

    //querystring.stringify(req.body);
    // console.log(JSON.stringify(req.body));

    // const auth = `Basic: ${Buffer.from('foo:myPass1234', 'utf8').toString('base64')}`;

    var postheaders2 = {
        'Content-Type': 'application/json; charset=UTF-8',
        //Authorization: auth,
        //'X-Api-Key': 'dajzmj6gfuzmbfnhamsbuxivc', // if authentication needed
        'Content-Length': Buffer.byteLength(postData, 'utf8'), //postData.length
        "Access-Control-Allow-Origin": "*"
    };

    const options = {
        hostname: BackendHost,
        port: BackendPort,
        path: '/api/AcctSecurity/SendBvnAuthentication',
        method: 'POST',
        rejectUnauthorized: false,
        requestCert: true,
        agent: false,
        // key: '013a1e504621b27334a883444253a3d511270634474fef539d470c956ead6122',
        ca: 'adb73ef9ac148216277ba89cd041f4c8dd6c64f7767a652749e4358dd6f5127a',
        body: postData,
        headers: postheaders2,
    };

    console.info('Post Options', options);

    const reqHttp = https.request(options, (reshttp) => {
        console.log(`STATUS: ${reshttp.statusCode}`);
        console.log(`HEADERS: ${JSON.stringify(reshttp.headers)}`);
        console.log('Status Code:', reshttp.statusCode);

        let data = '';
        reshttp.setEncoding('utf8');
        reshttp.on('data', (chunk) => {
            console.log(`BODY: ${chunk}`);
            data += chunk;
        });
        reshttp.on('end', (d) => {
            console.log('No more data in response.', d);
            console.log('Body: ', JSON.parse(data));
            res.send(JSON.parse(data));
        });

    }).on("error", (err) => {
        console.log("Error now is 1: ", err.message);
    });

    reqHttp.on('error', (err) => {
        console.error(`Problem with request now is:  ${err.message}`);
        console.log("Error now is: ", err.message);
        res.send(JSON.parse({
            message: 'Error',
            tryCatchMessage: "Service can't be reached at this time. You should try again.",
            isActive: false,
            data: null,
            dataLoad: null,
            status: 404,
            statusMgs: 'Error',
            isTwoFactorAuth: false
        }));
    });

    reqHttp.on('socket', (err) => {

    });

    reqHttp.on('timeout', (err) => {
        res.send(JSON.parse({
            message: 'Error',
            tryCatchMessage: "Timeout: Service can't be reached at this time. You should try again.",
            isActive: false,
            data: null,
            dataLoad: null,
            status: 404,
            statusMgs: 'Error',
            isTwoFactorAuth: false
        }));
    });

    reqHttp.write(postData);
    reqHttp.end();

});

// Post
app.post(controllerName + '/CheckIfEmailExit', multer().none(), (req, res) => {

    const postData = JSON.stringify(req.body);

    //querystring.stringify(req.body);
    // console.log(JSON.stringify(req.body));

    // const auth = `Basic: ${Buffer.from('foo:myPass1234', 'utf8').toString('base64')}`;

    var postheaders2 = {
        'Content-Type': 'application/json; charset=UTF-8',
        //Authorization: auth,
        //'X-Api-Key': 'dajzmj6gfuzmbfnhamsbuxivc', // if authentication needed
        'Content-Length': Buffer.byteLength(postData, 'utf8'), //postData.length
        "Access-Control-Allow-Origin": "*"
    };

    const options = {
        hostname: BackendHost,
        port: BackendPort,
        path: '/api/AcctSecurity/CheckIfEmailExit',
        method: 'POST',
        rejectUnauthorized: false,
        requestCert: true,
        agent: false,
        // key: '013a1e504621b27334a883444253a3d511270634474fef539d470c956ead6122',
        ca: 'adb73ef9ac148216277ba89cd041f4c8dd6c64f7767a652749e4358dd6f5127a',
        body: postData,
        headers: postheaders2,
    };

    console.info('Post Options', options);

    const reqHttp = https.request(options, (reshttp) => {
        console.log(`STATUS: ${reshttp.statusCode}`);
        console.log(`HEADERS: ${JSON.stringify(reshttp.headers)}`);
        console.log('Status Code:', reshttp.statusCode);

        let data = '';
        reshttp.setEncoding('utf8');
        reshttp.on('data', (chunk) => {
            console.log(`BODY: ${chunk}`);
            data += chunk;
        });
        reshttp.on('end', (d) => {
            console.log('No more data in response.', d);
            console.log('Body: ', JSON.parse(data));
            res.send(JSON.parse(data));
        });

    }).on("error", (err) => {
        console.log("Error now is 1: ", err.message);
    });

    reqHttp.on('error', (err) => {
        console.error(`Problem with request now is:  ${err.message}`);
        console.log("Error now is: ", err.message);
        res.send(JSON.parse({
            message: 'Error',
            tryCatchMessage: "Service can't be reached at this time. You should try again.",
            isActive: false,
            data: null,
            dataLoad: null,
            status: 404,
            statusMgs: 'Error',
            isTwoFactorAuth: false
        }));
    });

    reqHttp.on('socket', (err) => {

    });

    reqHttp.on('timeout', (err) => {
        res.send(JSON.parse({
            message: 'Error',
            tryCatchMessage: "Timeout: Service can't be reached at this time. You should try again.",
            isActive: false,
            data: null,
            dataLoad: null,
            status: 404,
            statusMgs: 'Error',
            isTwoFactorAuth: false
        }));
    });

    reqHttp.write(postData);
    reqHttp.end();

});

// Post
app.post(controllerName + '/ChangePassword', multer().none(), (req, res) => {

    const postData = JSON.stringify(req.body);

    //querystring.stringify(req.body);
    // console.log(JSON.stringify(req.body));

    // const auth = `Basic: ${Buffer.from('foo:myPass1234', 'utf8').toString('base64')}`;

    var postheaders2 = {
        'Content-Type': 'application/json; charset=UTF-8',
        //Authorization: auth,
        //'X-Api-Key': 'dajzmj6gfuzmbfnhamsbuxivc', // if authentication needed
        'Content-Length': Buffer.byteLength(postData, 'utf8'), //postData.length
        "Access-Control-Allow-Origin": "*"
    };

    const options = {
        hostname: BackendHost,
        port: BackendPort,
        path: '/api/AcctSecurity/ChangePassword',
        method: 'POST',
        rejectUnauthorized: false,
        requestCert: true,
        agent: false,
        // key: '013a1e504621b27334a883444253a3d511270634474fef539d470c956ead6122',
        ca: 'adb73ef9ac148216277ba89cd041f4c8dd6c64f7767a652749e4358dd6f5127a',
        body: postData,
        headers: postheaders2,
    };

    console.info('Post Options', options);

    const reqHttp = https.request(options, (reshttp) => {
        console.log(`STATUS: ${reshttp.statusCode}`);
        console.log(`HEADERS: ${JSON.stringify(reshttp.headers)}`);
        console.log('Status Code:', reshttp.statusCode);

        let data = '';
        reshttp.setEncoding('utf8');
        reshttp.on('data', (chunk) => {
            console.log(`BODY: ${chunk}`);
            data += chunk;
        });
        reshttp.on('end', (d) => {
            console.log('No more data in response.', d);
            console.log('Body: ', JSON.parse(data));
            res.send(JSON.parse(data));
        });

    }).on("error", (err) => {
        console.log("Error now is 1: ", err.message);
    });

    reqHttp.on('error', (err) => {
        console.error(`Problem with request now is:  ${err.message}`);
        console.log("Error now is: ", err.message);
        res.send(JSON.parse({
            message: 'Error',
            tryCatchMessage: "Service can't be reached at this time. You should try again.",
            isActive: false,
            data: null,
            dataLoad: null,
            status: 404,
            statusMgs: 'Error',
            isTwoFactorAuth: false
        }));
    });

    reqHttp.on('socket', (err) => {

    });

    reqHttp.on('timeout', (err) => {
        res.send(JSON.parse({
            message: 'Error',
            tryCatchMessage: "Timeout: Service can't be reached at this time. You should try again.",
            isActive: false,
            data: null,
            dataLoad: null,
            status: 404,
            statusMgs: 'Error',
            isTwoFactorAuth: false
        }));
    });

    reqHttp.write(postData);
    reqHttp.end();
});

// Post
app.post(controllerName + '/VerifyBvnOtpCode', multer().none(), (req, res) => {

    const postData = JSON.stringify(req.body);

    //querystring.stringify(req.body);
    // console.log(JSON.stringify(req.body));

    // const auth = `Basic: ${Buffer.from('foo:myPass1234', 'utf8').toString('base64')}`;

    var postheaders2 = {
        'Content-Type': 'application/json; charset=UTF-8',
        //Authorization: auth,
        //'X-Api-Key': 'dajzmj6gfuzmbfnhamsbuxivc', // if authentication needed
        'Content-Length': Buffer.byteLength(postData, 'utf8'), //postData.length
        "Access-Control-Allow-Origin": "*"
    };

    const options = {
        hostname: BackendHost,
        port: BackendPort,
        path: '/api/AcctSecurity/VerifyBvnOtpCode',
        method: 'POST',
        rejectUnauthorized: false,
        requestCert: true,
        agent: false,
        // key: '013a1e504621b27334a883444253a3d511270634474fef539d470c956ead6122',
        ca: 'adb73ef9ac148216277ba89cd041f4c8dd6c64f7767a652749e4358dd6f5127a',
        body: postData,
        headers: postheaders2,
    };

    console.info('Post Options', options);

    const reqHttp = https.request(options, (reshttp) => {
        console.log(`STATUS: ${reshttp.statusCode}`);
        console.log(`HEADERS: ${JSON.stringify(reshttp.headers)}`);
        console.log('Status Code:', reshttp.statusCode);

        let data = '';
        reshttp.setEncoding('utf8');
        reshttp.on('data', (chunk) => {
            console.log(`BODY: ${chunk}`);
            data += chunk;
        });
        reshttp.on('end', (d) => {
            console.log('No more data in response.', d);
            console.log('Body: ', JSON.parse(data));
            res.send(JSON.parse(data));
        });

    }).on("error", (err) => {
        console.log("Error now is 1: ", err.message);
    });

    reqHttp.on('error', (err) => {
        console.error(`Problem with request now is:  ${err.message}`);
        console.log("Error now is: ", err.message);
        res.send(JSON.parse({
            message: 'Error',
            tryCatchMessage: "Service can't be reached at this time. You should try again.",
            isActive: false,
            data: null,
            dataLoad: null,
            status: 404,
            statusMgs: 'Error',
            isTwoFactorAuth: false
        }));
    });

    reqHttp.on('socket', (err) => {

    });

    reqHttp.on('timeout', (err) => {
        res.send(JSON.parse({
            message: 'Error',
            tryCatchMessage: "Timeout: Service can't be reached at this time. You should try again.",
            isActive: false,
            data: null,
            dataLoad: null,
            status: 404,
            statusMgs: 'Error',
            isTwoFactorAuth: false
        }));
    });

    reqHttp.write(postData);
    reqHttp.end();

});

// Get
app.get(controllerName + '/GetLoanSettings', (req, res) => {

    // req.body.params
    // querystring.stringify(req.body);
    // console.log(JSON.stringify(req.body));

    // const auth = `Basic: ${Buffer.from('foo:myPass1234', 'utf8').toString('base64')}`;

    var postheaders2 = {
        'Content-Type': 'application/json; charset=UTF-8',
        // Authorization: auth,
        // 'X-Api-Key': 'dajzmj6gfuzmbfnhamsbuxivc', // if authentication needed
        // 'Content-Length': Buffer.byteLength(postData, 'utf8'), // postData.length
        "Access-Control-Allow-Origin": "*"
    };

    const options = {
        hostname: BackendHost,
        port: BackendPort,
        path: '/api/AcctSecurity/GetLoanSettings?AcctId=' + req.query.AcctId,
        method: 'GET',
        rejectUnauthorized: false,
        requestCert: true,
        agent: false,
        // key: '013a1e504621b27334a883444253a3d511270634474fef539d470c956ead6122',
        ca: 'adb73ef9ac148216277ba89cd041f4c8dd6c64f7767a652749e4358dd6f5127a',
        body: null,
        headers: postheaders2,
    };

    console.info('Get Options', options);

    const reqHttp = https.request(options, (reshttp) => {
        console.log(`STATUS: ${reshttp.statusCode}`);
        console.log(`HEADERS: ${JSON.stringify(reshttp.headers)}`);
        console.log('Status Code:', reshttp.statusCode);

        let data = '';
        reshttp.setEncoding('utf8');
        reshttp.on('data', (chunk) => {
            console.log(`BODY: ${chunk}`);
            data += chunk;
        });

        reshttp.on('end', (d) => {
            console.log('No more data in response.', d);
            console.log('Body: ', JSON.parse(data));
            res.send(JSON.parse(data));
        });

    }).on("error", (err) => {
        console.log("Error now is 1: ", err.message);
    });

    reqHttp.on('error', (err) => {
        console.error(`Problem with request now is:  ${err.message}`);
        console.log("Error now is: ", err.message);
        res.send(JSON.parse({
            message: 'Error',
            tryCatchMessage: "Service can't be reached at this time. You should try again.",
            isActive: false,
            data: null,
            dataLoad: null,
            status: 404,
            statusMgs: 'Error',
            isTwoFactorAuth: false
        }));
    });

    reqHttp.on('socket', (err) => {

    });

    reqHttp.on('timeout', (err) => {
        res.send(JSON.parse({
            message: 'Error',
            tryCatchMessage: "Timeout: Service can't be reached at this time. You should try again.",
            isActive: false,
            data: null,
            dataLoad: null,
            status: 404,
            statusMgs: 'Error',
            isTwoFactorAuth: false
        }));
    });

    reqHttp.write("");
    reqHttp.end();

});

// Get
app.get(controllerName + '/GetE360UsersByCustomer', (req, res) => {

    // req.body.params
    // querystring.stringify(req.body);
    // console.log(JSON.stringify(req.body));

    // const auth = `Basic: ${Buffer.from('foo:myPass1234', 'utf8').toString('base64')}`;

    var postheaders2 = {
        'Content-Type': 'application/json; charset=UTF-8',
        // Authorization: auth,
        // 'X-Api-Key': 'dajzmj6gfuzmbfnhamsbuxivc', // if authentication needed
        // 'Content-Length': Buffer.byteLength(postData, 'utf8'), // postData.length
        "Access-Control-Allow-Origin": "*"
    };

    const options = {
        hostname: BackendHost,
        port: BackendPort,
        path: '/api/AcctSecurity/GetE360UsersByCustomer?AcctId=' + req.query.AcctId + "&inputUser=" + req.query.inputUser,
        method: 'GET',
        rejectUnauthorized: false,
        requestCert: true,
        agent: false,
        // key: '013a1e504621b27334a883444253a3d511270634474fef539d470c956ead6122',
        ca: 'adb73ef9ac148216277ba89cd041f4c8dd6c64f7767a652749e4358dd6f5127a',
        body: null,
        headers: postheaders2,
    };

    console.info('Get Options', options);

    const reqHttp = https.request(options, (reshttp) => {
        console.log(`STATUS: ${reshttp.statusCode}`);
        console.log(`HEADERS: ${JSON.stringify(reshttp.headers)}`);
        console.log('Status Code:', reshttp.statusCode);

        let data = '';
        reshttp.setEncoding('utf8');
        reshttp.on('data', (chunk) => {
            console.log(`BODY: ${chunk}`);
            data += chunk;
        });

        reshttp.on('end', (d) => {
            console.log('No more data in response.', d);
            console.log('Body: ', JSON.parse(data));
            res.send(JSON.parse(data));
        });

    }).on("error", (err) => {
        console.log("Error now is 1: ", err.message);
    });

    reqHttp.on('error', (err) => {
        console.error(`Problem with request now is:  ${err.message}`);
        console.log("Error now is: ", err.message);
        res.send(JSON.parse({
            message: 'Error',
            tryCatchMessage: "Service can't be reached at this time. You should try again.",
            isActive: false,
            data: null,
            dataLoad: null,
            status: 404,
            statusMgs: 'Error',
            isTwoFactorAuth: false
        }));
    });

    reqHttp.on('socket', (err) => {

    });

    reqHttp.on('timeout', (err) => {
        res.send(JSON.parse({
            message: 'Error',
            tryCatchMessage: "Timeout: Service can't be reached at this time. You should try again.",
            isActive: false,
            data: null,
            dataLoad: null,
            status: 404,
            statusMgs: 'Error',
            isTwoFactorAuth: false
        }));
    });

    reqHttp.write("");
    reqHttp.end();

});

// Post 
app.post(controllerName + '/AllOngoingAndCompletedLoanAppList', multer().none(), (req, res) => {

    const postData = JSON.stringify(req.body);

    //querystring.stringify(req.body);
    // console.log(JSON.stringify(req.body));

    // const auth = `Basic: ${Buffer.from('foo:myPass1234', 'utf8').toString('base64')}`;
    var postheaders2 = {
        'Content-Type': 'application/json; charset=UTF-8',
        //Authorization: auth,
        //'X-Api-Key': 'dajzmj6gfuzmbfnhamsbuxivc',            // if authentication needed
        'Content-Length': Buffer.byteLength(postData, 'utf8'), //postData.length
        "Access-Control-Allow-Origin": "*"
    };

    const options = {
        hostname: BackendHost,
        port: BackendPort,
        path: '/api/AcctSecurity/AllOngoingAndCompletedLoanAppList',
        method: 'POST',
        rejectUnauthorized: false,
        requestCert: true,
        agent: false,
        // key: '013a1e504621b27334a883444253a3d511270634474fef539d470c956ead6122',
        ca: 'adb73ef9ac148216277ba89cd041f4c8dd6c64f7767a652749e4358dd6f5127a',
        body: postData,
        headers: postheaders2,
    };

    console.info('Post Options', options);

    const reqHttp = https.request(options, (reshttp) => {

        console.log(`STATUS: ${reshttp.statusCode}`);
        console.log(`HEADERS: ${JSON.stringify(reshttp.headers)}`);
        console.log('Status Code:', reshttp.statusCode);

        let data = '';
        reshttp.setEncoding('utf8');
        reshttp.on('data', (chunk) => {
            console.log(`BODY: ${chunk}`);
            data += chunk;
        });
        reshttp.on('end', (d) => {
            console.log('No more data in response.', d);
            console.log('Body: ', JSON.parse(data));
            res.send(JSON.parse(data));
        });

    }).on("error", (err) => {
        console.log("Error now is 1: ", err.message);
    });

    reqHttp.on('error', (err) => {
        console.error(`Problem with request now is:  ${err.message}`);
        console.log("Error now is: ", err.message);
        res.send(JSON.parse({
            message: 'Error',
            tryCatchMessage: "Service can't be reached at this time. You should try again.",
            isActive: false,
            data: null,
            dataLoad: null,
            status: 404,
            statusMgs: 'Error',
            isTwoFactorAuth: false
        }));
    });

    reqHttp.on('socket', (err) => {

    });

    reqHttp.on('timeout', (err) => {
        res.send(JSON.parse({
            message: 'Error',
            tryCatchMessage: "Timeout: Service can't be reached at this time. You should try again.",
            isActive: false,
            data: null,
            dataLoad: null,
            status: 404,
            statusMgs: 'Error',
            isTwoFactorAuth: false
        }));
    });

    reqHttp.write(postData);
    reqHttp.end();

});


// Post 
app.post(controllerName + '/UploadPayslip', (req, res) => {

    // const postData = JSON.stringify(req.body);
    //const title = req.body.title;
    // const file = req.file;

    // console.log(title);
    // console.log(file);

    //const tempPath = req.file.path;
    // console.log(req.file.filename);

    // querystring.stringify(req.body);
    // console.log(JSON.stringify(req.body));

    // const auth = `Basic: ${Buffer.from('foo:myPass1234', 'utf8').toString('base64')}`;

    if (req.file) {

    }

    var postheaders2 = {
        'Content-Type': 'multipart/form-data',
        //Authorization: auth,
        //'X-Api-Key': 'dajzmj6gfuzmbfnhamsbuxivc',            // if authentication needed
        //'Content-Length': Buffer.byteLength(postData, 'utf8'), //postData.length
        "Access-Control-Allow-Origin": "*"
    };

    const form = new FormData();
    form.append("type", "composer");
    form.append("synchronous", "true");
    form.append("file", req.file, {
        contentType: file.mimetype,
    });

    const options = {
        hostname: BackendHost,
        port: BackendPort,
        path: '/api/FileUploader/UploadPayslip',
        method: 'POST',
        rejectUnauthorized: false,
        requestCert: true,
        agent: false,
        // key: '013a1e504621b27334a883444253a3d511270634474fef539d470c956ead6122',
        ca: 'adb73ef9ac148216277ba89cd041f4c8dd6c64f7767a652749e4358dd6f5127a',
        //body: form,
        headers: form.getHeaders(),
    };

    console.info('Post Options', options);

    const reqHttp = https.request(options, form.getBuffer(), (reshttp) => {

        console.log(`STATUS: ${reshttp.statusCode}`);
        console.log(`HEADERS: ${JSON.stringify(reshttp.headers)}`);
        console.log('Status Code:', reshttp.statusCode);

        let data = '';
        reshttp.setEncoding('utf8');
        reshttp.on('data', (chunk) => {
            console.log(`BODY: ${chunk}`);
            data += chunk;
        });
        reshttp.on('end', (d) => {
            console.log('No more data in response.', d);
            console.log('Body: ', JSON.parse(data));
            res.send(JSON.parse(data));
        });

    }).on("error", (err) => {
        console.log("Error now is 1: ", err.message);
    });

    reqHttp.on('error', (err) => {
        console.error(`Problem with request now is:  ${err.message}`);
        console.log("Error now is: ", err.message);
        res.send(JSON.parse({
            message: 'Error',
            tryCatchMessage: "Service can't be reached at this time. You should try again.",
            isActive: false,
            data: null,
            dataLoad: null,
            status: 404,
            statusMgs: 'Error',
            isTwoFactorAuth: false
        }));
    });

    reqHttp.on('socket', (err) => {

    });

    reqHttp.on('timeout', (err) => {
        res.send(JSON.parse({
            message: 'Error',
            tryCatchMessage: "Timeout: Service can't be reached at this time. You should try again.",
            isActive: false,
            data: null,
            dataLoad: null,
            status: 404,
            statusMgs: 'Error',
            isTwoFactorAuth: false
        }));
    });

    reqHttp.write(postData);
    reqHttp.end();

});
// Post 
app.post(controllerName + '/UploadIDCard', (req, res) => {

    // const postData = JSON.stringify(req.body);
    //const title = req.body.title;
    // const file = req.file;

    // console.log(title);
    // console.log(file);

    //const tempPath = req.file.path;
    // console.log(req.file.filename);

    // querystring.stringify(req.body);
    // console.log(JSON.stringify(req.body));

    // const auth = `Basic: ${Buffer.from('foo:myPass1234', 'utf8').toString('base64')}`;

    if (req.file) {

    }

    var postheaders2 = {
        'Content-Type': 'multipart/form-data',
        //Authorization: auth,
        //'X-Api-Key': 'dajzmj6gfuzmbfnhamsbuxivc',            // if authentication needed
        //'Content-Length': Buffer.byteLength(postData, 'utf8'), //postData.length
        "Access-Control-Allow-Origin": "*"
    };

    const form = new FormData();
    form.append("type", "composer");
    form.append("synchronous", "true");
    form.append("file", req.file, {
        contentType: file.mimetype,
    });

    const options = {
        hostname: BackendHost,
        port: BackendPort,
        path: '/api/FileUploader/UploadIDCard',
        method: 'POST',
        rejectUnauthorized: false,
        requestCert: true,
        agent: false,
        // key: '013a1e504621b27334a883444253a3d511270634474fef539d470c956ead6122',
        ca: 'adb73ef9ac148216277ba89cd041f4c8dd6c64f7767a652749e4358dd6f5127a',
        //body: form,
        headers: form.getHeaders(),
    };

    console.info('Post Options', options);

    const reqHttp = https.request(options, form.getBuffer(), (reshttp) => {

        console.log(`STATUS: ${reshttp.statusCode}`);
        console.log(`HEADERS: ${JSON.stringify(reshttp.headers)}`);
        console.log('Status Code:', reshttp.statusCode);

        let data = '';
        reshttp.setEncoding('utf8');
        reshttp.on('data', (chunk) => {
            console.log(`BODY: ${chunk}`);
            data += chunk;
        });
        reshttp.on('end', (d) => {
            console.log('No more data in response.', d);
            console.log('Body: ', JSON.parse(data));
            res.send(JSON.parse(data));
        });

    }).on("error", (err) => {
        console.log("Error now is 1: ", err.message);
    });

    reqHttp.on('error', (err) => {
        console.error(`Problem with request now is:  ${err.message}`);
        console.log("Error now is: ", err.message);
        res.send(JSON.parse({
            message: 'Error',
            tryCatchMessage: "Service can't be reached at this time. You should try again.",
            isActive: false,
            data: null,
            dataLoad: null,
            status: 404,
            statusMgs: 'Error',
            isTwoFactorAuth: false
        }));
    });

    reqHttp.on('socket', (err) => {

    });

    reqHttp.on('timeout', (err) => {
        res.send(JSON.parse({
            message: 'Error',
            tryCatchMessage: "Timeout: Service can't be reached at this time. You should try again.",
            isActive: false,
            data: null,
            dataLoad: null,
            status: 404,
            statusMgs: 'Error',
            isTwoFactorAuth: false
        }));
    });

    reqHttp.write(postData);
    reqHttp.end();

});
// Post 
app.post(controllerName + '/UploadPassport', (req, res) => {

    // const postData = JSON.stringify(req.body);
    //const title = req.body.title;
    // const file = req.file;

    // console.log(title);
    // console.log(file);

    //const tempPath = req.file.path;
    // console.log(req.file.filename);

    // querystring.stringify(req.body);
    // console.log(JSON.stringify(req.body));

    // const auth = `Basic: ${Buffer.from('foo:myPass1234', 'utf8').toString('base64')}`;

    if (req.file) {

    }

    var postheaders2 = {
        'Content-Type': 'multipart/form-data',
        //Authorization: auth,
        //'X-Api-Key': 'dajzmj6gfuzmbfnhamsbuxivc',            // if authentication needed
        //'Content-Length': Buffer.byteLength(postData, 'utf8'), //postData.length
        "Access-Control-Allow-Origin": "*"
    };

    const form = new FormData();
    form.append("type", "composer");
    form.append("synchronous", "true");
    form.append("file", req.file, {
        contentType: file.mimetype,
    });

    const options = {
        hostname: BackendHost,
        port: BackendPort,
        path: '/api/FileUploader/UploadPassport',
        method: 'POST',
        rejectUnauthorized: false,
        requestCert: true,
        agent: false,
        // key: '013a1e504621b27334a883444253a3d511270634474fef539d470c956ead6122',
        ca: 'adb73ef9ac148216277ba89cd041f4c8dd6c64f7767a652749e4358dd6f5127a',
        //body: form,
        headers: form.getHeaders(),
    };

    console.info('Post Options', options);

    const reqHttp = https.request(options, form.getBuffer(), (reshttp) => {

        console.log(`STATUS: ${reshttp.statusCode}`);
        console.log(`HEADERS: ${JSON.stringify(reshttp.headers)}`);
        console.log('Status Code:', reshttp.statusCode);

        let data = '';
        reshttp.setEncoding('utf8');
        reshttp.on('data', (chunk) => {
            console.log(`BODY: ${chunk}`);
            data += chunk;
        });
        reshttp.on('end', (d) => {
            console.log('No more data in response.', d);
            console.log('Body: ', JSON.parse(data));
            res.send(JSON.parse(data));
        });

    }).on("error", (err) => {
        console.log("Error now is 1: ", err.message);
    });

    reqHttp.on('error', (err) => {
        console.error(`Problem with request now is:  ${err.message}`);
        console.log("Error now is: ", err.message);
        res.send(JSON.parse({
            message: 'Error',
            tryCatchMessage: "Service can't be reached at this time. You should try again.",
            isActive: false,
            data: null,
            dataLoad: null,
            status: 404,
            statusMgs: 'Error',
            isTwoFactorAuth: false
        }));
    });

    reqHttp.on('socket', (err) => {

    });

    reqHttp.on('timeout', (err) => {
        res.send(JSON.parse({
            message: 'Error',
            tryCatchMessage: "Timeout: Service can't be reached at this time. You should try again.",
            isActive: false,
            data: null,
            dataLoad: null,
            status: 404,
            statusMgs: 'Error',
            isTwoFactorAuth: false
        }));
    });

    reqHttp.write(postData);
    reqHttp.end();

});