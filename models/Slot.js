module.exports = function (sequelize, DataTypes) {
  var Slot = sequelize.define('Slot', {
    date: { type: DataTypes.DATE, allowNull: false },
    time: { type: DataTypes.TIME, allowNull: false },
    status: { type: DataTypes.BOOLEAN, allowNull: false}
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