# 🏁 Beachside Racetrack Info-Screens

Real-time race management and display system for racing events at Beachside Racetrack.

This application includes multiple user interfaces for race control, lap tracking, and public displays, all synchronized through a live server using WebSockets.

---

# 🧠 System Overview

The system is built around a central **race state**, which is shared in real-time with all connected clients using Socket.IO.

All interfaces (admin + public) stay synchronized automatically.

# 🚀 Getting Started

## 1. Install dependencies

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
    
you are all set. If not, enter in terminal:

    npm install

### cross-env

For accessing development environment, install **cross-env** in terminal:

    npm install cross-env

### dotenv

For multi-device access through Websocket, install **dotenv** in terminal:

    npm install dotenv

### ngrok

For accessing the program on several devices, install **ngrok** in terminal:

    npm install @ngrok/ngrok

## 2. Start the server

### Passwords

Before starting the program, passwords are needed for granting the permission for employee's interfaces.

Passwords are 8 character length numbers and low-case letters:

**Receptionist**: 8ded6076

**Lap-line Observer**: 662e0f6c

**Safety Official**: a2d393bc

Declare passwords by exporting them in the terminal, e.g for **Mac/Linux**:
```
export receptionist_key=8ded6076
export observer_key=662e0f6c
export safety_key=a2d393bc
```

or for **cmd/PowerShell**:

```
$env:RECEPTIONIST_KEY="8ded6076"
$env:OBSERVER_KEY="662e0f6c"
$env:SAFETY_KEY="a2d393bc"
```

For continuing in production mode, add right after the keys in the terminal:

    npm start

For continuing in development mode, add in the terminal:

    npm run dev

## 3. Open in browser

By default, insert in terminal:

    http://localhost:3000

For accessing the program using **ngrok**, insert in terminal:

    ngrok http 3000

An address will be generated, e.g:

**https://abc123.ngrok.io**

# 🧭 User Interfaces Guide

## 🔐 Employee Interfaces

Accessible from the main menu (login may be required).

## 🎛️ Race Control (`/race-control`)

Main control panel for managing the race.

**Features:**

 - Start a new race session

 - Change race mode:

    - 🟢 Safe (Green)

    - 🟡 Hazard (Yellow)

    - 🔴 Danger (Red)

    - 🏁 Finish

 - End current session

 - View active drivers

 - Live session timer

## 🏎️ Lap Tracker (`/lap-line-tracker`)

Used for recording laps in real-time.

**Features:**

 - Register laps per car number

 - Updates leaderboard instantly

## 🧾 Front Desk (`/front-desk`)

Session and driver management.

**Features:**

 - **Create new race sessions**
    - *Required:* session name, date, time.
 
 - **Remove race sessions**
    - *Required:* session name, date, time.

 - **Add drivers**
    - *Required:* session name, driver name, car number.

 - **Edit drivers names**
    - *Required:* session name, driver name, car number.
 
 - **Remove drivers**
    - *Required:* session name, driver name.

 - **Assign car numbers**

# 🌍 Public Interfaces

Accessible without login. Designed for display screens with full screen capability.

## 📊 Leaderboard (`/leader-board`)

Live race standings.

**Displays:**

 - Position

 - Driver name

 - Car number

 - Lap count

 - Last lap time

 - Best lap time
 
 - Current race status (SAFE / DANGER / etc.)

## ⏭️ Next Race (`/next-race`)

Shows upcoming session and drivers.

## ⏱️ Race Countdown (`/race-countdown`)

Displays countdown timer before race start.

## 🚦 Race Flags (`/race-flags`)

Full-screen display of current race status:

 - Green / Yellow / Red / Finish

# 🔄 Real-Time Behavior
 - All interfaces update automatically via WebSockets

 - Refreshing a page restores the latest race state

 - Race timer resumes correctly if session is active

 - When race is finished, timer resets to 00:00

# 📁 Project Structure (simplified)
```
/public
  /race-control
  /leader-board
  /lap-line-tracker
  /front-desk
  ...

/services
  raceService.js
  lapService.js
  sessionService.js

server.js
state.json
```
# ⚙️ Key Concepts
## 🧩 raceState

Central object stored in `state.json`:

 - currentSession

 - raceMode
 
 - timer
 
 - drivers

 - laps

Used by all interfaces.

# 🔌 Socket Events

Examples:

 - `receiveRaceState` → full UI sync

 - `startRace`

 - `changeRaceMode`

 - `lapTracked`

 - `finishRace`

# ⚠️ Notes

 - Only one race session can be active at a time

 - Timer is controlled server-side

 - UI state depends entirely on raceState

# 🛠️ Troubleshooting 
**Q**: Command "npm run dev" does not run on my Mac/Linux device?

**A**: Edit the following line in `package.json`:
    
    "scripts": {
    "start": "node server.js",
    "dev": "cross-env NODE_ENV=development node server.js"

to:


    "scripts": {
    "start": "node server.js",
    "dev": "NODE_ENV=development node server.js"

# 🏁 Summary

 - This system provides a complete real-time race management solution with:

 - Centralized state management

 - Multiple synchronized interfaces

 - Mobile-friendly UI

 - Live race control and tracking