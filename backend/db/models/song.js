'use strict';

module.exports = (sequelize, DataTypes) => {
  const Song = sequelize.define('Song', {
    name: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    song_url: {
      allowNull: false,
      type: DataTypes.TEXT,
    },
    genre: {
      allowNull: false,
      type: DataTypes.JSONB,
    },
    user_id: {
      allowNull: false,
     type: DataTypes.INTEGER,
    },
    album_id: {
      allowNull: false,
      type: DataTypes.INTEGER
    }
  }, {});
  Song.associate = function(models) {
    // associations can be defined here
    Song.belongsTo(models.User, {foreignKey: 'user_id'});
    Song.belongsTo(models.Album, {foreignKey: 'album_id'});
    Song.belongsToMany(models.Playlist, {through: "Playlist_Song_Bridge", foreignKey: 'song_id'});
  };
  return Song;
};
