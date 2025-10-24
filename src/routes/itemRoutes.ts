import { Router } from 'express';
import itemController from '../controllers/itemController';
import itemRepository from '../repositories/itemRepository';

const IRep = new itemRepository();
const IController = new itemController(IRep)

const router = Router();

router.get('/', IController.getItems.bind(IController));
router.get('/:id', IController.getItemById.bind(IController));
router.post('/', IController.createItem.bind(IController));
router.put('/:id', IController.updateItem.bind(IController));
router.delete('/:id', IController.deleteItem.bind(IController));

export default router;