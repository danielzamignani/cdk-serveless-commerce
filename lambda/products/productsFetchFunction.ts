import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { ProductRepository } from "/opt/nodejs/productsLayer";
import { DynamoDB } from "aws-sdk";
import * as AWSXRay from "aws-xray-sdk";

AWSXRay.captureAWS(require('aws-sdk'));

const productsDdb = process.env.PRODUCTS_DDB!;
const ddbClient = new DynamoDB.DocumentClient();
const productRepository = new ProductRepository(ddbClient, productsDdb);

export async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
    const apiRequestId = event.requestContext.requestId;
    const lambdaRequestId = context.awsRequestId;
    const method = event.httpMethod;

    console.log(`API Gateway ResquestId: ${apiRequestId} - Lambda RequestId: ${lambdaRequestId}`);

    if (event.resource === '/products') {
        if (method === 'GET') {
            console.log('GET /products/');

            const products = await productRepository.getAllProducts();

            return {
                statusCode: 200,
                body: JSON.stringify(products)
            }
        }
    }

    if (event.resource === '/products/{id}') {
        const productId = event.pathParameters!.id as string;

        console.log(`GET /products/${productId}`);

        try {
            const product = await productRepository.getProductById(productId);

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

    return {
        statusCode: 404,
        body: JSON.stringify({
            message: 'Not Found'
        })
    }
}