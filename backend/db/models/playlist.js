'use strict';

module.exports = (sequelize, DataTypes) => {
  const Playlist = sequelize.define('Playlist', {
    name: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    user_id: {
      allowNull: false,
     type: DataTypes.INTEGER,
    },
  }, {});
  Playlist.associate = function(models) {
    Playlist.belongsTo(models.User, {foreignKey: 'user_id'})
    Playlist.belongsToMany(models.Song, {through: "Playlist_Song_Bridge", foreignKey: 'playlist_id'})
  };
  return Playlist;
};
