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

let AllTodo:any = [];
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
          await app.createNotice({payload:stringToHex(String(todo))});
          console.log("all todos b4",AllTodo);
          AllTodo.push(todo);
          console.log("all todos after",AllTodo);
          
          id = id +1;
          console.log("id after",id);
          
          return presentId;
        }else if(jsonpayload.method === "completeTodo"){
            console.log("deleting todo");
            let id = hexToString(jsonpayload.id);
            if(AllTodo[Number(id)].completed === false){
                AllTodo[Number(id)]={
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
    app.createReport({payload:numberToHex(id)})
  }else if(route === "todos"){
    app.createReport({payload:stringToHex(AllTodo)})
  }else{
    app.createReport({payload:stringToHex("route not implemented")})
  }

});

// start app
app.start().catch((e) => {
  console.log(e);
  process.exit(1);
});
