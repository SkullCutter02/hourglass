## HOURGLASS

#### Never miss a due date again!

Features include:

- Create tasks to remind yourself what you need to do
- Notification system that reminds you when your tasks are due. Works when the app is closed!
- Collaboration with other people on the same project

### Technologies this project used:

- TypeScript: Because what sane person doesn't use TypeScript?
- Docker: Great way to host the backend and the frontend together with easy deployment
- Docker Compose: Using Docker in development easily  
- Travis CI: For deploying to Elastic Beanstalk
- AWS: Elastic Beanstalk for the website, RDS for postgres and EC for redis
- Nginx: For redirecting /api requests to the backend

#### Frontend:

- React: My favourite JS framework!
- NextJS: My personal favourite way of creating React sites. NextJS offers easy routing and a bunch of other features!
- React Query: Awesome tool for fetching data from the backend. Reduces the need to use useEffects and useStates to fetch data
- Recoil: I frankly only used Recoil on one occasion to try out state management outside of Context. Not very useful in this project as I could've just used Context, but I can see some potential in this library
- Date-Fns: If you're using MomentJS, please switch to this library
- LinkifyJS: For linkifying links in task descriptions
- React-Select: I'm too lazy to implement a Select Component myself lol
- React-Color: Same as React-Select
- Material-UI DatePickers: Also goes into the "I'm too lazy to do this so I'll just use a library"
- FortAwesome: FontAwesome but in React

#### Backend:

- Express: Quite powerful and simple NodeJS framework
- PostgreSQL: For storing data
- Redis: For caching data
- TypeORM: NodeJS ORMs kinda suck, but this one is the best one  
- Argon2: A better alternative to bcrypt, caused me some "exec share format error" problems with docker-compose though. If you know how to fix please tell me thanks
- JsonWebToken: Authenticating purposes. I store the JWT token in an HttpOnly cookie
- Yup: Schema creation for API requests. Also provides type checks for req.body through yup's TypeOf method
- Nodemailer: Sending emails for users who've forgotten their passwords
- Sendgrid: Email provider, integrates with Nodemailer quite well
- WebPush: For sending notifications in the backend
- Node-Schedule: It's like cron but for node. It also allows to pass in a date instead of a cron object, which works perfectly for my app