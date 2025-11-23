const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
    //Write your code here
    //return res.status(300).json({ message: "Yet to be implemented" });
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        //Check if the user does not already exist
        if (!isValid(username)) {
            //Add the new user to users array
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "User successfully registerted. Now you can login." });
        } else {
            return res.status(404).json({ message: "User already existes!" });
        }
    }
    return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    //Write your code here
    //return res.status(300).json({message: "Yet to be implemented"});
    //res.send(JSON.stringify(books, null, 4));
    new Promise((resolve, reject) => {
        resolve(books);      // books is your booksdb object
    })
        .then((bookList) => {
            return res.status(200).json(bookList);
        })
        .catch((err) => {
            return res.status(500).json({ message: "Error fetching books" });
        });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    //Write your code here
    //return res.status(300).json({message: "Yet to be implemented"});
    const ISBN = req.params.isbn;
    //res.send(books[ISBN]);

    //Using Promise Call back
    new Promise((resolve, reject) => {
        if (books[isbn]) {
            resolve(books[isbn]);
        } else {
            reject("Book not found");
        }
    })
        .then((book) => {
            return res.status(200).json(book);
        })
        .catch((error) => {
            return res.status(404).json({ message: error });
        });
});

// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
    //Write your code here
    //return res.status(300).json({message: "Yet to be implemented"});
    const author = req.params.author;
    // let booksByAuthor = [];

    // const bookKeys = Object.keys(books);

    // bookKeys.forEach((key) => {
    //     if (books[key].author === author) {
    //         booksByAuthor.push(books[key]);
    //     }
    // });

    // if (booksByAuthor.length === 0) {
    //     return res.status(404).json({ message: "No Books found for this author" });
    // }

    // return res.status(200).json(booksByAuthor);

    //Using async–await + Axios-like Promise
    // Promisify local operation (no actual external request)
    const getBooksByAuthor = () => {
        return new Promise((resolve, reject) => {
            let booksByAuthor = [];

            Object.keys(books).forEach((key) => {
                if (books[key].author === author) {
                    booksByAuthor.push(books[key]);
                }
            });

            if (booksByAuthor.length > 0) {
                resolve(booksByAuthor);
            } else {
                reject("No books found");
            }
        });
    };

    try {
        const result = await getBooksByAuthor();
        return res.status(200).json(result);
    } catch (err) {
        return res.status(404).json({ message: err });
    }
});

// Get all books based on title
public_users.get('/title/:title', async (req, res) => {
    //Write your code here
    //return res.status(300).json({ message: "Yet to be implemented" });
    const title = req.params.title;
    // let booksByTitle = [];

    // const bookKeys = Object.keys(books);

    // bookKeys.forEach((key) => {
    //     if (books[key].title === title) {
    //         booksByTitle.push(books[key]);
    //     }
    // });

    // if (booksByTitle.length === 0) {
    //     return res.status(404).json({ message: "No Books found with this title" });
    // }

    // return res.status(200).json(booksByTitle);

    //Using Promise Callback

    const getBookByTitle = () => {
        return new Promise((resolve, reject) => {
            let booksByTitle = [];
            Object.keys(books).forEach((key) => {
                if (books[key].title === title) {
                    booksByTitle.push(books[key]);
                }
            });

            if (booksByTitle.length > 0) {
                resolve(booksByTitle);
            } else {
                reject(`No books found with this ${title}`);
            }
        });
    }

    try {
        const result = await getBookByTitle();
        return res.status(200).json(result);
    } catch (err) {
        return res.status(404).json({ message: err });
    }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    //Write your code here
    //return res.status(300).json({ message: "Yet to be implemented" });
    const ISBN = req.params.isbn;
    if (!books[ISBN]) {
        return res.status(404).json({ message: "Book not found" });
    }

    return res.status(200).json(books[ISBN].reviews);
});

module.exports.general = public_users;
