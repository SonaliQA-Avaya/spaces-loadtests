# Dependencies
`npm install`

## Local Development
`npm run start:dev`

# Build Image
Change the GCP projet variable for the location of the image in `Taskfile.yml` . 

task build-image

# Deploying
Create a vm instance inside the GCP project and select the image that you created in the previous step. Be sure that the http port is open and the machine has an external IP. This is the IP to use when deploying the fake users.
