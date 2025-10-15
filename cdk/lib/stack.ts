import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { createInferenceLambda } from './lambda_inference';
import { createDspMcpLambda } from './lambda_dspmcp';

const stackName = 'AichatbotStack';

export interface AichatbotStackProps extends StackProps {
  stageName: string;
}

export class AichatbotStack extends Stack {
  constructor(scope: Construct, props: AichatbotStackProps) {
    super(scope, stackName, props);

    createInferenceLambda(this, props.stageName);
    createDspMcpLambda(this, props.stageName);
  }
}
