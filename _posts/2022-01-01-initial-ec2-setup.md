---
layout: post
title: Setting up an AWS EC2 Server
excerpt_separator: <!--more-->
---

Before a developer can set up a web application on an EC2 instance or similar remote server, there must first be a remote server running that the developer can log into and install software on.

This is a solution walkthrough of taking an AWS EC2 instance from launch to having a non-default Unix user created. This walkthrough is a prerequisite for setting up web applications suing technologies such as Rails or Docker on an EC2 instance (or similar remote server.)

<!--more-->

This solution will work for a local linux system (ubuntu, windows subsystem linux), and may require modifications for MacOS.

Windows users, instructions for installing WSL can be found [here.](https://docs.microsoft.com/en-us/windows/wsl/install)

<div class="spacer"></div>

## Step 1 — Launch EC2 instance
1. From the AWS EC2 console click launch new instance
2. For this tutorial, select ubuntu.
3. Select whatever specs you know you need. (Free tier is fine)
4. When it asks if you want to download the security key, download it. Name it whatever you want; this solution will refer to it as your-pem-name.pem.
5. Wait for the server to be initialized. Watch the EC2 instances dashboard until the state is Running.

<div class="spacer"></div>

## Step 2 — Logging in as root
On your local system, move the downloaded your-pem-name.pem file to a secure location. path_to/your-pem-name.pem to secure location

`$ cp path_to/your-pem-name.pem ~/.ssh`

ensure pem is not accessible to other users

`$ chmod 600 ~/.ssh/your-pem-name.pem`

<div class="spacer-sm"></div>

If you do not ensure the pem is not accessible to other users, you will see an error like this:

```
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@         WARNING: UNPROTECTED PRIVATE KEY FILE!          @
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
Permissions 0644 for '/home/alexa/.ssh/wsl-ec2-ab1.pem' are too open.
It is required that your private key files are NOT accessible by others.
This private key will be ignored.
Load key "/home/alexa/.ssh/wsl-ec2-ab1.pem": bad permissions
ubuntu@18.209.211.46: Permission denied (publickey).
```

<div class="spacer-sm"></div>

You should now be able to log into your remote instance's default user account.

`$ ssh -i /path/to/your-pem-name.pem ubuntu@ec2-public-ip`

The default user for an EC2 instance running Ubuntu is `ubuntu`. If you did not select ubuntu as your server operating system, you may be able to find the correct default user at [these AWS docs.](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/managing-users.html)

The `ec2-public-ip` address can be found within the instances information on the AWS EC2 console.

<p style="text-align:center">
	<img src="/assets/img/posts/public_ipv4.gif" style="width:50%;min-width:320px;" />
</p>

<div class="spacer"></div>

## Step 3 — Create a user account

Use the adduser command to create the user account and add it to the system.
The command creates an entry /etc/passwd, a group, and a home directory for the account.

In this solution, the user account is named `newuser`.

`$ sudo adduser newuser --disabled-password`

If you did not use Ubuntu, you may not need `--disabled-password` flag.

<div class="spacer"></div>

## Step 4 — Set up user ssh
**1\.** Print public key of the your-pem-name.pem file downloaded when the instance was launched. On your local terminal run:

`$ ssh-keygen -y -f /path_to/your-pem-name.pem`

You will need the result of this command at later steps.

**2\.** On the remote server, switch from the default account to the new user account.

`$ sudo su - newuser`

**3\.** Create .ssh directory and authorized_keys file if they do not exist

```
$ mkdir .ssh
$ chmod 700 .ssh
$ touch .ssh/authorized_keys
$ chmod 600 .ssh/authorized_keys
```

Important:
Without these exact file permissions (the exact `chmod` commands) the new user will not be able to log in.

**4\.** Add the public key printed in step 4.1 to the `authorized_keys` file

```
$ nano .ssh/authorized_keys
[paste public key printed in step 1 and save]
```

**5\.** The user should now be able to log into the newuser account on the remote instance, using the private key that corresponds to the public key that you added to the authorized_keys file.

From the local computer, run the following command to log into the new user account:

`$ ssh -i /path_to/your-pem-name.pem newuser@ec2-public-ip`

<div class="spacer-sm"></div>

**Tip & Trick:**<br>
To not have to type `-i /path_to/your-pem-name.pem` every time, use the ssh-add command to add the private key to the authentication agent. The key will then automatically be checked when ssh authentication is invoked.

Running the `ssh-add` command from the terminal will store a key in your SSH agent until you log out (one session only):

**local computer**<br>
`$ ssh-add ~/path_to/my-pem-name.pem`

Alternatively, add command to `~/.bashrc` or similar (.bash_profile, .zshrc) to have the `ssh-add` command invoked automatically when you open a terminal. This makes it so that you do not have to manually run `ssh-add` everytime you log in.

**local computer .bashrc or similar**<br>
Non-WSL users, add the following:

`ssh-add ~/keyfile.pem >/dev/null 2>&1`

Windows WSL Users, should add the following instead to the WSL distro's .bashrc (or similar):

```
[ -x /usr/bin/ssh-agent ] && eval "$(ssh-agent -s)"
ssh-add ~/path_to/youre-pem-name.pem >/dev/null 2>&1
```

Make sure to redirect output to `/dev/null` to silence the command, or you’ll see “Identity Added” every time you open the terminal.

For Windows WSL users, see this StackOverflow post for an error like ["Could not open a connection to your authentication agent."](https://stackoverflow.com/questions/48518694/ssh-agent-reset-in-windows-subsystem-for-linux-wsl)

<div class="spacer"></div>

## Step 5 — Granting admin privileges (optional)
Many actions on the remote server will require elevated privileges to invoke. To avoid having to log out of our normal user and log in
as the root account to perform these actions, we can set up what is known as superuser or root privileges for the new account.

This will allow our normal user to run commands with administrative privileges
by putting the word `sudo` before the command.
To add these privileges to our new user, we need to add the user to the sudo group. By default, on Ubuntu 20.04, users who are members of the sudo group are allowed to use the sudo command.

As a user with sudo privileges, likely the `ubuntu` or EC2 default user, run the following:

`$ sudo usermod -aG sudo newuser`

<div class="spacer"></div>

## Step 6 — Setting up basic firewall
`ufw` is Uncomplicated Firewall. See the Digital Ocean Setup Guide in the Resources section for more on `ufw`.

```
$ ufw app list
$ ufw allow OpenSSH
$ ufw enable
$ ufw status
```

You will have to enable more ports as you add more services and applications that can accept web traffic. See [`ufw` documentation](https://help.ubuntu.com/community/UFW) when you get to that step.

<div class="spacer"></div>

## Step 7 (optional) — Password Authentication
If you will be logging in to the remote server from multiple devices, consider password authentication. This is less secure than ssh.

1\. Allow password authentication on the server:

[https://phoenixnap.com/kb/ssh-permission-denied-publickey](https://phoenixnap.com/kb/ssh-permission-denied-publickey#ftoc-heading-3)

2\. Create a password for a user:

`$ sudo passwd [username]`

<div class="spacer"></div>

---

### Resources:

EC2 managing users guide: [https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/managing-users.html](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/managing-users.html)

Digital ocean initial setup guide: [https://www.digitalocean.com/community/tutorials/initial-server-setup-with-ubuntu-20-04](https://www.digitalocean.com/community/tutorials/initial-server-setup-with-ubuntu-20-04)

Add pem to ssh keychain: [https://www.cloudsavvyit.com/1795/how-to-add-your-ec2-pem-file-to-your-ssh-keychain/](https://www.cloudsavvyit.com/1795/how-to-add-your-ec2-pem-file-to-your-ssh-keychain/)

Creating password for a user: [https://www.cyberciti.biz/faq/change-a-user-password-in-ubuntu-linux-using-passwd/](https://www.cyberciti.biz/faq/change-a-user-password-in-ubuntu-linux-using-passwd/)