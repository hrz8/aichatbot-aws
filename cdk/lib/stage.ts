import { Stage, StageProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { AichatbotStack } from './stack';

export class AichatbotStage extends Stage {
  constructor(scope: Construct, stageName: string, props: StageProps) {
    super(scope, stageName, props);
    new AichatbotStack(this, { stageName });
  }
}
