const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    //Write your code here
    return res.status(300).json({ message: "Yet to be implemented" });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    //Write your code here
    //return res.status(300).json({message: "Yet to be implemented"});
    res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    //Write your code here
    //return res.status(300).json({message: "Yet to be implemented"});
    const ISBN = req.params.isbn;
    res.send(books[ISBN]);
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    //Write your code here
    //return res.status(300).json({message: "Yet to be implemented"});
    const author = req.params.author;
    let booksByAuthor = [];

    const bookKeys = Object.keys(books);

    bookKeys.forEach((key) => {
        if (books[key].author === author) {
            booksByAuthor.push(books[key]);
        }
    });

    if (booksByAuthor.length === 0) {
        return res.status(404).json({ message: "No Books found for this author" });
    }

    return res.status(200).json(booksByAuthor);
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    //Write your code here
    //return res.status(300).json({ message: "Yet to be implemented" });
    const title = req.params.title;
    let booksByTitle = [];

    const bookKeys = Object.keys(books);

    bookKeys.forEach((key) => {
        if(books[key].title === title) {
            booksByTitle.push(books[key]);
        }
    });

    if(booksByTitle.length === 0) {
        return res.status(404). json({message: "No Books found with this title"});
    }

    return res.status(200).json(booksByTitle);
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    //Write your code here
    //return res.status(300).json({ message: "Yet to be implemented" });
    const ISBN = req.params.isbn;
    if(!books[ISBN]) {
        return res.status(404).json({message: "Book not found"});
    }

    return res.status(200).json(books[ISBN].reviews);
});

module.exports.general = public_users;
