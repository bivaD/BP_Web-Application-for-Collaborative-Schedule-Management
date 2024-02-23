/**
 * @file server.ts
 * @description In this file is main script which starts app on port 3000.
 * @author David Novák
 * @created 9. March 2023
 * 
 * This code is part of a bachelor's thesis at the FIT BUT.
 */

import app from './App'
app.listen(3000, (err: any) => {
    if (err) return console.log(err)
    return console.log('Server is running in port: ', 3000);
})