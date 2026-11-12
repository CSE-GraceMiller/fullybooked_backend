const express = require("express");
const cors = require("cors");
const multer = require("multer");
const app = express();
const Joi = require("joi");
app.use(express.static("public"));
app.use(express.json());
app.use(cors());

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./public/images/");
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  });
  
const upload = multer({ storage: storage });

let books = [
  {
    "_id": 1,
    "title": "Pip Plants a Planet",
    "author": "Elin Carter",
    "description": "A little act of kindness can grow a greener world",
    "genre": "Environment",
    "available": true,
    "img_name": "book-pip-plants-a-planet.png"
  },
  {
    "_id": 2,
    "title": "The Cloud Collectors",
    "author": "Nora Fields",
    "description": "Two friends chase clouds and find something even better",
    "genre": "Adventure, Friendship",
    "available": true,
    "img_name": "book-the-cloud-collectors.png"
  },
  {
    "_id": 3,
    "title": "The Robot Who Read",
    "author": "Kai Mendoza",
    "description": "A Robot discovers that stories can change everything",
    "genre": "Friendship",
    "available": true,
    "img_name": "book-the-robot-who-read.png"
  },
  {
    "_id": 4,
    "title": "The Mystery of Willow Creek",
    "author": "Jack Holloway",
    "description": "Three friends, one clue, a summer to remember",
    "genre": "Adventure, Friendship",
    "available": true,
    "img_name": "book-the-mystery-of-mossy-creek.png"
  },
  {
    "_id": 5,
    "title": "A House For Everyone",
    "author": "Mateo Singh",
    "description": "Different homes, one big world, a celebration of belonging",
    "genre": "Animals, Friendship",
    "available": true,
    "img_name": "book-a-house-for-everyone.png"
  },
  {
    "_id": 6,
    "title": "Stella and The Shooting Star",
    "author": "Priya Raman",
    "description": "The biggest dreams start with a small wish",
    "genre": "Adventure",
    "available": true,
    "img_name": "book-stella-and-the-shooting-star.png"
  }
]

app.get("/api/books", (req,res)=>{
    res.send(books)
});

app.post("/api/books", upload.single("img"), (req, res) => {
  const result = validateBook(req.body);

  if (result.error) {
    console.log("Error in validation");
    res.status(400).send(result.error.details[0].message);
    return;
  }

  const book = {
    _id: books.length + 1,
    title: req.body.title,
    author: req.body.author,
    description: req.body.description,
    genre: req.body.genre,
    available: req.body.available === "true" || req.body.available === true,
  };

  if (req.file) {
    book.img_name = req.file.filename;
  }

  books.push(book);

  res.status(200).send(book);
});

const validateBook = (book) => {
  const schema = Joi.object({
    _id: Joi.allow(""),
    title: Joi.string().min(3).required(),
    author: Joi.string().required(),
    description: Joi.string().min(5).required(),
    genre: Joi.string().required(),
    available: Joi.allow(""),
    img: Joi.allow(""),
  });

  return schema.validate(book);
};

app.listen(3001, () => {
  console.log("Server is up and running");
});