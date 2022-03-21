---
layout: post
title: Deploying a Docker Container on EC2
excerpt_separator: <!--more-->
---

Docker makes it easy to run multiple web applications on one server instance. Because it's container architecture isolates applications and their dependencies, Docker is the software of choice when considering how to deploy multiple applications, databases, and caches and allow them to share resources without colliding namespaces/3rd party library requirements.

In this solution walkthrough, I deploy a Docker Container onto EC2.

<!--more-->

The container I will be deploying can be found here: [https://github.com/iamalexbrady/jobs](https://github.com/iamalexbrady/jobs).

## Prerequisites:

The code repository must be setup with the proper Docker configuration to allow `docker-compose up`, `docker run`, or similar command.

The EC2 instance must have a user with sudo privilege, and you, the developer, must have login access to that user.

**Steps**
1. SSH onto the remote server
2. Generate a public SSH key for Github SSH permissions (if necessary)
3. Copy the EC2 user's public key (if necessary)
4. Add the EC2 public key to the Github account with ownership access to the repository (if neccessary)
5. Set up the repo on the server
6. Start the Docker container

<div class="spacer"></div>

## 1. SSH onto container

`$ ssh [user_name]@[ip_address]`

<div class="spacer"></div>

## 2. Generate public key (if necessary)

This step is mandatory to do once, but does not need to be repeated for each new Dockerize application setup. If you do not already have an ssh public key the remote server user, generate one.

`$ ssh-keygen`

The terminal will prompt:

```
Generating public/private rsa key pair.
Enter file in which to save the key (/home/[user_name]/.ssh/id_rsa):
Enter passphrase (empty for no passphrase):
Enter same passphrase again:
```

The defaults are fine.

<div class="spacer"></div>

## 3. Copy the EC2 user's public key (if necessary)

This step is mandatory to do once, but does not need to be repeated for each new Dockerize application setup.

If you used the command from the last step, the public key has the same name as the
file specified in the first prompt with an extension of `.pub`.

If you need to find the name of the public key, try listing the contents of the
`~/.ssh` directory.

```bash
$ # list contents of ~/.ssh directory
$ ls .ssh
authorized_keys  id_rsa  id_rsa.pub
$
$ cat .id_rsa.pub
ssh-rsa [multi_line_encrypted_part] [user_name]@[host]
```

Copy 100% of the contents of the public key, from ssh-rsa to the end of the host. All of it.

<div class="spacer"></div>

## 4. Add the EC2 public key to the Github account with ownership access to the repository

This step is mandatory to do once, but does not need to be repeated for each new Dockerize application setup.

Navigate to your Github user settings. Find the section dedicated to SSH keys or similar. Add the public key copied from the last step.

<p style="text-align:center">
	<img src="/assets/img/posts/github_settings.png" style="width:50%;min-width:320px;" />
</p>

<p style="text-align:center">
	<img src="/assets/img/posts/github_setting_ssh.png" style="width:50%;min-width:320px;" />
</p>

<p style="text-align:center">
	<img src="/assets/img/posts/github_setting_ssh_add_key.png" style="width:50%;min-width:320px;" />
</p>

<div class="spacer"></div>

## 5. Set up the Dockerized repository on the server

Navigate to the location in the filesystem you will save the code. Then clone the repository.

`$ git clone git@github.com:[your_repository].git`

You may need to configure permissions on the EC2 Ubuntu filesystem to allow the `git clone` command to be run in the root files (e.g. `/opt`, `/var`).

To enable running `git clone` in a custom directory `/opt/servers/`

<div class="spacer-sm"></div>

```
$ # make the directory
$ sudo mkdir /opt/servers
$
$ # Change ownership of the directory to the root user and the sudo group
$ sudo chown -R root:sudo /opt/servers
$
$ # Set read, write, and execute permissions for the ownership user and group
$ sudo chmod -R 775 /opt/servers
```

<div class="spacer-sm"></div>

Change the above example to reference the users and filesystems specific to your project.

You should now be able to run

```
$ # no sudo
$ git clone git@github.com:[your_repository].git
```

Follow the README for any project specific set up such as proper handling of environment variables. For example, the README in the [example repository](https://github.com/iamalexbrady/jobs) states to run an `install.sh` script.

<div class="spacer"></div>

## 6. Start the Docker container

`sudo docker-compose up -d`

When the container has started, you will be able to see it running with `docker ps`,
and use any of the provided functionality of the `docker` and `docker-compose` CLI utilities.

<div class="spacer"></div>

---

### Resources

Clone a repository using SSH: [https://www.toolsqa.com/git/clone-repository-using-ssh/](https://www.toolsqa.com/git/clone-repository-using-ssh/)


Permissions in the `/opt` directory: [https://askubuntu.com/questions/642744/read-write-permissions-in-opt-directory](https://askubuntu.com/questions/642744/read-write-permissions-in-opt-directory)

`docker-compose` command line reference: [https://docs.docker.com/compose/reference/](https://docs.docker.com/compose/reference/)