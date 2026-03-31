Comprobot is available to install with both `pipx` and `pip`. However, I recommend installing it using `pipx`, since it is designed to install Python applications tools such as Comprobot. This guide is fully self-written, no AI used.

## Installing Python and `pip`

Before we get started with installing Comprobot, you first have to install Python (since Comprobot is coded in Python). 
### Windows

> ⚠︎ I don't personally own a Windows machine, so I had to rely on YouTube tutorials and other documentation. If you run into any issues, you can join my [Discord server](https://discord.gg/g6rZtmQgbK) and write a message in the *\#bug-reports* channel with all the details of the error.
#### Verify Python installation 

First off, you should make sure that you don't have Python installed already. You can do that by opening the PowerShell and typing the following command:

```powershell
python --version
```

If it returns something like `Python 3.14.3`, you already have Python installed, so you can skip the next section. If it returns an error on the other hand, you still have to install it. This process is explained in detail in the next section.

#### Download and install Python

To install Python on Windows, download the latest Installer from the [official Website](https://www.python.org/downloads/). When it's finished downloading, open the Installer and check "Add Python to PATH". Then click "Install now".

#### Verify `pip` installation

Next, you're gonna wanna install `pip`, the built-in Python package manager. To ensure that it isn't already installed, run the following command in PowerShell.

```powershell
pip --version
```

If it returns something like `pip 26.0.1 from ...`, you already have it installed and can skip the next section. If it returns an error on the other hand, you first have to install it again. 

#### Install `pip`

To install `pip`, you have to right click [this link](https://bootstrap.pypa.io/pip/get-pip.py) and click "Save link as". Then choose Desktop as the location, and make sure the name of the file is `get-pip.py`. Next, right click on your Desktop and click "Open PowerShell window here". A PowerShell window should open. Next, run the following command to execute the script.

```powershell
python ./get-pip.py
```

Next, run the following command. It should return an error.

```powershell
pip --version
```

In the error details, there should be a path for a directory, e.g. `C:\Users\Username\AppData\Local\Programs\Python\Python314\Scripts`. Copy that path from the error details. Next, hit the Windows key on your keyboard (or click the Windows logo in the taskbar) and type "Edit the system environment variables", and click on the first option. A window called "System Properties" should open. Click on the "Environment Variables..." button. Another window should open called "Environment variables" with two lists in it. In the top list, click "PATH" and then "Edit". Then, click on one of the empty spots and paste the path that you copied from the error message and press Enter and click OK. 

#### Final check

Next, to make sure that everything worked, execute the following command in a new PowerShell window.

```powershell
pip --version
```

If it returns something like `pip 26.0.1 from ...`, then congratulations, you made it through the entire Python installation process!

### MacOS

#### Verify Python installation

Before installing Python, you want to make sure that you don't already have Python installed. To check, open the Terminal app and run the following command.

```bash
python3 --version
```

If it returns something like `Python 3.10.14`, you already have Python installed, so you can skip the next section. If it returns an error however, you need to install Python first.

#### Download and install Python and `pip`

To download and install Python on MacOS, head to the [official Python website](https://www.python.org/downloads/) and download the latest installer for MacOS. As soon as the installer is finished downloading, open it and click "Continue" until you the License Agreement shows up. Click "Agree" and then "Install". You will probably be prompted to enter your password. Enter it and click "Install Software". If the installer prompts you to access any files or folders, click "OK". If a Finder window pops up, close it and return to the installer. As soon as the installation is finished, click "Close", and then "Move to Bin". 

>If you already have Homebrew installed, you can also install Python using Homebrew, by running `brew install python3`.

#### Final check

Now, you should have Python and `pip` installed. To check, run the two following commands.

```bash
python3 --version
```

```bash
pip3 --version
```

If one of the commands returns an error, drop me a message under *\#bug-reports* on my [Discord server](https://discord.gg/g6rZtmQgbK). 

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

This will install Python, including `pip`, the built-in package manager for Python and the Virtual Environment module, which is also needed. 

#### Final check

To verify that Python and `pip` are installed, run the following commands.

```bash
python3 --version
pip3 --version
```

If they return the version numbers, you're good to go. Otherwise, you can always drop me a message in the *\#bug-reports* channel on my [Discord server](https://discord.gg/g6rZtmQgbK).


## Installing `pipx`

To install Comprobot, I recommend using `pipx`, a command-line tool designed to install Python applications. Here is how to install it.

### Windows

First of all, check if you already have `pipx` installed by running the following command. If it returns the version number, you can skip to the installation of Comprobot.

```powershell
pipx --version
```

To install `pipx` on Windows, you first have to run the following command. 

```powershell
python -m pip install --user pipx
```

After that, you want to add it to your PATH. This is easily done by running the following command.

```powershell
python -m pipx ensurepath
```

Next, you have to restart your terminal. After that, run the following command to ensure that `pipx` is in your PATH.

```powershell
pipx --version
```

If it prints the version number, you're good to go.

### MacOS

The process of installing `pipx` on MacOS is pretty much the same as on Windows. You can install it by running the following command.

```bash
python -m pip install --user pipx
```

>Again, if you prefer Homebrew, you can also install `pipx` with Homebrew by running `brew install pipx`.

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

Then, check if you already have `pipx` installed. If the following command returns a version number, skip to the installation of Comprobot.

```bash
pipx --version
```

To install `pipx`, simply use `apt` to install it with the following command.

```bash
sudo apt install pipx
```

Once it's done installing, you can check if everything worked by running the following command. If it returns a version number, you're good to go.

```bash
pipx --version
```


## Install Comprobot

Now that you have all the required packages installed, we can proceed to install the actual bot. You can do that easily on all three operating systems with the following command.

```bash
pipx install comprobot
```
