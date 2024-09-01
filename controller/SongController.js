const Song = require("../model/Song");

// create songs
const createSong = async (req, res) => {
  try {
    const { title, album, artist, genre } = req.body;

    const existingSong = await Song.findOne({ title });
    if (existingSong) {
      return res.status(400).json({ message: "Song already exists" });
    }

    const song = new Song({
      title,
      artist,
      album,
      genre,
    });
    await song.save();
    res.status(201).json(song);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error creating song", error: error.message });
  }
};

// display the song
const listSong = async (req, res) => {
  try {
    const songs = await Song.find();
    res.status(200).json(songs);
  } catch (error) {
    res.status(500).json(error);
  }
};

// update the song
const updateSong = async (req, res) => {
  try {
    const id = req.params.id;
    const song = await Song.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!song) {
      return res.status(404).json({ message: "Song not found or not updated" });
    }
    res.json(song);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error updating song", error: error.message });
  }
};

// delete the song
const deleteSong = async (req, res) => {
  try {
    const id = req.params.id;
    const song = await Song.findByIdAndDelete(id);
    if (!song) {
      return res.status(404).json("not deleted");
    }
    res.send(song);
  } catch (error) {
    res.status(500).send(error);
  }
};

// total number of songs
const totalSongs = async (req, res) => {
  try {
    const result = await Song.aggregate([
      {
        $group: {
          _id: "$title",
        },
      },
      {
        $count: "totalSongCount",
      },
    ]);

    const total = result.length > 0 ? result[0].totalSongCount : 0;
    res.status(200).json({ total });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error counting songs", error: error.message });
  }
};

// total number of artists
const totalArtist = async (req, res) => {
  try {
    const result = await Song.aggregate([
      {
        $group: {
          _id: "$artist",
        },
      },
      {
        $count: "totalArtistCount",
      },
    ]);

    const total = result.length > 0 ? result[0].totalArtistCount : 0;
    res.status(200).json({ total });
  } catch (error) {
    res.status(500).json({
      message: "Error counting distinct artists",
      error: error.message,
    });
  }
};

//  total number of album 
const totalAlbum = async (req, res) => {
  try {
    const result = await Song.aggregate([
      {
        $group: {
          _id: "$album",
        },
      },
      {
        $count: "TotalAlbumCount",
      },
    ]);

    const total = result.length > 0 ? result[0].TotalAlbumCount : 0;
    res.status(200).json({ total });
  } catch (error) {
    res.status(500).json({
      message: "Error counting distinct album",
      error: error.message,
    });
  }
};

// total number of genre 
const totalGenre = async (req, res) => {
  try {
    const result = await Song.aggregate([
      {
        $group: {
          _id: "$genre",
        },
      },
      {
        $count: "TotalGenre",
      },
    ]);

    const total = result.length > 0 ? result[0].TotalGenre : 0;
    res.status(200).json({ total });
  } catch (error) {
    res.status(500).json({
      message: "Error counting distinct genres",
      error: error.message,
    });
  }
};

// total number of songs in each genre group
const totalSongEveryGenre = async (req, res) => {
  try {
    const result = await Song.aggregate([
      {
        $group: {
          _id: "$genre",
          totalSongs: { $sum: 1 },
        },
      },
      {
        $sort: { totalSongs: -1 },
      },
    ]);

    const formattedResult = {};
    result.forEach((item) => {
      formattedResult[item._id] = item.totalSongs;
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: "Error counting songs by genre",
      error: error.message,
    });
  }
};

// total number of songs and album each artist have
const totalSongsAndAlbumsByArtist = async (req, res) => {
  try {
    const result = await Song.aggregate([
      {
        $group: {
          _id: "$artist",
          totalSongs: { $sum: 1 },
          totalAlbums: { $addToSet: "$album" },
        },
      },
      {
        $project: {
          _id: 1,
          totalSongs: 1,
          totalAlbums: { $size: "$totalAlbums" },
        },
      },
    ]);

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: "Error counting songs and albums by artist",
      error: error.message,
    });
  }
};

// total number of songs in each album
const totalSongEveryAlbum = async (req, res) => {
  try {
    const result = await Song.aggregate([
      {
        $group: {
          _id: "$album",
          totalSong: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: "Error counting titles by Album",
      error: error.message,
    });
  }
};

// filter by genre category
const filterSongsByGenreOrArtist = async (req, res) => {
  const { genre, artist } = req.body;
  try {
    const matchCriteria = {};
    if (genre) matchCriteria.genre = genre;
    if (artist) matchCriteria.artist = artist;

    const result = await Song.aggregate([
      {
        $match: matchCriteria,
      },
      {
        $project: {
          title: 1,
          album: 1,
          genre: 1,
          artist: 1,
        },
      },
    ]);

    if (result.length === 0) {
      return res.status(404).json({
        message: `No songs found for genre: ${genre} or artist: ${artist}`,
      });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: "Error filtering songs by genre or artist",
      error: error.message,
    });
  }
};

module.exports = {
  createSong,
  listSong,
  updateSong,
  deleteSong,
  totalSongs,
  totalArtist,
  totalAlbum,
  totalGenre,
  totalSongEveryGenre,
  totalSongsAndAlbumsByArtist,
  totalSongEveryAlbum,
  filterSongsByGenreOrArtist,
};
