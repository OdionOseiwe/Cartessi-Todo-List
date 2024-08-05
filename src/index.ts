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
app.addAdvanceHandler(async ({ metadata, payload }) => {
    let todo;
    try {
        const jsonpayload = JSON.parse(hexToString(payload));
        if (jsonpayload.method === "addTodo") {
          console.log("adding todo");
          let presentId = id;
          todo= {
            id: presentId,
            nameOfTodo:jsonpayload.name,
            completed:false
          }
          console.log("all todos b4",AllTodo);
          AllTodo.push(todo);
          console.log("all todos after",AllTodo);
          
          id+=1;
          console.log("id after",id);

          await app.createNotice({payload:stringToHex(String(todo))});
          
          return "accept";
        }else if(jsonpayload.method === "completeTodo"){
            console.log("deleting todo");
            let _id = hexToString(jsonpayload.id);
            if(AllTodo[Number(_id)].completed === false){
                AllTodo[Number(_id)]={
                    id:0,
                    nameOfTodo:"",
                    completed:true
                }
                return "accept"
            }else{
                await app.createReport({ payload: stringToHex("could not delete todo") });
            }
           
        }
    } catch (e) {
        await app.createReport({ payload: stringToHex(String(e)) });
        return "reject";
    }
});

app.addInspectHandler(async (data) => {
  const payload = data["payload"];
  console.log(payload);
  const route = hexToString(payload);

  if (route === "totalTodo") {
    app.createReport({payload:stringToHex(String(id))})
  }else if(route === "todos"){
    app.createReport({payload:stringToHex(String(AllTodo))})
  }else{
    app.createReport({payload:stringToHex("route not implemented")})
  }

});

// start app
app.start().catch((e) => {
  console.log(e);
  process.exit(1);
});
