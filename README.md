# NodeJsAuth
## 🚀 Get Started

1. **Install dependencies.**

   ```sh
   # install the dependencies
   npm install 
   ```
2. **Setup docker and postgres.**
   
   ```sh
   # docker image >> 
   $ docker pull postgres:alpine
   ```
   ```sh
   # 1-start a postgres >>
   $ docker run --name postgres-0 -e POSTGRES_PASSWORD=mysecretpassword -d -p 5432:5432 postgres:alpine
   ```
   ```sh
   # 2-get inside container >>
   $ docker exec -it postgres-0 bash
   ```
   ```sh
   # 3-start a postgres >>
   $ docker exec -it postgres-0 psql -U postgres
   ```
   ```sh
   # 4-create database user >>
   postgres=# CREATE USER arda WITH PASSWORD 'password' CREATEDB
   
                                       List of roles
    Role name |                         Attributes                         | Member of
   -----------+------------------------------------------------------------+-----------
    arda      | Create DB                                                  | {}
    postgres  | Superuser, Create role, Create DB, Replication, Bypass RLS | {}
   ```
   
3. **Start developing.**

   ```sh
   # "start": "nodemon app.ts",
   npm run start
   ```
4. **Open the source code and start editing!**

   Your site is now running at `http://localhost:3000`!
   <br>Pages:
   `http://localhost:3000/users/login`<br>
   `http://localhost:3000/users/register`<br>
   `http://localhost:3000/users/dashboard`


   Console: `Server Çalışıyor... port= 3000`

Docker-PostgreSQL-NodeJS-Express-TypeScript
