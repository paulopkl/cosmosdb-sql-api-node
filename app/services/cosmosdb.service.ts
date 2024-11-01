import { Container, CosmosClient, Database, FeedResponse, Item, JSONObject, SqlQuerySpec } from "@azure/cosmos";
import { ProductItem } from "../repository/entity/ProductItem.entity";
import { DefaultAzureCredential } from "@azure/identity";
import { ErrorEnitty } from "./entity/error.entity";
import { v4 as uuidv4 } from "uuid";

class CosmosDbService {
    private _cosmosDbClient: CosmosClient;
    private _container: Container;
    private _database: Database;

    constructor(client: CosmosClient, database: Database, container: Container) {
        this._cosmosDbClient = client;
        this._database = database;
        this._container = container;
    }

    static InitializeWithConfiguration({ databaseName, containerName }: { databaseName: string, containerName: string }) {
        const credential = new DefaultAzureCredential();

        const client = new CosmosClient({
            endpoint: process.env.COSMOSDB_ENDPOINT as string,
            key: process.env.COSMOSDB_KEY as string,
            // aadCredentials: credential,
        });

        const database: Database = client.database(databaseName);
        const container: Container = database.container(containerName);

        return new CosmosDbService(client, database, container);
    }

    // async function createDatabase() {
    //     const databaseId = "";

    //     // Create a database
    //     const { database } = await client.databases.createIfNotExists({ id: databaseId });
    //     console.log(`Database: ${database.id}`);

    //     // Create a container
    //     const { container } = await database.containers.createIfNotExists({ id: containerId });
    //     console.log(`Container: ${container.id}`);
    // }

    // Read all items
    async selectFromDatabaseAllItems() {
        const query = "SELECT * FROM items";
        const itemsResult = await this._container.items.query(query).fetchAll();

        return itemsResult.resources;
    }

    // Read an item
    async selectFromDatabaseById(id?: string, partitionKey?: string) {
        if (!id) id = "70b63682-b93a-4c77-aad2-65501347265f";
        if (!partitionKey) partitionKey = "gear-surf-surfboards";

        const itemResult = await this._container.item(id, partitionKey).read();

        if (itemResult.statusCode != 200) throw new Error("Error on reading item from database, something's wrong!");

        return itemResult.resource;
    }

    // Read an item from database getting by category name
    async selectFromDatabaseByCategoryName(category: string) {
        const querySpec: SqlQuerySpec = {
            query: 'SELECT * FROM items AS i WHERE i.category = @category',
            parameters: [
                {
                    name: '@category',
                    value: category
                }
            ]
        };

        let itemsResult: FeedResponse<ProductItem> = await this._container.items.query<ProductItem>(querySpec).fetchAll();

        return itemsResult.resources;
    }

    // Create an item
    async createOneItemOnDatabase(item: ProductItem) {
        try {
            if (!item.id) item.id = uuidv4();
            
            const result = await this._container.items.create(item, { disableAutomaticIdGeneration: true });
            
            return result;
        } catch (error: ErrorEnitty) {
            console.log(error);
            
            if (error.code === 409) {
                return {
                    statusCode: 409, 
                    message: "Entity with the specified id already exists in the system"
                }
            }

            return error.body.message;
        }
    }

    async updateItemOnDatabase(id: string, item: ProductItem) {
        try {
            const result = await this._container.items.batch([
                {
                    operationType: "Upsert",
                    resourceBody: { ...item, id }
                }
            ])

            return result;
        } catch (error: ErrorEnitty) {
            if (error.code === 404) {
                return {
                    statusCode: error.code, 
                    message: "Entity with the specified id does not exist in the system"
                }
            }
        }
    }

    // Delete the item
    async deleteOneItemOnDatabase(id: string) {
        try {
            const result = await this._container.item(id).delete();
            
            if (result.statusCode != 200) throw new Error("Error on delete item from database, something's wrong!");
    
            return result.item;
        } catch (error: ErrorEnitty) {
            if (error.code === 404) {
                return {
                    statusCode: error.code, 
                    message: "Entity with the specified id does not exist in the system"
                }
            }
        }
    }
}

export { CosmosDbService }