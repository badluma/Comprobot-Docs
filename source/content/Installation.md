---
position: "2"
---
## Package Managers
### pipx (All platforms)

```sh
pipx install comprobot
```

### APT (Ubuntu/Debian/Kali)

```sh
# If add-apt-repository isn't found, run this first:
# sudo apt install software-properties-common
sudo add-apt-repository ppa:badluma/ppa
sudo apt update
sudo apt install comprobot
```

### AUR (Arch)

```sh
yay -S --noconfirm --nodiffmenu comprobot
```

### Homebrew (macOS)

```sh
brew tap badluma/tap
brew install comprobot
```

### Winget (Windows)

```sh
winget install badluma.comprobot
```

### Scoop (Windows)

```sh
scoop bucket add badluma https://github.com/badluma/scoop-bucket
scoop install comprobot
```

### Docker

```sh
docker run -d \
  -v comprobot-data:/root/.local/share/Comprobot \
  --name comprobot \
  badluma/comprobot:latest
```

First run, set up credentials:

```sh
docker run -it --rm \
  -v comprobot-data:/root/.local/share/Comprobot \
  badluma/comprobot:latest onboard
```

## Installing the package manager

### pipx

```sh
python3 -m pip install --user pipx
python3 -m pipx ensurepath
```

### yay (AUR)

```sh
sudo pacman -S --needed base-devel git
git clone https://aur.archlinux.org/yay.git
cd yay
makepkg -si
cd ..
rm -rf yay
```

### Homebrew

```sh
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### Scoop

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
Invoke-RestMethod -Uri https://get.scoop.sh | Invoke-Expression
```
