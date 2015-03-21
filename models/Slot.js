module.exports = function (sequelize, DataTypes) {
  var Slot = sequelize.define('Slot', {
    start: { type: DataTypes.DATE, allowNull: false },
    end: { type: DataTypes.DATE, allowNull: false }
  }, {
    classMethods: {
      associate: function(models) {
        Slot.belongsTo(models.Calendar);
        Slot.hasOne(models.Appointment);
      }
    }
  });

  return Slot;
};