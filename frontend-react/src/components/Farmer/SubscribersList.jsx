import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/AdminPages.css';
import { Link, useNavigate } from 'react-router-dom';
import NavbarFarmer from '../../layouts/NavbarFarmer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faTrash } from '@fortawesome/free-solid-svg-icons';

function SubscribersList() {

  const [itemsCount, setItemsCount] = useState(0);
  
  const [status, setStatus] = useState('');
  const [selectedStatus, setSelectedStatus] = useState({});

  const [nameOfSeller,setNameOfSeller] = useState('');

  const navigate = useNavigate();

  const obj = localStorage.getItem("userInfo");
  const { phoneNumber } = JSON.parse(obj);

  const [orders, setOrders] = useState([]);

  // const filteredOrders = response.data.filter(order =>
            //     order.orderItems.some(item => item.crop.sellerContact === phoneNumber)
            //   );

    useEffect(() => {
        axios.get(`http://localhost:8084/orders/view/seller/${phoneNumber}`)
        .then(response => {
            console.log(response.data);
            
            setNameOfSeller(response.data[0].orderItems[0].crop.sellerName);
            setOrders(response.data);
            setItemsCount(response.data.length);
        })
        .catch(error => {
            console.log(error.response.data);
        });
    }, []);

    // const onChangeStatus = async (e, orderid) =>{
    //   try {
    //     const newStatus = e.target.value;
    //     setStatus(e.target.value);
    //     const response = await axios.patch(`http://localhost:8084/orders/changeStatus/${orderid}?status=${newStatus}`);
    //     console.log("New status : ", response.data);
    //     alert("Order status is successfully changed");
    //     setStatus("");
    //     navigate('/orders');
    //   } catch (error) {
    //     console.log(error);
    //   }
    // }

    const onChangeStatus = (e, orderId) => {
      const newStatus = e.target.value;
      setSelectedStatus({ ...selectedStatus, [orderId]: newStatus });
    };
  
    const handleStatusConfirmation = async (orderId) => {
      try {
        const newStatus = selectedStatus[orderId];
        const response = await axios.patch(`http://localhost:8084/orders/changeStatus/${orderId}?status=${newStatus}`);
        console.log("New status : ", response.data);
        alert("Order status is successfully changed");
        setSelectedStatus({ ...selectedStatus, [orderId]: '' });
        navigate('/subscribers');
      } catch (error) {
        console.log(error);
      }
    };

  return (
    <>
      <NavbarFarmer />
      <div style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  justifyContent: "center"
                }}>
        <div className='cart-container' style={{width: "95%"}}>
            <h2>Subscriber Details : {nameOfSeller}</h2>
            <p style={{color:"green"}}>Total of <b>{itemsCount}</b> subscriber details are shown</p>
            <div className="cart-grid" style={{backgroundColor: "white", border: "none", width: "80%"}}>
                <div className='table-div' style={{backgroundColor: "#f0f1f3", padding: "10px", width: "119%", border: "2px solid black", borderRadius: "5px", margin: "10px"}}>
                <table className='table table-bordered'>
                    <thead class="thead-dark">
                        <tr>
                        <th>User Name</th>
                        <th>Order Status</th>
                        <th>Order/Billing Date</th>
                        <th>Shipping Address</th>
                        <th>Total Price</th>
                        <th>Items Count</th>
                        <th>Total Crop Details</th>
                        <th>Payment Methods</th>
                        <th>Change Status</th>
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
                            <td>Paid by {order.modeOfPayment}</td>
                            <td><select id="status" name="status" value={selectedStatus[order.id] || ''}
                                onChange={(e) => onChangeStatus(e, order.id)} style={{height:"25px", backgroundColor:"#c46865"}}
                                disabled={order.orderStatus === 'Completed'}>
                              <option value="" style={{backgroundColor:"white"}}>Change status</option>
                              <option value={"Pending"} style={{backgroundColor:"white"}}>Pending</option>
                              <option value={"Shipped"} style={{backgroundColor:"white"}}>Shipped</option>
                              <option value={"Out for Delivery"} style={{backgroundColor:"white"}}>Arriving Soon</option>
                              <option value={"Delivered"} style={{backgroundColor:"white"}}>Delivered</option>
                              <option value={"Completed"} style={{backgroundColor:"white"}}>Completed</option>  
                              </select>
                              {selectedStatus[order.id] && (
                                <button className="btn btn-success" onClick={() => handleStatusConfirmation(order.id)} style={{ marginLeft: '5px', backgroundColor: 'greenyellow' }}>
                                  Confirm
                                </button>
                              )}
                              </td>
                              
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

export default SubscribersList;
