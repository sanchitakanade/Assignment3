{
  /*Name: Sanchita Kanade
    Class:CS648.02 Modern Full-Stack Web Development (Spring 2020)
    Assignment: 3
    File: App.jsx
  */
}

function ProductRow(props) {
  const product = props.product;
  return React.createElement("tr", null, React.createElement("td", null, product.Name), React.createElement("td", null, "$".concat(product.Price)), React.createElement("td", null, product.Category), React.createElement("td", null, React.createElement("a", {
    href: product.Image,
    target: "_blank"
  }, "View")));
}

function ProductTable(props) {
  const productrows = props.products.map(product => React.createElement(ProductRow, {
    key: product.id,
    product: product
  }));
  return React.createElement("table", {
    className: "bordered-table"
  }, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", null, "Product Name"), React.createElement("th", null, "Price"), React.createElement("th", null, "Category"), React.createElement("th", null, "Image"))), React.createElement("tbody", null, productrows));
}

class ProductAdd extends React.Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    const form = document.forms.productAdd;
    var price = form.Price.value;
    var newPrice = price.substr(1, price.length);
    const product = {
      Category: form.Category.value,
      Price: newPrice,
      Name: form.Name.value,
      Image: document.getElementById("image").value
    };
    this.props.createProduct(product);
    form.Category.value = "Shirts";
    form.Price.value = "$";
    form.Name.value = "";
    form.Image.value = "";
  }

  render() {
    return React.createElement("form", {
      name: "productAdd",
      onSubmit: this.handleSubmit
    }, React.createElement("span", null, React.createElement("label", null, "Category "), React.createElement("select", {
      name: "Category"
    }, React.createElement("option", null, "Shirts"), React.createElement("option", null, "Jeans"), React.createElement("option", null, "Jackets"), React.createElement("option", null, "Sweaters"), React.createElement("option", null, "Accessories")), React.createElement("label", null, "Product Name "), React.createElement("input", {
      type: "text",
      name: "Name"
    })), React.createElement("span", null, React.createElement("label", null, "Price Per Unit"), React.createElement("input", {
      type: "text",
      name: "Price"
    }), React.createElement("label", null, "Image URL "), React.createElement("input", {
      type: "url",
      name: "Image",
      id: "image"
    })), React.createElement("button", null, "Add Product"));
  }

}

class ProductList extends React.Component {
  constructor() {
    super();
    this.state = {
      products: []
    };
    this.list();
    this.createProduct = this.createProduct.bind(this);
  }

  componentDidMount() {
    this.list();
    document.forms.productAdd.Price.value = "$";
  }

  async createProduct(product) {
    const query = `mutation {
      addProduct(product: {
        Category: ${product.Category},
        Name: "${product.Name}",
        Price:${product.Price},
        Image:"${product.Image}",
      }) {
        id
      }
    }`;
    const response = await fetch('/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query
      })
    });
    this.list();
  }

  async list() {
    const query = `query {
      productList {
        id Category Name Price
        Image
      }
    }`;
    const response = await fetch('/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query
      })
    });
    const result = await response.json();
    this.setState({
      products: result.data.productList
    });
  }

  render() {
    return React.createElement(React.Fragment, null, React.createElement("h1", null, "My Company Inventory"), React.createElement("div", null, "Showing all available products"), React.createElement("hr", null), React.createElement(ProductTable, {
      products: this.state.products
    }), React.createElement("div", null, "Add a new product to inventory"), React.createElement("hr", null), React.createElement(ProductAdd, {
      createProduct: this.createProduct
    }));
  }

}

const element = React.createElement(ProductList, null);
ReactDOM.render(element, document.getElementById('content'));