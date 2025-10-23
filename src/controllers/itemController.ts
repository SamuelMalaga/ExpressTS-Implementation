import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/prisma';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import itemRepository from '../repositories/itemRepository';

// export const prisma = new PrismaClient();
const ItemRepository = new itemRepository();

// Create an item
export const createItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const item = { 
      name : req.body.name,
      description: req.body.description 
    };
    const newItem = await ItemRepository.createItem(item)
    res.status(201).json(newItem);
  } catch (error) {
    next(error);
  } 
};

// Read all items
export const getItems = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const allItems = await ItemRepository.getAllItems();
    res.json(allItems);
  } catch (error) {
    next(error);
  }
};

// Read single item
export const getItemById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const requestId = parseInt(req.params.id);
    const item = await ItemRepository.getItemById(requestId)
    if(item === null){res.status(404).json({"message":"item not found"})}
    res.json(item);
  } catch (error) {
    res.status(500).json({message: 'internal server error'})
    next(error);
  }
};

// Update an item
export const updateItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await prisma.$connect()
    const id = parseInt(req.params.id);
    const attrsToUpdate = {
      name : req.body.name,
      description : req.body.description
    }

    const item = await ItemRepository.updateItemById(id, attrsToUpdate)

    if(item === null){res.status(404).json({"message":"item not found"})}
    res.status(200).json(updateItem);
  } catch (error) {
    res.status(500).json({message: 'internal server error'})
    next(error);
  }
};

// Delete an item
export const deleteItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id);

    const item = await ItemRepository.deleteItemById(id);

    if(item === null){
      res.status(404).json({"message":"item not found"})
    }
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({message: 'internal server error'})
    next(error);
  }
};