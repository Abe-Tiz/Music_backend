const express = require('express');
const {
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
    filterSongsByGenreOrArtist
} = require('../controller/SongController');
const router = express.Router();

router.post('/create', createSong);
router.get('/', listSong);
router.put('/update/:id', updateSong);
router.delete('/delete/:id', deleteSong);
router.get("/total-song", totalSongs);
router.get("/total-artist", totalArtist);
router.get("/total-album", totalAlbum);
router.get("/total-genre", totalGenre);
router.get("/total-song-album", totalSongEveryAlbum);
router.get("/total-song-genre", totalSongEveryGenre);
router.get("/total-song-album-artist", totalSongsAndAlbumsByArtist);
router.post("/filter-artist-genre", filterSongsByGenreOrArtist);


module.exports = router;
