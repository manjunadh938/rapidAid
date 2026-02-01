🚑 RapidAid – Emergency Response Web App

RapidAid is a simple but powerful emergency response web application built to help people during critical situations. Our goal is to reduce the time it takes to inform family members and emergency services when someone is in danger.

In emergencies, every second matters — RapidAid is designed to make those seconds count.

❗ Problem We Noticed

During real-life emergencies:

1)A person may be injured or unconscious and unable to call for help

2)Family members are often informed too late

3)Ambulances struggle to find the exact location quickly

4)Bystanders usually don’t know proper first aid steps

5)Small delays can lead to serious consequences

We wanted to create a system that makes emergency help faster and smarter.

💡 Our Solution – RapidAid

RapidAid is designed to work with just one tap.

It provides:

🆘 Instant SOS alert

📍 Automatic live location sharing

💬 Emergency message sent via WhatsApp

🏥 Nearest hospital identification

🎤 Voice-based SOS trigger

🧠 On-screen first aid guidance

📞 Quick call to saved emergency contact

🚑 Direct call to ambulance (108)

🖥️ How the App Helps Users

The user enters their name and emergency phone number once — the app remembers it

When SOS is pressed, the app:

Gets live GPS location

Sends emergency details to the backend

Finds the nearest hospital

Sends a WhatsApp alert with location and hospital info

The screen switches to Emergency Mode to avoid accidental closing

A timer shows how long the emergency has been active

First aid instructions are available to help bystanders assist

⚙️ Technical Overview

Frontend

HTML, CSS, JavaScript

Mobile-friendly interface

Backend

Node.js with Express.js

Handles SOS requests and emergency tracking

Database

SQLite database stores emergency records

APIs Used

Geolocation API for live location

Web Speech API for voice SOS

WhatsApp deep linking for alerts

🌍 Deployment

The app is hosted online so it works on any device

Backend server runs continuously to store emergency data

The app can be installed like a mobile app (PWA)

It can also be converted into an Android APK

❤️ Real-Life Impact

RapidAid can be useful for:

Road accident victims

Elderly people living alone

Children in emergencies

People with medical conditions

Our main aim is to reduce emergency response time and help save lives.

▶️)How to Run Locally
npm install
node server.js

Then open:
http://localhost:3000
