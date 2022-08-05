---
layout: post
title: Setting Up Docker Desktop for Windows and WSL2
excerpt_separator: <!--more-->
---

Windows Subsystem Linux provides an intuitive Linux development interface for Windows users.

Unlike the usual Linux Docker installation process where the Docker process is installed and
runs as a Linux process,
To develop Docker applications within Windows Subsystem Linux, Docker Desktop must be installed and running within the Windows operating system.

<!--more-->

Docker Desktop and WSL2 are built with integrations such that docker container information and functions
are shared between the Desktop application and `docker` commands from the Linux CLI.

Cursory experience with WSL and Docker Desktop has shown the integrations to work seemlessly once installed.
This is a solution walkthrough of installing Docker Desktop for Windows and WSL2 Development.

---

<div class="spacer-sm"></div>

## Prerequisites

Before you install Docker Desktop, you must complete the following steps:

#### Install Windows 10, version 1903 or higher or Windows 11.

WSL is not supported on earlier Windows operating systems.

#### Enable WSL 2 feature on Windows.

**Important:** The Linux distro must be running in WSL 2, not WSL 1. If the distro is using WSL 1, it can be changed to WSL 2 with a simple command.

```
# Check what version WSL your linux distros are running (from Windows)
> wsl.exe -l -v
  NAME                   STATE           VERSION
* Ubuntu-18.04           Running         2
```
<div class="spacer-sm"></div>

<p style="text-align:center">
	<img src="/assets/img/posts/wsl-l-v.png" style="width:50%;min-width:320px;" />
</p>

<div class="spacer-sm"></div>

```
# Upgrade existing distro to WSL2 (from Windows)
> wsl.exe --set-version [distro_name] 2
```

<div class="text-small">
<b>**Warning:</b> Changing the version takes up all your RAM. It's a huge memory operation, and the only community solutions are to a) patch the process to have max-memory consumption or b) start the process and expect the PC to be locked up for a bit of time. I went with option B, and it took approximately an hour. See the Github issue in the references for more details.
</div>

<div class="spacer-sm"></div>

#### Have a project that can be initiated with `docker-compose up`.

See the reference link *Get Started with Docker Compose* for a walkthrough of creating such a project if you do not yet have this.

<div class="spacer"></div>

## Download

Download [Docker Desktop 2.3.0.2](https://docs.docker.com/desktop/windows/wsl/#download) or a later release.

<div class="spacer"></div>

## Install

Follow the usual installation instructions to install Docker Desktop. Docs from the developers say to read any information displayed on the screen, and select any options to enable WSL 2 to continue.

I did not encounter any questions about enabling WSL2 in January 2022, and found the configuration enabled by default.

Start Docker Desktop from the start menu or however.

<div class="spacer"></div>

## Run Docker Commands in WSL

From the Linux CLI, you can now run docker commands. Container, image, and other information can be seen within Docker Desktop. From Linux:

```
# start a container
$ docker-compose up -d

# list available containers
$ docker ps

# exec onto the container
$ docker exec -it [container_name] bash
```

<div class="spacer-sm"></div>

<div class="text-small">
<b>Update: 2022-01-21</b> I don't recommend planning on developing web applications or apps with ports you need to access from Windows. E.g. - You would like to access your application through a Chrome browser http://localhost:3000.
The software to allow cross-platform networking, Windows/WSL2, is not built yet . Or at least it's not intuitive enough to make it to page 2 of a Google search.
is a non-trivial feature that is necessarily on WSL2's roadmap. If you're reading this in the future, do a fresh web search to see if networking between WSL2 Docker and localhost is possible
<p>
	<b style="color:red;">What I do recommend is running Docker containers within the Windows OS.</b>
	This means running `docker-compose` and `docker` commands from within Windows Terminal or Powershell.
</p>
</div>

<div class="spacer"></div>

---

### References

Check WSL2 version - [https://docs.microsoft.com/en-us/windows/wsl/install#check-which-version-of-wsl-you-are-running](https://docs.microsoft.com/en-us/windows/wsl/install#check-which-version-of-wsl-you-are-running)

Docker Desktop Prerequisites - [https://docs.docker.com/desktop/windows/wsl/#prerequisites](https://docs.docker.com/desktop/windows/wsl/#prerequisites)

Getting Started with Docker Compose - [https://docs.docker.com/compose/gettingstarted/](https://docs.docker.com/compose/gettingstarted/)

WSL2 Conversion Time issue - [https://github.com/microsoft/WSL/issues/5344](https://github.com/microsoft/WSL/issues/5344)

WSL2 Conversion Memory Consumption Issue - [https://github.com/microsoft/WSL/issues/4669#issuecomment-559817819](https://github.com/microsoft/WSL/issues/4669#issuecomment-559817819)

Installing Docker Desktop - [https://docs.docker.com/desktop/windows/wsl/](https://docs.docker.com/desktop/windows/wsl/)

About WSL - [https://docs.microsoft.com/en-us/windows/wsl/about](https://docs.microsoft.com/en-us/windows/wsl/about)