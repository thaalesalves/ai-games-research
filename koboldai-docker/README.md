# KoboldAI on Docker
This repo has the definition for a Docker image that lets you run KoboldAI locally wihtout having to worry about installing Python or its dependencies. You'll just need Docker or Podman to run this.

# Usage
## What this is intended for
This was made with a slightly modified version of KoboldAI, one that binds itself to 0.0.0.0 instead of 127.0.0.1 just so it can be run with Docker. Other than that, it's the exact same KoboldAI of always.

## Running the server
There are two Jupyter Notebooks in this repo, that can be opened with Google Colab. You can also use the original colabs to run.
1. Open [Google Colab](https://colab.research.google.com/)
2. Click the "GitHub" tab (if a window with that tab doesn't open automatically, just go to File -> Open Notebook)
3. Type "thaalesalves/aid-scripts"
4. Select "main" as branch and "aid-scripts" as the repo
5. Select the one you'd like to use and follow the instructions (gpt-neo has 2.7B paramaters, and gpt-j has 6B)
PS: You can alternatively use the original notebooks. [GPT-Neo notebook](https://colab.research.google.com/drive/1uGe9f4ruIQog3RLxfUsoThakvLpHjIkX?usp=sharing) or [GPT-J notebook](https://colab.research.google.com/drive/1fGR6sYP4GMQxRgeqNiJ_SH8KRr8OBBRl?usp=sharing)

## Running the client
1. Install [Docker](https://www.docker.com/get-started) (if you're on Linux, I suggest using Podman instead of Docker)
2. Clone this repo locally with git
3. Open your terminal and cd your way into the folder where the repo was cloned
4. Run `docker build -t koboldai .` in the same folder where the Dockerfile is located and wait until it's built
5. Start the client by running `docker run -it -p 5000:5000 koboldai`
6. Select the Colab option and paste the address the colab notebook has generated for you
PS: the image is also available on Dockerhub. If you want to use the ready image, just skip steps 2 to 5, and run `docker run -it -p 5000:5000 docker.io/thaalesalves/koboldai` instead of the one without the complete image address.