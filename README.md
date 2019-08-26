# Node Deploy Bot
Deployment Automation for NodeJS with Bitbucket

## Prerequirements
- forever
- git
- node (>= 8.6 required) 

## Install
Download this repository and,

### 1. Install packages
``` bash
npm install
```

### 2. Rename config file
``` bash
mv config.yml.dist config.yml 
```

### 3. Configuration
```yaml
server:
  # web service port number
  port: 8080 
slack:
  # slack application webhook url.  
  webhook: "https://hooks.slack.com/services/ [ SLACK HOOK URL HERE ]"
  # slack message channel.  
  channel: "#deploy" 
  # slack application username.  
  username: "deploybot"
  # if you want welcome message on start. Set to true.
  welcome: true
bitbucket:
  # cretae a bitbucket webhook url and put path name here. 
  # ex. http://yourserver.com:8080/mySecretPathName  ---> handler: "/mySecretPathName" 
  handler:  "/[ BITBUCKET WEB HOOK PATH HERE ]"
  branches:
    master:
      # Live project path on your server
      deployment: "/var/projects/[ PROJECT LIVE PATH ON SERVER ]/"
      # if you need "git reset --hard" command set true
      gitreset: true
      # if you need "npm install" command set true
      npminstall: true
      # if you want slack notification set true
      notification: true
      # auto restart project with "forever restart index.js" command after deployment.
      
    development:
      # Development project path on your server
      deployment:  "/var/projects/[ PROJECT DEVELOPMENT PATH ON SERVER ]/"
      gitreset: true
      npminstall: true
      notification: true
      
    # you can add new branch config here...
```

### 4. Start for testing
``` bash
npm run start
```
### 5. Start service
``` bash
forever start index.js
```
