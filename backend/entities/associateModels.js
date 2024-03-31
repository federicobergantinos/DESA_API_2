const User = require("./user");
const Transaction = require("./transaction");
const Media = require("./media");
const Authorization = require("./auth");
const Account = require("./account");

// Definiciones de relación existentes
Authorization.belongsTo(User, { as: "user", foreignKey: "userId" });
Transaction.hasMany(Media, { as: "media", foreignKey: "transactionId" });
Transaction.belongsTo(User, { as: "user", foreignKey: "userId" });
User.hasMany(Transaction, { as: "transactions", foreignKey: "userId" });
Account.belongsTo(User, { as: "user", foreignKey: "userId" });
User.hasMany(Account, { as: "account", foreignKey: "userId" });

module.exports = {
  User,
  Transaction,
  Media,
};
