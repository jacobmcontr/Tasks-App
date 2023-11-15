let { MongoClient } = require("mongodb")
let uri = "mongodb://0.0.0.0:27017"
let client = new MongoClient(uri)

let express = require("express")
let path = require("path")
let app = express()
let port = 7777

app.use(express.static("www"))
app.use(express.json())
app.listen(port, function () {
console.log(`Full-stack app is listening on port ${port}`)
})
app.get("/helloworld", function (req, res) {
    res.send("Hello World: Jacob Contreras")
})

app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "www", "index.html"));
});

app.get("/retrieve", function (req, res) {
    async function run() {
        try {
            await client.connect()
            database = client.db('Contreras')
            table = database.collection('Tasks')
            query = {}
            rows = await table.find(query)
            res.send(JSON.stringify(await rows.toArray()))
        } finally {
            await client.close()
        }
    }
    run()
})
app.get("/retrieve-one/:userid", function (req, res) {
    async function run() {
        try {
            await client.connect()
            database = client.db('Contreras')
            table = database.collection('Tasks')
            query = { userid: parseInt(req.params.userid) }
            row = await table.findOne(query)
            res.send(JSON.stringify(row))
        } finally {
            await client.close()
        }
    }
    run()
})
app.post("/create", function (req, res) {
    async function run() {
        try {
            await client.connect()
            database = client.db("Contreras")
            table = database.collection("Tasks")
            record = {
                userid: parseInt(req.body.userid),
                username: req.body.username,
                task: req.body.task,
                quantity: parseInt(req.body.quantity),
                userdate: new Date()
            }
            result = await table.insertOne(record)
            res.send(JSON.stringify(req.body)) // echo body
        } finally {
            await client.close()
        }
    }
    run()
})

app.delete("/delete/:userid", function (req, res) {
    async function run() {
        try {
            await client.connect()
            database = client.db("Contreras")
            table = database.collection("Tasks")
            query = { userid: parseInt(req.params.userid) }
            result = await table.deleteOne(query)
        } finally {
            await client.close()
        }
    }
    run()
})

app.put("/update", function (req, res) {
    async function run() {
        try {
            await client.connect()
            database = client.db("Contreras")
            table = database.collection("Tasks")
            where = { userid: parseInt(req.body.userid) }
            changes = {
                $set: {
                    username: req.body.username,
                    task: req.body.task,
                    quantity: parseInt(req.body.quantity)
                }
            }
            result = await table.updateOne(where, changes)
        } finally {
            await client.close()
        }
    }
    run()
})