const mongoose = require('mongoose');
const env = require('../config/env');
const Song = require('../models/Song');

const seedSongs = [
  {
    youtubeVideoId: 'mEaC78qdxWk',
    title: 'Raaz Movie All Songs',
    artist: 'Bollywood Classic Hits',
    album: 'Raaz',
    year: 2002,
    thumbnailUrl: 'https://i.ytimg.com/vi/mEaC78qdxWk/hqdefault.jpg',
    youtubeUrl: 'https://youtu.be/mEaC78qdxWk?si=69NRw1gVv0mQT3Tf',
  },
  {
    youtubeVideoId: 'LpX-fCgat1M',
    title: 'Zindagi Ban Gaye Ho Tum',
    artist: 'Udit Narayan, Alka Yagnik',
    album: 'Kasoor',
    year: 2001,
    thumbnailUrl: 'https://i.ytimg.com/vi/LpX-fCgat1M/hqdefault.jpg',
    youtubeUrl: 'https://youtu.be/LpX-fCgat1M?si=CmCujDow7A1RSsXI',
  },
  {
    youtubeVideoId: 'ZxXh_PMsYhg',
    title: 'Tu Dharti Pe Chaahe Jahan Bhi Rahegi',
    artist: 'Kumar Sanu, Alka Yagnik',
    album: 'Jeet',
    year: 1996,
    thumbnailUrl: 'https://i.ytimg.com/vi/ZxXh_PMsYhg/hqdefault.jpg',
    youtubeUrl: 'https://youtu.be/ZxXh_PMsYhg?si=qAao2A2E35w7Ibfh',
  },
  {
    youtubeVideoId: 'c4EQSU4IfbA',
    title: 'Udit Narayan Hit Songs',
    artist: 'Tips Official',
    album: 'Romantic Love Songs',
    year: 1995,
    thumbnailUrl: 'https://i.ytimg.com/vi/c4EQSU4IfbA/hqdefault.jpg',
    youtubeUrl: 'https://youtu.be/c4EQSU4IfbA?si=uZwqxHi56yjxysqj',
  },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(env.MONGODB_URI);
    console.log('MongoDB Connected for Seeding');

    await Song.deleteMany();
    console.log('Cleared existing songs');

    await Song.insertMany(seedSongs);
    console.log('Inserted seed songs successfully');

    process.exit(0);
  } catch (error) {
    console.error('Seeding Error:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
