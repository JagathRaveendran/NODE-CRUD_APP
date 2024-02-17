
// v2 


const http = require('http');
const fs = require('fs');
const { URL } = require('url');
const queryString = require('querystring'); 
const { log } = require('console');
const port = 7000;

http.createServer((req, res) => {
    const { pathname, searchParams } = new URL(req.url, `http://${req.headers.host}`);

    if (pathname === '/') {
        fs.readFile('form.html', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/html' });
                res.end('Internal Server Error');
                return;
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(data);
            res.end();
        });
    } else if (pathname === '/index.html') {
        fs.readFile('index.html', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/html' });
                res.end('Internal Server Error');
                return;
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(data);
            res.end();
        });
    } else if (pathname === '/add') {
        fs.readFile('form.html', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/html' });
                res.end('Internal Server Error');
                return;
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(data);
            res.end();
        });
    // } else if (pathname === '/edit') {
    //     fs.readFile('update.html', (err, data) => {
    //         if (err) {
    //             res.writeHead(500, { 'Content-Type': 'text/html' });
    //             res.end('Internal Server Error');
    //             return;
    //         }
    //         res.writeHead(200, { 'Content-Type': 'text/html' });
    //         res.write(data);
    //         res.end();
    //     });


    // vvv del 

    }
    else if (pathname === '/delete' && req.method === 'POST') {
        let body = '';
        
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const id = new URLSearchParams(body).get('id');
            console.log('Received ID:', id); // Log the received ID
    
            if (!id) {
                res.writeHead(400, { 'Content-Type': 'text/html' });
                res.end('ID parameter is required for deletion.');
                return;
            }
    
            // Read the contents of details.json
            fs.readFile('details.json', 'utf8', (err, data) => {
                if (err) {
                    console.error('Error reading details.json:', err);
                    res.writeHead(500, { 'Content-Type': 'text/html' });
                    res.end('Internal Server Error');
                    return;
                }
    
                let detailsArray;
                try {
                    detailsArray = JSON.parse(data);
                } catch (parseError) {
                    console.error('Error parsing JSON:', parseError);
                    res.writeHead(500, { 'Content-Type': 'text/html' });
                    res.end('Internal Server Error');
                    return;
                }
    
                console.log('Original details:', detailsArray); // Log the original JSON data
    
                // Find the index of the item with the specified ID
                const index = detailsArray.findIndex(item => item.id === id);
    
                if (index === -1) {
                    // If the item with the specified ID is not found
                    console.error('Item with ID not found:', id);
                    res.writeHead(404, { 'Content-Type': 'text/html' });
                    res.end('Item not found.');
                    return;
                }
    
                // Remove the item from the array
                detailsArray.splice(index, 1);
    
                console.log('Updated details:', detailsArray); // Log the updated JSON data
    
                // Write the updated array back to details.json
                fs.writeFile('details.json', JSON.stringify(detailsArray, null, 2), 'utf8', (writeErr) => {
                    if (writeErr) {
                        console.error('Error writing to details.json:', writeErr);
                        res.writeHead(500, { 'Content-Type': 'text/html' });
                        res.end('Internal Server Error');
                        return;
                    }
    
                    console.log('Data deleted from details.json');
                    res.writeHead(302, { 'Location': '/index.html' });
                    res.end();
                });
            });
        });
    
    
    
    




    } else if (pathname === '/submit') {
        const userName = searchParams.get('Name');
        const userAge = searchParams.get('Age');
        const userEmail = searchParams.get('Email');
        const userPhone = searchParams.get('Phone');

        if (!userName || !userAge || !userEmail || !userPhone) {
            res.writeHead(400, { 'Content-Type': 'text/html' });
            res.end('All fields are required.');
            return;
        }

        const formData = {
            id: Date.now().toString(), // Generate unique ID
            name: userName,
            age: userAge,
            email: userEmail,
            phone: userPhone
        };

        fs.readFile('details.json', 'utf8', (err, data) => {
            if (err && err.code !== 'ENOENT') {
                console.error('Error reading details.json:', err);
                res.writeHead(500, { 'Content-Type': 'text/html' });
                res.end('Internal Server Error');
                return;
            }

            let detailsArray = [];
            if (data) {
                try {
                    detailsArray = JSON.parse(data);
                } catch (parseError) {
                    console.error('Error parsing JSON:', parseError);
                    res.writeHead(500, { 'Content-Type': 'text/html' });
                    res.end('Internal Server Error');
                    return;
                }
            }

            detailsArray.push(formData);

            fs.writeFile('details.json', JSON.stringify(detailsArray, null, 2), (writeErr) => {
                if (writeErr) {
                    console.error('Error writing to details.json:', writeErr);
                    res.writeHead(500, { 'Content-Type': 'text/html' });
                    res.end('Internal Server Error');
                    return;
                }

                console.log('Data written to details.json');
                res.writeHead(302, { 'Location': '/index.html' });
                res.end();
            });
        });
    }



// *************************edit start********************
// else if (req.method === 'POST' && req.url.startsWith('/edit')) {
//     let body = '';
//     req.on('data', chunk => {
//         body += chunk.toString();
//     });

//     req.on('end', () => {
//         const formData = queryString.parse(body);
        
//         // Check if formData has id property
//         if (!formData || !formData.id) {
//             res.writeHead(400, { 'Content-Type': 'text/plain' });
//             res.end('Bad Request: Missing or invalid ID');
//             return;
//         }

//         const entryId = formData.id;

//         const jsonFilePath = 'details.json';
//         fs.readFile(jsonFilePath, 'utf-8', (readError, data) => {
//             if (readError) {
//                 console.error(`Error reading JSON file: ${readError}`);
//                 res.writeHead(500, { 'Content-Type': 'text/plain' });
//                 res.end('Internal Server Error');
//                 return;
//             }

//             try {
//                 const jsonData = JSON.parse(data);
//                 const selectedEntry = jsonData.find(entry => entry.id === entryId);

//                 if (!selectedEntry) {
//                     res.writeHead(404, { 'Content-Type': 'text/plain' });
//                     res.end('Entry not found');
//                     return;
//                 }

//                 // Now you can render the edit form with the selected entry data
//                 fs.readFile('update.html', 'utf-8', (updateFileError, updateFileData) => {
//                     if (updateFileError) {
//                         console.error(`Error reading update.html file: ${updateFileError}`);
//                         res.writeHead(500, { 'Content-Type': 'text/plain' });
//                         res.end('Internal Server Error');
//                         return;
//                     }

//                     const editForm = updateFileData
//                         .replace('{{%name}}', selectedEntry.name)
//                         .replace('{{%phone}}', selectedEntry.phone)
//                         .replace('{{%age}}', selectedEntry.age)
//                         .replace('{{%email}}', selectedEntry.email)
//                         .replace('{{%id}}', selectedEntry.id);

//                     res.writeHead(200, { 'Content-Type': 'text/html' });
//                     res.end(editForm);
//                 });
//             } catch (error) {
//                 console.error(`Error parsing JSON: ${error}`);
//                 res.writeHead(500, { 'Content-Type': 'text/plain' });
//                 res.end(`Error parsing JSON: ${error.message}`);
//             }
//         });
//     });
// }








else if (req.method === 'POST' && req.url.startsWith('/edit')) {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', () => {
        const formData = queryString.parse(body);
        
        // Check if formData has id property
        if (!formData || !formData.id) {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end('Bad Request: Missing or invalid ID');
            return;
        }

        const entryId = formData.id;

        const jsonFilePath = 'details.json';
        fs.readFile(jsonFilePath, 'utf-8', (readError, data) => {
            if (readError) {
                console.error(`Error reading JSON file: ${readError}`);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
                return;
            }

            try {
                const jsonData = JSON.parse(data);
                const selectedEntry = jsonData.find(entry => entry.id === entryId);

                if (!selectedEntry) {
                    res.writeHead(404, { 'Content-Type': 'text/plain' });
                    res.end('Entry not found');
                    return;
                }  

                // Read the update HTML template
                fs.readFile('update.html', 'utf-8', (updateFileError, updateFileData) => {
                    if (updateFileError) {
                        console.error(`Error reading update.html file: ${updateFileError}`);
                        res.writeHead(500, { 'Content-Type': 'text/plain' });
                        res.end('Internal Server Error');
                        return;
                    }

                    // Replace placeholders in the HTML template with user data
                    const editForm = updateFileData
                        .replace('{{%name}}', selectedEntry.name)
                        .replace('{{%phone}}', selectedEntry.phone)
                        .replace('{{%age}}', selectedEntry.age)
                        .replace('{{%email}}', selectedEntry.email)
                        .replace('{{%id}}', selectedEntry.id);

                    // Send the updated HTML form with prefilled data to the client
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(editForm);
                });
            } catch (error) {
                console.error(`Error parsing JSON: ${error}`);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end(`Error parsing JSON: ${error.message}`);
            }
        });
    });
}


// ****************************************edit end ***************************

//***********************************************update************************




else if (pathname === '/update' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', () => {
        const formData = queryString.parse(body);
        
        // Check if formData has id property
        if (!formData || !formData.id) {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end('Bad Request: Missing or invalid ID');
            return;
        }

        const entryId = formData.id;
        console.log(entryId)

        const jsonFilePath = 'details.json';
        fs.readFile(jsonFilePath, 'utf-8', (readError, data) => {
            if (readError) {
                console.error(`Error reading JSON file: ${readError}`);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
                return;
            }

            try {
                const jsonData = JSON.parse(data);
                const selectedEntryIndex = jsonData.findIndex(entry => entry.id === entryId);
                // const selectedEntryIndex = jsonData.findIndex(entry => entry.id === entryId);

                // if (selectedEntryIndex === 1) {
                //     res.writeHead(404, { 'Content-Type': 'text/plain' });
                //     res.end('Entry not found');
                //     return;
                // }
                

                // // Update the selected entry with new form data
                // jsonData[selectedEntryIndex].name = formData.name;
                // jsonData[selectedEntryIndex].email = formData.email;
                // jsonData[selectedEntryIndex].age = formData.age;
                // jsonData[selectedEntryIndex].phone = formData.phone;

                if (selectedEntryIndex === -1) {
                    res.writeHead(404, { 'Content-Type': 'text/plain' });
                    res.end('Entry not found');
                    return;
                }
                
                // Ensure that the entry object exists before updating its properties
                if (!jsonData[selectedEntryIndex]) {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Internal Server Error: Entry object is undefined');
                    return;
                }
                
                // Update the selected entry with new form data
                jsonData[selectedEntryIndex].name = formData.name;
                jsonData[selectedEntryIndex].email = formData.email;
                jsonData[selectedEntryIndex].age = formData.age;
                jsonData[selectedEntryIndex].phone = formData.phone;
                // Write updated JSON data to file
                fs.writeFile(jsonFilePath, JSON.stringify(jsonData, null, 2), 'utf-8', (writeError) => {
                    if (writeError) {
                        console.error(`Error writing JSON file: ${writeError}`);
                        res.writeHead(500, { 'Content-Type': 'text/plain' });
                        res.end('Internal Server Error');
                        return;
                    }

                    // Redirect to index route after successful update
                    res.writeHead(302, { 'Location': '/index.html' });
                    res.end();
                });
            } catch (error) {
                console.error(`Error parsing JSON: ${error}`);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end(`Error parsing JSON: ${error.message}`);
            }
        });
    });
}





//**************************************************update end*****************************************  
  
  
//   else {
//     res.writeHead(200, { "Content-Type": "text/html" });
//     res.write(`<script>updateTable();</script>User added successfully`);
//     res.end();
//   }
  
//   });



     else if (pathname === '/details.json') {
        fs.readFile('details.json', 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/html' });
                res.end('Internal Server Error');
                return;
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.write(data);
            res.end();
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.write('error 404');
        res.end();
    }
}).listen(port, () => console.log(`Server is active, listening on port ${port}`));



// work  


