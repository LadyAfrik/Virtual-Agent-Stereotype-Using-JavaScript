# Virtual Agent Stereotype Project

This project is a full‑stack application that integrates a React frontend, a Django backend (serving dashboard and REST APIs), and a Spring Boot backend (handling authentication, survey processing, and business logic). The application enables users to register, log in, watch agent videos, complete a survey (with gender identification and ranking), and view statistical analyses of their responses.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Technologies and Frameworks](#technologies-and-frameworks)
- [Project Structure](#project-structure)
- [Setup and Installation](#setup-and-installation)
  - [React Frontend](#react-frontend)
  - [Django Backend](#django-backend)
  - [Spring Boot Backend](#spring-boot-backend)
- [Running the Application](#running-the-application)
- [Environment Variables and Secrets](#environment-variables-and-secrets)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## Project Overview

This project aims to study virtual agent stereotypes by allowing users to interact with various virtual agent videos (e.g., Male, Female, Androgynous) and provide feedback via a dual survey process:
- **Gender Identification:** Users indicate the perceived gender of each agent.
- **Ranking:** Users rank the agents on several attributes (e.g., compassion, intelligence).

Additional functionality includes a statistical analysis dashboard that uses tests such as the Kruskal-Wallis and Friedman tests. Interpretations of these tests are provided through an integrated OpenAI API.

Key features:
- **User Authentication & Registration:** Secure login and registration.
- **Interactive Video Experience:** Triggering a survey following agent video viewing.
- **Survey & Statistical Analysis:** Visualizing survey responses and demographics.
- **Data Download Options:** Ability to download CSV reports of users, attribute rankings, and gender selections.

---

## Technologies and Frameworks

- **Frontend (React):**
  - React with functional components and hooks (e.g., `useEffect`, `useState`)
  - React Router for navigation
  - Tailwind CSS for styling
  - Framer Motion for animations

- **Backend (Django):**
  - Django REST Framework for API endpoints and dashboard template rendering
  - Models for Users, Attribute Rankings, and Gender Selections
  - Integration with OpenAI API for advanced statistical interpretation

- **Backend (Spring Boot):**
  - Java Spring Boot for authentication and survey processing
  - JPA/Hibernate for ORM and MySQL for data persistence
  - JWT-based security

- **Others:**
  - P5.js to display and run code written in the Processing language within the web environment. 
  - Chart.js for data visualizations
  - Jest and React Testing Library for frontend unit testing

---

## Project Structure

## 📁 Project Structure

There are three main folders:

1. **React Frontend**: Located in the `frontend` directory  
2. **Spring Boot Backend**: Located in the `demo` directory  
3. **Django Backend**: Located in the `django-backend` directory  

---

### 🧩 React Folder Structure (`frontend`)

```
frontend/
├── node_modules/
├── public/
├── src/
│   ├── components/
│   │   ├── Modal.jsx
│   │   ├── ProcessingGun.jsx
│   │   ├── ProcessingHeart.jsx
│   │   └── ProcessingSketch.jsx
│   ├── pages/
│   │   ├── Dashboard.js
│   │   ├── DashboardContent.js
│   │   ├── Login.js
│   │   ├── RankingGender.js
│   │   ├── RankingPage.js
│   │   ├── Register.js
│   │   ├── SortableItem.js
│   │   └── VideoPage.js
│   ├── App.css
│   ├── App.js
│   ├── App.test.js
│   ├── AuthService.js
│   ├── index.css
│   ├── index.js
│   ├── logo.svg
│   ├── input.css
│   ├── reportWebVitals.js
│   └── setupTests.js
├── .gitignore
├── package.json
├── package-lock.json
├── tailwind.config.js
└── README.md
```

---

### 🚀 Spring Boot Folder (`demo`)

This folder contains the Spring Boot backend project. It manages REST APIs, data persistence, and token-based authentication using Java and Spring Security.

```
demo/
├── src/
│   └── main/
│       ├── java/
│       │   └── com/
│       │       └── example/
│       │           └── demo/
│       │               ├── controller/
│       │               │   ├── AttributeRankingController.java
│       │               │   ├── AuthController.java
│       │               │   ├── GenderSelectionController.java
│       │               │   └── UserController.java
│       │               ├── security/
│       │               │   ├── CustomUserDetails.java
│       │               │   ├── CustomUserDetailsService.java
│       │               │   ├── JwtAuthenticationFilter.java
│       │               │   ├── JwtUtil.java
│       │               │   └── SecurityConfig.java
│       │               ├── AttributeRanking.java
│       │               ├── AttributeRankingRepository.java
│       │               ├── AttributeRankingService.java
│       │               ├── GenderSelection.java
│       │               ├── GenderSelectionRepository.java
│       │               ├── GenderSelectionService.java
│       │               ├── HelloController.java
│       │               ├── User.java
│       │               ├── UserController.java
│       │               └── UserRepository.java
│       │               ├── DemoApplication.java
│       │               └── classDiagram.puml
│       └── resources/
│           ├── application.properties
│           └── static/
├── pom.xml
└── README.md

```

---

### 🐍 Django Folder (`django-backend`)

This folder contains the Django backend for additional analysis tools or admin functionality.

```
django-backend/
├── .idea/
│   └── (project-specific settings and configurations)
├── dashboard/
│   ├── migrations/
│   │   ├── 0001_initial.py
│   │   ├── 0002_users_delete_user_alter_attributeranking_cr.py
│   │   └── __init__.py
│   ├── templates/
│   │   └── dashboard/
│   │       ├── dashboard.html
│   │       └── statistical_analysis.html
│   ├── __init__.py
│   ├── admin.py
│   ├── apps.py
│   ├── models.py
│   ├── serializers.py
│   ├── tests.py
│   ├── urls.py
│   ├── utils.py
│   └── views.py
├── dashboard_project/
│   ├── __init__.py
│   ├── asgi.py
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── env/
│   ├── Include/
│   ├── Lib/
│   │   └── site-packages/
│   ├── Scripts/
│   ├── .gitignore
│   └── pyvenv.cfg
├── .env
├── db.sqlite3
└── manage.py

```


---

## Setup and Installation

### React Frontend

1. **Navigate to the React folder:**
    Make sure you are inside the frontend folder and install all the necessary dependencies

   ```bash
   cd frontend

2. **Install dependencies:**
    ```bash
    npm install

3. **Start the development server:**
    ```bash
    npm start

The app will run on http://localhost:3000.




### Django Backend

1. **Navigate to the Django backend folder:**
    ```bash
    cd django-backend

2. **Create and activate a virtual environment:**
    ```bash
    python -m venv venv

    On Windows:
    venv\Scripts\activate

    On macOS/Linux:
    source venv/bin/activate

3. **Install dependencies:**
    ```bash
    pip install -r requirements.txt

4.  **Run database migrations:**
    ```bash
    python manage.py migrate

5. **Start the development server:**
    ```bash
    python manage.py runserver

The backend is available at http://localhost:8000.


### Spring Boot Backend

1. **Navigate to the Spring Boot folder:**
    ```bash
    cd demo

2. **Build the project using Maven:**
    ```bash
    mvn clean install

3. **Run the Spring Boot application:**
    ```bash
    mvn spring-boot:run

The server runs on http://localhost:8080 (or your configured port).


## Running the Application

- **React Frontend:** Visit [http://localhost:3000](http://localhost:3000).
- **Django Backend:** Dashboard pages are available:
  - Dashboard: `/dashboard/dashboard/`
  - Ranking Analysis: `/dashboard/ranking-analysis/`
- **Spring Boot Backend:** API endpoints are accessible:
  - `/auth/login`
  - `/auth/register`
  - Visit [http://localhost:8080](http://localhost:8080) for more.

---

## Environment Variables and Secrets

- **React:**
  - Use a `.env` file for sensitive configuration values.
  - Ensure the `.env` file is added to `.gitignore` to avoid accidental commits.

- **Django:**
  - The OpenAI API key is loaded using `python-decouple`.
  - Set the key in your `.env` file, which should also be excluded using `.gitignore`.

- **Spring Boot:**
  - Configure sensitive information (e.g., database credentials) in the `application.properties` file or through environment variables.

---

### Important:
Do not commit sensitive information (API keys, passwords, etc.) to version control under any circumstances.


## Testing

- **React Frontend Tests:** Run with:
  ```bash
  npm test



- **Django Tests:** Execute:
  ```bash
  python manage.py test 
 
- **Spring Boot Tests:** Run using Maven: 
  ```bash 
  mvn test



## Contributing

Contributions are welcome! If you’d like to contribute:
- Open an issue or submit a pull request.
- Follow the coding guidelines and ensure tests pass.

---

## License

This project is licensed under the [MIT License](LICENSE).

---

## Contact

For questions or further information, please contact:
- **Email:** [siatadv@sfu.ca](mailto:siatadv@sfu.ca)
- **Phone:** [+1 (778) 782-9748](tel:+17787829748)
