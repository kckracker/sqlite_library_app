'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
  };
  Book.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate:{
        notNull:{
          msg: "Please enter a value for 'title'"
        },
        notEmpty: {
          msg: "Please enter a value for 'title'"
        },
        notEmpty: {
          msg: "Please enter a value for 'title'"
        }

      }
    },
    author: {
      type: DataTypes.STRING,
      notEmpty: true,
      allowNull: false,
      validate:{
        notNull:{
          msg: "Please enter a value for 'author'"
        },
        notEmpty: {
          msg: "Please enter a value for 'author'"
        },
      }
    },
    genre: DataTypes.STRING,
    year: {
      type: DataTypes.INTEGER,
      notEmpty: true,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Please enter a value for 'year'"
        },
        notEmpty: {
          msg: "Please enter a value for 'year'"
        },
        isNumeric: {
          msg: "Please use numeric entry for 'year'"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Book',
  });
  return Book;
};