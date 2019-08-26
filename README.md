# Node Deploy Bot
Deployment Automation for NodeJS with Bitbucket

## Prerequirements
- forever (>= 1.0 required)
- git (required)
- node (>= 8.6 required) 

## Install
Download this repository and;

### 1. Install packages
``` bash
npm install
```

### 2. Rename config file
Rename sample file **config.yml.dist** to **config.yml**
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

----
## Slack Incoming Webhook
Incoming Webhooks are a simple way to post messages from apps into Slack. Creating an Incoming Webhook gives you a unique URL to which you send a JSON payload with the message text and some options. You can use all the usual markup and attachments with Incoming Webhooks to make the messages stand out.

How to find slack webhook url:
https://api.slack.com/incoming-webhooks

## Add a Bitbucket Webhook
*  Navigate to your Bitbucket repository. In the left navigation, select Settings.
![](https://docs.buddybuild.com/repository/bitbucket/img/click-settings.png)

*  Select Webhooks.
![](https://docs.buddybuild.com/repository/bitbucket/img/click-webhooks.png)

*  Click Add webhook..
![](https://docs.buddybuild.com/repository/bitbucket/img/click-add-webhook.png)

* In the Title field, enter **Node Deploy Bot** and paste your cretaed deploy url (http://yourserver.com:8080/mySecretPathName) into the URL field.

* Once that expands, select Push and click Save.
![](https://docs.buddybuild.com/repository/bitbucket/img/click-save.png)


You’re now done!

----

## Contributing
If you want to contribute to a project and make it better, your help is very welcome. Contributing is also a great way to learn more about social coding on Github, new technologies and and their ecosystems and how to make constructive, helpful bug reports, feature requests and the noblest of all contributions: a good, clean pull request.



