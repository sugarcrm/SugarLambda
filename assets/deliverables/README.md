This directory holds the plain CloudFormation template and instructions to package assets for customer installation without the need of AWS SAM.

## Steps to package resources

### Create CloudFormation template
Create a plain CloudFormation template with no dependencies to AWS SAM. 

1. Change directory to `SugarLambda/` (where the main SAM `template.yml` is)
2. Run `sam validate --debug` to convert SAM template to plain template
3. Copy the output template
4. Manually add new pieces to `CloudFormation_Template.yml`

After retrieving the plain CloudFormation template in the console, be sure to `diff` it against the existing `CloudFormation_Template.yml`. It may not a 1:1 mapping, so some manual customizations may be needed. (E.g: for new Lambda functions, the `Properties:Code` block needs to be updated to reflect the actual S3 location)

### Zip assets
These assets will be zipped into SugarLive_Features.zip with the following structure:

```
- SugarLive_Features.zip
  - Deployment_Guide.pdf
  - CloudFormation_Template.yml
  - Lambda.zip
  - Portal_Chat.zip
    - Lex_Bot.zip
    - SugarCRM_Portal_Chat_Contact_Flow-v1.0.json
```

1. In `SugarLambda/` directory, create `Lambda.zip`
    - `zip -r Lambda-v1.0.zip src node_modules`
    - `mv Lambda-v1.0.zip assets/deliverables/`
2. Change directory into this directory (`SugarLambda/assets/deliverables`)
3. Create `Portal_Chat.zip`
    - Copy the necessary files into this directory
      - `cp ../../Lex/SugarServeSampleBot.zip .`
      - `cp ../../ContactFlows/SugarCRM_Portal_Chat_Contact_Flow-v1.0 .`
    - Zip the files
      - `zip -m Portal_Chat.zip SugarCRM_Portal_Chat_Contact_Flow-v1.0 SugarServeSampleBot.zip`
4. Import the deployment guide into this directory
5. Create `SugarLive_Features.zip`
    - `zip SugarLive_Features-v1.0.zip Deployment_Guide-v1.0.pdf CloudFormation_Template-v1.0.yml Lambda-v1.0.zip Portal_Chat.zip`
