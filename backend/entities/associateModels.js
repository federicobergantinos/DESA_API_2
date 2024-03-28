const User = require("./user");
const Transaction = require("./transaction");
const Media = require("./media");
const Authorization = require("./auth");

// Definiciones de relación existentes
Authorization.belongsTo(User, { as: "user", foreignKey: "userId" });
Transaction.hasMany(Media, { as: "media", foreignKey: "transactionId" });
Transaction.belongsTo(User, { as: "user", foreignKey: "userId" });
User.hasMany(Transaction, { as: "transactions", foreignKey: "userId" });
// User.belongsToMany(Transaction, { through: Favorite, foreignKey: "userId" });
// Transaction.belongsToMany(User, {
//   through: Favorite,
//   foreignKey: "transactionId",
// });

module.exports = {
  User,
  Transaction,
  Media,
};
