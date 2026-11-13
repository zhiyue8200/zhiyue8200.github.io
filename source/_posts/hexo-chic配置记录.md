---
title: hexo_chic配置记录
date: 2024-08-20 11:00:20
tags: 'hexo'
categories: 'hexo'
---
## hexo&Chic主题配置记录
主要用于记录配置本博客的过程

### 前情提要
1、Node安装，直接搜索
2、git安装，同上
3、hexo安装，同上
大佬教程：https://myoontyee.github.io/article/551b025b.html

** 概念辨析 **
博客根目录：使用hexo init创建的目录，进入到里面就是博客根目录
Chic主题根目录：进入到博客根目录里面的themes，在这个路径下放置主题根目录，进入Chic目录即为Chic主题根目录

### Chic主题安装
进入博客目录下面的themes，运行git clone https://github.com/Siricee/hexo-theme-Chic.git Chic，下载Chix主题
然后在博客根目录下面的_config.yml中设置Chic主题，即theme: Chic

### 分类、标签等目录无效的问题
进入Chic主题目录，打开该目录下的_config.yml
可以看到以下内容
```
# navigatior items
nav:
  Posts: /archives
  Categories: /category
  Tags: /tag
  About: /about
```
这代表导航栏有这些项目，并且这些项目有对应的目录
例如Categories导航项对应的目录为/category，这里指的是博客根目录下面的source下面的category目录，说明我们需要初始化一个category目录，
```
hexo new page category
```
通过以上命令会在source目录下初始化一个category目录，并且在里面生成一个index.md，也就是在该目录下会显示的内容，这里注意对这个index.md的设置
layout: "category"，注意中间有空格，并且配置一个type字段，这样才能使分类起效
```
---
title: Categories
date: 2024-08-20 10:44:38
layout: "category"
type: "categories"
---
```
同理可以设置Tags导航页面，也要设置layout项
这里用的layout项实际上是Chic主题下面的layout目录下面所提供的layout布局，打开后可以看到对应的布局
About导航创建好后，可以在里面的index.md中直接编写自己的介绍，因为这个布局不会像分类(Categories)、标签(Tags)这两个页面一样直接索引post中相关的内容
经过以上设置，博客的框架基本上就形成了，注意在写的每个博客里面加上标签及分类的索引
```
---
title: Linux设置邮件提醒
toc: true
date: 2018-05-24 11:00:00
tags:
- linux
- ubuntu
- centos
- mail
categories: 
- [专业,测试]
---
```