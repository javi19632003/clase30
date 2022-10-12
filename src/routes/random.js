
import { Router }  from  "express";
import * as path   from 'path'
import { fork }     from "child_process";

const random = new Router();

random.get("/", (req, res) => {

  const child = fork(
      path.resolve(process.cwd(), "./src/controller/randomC.js")
    );
    child.send(1);
    child.on("message", (msg) => {
      res.json({ numeros: msg });
    });
  });

  export {random};

