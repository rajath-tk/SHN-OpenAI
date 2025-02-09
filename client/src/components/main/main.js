import React, { useState } from 'react';import 'bootstrap/dist/css/bootstrap.min.css';
import Background from "../../assets/grid.svg";
import axios from 'axios';
import anim from "../../assets/loading.json";
import Lottie from "lottie-react";
function MyApp() {
  const [textAreaValue, setTextAreaValue] = useState('');
  const [image, setImage] = useState(null);
  const [dalle, setDalle] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dall_img, setDall_img] = useState("");
  const [selectedFileName, setSelectedFileName] = useState('CHOOSE OR DROP FILES');

 

  const [selectedButton, setSelectedButton] = useState('');

  const handleButtonClick = (button) => {
    setSelectedButton(button);
    
    
  };

  const handleCheckboxChange = (event) => {
    const isChecked = event.target.checked;
    setDalle(isChecked);
  }

  const handleTextAreaChange = (event) => {
    setTextAreaValue(event.target.value);
  }

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setImage(file);
    setSelectedFileName(file ? file.name : 'CHOOSE OR DROP FILES');
  }

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('image', image);
    formData.append('code', selectedButton);
    formData.append('dalle', dalle);
    setLoading(true);
    console.log(image);
    try {
      const response = await axios.post('http://localhost:5000/process_image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      var data = response;
      setLoading(false);
      setTextAreaValue(data.data.text);
      setDall_img(data.data.image_link);
    } catch (error) {
      console.error(error);
    }
  }

  const buttons = ['Expand Text', 'Compress Text', 'Write in Points', 'Spelling Correct', 'Grammatical Errors', 'Solve'];

  return (
    <div
      style={{
        backgroundImage: `url(${Background})`,
        backgroundRepeat: ' repeat',
      }}
      className="bg-black text-gray-200 flex flex-col min-h-screen w-full"
    >
      <div className='mt-4 text-center'>
        <h className="text-4xl text-white  font-bold">TextGenie<span className='text-lime-500'>.</span></h>
      </div>

      
      
      <div className='justify-between mt-5 mb-5 w-3/4 flex flex-col-reverse md:flex-row self-center'>
        <div className='space-y-2 md:space-y-0 w-full md:w-1/2 flex flex-col'>
          <div className='hidden md:block lg:w-5/6'>
            {buttons.map((buttonName, index) => (
              <button
                key={index}
                onClick={() => handleButtonClick(index)}
                className={`px-4 py-2 mr-2 mt-2 rounded-md ${
                  selectedButton === index 
                    ? 'bg-blue-500 text-white'
                    : 'border border-2 border-white text-gray'
                }`}
              >
                {buttonName}
              </button>
            ))}
          </div>

          <div className='md:hidden w-full'>
  <select
    id="countries"
    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
    onChange={(event) => handleButtonClick(event.target.value)}
    value={selectedButton}
  >
    <option value="" disabled>
      Choose an option
    </option>
    {buttons.map((button, index) => (
      <option key={index} value={index}>
        {button}
      </option>
    ))}
  </select>
</div>


          <div>
            <input type="checkbox" onChange={handleCheckboxChange} />
            <label className='text-label'>Generate Image using Dall-E</label>
          </div>

          <button className='p-2 bg-lime-500 rounded-md text-black w-fit' onClick={handleSubmit}>Proceed</button>
        </div>

        <div className="bg-gray-300 w-full lg:w-1/3 md:w-1/2 rounded-lg">
          <div className="">
            <svg className="text-indigo-500 w-24 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <div className="input_field flex flex-col w-max mx-auto text-center">
              <label>
                <input
                  className="text-sm cursor-pointer w-36 hidden"
                  type="file"
                  onChange={handleImageChange}
                />
                <div className="text bg-indigo-600 text-white border border-gray-300 rounded font-semibold cursor-pointer p-1 px-3 hover:bg-indigo-500">Select</div>
              </label>
              {/* Display selected file name */}
              <div className="text-gray-600 mt-1">{selectedFileName}</div>
            </div>
          </div>
        </div>
      </div>

      <div className={` p-4 bg-indigo-800 rounded-md w-5/6 md:w-3/4 self-center relative ${loading ? 'hidden' : ''}`}>
        <button className='absolute p-2 bg-lime-400 text-black rounded-md top-0 right-0 mt-2 mr-2' >Copy📃</button>
        <textarea id="text-area" rows="12" className='  pt-1 w-full bg-transparent focus:outline-none' value={textAreaValue} onChange={handleTextAreaChange} />
      </div>
      <div className={` bg-transparent flex justify-center  rounded-md w-5/6 md:w-3/4 self-center relative ${!loading ? 'hidden' : ''}`}>
          <Lottie style={{  width: '100%', maxWidth: '450px', maxHeight: '400px' }} animationData={anim} loop={true} />
      </div>
      {dalle && <button className='button'><a href={dall_img} target='_blank' rel="noreferrer">CLICK HERE TO VIEW IMAGE</a></button>}

    </div>
  );
}

export default MyApp;
