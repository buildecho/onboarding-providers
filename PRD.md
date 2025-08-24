1. i would like to flatten the hierarchy to echo-<tupe>-<registry-type>-mirror where type terraform/pulumi/cloudformation and registry-type ecr/gar/harbor/jfrog/nexus according to the current integrations available in the repository dont invent new ones
2. the name of the output packages should also align
3. resource names provisioned by all types should be echo-mirror prefixed by default unless overridden from bullet 7
4. the consumers should be able to modify the resource names
5. everything should have conditional creation if a boolean create is passed as false it shouldnt provision any resources
6. pulumi packages should properly define component resources 
7. all modules should output usage instructions snippet that is queryable so customers can easily copy and the commands inorder to test the integration
8. besides of the usage instructions output the arns of the resources created
