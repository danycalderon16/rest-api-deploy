import z from "zod";

const movieSchema = z.object({
  title: z.string({
    invalid_type_error: "Title must be a string",
    required_error: "Title is required",
  }),
  year: z.number().int().min(1900).max(2024),
  director: z.string(),
  duration: z.number().int().positive(),
  poster: z.string().url(),
  rate: z.number().min(0).max(10),
  genre: z.array(
    z.enum([
      "Action",
      "Adventure",
      "Comedy",
      "Crime",
      "Drama",
      "Fansaty",
      "Horror",
      "Thriller",
      "Sci-Fi",
    ]),
    {
      invalid_type_error: "Genre must be an array of strings",
      required_error: "Genre is required",
    }
  ),
});

export function validateMovie(movie) {
  return movieSchema.safeParse(movie);
}

export function validatePartialMovie(input) {
  return movieSchema.partial().safeParse(input);
}
