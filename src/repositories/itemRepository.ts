import { prisma } from '../config/prisma';
import { Item } from '@prisma/client';

export default class itemRepository {

    async createItem(itemData:Record<string, string>): Promise<Item> {
        const result = await prisma.item.create({
            data:{
                name: itemData.name,
                description: itemData.description 
            }
        })
        
        return result;
    }

    async getAllItems(): Promise<Array<Item>>{
        const result = await prisma.item.findMany();

        return result;
    }
}