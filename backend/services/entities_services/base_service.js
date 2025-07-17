class BaseService {
  constructor(model) {
    if (!model) throw new Error('Model is required');
    this.model = model;
    console.log(`[BaseService] Initialized with model: ${model.name}`);
  }

  getMergedValue(newVal, existingVal) {
    return newVal !== undefined && newVal !== null && newVal !== '' ? newVal : existingVal;
  }
  
  async create(data) {
      console.log(`[BaseService] Creating new ${this.model.name} with data:`, data);
      return this.model.create(data)
      .then(result => {
            console.log(`[BaseService] Created new ${this.model.name}:`, result);
            return result;
      })
      .catch(err => {
            console.error(`[BaseService] Error in create:`, err.message);
            throw err;
      });
  }

  async getAll() {
      console.log(`[BaseService] Fetching all records from ${this.model.name}`);
      return this.model.findAll()
      .then(result => {
          console.log(`[BaseService] Fetched ${result.length} records from ${this.model.name}`);
          return result;
      })
      .catch(err => {
          console.error(`[BaseService] Error in getAll:`, err.message);
          throw err;
      });
  }

}

module.exports = BaseService;
