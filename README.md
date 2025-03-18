# RG Customer Portal

This is a customer portal application built with React and Webpack.

## Screenshots

![Login Page](screenshot.png)

## Features

- Modern UI with responsive design
- Login form with validation
- Language selector
- Routing for signup and forgot password

## Setup and Installation

### Prerequisites

- Node.js (v14+ recommended)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd customer-portal
```

2. Install dependencies:
```bash
npm install
# or with yarn
yarn install
```

3. Start the development server:
```bash
npm start
# or with yarn
yarn start
```

4. Build for production:
```bash
npm run build
# or with yarn
yarn build
```

## Project Structure

```
customer-portal/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── LanguageSelector.js
│   │   ├── Logo.js
│   │   └── LoginForm.js
│   ├── pages/
│   │   ├── LoginPage.js
│   │   ├── SignUpPage.js
│   │   └── ForgotPasswordPage.js
│   ├── styles/
│   │   ├── global.css
│   │   ├── LanguageSelector.module.css
│   │   ├── LoginForm.module.css
│   │   ├── LoginPage.module.css
│   │   └── Logo.module.css
│   ├── App.js
│   └── index.js
├── webpack.config.js
├── package.json
└── README.md
```

## Technologies Used

- React
- React Router
- Webpack
- CSS Modules
- Babel
