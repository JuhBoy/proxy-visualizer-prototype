# Proxy client

- `main.ts` - Starts the app and creates an Application class. This is the app's **main process**.

You can learn more about each of these components within the [Quick Start Guide](http://electron.atom.io/docs/tutorial/quick-start).

## To Use

To clone and run this repository you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. From your command line:

```bash
# Clone this repository
git clone https://github.com/JuhBoy/proxy-visualizer-prototype.git
# Go into the repository
cd proxy-visualizer-prototype
# Install dependencies
npm install
# Run the app
npm run start
```

Note: If you're using Linux Bash for Windows, [see this guide](https://www.howtogeek.com/261575/how-to-run-graphical-linux-desktop-applications-from-windows-10s-bash-shell/) or use `node` from the command prompt.

Environment variables must be defined, here is the base set:
```bash
#Define the server port
PORT=8887
#Define the server host
HOST=localhost
#Define the application Name
NAME="Proxy Visualizer"
#Define the Envirnment (Devlopment|Production|Test)
ENV=Development
```

## Re-compile automatically

To recompile automatically and to allow using [electron-reload](https://github.com/yan-foto/electron-reload), run this in a separate terminal:

```bash
npm run watch
```

## License

[CC0 1.0 (Public Domain)](LICENSE.md)
