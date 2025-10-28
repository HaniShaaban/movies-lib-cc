import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client } from '@elastic/elasticsearch';
import { MovieESDocument } from './es.types';

@Injectable()
export class ElasticsearchService implements OnModuleInit {
  private client: Client;

  onModuleInit() {
    this.client = new Client({ node: process.env.ES_URL });

    this.client
      .ping()
      .then(() => console.log('Elasticsearch is up!'))
      .catch((err) => console.error('Elasticsearch connection failed:', err));
  }

  async indexMovie(movie: MovieESDocument) {
    await this.client.index({
      index: 'movies',
      id: movie.id.toString(),
      document: {
        title: movie.title,
        synopsis: movie.synopsis || '',
        year: movie.year,
        cover: movie.cover || '',
        director: movie.director || '',
        genre: movie.genre || '',
        createdAt: movie.createdAt,
      },
    });
  }

  async searchMovies(query: string, page = 1, limit = 10) {
    page = Math.max(1, page);
    limit = Math.max(1, limit);

    const skip = (page - 1) * limit;

    const esQuery =
      query?.trim()?.length > 0
        ? {
            bool: {
              should: [
                { wildcard: { title: `*${query.toLowerCase()}*` } },
                { wildcard: { synopsis: `*${query.toLowerCase()}*` } },
              ],
            },
          }
        : { match_all: {} };

    const { hits } = await this.client.search<MovieESDocument>({
      index: 'movies',
      from: skip,
      size: limit,
      body: {
        query: esQuery,
        sort: [{ createdAt: { order: 'desc' } }],
      },
    });

    const data = hits.hits.map((hit) => ({
      id: Number(hit._id),
      ...hit._source,
    }));

    const total =
      typeof hits.total === 'number' ? hits.total : hits.total?.value || 0;
    const totalPages = Math.ceil(total / limit);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  }

  async bulkIndexMovies(movies: MovieESDocument[]) {
    const body = movies.flatMap((movie) => [
      { index: { _index: 'movies', _id: movie.id.toString() } },
      {
        title: movie.title,
        synopsis: movie.synopsis || '',
        year: movie.year,
        cover: movie.cover || '',
        director: movie.director || '',
        genre: movie.genre || '',
        createdAt: movie.createdAt,
      },
    ]);

    const { errors, items } = await this.client.bulk({ refresh: true, body });

    if (errors) {
      console.error('Some documents failed to index:', items);
    } else {
      console.log(`Successfully indexed ${movies.length} movies`);
    }
  }
}
