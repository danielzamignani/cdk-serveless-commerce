#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { ProductsAppStack } from '../lib/productsApp-stack';
import { ECommerceApiStack } from '../lib/ecommerceApi-stack';
import { ProductsAppLayersStack } from '../lib/productsAppLayers-stack';

const env: cdk.Environment = {
  account: '458285809726',
  region: 'us-east-1'
}

const tags = {
  cost: 'ECommerce',
  team: 'daniel.zamigani'
}

const app = new cdk.App();

const productsAppLayersStack = new ProductsAppLayersStack(app, 'ProductsAppLayers', {tags, env});

const productsAppStack = new ProductsAppStack(app, 'ProductsApp', { tags, env });
productsAppStack.addDependency(productsAppLayersStack);

const eCommerceApiStack = new ECommerceApiStack(app, 'ECommerceApi', {
  tags,
  env,
  procuctsFetchHandler: productsAppStack.procuctsFetchHandler,
  procuctsAdminhHandler: productsAppStack.procuctsAdminHandler
});
eCommerceApiStack.addDependency(productsAppStack);
