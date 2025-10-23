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
    await prisma.$connect()
    const item = await prisma.item.findFirstOrThrow({
      where:{
        id: requestId
      }
    })
    res.json(item);
  } catch (error) {
    if (error === PrismaClientKnownRequestError){
      res.status(404).json({message: 'item not found'})
    } else {
      res.status(500).json({message: 'internal server error'})
    }
    next(error);
  }
  finally {
    await prisma.$disconnect()
  }
};

// Update an item
export const updateItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await prisma.$connect()
    const id = parseInt(req.params.id);
    const name  = req.body.name;
    const description = req.body.description;

    const updateItem = await prisma.item.update({
      where: {
        id: id,
      },
      data: {
        name: name,
        description: description,
      }
    })

    res.json(updateItem);
  } catch (error) {
    if (error === PrismaClientKnownRequestError){
      res.status(404).json({message: 'item not found'})
    } else {
      res.status(500).json({message: 'internal server error'})
    }
    next(error);
  }
  finally {
    await prisma.$disconnect()
  }
};

// Delete an item
export const deleteItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await prisma.$connect()
    const id = parseInt(req.params.id);

    const deletedItem = prisma.item.delete({
      where: {
        id:id
      }
    })
    res.json(deletedItem);
  } catch (error) {
    if (error === PrismaClientKnownRequestError){
      res.status(404).json({message: 'item not found'})
    } else {
      res.status(500).json({message: 'internal server error'})
    }
    next(error);
  }
  finally {
    await prisma.$disconnect()
  }
};