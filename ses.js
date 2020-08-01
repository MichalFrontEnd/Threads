const aws = require("aws-sdk");

let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    secrets = require("./secrets"); // in dev they are in secrets.json which is listed in .gitignore
}

const ses = new aws.SES({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET,
    region: "eu-central-1",
});

exports.sendEmail = (to, name, code, subject) => {
    return ses
        .sendEmail({
            Source: "Threads <miyako.front@gmail.com>",
            Destination: {
                ToAddresses: [to],
            },
            Message: {
                Body: {
                    Text: {
                        Data: `Dear ${name}, here is your temporary code for updating your password: 

                    ${code}.
                        
                    This code will expire in 10 minutes.

                    You will be redirected to the next page shortly. Don't forget to set up a new password for your accout.
                        
                    Thank you,

                    Your Threads team.`,
                    },
                },
                Subject: {
                    Data: subject,
                },
            },
        })
        .promise();
};
