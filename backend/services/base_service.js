class BaseService {
  constructor(model) {
    if (!model) throw new Error('Model is required');
    this.model = model;
    console.log(`[BaseService] Initialized with model: ${model.name}`);
  }

  async create(data) {
    try {
        console.log(`[BaseService] Creating new ${this.model.name} with data:`, data);
        const result = await this.model.create(data);
        console.log(`[BaseService] Created:`, result);
      return result;
    } catch (err) {
        console.error(`[BaseService] Error in create:`, err.message);
        throw err;
    }
  }

  async getAll() {
    try {
        console.log(`[BaseService] Fetching all records from ${this.model.name}`);
        const result = await this.model.findAll();
        console.log(`[BaseService] Fetched ${result.length} records`);
        return result;
    } catch (err) {
        console.error(`[BaseService] Error in getAll:`, err.message);
        throw err;
    }
  }
}

module.exports = BaseService;
