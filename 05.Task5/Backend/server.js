import { server } from "./src/app.js";
import { connect } from "./src/database/db.js";






server.listen(3000, ()=>{
    connect()
    console.log("App is running on port 3000")
})