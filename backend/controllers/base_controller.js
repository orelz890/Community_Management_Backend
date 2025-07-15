/**
 * BaseController
 * Provides base controller methods for common operations shared across resources.
 * Only includes:
 *   - getAll()
 *   - create()
 * Subclasses should implement update(), delete(), and getById() themselves.
 */
class BaseController {
  /**
   * @param {Object} service - The service layer object (must implement getAll() and create())
   */
  constructor(service) {
    if (!service) throw new Error("Service is required");
    this.service = service;

    // Bind methods to ensure 'this' context is correct
    this.getAll = this.getAll.bind(this);
    this.create = this.create.bind(this);
  }

  /**
   * Get all records for the model.
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getAll(req, res) {
    try {
      const result = await this.service.getAll();
      res.status(200).json(result);
    } catch (err) {
      console.error('[BaseController] Error in getAll:', err.message);
      console.log('[BaseController] service: ', this.service);
      res.status(500).json({ error: err.message });
    }
  }

  /**
   * Create a new record.
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async create(req, res) {
    try {
      const result = await this.service.create(req.body);
      res.status(201).json(result);
    } catch (err) {
      console.error('[BaseController] Error in create:', err);
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = BaseController;
