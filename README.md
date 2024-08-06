  <h3 align="center">Todo dApp</h3>
its a Todo list with two functions to update state "addTodo" and "complete todo". Its built with <a href = "https://github.com/tuler/deroll?_gl=1*1lc7xe5*_ga*MTc2NzA4NzE3MS4xNzIyNzEyOTM0*_ga_HM92STPNFJ*MTcyMjgyNDQ3NC4xMi4xLjE3MjI4MjUwNzEuNTMuMC4w*_gcl_au*ODAyMTI4ODY4LjE3MjI3MTI5MzQ."> deroll</a> deroll library 

# Getting Started
Below you'll find instructions on how setting up this dapp locally.

### Prerequisites
Here are some packages you need to have installed on your PC:

* [Node.js](https://nodejs.org/en), [npm](https://docs.npmjs.com/cli/v10/configuring-npm/install), [yarn](https://classic.yarnpkg.com/lang/en/docs/install/#debian-stable)

* [Docker](https://docs.docker.com/get-docker/)

* [Cartesi CLI](https://docs.cartesi.io/cartesi-rollups/1.3/development/migration/#install-cartesi-cli)
  ```sh
  npm install -g @cartesi/cli
  ```

### Installation

1. Clone this repo
   ```sh
   git clone https://github.com/OdionOseiwe/Cartessi-Todo-List
   ```
2. Install NPM packages
   ```sh
   yarn install
   ```
3. Build and run the dApp via `cartesi-cli`
   ```sh
   cartesi build
   ```
   and
   ```sh
   cartesi run
   ```
### Into the Backend

#### addAdvanceHandler


```js
description - create a new todo
```
sample
```json
{"method":"addTodo","name":"submit Cartesi to do before 11:59pm today"}
```
interact
    - *via `cartesi cli`*, access your terminal in another window and input these instructions below:
  
    ```sh
    cartesi send generic \
    --dapp=0xab7528bb862fb57e8a2bcd567a2e929a0be56a5e \
    --chain-id=31337 \
    --rpc-url=http://127.0.0.1:8545 \
    --mnemonic-passphrase="test test test test test test test test test test test junk" \
    --mnemonic-index=0 \
    --input='{"method":"addTodo","name":"submit Cartesi to do before 11:59pm today"}'
    ```

```js
description - deletetodo 
```
```json
{"method":"delete","id":1}
```

interact
    - *via `cartesi cli`*, access your terminal in another window and input these instructions below:
  
    ```
    cartesi send generic \
    --dapp=0xab7528bb862fb57e8a2bcd567a2e929a0be56a5e \
    --chain-id=31337 \
    --rpc-url=http://127.0.0.1:8545 \
    --mnemonic-passphrase="test test test test test test test test test test test junk" \
    --mnemonic-index=0 \
    --input='{"method":"delete","id":1}'
    ```


#### addInspectHandler

```js
description - NumberOfTodos 
```
interact with `curl` on your terminal

```sh
 curl http://localhost:8080/inspect/NumberOfTodos
```

```js
description - todos 
```
interact with `curl` on your terminal

```sh
 curl http://localhost:8080/inspect/todos
```



