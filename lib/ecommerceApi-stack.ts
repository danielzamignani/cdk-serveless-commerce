import * as lambdaNodeJs from "aws-cdk-lib/aws-lambda-nodejs";
import * as cdk from "aws-cdk-lib";
import * as apiGateway from "aws-cdk-lib/aws-apigateway";
import * as cwlogs from "aws-cdk-lib/aws-logs";

import { Construct } from "constructs";

interface ECommerceApiStackProps extends cdk.StackProps {
    procuctsFetchHandler: lambdaNodeJs.NodejsFunction;
    procuctsAdminhHandler: lambdaNodeJs.NodejsFunction;
}

export class ECommerceApiStack extends cdk.Stack {

    constructor(scope: Construct, id: string, props: ECommerceApiStackProps) {
        super(scope, id, props);

        const logGroup = new cwlogs.LogGroup(this, 'ECommerceApiLogs')

        const api = new apiGateway.RestApi(this, 'ECommerceApi', {
            cloudWatchRole: true,
            restApiName: 'ECommerceApi',
            deployOptions: {
                accessLogDestination: new apiGateway.LogGroupLogDestination(logGroup),
                accessLogFormat: apiGateway.AccessLogFormat.jsonWithStandardFields({
                    httpMethod: true,
                    ip: true,
                    protocol: true,
                    requestTime: true,
                    resourcePath: true,
                    responseLength: true,
                    status: true,
                    caller: true,
                    user: true
                })
            }
        });

        //Integrations
        const productsFetchIntegration = new apiGateway.LambdaIntegration(props.procuctsFetchHandler);
        const producstAdminIntegration = new apiGateway.LambdaIntegration(props.procuctsAdminhHandler);
       
        //Products Resources
        const productsResource = api.root.addResource('products');
        productsResource.addMethod('GET', productsFetchIntegration);
        productsResource.addMethod('POST', producstAdminIntegration);
        
        //Products ID Resources
        const productsIdResource = productsResource.addResource('{id}');
        productsIdResource.addMethod('GET', productsFetchIntegration);
        productsIdResource.addMethod('PUT', producstAdminIntegration);
        productsIdResource.addMethod('DELETE', producstAdminIntegration);
    }
}