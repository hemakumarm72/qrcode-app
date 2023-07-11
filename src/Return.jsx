import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { sizedata } from './data';
function App() {
  const [formData, setFormData] = useState({
    location_id: '',
    locker_id: '',
    transaction_id: '',
    reason_for_return: '',
  });
  const [lockersize, setLockerSize] = useState('');
  const [qrCodeValue, setQRCodeValue] = useState();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeLocations, setActiveLocations] = useState([]);
  const [availablelocker, setAvailablelocker] = useState([]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  useEffect(() => {
    // Fetch active locations from the API
    const fetchActiveLocations = async () => {
      try {
        await axios
          .post(
            `${process.env.REACT_APP_SERVER}/api/transaction/activelocation`,
            {
              city: 'Chennai', // two types fetch location data, All or City name
            },
            {
              headers: {
                'x-api-key': '637f762e97f3fb8b75c44300',
              },
            }
          )
          .then((res) => {
            setActiveLocations(res?.data?.data?.location ?? []);
          });
      } catch (error) {
        console.error(error);
      }
    };
    const fetchavailablelocker = async () => {
      try {
        await axios
          .post(
            `${process.env.REACT_APP_SERVER}/api/transaction/availablelocation`,
            {
              location_id: formData.location_id, // two types fetch location data, All or City name
              locker_size: lockersize,
            },
            {
              headers: {
                'x-api-key': '637f762e97f3fb8b75c44300',
              },
            }
          )
          .then((res) => {
            setAvailablelocker(res?.data?.data?.availabelocker ?? []);
          });
      } catch (error) {
        console.error(error);
      }
    };
    fetchActiveLocations();

    fetchavailablelocker();
  }, [formData.location_id, lockersize]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      // var obj = {
      //   ...formData,
      //   "locker_size":size
      // }
      // console.log(obj);
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER}/api/transaction/return`,
        formData,
        {
          headers: {
            'x-api-key': '637f762e97f3fb8b75c44300',
          },
        }
      );
      // Assuming the response contains the generated QR code value
      setQRCodeValue(response?.data?.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <h1>QR Code Generator</h1>
      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div>
          <label>Transaction Id:</label>
          <input
            type='text'
            name='transaction_id'
            value={formData.transaction_id}
            onChange={handleInputChange}
          />
        </div>
        <div className='form-field'>
          <label>Location:</label>

          <select name='location_id' onChange={handleInputChange}>
            <option disabled selected hidden>
              select Location
            </option>
            {activeLocations.map((location) => (
              <option key={location._id} value={location._id}>
                {`${location.name}`}
              </option>
            ))}
          </select>
        </div>

        <div className='form-field'>
          <label>Locker Size:</label>
          <select
            name='locker_size'
            onChange={(event) => setLockerSize(event.target.value)}
          >
            <option disabled selected hidden>
              Select Size
            </option>
            {sizedata.map((item) => (
              <option
                value={item.param}
                key={item.name}
                // id={item.locker_size}
              >
                {`${item.name}`}
              </option>
            ))}
          </select>
        </div>

        <div className='form-field'>
          <label>Locker:</label>
          <select
            name='locker_id'
            placeholder='locker'
            onChange={(e) => {
              setFormData({
                ...formData,
                locker_id: e.target.value,
              });
            }}
          >
            <option disabled selected hidden>
              locker
            </option>
            {availablelocker.map((item) => (
              <option
                value={item._id}
                key={item._id}
                // id={item.locker_size}
              >
                {`${item.locker_no}`}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Reason for Return: </label>
          <input
            type='text'
            name='reason_for_return'
            value={formData.reason_for_return}
            onChange={handleInputChange}
          />
        </div>

        {/* Add more input fields for other data */}
        <button
          type='submit'
          className={`submit-button ${isSubmitting ? 'loading' : ''}`}
        >
          {isSubmitting ? 'Generating...' : 'Generate QR Code'}
        </button>
      </form>
      <div style={{ marginTop: '20px', margin: '20px 0px' }}>
        <img src={qrCodeValue?.sellerinfo?.qr_data?.qr_code} alt='' srcset='' />
      </div>
      <div style={{ marginTop: '20px' }}>
        <img src={qrCodeValue?.buyerinfo?.qr_data?.qr_code} alt='' srcset='' />
      </div>
    </div>
  );
}

export default App;
