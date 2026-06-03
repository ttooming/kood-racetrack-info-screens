# 🏁 Beachside Racetrack Info-Screens

Real-time race management and display system for racing events at Beachside Racetrack.

This application includes multiple user interfaces for race control, lap tracking, and public displays, all synchronized through a live server using WebSockets.

Done as **minimum viable product (MVP)**.

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

# 📝 Automated tests

**Jest** for checking and reassuring component's validitity.

Command for execution:

    npm test

 **Timer test:**

 - Timer should count down to 0

**SessionService tests:**

 - Should not allow duplicate name

 - Should add driver successfully

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

 ©

 # **Manual testing**: Racetrack Info Screens (team project)

## Overview

Performed structured testing using black-box, white-box and experience-based testing for a real-time event-driven system.

 Requirements: https://github.com/ttooming/kood-racetrack-info-screens/issues/3

**Developer focus:**
- I created backend server using Node.js
- I designed race state and its race serving functions
- I created timer logic with implmentation of saving/loading data

**QA focus:**
- I designed test strategy and test coverage
- I created test checklist for race lifecycle and edge cases
- I applied:
  - Boundary Value Analysis (BVA) 
  - Equivalence Partitioning (EP)
  - State transition testing
  - Checklist based testing
  - Error guessing
  - Unit testing as automated tests
- I tested:
  - driver/session input fields and dropdown menus 
  - race state transitions (**DANGER**(off) → **SAFE/HAZARD/DANGER** → **FINISH**)
  - timer edge cases (pause (with **DANGER**), resume (with **SAFE**), finish override, VSC restart, browser refresh)
  - Socket.IO real-time events
  - non-functional testing
- I performed manual end-to-end testing across roles (front desk, race control, lap tracker)

## Front Desk

<img width="1916" height="848" alt="Image" src="https://github.com/user-attachments/assets/6dc45bfd-5ce3-489d-bf04-e37adc4b3103" />

### EP and BVA

**Input: INPUT SESSION NAME**

Required: in order to successfully submit, "SESSION DATE" and "SESSION TIME" must be entered

<html xmlns:v="urn:schemas-microsoft-com:vml"
xmlns:o="urn:schemas-microsoft-com:office:office"
xmlns:x="urn:schemas-microsoft-com:office:excel"
xmlns="http://www.w3.org/TR/REC-html40">

<head>

<meta name=ProgId content=Excel.Sheet>
<meta name=Generator content="Microsoft Excel 15">
<link id=Main-File rel=Main-File
href="file:///C:/Users/37251/AppData/Local/Temp/msohtmlclip1/01/clip.htm">
<link rel=File-List
href="file:///C:/Users/37251/AppData/Local/Temp/msohtmlclip1/01/clip_filelist.xml">
<!--table
	{mso-displayed-decimal-separator:"\,";
	mso-displayed-thousand-separator:" ";}
@page
	{margin:.75in .7in .75in .7in;
	mso-header-margin:.3in;
	mso-footer-margin:.3in;}
tr
	{mso-height-source:auto;}
col
	{mso-width-source:auto;}
br
	{mso-data-placement:same-cell;}
td
	{padding-top:1px;
	padding-right:1px;
	padding-left:1px;
	mso-ignore:padding;
	color:black;
	font-size:11.0pt;
	font-weight:400;
	font-style:normal;
	text-decoration:none;
	font-family:Calibri, sans-serif;
	mso-font-charset:186;
	mso-number-format:General;
	text-align:general;
	vertical-align:bottom;
	border:none;
	mso-background-source:auto;
	mso-pattern:auto;
	mso-protection:locked visible;
	white-space:nowrap;
	mso-rotate:0;}
.xl65
	{color:windowtext;
	font-size:10.0pt;
	font-weight:700;
	font-family:Arial, sans-serif;
	mso-font-charset:186;
	mso-number-format:"\@";
	text-align:right;}
.xl66
	{color:windowtext;
	font-size:10.0pt;
	font-family:Arial, sans-serif;
	mso-font-charset:186;
	mso-number-format:"\@";
	text-align:left;}
.xl67
	{color:windowtext;
	font-size:10.0pt;
	font-weight:700;
	font-family:Arial, sans-serif;
	mso-font-charset:186;
	mso-number-format:"\@";
	text-align:left;}
.xl68
	{color:windowtext;
	font-size:10.0pt;
	font-family:Arial, sans-serif;
	mso-font-charset:186;
	mso-number-format:"\@";
	text-align:right;}
.xl69
	{mso-number-format:"\@";
	text-align:left;}
.xl70
	{color:#0563C1;
	text-decoration:underline;
	text-underline-style:single;
	mso-number-format:"\@";
	text-align:left;}
.xl71
	{color:blue;
	font-size:10.0pt;
	font-weight:700;
	text-decoration:underline;
	text-underline-style:single;
	font-family:Arial, sans-serif;
	mso-font-charset:186;
	mso-number-format:"\@";
	text-align:left;}
-->
</head>

<body link="#0563C1" vlink="#954F72">


Equivalent   Class | Type | Lowest value | Highest value | EP example | BVA-lowest1 | BVA-lowest2 | BVA-lowest3 | BVA-highest1 | BVA-highest2 | BVA-highest3 
-- | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- 
1.1 | number | 1 | 9999998 | 871271 | 0 | 1 | 2 | 9999997 | 9999998 | 9999999 
1.2 | email | aaa@aaa.aa | yyy@yyy.yy | info@ing.com | - | - | - | - | - | - 
1.3 | sentence | 1 word | 10 words | here ever after | - | - | - | - | - | - 
1.4 | alphanumeric | 1 ch. and 1 nr. | 10 ch. and 10 nr. | 123GTRacing001 | - | - | - | - | - | - 
1.5 | word | 2 characters | 10 characters | Ingmar | - | - | - | - | - | - 
1.6 | whitespace | " " | "                               " | "    " | - | - | - | - | - | - 

</body>

</html>

Test cases: 

- 1 → OK
- 871271 → OK
- 9999999 → OK
- info@ing.com → OK
- here ever after → OK
- 123GTRacing001 → OK
- Ingmar → OK
- "    " → Error

**Input: SESSION DATE**

State: valid "INPUT SESSION NAME" is entered

Required: input "SESSION TIME" should also be determined, together they cannot be in the past.


<html xmlns:v="urn:schemas-microsoft-com:vml"
xmlns:o="urn:schemas-microsoft-com:office:office"
xmlns:x="urn:schemas-microsoft-com:office:excel"
xmlns="http://www.w3.org/TR/REC-html40">

<head>

<meta name=ProgId content=Excel.Sheet>
<meta name=Generator content="Microsoft Excel 15">
<link id=Main-File rel=Main-File
href="file:///C:/Users/37251/AppData/Local/Temp/msohtmlclip1/01/clip.htm">
<link rel=File-List
href="file:///C:/Users/37251/AppData/Local/Temp/msohtmlclip1/01/clip_filelist.xml">
<!--table
	{mso-displayed-decimal-separator:"\,";
	mso-displayed-thousand-separator:" ";}
@page
	{margin:.75in .7in .75in .7in;
	mso-header-margin:.3in;
	mso-footer-margin:.3in;}
tr
	{mso-height-source:auto;}
col
	{mso-width-source:auto;}
br
	{mso-data-placement:same-cell;}
td
	{padding-top:1px;
	padding-right:1px;
	padding-left:1px;
	mso-ignore:padding;
	color:black;
	font-size:11.0pt;
	font-weight:400;
	font-style:normal;
	text-decoration:none;
	font-family:Calibri, sans-serif;
	mso-font-charset:186;
	mso-number-format:General;
	text-align:general;
	vertical-align:bottom;
	border:none;
	mso-background-source:auto;
	mso-pattern:auto;
	mso-protection:locked visible;
	white-space:nowrap;
	mso-rotate:0;}
.xl65
	{color:windowtext;
	font-size:10.0pt;
	font-weight:700;
	font-family:Arial, sans-serif;
	mso-font-charset:186;
	mso-number-format:"\@";
	text-align:right;}
.xl66
	{color:windowtext;
	font-size:10.0pt;
	font-family:Arial, sans-serif;
	mso-font-charset:186;
	mso-number-format:"\@";
	text-align:left;}
.xl67
	{color:windowtext;
	font-size:10.0pt;
	font-weight:700;
	font-family:Arial, sans-serif;
	mso-font-charset:186;
	mso-number-format:"\@";
	text-align:left;}
.xl68
	{color:windowtext;
	font-size:10.0pt;
	font-family:Arial, sans-serif;
	mso-font-charset:186;
	mso-number-format:"\@";
	text-align:right;}
.xl69
	{mso-number-format:"\@";
	text-align:left;}
.xl70
	{mso-number-format:"Short Date";}
.xl71
	{font-weight:700;
	mso-number-format:"Short Date";}
-->
</head>

<body link="#0563C1" vlink="#954F72">


Equivalent   Class | Type | Lowest value | Highest value | EP example | BVA-lowest1 | BVA-lowest2 | BVA-lowest3 | BVA-highest1 | BVA-highest2 | BVA-highest3 
-- | -- | -- | -- | -- | -- | -- | -- | -- | -- | --
1.1 | date | 02.01.1900 | 30.12.2099 | 25.10.2026 | 01.01.1900 | 02.01.1900 | 03.01.1900 | 29.12.2099 | 30.12.2099 | 31.12.2099

</body>

</html>

Test cases: 
- 25.10.2026 →  OK 
- 01.01.1900 → Error

**Input: SESSION TIME**

State: valid "INPUT SESSION NAME" and "SESSION DATE" are entered

Required:  "SESSION DATE" cannot be in the past.

<html xmlns:v="urn:schemas-microsoft-com:vml"
xmlns:o="urn:schemas-microsoft-com:office:office"
xmlns:x="urn:schemas-microsoft-com:office:excel"
xmlns="http://www.w3.org/TR/REC-html40">

<head>

<meta name=ProgId content=Excel.Sheet>
<meta name=Generator content="Microsoft Excel 15">
<link id=Main-File rel=Main-File
href="file:///C:/Users/37251/AppData/Local/Temp/msohtmlclip1/01/clip.htm">
<link rel=File-List
href="file:///C:/Users/37251/AppData/Local/Temp/msohtmlclip1/01/clip_filelist.xml">
<!--table
	{mso-displayed-decimal-separator:"\,";
	mso-displayed-thousand-separator:" ";}
@page
	{margin:.75in .7in .75in .7in;
	mso-header-margin:.3in;
	mso-footer-margin:.3in;}
tr
	{mso-height-source:auto;}
col
	{mso-width-source:auto;}
br
	{mso-data-placement:same-cell;}
td
	{padding-top:1px;
	padding-right:1px;
	padding-left:1px;
	mso-ignore:padding;
	color:black;
	font-size:11.0pt;
	font-weight:400;
	font-style:normal;
	text-decoration:none;
	font-family:Calibri, sans-serif;
	mso-font-charset:186;
	mso-number-format:General;
	text-align:general;
	vertical-align:bottom;
	border:none;
	mso-background-source:auto;
	mso-pattern:auto;
	mso-protection:locked visible;
	white-space:nowrap;
	mso-rotate:0;}
.xl65
	{color:windowtext;
	font-size:10.0pt;
	font-weight:700;
	font-family:Arial, sans-serif;
	mso-font-charset:186;
	mso-number-format:"\@";
	text-align:right;}
.xl66
	{color:windowtext;
	font-size:10.0pt;
	font-family:Arial, sans-serif;
	mso-font-charset:186;
	mso-number-format:"\@";
	text-align:left;}
.xl67
	{color:windowtext;
	font-size:10.0pt;
	font-weight:700;
	font-family:Arial, sans-serif;
	mso-font-charset:186;
	mso-number-format:"\@";
	text-align:left;}
.xl68
	{color:windowtext;
	font-size:10.0pt;
	font-family:Arial, sans-serif;
	mso-font-charset:186;
	mso-number-format:"\@";
	text-align:right;}
.xl69
	{mso-number-format:"Short Time";}
.xl70
	{font-weight:700;
	mso-number-format:"Short Time";}
-->
</head>

<body link="#0563C1" vlink="#954F72">

Equivalent Class | Type | Lowest value | Highest value | EP example | BVA-lowest1 | BVA-lowest2 | BVA-lowest3 | BVA-highest1 | BVA-highest2 | BVA-highest3
-- | -- | -- | -- | -- | -- | -- | -- | -- | -- | --
1.1 | time | 00:01 | 23:58 | 12:24 | 00:00 | 00:01 | 00:02 | 23:57 | 23:58 | 23:59

</body>

</html>

Test cases: (if current time is e.g. 09:00)
- 12:24 → OK
- 00:01 → Error
- 23:57 → OK

**Input: ENTER DRIVER NAME**

State: Session is registred

Required: Max. 10 characters, car number and session must be declared for conformation


<html xmlns:v="urn:schemas-microsoft-com:vml"
xmlns:o="urn:schemas-microsoft-com:office:office"
xmlns:x="urn:schemas-microsoft-com:office:excel"
xmlns="http://www.w3.org/TR/REC-html40">

<head>

<meta name=ProgId content=Excel.Sheet>
<meta name=Generator content="Microsoft Excel 15">
<link id=Main-File rel=Main-File
href="file:///C:/Users/37251/AppData/Local/Temp/msohtmlclip1/01/clip.htm">
<link rel=File-List
href="file:///C:/Users/37251/AppData/Local/Temp/msohtmlclip1/01/clip_filelist.xml">
<!--table
	{mso-displayed-decimal-separator:"\,";
	mso-displayed-thousand-separator:" ";}
@page
	{margin:.75in .7in .75in .7in;
	mso-header-margin:.3in;
	mso-footer-margin:.3in;}
tr
	{mso-height-source:auto;}
col
	{mso-width-source:auto;}
br
	{mso-data-placement:same-cell;}
td
	{padding-top:1px;
	padding-right:1px;
	padding-left:1px;
	mso-ignore:padding;
	color:black;
	font-size:11.0pt;
	font-weight:400;
	font-style:normal;
	text-decoration:none;
	font-family:Calibri, sans-serif;
	mso-font-charset:186;
	mso-number-format:General;
	text-align:general;
	vertical-align:bottom;
	border:none;
	mso-background-source:auto;
	mso-pattern:auto;
	mso-protection:locked visible;
	white-space:nowrap;
	mso-rotate:0;}
.xl65
	{color:windowtext;
	font-size:10.0pt;
	font-weight:700;
	font-family:Arial, sans-serif;
	mso-font-charset:186;
	mso-number-format:"\@";
	text-align:right;}
.xl66
	{color:windowtext;
	font-size:10.0pt;
	font-family:Arial, sans-serif;
	mso-font-charset:186;
	mso-number-format:"\@";
	text-align:left;}
.xl67
	{color:windowtext;
	font-size:10.0pt;
	font-weight:700;
	font-family:Arial, sans-serif;
	mso-font-charset:186;
	mso-number-format:"\@";
	text-align:left;}
.xl68
	{color:windowtext;
	font-size:10.0pt;
	font-family:Arial, sans-serif;
	mso-font-charset:186;
	mso-number-format:"\@";
	text-align:right;}
.xl69
	{mso-number-format:"\@";
	text-align:left;}
.xl70
	{color:#0563C1;
	text-decoration:underline;
	text-underline-style:single;
	mso-number-format:"\@";
	text-align:left;}
.xl71
	{color:blue;
	font-size:10.0pt;
	font-weight:700;
	text-decoration:underline;
	text-underline-style:single;
	font-family:Arial, sans-serif;
	mso-font-charset:186;
	mso-number-format:"\@";
	text-align:left;}
-->
</head>

<body link="#0563C1" vlink="#954F72">


Equivalent   Class | Type | Lowest value | Highest value | EP example | BVA-lowest1 | BVA-lowest2 | BVA-lowest3 | BVA-highest1 | BVA-highest2 | BVA-highest3
-- | -- | -- | -- | -- | -- | -- | -- | -- | -- | --
1.1 | number | 1 | 9999998 | 123 | 0 | 1 | 2 | 9999997 | 9999998 | 9999999
1.2 | email | aaa@aaa.aa | yyy@yyy.yy | info@ing.com | - | - | - | - | - | -
1.3 | sentence | 1 word | 10 words | one two three | - | - | - | - | - | -
1.4 | alphanumeric | 1 ch. and 1 nr. | 10 ch. and 10 nr. | 123GTRacing001 | - | - | - | - | - | -
1.5 | word | 2 characters | 10 characters | TimeMachine | - | - | - | - | - | -
1.6 | whitespace | " " | "                               " | "    " | - | - | - | - | - | -

</body>

</html>

Test cases:
- 2 → OK
- 123 → OK
- 9999999 → OK
- aaa@aaa.aa → OK
- one two three → Error
- 123GTRacing001 → Error
- TimeMachine → Error
- "    " → Error

**Input: CHOOSE CAR NUMBER**

State: Session is registred, numbers are selected from dropdown menu.

Required: Driver name and session must be declared for conformation

<html xmlns:v="urn:schemas-microsoft-com:vml"
xmlns:o="urn:schemas-microsoft-com:office:office"
xmlns:x="urn:schemas-microsoft-com:office:excel"
xmlns="http://www.w3.org/TR/REC-html40">

<head>

<meta name=ProgId content=Excel.Sheet>
<meta name=Generator content="Microsoft Excel 15">
<link id=Main-File rel=Main-File
href="file:///C:/Users/37251/AppData/Local/Temp/msohtmlclip1/01/clip.htm">
<link rel=File-List
href="file:///C:/Users/37251/AppData/Local/Temp/msohtmlclip1/01/clip_filelist.xml">
<!--table
	{mso-displayed-decimal-separator:"\,";
	mso-displayed-thousand-separator:" ";}
@page
	{margin:.75in .7in .75in .7in;
	mso-header-margin:.3in;
	mso-footer-margin:.3in;}
tr
	{mso-height-source:auto;}
col
	{mso-width-source:auto;}
br
	{mso-data-placement:same-cell;}
td
	{padding-top:1px;
	padding-right:1px;
	padding-left:1px;
	mso-ignore:padding;
	color:black;
	font-size:11.0pt;
	font-weight:400;
	font-style:normal;
	text-decoration:none;
	font-family:Calibri, sans-serif;
	mso-font-charset:186;
	mso-number-format:General;
	text-align:general;
	vertical-align:bottom;
	border:none;
	mso-background-source:auto;
	mso-pattern:auto;
	mso-protection:locked visible;
	white-space:nowrap;
	mso-rotate:0;}
.xl65
	{color:windowtext;
	font-size:10.0pt;
	font-weight:700;
	font-family:Arial, sans-serif;
	mso-font-charset:186;
	mso-number-format:"\@";
	text-align:right;}
.xl66
	{color:windowtext;
	font-size:10.0pt;
	font-family:Arial, sans-serif;
	mso-font-charset:186;
	mso-number-format:"\@";
	text-align:left;}
.xl67
	{mso-number-format:"\@";}
.xl68
	{color:windowtext;
	font-size:10.0pt;
	font-weight:700;
	font-family:Arial, sans-serif;
	mso-font-charset:186;
	mso-number-format:"\@";
	text-align:left;}
.xl69
	{color:windowtext;
	font-size:10.0pt;
	font-family:Arial, sans-serif;
	mso-font-charset:186;
	mso-number-format:"\@";
	text-align:right;}
.xl70
	{mso-number-format:"\@";
	text-align:left;}
.xl71
	{font-weight:700;
	mso-number-format:"\@";}
-->
</head>

<body link="#0563C1" vlink="#954F72">

Equivalent   Class | Type | Lowest value | Highest value | EP example | BVA-lowest1 | BVA-lowest2 | BVA-highest1 | BVA-highest2 | Expected result | Actual result
-- | -- | -- | -- | -- | -- | -- | -- | -- | -- | --
1.1 | cars | 1 | 8 | 6 | 1 | 2 | 7 | 8 | OK | OK

</body>

</html>

Test cases:
- 1 → OK
- 2 → OK
- 5 → OK
- 8 → OK

**Input: CHOOSE SESSION**

State: Sessions are registred, sessions can be selected from dropdown menu.

Required: Driver name and car number must be declared for conformation


<html xmlns:v="urn:schemas-microsoft-com:vml"
xmlns:o="urn:schemas-microsoft-com:office:office"
xmlns:x="urn:schemas-microsoft-com:office:excel"
xmlns="http://www.w3.org/TR/REC-html40">

<head>

<meta name=ProgId content=Excel.Sheet>
<meta name=Generator content="Microsoft Excel 15">
<link id=Main-File rel=Main-File
href="file:///C:/Users/37251/AppData/Local/Temp/msohtmlclip1/01/clip.htm">
<link rel=File-List
href="file:///C:/Users/37251/AppData/Local/Temp/msohtmlclip1/01/clip_filelist.xml">
<!--table
	{mso-displayed-decimal-separator:"\,";
	mso-displayed-thousand-separator:" ";}
@page
	{margin:.75in .7in .75in .7in;
	mso-header-margin:.3in;
	mso-footer-margin:.3in;}
tr
	{mso-height-source:auto;}
col
	{mso-width-source:auto;}
br
	{mso-data-placement:same-cell;}
td
	{padding-top:1px;
	padding-right:1px;
	padding-left:1px;
	mso-ignore:padding;
	color:black;
	font-size:11.0pt;
	font-weight:400;
	font-style:normal;
	text-decoration:none;
	font-family:Calibri, sans-serif;
	mso-font-charset:186;
	mso-number-format:General;
	text-align:general;
	vertical-align:bottom;
	border:none;
	mso-background-source:auto;
	mso-pattern:auto;
	mso-protection:locked visible;
	white-space:nowrap;
	mso-rotate:0;}
.xl65
	{color:windowtext;
	font-size:10.0pt;
	font-weight:700;
	font-family:Arial, sans-serif;
	mso-font-charset:186;
	mso-number-format:"\@";
	text-align:right;}
.xl66
	{color:windowtext;
	font-size:10.0pt;
	font-family:Arial, sans-serif;
	mso-font-charset:186;
	mso-number-format:"\@";
	text-align:left;}
.xl67
	{mso-number-format:"\@";}
.xl68
	{color:windowtext;
	font-size:10.0pt;
	font-weight:700;
	font-family:Arial, sans-serif;
	mso-font-charset:186;
	mso-number-format:"\@";
	text-align:left;}
.xl69
	{color:windowtext;
	font-size:10.0pt;
	font-family:Arial, sans-serif;
	mso-font-charset:186;
	mso-number-format:"\@";
	text-align:right;}
.xl70
	{mso-number-format:"\@";
	text-align:left;}
.xl71
	{font-weight:700;
	mso-number-format:"\@";}
-->
</head>

<body link="#0563C1" vlink="#954F72">


Equivalent   Class | Type | Lowest value | Highest value | EP example | BVA-lowest1 | BVA-lowest2 | BVA-highest1 | BVA-highest2 | Expected result | Actual result
-- | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- 
1.1 | session_name | session_name_1 | session_name_8 | session_name_4 | session_name_1 | session_name_1 + 1 | session_name_8 - 1 | session_name_8 | OK | OK

</body>

</html>

Test cases:

The values for sessions are the names inserted in input "INPUT SESSION NAME". Therefore they cannot be named exactly for this test, but cases would look like this:
- session_name_1 → OK
- session_name_4 → OK
- session_name_8 → OK 

### State testing

- State: DANGER (OFF)

  Required: Session inserted, driver "Mark" assigned to car '1'

  Event: change name → "Martin"

  Expected: interface allows naming "Mark" to "Martin"

  Actual: interface allows naming "Mark" to "Martin"



- State: SAFE

  Required: Session inserted, driver "Martin" assigned to car '1'

  Event: change name → "Oliver"

  Expected: interface doesn't allow naming "Martin" to "Oliver"

  Actual: interface doesn't allow naming "Martin" to "Oliver"


- State: FINISH

  Required: Session inserted, driver "Martin" assigned to car '1'

  Event: change name → "Oliver"

  Expected: interface doesn't allow naming "Martin" to "Oliver"

  Actual: interface doesn't allow naming "Martin" to "Oliver"


- State: DANGER (OFF)

  Required: Session inserted, driver "Martin" assigned to car '1'

  Event: delete → "Martin"

  Expected: interface allows deletion of "Martin"

  Actual: interface allows deletion of "Martin"


- State: SAFE

  Required: Session inserted, driver "Martin" assigned to car '1'

  Event:  delete → "Martin"

  Expected: interface doesn't allow deleting "Martin"

  Actual: interface doesn't allow deleting "Martin"


- State: FINISH

  Required: Session inserted, driver "Martin" assigned to car '1'

  Event: delete → "Martin"

  Expected: interface allows deletion of "Martin"

  Actual: interface allows deletion of "Martin"


## Race Control

### State transistion testing

<img width="1078" height="707" alt="Image" src="https://github.com/user-attachments/assets/6393d497-a566-4d59-9c81-aa52faf8c25b" />

<html xmlns:o="urn:schemas-microsoft-com:office:office"
xmlns:x="urn:schemas-microsoft-com:office:excel"
xmlns="http://www.w3.org/TR/REC-html40">

<head>

<meta name=ProgId content=Excel.Sheet>
<meta name=Generator content="Microsoft Excel 15">
<link id=Main-File rel=Main-File
href="file:///C:/Users/37251/AppData/Local/Temp/msohtmlclip1/01/clip.htm">
<link rel=File-List
href="file:///C:/Users/37251/AppData/Local/Temp/msohtmlclip1/01/clip_filelist.xml">
<!--table
	{mso-displayed-decimal-separator:"\,";
	mso-displayed-thousand-separator:" ";}
@page
	{margin:.75in .7in .75in .7in;
	mso-header-margin:.3in;
	mso-footer-margin:.3in;}
tr
	{mso-height-source:auto;}
col
	{mso-width-source:auto;}
br
	{mso-data-placement:same-cell;}
td
	{padding-top:1px;
	padding-right:1px;
	padding-left:1px;
	mso-ignore:padding;
	color:black;
	font-size:11.0pt;
	font-weight:400;
	font-style:normal;
	text-decoration:none;
	font-family:Calibri, sans-serif;
	mso-font-charset:186;
	mso-number-format:General;
	text-align:general;
	vertical-align:bottom;
	border:none;
	mso-background-source:auto;
	mso-pattern:auto;
	mso-protection:locked visible;
	white-space:nowrap;
	mso-rotate:0;}
.xl65
	{border:.5pt solid windowtext;}
.xl66
	{border-top:1.5pt solid windowtext;
	border-right:.5pt solid windowtext;
	border-bottom:.5pt solid windowtext;
	border-left:.5pt solid windowtext;}
.xl67
	{border-top:1.5pt solid windowtext;
	border-right:1.5pt solid windowtext;
	border-bottom:.5pt solid windowtext;
	border-left:.5pt solid windowtext;}
.xl68
	{border-top:.5pt solid windowtext;
	border-right:.5pt solid windowtext;
	border-bottom:.5pt solid windowtext;
	border-left:1.5pt solid windowtext;}
.xl69
	{border-top:.5pt solid windowtext;
	border-right:1.5pt solid windowtext;
	border-bottom:.5pt solid windowtext;
	border-left:.5pt solid windowtext;}
.xl70
	{border-top:.5pt solid windowtext;
	border-right:.5pt solid windowtext;
	border-bottom:1.5pt solid windowtext;
	border-left:.5pt solid windowtext;}
.xl71
	{border-top:.5pt solid windowtext;
	border-right:1.5pt solid windowtext;
	border-bottom:1.5pt solid windowtext;
	border-left:.5pt solid windowtext;}
.xl72
	{border-top:.5pt solid windowtext;
	border-right:.5pt solid windowtext;
	border-bottom:1.5pt solid windowtext;
	border-left:1.5pt solid windowtext;}
.xl73
	{border-top:1.5pt solid windowtext;
	border-right:.5pt solid windowtext;
	border-bottom:.5pt solid windowtext;
	border-left:1.5pt solid windowtext;
	mso-diagonal-down:.5pt solid windowtext;
	white-space:normal;}
-->
</head>

<body link="#0563C1" vlink="#954F72">


STATE (below)             Event (right)| Start Race | Safe | Hazard | Danger | Finish Race | End Race Session
-- | -- | -- | -- | -- | -- | --
DANGER (OFF) | SAFE | - | - | - | - | -
SAFE | - | - | HAZARD | DANGER | FINISH | -
HAZARD | - | SAFE | - | DANGER | FINISH | -
DANGER | - | SAFE | - | - | FINISH | -
FINISH | - | - | - | - | - | DANGER (OFF)

</body>

</html>

State coverage:

DANGER (OFF) → SAFE → HAZARD → DANGER → FINISH → DANGER (OFF)

Typical sequence: (states in UPPERCASE, transistions in lowercase)

DANGER (OFF) → Start Race → SAFE → Finish → FINISH → End Race Session → DANGER (OFF)

Valid transistion coverage:

DANGER (OFF) → Start Race → SAFE → Hazard → HAZARD → Finish → FINISH → End Race Sessions → DANGER (OFF) → Start Race → SAFE → Hazard → HAZARD → Danger → DANGER → Safe → SAFE → Hazard → HAZARD → Safe → SAFE → Danger → DANGER → Finish → FINISH → End Race Sessions → DANGER (OFF) → Start Race → SAFE → Finish → FINISH → End Race Session → DANGER (OFF)

**Test cases:**

Focuses on some of the important and technically difficult states being tested.

- State: SAFE

  #1

  Event: manual race-mode-change → FINISH 

  Expected: timer becomes 0, race mode changes to FINISH

  Actual: timer becomes 0, race mode changes to FINISH

  #2

  Event: server restart in Visual Studio Code while timer is running

  Expected: state remains the same, timer continues counting down

  Actual: state remains the same, timer continues counting down

  #3

  Event: brauser refresh  while timer is running

  Expected: state remains the same, timer continues counting down

  Actual: state remains the same, timer continues counting down


- State: DANGER

  #1

  Event: server restart in Visual Studio Code, timer is paused at x min x second

  Expected: state remains the same, timer is paused at that given moment

  Actual: state remains the same, timer is paused at that given moment

  #2

  Event: brauser refresh, timer is paused at x min x second

  Expected: state remains the same, timer is paused at that given moment

  Actual: state remains the same, timer is paused at that given moment


## End-to-end testing

### Front Desk

Create session → add drivers → edit driver → delete driver → delete session

### Race Control

Required: session is created

Start race → change mode: HAZARD → change mode: DANGER → change mode: SAFE → finish race → end race session 

Start race → change mode: HAZARD → finish race → end race session

Start race → change mode: DANGER → finish race → end race session

Start race → finish race → end race session


### Lap-Line Tracker

Required: session is created, minimum one driver added

<img width="1640" height="2197" alt="Image" src="https://github.com/user-attachments/assets/17bfc9ac-026d-449c-9d0c-2265bb0ef14e" />

Tap driver button during race → tap driver button after race has ended 

## Error hunting

Exploratory testing was carried out, which proved to be valueable for the desired expectations:

- Deletion of sessions with drivers
- Driver name must be unique within session
- Duplicate names not allowed after edit
- Same name in different, but not in the same session 
- Race mode displays their respective flag
- After browser refresh in FINISH mode, Lap-Line Tracker buttons are active, but won't function

Errors found were:

- Possibility to delete sessions with the same name, but with different times

  State: DANGER (OFF)

  Event: create sessions → "Race", 01/01/27, 00:00, "Race", 01/01/27, 01:00

  Event: remove session → "Race", 01/01/27, 01:00

  Expected: deletes session

  Actual: **deletes both sessions with the name "Race"**


- Session listing logic won't list sessions by ID in save file state.json

  Required: two previous sessions available

  "Race 1", 01/01/27, 00:00, ID 1 in state.json

  "Race 2", 01/01/27, 01:00, ID 2 in state.json



  Event: remove "Race 1", 01/01/27, 00:00 and then add again "Race 1", 01/01/27, 00:00

  Expected result: "Race 2", 01/01/27, 01:00 has ID 1 in state.json, new "Race", 01/01/27, 00:00 has ID 2 in state.json

  Actual result: **both have ID 2**


- Editing driver name can bypass 10 character limit

  Required: one session available, one driver added

  Event: edit driver name → "Max_Verstappen"

  Expected result: program displays an error warning

  Actual result: **programm accepts it**


## Timer - Deep Dive  ##

Race timer is required to work in two formats - when the app is started with "npm start", its runtime is 600 seconds and with "npm run dev", it is 60 seconds. Timer amount has to be displayed before the race is started. When the race is started, it countdowns to 0. "00:00" has to be displayed either if timer has reached zero or the button "FINISH" is pressed.

Because race mode "DANGER" included only that race cars must stop on track with no mention of timer's other functions, we decided to implement additional logic which pauses the timer during "DANGER" and continues it when "SAFE" is pressed.

### Risk assessment ###

Risk assessment helped us to consider and assess possible problems what that kind of a feature would bring.

<html xmlns:v="urn:schemas-microsoft-com:vml"
xmlns:o="urn:schemas-microsoft-com:office:office"
xmlns:x="urn:schemas-microsoft-com:office:excel"
xmlns="http://www.w3.org/TR/REC-html40">

<head>

<meta name=ProgId content=Excel.Sheet>
<meta name=Generator content="Microsoft Excel 15">
<link id=Main-File rel=Main-File
href="file:///C:/Users/37251/AppData/Local/Temp/msohtmlclip1/01/clip.htm">
<link rel=File-List
href="file:///C:/Users/37251/AppData/Local/Temp/msohtmlclip1/01/clip_filelist.xml">
<!--table
	{mso-displayed-decimal-separator:"\,";
	mso-displayed-thousand-separator:" ";}
@page
	{margin:.75in .7in .75in .7in;
	mso-header-margin:.3in;
	mso-footer-margin:.3in;}
tr
	{mso-height-source:auto;}
col
	{mso-width-source:auto;}
br
	{mso-data-placement:same-cell;}
td
	{padding-top:1px;
	padding-right:1px;
	padding-left:1px;
	mso-ignore:padding;
	color:black;
	font-size:11.0pt;
	font-weight:400;
	font-style:normal;
	text-decoration:none;
	font-family:Calibri, sans-serif;
	mso-font-charset:186;
	mso-number-format:General;
	text-align:general;
	vertical-align:bottom;
	border:none;
	mso-background-source:auto;
	mso-pattern:auto;
	mso-protection:locked visible;
	white-space:nowrap;
	mso-rotate:0;}
.xl65
	{border-top:.5pt solid windowtext;
	border-right:none;
	border-bottom:none;
	border-left:.5pt solid windowtext;}
.xl66
	{color:windowtext;
	font-size:10.0pt;
	font-weight:700;
	font-family:Arial, sans-serif;
	mso-font-charset:186;
	border:.5pt solid windowtext;}
.xl67
	{border-top:none;
	border-right:none;
	border-bottom:none;
	border-left:.5pt solid windowtext;}
.xl68
	{border-top:none;
	border-right:none;
	border-bottom:.5pt solid windowtext;
	border-left:none;}
.xl69
	{text-align:center;
	border-top:.5pt solid windowtext;
	border-right:none;
	border-bottom:none;
	border-left:none;}
.xl70
	{text-align:center;
	border-top:.5pt solid windowtext;
	border-right:.5pt solid windowtext;
	border-bottom:none;
	border-left:none;}
.xl71
	{text-align:center;}
.xl72
	{text-align:center;
	border-top:none;
	border-right:.5pt solid windowtext;
	border-bottom:none;
	border-left:none;}
.xl73
	{text-align:center;
	border-top:none;
	border-right:none;
	border-bottom:.5pt solid windowtext;
	border-left:none;}
.xl74
	{text-align:center;
	border-top:none;
	border-right:.5pt solid windowtext;
	border-bottom:.5pt solid windowtext;
	border-left:none;}
.xl75
	{color:windowtext;
	font-size:10.0pt;
	font-weight:700;
	font-family:Arial, sans-serif;
	mso-font-charset:186;
	text-align:center;
	border:.5pt solid windowtext;}
-->
</head>

<body link="#0563C1" vlink="#954F72">


Risk | Impact (0-10) | Likelihood   (0-10) | Riskscore
-- | -- | -- | --
Previous prematurely ended session timer continues with new session timer | 8 | 8 | 64
Browser restart will crash the timer logic | 6 | 8 | 48
Timer isn't resetted when "FINISH" is pressed | 6 | 8 | 48
Server restart will crash the timer logic | 6 | 6 | 36
Timer won't stop when race mode is "DANGER" | 6 | 5 | 30
Timer won't continue when race mode changes from "DANGER" to "SAFE" | 6 | 5 | 30
Timer won't start when race starts | 5 | 5 | 25
Timer won't show "00:00" when "FINISH" is pressed | 5 | 5 | 25
Timer won't change to default timer time when "End Race Session" is pressed | 6 | 4 | 24
Race mode won't change when countdown reaches 0 | 5 | 4 | 20
Wrong countdown time when opening the app | 5 | 1 | 5
</body>

</html>

Test cases:



- Required: two race sessions, first finished and ended in valid range: 0 – 60/600

  Event: starting new session

  Expected result: new session starts with "10:00" or with "01:00"

  Actual result: new session starts with "10:00" or with "01:00"



- Required: two race sessions, first finished with "npm start"

  Event: quitting and starting the app with "npm run dev"

  Expected result: new session starts with "01:00" instead of "10:00"

  Actual result: new session starts with "01:00" instead of "10:00"



- Required: two race sessions, first finished with "npm run dev"

  Event: quitting and starting the app with "npm start"

  Expected result: new session starts with "10:00" instead of "01:00"

  Actual result: new session starts with "10:00" instead of "01:00"



- Required: session is started and counting down

  Event: manually apply "FINISH"

  Expected result: timer becomes "00:00"

  Actual result: timer becomes "00:00"



- Required: session is started and counting down

  Event: timer counts to end

  Expected result: timer becomes "00:00"

  Actual result: timer becomes "00:00"


## Checklist based testing

For assuring that multible requirements can be checked in particular area in testing.


**Functional testing**

Does "Start New Race" change all screens/interfaces?

Does changing the mode applies in real-time?

Does the timer behave correctly?


**Security testing**


Does the app notify of missing access key(s) prior to starting the app?

Is there a delay in case of wrong access key?

Could Socket connect without a access key?

Does the app in case of wrong key prompt the user to enter a correct one?


**State transition testing**

"Start New Race" → does the mode switch to "SAFE"?

Does "Start New Race" enable race mode buttons?

Does "HAZARD" or "DANGER" change race mode and status?

"DANGER" → "SAFE" → does the mode change?

"FINISH" → cannot go back to SAFE/HAZARD/DANGER?

Timer becomes 0 → will "FINISH" lock automatically?

Does "FINISH" enable "End Race Session"?

Does "FINISH" disable Lap-Line Tracker buttons? *(Users are granted one final button press for finishing in FINISH mode)*

"End Race Session" → "Start New Race" is enabled when next session has drivers?


**Real-time testing**

Does each interface update itself after race mode is changed on one browser?

Does all browsers update itself after race mode is changed on 2-3 browsers?


**Non-functional testing**

Does "Fullscreen" button make spectator screens fullscreen?

Is interface "Race Control" correctly scalabled in mobile device?

Is interface "Lap-Line Tracker" correctly scalabled in tablet device?

Are "Race Control" and "Lap-Line Tracker" buttons correctly in the frame of their respective interfaces?

Are pop-up windows correctly in the frame of the screen?


**Edge cases**

"FINISH" is pressed before timer reaches 0 *(Requirements state that race can be ended by pressing "FINISH")*

Each driver's lap button is pressed while race mode is "Finish"

Server is restarted in the middle of the race

Browser is restarted in the middle of the race

Browser is restarted while race mode is in "DANGER"

Browser is restarted while race mode is in "FINISH"

Wrong access key


**Race Start**

Mode changes to "SAFE"

Timer starts?

Leaderboard changes from "Next" to "Current"?

Interface "Next Race" changes?

Interface "Race Control" mode buttons are enabled? 

**Race**

Lap buttons add one lap to driver?

Fastest lap is calculated and displayed?

Current lap is calculated and displayed?

Drivers are ordered by the fastest lap?

**Finish**

"FINISH" mode is enabled? 

Cannot be changed afterwards?

Are Lap-Line Tracker buttons disabled after first pressing?

**End Session**

Mode changes to "DANGER"?

Next session is displayed in "Race Control" user interface?

Interface "Next Race" changes?

## Summary

Testing effort proved to be extremly valuable and was beneficial. Timer needed the most time and complex testing because of the additional features we chose for perfecting the experience. We were praised by the team who we were reviewed by. Honorable mentions included domain knowledge, which helped us to design and program code with ease and vision. It was a great way to apply my knowledge for this project. Member of our team achieved #2 place in top 3 students and our project was recommedated for the graduation day presentation.
