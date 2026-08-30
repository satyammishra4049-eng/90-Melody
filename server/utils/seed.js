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
    youtubeUrl: 'https://youtu.be/c4EQSU4IfbA',
  },
  {
    youtubeVideoId: 'Qsk8onj4Zh8',
    title: 'New Request 1',
    artist: 'Various Artists',
    album: '90s Hits',
    year: 1998,
    thumbnailUrl: 'https://i.ytimg.com/vi/Qsk8onj4Zh8/hqdefault.jpg',
    youtubeUrl: 'https://youtu.be/Qsk8onj4Zh8',
  },
  {
    youtubeVideoId: 'KRpHH4bcnKQ',
    title: 'New Request 2',
    artist: 'Various Artists',
    album: '90s Hits',
    year: 1998,
    thumbnailUrl: 'https://i.ytimg.com/vi/KRpHH4bcnKQ/hqdefault.jpg',
    youtubeUrl: 'https://youtu.be/KRpHH4bcnKQ',
  },
  {
    youtubeVideoId: 'ka12rSs9Enc',
    title: 'New Request 3',
    artist: 'Various Artists',
    album: '90s Hits',
    year: 1998,
    thumbnailUrl: 'https://i.ytimg.com/vi/ka12rSs9Enc/hqdefault.jpg',
    youtubeUrl: 'https://youtu.be/ka12rSs9Enc',
  },
  {
    youtubeVideoId: 'MbIRbYjLdqM',
    title: 'New Request 4',
    artist: 'Various Artists',
    album: '90s Hits',
    year: 1998,
    thumbnailUrl: 'https://i.ytimg.com/vi/MbIRbYjLdqM/hqdefault.jpg',
    youtubeUrl: 'https://youtu.be/MbIRbYjLdqM',
  },
  {
    youtubeVideoId: 'siw7-MTgE4s',
    title: 'New Request 5',
    artist: 'Various Artists',
    album: '90s Hits',
    year: 1998,
    thumbnailUrl: 'https://i.ytimg.com/vi/siw7-MTgE4s/hqdefault.jpg',
    youtubeUrl: 'https://youtu.be/siw7-MTgE4s',
  }
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
