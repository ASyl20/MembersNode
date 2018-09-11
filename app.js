const express = require('express')
const morgan = require('morgan')
const config = require('./config')
const {success,error} = require('functions')
const bodyParser = require('body-parser')
const multer = require('multer')
const upload = multer()
const app = express()
const PORT = Number(process.env.PORT) || 3001


let MembersRouter = express.Router()

const members = [
    {
        id: 1,
        name: 'John'
    },
    {
        id: 2,
        name: 'Julie'
    },
    {
        id: 3,
        name: 'Jack'
    }
]

app.use(config.rootAPI+'members',MembersRouter)
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))


MembersRouter.route('/')

    // Ajout un membre
    .post(upload.array(),(req,res)=>{
        if (req.body.name ){
            var sameName = false 
            for(var i = 0; i <members.length; i++){
                if(members[i].name == req.body.name){
                    saleName= true
                    break
                    }
                }
                if(sameName ){
                    res.json(error('name already token'))

            }else{
                var member = {id : createID(), name:req.body.name}
                members.push(member)
                res.json(success(member))
            }
            }else{
                res.json(error('no name value'))
            }
    })

    // Récupère tout les membres
    .get((req,res)=>{
        if(req.query.max != undefined && req.query.max > 0){
            res.json(success(members.slice(0,req.query.max)))
            // start et end 0 - req.query.max
        }else if(req.query.max != undefined){
            res.json(error('Wrong max value'))
        }
        else{
            res.json(success(members))
        }
    })

MembersRouter.route('/:id')

    // Récupère un membre avec son id
    .get((req,res)=>{
        let index = getIndex(req.params.id)
        if(typeof(index) == 'string')
        {
            res.json(error(index))
        }else {
            res.json(success(members[index]))
        }
        res.json(success(members[req.params.id-1].name))
    })

    // Modifie un membre avec son id
    .put((req,res)=>{
        const id = getIndex(req.params.id)
        if(typeof(id) === 'string'){
            res.json(error(id))
        }
        else{
            const same = false
            for(var i = 0; i<members.length;i++){
                if(req.body.name ==members[i].name && req.params.id != members[i].id){
                    same = true
                    break
                }
            }
            if(same){
                res.json(error('same name'))
            }else{
                members[id].name = req.body.name
                res.json(success(true))
            }
        }
    })

    // Supprime un membre avec son id
    .delete((req,res)=>{
        let index = getIndex(req.params.id)

        if(typeof(index)==='string'){
            res.json(error(index))
        }else{
            members.splice(index,1)
            res.json(success(members))
        }
    })


app.listen(config.port,()=>console.log('Started on port '+config.port))

function getIndex(id){
    for(let i = 0; i< members.length; i++){
        if(members[i].id == id)
            return i
    }
    return 'wrong id'
}

function createID(){
    return members[members.length-1].id + 1
}