module.exports = function (sequelize, DataTypes) {
  var Feedback = sequelize.define('Feedback', {
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    content: { type: DataTypes.TEXT, allowNull: false }
  });
  
  return Feedback;
};