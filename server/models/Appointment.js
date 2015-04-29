module.exports = function (sequelize, DataTypes) {
  var Appointment = sequelize.define('Appointment', {
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING, allowNull: false },
    token: { type: DataTypes.STRING, allowNull: false }
  }, {
    classMethods: {
      associate: function(models) {
        Appointment.belongsTo(models.Slot);
      }
    }
  });
  
  return Appointment;
};