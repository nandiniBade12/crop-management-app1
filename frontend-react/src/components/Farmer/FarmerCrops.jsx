import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/Crops.css';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../layouts/NavbarFarmer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faTrash,  } from '@fortawesome/free-solid-svg-icons';

function FarmerCrops() {
  const [crops, setCrops] = useState([]);

  const [searchOption, setSearchOption] = useState('default');
  const [searchValue, setSearchValue] = useState('');

  const [nameOfSeller,setNameOfSeller] = useState('');
  const [filteredCrops, setFilteredCrops] = useState([]);

  // const userEmail = localStorage.getItem('id');

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

  const obj = localStorage.getItem("userInfo");
  const { phoneNumber } = JSON.parse(obj);

  useEffect(() => {
    axios.get(`http://localhost:8089/crops/`)
      .then(response => {
        // const filteredCrops = response.data.filter(crop => crop.sellerContact === phoneNumber);
        // setNameOfSeller(filteredCrops[0].sellerName);
        const farmerCrops = response.data.filter(crop => crop.sellerContact === phoneNumber);
        setFilteredCrops(farmerCrops);
        setNameOfSeller(farmerCrops.length > 0 ? farmerCrops[0].sellerName : '');
        setCrops(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, [phoneNumber]);

  const deleteCrop = async (cropId) => {
    await axios.delete(`http://localhost:8089/crops/delete/${cropId}`);
    alert("Crop deleted successfully");
    navigate("/farmercrops");
  }

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

  return (
    <>
      <Navbar />
      <div style={{backgroundColor: "white", width: "30%", marginLeft: "440px", marginTop: "10px", borderRadius: "5px"}}>
          {/* <button style={{height:"20px", backgroundColor: "white", borderStyle: "none"}}><h2>{nameOfSeller}</h2></button> */}
          <h2>{nameOfSeller}</h2>
      </div>
      <div className='add'>
        <div>
        <button className='add-crop'><Link style={{color: "white"}} to={`/addcrop`}>Add Crops</Link></button>
        </div>
        <div>
        <select className='search-text' value={searchOption} onChange={handleSearchOptionChange}>
            <option value="default">Search your favourite crop</option>
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
              <p>Available stock: <b>{crop.quantityAvailable}</b> Kgs</p>
              <p>Price: <b>&#8377;{crop.pricePerUnit}</b>/Kg</p>
              <p >Sold by: {crop.sellerName}</p>
              <p style={{"fontSize":"smaller", color:"GrayText"}}>{crop.farmLocation}</p>
              <p>Contact supplier: &#9742; {crop.sellerContact}</p>
              <p></p>
              {/* <div className="crop-buttons">
                <button className='btn btn-warning' >
                  <Link  className='link-color' to={`/updatecrop/${crop.id}`}>
                  <FontAwesomeIcon icon={faPencilAlt} /> Update
                  </Link></button>
                  <button className='btn btn-danger' onClick={() => deleteCrop(crop.id)}> <FontAwesomeIcon icon={faTrash} /> Delete</button>
              </div> */}
              {filteredCrops.some(farmerCrop => farmerCrop.id === crop.id) && (
                <div className="crop-buttons">
                  <button className='btn btn-warning'>
                    <Link className='link-color' to={`/updatecrop/${crop.id}`}>
                      <FontAwesomeIcon icon={faPencilAlt} /> Update
                    </Link>
                  </button>
                  <button className='btn btn-danger' onClick={() => deleteCrop(crop.id)}>
                    <FontAwesomeIcon icon={faTrash} /> Delete
                  </button>
                </div>
              )}

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

export default FarmerCrops;