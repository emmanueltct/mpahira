// CartProductPage.jsx
export default function CartProductPage() {
  return (
    <div className="max-w-sm w-full bg-white shadow-md rounded-lg overflow-hidden border p-3 mx-auto">
      <div className="flex flex-col sm:flex-row items-center sm:items-start">
        {/* Product Image */}
        <img
          src="/images/sample.jpg"
          alt="Isabune"
          className="w-full sm:w-32 sm:h-32 object-cover rounded-2xl"
        />

        {/* Product Details */}
        <div className="flex-1 sm:ml-4 mt-3 sm:mt-0">
          <h2 className="text-lg font-semibold">
            Isabune : <span className="text-gray-600">2000/kg</span>
          </h2>

          {/* Quantity Controls */}
          <div className="flex items-center space-x-4 my-3">
            <button className="w-8 h-8 border border-orange-500 text-orange-500 rounded-full flex items-center justify-center text-lg font-bold">
              −
            </button>
            <input
              type="number"
              value={4}
              className="w-14 text-center border rounded-md"
              readOnly
            />
            <button className="w-8 h-8 border border-orange-500 text-orange-500 rounded-full flex items-center justify-center text-lg font-bold">
              +
            </button>
          </div>

          {/* Total */}
          <p className="text-gray-800 font-semibold">
            Total: <span className="text-black">8000 RWF</span>
          </p>

          {/* Action Icons */}
          <div className="flex space-x-4 mt-3">
            <button className="text-blue-500 hover:text-blue-700" title="View">
              👁
            </button>
            <button className="text-blue-500 hover:text-blue-700" title="Message">
              💬
            </button>
            <button className="text-red-500 hover:text-red-700" title="Delete">
              🗑
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
