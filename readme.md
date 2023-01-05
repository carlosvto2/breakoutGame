# 🚨 NOTE 🚨
## Prerequisites

You'll need Node.js, npm and Parcel installed.

It is highly recommended to use [Node Version Manager](https://github.com/nvm-sh/nvm) (nvm) to install Node.js and npm and [Node Version Manager for Windows](https://github.com/coreybutler/nvm-windows) for Windows users (this project was tested with windows).

Install Node.js and `npm` with `nvm`:

```bash
nvm install node

nvm use node
```

Replace 'node' with 'latest' for `nvm-windows` (nvm install latest).

Then install Parcel:

```bash
npm install -g parcel-bundler
```

## Getting Started

Clone this repository to your local machine:

```bash
git clone https://github.com/carlosvto2/breakoutGame.git
```

This will create a folder named `breakoutGame`. You can specify a different folder name like this:

```bash
git clone https://github.com/carlosvto2/breakoutGame.git my-folder-name
```

Go into your new project folder and install dependencies:

```bash
cd breakoutGame # or 'my-folder-name'
npm install
```

Start development server:

```
npm run start
```

To create a production build:

```
npm run build
```

Production files will be placed in the `dist` folder. Then upload those files to a web server. 🎉

## Project Structure

```
    .
    ├── dist
    ├── node_modules
    ├── public
    |   ├── assets
    |   |   ├── audio
    |   │   │   ├── hit.mp3
    |   |   ├── images
    |   │   │   ├── ball.png
    |   |   ├── json
    |   │   │   ├── levels.json
    ├── src
    │   ├── scenes
    │   │   ├── Breakout.ts
    │   ├── scripts
    │   │   ├── Level.ts
    │   ├── index.html
    │   ├── main.ts
    ├── package.json
```

### Assets

Any assets like images or audio files should be placed in the `public` folder. It'll then be served at http://localhost:8000/images/

There is another folder in public called `json`. This folder contains two files:
* [Breakout.json](./public/assets/json/breakout.json): this file contains the information to get a specific frame from the `breakout.png`image.
* [Levels.json](./public/assets/json/levels.json): this file help us to build all the levels for our game. This is structured like this to control all the details of our levels from this json file.
  * `lives`: number of lives the player will have for this level.
        - `walls`: this has an array of walls for the level, with the position, rotation and scale.
        - `paddles`: it also possible to create a level with several paddles. This array contains the position of the paddles and other important information.
        - `brickPosition`: here we defined the position of each brick structured by rows. The `brickPosition` variable contains an array of rows, where each row defines the position for the bricks. So that the row "[1,1,1,0,0,0,0,0,0,0,0]" will have bricks in the first, second and third position, but nothing in the rest.
        - `brickColor`: same mechanism as the `brickPosition` but to indicate the color of each brick.

### Src folder

TypeScript files are intended for the `src` folder. `main.ts` is the entry point referenced by `index.html`.

In the `scenes` folder are saved all the scenes for the game:
    - [MainMenu.ts](./src/scenes/MainMenu.ts): First scene to be shown to the player
    - [Breakout.ts](./src/scenes/Breakout.ts): Main scene where the game will take place
    - [GameOver.ts](./src/scenes/GameOver.ts): Scene to be shown when the player loses
    - [Victory.ts](./src/scenes/Victory.ts): Scene to be shown when the player wins the game

The `scripts` folder contains the class scripts with the proper information to create he objects for the game:
    - [Ball](./src/scripts/Ball.ts): It has the configuration to create a ball
    - [Brick](./src/scripts/Brick.ts): It has the configuration to create a brick
    - [Level](./src/scripts/Level.ts): It has the configuration to prepare and create a whole level
    - [Paddle](./src/scripts/Paddle.ts): It has the configuration to create a paddle
    - [Buff](./src/scripts/Buff.ts): Buff to create a new ball


## Dev Server Port

You can change the dev server's port number by modifying the `start` script in `package.json`. We use Parcel's `-p` option to specify the port number.

The script looks like this:

```
parcel src/index.html -p 8000
```

Change 8000 to whatever you want.
