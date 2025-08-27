# Pagerduty Addressbook using Typescript and React

This project implements a client-side web app that can leverage the [Pagerduty API](https://developer.pagerduty.com/api-reference/c96e889522dd6-list-users) to find and display Users. This is not a complete application, but is a functional example that leverages the API and could be used with any valid Pagerduty API token.

## Features
- List all users associated with the account related to the provided API token
- Search users by name or id
- View user details including name, email, avatar, role, contact info, etc.
- Somewhat mobile friendly. :)

## Usage

Changes to the `main` branch of this repository are configured to automatically deploy to GitHub Pages. You can access the deployed app at: [https://animanmaster.github.io/pagerduty-addressbook](https://animanmaster.github.io/pagerduty-addressbook).

To run the application locally, follow these steps:

0. Make sure you have [Node.js](https://nodejs.org/) installed on your machine. This project was built using Node.js v22.17.0.
1. Clone the repository:
   ```bash
   git clone https://github.com/animanmaster/pagerduty-addressbook.git
   ```
2. Navigate to the project directory:
   ```bash
   cd pagerduty-addressbook
   ```
3. Install the dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Navigate to the URL in your browser to view the application. Any changes made to the source code will automatically reload the app.
