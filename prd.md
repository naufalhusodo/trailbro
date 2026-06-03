# Product Requirements Document — SimBrake AI Trainer

## Overview
SimBrake is a single-page web application designed to help sim racers practice and improve their trail braking technique through real-time hardware input reading, structured drills, challenge modes, and AI-powered coaching feedback.

## Target Users
- Sim racers of all skill levels (beginner to advanced)
- Users with USB gamepads, racing wheels, and/or standalone pedal sets

## Goals
- Provide a focused, loop-based trail braking pressure drill
- Give real-time visual feedback through input traces and telemetry
- Offer a challenge mode where users match a target brake graph
- Deliver AI-generated coaching feedback and adaptive drill planning via Gemini API

## Non-Goals
- Not a full simracing telemetry suite
- Not a game or simulation — training tool only
- No backend server or user accounts in v1

## Success Metrics
- User can complete a full drill session with hardware input detected
- Consistency score improves over a session
- AI debrief produces relevant, specific feedback based on session data
- Challenge mode scoring feels fair and readable