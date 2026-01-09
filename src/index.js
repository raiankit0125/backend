// require('dotenv').config()
import dotenv from "dotenv"
import connectDB from "./db/index.js";


dotenv.config({
    path: './.env'
})


connectDB()





/*
import exprees from "express"
const app = exprees()

    (async () => {
        try {
            await mongoose.connect(`${process.env.MOMGODB_URI}/${DB_NAME}`)
            app.on("error", (error) => {
                console.log("ERRR", error);
                throw error
            })

            app.listen(process.env.PORT, () => {
                console.log(`App is listening on port ${process.env.PORT}`);
            })

        } catch (eroor) {
            console.log("ERROR: ", error)
            throw err
        }
    })()

*/