import { Request, Response } from "express";
import { CosmosDbService } from "../../services/cosmosdb.service";

class ItemsController {
    private _cosmosDbService: CosmosDbService;

    constructor(cosmosDbService: CosmosDbService) {
        this._cosmosDbService = cosmosDbService;
    }

    async getAllItems(_req: Request, res: Response): Promise<any> {        
        const result = await this._cosmosDbService.selectFromDatabaseAllItems();
    
        return res.status(200).json(result);
    };
    
    async getItem(req: Request, res: Response): Promise<any> {
        const id = req.params.id;

        if (!id) return res.status(400).json({ error: "id is not valid!" });
    
        const result = await this._cosmosDbService.selectFromDatabaseById(id);
    
        return res.status(200).json(result);
    };

    async getItemByCategoryName(req: Request, res: Response): Promise<any> {
        const categoryName = req.params.categoryName;

        if (!categoryName) return res.status(400).json({ error: "categoryName is not valid!" });
    
        const result = await this._cosmosDbService.selectFromDatabaseByCategoryName(categoryName);
    
        return res.status(200).json(result);
    };
    
    async createItem(req: Request, res: Response): Promise<any> {
        const item = req.body;
        
        if (!item || Object.keys(item).length == 0) return res.status(400).json({ error: "body request is empty!" });
    
        const result = await this._cosmosDbService.createOneItemOnDatabase(item);

        if (result.message) return res.status(result.statusCode).json(result);

        return res.status(200).json("Item created!");
    };

    async updateItem(req: Request, res: Response): Promise<any> {
        const id = req.params.id;
        const item = req.body;
        
        if (!id || id.length == 0) return res.status(400).json({ error: "id is not valid!" });
        if (!item || Object.keys(item).length == 0) return res.status(400).json({ error: "body request is empty!" });

        const result = await this._cosmosDbService.updateItemOnDatabase(id, item);

        return res.status(200).json(result);
    }
    
    async deleteItem(req: Request, res: Response): Promise<any> {
        const id = req.params.id;
    
        if (!id || id.length == 0) return res.status(400).json({ error: "id is not valid!" });
    
        const result = await this._cosmosDbService.deleteOneItemOnDatabase(id);
    
        return res.status(200).json(result);
    };
}

export { ItemsController }
