## Micro Front-End Tutorial

- This is very simple about micro frontend using the ModuleFederation plugin in webpack for setting up.
- The more details about that plugin please have a loot at more detail with this link [Documentation](https://webpack.js.org/concepts/module-federation/#motivation)
- Here is good example about ReactJS and scaffold from scratch [Stackblitz](https://stackblitz.com/edit/github-tyak4t?file=app1%2Fwebpack.config.js&terminal=start&terminal=)

### Application Design

- Products Application will be a remote and then it will inject the container. so my question is the main purpose of container is to do what?

* Let imagine in the architecture of micro-services are each team will take only responsibility or do one vision of the company like checkout, payment, connect, ect...
* For each mini-application like this will integrate into the home page that is called `container`
* At above definitions will have 2 jobs to do, in the remote application should expose components or utils, and in the container will be config in the web pack a way how to get remote entry

### Configuration

- **_Remote Entry ( Product application)_**

```js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].[contenthash].js",
  },
  devServer: {
    port: 8081,
    contentBase: path.join(__dirname, "src"),
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "products",
      filename: "remoteEntry.js",
      exposes: {
        "./ProductsIndex": "./src/index",
      },
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
};
```

- The main entry point in product applications is very straight-forward just only list out some products and biding into the element html

```js
const faker = require("faker");

const buildProducts = () => {
  let products = "<ul>";

  for (let i = 0; i < 5; i++) {
    const name = faker.commerce.productName();
    products += `<li>${name}</li>`;
  }

  products += "</ul>";

  return products;
};

document.querySelector("#dev-products").innerHTML = buildProducts();
```

- The prerequisite should install some dependencies package like webpack, webpack-cli, webpack-dev-server and html-webpack-plugin
- A bit explanation of some above plugins:
  > - webpack-cli: using the command line to build out the bundle application
  > - webpack-dev-server: start the application run on a specific port and watch the content changed to build the bundle again
  > - html-webpack-plugin: Because after the application bundled it named with the hash content so the file name changed frequently example `main.0e6126b415bbc7a8daec.js` so the `html-webpack-plguin` plugin will inject the changed file name into the index.html works correctly

---

##### **_Container_**

- The container will host the remote application via the `ModuleFederationPlugin` and how to config that

```js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;
const ExternalTemplateRemotesPlugin = require("external-remotes-plugin");

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    path: path.join(__dirname, "dist"),
    filename: "main.[contenthash].js",
    publicPath: "auto",
  },
  devServer: {
    port: 8080,
    contentBase: path.join(__dirname, "src"),
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "container",
      remotes: {
        products: "products@http://localhost:8081/remoteEntry.js",
      },
    }),
    new ExternalTemplateRemotesPlugin(),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
};
```

- The syntax is very clean and easy to understand immediately

```js
products: "products@http://localhost:8081/remoteEntry.js",
```

- key: product will use import by syntax in the boostrap.js file in the container app followed by syntax like this

```js
import "products/ProductsIndex";
```

and the `ProductIndex` is component be exposed from the remote application

- Value `products@http://localhost:8081/remoteEntry.js` is formatted by `name@host/filename` was defined in the webpack.config.js in the product application

- in order to the container works properly will create an element id to host a remote application in the index.html file

```html
<!DOCTYPE html>
<html>
  <head>
    <title></title>
  </head>
  <body>
    <h1 style="text-align: center;">Application Demo</h1>
    <div
      id="dev-products"
      style="display:flex; justify-content:center; align-items: center; border: 1px solid red"
    ></div>
  </body>
</html>
```

### Run applications

- Remote application

```
cd products
npm run start
```

then application will open port 8081 on the localhost

- Container

```
cd container
npm run start
```

### Congratulation

- you did it very well :-)

### Course I learn

- [Microfrontends with react](https://udemycourses.me/microfrontends-with-react-a-complete-developers-guide/)
