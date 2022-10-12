
// node src/app.js --p "8080" --m "CLUSTER" 

import express                  from "express";
import  minimist                from "minimist";
import os                       from 'os';
import cluster                  from 'node:cluster';
import { random }               from './routes/random.js'
import { Console } from "console";



const args = process.argv.slice(2);
if(args.length == 0) {
  process.exit; 
}

let options = {alias :{p: "puerto", m: "modo"} };
const param = minimist(args,options);
const PORT = param.puerto || 8080
const MODE = param.modo   || "FORK"

const numCPUs = os.cpus().length;
const numCPUsJson = {Numero_Procesadores: os.cpus().length,
	                 Puerto_escucha: PORT };

const server_info = {
	arguments: process.argv.slice(2),
	os: process.env.os,
	node_version: process.versions.node,
	memory_usage: process.memoryUsage().rss,
	exec_path: process.execPath,
	process_id: process.pid,
	current_working_directory: process.cwd(),
};

if (MODE === "CLUSTER" && cluster.isPrimary) {
 
	console.log(`PID MASTER ${process.pid}`)
 
	for (let i = 0; i < numCPUs-1; i++) {
		cluster.fork()
	}
 

	cluster.on('exit', worker => {
		console.log('Worker', worker.process.pid, 'died', new Date().toLocaleString())
		cluster.fork()
	})

} else {
	const app = express()
	app.use(express.json())
	
	
	
	app.use("/api/randoms", random);	  
	
	app.get("/info//", (req, res) => {
		res.json(numCPUsJson);
	});

	app.listen(PORT, () => {
		console.log(`Servidor express escuchando en el puerto ${PORT}`);
		console.log(`PID WORKER ${process.pid}`)
	})
 }

 
 

/*

const path = require("path");
const session = require("express-session");

require("dotenv").config(".env");
const parse = require("yargs/yargs");
const process = require("process");


const  cluster = require("cluster"); 
const  os = require( "os");



const numCPUs = os.cpus().length;
const argumentos = parse(process.argv.slice(2));
const { port, mode, _ } = argumentos
	.boolean("debug")
	.alias({
		//m: "mode",
		p: "port",
		// d: 'debug'
	})
	.default({
		//mode: "FORK",
		port: 8080,
		// debug: false
	}).argv;

/* MASTER ---------------------------------------*/
/*
if (mode === "CLUSTER" && cluster.isPrimary) cluster_mode();

function cluster_mode() {
	console.log(numCPUs);
	console.log(`PID MASTER ${process.pid}`);

	for (let i = 0; i < numCPUs; i++) {
		cluster.fork();
	}

	cluster.on("exit", (worker) => {
		console.log("Worker", worker.process.pid, "died", new Date().toLocaleString());
		cluster.fork();
	});

	return false;
}

const server_info = {
  arguments: process.argv.slice(2),
  os: process.env.os,
  node_version: process.versions.node,
  memory_usage: process.memoryUsage().rss,
  exec_path: process.execPath,
  process_id: process.pid,
  current_working_directory: process.cwd(),
};

const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

app.set("view engine", "handlebars");

// eslint-disable-next-line no-undef
app.set("views", path.join(__dirname + "/public/views"));

app.engine("handlebars", exphbs.engine());

app.use(express.json());
app.use(express.urlencoded({ extend: true }));

// eslint-disable-next-line no-undef
app.use(express.static(__dirname + "/public"));

app.use(
  session({
    store: MongoStore,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use("/", require("./src/routes/login"));
app.use("/api/randoms", require("./src/routes/random"));

app.get("/info", (req, res) => {
  res.json(server_info);
});

*/
