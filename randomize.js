/* 
Random randomizer function that randomizes names. This would be the module you can load for any operation.
*/

const { faker } = require('@faker-js/faker');
const { DataTypes } = require('sequelize');

function randomizeName() {
  return {
    firstname: faker.person.firstName(),
    lastname: faker.person.lastName()
  };
}

async function randomizeUserNames(sequelize) {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
  }, {
    tableName: 'users',
    timestamps: false
  });

  const users = await User.findAll();
  
  for (const user of users) {
    const { firstname, lastname } = randomizeName();
    await user.update({
      firstname: firstname,
      lastname: lastname
    });
  }
}

module.exports = {
  randomizeUserNames
};

