# popdemtech.com

The Jekyll structure:

```
- data - directory for data files, e.g. yaml
- data/sitetext.yml - Customization of site copy
- data/navigation.yml - Customization of navigation
- data/style.yml - Colors, background images, and other style-related things
- _includes - templates available for use in multiple pages/layouts
- _layouts - layout templates
- _pages - web pages, delivered via page based routing
- _posts - standard directory for [Jekyll posts](https://jekyllrb.com/docs/posts/)
- _sass - sass enabled style files
- .github - [Community guidelines](https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions) and [Github Actions](https://docs.github.com/en/actions/learn-github-actions/understanding-github-actions)
- `assets` - static images, stylesheets, javascripts, etc
- _config.yml - sitewide configuration
- CNAME - the custom domain of the website (optional)
- index.md - Entrypoint to the website (renders _layouts/home)
```

## Installation

```bash
$ git clone ... # clone this repo!
$ cd ...
$ bundle install
```

## Development
```bash
$ jekyll serve -lw
```

The `-lw` flags are for `livereload` and `watch`, and are optional.

And open your browser to `http://localhost:4000`

### Development notes

* When creating a new file within the `_sass` directory, you must add the file to the `@import` list within `/assets/css/agency.scss` file

## Production

### Deploy

```bash
$ jekyll build -d docs
$ git push [...] # push it where you want
```

### GitHub Pages

The generated website is made to be run on Github Pages. Within the Github repository for the generated website, navigate the the GitHub Pages settings, and set the site to be built from the `/docs` directory.

* Set the site to be build from the `/docs` directory
* Set the custom domain to be the same as the domain in the CNAME file
* Enforce HTTPS (optional)

## Contributing

This project is intended to be a welcoming space for collaboration. If you have an idea, suggestion, feature request, etc., feel free to open an issue or pull request.
For bug reports, follow the provided template.
