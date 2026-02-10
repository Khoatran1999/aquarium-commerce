import { Router } from 'express';
import * as speciesService from '../services/species.service.js';
import { success, paginated } from '../utils/response.js';

const router = Router();

// GET /api/species
router.get('/', async (req, res, next) => {
  try {
    const { species, total, page, limit } = await speciesService.listSpecies(req.query as any);
    paginated(res, species, { page, limit, total });
  } catch (err) {
    next(err);
  }
});

// GET /api/species/:id
router.get('/:id', async (req, res, next) => {
  try {
    const species = await speciesService.getSpeciesById(req.params.id);
    success(res, species);
  } catch (err) {
    next(err);
  }
});

export default router;
