import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import { ProductRepository, Product } from "/opt/nodejs/productsLayer";

const productsDdb = process.env.PRODUCTS_DDB!;
const ddbClient = new DynamoDB.DocumentClient();
const productRepository = new ProductRepository(ddbClient, productsDdb);

export async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
    const apiRequestId = event.requestContext.requestId;
    const lambdaRequestId = context.awsRequestId;
    const method = event.httpMethod;

    console.log(`API Gateway ResquestId: ${apiRequestId} - Lambda RequestId: ${lambdaRequestId}`);

    if (event.resource === '/products') {
        console.log('POST /products/');

        const product = JSON.parse(event.body!) as Product;
        const productCreated = await productRepository.createProduct(product);

        return {
            statusCode: 201,
            body: JSON.stringify(productCreated)
        }
    }

    if (event.resource === '/products/{id}') {
        const productId = event.pathParameters!.id as string;

        if (method === 'PUT') {
            console.log(`PUT /products/${productId}`);

            const product = JSON.parse(event.body!) as Product;

            try {
                const productUpdated = await productRepository.updateProduct(productId, product);

                return {
                    statusCode: 201,
                    body: JSON.stringify(productUpdated)
                }
            } catch (error) {
                return {
                    statusCode: 404,
                    body: 'Product not found'
                }
            }
        }

        if (method === 'DELETE') {
            const productId = event.pathParameters!.id as string;

            console.log(`DELETE /products/${productId}`);

            try {
                const product = await productRepository.deleteProduct(productId);

                return {
                    statusCode: 200,
                    body: JSON.stringify(product)
                }
            } catch (error) {
                console.error((<Error>error).message);

                return {
                    statusCode: 404,
                    body: (<Error>error).message
                }
            }
        }
    }

    return {
        statusCode: 404,
        body: JSON.stringify({
            message: 'Not Found'
        })
    }
}