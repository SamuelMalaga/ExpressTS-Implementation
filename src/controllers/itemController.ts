import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/prisma';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import itemRepository from '../repositories/itemRepository';

// export const prisma = new PrismaClient();
// const ItemRepository = new itemRepository();

export default class ItemController{

  itemRepository: itemRepository;

  constructor(itemRepository: itemRepository) {
    this.itemRepository = itemRepository
  }

  async createItem (req: Request, res: Response, next: NextFunction){
    try {
      if(req.body.name === null || req.body.name === undefined){
        res.status(422).json({message:'Missing required parameter name'})
      }
      const item = { 
        name : req.body.name,
        description: req.body.description 
      };
      const newItem = await this.itemRepository.createItem(item)
      res.status(201).json(newItem);
    } catch (error) {
      res.status(500).json({message: 'internal server error'})
      next(error);
    } 
  };
  
  // Read all items
  async getItems (req: Request, res: Response, next: NextFunction){
    try {
      const allItems = await this.itemRepository.getAllItems();
      res.json(allItems);
    } catch (error) {
      res.status(500).json({message: 'internal server error'})
      next(error);
    }
  };
  
  // Read single item
  async getItemById(req: Request, res: Response, next: NextFunction) {
    try {
      const requestId = parseInt(req.params.id);
      const item = await this.itemRepository.getItemById(requestId)
      if(item === null){res.status(404).json({"message":"item not found"})}
      res.json(item);
    } catch (error) {
      res.status(500).json({message: 'internal server error'})
      next(error);
    }
  };
  
  // Update an item
  async updateItem (req: Request, res: Response, next: NextFunction){
    try {
      await prisma.$connect()
      const id = parseInt(req.params.id);
      const attrsToUpdate = {
        name : req.body.name,
        description : req.body.description
      }
  
      const item = await this.itemRepository.updateItemById(id, attrsToUpdate)
  
      if(item === null){res.status(404).json({"message":"item not found"})}
      res.status(200).json(this.updateItem);
    } catch (error) {
      res.status(500).json({message: 'internal server error'})
      next(error);
    }
  };
  
  // Delete an item
  async deleteItem(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
  
      const item = await this.itemRepository.deleteItemById(id);
  
      if(item === null){
        res.status(404).json({"message":"item not found"})
      }
      res.status(200).json(item);
    } catch (error) {
      res.status(500).json({message: 'internal server error'})
      next(error);
    }
  };
}
// Create an item
