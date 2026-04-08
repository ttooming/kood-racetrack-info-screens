# Info-screens

    
## 1. Setup

### Node.js and npm

Make sure, you have **Node.js** and **npm** already installed.

For Node.js, insert in terminal:

    node -v

For npm, insert in terminal:

    npm -v

If you see the following, e.g for Node.js :

    v20.11.0 

or for npm:

    1.2.3
    
you are all set. If not, head out to **Troubleshooting** down below.

### cross-env

For accessing development environment, please insert in terminal:

    npm install cross-env

### ngrok

For accessing the program on several devices, please install **ngrok** in terminal:


    npm install -g ngrok

## 2. Launching the program

### Real-time multi-device connection

For accessing the program on the Web, insert in terminal:

    ngrok http 3000


That generates an address, e.g:

**https://abc123.ngrok.io**

### Access control

Before starting the program, passwords are needed for granting the permission for employee's interfaces. There are:

**Receptionist**: receptionist_key

**Lap-line Observer**: observer_key

**Safety Official**: safety_key

Passwords are 8 character length numbers and low-case letters. Declare passwords by exporting them in the terminal, e.g:

    export receptionist_key=8ded6076
    export observer_key=662e0f6c
    export safety_key=a2d393bc

### Enviroment mode

For continuing in production mode, add right after the keys in the terminal:

    npm start

For continuing in development mode, add in the terminal:

    npm run dev

# x. Troubleshooting 
