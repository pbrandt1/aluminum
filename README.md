![Aluminum](http://i3.cpcache.com/product/709482292/elements_13_aluminum_tile_coaster.jpg?height=225&width=225)

## Motivation

* Developers want to easily stay up-to-date with master
* Open source maintainers want other contributors to submit quality patches through easy iteration
* User interfaces are just as important as CLI

## Features
* easily keeps your branch up-to-date with master/trunk
* branch-level permissions obviate forking
* tracks issues as part of the revision history
* it’s written in node.js and is super hackable (and FutureProof™)

## Quick reference

`npm install -g al-cli` or `npm install -g al-gui`

```sh
al init
al clone ssh@sourcehub.space:USER/REPO.al
al status
al add [-a]
al unadd [-a]
al commit [-a] [-m MESSAGE]
al revert FILE
al revert COMMIT
al checkout [-b] BRANCH
al update [BRANCH]
al merge [-m MESSAGE]
al push [BRANCH]
al ignore FILES...
```

## CLI Tutorial

Aluminum is meant to be easy, starting with the command, `al`.  Wow, doesn’t that just feel great to type?  So much easier than `git` or `hg` or `svn`.

In Aluminum, you can start a repo on your own computer, no cloud necessary.  In this tutorial we’ll make a node.js stock ticker.

```sh
npm install -g al-vc
mkdir stocker.js && cd stocker.js
al init
```

Now you have an aluminum repo!  Yay!  Later on we’ll push the repo to the cloud.

Even though the stock ticker we are writing is a node thingy, we’re not going to bother with a package.json since we’ll use Aluminum to handle the node_modules folder.  Also, since the ticker is a fake super-proprietary business solution (synergy!), we will not be posting it on ftp://npm.com or whatever.

Let’s install our dependencies

```sh
npm install request
```

And make our file

```js
var request = require('request')
var stocks = ['MSFT', 'AAPL'];
setInterval(function() {
  stocks.map(function(symbol) {
    var str = symbol + ': ' + (Math.random()*10000|0)/100;
    console.log(str)
  })
}, 1000)
```

And commit the result.  

```sh
al add *
al commit -m 'initial commit'
```

Since Aluminum is your friend, it already knows that node_modules is a scary place filled with monsters and marks it as a dependency directory. Basically that just means that you only have to carry one version of it around as you develop.  The origin repo in the cloud will have all the other versions.

Let’s make a branch!  Tip for newbies: a branch is a safe place to write code that doesn’t affect other people until you’re ready to show them your hard work.

```sh
npm install colors
al branch colors
```

Edit your file so that you now use fancy colors

```js
var request = require('request')
require('colors')
var stocks = ['MSFT', 'AAPL'];
setInterval(function() {
  stocks.map(function(symbol) {
    var str = symbol + ': ' + (Math.random()*10000|0)/100;
    console.log(str.rainbow) // Wow! Now THAT'S more like it!
  })
}, 1000)
```

And then we’ll commit our changes and merge back in to the master branch.  We’ll do it in two commits just to illustrate a point.

```sh
al add stocker.js
al commit -m 'adding fancy colors stuff...'
al add node_modules
al commit -m 'adding node_modules'
al checkout master
al merge colors -m 'feature: add color to tickers'
```

All of your commits are automatically squashed into one commit when you merge, and you can add a friendly message to summarize what you did. To see your commit log, type `al log`.

```
* a381474 pbrandt1: feature: add color to tickers (colors -> master)
* a194712 pbrandt1: initial commit (master)
```

Next let’s push this repo to the cloud.  Sign up for a free account on https://alhub.space if you haven’t yet and create an empty repo.  Copy the url, https://alhub.space/your_username/repo and paste it in

```sh
al push https://alhub.space/your_username/repo
```

Check it out!  Your ‘colors’ branch is there, too, under your username!

[screenshot of branches:

Branches
master - 2016/12/21
pbrandt1/colors - 2016/12/21

]

```sh
al checkout https://aluminum.space/your_username/repo
```
