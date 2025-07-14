// function createGenericController(service) {
//   return {
//     async create(req, res) {
//       try {
//         const result = await service.create(req.body);
//         res.status(201).json(result); // 201 Created
//       } catch (err) {
//         res.status(500).json({ error: err.message });
//       }
//     },

//     async getAll(req, res) {
//       try {
//         const result = await service.getAll();
//         res.status(200).json(result); // 200 OK
//       } catch (err) {
//         res.status(500).json({ error: err.message });
//       }
//     },

//     async getById(req, res) {
//       try {
//         const result = await service.getById(req.params.id);
//         if (!result) return res.status(404).json({ message: 'Not found' });
//         res.status(200).json(result); // 200 OK
//       } catch (err) {
//         res.status(500).json({ error: err.message });
//       }
//     },

//     async update(req, res) {
//       try {
//         const result = await service.update(req.params.id, req.body);
//         if (!result) return res.status(404).json({ message: 'Not found' });
//         res.status(200).json(result); // 200 OK
//       } catch (err) {
//         res.status(500).json({ error: err.message });
//       }
//     },

//     async delete(req, res) {
//       try {
//         const rowsDeleted = await service.delete(req.params.id);
//         if (!rowsDeleted) return res.status(404).json({ message: 'Not found' });
//         res.status(200).json({ message: 'Deleted successfully' }); // 200 OK
//       } catch (err) {
//         res.status(500).json({ error: err.message });
//       }
//     }
//   };
// }

// module.exports = createGenericController;
