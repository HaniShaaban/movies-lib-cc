import { PrismaClient } from '@prisma/client';
import { staticSeed } from '../src/constant';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const movieTitles = [
  'The Dark Knight',
  'Inception',
  'Interstellar',
  'Tenet',
  'Dunkirk',
  'Memento',
  'The Prestige',
  'Oppenheimer',
  'Insomnia',
  'Following',
  'Jurassic Park',
  "Schindler's List",
  'Saving Private Ryan',
  'E.T.',
  'Jaws',
  'Raiders of the Lost Ark',
  'Close Encounters',
  'War Horse',
  'Lincoln',
  'Munich',
  'Pulp Fiction',
  'Kill Bill Vol. 1',
  'Kill Bill Vol. 2',
  'Django Unchained',
  'Inglourious Basterds',
  'Reservoir Dogs',
  'Jackie Brown',
  'The Hateful Eight',
  'Once Upon a Time in Hollywood',
  'Death Proof',
  'Goodfellas',
  'The Departed',
  'Taxi Driver',
  'Raging Bull',
  'The Wolf of Wall Street',
  'Casino',
  'Gangs of New York',
  'The Irishman',
  'Shutter Island',
  'Hugo',
  'Avatar',
  'Titanic',
  'Terminator 2',
  'The Terminator',
  'Aliens',
  'The Abyss',
  'True Lies',
  'Alita: Battle Angel',
  'Piranha II',
  'Xenogenesis',
  'The Lord of the Rings: The Fellowship of the Ring',
  'The Lord of the Rings: The Two Towers',
  'The Lord of the Rings: The Return of the King',
  'The Hobbit: An Unexpected Journey',
  'The Hobbit: The Desolation of Smaug',
  'The Hobbit: The Battle of the Five Armies',
  'King Kong',
  'Heavenly Creatures',
  'The Lovely Bones',
  'District 9',
  'Blade Runner',
  'Alien',
  'Gladiator',
  'The Martian',
  'Prometheus',
  'Kingdom of Heaven',
  'Black Hawk Down',
  'Thelma & Louise',
  'American Gangster',
  'Robin Hood',
  'Psycho',
  'Vertigo',
  'Rear Window',
  'North by Northwest',
  'The Birds',
  'Dial M for Murder',
  'Rope',
  'Strangers on a Train',
  'Shadow of a Doubt',
  'Rebecca',
  'Unforgiven',
  'Million Dollar Baby',
  'Gran Torino',
  'American Sniper',
  'Mystic River',
  'The Bridges of Madison County',
  'Letters from Iwo Jima',
  'Sully',
  'J. Edgar',
  'Changeling',
  'The Godfather',
  'The Godfather Part II',
  'The Godfather Part III',
  'Apocalypse Now',
  'The Conversation',
  "Bram Stoker's Dracula",
  'Tucker: The Man and His Dream',
  'Youth Without Youth',
  'Tetro',
  'The Outsiders',
];

const synopses = [
  'A gripping tale of redemption and justice.',
  'An epic journey through time and space.',
  'A thrilling adventure that keeps you on the edge of your seat.',
  'A heartwarming story of love and loss.',
  'A mind-bending exploration of reality and dreams.',
  'An unforgettable saga of courage and sacrifice.',
  'A powerful drama that touches the soul.',
  'A comedic masterpiece full of laughs.',
  'A terrifying descent into darkness.',
  'A romantic journey that transcends time.',
];

async function main() {
  console.log('Start seeding...');

  // Truncate tables in correct order (respecting foreign keys)

  await prisma.$executeRawUnsafe(
    `TRUNCATE TABLE "Movie" RESTART IDENTITY CASCADE`,
  );
  await prisma.$executeRawUnsafe(
    `TRUNCATE TABLE "Director" RESTART IDENTITY CASCADE`,
  );
  await prisma.$executeRawUnsafe(
    `TRUNCATE TABLE "Genre" RESTART IDENTITY CASCADE`,
  );

  await prisma.$executeRawUnsafe(
    `TRUNCATE TABLE "User" RESTART IDENTITY CASCADE`,
  );

  console.log('Database truncated');

  // Seed Genres (IDs will be 1-10)
  console.log('Seeding genres...');
  for (const genre of staticSeed.genres) {
    await prisma.genre.create({
      data: genre,
    });
  }
  console.log('✓ Created 10 genres');

  // Seed Directors (IDs will be 1-10)
  console.log('Seeding directors...');
  for (const director of staticSeed.directors) {
    await prisma.director.create({
      data: director,
    });
  }
  console.log('✓ Created 10 directors');

  const hashedPassword = await bcrypt.hash('123456', 10);
  await prisma.user.create({
    data: {
      name: 'admin',
      username: 'admin@example.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });
  console.log('✓ Created admin user');

  // Seed 200 Movies
  console.log('Seeding movies...');
  for (let i = 0; i < 200; i++) {
    const title =
      movieTitles[i % movieTitles.length] +
      (i >= movieTitles.length
        ? ` ${Math.floor(i / movieTitles.length) + 1}`
        : '');
    const synopsis = synopses[i % synopses.length];
    const year = 1970 + Math.floor(Math.random() * 55); // Years between 1970-2024
    const directorId = Math.floor(Math.random() * 10) + 1; // Random ID from 1-10
    const genreId = Math.floor(Math.random() * 10) + 1; // Random ID from 1-10
    const cover = `https://picsum.photos/seed/${i}/300/450`; // Random movie poster

    await prisma.movie.create({
      data: {
        title,
        synopsis,
        year,
        cover,
        directorId,
        genreId,
      },
    });

    if ((i + 1) % 50 === 0) {
      console.log(`✓ Created ${i + 1}/200 movies`);
    }
  }

  console.log('✓ Created 200 movies');
  console.log('🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
