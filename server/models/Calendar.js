module.exports = function (sequelize, DataTypes) {
  var Calendar = sequelize.define('Calendar', {
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    url: { type: DataTypes.STRING, allowNull: false, unique: true },
    duration: { type: DataTypes.INTEGER, allowNull: false },
    startDate: { type: DataTypes.DATE, allowNull: false, field: 'start_date' },
    endDate: { type: DataTypes.DATE, allowNull: false, field: 'end_date' },
    published: { type: DataTypes.BOOLEAN, allowNull: false},
  }, {
    classMethods: {
      associate: function(models) {
        Calendar.belongsTo(models.User);
        Calendar.hasMany(models.Slot);
      }
    }
  });

  return Calendar;
};