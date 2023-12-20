# Next.js Frontend Template

This project is a Next.js frontend template designed to kickstart your web development projects. It integrates Tailwind CSS for styling and TypeScript for type-safe coding, providing a robust foundation for building modern web applications.

## Getting Started

Follow these steps to set up your own frontend based on this template.

### Prerequisites

Before you begin, ensure you have the following installed:

- Docker
- Dev Containers extension in Visual Code

### Installation

Start by cloning this repository to your local machine:

```bash
git clone https://your-repository-url.git
cd your-repository-name
```

### Development

1. **Open the project in a dev container**

   As you can see, there is a .devcontainer folder at the root of the project. Dev Containers allow you to open any folder inside a container and develop directly in the correct environment without needing to build everytime. If you want to learn more about Dev Containers, see [here](https://code.visualstudio.com/docs/devcontainers/containers).

   To start the development environment, make sure you installed the Dev Containers extension and click on the green arrows on the lower left corner of the window (see picture).

   ![alt text](https://code.visualstudio.com/assets/docs/devcontainers/tutorial/remote-status-bar.png)

   You will see a menu appear, click on "Reopen in Container". You should now be in the development environment with a terminal to interact with it.

2. **Install and build**

   First, install the requirements.

```bash
   pnpm install
```

Next, run the development website.

```bash
   pnpm dev
```

You can now access your website on the localhost and port written in the terminal. You can develop your website and it will refresh automatically the website at any change.

3. **Create your website**

   You can modify the main page in `frontend/src/pages/index.tsx`. You can create new pages and routes in that same folder, and create new components that you want to use in several pages (like a header or a footer) in the `components` folder.

### Production

Once you are satisfied with your website, you will prepare it for production-level deployment.

1. **Write tests**

   Modify the tests and create new ones in `frontend/__tests__/` for the different pages and components of your application. You can see an example of test for the Home component.

2. **Update your deployment method**

   The current method setup for deployment is through Kubernetes. Please update the Kubernetes configuration in `deploy` or change the CI/CD pipeline in `jenkins` to use another method.

3. **Create a Jenkins pipeline**

   Commit your code to a Gitlab account. Next, to create the CI/CD pipeline, go to the Jenkins main page and create a new folder. In this folder, you will configure two elements: the first stage of the build which creates the base image to run a NextJS app, and the second stage which builds, tests and deploys your website.
   The first one is a Pipeline, with the Jenkinsfile path `jenkins/stage1.jenkinsfile`. The second element is a Pipeline Multibranches with Jenkinsfile path `jenkins/stage2.jenkinsfile`. For more information on the configuration, you can see the original pipeline [here](https://jenkins.horus-graph.intranet.chuv/jenkins/job/100-DS/job/Template%20frontend/).

   Once this is set up, everytime you push your code to GitLab it will trigger the pipeline, run the tests and deploy the new website.

4. **If you want to test your production-ready website on your local machine**

   You can build your production application from the root:

```bash
   cd docker
   ./build-stage1.sh # this step can be done only once
   docker build -f dockerfiles/stage2.dockerfile -t prod-app ..
   docker run -p <some port>:80 -d prod-image
```

Then you can access your website on localhost:<the port you put>.
