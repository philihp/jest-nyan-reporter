# jest-nyancat-reporter

<!--Badges Start-->

[![npm version](https://badge.fury.io/js/jest-nyancat-reporter.svg)](https://badge.fury.io/js/jest-nyancat-reporter)

<!--Badges End-->

This was forked from [abdulhannanali/jest-nyan-reporter](https://github.com/abdulhannanali/jest-nyan-reporter), which has a bug reported in 2017, and a PR submitted but still hasn't been merged. I'm taking that to mean that the original repo is abandoned.

![Jest Nyan Reporter Image](https://i.imgur.com/oPawvXV.png)

## Installation

You can install by typing the following command in terminal.

For **Yarn**

```
yarn add -D jest-nyancat-reporter
```

For **NPM**

```
npm --save-dev jest-nyancat-reporter
```

### Configure

In order to configure the Nyancat Reporter, you can add the following configuration in your `package.json` under jest property.

```json
{
  "jest": {
    "reporters": [
      [
        "jest-nyancat-reporter",
        {
          "suppressErrorReporter": false
        }
      ]
    ]
  }
}
```
