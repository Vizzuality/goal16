# GOAL 16

Goal16 dashboard

## Getting set up

The dashboard is powered by
[Jekyll](https://upload.wikimedia.org/wikipedia/commons/7/78/Dr_Jekyll_and_Mr_Hyde_poster_edit2.jpg).
Once you've installed the Jekyll gem and other deps, you can use npm to
build and run the application:

```
gem install bundler
bundle install
npm install
npm install -g grunt-cli

npm start
```

[Go go go!](http://localhost:4000)


## Jekyll

### Adding new pages

In development, and on Github Pages, requests are rewritten to `.html`
files as necessary. For example, `/countries --> /countries.html`. So,
creating a new page is easy: just add a new HTML file! Jekyll will
handle compilation, and the middleware will handle rewriting.

## Deployment

### Continuous Integration

The app is staged on Github Pages, and is continuously deployed using
Travis. When code is pushed to `develop`, Travis will run the tests and
will automatically deploy to Github Pages if they pass. Take a look at
`/scripts/cibuild` if you want to see how it works.

### Staging

As said, the app is staged on Github Pages automatically, but there is a
command should you need to do it manually (probably never):

```
npm run deploy
```

Github Pages handles all the building, etc. for you. [Check it
out!](http://vizzuality.github.io/GDA-Dashboard)

A note on what this command doing: so that we don't have to constantly commit
compiled files (like js/bundle.js), we ignore them in Git and then force
push them up to gh-pages for deploys. Because of this, you should
*never* work directly on the gh-pages branch, it is entirely disposable.