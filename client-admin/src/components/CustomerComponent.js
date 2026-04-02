import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import './CustomerComponent.css';

class Customer extends Component {
  static contextType = MyContext; // using this.context to access global state

  constructor(props) {
    super(props);
    this.state = {
      customers: [],
      orders: [],
      order: null
    };
  }

  render() {
    const customers = this.state.customers.map((item) => {
      return (
        <tr
          key={item._id}
          className="datatable"
          onClick={() => this.trCustomerClick(item)}
        >
          <td>{item._id}</td>
          <td>{item.username}</td>
          <td>{item.password}</td>
          <td>{item.name}</td>
          <td>{item.phone}</td>
          <td>{item.email}</td>
          <td>{item.active}</td>
          <td>
            {item.active === 0 ? (
              <span
                className="action-btn btn-email"
                onClick={(e) => { e.stopPropagation(); this.lnkEmailClick(item); }}
              >
                EMAIL
              </span>
            ) : (
              <span
                className="action-btn btn-deactive"
                onClick={(e) => { e.stopPropagation(); this.lnkDeactiveClick(item); }}
              >
                DEACTIVE
              </span>
            )}
          </td>
        </tr>
      );
    });

    const orders = this.state.orders.map((item) => {
      return (
        <tr
          key={item._id}
          className="datatable"
          onClick={() => this.trOrderClick(item)}
        >
          <td>{item._id}</td>
          <td>{new Date(item.cdate).toLocaleString()}</td>
          <td>{item.customer.name}</td>
          <td>{item.customer.phone}</td>
          <td>{item.total}</td>
          <td>{item.status}</td>
        </tr>
      );
    });

    if (this.state.order) {
      var items = this.state.order.items.map((item, index) => {
        return (
          <tr key={item.product._id} className="datatable">
            <td>{index + 1}</td>
            <td>{item.product._id}</td>
            <td>{item.product.name}</td>
            <td>
              <img
                src={"data:image/jpg;base64," + item.product.image}
                width="70px"
                height="70px"
                alt=""
                className="product-img"
              />
            </td>
            <td>{item.product.price}</td>
            <td>{item.quantity}</td>
            <td>{item.product.price * item.quantity}</td>
          </tr>
        );
      });
    }

    return (
      <div className="customer-wrapper">
        <div className="table-section">
          <h2 className="section-title">CUSTOMER LIST</h2>
          <table className="custom-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Password</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Active</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {customers}
            </tbody>
          </table>
        </div>

        {this.state.orders.length > 0 ? (
          <div className="table-section">
            <h2 className="section-title">ORDER LIST</h2>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Creation date</th>
                  <th>Cust. name</th>
                  <th>Cust. phone</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders}
              </tbody>
            </table>
          </div>
        ) : (
          <div />
        )}

        {this.state.order ? (
          <div className="table-section">
            <h2 className="section-title">ORDER DETAIL</h2>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Prod. ID</th>
                  <th>Prod. name</th>
                  <th>Image</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {items}
              </tbody>
            </table>
          </div>
        ) : (
          <div />
        )}
      </div>
    );
  }

  componentDidMount() {
    this.apiGetCustomers();
  }

  // event-handlers
  trCustomerClick(item) {
    this.setState({ orders: [], order: null });
    this.apiGetOrdersByCustID(item._id);
  }

  trOrderClick(item) {
    this.setState({ order: item });
  }

  lnkDeactiveClick(item) {
    this.apiPutCustomerDeactive(item._id, item.token);
  }

  lnkEmailClick(item) {
    this.apiGetCustomerSendmail(item._id);
  }

  // apis
  apiGetCustomers() {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/customers', config).then((res) => {
      const result = res.data;
      this.setState({ customers: result });
    });
  }

  apiGetOrdersByCustID(cid) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/orders/customer/' + cid, config).then((res) => {
      const result = res.data;
      this.setState({ orders: result });
    });
  }

  apiPutCustomerDeactive(id, token) {
    const body = { token: token };
    const config = {
      headers: { 'x-access-token': this.context.token }
    };

    axios
      .put('/api/admin/customers/deactive/' + id, body, config)
      .then((res) => {
        const result = res.data;
        if (result) {
          this.apiGetCustomers();
        } else {
          alert('SORRY BABY!');
        }
      });
  }

  apiGetCustomerSendmail(id) {
    const config = {
      headers: { 'x-access-token': this.context.token }
    };

    axios
      .get('/api/admin/customers/sendmail/' + id, config)
      .then((res) => {
        const result = res.data;
        alert(result.message);
      });
  }
}

export default Customer;