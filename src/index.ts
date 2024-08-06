import { createApp } from "@deroll/app";
import { createWallet } from "@deroll/wallet";
import {hexToString, numberToHex, stringToHex } from "viem";

// create application
const app = createApp({
  url: process.env.ROLLUP_HTTP_SERVER_URL || "http://127.0.0.1:5004",
});

// This class handles all desposits, be it ether, ERC20 or NFTs
const wallet = createWallet();
app.addAdvanceHandler(wallet.handler);
interface Todo {
  id: number;            // or number, depending on the type of presentId
  nameOfTodo: string;
  completed: boolean;
}

let AllTodo:Todo[] = [];
let id:number = 0;



// log incoming advance request
app.addAdvanceHandler(async (data) => {
    let todo;
    try {
        const jsonpayload = JSON.parse(hexToString(data.payload));
        if (jsonpayload.method === "addTodo") {
          console.log("adding todo");
          let presentId = id;
          todo= {
            id: presentId,
            nameOfTodo:jsonpayload.name,
            completed:false
          }
          AllTodo.push(todo);
          console.log("all todos after",AllTodo);
          
          id+=1;
          console.log("id after",id);

          await app.createNotice({payload:stringToHex(String(todo))});
          
          return "accept";
        }else if(jsonpayload.method === "deletetodo"){ // when you delete todo you have completed it 
            console.log("deleting todo");
            let _id = hexToString(jsonpayload.id);
            const todoById = AllTodo.findIndex((todo) => todo.id === Number(_id)&& !todo.completed);
            if (todoById === -1) return false;
            AllTodo.splice(todoById, 1);
                await app.createReport({payload:stringToHex("deleted")});
                return "accept"
        }else{
                await app.createReport({ payload: stringToHex("Todo not found") });
        }
           
    } catch (e) {
        await app.createReport({ payload: stringToHex(String(e)) });
        return "reject";
    }
});

app.addInspectHandler(async (data) => {
  const payload = data["payload"];
  const splited = payload.split("/");
  const route = splited[0]; 
  if (route === "numberOfTodos") {
    app.createReport({payload:stringToHex(String(id))})
  }else if(route === "todos"){
    app.createReport({payload:stringToHex(String(AllTodo))})
  }else if(route === "id"){
    const id = parseInt(String(splited.at(-1)));
    let todo = AllTodo.find((todo)=> todo.id === id);
    app.createReport({payload:stringToHex(String(todo))})
  }
  else{
    app.createReport({payload:stringToHex("bad request")})
  }

});

// start app
app.start().catch((e) => {
  console.log(e);
  process.exit(1);
});
