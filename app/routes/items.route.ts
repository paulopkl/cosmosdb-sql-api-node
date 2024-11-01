import { Router } from "express";
import { ItemsController } from "./controllers/items.controller";
import { CosmosDbService } from "../services/cosmosdb.service";

const router = Router();

const cosmosDbService = CosmosDbService.InitializeWithConfiguration({
    databaseName: process.env.COSMOSDB_DATABASE_NAME as string, 
    containerName: process.env.COSMOSDB_CONTAINER_NAME as string
});

const itemsController = new ItemsController(cosmosDbService);

router.get("/", itemsController.getAllItems.bind(itemsController));
router.get("/:id", itemsController.getItem.bind(itemsController));
router.get("/category/:categoryName", itemsController.getItemByCategoryName.bind(itemsController));


router.post("/", itemsController.createItem.bind(itemsController));
router.put("/:id", itemsController.updateItem.bind(itemsController));
router.delete("/:id", itemsController.deleteItem.bind(itemsController));


export default router;
