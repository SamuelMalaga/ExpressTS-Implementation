import { Request, Response, NextFunction } from 'express';
import { Item } from '../models/item';
import { Prisma, PrismaClient } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

const prisma = new PrismaClient();


// Create an item
export const createItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const  name  = req.body.name;
    const description = req.body.description;
    const item = { 
      name : name,
      description: description 
    };

    await prisma.$connect();

    const newItem = await prisma.item.create(
      {data:item}
    )

    // await items.push(newItem);
    res.status(201).json(newItem);
  } catch (error) {
    next(error);
  } finally {
    await prisma.$disconnect()
  }
};

// Read all items
export const getItems = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await prisma.$connect();
    const allItems = await prisma.item.findMany();
    res.json(allItems);
    await prisma.$disconnect()
  } catch (error) {
    next(error);
  } finally {
    await prisma.$disconnect()
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