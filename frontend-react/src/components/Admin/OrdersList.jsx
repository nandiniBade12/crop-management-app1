import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/AdminPages.css';
import { Link, useNavigate } from 'react-router-dom';
import NavbarDealer from '../../layouts/NavbarAdmin';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faTrash } from '@fortawesome/free-solid-svg-icons';

function OrdersList() {

  const [itemsCount, setItemsCount] = useState(0);

  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:8084/orders/`)
        .then(response => {
            setOrders(response.data);
            setItemsCount(response.data.length);
        })
        .catch(error => {
            console.log(error.response.data);
        });
    }, []);
  

  return (
    <>
      <NavbarDealer />
      <div style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  justifyContent: "center"
                }}>
        <div className='cart-container' style={{width: "95%"}}>
            <h2>Order Details</h2>
            <p style={{color:"green"}}>Total of <b>{itemsCount}</b> order details are shown</p>
            <div className="cart-grid" style={{backgroundColor: "white", border: "none"}}>
                <div className='table-div' style={{backgroundColor: "#f0f1f3", padding: "10px", width: "108%", border: "2px solid black", borderRadius: "5px", margin: "5px"}}>
                <table className='table table-bordered'>
                    <thead class="thead-dark">
                        <tr>
                        <th>User Name</th>
                        <th>Order Status</th>
                        <th>Order/Billing Date</th>
                        <th>Shipping Address</th>
                        <th>Total Price</th>
                        <th>Total Items</th>
                        <th>Total Crops</th>
                        <th>Seller Name</th>
                        <th>Payment Methods</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                        <tr key={order.id}>
                            <td>{order.userName}</td>
                            <td>{order.orderStatus}</td>
                            <td>{order.orderDate}</td>
                            <td>
                            {`${order.shippingAddress.buildingNumber}, ${order.shippingAddress.area}, ${order.shippingAddress.city}, ${order.shippingAddress.pincode}, ${order.shippingAddress.state}`}
                            </td>
                            <td>{order.totalPrice}</td>
                            <td>{order.orderItems.length}</td>
                            <td>
                              <ul>
                                {order.orderItems.map((item, index) => (
                                  <li key={index}>{item.crop.cropName} - {item.quantity}Kgs</li>
                                ))}
                              </ul>
                            </td>
                            <td>{order.orderItems[0].crop.sellerName}</td>
                            <td>Paid by {order.modeOfPayment}</td>
                              
                        </tr>
                        ))}
                    </tbody>
                </table>
                </div>
            </div>
            <br/>
            
        </div>
      </div>
    </>
  );
}

export default OrdersList;
