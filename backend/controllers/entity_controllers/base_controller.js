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
    console.log('[BaseController] getAll() called');
    this.service.getAll()
      .then(result => {
          console.log('[BaseController] getAll() succeeded');
          res.status(200).json(result);
      })
      .catch(err => {
          console.error('[BaseController] getAll() failed:', err.message);
          console.log('[BaseController] Service instance:', this.service);
          res.status(500).json({ error: err.message });
      });
  }

  /**
   * Create a new record.
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async create(req, res) {
    console.log('[BaseController] create() called with:', req.body);
    this.service.create(req.body)
      .then(result => {
        console.log('[BaseController] create() succeeded');
        res.status(201).json(result);
      })
      .catch(err => {
        console.error('[BaseController] create() failed:', err.message);
        res.status(500).json({ error: err.message });
      });
  }
}

module.exports = BaseController;
