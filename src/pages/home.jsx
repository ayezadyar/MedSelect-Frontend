import React from 'react'
import Header from "../components/header"

export default function Home() {
  return (
    <div>
      <div className="flex flex-col justify-center items-center min-h-screen">
        {/* Logo or Picture */}
        <div className="mb-4 mt-2">
          <img src="/logo.png" alt="Logo" className="w-48 mx-auto mb-2 sm:w-64" />
        </div>

        {/* Search Form */}
        <form className="w-full max-w-md mb-8">
          <div className="flex items-center border-b border-teal-500 py-2">
            <input
              className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
              type="text"
              placeholder="Search for medicine..."
              aria-label="Medicine search"
            />
            <button
              className="flex-shrink-0 bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded"
              type="submit"
            >
              Search
            </button>
          </div>
        </form>

        {/* Cards */}
        <div className="flex flex-wrap justify-around w-full max-w-6xl mb-8">
          {/* Card 1 */}
          <div className="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 mb-4 relative overflow-hidden rounded-lg">
            <div className="bg-teal-500 shadow-md rounded p-4 h-64 text-white cursor-pointer hover:bg-teal-700 transition-all duration-300">
              {/* Centered Image and Text */}
              <div className="flex flex-col items-center">
                <img
                  src="/doseAlarm.png"  // Add the path to your image file
                  alt="Dose Alarm"
                  className="w-28 h-28 mx-auto my-10 mb-2 object-cover rounded"
                />
                <h2 className="text-lg font-semibold mb-2">DOSE ALARM</h2>
              </div>
            </div>
            <div className="hidden absolute top-full left-0 w-full bg-white p-4 rounded shadow-md opacity-0 transition-opacity duration-300">
              {/* Popup Content */}
              Popup Content 1
            </div>
          </div>

          {/* Card 2 */}
          <div className="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 mb-4 relative overflow-hidden rounded-lg">
            <div className="bg-teal-500 shadow-md rounded p-4 h-64 text-white cursor-pointer hover:bg-teal-700 transition-all duration-300">
              {/* Increased Card Height */}
              <h2 className="text-lg font-semibold mb-2">Card 2</h2>
              <p>Card content goes here.</p>
            </div>
            <div className="hidden absolute top-full left-0 w-full bg-white p-4 rounded shadow-md opacity-0 transition-opacity duration-300">
              {/* Popup Content */}
              Popup Content 2
            </div>
          </div>

          {/* Card 3 */}
          <div className="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 mb-4 relative overflow-hidden rounded-lg">
            <div className="bg-teal-500 shadow-md rounded p-4 h-64 text-white cursor-pointer hover:bg-teal-700 transition-all duration-300">
              {/* Increased Card Height */}
              <h2 className="text-lg font-semibold mb-2">Card 3</h2>
              <p>Card content goes here.</p>
            </div>
            <div className="hidden absolute top-full left-0 w-full bg-white p-4 rounded shadow-md opacity-0 transition-opacity duration-300">
              {/* Popup Content */}
              Popup Content 3
            </div>
          </div>
        </div>
      </div>
    </div>

  )
}
