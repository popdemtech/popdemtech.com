---
layout: post
title: The Heroku Procfile
excerpt_separator: <!--more-->
---

`Procfile` is a file that specifies the commands that are executed
by an Heroku app on startup. While it is not necessary to include a Procfile
for Heroku deployment, a Procfile allows for more startup configuration
and the definition of multiple processes that run separate dynos.

<!--more-->

<div class="spacer-sm"></div>


## `Procfile`

The Procfile (literally a file titled `Procfile`) is located in the root of an application's file system, and can be used to specify a variety of processes.
Each Heroku [dyno](https://devcenter.heroku.com/articles/dynos) started the app
belongs to one of the declared process types.

Processes are listed within the Procfile on separate lines:

```
<process type>: <command>
```

You can refer to an applications config variables in the command using `$` syntax.

```
web: bundle exec rails server -p $PORT
```

<div class="spacer-sm"></div>

## The `web` Process Type

The process type `web` is special to Heroku.
It is the only process type that can receive external HTTP traffic.

Example Procfile with many processes:
```
web:           bundle exec rails server
release:       ./release-tasks.sh
worker:        env QUEUE=* bundle exec rake resque:work
deliveryworker:  env QUEUE=delivery bundle exec rake resque:work
```

<div class="spacer-sm"></div>

## Scale the Processes

Scaling the process implies running the configured number of dynos
with the specified command. The commandline utility `heroku ps` is used for this.

To scale the processes within the given example Procfile:

```
heroku ps:scale worker=1 urgentworker=3
```

<div class="spacer-sm"></div>

## Procfile and heroku.yml

The Procfile is not required if a `heroku.yml` file is used as the build manifest.
Read more about the `heroku.yml` in the Resources.

<div class="spacer-sm"></div>

## Resources
Procfile - [https://devcenter.heroku.com/articles/procfile](https://devcenter.heroku.com/articles/procfile)

heroku.yml - [https://devcenter.heroku.com/articles/build-docker-images-heroku-yml](https://devcenter.heroku.com/articles/build-docker-images-heroku-yml)