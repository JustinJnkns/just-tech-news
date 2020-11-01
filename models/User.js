const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection')
const bcrypt = require('bcrypt')
    //create User model
class User extends Model {
    //method to run on instance data(per use) to check password
    checkPassword(loginPw) {
        return bcrypt.compareSync(loginPw, this.password)
    }
}

User.init({
    // define an id column
    id: {

        type: DataTypes.INTEGER,

        allowNull: false,

        primaryKey: true,

        autoIncrement: true
    },
    // define a username column
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    // define an email column
    email: {
        type: DataTypes.STRING,
        allowNull: false,

        unique: true,

        validate: {
            isEmail: true
        }
    },
    // define a password column
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {

            len: [4]
        }
    }
}, {
    hooks: {
        //encrypts password before user object is created
        async beforeCreate(newUserData) {
            newUserData.password = await bcrypt.hash(newUserData.password, 10)
            return
        },
        async beforeUpdate(updatedUserData) {
            updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
            return updatedUserData;
        }
    },
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'user'
});

module.exports = User