---
position: "2"
---

Comprobot is available to install with both pipx and pip. However, I recommend installing it using pipx, since it is designed to install Python applications tools such as Comprobot. This guide is fully self-written, no AI used.

---

## Installing Python and pip

Before we get started with installing Comprobot, you first have to install Python (since Comprobot is coded in Python).

### Windows

> ⚠︎ I don't personally own a Windows machine, so I had to rely on YouTube tutorials and other documentation. If you run into any issues, you can join my [Discord server](https://discord.gg/g6rZtmQgbK) and write a message in the _bug-reports_ channel with all the details of the error.

#### Verify Python installation

First off, you should make sure that you don't have Python installed already. You can do that by opening the PowerShell and typing the following command:

```powershell
python --version
```

If it returns something like `Python 3.14.3`, you already have Python installed, so you can skip the next section. If it returns an error on the other hand, you still have to install it. This process is explained in detail in the next section.

#### Download and install Python

To install Python on Windows, download the latest Installer from the [official Website](https://www.python.org/downloads/). When it's finished downloading, open the Installer and check "Add Python to PATH". Then click "Install now".

Modern Python installers (3.4+) include pip by default, so you don't need to install it separately.

#### Final check

To verify that Python and pip are installed, run the following commands in a new PowerShell window.

```powershell
python --version
pip --version
```

If they return version numbers, you're good to go!

### MacOS

#### Verify Python installation

Before installing Python, you want to make sure that you don't already have Python installed. To check, open the Terminal app and run the following command.

```bash
python3 --version
```

If it returns something like `Python 3.10.14`, you already have Python installed, so you can skip the next section. If it returns an error however, you need to install Python first.

#### Download and install Python and pip

To download and install Python on MacOS, head to the [official Python website](https://www.python.org/downloads/) and download the latest installer for MacOS. As soon as the installer is finished downloading, open it and click "Continue" until you the License Agreement shows up. Click "Agree" and then "Install". You will probably be prompted to enter your password. Enter it and click "Install Software". If the installer prompts you to access any files or folders, click "OK". If a Finder window pops up, close it and return to the installer. As soon as the installation is finished, click "Close", and then "Move to Bin".

> If you already have Homebrew installed, you can also install Python using Homebrew, by running `brew install python3`.

#### Final check

Now, you should have Python and pip installed. To check, run the two following commands.

```bash
python3 --version
```

```bash
pip3 --version
```

If one of the commands returns an error, you can submit a report the _bug-reports_ channel on my [Discord server](https://discord.gg/g6rZtmQgbK).

### Linux

This guide is designed mainly for Ubuntu, but it also works for other distributions that use the `apt` package manager, such as Debian and Raspberry Pi OS.

#### Update packages

Before we get started with installing Python, make sure that all your packages are up-to-date with the following commands.

```bash
sudo apt update
sudo apt upgrade
```

#### Verify Python installation

Before installing Python, you first want to check if you already have it installed. You can do that by running the following command.

```bash
python3 --version
```

#### Install Python

Installing Python on Linux is really easy. You can just use the built-in package manager `apt` to install it with the following command.

```bash
sudo apt install python3 python3-pip python3-venv
```

This will install Python, including pip, the built-in package manager for Python and the Virtual Environment module, which is also needed.

#### Final check

To verify that Python and pip are installed, run the following commands.

```bash
python3 --version
pip3 --version
```

If they return the version numbers, you're good to go. Otherwise, you can always submit a report in the _bug-reports_ channel on my [Discord server](https://discord.gg/g6rZtmQgbK).

---

## Installing pipx

To install Comprobot, I recommend using pipx, a command-line tool designed to install Python applications. Here is how to install it.

### Windows

First of all, check if you already have pipx installed by running the following command. If it returns the version number, you can skip to the installation of Comprobot.

```powershell
pipx --version
```

To install pipx on Windows, you first have to run the following command.

```powershell
python -m pip install --user pipx
```

After that, you want to add it to your PATH. This is easily done by running the following command.

```powershell
python -m pipx ensurepath
```

Next, you have to restart your terminal. After that, run the following command to ensure that pipx is in your PATH.

```powershell
pipx --version
```

If it prints the version number, you're good to go.

### MacOS

The process of installing pipx on MacOS is pretty much the same as on Windows. You can install it by running the following command.

```bash
python -m pip install --user pipx
```

> Again, if you prefer Homebrew, you can also install pipx with Homebrew by running `brew install pipx`.

Next, to add it to your PATH, run the following command.

```bash
python -m pipx ensurepath
```

Finally, restart your terminal and run the following command to make sure everything worked.

```bash
pipx --version
```

### Linux

First, you want to update your system again with the following commands.

```bash
sudo apt update
sudo apt upgrade
```

Then, check if you already have pipx installed. If the following command returns a version number, skip to the installation of Comprobot.

```bash
pipx --version
```

To install pipx, simply use `apt` to install it with the following command.

```bash
sudo apt install pipx
```

Once it's done installing, you can check if everything worked by running the following command. If it returns a version number, you're good to go.

```bash
pipx --version
```

---

## Install Comprobot

Now that you have all the required packages installed, we can proceed to install the actual bot. You can do that easily on all three operating systems with the following command.

```bash
pipx install comprobot
```

---

## Setting up the Discord bot

Since you now have all the files on your machine, we now have to take care of the bot itself. To add it to your server, follow the following steps.

### Creating the bot

To create the discord bot, head to the [Discord Developer Portal](https://discord.com/developers/applications) and sign into your Discord account.

- Click on the "New Application"
- Give your Bot a cool name.
- Check the Checkbox on
- Click "Create"

### Customizing the appearance

You should now be in the configuration window of your bot.

- Customize your bot's app icon in the "General Information" tab
- To customize the bot's avatar and banner, head to the "Bot" section in the sidebar
- Here, you can set a custom avatar and banner and a few other things, such as the username.

### Setting the bot token

- Next, click the "Reset token" button
- Click "Yes, do it!"
- Authenticate with your Passkey or similar if prompted.
- Click on "Copy"
- Store the token somewhere safe where you can access it later.
- If you want, you can also check the "Public bot" setting off, so that only you can add the bot to servers (leave it on if you aren't the admin of the server you want to add the bot to, since the bot will have to be added by the admin)

### Generating the invite link

- Head to the "OAuth2" tab
- Scroll down to "OAuth2 URL Generator"
- Check only the box "bot" on.
- Scroll down to "Bot permissions"
- Only check "Administrator" on.
- Scroll down to the generated URL
- Copy the URL

### Adding the bot to the server

Now, you can open the link in a new tab, select the wanted server and click "Authorize". If you are not the admin of the server the bot should be added to, send the link to the server owner so they can add the bot themselves.

---

## Customizing the settings

Now, you want to add the bot token that you saved before to the bot. For that, you want to head to the data directory of your bot. To get the data directory, run the bot through your terminal with the following command.

```bash
comprobot
```

The output should look something like this:

```
Configuration directory: /path/to/configuration/files
Error: BOT_TOKEN not found in environment variables
```

Copy the path that is displayed after "Configuration directory". Open a new window of your terminal and run the following command (replace the example path with your copied path)

```bash
cd /path/to/configuration/files
```

Then run the following command to open the .env file, based on your operating system.

Windows:

```powershell
start .env
```

MacOS or Linux:

```bash
open .env
```

Paste the token for the Discord bot that you saved before like this. If you want, you can also add your API keys for the AI functionalities too. I recommend using [Groq](https://console.groq.com/keys), as it offers a wide range of free small models with high rate limits for completely free.

```
BOT_TOKEN=YOUR_DISCORD_BOT_TOKEN
GEMINI=YOUR_GEMINI_API_KEY
GROQ=YOUR_GROQ_API_KEY
```

Save the file and open a new terminal window. Run the following command to start the bot.

```bash
comprobot
```

It should return something like the following.

```
Configuration directory: /Users/Username/Library/Application Support/Comprobot
2026-03-31 15:15:01 INFO     discord.client logging in using static token
2026-03-31 15:15:03 INFO     discord.gateway Shard ID None has connected to Gateway (Session ID: 1234567890).
Logged in as Comprobot
```

Now, head to the discord server and run a test command, such as `!play`. If it works, then congratulations, you've successfully set up Comprobot! You can customize all of the settings in the `.toml` files in the configuration directory.

Thanks for using Comprobot! I really appreciate it. If you like it, I would be glad if you told your friends about it too!
