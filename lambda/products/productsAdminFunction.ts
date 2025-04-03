import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";

export async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
    const apiRequestId = event.requestContext.requestId;
    const lambdaRequestId = context.awsRequestId;
    const method = event.httpMethod;

    console.log(`API Gateway ResquestId: ${apiRequestId} - Lambda RequestId: ${lambdaRequestId}`);

    if (event.resource === '/products') {
            console.log('POST /products/');

            return {
                statusCode: 201,
                body: JSON.stringify({
                    message: 'POST /products/'
                })
            }
    }

    if(event.resource === '/products/{id}') {
        const productId = event.pathParameters!.id as string;

        if (method === 'PUT') {
            console.log(`PUT /products/${productId}`);
    
            return {
                statusCode: 201,
                body: JSON.stringify({
                    message: 'PUT /products/${productId}'
                })
            }
        }

        if (method === 'DELETE') {
            const productId = event.pathParameters!.id as string;
            console.log(`DELETE /products/${productId}`);
    
            return {
                statusCode: 204,
                body: JSON.stringify({
                    message: 'DELETE /products/${productId}'
                })
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