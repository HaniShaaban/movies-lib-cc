import axios from "axios";
import type { Movie } from "../types/movie";

export const fetchMovies = async () => {
    try {

        const params = {
            page: 1,
            limit: 200
        };

        return await axios.get<{ data: Movie[] }>('http://localhost:3000/movies', { params });
    } catch (error) {
        console.error('Error fetching movies:', error);
        return []
    }
};