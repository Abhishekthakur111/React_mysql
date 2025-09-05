const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('products', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    lender_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    price: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    hour: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    day: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    week: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    secuirtyDeposit: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    available: {
      type: DataTypes.ENUM('0', '1'),
      allowNull: false,
      defaultValue: "1"
    },
    variants: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    status: {
      type: DataTypes.ENUM('0', '1'),
      allowNull: false,
      defaultValue: "0"
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: ""
    }
  }, {
    sequelize,
    tableName: 'products',
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
