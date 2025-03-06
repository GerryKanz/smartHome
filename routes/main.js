module.exports = function (app) {

    var http = require("http");

    //home page
    app.get("/", function (req, res) {
        res.render("home.html")
        let device_names = "SELECT name FROM airConditioner lights";

        db.query(device_names, sqlquery_lights, function (err, names) {
            if (err) {
                return console.error(err.message);
            }
            else {
                for (var i = 0; i < names.length; i++) {
                    console.log(names[i].name)
                }

            }
        })

    });

    //links to all pages
    app.get("/home", (req, res) => {
        res.render("home.html")
    });

    app.get("/addDevice", (req, res) => {
        res.render("addDevice.html")
    });

    app.get("/controlDevice", (req, res) => {
        res.render("controlDevice.html")
    });

    app.get("/deviceStatus", (req, res) => {
        res.render("deviceStatus.html")
    });

    app.get("/deleteDevice", (req, res) => {
        res.render("deleteDevice.html")
    });


    app.get("/aboutpage", (req, res) => {
        res.render("about.html")
    });


    //add new device page
    app.post("/newDevice", (req, res) => {
        var query_input = "";
        let result_val = "";
        let sqlqry = "";

        //create an array of parameters to use in data base querying
        let req_params = [req.body.type, req.body.name, req.body.status];

        //custom string for each device
        if (req.body.type == "smartTV") {
            req_params.splice(2, 0, req.body.volume);
            result_val = result_val.concat('volume');
            query_input = query_input.concat('?')
        }
        else if (req.body.type == "airConditioner") {
            req_params.splice(2, 0, req.body.temperature);
            result_val = result_val.concat('temperature');
            query_input = query_input.concat('?')
        }
        else if (req.body.type == "lights") {
            req_params.splice(2, 0, req.body.itensity);
            result_val = result_val.concat('itensity');
            query_input = query_input.concat('?')
        }
        else if (req.body.type == "CCTV") {

            req_params.splice(2, 0, req.body.videoQuality);
            result_val = result_val.concat('videoQuality, ');
            query_input = query_input.concat('?, ')

            req_params.splice(3, 0, req.body.audio);
            result_val = result_val.concat('audio');
            query_input = query_input.concat('?')
        }

        else if (req.body.type == "blinder") {
            req_params.splice(2, 0, req.body.blinderdrop);
            result_val = result_val.concat('blinderdrop');
            query_input = query_input.concat('?')
        }

        //declare and initialize variable sql query parameter
        sqlqry = `INSERT INTO ${req.body.type} (type, name, ${result_val}, status) VALUES (?, ?, ${query_input}, ?)`;

        // execute sql query
        db.query(sqlqry, req_params, (err, result) => {
            if (err) {
                return console.error(err.message);
            } else
                res.render("addDevice.html");
        });
    });


    //route for the device status page 
    app.get("/device_status_dType", function (req, res) {

        // variable word to store device type
        word = req.query.device_type;

        //declare and initialize variable sql query parameter
        let sqlquery = `SELECT name FROM ${req.query.device_type}`

        // execute sql query
        db.query(sqlquery, req.query.device_type, (err, result) => {
            if (err) {
                return console.error("No device found with device type "
                    + req.query.value + "error: " + err.message);
            } else {
                installedDevices = result;
                res.render("deviceStatus.html", { installedDevices })
            }
        });


        //on control device page, route to handle device selected by user 
        app.get("/Device_stts_selected", function (req, res) {

            //variables sql query parameters to search in the database
            let sqlquery = `SELECT * FROM ${word} WHERE name like ?`;
            let d_name = req.query.device;

            // execute sql query
            db.query(sqlquery, d_name, (err, result) => {
                if (err) {
                    return console.error("there is a prob with "
                        + req.query.d_name + "error: " + err.message);
                } else {
                    let fld = Object.keys(result[0]).splice(1);
                    res.render("deviceStatus.html", { Device_status: result, fields: fld });
                    console.log(fld);
                    console.log(result);
                }
            });
        });
    });

    //control device page
    app.get("/devicetype_control", function (req, res) {

        //searching in the database
        word = req.query.device_type;

        let sqlquery = `SELECT * FROM ${word}`
        // execute sql query
        db.query(sqlquery, req.query.device_type, (err, result) => {
            if (err) {
                return console.error("No devices found with the device: "
                    + req.query.value + "error: " + err.message);
            } else {
                installedDevices = result;
                res.render("controlDevice.html", { installedDevices: result, device_type: word })
                console.log(result)
            }
        });

        //gets a device selected by user and renders it to the control device html
        app.get("/cont", function (req, res) {

            //searching in the database
            let sqlquery = `SELECT * FROM ${word} WHERE name = ?`;
            let d_name = req.query.device;
            console.log(d_name)

            // execute sql query
            db.query(sqlquery, d_name, (err, result) => {
                if (err) {
                    return console.error("there is a problem with"
                        + req.query.d_name + "error: " + err.message);

                } else {

                    res.render("controlDevice.html", { device_cntrld: result[0] });
                }
            });
        });

        //responsible for device control page
        app.post("/control", (req, res) => {

            //variable to hold custom strig fro sql input
            let query_input = "";
            let result_val = "";

            // store custom strings in a variabl, to be passed into sql query as a parameter
            if (req.body.type == "smartTV") {
                query_input = `volume = ${req.body.volume}, status = "${req.body.status}"`;
            }

            if (req.body.type == "airConditioner") {
                query_input = `temperature = ${req.body.temperature}, status = "${req.body.status}"`;
            }

            if (req.body.type == "lights") {
                query_input = `itensity = "${req.body.itensity}", status = "${req.body.status}"`;
            }

            if (req.body.type == "CCTV") {
                query_input = `videoQuality = "${req.body.videoQuality}", audio = "${req.body.audio}", status = "${req.body.status}"`;
            }

            if (req.body.type == "blinder") {
                query_input = `mode = "${req.body.mode}",  status = "${req.body.status}"`;
            }

            //sql query variable storing input to update values
            let sqlqry = `UPDATE ${req.body.type}  SET ${query_input} WHERE name = ? `;

            // execute sql query
            db.query(sqlqry, req.body.name, (err, result) => {
                if (err) {
                    return console.error(err.message);
                } else
                    res.render("controlDevice.html", { installedDevices })

                console.log(installedDevices);
            });
        });
    });

    //responsible for the delete page
    app.get("/devicetype_dlt", function (req, res) {

        //variables to store device type and another one to query output
        word = req.query.device_type;
        installedDevices = {};

        let sqlquery = `SELECT name FROM ${word}`

        // execute sql query
        db.query(sqlquery, req.query.device_type, (err, result) => {
            if (err) {
                return console.error("No book found with the keyword you have entered"
                    + req.query.value + "error: " + err.message);
            } else {
                installedDevices = result;
                res.render("deleteDevice.html", { installedDevices })
            }
        });

        app.get("/device_toDlt", function (req, res) {



            //search in the database
            let d_name = req.query.device;
            console.log("can read " + d_name)
            let sqlquery = `SELECT * FROM ${word} WHERE name = ?`;

            // execute sql query
            db.query(sqlquery, d_name, (err, result) => {
                if (err) {
                    return console.error("there is a prob with "
                        + req.query.d_name + "error: " + err.message);

                } else {


                    //responsible for the delete query
                    let sqlquery = `DELETE FROM ${word} WHERE name = ?`;
                    var success = "";

                    //delete from data base
                    db.query(sqlquery, result[0].name, (err, result) => {
                        if (err) {
                            return console.error("there a prob with "
                                + req.query.device_sel + "error: " + err.message);
                        } else {
                        }

                    });

                    //update the page with the new info and
                    //set time out to wait 2sec while a success message displays on client side
                    setTimeout(() => {
                        let sqlquery_updated_vals = `SELECT name FROM ${word}`
                        let installedDevices = [];
                        db.query(sqlquery_updated_vals, result[0].type, (err, result) => {
                            if (err) {
                                return console.error("this is the prob"
                                    + req.query.device_sel + "error: " + err.message);

                            } else {

                                console.log(d_name);

                                installedDevices = result

                                res.render("deleteDevice.html", { installedDevices })

                            }
                        });
                    }, 2000)



                    console.log(result)
                    console.log(result[0])
                }
            });
        });
    });
}