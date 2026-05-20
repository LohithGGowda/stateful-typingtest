/**
 * AWS-themed paragraphs used as typing prompts.
 * Each entry is a self-contained sentence set covering a core AWS service.
 */
const paragraphs = [
  // EC2
  "Amazon EC2 provides resizable compute capacity in the cloud. You can launch virtual servers called instances, configure security and networking, and manage storage. EC2 supports a wide range of instance types optimized for different workloads, from general-purpose to compute-intensive and memory-optimized configurations.",

  // S3
  "Amazon S3 is an object storage service offering industry-leading scalability, data availability, security, and performance. You can store and retrieve any amount of data from anywhere on the web. S3 provides features like versioning, lifecycle policies, and cross-region replication to help manage your data effectively.",

  // Lambda and Serverless
  "AWS Lambda lets you run code without provisioning or managing servers. You pay only for the compute time you consume. Lambda automatically scales your application by running code in response to each trigger, such as changes to data in an S3 bucket or an update to a DynamoDB table.",

  // VPC and Networking
  "Amazon VPC lets you provision a logically isolated section of the AWS Cloud where you can launch resources in a virtual network you define. You have complete control over your virtual networking environment, including selection of your own IP address range, creation of subnets, and configuration of route tables and network gateways.",

  // IAM and Security
  "AWS Identity and Access Management enables you to manage access to AWS services and resources securely. Using IAM, you can create and manage AWS users and groups, and use permissions to allow and deny their access to AWS resources. IAM supports multi-factor authentication and fine-grained access control policies.",
];

export default paragraphs;
