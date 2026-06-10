# Goal Tracker Dashboard

Developed by: Farzana

## Project Overview

Goal Tracker Dashboard is a React web application that helps users create goals, track progress, monitor streaks, earn XP, and manage achievements. The application supports multiple languages with RTL/LTR switching and provides a responsive user experience for desktop and mobile devices.

## Technologies Used

* React
* Vite
* TypeScript
* TanStack Router
* Tailwind CSS
* Recharts
* LocalStorage

## Features Checklist

### Dashboard

* [x] Overall completion percentage
* [x] Active goals summary
* [x] Completed goals summary
* [x] XP tracking
* [x] Streak tracking
* [x] Progress charts
* [x] Achievement badges

### Goal Management

* [x] Create goal
* [x] View goals
* [x] Edit goal
* [x] Delete goal
* [x] Pause/Resume goal
* [x] Mark goal progress

### Categories

* [x] Category overview
* [x] Category statistics
* [x] Progress visualization

### Settings

* [x] Language switch
* [x] RTL/LTR support
* [x] Theme settings

### Data Persistence

* [x] LocalStorage support

## XP Rules

* Each progress entry grants 20 XP.
* Completing a goal grants additional XP.
* XP contributes to user level progression.

## Streak Rules

* A streak increases when progress is logged on consecutive days.
* Missing a day resets the streak.
* Longest streak is stored and displayed on the dashboard.

## RTL / LTR Support

The application supports English and Arabic/Persian.

* English → Left-to-Right (LTR)
* Arabic/Persian → Right-to-Left (RTL)

The layout direction changes automatically when the language is switched.

## How to Run

1. Clone the repository
2. Install dependencies

npm install

3. Start development server

npm run dev

4. Open the provided local URL in your browser

## Screenshots

### Dashboard
![Dashboard](./screenshots/dashboard.png)

### Goals Page
![Goals](./screenshots/goals.png)

### Categories Page
![Categories](./screenshots/categories.png)

### Settings Page
![Settings](./screenshots/settings.png)


## Author

Farzana
Week 6 Assignment – Goal Tracker Dashboard
