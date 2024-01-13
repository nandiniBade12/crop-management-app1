import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/Crops.css';
import { Link, useNavigate } from 'react-router-dom';
import NavbarDealer from '../../layouts/NavbarDealer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';

function DealerCrops() {

  const [crops, setCrops] = useState([]);
  const [searchOption, setSearchOption] = useState('default');
  const [searchValue, setSearchValue] = useState('');

  const userEmail = localStorage.getItem('id');

  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // Define the number of items to display per page
  const totalPages = Math.ceil(crops.length / itemsPerPage);
const startIndex = (currentPage - 1) * itemsPerPage;
const endIndex = Math.min(startIndex + itemsPerPage, crops.length);
const visibleCrops = crops.slice(startIndex, endIndex);
 
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };
 
  const previousPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };
 
  const nextPage = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  useEffect(() => {
    axios.get(`http://localhost:8089/crops/`)
      .then(response => {
        setCrops(response.data);
      })
      .catch(error => {
        console.log(error.response.data);
      });
  }, [crops]);

  const handleSearchOptionChange = (event) => {
    setSearchOption(event.target.value);
  };

  const handleSearchInputChange = (event) => {
    setSearchValue(event.target.value);
  };

  const filters = (crop) => {
    const searchText = searchValue.toLowerCase();
    if (searchOption === 'default') {
      return true;
    } else if (searchOption === 'cropType') {
      return crop.cropType.toLowerCase().includes(searchText);
    } else if (searchOption === 'cropName') {
      return crop.cropName.toLowerCase().includes(searchText);
    } else if (searchOption === 'farmLocation') {
      return crop.farmLocation.toLowerCase().includes(searchText);
    } else if (searchOption === 'sellerName') {
      return crop.sellerName.toLowerCase().includes(searchText);
    }
  };

  const handleOnClick = async (id) => {
    try{
    const response = await axios.post(`http://localhost:8083/cart/add/user/${userEmail}/crop/${id}/quantity/10`);
    console.log(response.data);
    alert("Item added to cart Successfully!!!");
    navigate("/dealercrops");
    } catch(error){
        console.error(error.response.data);
        alert(error.response.data);
    }
  }

  return (
    <>
      <NavbarDealer />
      <div className='add' style={{marginTop: "10px"}}>
        {/* <Link className='btn btn-success' to={`/addcrop`}>Filters</Link> */}
        <div className="search-bar">
          <select value={searchOption} onChange={handleSearchOptionChange}>
            <option value="default">Search your favourite crop...</option>
            <option value="cropName">Search crop name</option>
            <option value="cropType">Search crop type</option>
            <option value="farmLocation">Search farm location</option>
            <option value="sellerName">Search seller name</option>
          </select>
          {(searchOption === 'cropName' || searchOption === 'cropType' || searchOption === 'farmLocation' || searchOption === 'sellerName') && (
            <input type="text" value={searchValue} placeholder="Search..." onChange={handleSearchInputChange} />
          )}
            
        </div>
      </div>
      <div className="crops-container">
        <div className="crops-grid">
          {visibleCrops.filter(filters).map(crop => (
            <div className="crop-card" key={crop.id}>
              <img src={crop.image} height="130px" width={"190px"}></img>
              <div style={{backgroundColor: "rgb(26, 58, 153)", height: "25px", width: "200px", marginBottom: "-10px"}}><p style={{"fontSize":"large", "fontFamily":"italic", color:"white", marginTop: "8px"}}><b>{crop.cropName}</b></p></div>
              <p>{crop.description}</p>
              <p>Available stock:  <b>{crop.quantityAvailable}</b> Kgs</p>
              <p>Price:  <b>&#8377;{crop.pricePerUnit}</b>/Kg</p>
              <p >Sold by: {crop.sellerName}</p>
              <p style={{"font-size":"smaller", color:"GrayText"}}>{crop.farmLocation}</p>
              <p>Contact supplier: &#9742; {crop.sellerContact}</p>
              <p></p>
                <button className='cart-btn' onClick={() => handleOnClick(crop.id)}>
                  Add to Cart <FontAwesomeIcon icon={faShoppingCart}  />
                </button>
            </div>

            
          ))}
        </div>
      </div>
      <div className="pagination" style={{backgroundColor: "white", marginTop: "10px", marginLeft: "450px",marginBottom:"10px", width: "30%"}}>
        <button onClick={previousPage} disabled={currentPage === 1}>
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button onClick={nextPage} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </>
  );
}

export default DealerCrops;
