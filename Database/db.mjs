import mongoose from "mongoose"

export const connect = (url) => {
    mongoose.connect(url).then(() => {
        console.log("Auth database connected")
    }).catch(err => {
        console.log("Error while connecting auth database: ",err.message)
    })
}