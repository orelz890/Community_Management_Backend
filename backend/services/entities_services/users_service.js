// services/users_service.js
const Users_T = require('../../models/entities/users');
const BaseService = require('./base_service');
const User_Details_T = require('../../models/entities/user_details'); // make sure this is at the top

class UsersService extends BaseService {
  constructor() {
    super(Users_T);
  }

  /**
   * Get a single user by user_id.
   * @param {number} user_id - ID of the user
   * @returns {Promise<Object|null>} User record or null
   */
  async getById(user_id) {
      console.log(`[UsersService] Fetching user by ID: ${user_id}`);
      return this.model.findByPk(user_id)
      .then(result => {
          console.log('[UsersService] Found user:', !!result);
          return result;
      })
      .catch(err => {
          console.error('[UsersService] Error in getById:', err.message);
          throw err;
      });
  }

  /**
   * Update a user by user_id.
   * @param {number} user_id - ID of the user
   * @param {Object} data - Data to update
   * @returns {Promise<Array>} Sequelize update result
   */
  async update(user_id, data) {
      console.log(`[UsersService] Updating user_id=${user_id}`, data);
      return this.model.update(data, { where: { user_id } })
      .then(result => {
          console.log('[UsersService] Update result:', result);
          return result;
      })
      .catch(err => {
          console.error('[UsersService] Error in update:', err.message);
          throw err;
      });
  }

    /**
   * Bulk insert multiple users.
   * @param {Array<Object>} usersArray - Array of user objects to insert.
   * Example:
   * [
      {
        "user_id": 202,
        "role": "admin",
        "seniority": "junior",
        "english_name": "Bob Johnson"
      },
      ...
    ]
   * @returns {Promise<Array>} Inserted user records
   */
  async bulkInsert(usersArray) {
    console.log('[UsersService] Bulk inserting users:', usersArray.length);

    const userIds = usersArray.map(user => user.user_id);

    return this.model.findAll({ where: { user_id: userIds } })
    .then(existingUsers => {
        const existingMap = {};
        for (const user of existingUsers) {
            existingMap[user.user_id] = user.dataValues;
        }

        // Merge new and existing user data
        const mergedUsers = usersArray.map(newUser => {
          const existing = existingMap[newUser.user_id] || {};
          const merged = {};
          for (const key of Object.keys(this.model.rawAttributes)) {
              merged[key] = this.getMergedValue(newUser[key], existing[key]);
          }
          return merged;
        });

        const updateFields = Object.keys(this.model.rawAttributes).filter(k => k !== 'user_id');

        return this.model.bulkCreate(mergedUsers, {
            updateOnDuplicate: updateFields,
            validate: true
        });
    })
    .then(result => {
        console.log('[UsersService] Inserted/Updated users count:', result.length);
        return result;
    })
    .catch(err => {
        console.error('[UsersService] Error in bulkInsert:', err.message);
        throw err;
    });
  }


  /**
   * Delete a user by user_id.
   * @param {number} user_id - ID of the user
   * @returns {Promise<number>} Number of rows deleted
   */
  async delete(user_id) {
      console.log(`[UsersService] Deleting user_id=${user_id}`);
      return this.model.destroy({ where: { user_id } })
      .then(result => {
          console.log('[UsersService] Delete result:', result);
          return result;
      })
      .catch(err => {
          console.error('[UsersService] Error in delete:', err.message);
          throw err;
      });
  }


  /**
   * Get all users joined with their details by user_id
   * @returns {Promise<Array<Object>>} Merged user and user_detail data
   */
  async getAllWithDetails() {
    console.log('[UsersService] Fetching users with details');

    return this.model.findAll()
      .then(users => {
          console.log('[UsersService] Fetched users:', users.length);
          return User_Details_T.findAll()
          .then(userDetails => {
              console.log('[UsersService] Fetched user details:', userDetails.length);

              const detailsMap = {};
              for (const detail of userDetails) {
                  detailsMap[detail.user_id] = detail.toJSON();
              }

              const merged = users.map(user => {
                  const base = user.toJSON();
                  const extra = detailsMap[base.user_id] || {};
                  return { ...base, ...extra };
              });

              console.log('[UsersService] Merged users with details:', merged.length);
              return merged;
          });
      })
      .catch(err => {
          console.error('[UsersService] Error in getAllWithDetails:', err.message);
          throw err;
      });
  }

}

module.exports = new UsersService();
