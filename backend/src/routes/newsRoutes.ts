import express from 'express';
import { 
  getPersonalizedNews, 
  getNewsByCategory, 
  searchNews, 
  saveNews, 
  getSavedNews, 
  deleteSavedNews, 
  fetchAndStoreNews 
} from '../controllers/newsController';
import { protect, admin } from '../middlewares/authMiddleware';

const router = express.Router();

// Rutas públicas
router.get('/category/:categoryId', getNewsByCategory);
router.get('/search', searchNews);

// Rutas protegidas
router.get('/personalized', protect, getPersonalizedNews);
router.post('/save/:newsId', protect, saveNews);
router.get('/saved', protect, getSavedNews);
router.delete('/saved/:newsId', protect, deleteSavedNews);

// Rutas de administrador
router.post('/fetch', protect, admin, fetchAndStoreNews);

export default router; 