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

    async getItemById(itemId:number): Promise<Item | null> {
        const foundItem = prisma.item.findUnique({
            where:{
                id:itemId
            }
        })
        return foundItem
    }

    async updateItemById(itemId:number,attributes:Record<string, string>):Promise<Item | null>{
        const updatedItem = prisma.item.update({
            where:{
                id: itemId
            },
            data:attributes
        })

        return updatedItem;
    }

    async deleteItemById(itemId:number): Promise<Item | null>{
        const itemToDelete = await this.getItemById(itemId);
        if (itemToDelete === null){
            return itemToDelete
        } else {
            const deletedItem = prisma.item.delete({where:{id:itemId}});
            return deletedItem;
        }
    }
}