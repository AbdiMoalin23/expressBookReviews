const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

// Initialize session for the "/customer" route
app.use("/customer", session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true
}));

// Authentication mechanism for routes under "/customer/auth/*"
app.use("/customer/auth/*", function auth(req, res, next) {
    // Check if the session contains authorization data
    if (req.session.authorization) {
        const token = req.session.authorization['accessToken'];
        
        // Verify the JWT token
        jwt.verify(token, "fingerprint_customer", (err, user) => {
            if (!err) {
                req.user = user; // Store decoded user data in request
                next(); // Proceed to the next middleware/route handler
            } else {
                return res.status(403).json({ message: "Invalid or expired token. Please log in again." });
            }
        });
    } else {
        return res.status(403).json({ message: "User not logged in or token not found." });
    }
});

const PORT = 5000;

// Route handlers
app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));
