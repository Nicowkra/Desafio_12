import express from 'express'
import  parseArgs  from "minimist";
import 'dotenv/config'
import {fork} from "child_process"

const router = express.Router()
const child = fork("./childs/apiChild.js")


router.get("/randoms",(req,res)=>{
    const value = req.query.cant
if (value){
    const parentNumber = Number(value)
    child.send(parentNumber)
}else{child.send(100000000)}
child.on("message",childMsj=>{
    const send ={
        pid: process.pid,
        values : childMsj
    }   
    res.send(send)
})



})



export default router