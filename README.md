# ThinkTank 🧠💡

**An interactive, gamified puzzle and trivia platform built with Next.js.**

ThinkTank challenges users with domain-specific puzzles, tracking their points, lives, and ranking them on a global leaderboard. It is a full-stack web application designed to demonstrate modern web development practices, secure authentication, and relational database modeling.

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)

## ✨ Features

* **🧩 Domain-Specific Puzzles:** Solve questions across various domains with different difficulty levels (EASY, MEDIUM, HARD).
* **🎮 Gamified Progression:** Users earn points for correct answers but lose 'lives' for incorrect ones, creating an engaging learning loop.
* **🏆 Global Leaderboard:** Compare your score against other players in real-time.
* **🔐 Secure Authentication:** Fully integrated `NextAuth` providing both Credentials (Email/Password with bcrypt hashing) and OAuth provider support.
* **🛡️ Admin Dashboard:** A dedicated, role-protected admin panel to manage domains, puzzles, and users.
* **📱 Responsive UI:** Styled beautifully from the ground up using Tailwind CSS for a seamless desktop and mobile experience.

## 🛠️ Tech Stack

* **Frontend:** Next.js (App Router), React, Tailwind CSS, Lucide React (Icons)
* **Backend:** Next.js API Routes, Node.js
* **Database:** MySQL
* **ORM:** Prisma Client
* **Authentication:** NextAuth.js

## 🗄️ Database Schema Overview

The application utilizes a relational database mapped via Prisma with the following core models:
* **User & Session Models:** Handles secure login, tracking `points`, `lives`, and `role`.
* **Domain:** Categorizes puzzles into specific topics or fields.
* **Puzzle:** Contains the `question`, `answer`, `hint`, `difficulty`, and dynamic JSON `metadata` for flexible question types.

## 🚀 Getting Started

### Prerequisites
* Node.js (v18 or higher)
* A running instance of MySQL

### Installation

1. **Clone the repository:**
   \`\`\`bash
   git clone https://github.com/meghana922007/ThinkTank.git
   cd ThinkTank
   \`\`\`

2. **Install dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

3. **Environment Setup:**
   Create a `.env` file in the root directory and add the following variables:
   \`\`\`env
   DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"
   NEXTAUTH_SECRET="your_super_secret_string"
   NEXTAUTH_URL="http://localhost:3000"
   \`\`\`

4. **Database Migration:**
   Generate the Prisma client and push the schema to your MySQL database:
   \`\`\`bash
   npx prisma generate
   npx prisma db push
   \`\`\`

5. **Run the Development Server:**
   \`\`\`bash
   npm run dev
   \`\`\`
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the application!

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page.
