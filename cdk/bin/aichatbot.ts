#!/usr/bin/env node

import { App } from 'aws-cdk-lib';
import { AichatbotStage } from '../lib/stage';
import { AWS_ACCOUNT_ID, AWS_REGION } from '../lib/config';

const app = new App();

const env = { account: AWS_ACCOUNT_ID, region: AWS_REGION };

new AichatbotStage(app, 'Local', { env });
new AichatbotStage(app, 'Dev', { env });

app.synth();
