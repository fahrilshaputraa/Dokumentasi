# Installing Zsh and Oh My Zsh

This guide will help you install **Zsh**, set it as your default shell, and install **Oh My Zsh** for enhanced terminal experience.

## 1. Install Zsh

```bash
sudo apt update
sudo apt install zsh -y
```

## 2. Set Zsh as Default Shell

```bash
chsh -s $(which zsh)
```

## 3. Start Zsh

```bash
zsh
```

## 4. Install Oh My Zsh

```bash
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

## 5. Edit Zsh Configuration

```bash
nano ~/.zshrc
```

Make your desired changes, then save and exit.

## 6. Apply Changes

```bash
source ~/.zshrc
```

## 7. List Available Themes

```bash
ls ~/.oh-my-zsh/themes
```

---

For more enhancements, check out [zsh-autosuggestions](https://github.com/zsh-users/zsh-autosuggestions).