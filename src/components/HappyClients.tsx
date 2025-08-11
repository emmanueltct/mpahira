import React from 'react'

function HappyClients() {
  return (
    <div className="p-4 md:p-6 text-white bg-[#212529] w-full mb-8">
        <div className="flex flex-wrap">
          <div className="w-full md:w-1/2 lg:w-1/4 py-8">
            <div className="md:border-r border-gray-200 px-12">
              <h2 className="text-4xl text-[#909294] md:text-5xl font-semibold text-center">
                2+
              </h2>
              <p className=" mb-2 text-center">Years Experience</p>
            </div>
          </div>
          <div className="w-full md:w-1/2 lg:w-1/4 py-8">
            <div className="lg:border-r border-gray-200 px-12">
              <h2 className="text-4xl text-[#909294] md:text-5xl  font-semibold text-center">
                10+
              </h2>
              <p className=" mb-2 text-center">Happy Clients</p>
            </div>
          </div>
          <div className="w-full md:w-1/2 lg:w-1/4 py-8">
            <div className="md:border-r border-gray-200 px-12">
              <h2 className="text-4xl text-[#909294] md:text-5xl  font-semibold text-center">
                20+
              </h2>
              <p className=" mb-2 text-center">Clients Orders</p>
            </div>
          </div>
          <div className="w-full md:w-1/2 lg:w-1/4 py-8">
            <div className="px-12">
              <h2 className="text-4xl text-[#909294] md:text-5xl  font-semibold text-center">
                10+
              </h2>
              <p className=" mb-2 text-center">Markets</p>
            </div>
          </div>
        </div>
      </div>
  )
}

export default HappyClients