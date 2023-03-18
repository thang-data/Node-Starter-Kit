const albumModel = require('../model/albumModel');

const getAlbums_ = (req, res) => {
   console.log(req.query);
   const data = albumModel.find(req.query);
    data.then((albums) => {
        res.status(200).json(albums);
    }
    ).catch((err) => {
        res.status(500).json(err);
    }
    );
};

const getAlbumsById_ = (req, res) => {
   const data = albumModel.findOne({ albumId: req.params.id });
    data.then((album) => {
        res.status(200).json(album);
    }
    ).catch((err) => {
        res.status(500).json(err);
    }
    );
};

const getBodyAlbums_ = (req, res) => {
    const album = new albumModel(req.body);
    album.save()
        .then((album) => {
            res.status(201).json(album);
        }
        )
        .catch((err) => {
            res.status(500).json(err);
        }
        );
};

const deleteAlbums_ = (req, res) => {
    const album = new albumModel(req.body);
    albumModel.findOneAndDelete({ albumId: req.params.id }).then((album) => {
        res.status(200).json({ message: 'Album deleted' });
    }
    );

};


const updateAlbums_ = (req, res) => {
    const album = new albumModel(req.body);
    albumModel.findOne({ albumId: req.params.id }).then((album) => {
      album.artistName = req.body.artistName;
      album.collectionName = req.body.collectionName;
      album.artworkUrl100 = req.body.artworkUrl100;
      album.releaseDate = req.body.releaseDate;
      album.primaryGenreName = req.body.primaryGenreName;
      album.url = req.body.url;
      album.save();
      res.status(200).json(album);
    });
};

//deleteAlbums_ = (req, res) 

const deleteAlbum_ = (req, res) => {
   const album = new albumModel(req.body);
   albumModel.findOne ({ albumId: req.params.id }).then((album) => {
        album.delete();
        res.status(200).json({ message: 'Album deleted' });
    }
    );
};

//find album by keyword in artistName with api call /api/albums?name=[keyword]
const findKeyword_ = (req, res) => {
  albumModel.find({ artistName: { $regex: new RegExp(req.query.name, 'i') } }).then((album) => {
    res.status(200).json(album);
  });
};

// name = Ba, ba, black 
// name=b

module.exports = {
    getAlbums_,
    getAlbumsById_,
    getBodyAlbums_,
    deleteAlbums_,
    updateAlbums_,
    deleteAlbum_,
    findKeyword_,

};