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
