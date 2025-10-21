import { Request, Response } from "express";
import { createItem } from '../src/controllers/itemController';
import { prisma } from "../src/config/prisma";


jest.mock('../src/config/prisma', () => ({
    prisma: {
      $connect: jest.fn(),
      $disconnect: jest.fn(),
      item: {
        create: jest.fn(),
      },
    },
  }));


describe('Item Controller tests', () => {
    const mockReq = (body = {}) => ({body} as any);
    const mockRes = () => {
        const res: any ={};
        res.status = jest.fn().mockReturnValue(res);
        res.json = jest.fn().mockReturnValue(res);
        return res;
    };
    const next = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    })

    it('Should create Item', async ()=>{
        const req = mockReq({name:'Test', description:'Test Item'})
        const res = mockRes();

        (prisma.item.create as jest.Mock).mockResolvedValue({
            id:1,
            name:'Test',
            description:'Test Item'
        })

        await createItem(req, res, next);

        expect(prisma.$connect).toHaveBeenCalled();
        expect(prisma.item.create).toHaveBeenCalledWith({
            data: { name: 'Test', description: 'Test Item' },
        })
        expect(prisma.$disconnect).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            id:1,
            name:'Test',
            description:'Test Item'
        });
    });
})