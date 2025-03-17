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
      allowNull: false
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    subcategory_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    booking_code: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    amount: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    no_of_booking: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "''"
    },
    status: {
      type: DataTypes.ENUM('0','1','2'),
      allowNull: false,
      defaultValue: "1",
      comment: "0=>pending,1=>ongoing,2=>complete"
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    }
  }, {
    sequelize,
    tableName: 'bookings',
    timestamps: true,
    paranoid: true,
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
