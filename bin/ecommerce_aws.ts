#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { ProductsAppStack } from '../lib/productsApp-stack';
import { ECommerceApiStack } from '../lib/ecommerceApi-stack';

const env: cdk.Environment = {
  account: '458285809726',
  region: 'us-east-1'
}

const tags = {
  cost: 'ECommerce',
  team: 'daniel.zamigani'
}

const app = new cdk.App();

const producsAppStack = new ProductsAppStack(app, 'ProductsApp', { tags, env });

const eCommerceApiStack = new ECommerceApiStack(app, 'ECommerceApi', {
  tags,
  env,
  procuctsFetchHandler: producsAppStack.procuctsFetchHandler,
  procuctsAdminhHandler: producsAppStack.procuctsAdminHandler
});
eCommerceApiStack.addDependency(producsAppStack);
