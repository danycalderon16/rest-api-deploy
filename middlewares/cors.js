import cors from "cors";

export const corsMiddleware = () =>
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
  });
