# Sound-cloud-clone

This app has AWS storage setup to upload a song and album posters.
Create new bucket on AWS and add the bucketname, accesskey and secret key in .env file.

#### Clone this repo.
 * git push https://github.com/parth610/react-project.git
#### Install dependencies from the root directory.
 * npm install
#### Create a Postgresql user with CREATEDB and PASSWORD.
 * CREATE USER <name> WITH CREATEDB PASSWORD <’password’>
#### Create a .env file in the backend directory based on the .env.example that will be found in the backend directory.
#### Enter the username, password, database name, your generated JWT_SECRET code.
#### Add the proxy to package.json file in frontend directory, you can replace to your choice of localhost port.
 * “Proxy”: “http://localhost:5000”
#### Now, create, migrate and seed database using sequlize.
* npx dotenv sequelize db:create
* npx dotenv sequelize db:migrate
* npx dotenv sequelize db:seed:all
#### Run npm start in the backend and frontend directory in a separate terminal.
#### You can use Demo-user to navigate through the site or you can create your own user.
