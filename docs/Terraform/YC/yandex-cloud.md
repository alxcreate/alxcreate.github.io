---
title: Autocompletion CLI
---

```bash title="~/.zshrc"
autoload -Uz compinit && compinit

if [ -f $(brew --prefix)/etc/zsh_completion ]; then
. $(brew --prefix)/etc/zsh_completion
fi

# The next line updates PATH for Yandex Cloud CLI.
if [ -f '/Users/username/yandex-cloud/path.bash.inc' ]; then source '/Users/username/yandex-cloud/path.bash.inc'; fi

# The next line enables shell command completion for yc.
if [ -f '/Users/username/yandex-cloud/completion.zsh.inc' ]; then source '/Users/username/yandex-cloud/completion.zsh.inc'; fi
```
