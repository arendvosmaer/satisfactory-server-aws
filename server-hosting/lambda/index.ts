import { DescribeInstancesCommand, EC2Client, StartInstancesCommand, StopInstancesCommand } from "@aws-sdk/client-ec2";
import { APIGatewayEvent} from "aws-lambda";

const instanceId = process.env.INSTANCE_ID;
const client = new EC2Client({ region: process.env.AWS_REGION });
const startCommand = new StartInstancesCommand({ InstanceIds: [instanceId!] });
const describeCommand = new DescribeInstancesCommand({ InstanceIds: [instanceId!] });
const stopCommand = new StopInstancesCommand({ InstanceIds: [instanceId!] });

exports.handler = async function (event: APIGatewayEvent) {
  if (event.path === "/start") {

    console.log("Attempting to start game server", instanceId);

    return client.send(startCommand)
      .then((res) => {
        console.log(JSON.stringify(res));
        return {
          statusCode: 200,
          headers: { "Content-Type": "text/json" },
          body: JSON.stringify({ message: "Started satisfactory server", response: JSON.stringify(res) })
        }
      })
      .catch((err) => {
        console.log(JSON.stringify(err));
        return {
          statusCode: 200,
          headers: { "Content-Type": "text/json" },
          body: JSON.stringify({ message: "Failed to start satisfactory server", response: JSON.stringify(err) })
        }
      });
  }

  if (event.path === "/stop") {
    console.log("Attempting to stop game server", instanceId);

    return client.send(stopCommand)
      .then((res) => {
        console.log(JSON.stringify(res));
        return {
          statusCode: 200,
          headers: { "Content-Type": "text/json" },
          body: JSON.stringify({ message: "Stopped satisfactory server", response: JSON.stringify(res) })
        }
      }).catch((err) => {
        console.log(JSON.stringify(err));
        return {
          statusCode: 500,
          headers: { "Content-Type": "text/json" },
          body: JSON.stringify({ message: "Failed to stop satisfactory server", response: JSON.stringify(err) })
        }
      });
  }

  return client.send(describeCommand).then((res) => {
    console.log(JSON.stringify(res));
    return {
      statusCode: 200,
      headers: { "Content-Type": "text/json" },
      body: JSON.stringify(res)
    }
  })
}
