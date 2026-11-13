---
title: 基于lazynvim插件管理器的Neovim配置
date: 2025-11-13 18:19:36
tags: 'neovim'
categories: 'neovim'
---
基于Lazy.nvim插件管理器的NeoVim配置

#### 两个基础概念辨析

- `lazyvim`：是一个配置项目，将这个项目clone至指定位置后，会自动按照其中的设定，安装一些插件，属于开箱即用的配置，但是插件较多，如果网络不稳定，用起来比较困难
- `lazy.nvim`：是一个插件管理器，用于配置插件

#### 基本操作

- 配置目录位置

  ```bash
  macOS/Linux：~/.config/nvim 
  Windows：~/AppData/Local/nvim
  ```

- 配置概述

  `init.lua`内容如下，`nvim`启动时会加载`init.lua`配置，然后通过`require("lazynvim-init")`查找当前`init.lua`所在目录下的`lua`目录下的`lazynvim-init.lua`文件，运行其内容。

  **`init.lua`**

  ```
  -- bootstrap lazy.nvim
  -- ./lua/lazynvim-init.lua
  require("lazynvim-init")
  ```

  `lua`文件以`--`为注释标识

- 插件管理器lazy.nvim配置

  **`lua/lazynvim-init.lua`**

  ```lua
  -- 1. 准备lazy.nvim模块（存在性检测）
  -- stdpath("data")
  -- macOS/Linux: ~/.local/share/nvim
  -- Windows: ~/AppData/Local/nvim-data
  local lazypath = vim.fn.stdpath("data") .. "/lazy/lazy.nvim"
  if not vim.loop.fs_stat(lazypath) then
  	vim.fn.system({
  		"git",
  		"clone",
  		"--filter=blob:none",
  		"https://github.com/folke/lazy.nvim.git",
  		"--branch=stable", -- latest stable release
  		lazypath,
  	})
  end
  -- 
  -- 2. 将 lazypath 设置为运行时路径
  -- rtp（runtime path）
  -- nvim进行路径搜索的时候，除已有的路径，还会从prepend的路径中查找
  -- 否则，下面 require("lazy") 是找不到的
  vim.opt.rtp:prepend(lazypath)
  
  -- 3. 加载lazy.nvim模块
  require("lazy").setup({})
  ```

#### 插件安装配置

插件安装实际上主要是通过`lazynvim-init.lua`中最后一句代码调用起效，`require("lazy").setup({})`，这里需要在setup中填入需要安装配置的插件，可直接在其中写入，也可通过目录方式独立写入每个插件

- 方法一：直接配置

  ```lua
  local nvim_tree_plugin = {
      "nvim-tree/nvim-tree.lua",
      version = "*",
      dependencies = {"nvim-tree/nvim-web-devicons"},
      config = function()
          require("nvim-tree").setup {}
      end
  }
  local lualine_plugin = {
      'nvim-lualine/lualine.nvim',
      config = function()
          require('lualine').setup()
      end
  }
  local treesitter_plugin={
      "nvim-treesitter/nvim-treesitter",
      config = function(_, opts)
          require("nvim-treesitter.configs").setup(opts)
      end,
      opts = {
          ensure_installed = { "c", "lua", "ruby", "java" },
    	highlight = {
      		enable = true,
    	}
      }
  }
  --主题设置未单独写出，直接写在配置项了，与插件并列
  require("lazy").setup({nvim_tree_plugin, lualine_plugin,treesitter_plugin,
      "catppuccin/nvim", name = "catppuccin", priority = 1000
      })
  ```

  上述方式下，我们首先定义了三个插件配置的table；然后，在setup中第一个参数table中，逐个添加插件。这样`lazy.nvim`就能帮我们将插件进行下载、安装。

- 方法二：`plugins`目录统一编排

  这种方式可以参考`lazyvim`项目，并且对`lazyvim`项目进行一些改造，避免加载过多项目

  - 首先在`lazynvim-init.lua`所在目录下创建一个`plugins`目录，用于存放插件配置`lua`代码

  - 然后修改`lazynvim-init.lua`中最后一句代码，`require("lazy").setup({})`，改为`require("lazy").setup("plugins")`，注意没有了`{}`，直接在`()`中填写意为指示目录名

  - 在`plugins`目录中创建插件配置模块`lua`脚本，按需创建，依次加入不影响前序配置文件

    以下给出几个实例

    **`plugin-lualine.lua`**

    ```lua
    return {
        {
            'nvim-lualine/lualine.nvim',
            config = function()
                require('lualine').setup()
            end
        }
    }
    ```

    **`plugin-nvim-tree.lua`**

    ```lua
    return {
        {
            "nvim-tree/nvim-tree.lua",
            version = "*",
            dependencies = {"nvim-tree/nvim-web-devicons"},
            config = function()
                require("nvim-tree").setup {}
            end
        }
    }
    ```

  #### 单一文件init.lua配置方案，直接复制可用
  ```lua
    -- 编码方式 utf8
    vim.g.encoding = "UTF-8"
    vim.o.fileencoding = "utf-8"
    -- 缩进字符
    vim.o.tabstop = 4
    vim.bo.tabstop = 4
    vim.o.softtabstop = 4
    vim.o.shiftround = true
    -- >> << 时移动长度
    vim.o.shiftwidth = 4
    vim.bo.shiftwidth = 4
    -- 新行对齐当前行
    vim.o.autoindent = true
    vim.bo.autoindent = true
    vim.o.smartindent = true

    local lazypath = vim.fn.stdpath("data") .. "/lazy/lazy.nvim"
    if not vim.loop.fs_stat(lazypath) then
    vim.fn.system({
        "git",
        "clone",
        "--filter=blob:none",
        "https://github.com/folke/lazy.nvim.git",
        "--branch=stable", -- latest stable release
        lazypath,
    })
    end
    vim.opt.rtp:prepend(lazypath)

    local nvim_tree_plugin = {
        "nvim-tree/nvim-tree.lua",
        version = "*",
        dependencies = {"nvim-tree/nvim-web-devicons"},
        config = function()
            require("nvim-tree").setup {}
        end
    }
    local lualine_plugin = {
        'nvim-lualine/lualine.nvim',
        config = function()
            require('lualine').setup()
        end
    }
    local treesitter_plugin={
        "nvim-treesitter/nvim-treesitter",
        config = function(_, opts)
            require("nvim-treesitter.configs").setup(opts)
        end,
        opts = {
            ensure_installed = { "c", "lua", "ruby", "java" },
        highlight = {
                enable = true,
        }
        }
    }

    require("lazy").setup(
        {nvim_tree_plugin, lualine_plugin,treesitter_plugin,
        "catppuccin/nvim", name = "catppuccin", priority = 1000 }
    )
    vim.cmd.colorscheme("catppuccin")

  ```
  #### 结论

  通过以上配置，就加载了三个最基础的插件，当然实际安装情况，需要运行`nvim`去检测，在`nvim`中输入`:Lazy`进入`lazy.nvim`插件管理器，输入I观察安装情况。对`github`的访问是否顺畅直接影响插件安装

  