'use strict';
module.exports = (sequelize, DataTypes) => {
  const Album = sequelize.define('Album', {
    name: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    user_id:{
      allowNull: false,
      type: DataTypes.INTEGER
    },
    image_url: {
      allowNull: false,
      type:  DataTypes.TEXT
    }
  }, {});
  Album.associate = function(models) {
    // associations can be defined here
    Album.belongsTo(models.User, {foreignKey: 'user_id'})
    Album.hasMany(models.Song, {foreignKey: 'album_id', onDelete: 'CASCADE', hooks: true})
  };
  return Album;
};
