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

exports.sendEmail = (to, text, subject) => {
    return ses
        .sendEmail({
            Source: "Funky Chicken <funky.chicken@spiced.academy>",
            Destination: {
                ToAddresses: [to],
            },
            Message: {
                Body: {
                    Text: {
                        Data: text,
                    },
                },
                Subject: {
                    Data: subject,
                },
            },
        })
        .promise();
};
