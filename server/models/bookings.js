const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('bookings', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    bookingDate: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    returnDate: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    longitude: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    latitude: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    price: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    paymentStatus: {
      type: DataTypes.ENUM('0','1'),
      allowNull: false,
      defaultValue: "0",
      comment: "0=>pending,1=>payemtn done,"
    },
    paymentmethod: {
      type: DataTypes.ENUM('0','1'),
      allowNull: false,
      defaultValue: "0",
      comment: "0 for offline ,1 for online"
    },
    status: {
      type: DataTypes.ENUM('0','1','2','3','4'),
      allowNull: false,
      defaultValue: "0",
      comment: "0=>ordered,1=>recived,2=>return"
    }
  }, {
    sequelize,
    tableName: 'bookings',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
