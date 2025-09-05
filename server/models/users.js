const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('users', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    role: {
      type: DataTypes.ENUM('0', '1', '2'),
      allowNull: false,
      defaultValue: "1",
      comment: "o=>admin,1=>user,2=>lender"
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    countryCode: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: ""
    },
    phoneNumber: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: ""
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    image: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    otp: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    otpVerify: {
      type: DataTypes.ENUM('0', '1'),
      allowNull: false,
      defaultValue: "0",
      comment: "0=>not verify,1=>verify"
    },
    status: {
      type: DataTypes.ENUM('0', '1'),
      allowNull: false,
      defaultValue: "0",
      comment: "0=>incative,1=>active"
    },
    loginTime: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: ""
    },
    latitude: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    longitude: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    is_notification: {
      type: DataTypes.ENUM('0', '1'),
      allowNull: false,
      defaultValue: "0"
    },
    deviceToken: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: ""
    },
    deviceType: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "1=>iOS, 2=>android"
    },
    socket_id: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    online: {
      type: DataTypes.ENUM('0', '1'),
      allowNull: false,
      defaultValue: "0",
      comment: "for chat 1=>online, 0=>offline"
    },
    customer_id: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "",
      comment: "for Stripe Payment "
    },
    account_id: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "",
      comment: "for Stripe Payment "
    },
    admin_commission: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    hash_account: {
      type: DataTypes.ENUM('0', '1'),
      allowNull: false,
      defaultValue: "0",
      comment: "for Stripe Payment   0=>pending,1=>complete"
    }
  }, {
    sequelize,
    tableName: 'users',
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
