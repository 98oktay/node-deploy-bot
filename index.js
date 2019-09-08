const http = require('http');
const {spawn} = require('child_process');
const Slack = require('slack-node');
const yaml = require('js-yaml');
const fs = require('fs');
const createHandler = require('node-bitbucket-webhook');

let config = {};

try {config = yaml.safeLoad(fs.readFileSync('config.yml', 'utf8'))} catch (e) {}

const slack = new Slack();
slack.setWebhook(config.slack.webhook);

const handlers = [];
config.bitbucket.projects.forEach((project)=>{
    const handler = createHandler([{path: project.handler}]);
    handlers.push(handler);

    handler.on('error', function (err) {
        console.error('Error:', err.message);
    });

    handler.on('push', function (event) {
        const newEvent = event.payload.push.changes[0].new;
        const isForcePush = event.payload.push.changes[0].forced;
        const name = newEvent.name;
        const summary = newEvent.target.summary.raw;
        const author = newEvent.target.author.raw;

        console.log('Received a push event:', name, newEvent, summary, author);

        const {branches} = project;
        if (Object.keys(branches).indexOf((name)) !== -1) {
            const branchConfig = branches[name];

            if (branchConfig.deployment) {
                if (branchConfig.gitreset) {
                    resetProject(branchConfig.deployment, branchConfig);
                } else if (branchConfig.npminstall) {
                    pullProject(branchConfig.deployment, branchConfig);
                }else if (branchConfig.npmBuild) {
                    npmBuild(branchConfig.deployment, branchConfig);
                }
            }

            if (branchConfig.notification) {
                slack.webhook({
                    channel: config.slack.channel,
                    username: config.slack.username,
                    "text": "*" + author.split(" ")[0] + "* changed `" + name + "` branch. " + (isForcePush ? "`*FORCE PUSH*`" : ""),
                    "attachments": [
                        {
                            "title": summary,
                            "color": "#3AA3E3",
                            "attachment_type": "default",
                        }
                    ]

                }, function (err, response) {
                    console.log(response);
                });
            }
        }
    });

});


http.createServer(function (req, res) {
    handlers.forEach((handler)=>{
        handler(req, res, function (err) {
            res.statusCode = 404;
            res.end()
        })
    });
}).listen(config.server.port);

console.info('Webhook started.');
if(config.slack.welcome) {
    slack.webhook({
        channel: config.slack.channel,
        username: config.slack.username,
        text: "Webhook started."
    }, function (err, response) {
        console.log(response);
    });
}


function resetProject(projectPath, branchConfig) {

    let gitreset = spawn('git', ['reset', '--hard'], {cwd: projectPath});

    gitreset.on('close', (code) => {
        console.log(`git reset exited with code ${code}`);
        pullProject(projectPath, branchConfig);
    });
}

function pullProject(projectPath, branchConfig) {

    let gitpull = spawn('git', ['pull'], {cwd: projectPath});

    gitpull.stdout.on('data', (data) => {
        console.log(`git pull stdout: ${data}`);
    });

    gitpull.stderr.on('data', (data) => {
        console.log(`git pull stderr: ${data}`);
    });

    gitpull.on('close', (code) => {
        console.log(`git pull exited with code ${code}`);
        if (branchConfig.npminstall) {
            npmInstall(projectPath, branchConfig);
        } else if (branchConfig.npmBuild) {
            npmBuild(branchConfig.deployment, branchConfig);
        }
    });

}

function npmInstall(projectPath, branchConfig) {

    let npminstall = spawn('npm', ['install'], {cwd: projectPath});

    npminstall.stdout.on('data', (data) => {
        console.log(`npm install stdout: ${data}`);
    });

    npminstall.stderr.on('data', (data) => {
        console.log(`npm install stderr: ${data}`);
    });

    npminstall.on('close', (code) => {
        console.log(`npm install exited with code ${code}`);
        restartApp(projectPath, branchConfig);
    });
}

function npmBuild(projectPath, branchConfig) {

    let npminstall = spawn('npm', ['run','build'], {cwd: projectPath});

    npminstall.stdout.on('data', (data) => {
        console.log(`npm install stdout: ${data}`);
    });

    npminstall.stderr.on('data', (data) => {
        console.log(`npm install stderr: ${data}`);
    });

    npminstall.on('close', (code) => {
        console.log(`npm install exited with code ${code}`);
    });
}

function restartApp(projectPath, branchConfig) {

    let npminstall = spawn('forever', ['restart', 'index.js'], {cwd: projectPath});

    npminstall.stdout.on('data', (data) => {
        console.log(`npm install stdout: ${data}`);
    });

    npminstall.stderr.on('data', (data) => {
        console.log(`npm install stderr: ${data}`);
    });

    npminstall.on('close', (code) => {
        console.log(`npm install exited with code ${code}`);
    });
}
