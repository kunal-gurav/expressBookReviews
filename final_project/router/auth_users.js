const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
    //write code to check is the username is valid
    let usersWithsameName = users.filter((user) => {
        return user.username === username;
    });
    if (usersWithsameName.length > 0) {
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username, password) => { //returns boolean
    //write code to check if username and password match the one we have in records.
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password)
    });

    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    //Write your code here
    //return res.status(300).json({ message: "Yet to be implemented" });
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

    if (authenticatedUser(username, password)) {
        //Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });

        //Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }

        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    //Write your code here
    //return res.status(300).json({ message: "Yet to be implemented" });

    const ISBN = req.params.isbn;
    const review = req.body.review;

    //if review test was not provied
    if (!review) {
        return res.status(400).json({ message: "Review is required" });
    }

    //username stored from login session
    const username = req.session.authorization.username;

    //If no username found in session
    if (!username) {
        return res.status(401).json({ message: "User not logged in" });
    }

    //If book doesn't exit
    if (!books[ISBN]) {
        return res.status(404).json({ message: "Book not found" });
    }

    //Add or update review
    books[ISBN].reviews[username] = review;

    return res.status(200).json({
        message: "Review added / Updated sucessfully",
        review: books[ISBN].reviews
    });
});

//Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const ISBN = req.params.isbn;

    //Get Username from session
    const username = req.session.authorization.username;

    //Book does not exit
    if (!books[ISBN]) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    //Check if the user has posted a review
    if (books[ISBN].reviews[username]) {
        delete books[ISBN].reviews[username];

        return res.status(200).json({
            message: "Review deleted successfully",
            reviews: books[ISBN].reviews
        });
    } else {
        return res.status(404).json({
            message: `No review found for this ${ISBN}`
        });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
