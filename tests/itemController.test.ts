import { Request, Response } from "express";
import ItemController from '../src/controllers/itemController';
import itemRepository from "../src/repositories/itemRepository";


describe('Item controller tests', () => {
    let mockItemRepository: jest.Mocked<itemRepository>;
    let controller: ItemController

    let mockRequest = (body = {}, params ={}, query ={}) => ({
        body,
        params,
        query
    })

    const mockResponse = () => {
        const res: any = {};
        res.status = jest.fn().mockReturnValue(res);
        res.json = jest.fn().mockReturnValue(res);
        return res;
    }

    const mockNext = jest.fn()

})