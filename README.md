PROJECT OVERVIEW

EstateConnect is a full-featured real estate marketplace built on the MERN stack, which includes MongoDB, Express, React, and Node.js. The platform serves as a complete bridge between property sellers and potential buyers. It also includes a powerful administrative panel to oversee all platform activity.

The application supports three distinct user roles. Buyers can browse properties, apply advanced filters, save listings to a personal wishlist, and communicate directly with sellers. Sellers have full control over their property listings, including adding, updating, and deleting properties, as well as managing incoming messages from interested buyers. Administrators maintain platform quality by managing users and moderating all property submissions.

CORE FEATURES

For Buyers
Buyers can search for properties using a dynamic price range slider, location filters, and property type selectors. Every property detail page includes high-resolution images, full specifications, and a map view. The wishlist feature allows buyers to save their favorite properties for future reference. When a buyer finds a suitable property, they can instantly send a message to the seller using the built-in real-time chat system.

For Sellers
Sellers have a dedicated dashboard to manage their listings. They can add new properties with multiple images, update prices and descriptions, and remove sold properties. The dashboard also shows view counts for each listing and organizes all incoming chat messages from buyers in one place. Sellers can reply to messages in real time.

For Administrators
The admin panel provides complete oversight of the ecosystem. Administrators can view all registered users, promote buyers to seller status, and suspend accounts if necessary. All property listings pass through a moderation queue where admins can approve or reject submissions to ensure they meet platform guidelines.

General Platform Capabilities
The entire application uses secure JWT authentication with role-based access control. The user interface is fully responsive and works seamlessly on mobile phones, tablets, and desktop computers. Real-time messaging is powered by Socket.IO, ensuring that all chat messages are delivered instantly and stored permanently in the database.

TECHNOLOGY STACK

The frontend is built with React.js and uses React Router for navigation. State management across authentication, wishlist items, and search filters is handled by Redux Toolkit. Styling is implemented with Tailwind CSS and Material-UI components. All API requests from the frontend are managed using Axios.

The backend runs on Node.js with the Express.js framework. The database is MongoDB with Mongoose as the object data modeling library. User authentication is secured using JSON Web Tokens and Bcryptjs for password hashing. File uploads for property images are processed through Multer and stored on Cloudinary. Real-time communication is implemented with Socket.IO on both the server and client sides.

PREREQUISITES

Before you begin, ensure that your development environment includes Node.js version 16 or higher, npm or yarn as your package manager, and a MongoDB instance. This can be a local installation or a cloud-based cluster from MongoDB Atlas. You will also need a Cloudinary account to enable image uploads.

INSTALLATION AND SETUP

Start by cloning the repository to your local machine.

Move into the project folder and navigate to the backend directory. Install all required dependencies using npm. Create a .env file inside the backend folder and define the following environment variables: the server port, your MongoDB connection string, a secret key for JWT signing, and your Cloudinary credentials including cloud name, API key, and API secret. Once this is complete, start the backend server in development mode.

Next, move to the frontend directory and install the frontend dependencies. Create a .env file inside the frontend folder and set the base API URL to point to your local backend address. Also define the Socket.IO connection URL. Finally, start the React development server.

After both servers are running, the application will be accessible at the local frontend address and all API calls will be directed to the backend address.

PROJECT STRUCTURE

The repository is divided into two main folders: backend and frontend.

Inside the backend folder, the models directory contains the schema definitions for users, properties, wishlists, and messages. The controllers hold all the business logic for handling requests. The routes define the API endpoints and link them to the appropriate controllers. Middleware functions handle authentication, file uploads, and error processing. The server.js file is the entry point of the application and also configures the Socket.IO server.

Inside the frontend folder, the src directory contains components, pages, redux slices, and socket configuration. The pages are further organized by user role, with separate dashboards for buyers, sellers, and administrators. The redux folder manages global state slices for authentication, wishlist items, and search filter parameters.

API ENDPOINT OVERVIEW

The authentication endpoints support user registration and login. Property endpoints allow retrieval of all listings, creation of new properties, and updates or deletions for existing ones. The search and filter functionality is handled through query parameters on the property retrieval endpoint, which accepts city, minimum price, maximum price, and property type.

Wishlist endpoints provide the ability to fetch saved properties, add a property to the wishlist, and remove a property from the wishlist. Messaging endpoints retrieve conversation history for a specific property and allow sending new messages. Administrative endpoints are protected by role-based middleware and enable user management and property status moderation.

REAL-TIME MESSAGING

The chat system is built using Socket.IO. When a buyer clicks the contact seller button on a property detail page, the application joins a unique room associated with that property and the seller. Any message sent by either party is instantly delivered to the other user without requiring a page refresh. All messages are simultaneously saved to the Message collection in MongoDB to maintain a complete chat history.

CONTRIBUTING

This project welcomes contributions from the community. To contribute, start by forking the repository. Create a new branch for your feature or bug fix. Make your changes and commit them with a clear description. Push your branch to your fork and submit a pull request. All contributions will be reviewed and considered for inclusion in the main codebase.
