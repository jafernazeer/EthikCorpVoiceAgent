# EthikCorpVoiceAgent

Live dashboard for the EthikCorp EC Calling Agent.

## Features

- Home dashboard with voice-agent analytics.
- Conversation timeline with call transcript examples.
- Lead management table for customer details collected from calls.
- Test Call console and floating phone widget connected to the EC Calling Agent via the Vapi browser SDK.

## Local Setup

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

## Build

```bash
npm run build
```

The call test uses a browser public key and assistant ID in `src/main.jsx`; no server-side credentials are required for local dashboard test calls.
