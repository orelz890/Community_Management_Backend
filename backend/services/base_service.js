// class BaseService {
//   constructor(model) {
//     if (!model) throw new Error('Model is required');
//     this.model = model;
//     this.primaryKey = model.primaryKeyAttribute; // dynamic PK

//     console.log(`[BaseService] Using primary key: ${this.primaryKey}`);

//   }

//   async create(data) {
//     return await this.model.create(data);
//   }

//   async getAll() {
//     return await this.model.findAll();
//   }

//   async getById(id) {
//     return await this.model.findOne({
//       where: { [this.primaryKey]: id }
//     });
//   }

//   async update(id, newData) {
//     const instance = await this.model.findOne({
//       where: { [this.primaryKey]: id }
//     });
//     if (!instance) return null;
//     return await instance.update(newData);
//   }

//   async delete(id) {
//     return await this.model.destroy({
//       where: { [this.primaryKey]: id }
//     });
//   }
// }

// module.exports = BaseService;
