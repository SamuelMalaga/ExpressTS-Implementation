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

    beforeEach(() => {
        mockItemRepository = {
            createItem: jest.fn(),
            getAllItems: jest.fn(),
            updateItemById: jest.fn(),
            getItemById: jest.fn(),
            deleteItemById: jest.fn()
        } as unknown as jest.Mocked<itemRepository>;

        controller = new ItemController(mockItemRepository);
        jest.clearAllMocks();
    });

    describe('createItem', () => {
        it('on succesful request, create Item and return 201', async () =>{
            //Arrange
            const request = mockRequest(
                {
                    name:'Test', 
                    description:'A test description'
                } as any
            )
            const res = mockResponse();
            const newItem = {
                id: 1,
                name: 'Test',
                description: 'A test description'
            };

            //Act
            mockItemRepository.createItem.mockResolvedValueOnce(newItem);
            await controller.createItem(request as any, res as Response, mockNext)

            //Assert
            expect(mockItemRepository.createItem).toHaveBeenCalledWith({
                name: 'Test',
                description: 'A test description'
            });
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(newItem);
            expect(mockNext).not.toHaveBeenCalled();
        })
        it('On a request with null item name, return error and 422', async ()=>{
            //Arrange
            const request = mockRequest({name:null ,description:'A test description'} as any)
            const res = mockResponse();

            //Act
            await controller.createItem(request as any, res as Response, mockNext)

            //Assert
            expect(res.status).toHaveBeenCalledWith(422)
        })
        it('On a request with undefined item name, return error and 422', async ()=>{
            //Arrange
            const request = mockRequest({description:'A test description'} as any)
            const res = mockResponse();

            //Act
            await controller.createItem(request as any, res as Response, mockNext)

            //Assert
            expect(res.status).toHaveBeenCalledWith(422)
        })
        it('On a server internal error, return error message and 500', async ()=>{
            //Arrange
            const request = mockRequest({name:'Test', description:'A test description'} as any)
            const res = mockResponse();
            const errorMessage = {"message":'internal server error'}

            //Act
            mockItemRepository.createItem.mockImplementationOnce(() => {
                throw new Error();
            })
            await controller.createItem(request as any, res as Response, mockNext)

            //Assert
            expect(res.status).toHaveBeenCalledWith(500)
            expect(res.json).toHaveBeenCalledWith(errorMessage)
        })
    })
    

})