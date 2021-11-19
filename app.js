// App.js

/*
    SETUP
*/
var express = require('express');   // We are using the express library for the web server
var app     = express();            // We need to instantiate an express object to interact with the server in our code
app.use(express.json())
app.use(express.urlencoded({extended: true}))
PORT        = 8269;                 // Set a port number at the top so it's easy to change in the future
var db = require('./database/db-connector')

var exphbs = require('express-handlebars');     // Import express-handlebars
app.engine('.hbs', exphbs({                     // Create an instance of the handlebars engine to process templates
    extname: ".hbs"
}));
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.



/*
    ROUTES
*/

// app.js

// app.js

app.get('/', function(req, res)
    {
        res.render('index');                    // Note the call to render() and not send(). Using render() ensures the templating engine
    });                                         // will process this file, before sending the finished HTML to the client.


// Route handler for BMP Facilities page
app.get('/Facilities', function(req, res)
    {
        // Query for retrieving Facilities data that will be displayed in a table
        let tableQuery = "SELECT bmpID, stAddress, city, state, zipCode, name, facilityTypeID FROM BMPFacilities";
        // Execute query on the database
        db.pool.query(tableQuery, function(error, rows, fields){
            // Render page with returned data after query completes
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            res.render('Facilities', {facilities: rows});
        })
    });

app.post('/Facilities', function(req, res) 
    {
        let insertQuery = "INSERT INTO BMPFacilities (stAddress, city, state, zipCode, name, facilityTypeID) VALUES (?,?,?,?,?,?)"
        let insertData = [req.body.stAddress, req.body.city, req.body.state, req.body.zipCode, req.body.facilityName, req.body.facilityTypeID]
        db.pool.query(insertQuery, insertData, function(error, rows, fields) {
            if(error) {
                res.write(JSON.stringify(error));
                res.end();
            }else {
                res.redirect('/Facilities')
            }
        }) 
    })


// Route handler for Facility Types page
app.get('/FacilityTypes', function(req, res)
    {
        let tableQuery = "SELECT facilityTypeID, facilityTypeName, facilityTypeDescription FROM FacilityTypes";
        db.pool.query(tableQuery, function(error, rows, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            res.render('FacilityTypes', {types: rows});
        })
    });
    
app.post('/FacilityTypes', function(req, res) 
    {
        let insertQuery = "INSERT INTO FacilityTypes (facilityTypeName, facilityTypeDescription) VALUES (?,?)"
        let insertData = [req.body.facilityName, req.body.descriptionName]
        db.pool.query(insertQuery, insertData, function(error, rows, fields) {
            if(error) {
                res.write(JSON.stringify(error));
                res.end();
            }else {
                res.redirect('/FacilityTypes')
            }
        }) 
    })



// Route handler for Inspection Personnel page
app.get('/InspectionPersonnel', function(req, res)
    {
        let tableQuery = "SELECT bmpInspectionID, inspectorID FROM InspectionPersonnel";
        db.pool.query(tableQuery, function(error, rows, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            res.render('InspectionPersonnel', {relationships: rows});
        })
    });

app.post('/InspectionPersonnel', function(req, res)
    {
        let tableQuery = "INSERT INTO InspectionPersonnel (bmpInspectionID, inspectorID) VALUES (?, ?)";
        let insertData = [req.body.add-bmpID, req.body.add-inspectorID];
        db.pool.query(inserQuery, insertData, function(error, row, fields) {
            if(error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            else {
                res.redirect('/InspectionPersonnel')
            }
        })
    })

// Route handler for Inspections page
app.get('/Inspections', function(req, res)
    {
        let tableQuery = "SELECT BMPInspections.bmpInspectionID, BMPInspections.bmpID, BMPInspections.inspectionDate, Inspectors.name, BMPInspections.inspectEmbankment, BMPInspections.inspectErosion, BMPInspections.inspectSediment, BMPInspections.inspectPonding, BMPInspections.inspectVegetation, BMPInspections.inspectControlStructure, BMPInspections.inspectTrash, BMPInspections.overallFunction, BMPInspections.comments FROM BMPInspections JOIN InspectionPersonnel ON BMPInspections.bmpInspectionID = InspectionPersonnel.bmpInspectionID LEFT JOIN Inspectors ON InspectionPersonnel.inspectorID = Inspectors.inspectorID ORDER BY BMPInspections.bmpInspectionID";
        db.pool.query(tableQuery, function(error, rows, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            res.render('Inspections', {inspections: rows});
        })
    });

app.post('/Inspections', function(req, res)
    {
        let insertQuery1 = "INSERT INTO BMPInspections (bmpID, inspectionDate, inspectEmbankment, inspectErosion, inspectSediment, inspectPonding, inspectVegetation, inspectControlStructure, inspectTrash, overallFunction, comments) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        let insertData1 = [req.body.bmpID, req.body.inspectionDate, req.body.inspectEmbankment, req.body.inspectErosion, req.body.inspectSediment, req.body.inspectPonding, req.body.inspectVegetation, req.body.inspectControlStructure, req.body.inspectTrash, req.body.overallFunction, req.body.comments];
        let insertQuery2 = "INSERT INTO InspectionPersonnel (bmpInspectionID, inspectorID) VALUES ((SELECT MAX(bmpInspectionID) FROM BMPInspections ), ?)";
        let insertData2 = [req.body.bmpID, req.body.inspectorID];
        db.pool.query(insertQuery1, insertData1, function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                db.pool.query(insertQuery2, insertData2, function(error, results, fields){
                    if(error){
                        console.log(JSON.stringify(error))
                        res.write(JSON.stringify(error));
                        res.end();
                    }else{
                        res.redirect('/Inspections');
                    }
                });
            }
        });
    });

// Route handler for Inspectors page
app.get('/Inspectors', function(req, res)
    {
        let tableQuery = "SELECT inspectorID, name, office, phone, email FROM Inspectors";
        db.pool.query(tableQuery, function(error, rows, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            res.render('Inspectors', {inspectors: rows});
        })
    });

app.post('/Inspectors', function(req, res) 
    {
        let insertQuery = "INSERT INTO Inspectors (name, office, phone, email) VALUES (?,?,?,?)"
        let insertData = [req.body.inspectorName, req.body.officeNumber, req.body.phoneNumber, req.body.email]
        db.pool.query(insertQuery, insertData, function(error, rows, fields) {
            if(error) {
                res.write(JSON.stringify(error));
                res.end();
            }else {
                res.redirect('/Inspectors')
            }
        }) 
    })



// Route handler for Maintenance Records page
app.get('/MaintenanceRecords', function(req, res)
    {
        let tableQuery = "SELECT maintenanceID, bmpID, maintenanceDate, performedBy, description FROM MaintenanceRecords";
        db.pool.query(tableQuery, function(error, rows, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            res.render('MaintenanceRecords', {records: rows});
        })
    });

app.post('/MaintenanceRecords', function(req, res) 
    {
        let insertQuery = "INSERT INTO MaintenanceRecords (bmpID, maintenanceDate, performedBy, description) VALUES (?,?,?,?)"
        let insertData = [req.body.bmpId, req.body.maintenanceDate, req.body.performedBy, req.body.description]
        db.pool.query(insertQuery, insertData, function(error, rows, fields) {
            if(error) {
                res.write(JSON.stringify(error));
                res.end();
            }else {
                res.redirect('/MaintenanceRecords')
            }
        }) 
    })


// Route handler for resource not found
app.use(function(req,res)
    {
        res.status(404);
        res.render('404');
    });

// Route handler for internal server error
app.use(function(err, req, res, next)
    {
        console.error(err.stack);
        res.status(500);
        res.render('500');
    });
  

// Route handler for internal server error
app.use(function(err, req, res, next)
    {
        console.error(err.stack);
        res.status(500);
        res.render('500');
    });
  

/*
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});
