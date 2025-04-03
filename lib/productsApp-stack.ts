import * as lambda from "aws-cdk-lib/aws-lambda";
import * as lambdaNodeJs from "aws-cdk-lib/aws-lambda-nodejs";
import * as cdk from "aws-cdk-lib";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";

export class ProductsAppStack extends cdk.Stack {
    readonly productsDdb: dynamodb.Table;
    readonly procuctsFetchHandler: lambdaNodeJs.NodejsFunction;
    readonly procuctsAdminHandler: lambdaNodeJs.NodejsFunction;

    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        this.productsDdb = new dynamodb.Table(this, 'ProductsDdb', {
            tableName: 'products',
            removalPolicy: cdk.RemovalPolicy.DESTROY, // Para facilitar os testes
            partitionKey: {
                name: 'id',
                type: dynamodb.AttributeType.STRING,
            },
            billingMode: dynamodb.BillingMode.PROVISIONED,
            readCapacity: 1,
            writeCapacity: 1
        });

        this.procuctsFetchHandler = new lambdaNodeJs.NodejsFunction(this, 'ProductsFetchFunction', {
            functionName: 'ProductsFetchFunction',
            entry: 'lambda/products/productsFetchFunction.ts',
            handler: 'handler',
            memorySize: 512,
            timeout: cdk.Duration.seconds(5),
            bundling: {
                minify: true,
                sourceMap: false
            },
            runtime: lambda.Runtime.NODEJS_20_X,
            environment: {
                PRODUCTS_DDB: this.productsDdb.tableName
            }
        });

        this.procuctsAdminHandler = new lambdaNodeJs.NodejsFunction(this, 'ProductsAdminFunction', {
            functionName: 'ProductsAdminFunction',
            entry: 'lambda/products/productsAdminFunction.ts',
            handler: 'handler',
            memorySize: 512,
            timeout: cdk.Duration.seconds(5),
            bundling: {
                minify: true,
                sourceMap: false
            },
            runtime: lambda.Runtime.NODEJS_20_X,
            environment: {
                PRODUCTS_DDB: this.productsDdb.tableName
            }
        });

        this.productsDdb.grantWriteData(this.procuctsAdminHandler);
    }
}