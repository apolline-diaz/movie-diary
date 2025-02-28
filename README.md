# Movie Diary

**Movie Diary** is a web platform for cataloging LGBT films from the 90s and 2000s, developed to provide a community-driven database. Users can search for films using advanced filters, view detailed movie pages, create accounts, and contribute by adding films or creating their own private movie lists.

## 🚀 Main Features

- **Homepage**: General overview of the site with thematic movies list.
- **Catalogue with Advanced Search**: View of all the movies with recents adding. Filter films by various criteria (genre, year, director, keyword, etc.).
- **Detailed Movie Pages**: Complete information (title, synopsis, director, etc.).
- **User Dashboard**:
  - Account creation and login.
  - Add films to the database.
  - Create personal movie lists (visible only to the user).
- **Community Database**: Open contributions to enrich the content.

## 🛠️ Technologies Used

- **Frontend Framework**: [Next.js](https://nextjs.org/)
- **Backend and ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI**: [Tailwind CSS](https://tailwindcss.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **Authentication and Storage**: [Supabase](https://supabase.io/)
- **Containerization**: [Docker](https://www.docker.com/)
- **Tests**: [Playwright](https://playwright.dev/)

## 📦 Installation and Local Setup

### Prerequisites

- [Node.js](https://nodejs.org/)
- [Docker](https://www.docker.com/)

### Installation Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/movie-diary.git
   cd movie-diary
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure environment variables:

   Create a `.env.local` file at the root of the project and add the required variables (example in `.env.example`).

4. Run the project with Docker:

   ```bash
   docker-compose up
   ```

5. Access the site:

   The project will be available at [http://localhost:3000](http://localhost:3000).

## 📂 Project Structure

```plaintext
├── lists/               # Lists pages (content view, creation, edit)
├── movies/              # Movies pages (content view, edit, contribute)
├── profile/             # Profile user's page
├── components/          #
├── server-actions/      # Movies (add), lists (add)
├── pages/               # Next.js pages
├── utils/               # Utility functions
├── db/                  # Drizzle configuration and database models
├── public/              # Public files (images, icons, etc.)
├── tests/               # Tests with Playwright
├── docker-compose.yml   # Docker configuration
└── README.md            # Documentation
```

## 🗃️ Database

The database schema is managed with **Drizzle ORM** and stored in **PostgreSQL**. Migrations are not yet automated and versioned. Below is an overview of the main tables:

- `users`: User management.
- `movies`: Film catalog.
- `lists`: User-created personal lists.

### 🌟 Note

This project is developed as part of the RNCP Application Developer certification program.
