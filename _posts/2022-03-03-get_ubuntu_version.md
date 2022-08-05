---
layout: post
title: Get Ubuntu Version from Command Line, VirtualBox
excerpt_separator: <!--more-->
---

I recently downloaded Ubuntu 20.04.4 LTS.

In order to type that sentence, I needed to get the version of Ubuntu I downloaded.

<!--more-->

The VirtualBox Manager window only reported a cryptic "Ubuntu 64-bit",
but I am more interested in knowing the version.

<p style="text-align:center">
	<img src="/assets/img/posts/vb_manager.png" style="width:50%;min-width:320px;" />
</p>

<div class="spacer"></div>

To get the Ubuntu version from the command line, open Terminal and type the following:

`lsb_release -a`

<div class="spacer"></div>

More information on the lsb command

```
lsb_release -h
Usage: lsb_release [options]

Options:
  -h, --help         show this help message and exit
  -v, --version      show LSB modules this system supports
  -i, --id           show distributor ID
  -d, --description  show description of this distribution
  -r, --release      show release number of this distribution
  -c, --codename     show code name of this distribution
  -a, --all          show all of the above information
  -s, --short        show requested information in short format
```
