import { Duration, aws_lambda, aws_ssm } from 'aws-cdk-lib';
import { Construct } from 'constructs';

const DEFAULT_ENV_VARS = {
  AWS_LAMBDA_EXEC_WRAPPER: '/opt/bootstrap',
  AWS_LWA_INVOKE_MODE: 'response_stream',
  AWS_LWA_PORT: '3000',
  RUN_IN_LAMBDA: 'true',
};

export function createInferenceLambda(scope: Construct, stage: string): {
  func: aws_lambda.Function,
  funcUrl: aws_lambda.FunctionUrl
} {
  const functionName = 'InferenceFunction';
  const functionUrlName = 'InferenceFunctionUrl';
  const configParamName = 'InferenceConfig';

  const configParam = aws_ssm.StringParameter.fromStringParameterAttributes(
    scope,
    configParamName,
    {
      parameterName: `/${stage.toLowerCase()}/aichatbot/inference/config`,
    },
  );

  const lambdaWebAdapterLayer = aws_lambda.LayerVersion.fromLayerVersionArn(
    scope,
    'LambdaWebAdapterLayer',
    'arn:aws:lambda:us-east-1:753240598075:layer:LambdaAdapterLayerX86:25'
  );

  const func = new aws_lambda.Function(scope, functionName, {
    code: aws_lambda.Code.fromAsset('../src/lambdas/inference/lambda.zip'),
    runtime: aws_lambda.Runtime.NODEJS_22_X,
    handler: 'run.sh',
    architecture: aws_lambda.Architecture.X86_64,
    layers: [
      lambdaWebAdapterLayer
    ],
    memorySize: 512,
    timeout: Duration.seconds(180),
    environment: {
      ...DEFAULT_ENV_VARS,
      CONFIG_YAML: configParam.stringValue,
    },
  });

  const funcUrl = new aws_lambda.FunctionUrl(scope, functionUrlName, {
    function: func,
    authType: aws_lambda.FunctionUrlAuthType.NONE,
    invokeMode: aws_lambda.InvokeMode.RESPONSE_STREAM,
    cors: {
        allowCredentials: true,
        allowedHeaders: [
          'x-amz-security-token',
          'x-amz-date',
          'x-amz-content-sha256',
          'referer',
          'content-type',
          'accept',
          'authorization',
        ],
        allowedMethods: [aws_lambda.HttpMethod.ALL],
        allowedOrigins: ['*'],
        maxAge: Duration.seconds(0),
      },
  });

  return {
    func,
    funcUrl,
  }
}
