const express = require("express");
const crypto = require("node:crypto");
const cors = require("cors");
const movies = require("./movies.json");
const { validateMovie, validatePartialMovie } = require("./schemas/movies");
const PORT = process.env.PORT || 3000;

const app = express();
app.disable("x-powered-by");
app.use(express.json());
app.use(
  cors({
    origin: (origin, callback) => {
      const ACCEPTED_ORIGINS = [
        "http://localhost:8080",
        "http://localhost:3456",
        "http://wwwm.movies.com",
      ];

      if (ACCEPTED_ORIGINS.includes(origin)) {
        return callback(null, origin);
      }
      if (!origin) return callback(null, origin);

      return callback(new Error("Not allowed by CORS"));
    },
  })
);
app.get("/", (req, res) => {
  return res.send("Hello World!");
});

app.get("/movies", (req, res) => {
  const { genre } = req.query;
  if (genre) {
    const moviesByGenre = movies.filter((movie) =>
      movie.genre.some(
        (g) => g.toLocaleLowerCase() === genre.toLocaleLowerCase()
      )
    );
    return res.json(moviesByGenre);
  }
  res.json(movies);
});

app.get("/movies/:id", (req, res) => {
  const movie = movies.find((movie) => movie.id === id);
  if (movie) res.json(movie);
  res.json({ error: "Movie not found" });
});

app.post("/movies", (req, res) => {
  const result = validateMovie(req.body);

  if (result.error) {
    return res.status(400).send(JSON.parse(result.error.message));
  }

  const newMovie = {
    id: crypto.randomUUID(),
    ...result.data,
  };
  movies.push(newMovie);
  res.status(201).json(newMovie);
});

app.patch("/movies/:id", (req, res) => {
  const { id } = req.params;
  const movieIndex = movies.findIndex((movie) => movie.id === id);

  if (movieIndex < 0) {
    return res.status(404).send({ error: "Movie not found" });
  }

  // const newData = req.body;

  // const movie = movies[movieIndex];

  // const updatedMovie = { ...movie, ...newData };
  // console.log(updatedMovie);
  // const result = validateMovie(updatedMovie);
  const result = validatePartialMovie(req.body);
  if (result.error) {
    return res.status(400).send(JSON.parse(result.error.message));
  }

  const updatedMovie = { ...movies[movieIndex], ...result.data };
  movies[movieIndex] = updatedMovie;
  return res.json(updatedMovie);
});

app.delete("/movies/:id", (req, res) => {
  const { id } = req.params;
  const movieIndex = movies.findIndex((movie) => movie.id === id);

  if (movieIndex < 0) {
    return res.status(404).send({ error: "Movie not found" });
  }

  movies.splice(movieIndex, 1);
  return res.json({ message: "Movie deleted successfully" }); // No Content
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
