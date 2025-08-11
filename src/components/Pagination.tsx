// components/Pagination.tsx
export const Pagination = ({ currentPage, totalPages, onPageChange }: any) =>{

       console.log("+++++++++++++++++++++++++++++++++++++++++++++",totalPages)
return (
 
  <div className="flex justify-center mt-4 gap-2">
    <button
      onClick={() => onPageChange(currentPage - 1)}
      disabled={currentPage === 1}
      className="px-3 py-1 border rounded disabled:opacity-50"
    >
      Prev
    </button>
    {[...Array(totalPages)].map((_, i) => (
      <button
        key={i}
        onClick={() => onPageChange(i + 1)}
        className={`px-3 py-1 border rounded ${currentPage === i + 1 ? 'bg-primary text-white' : ''}`}
      >
        {i + 1}
      </button>
    ))}
    <button
      onClick={() => onPageChange(currentPage + 1)}
      disabled={currentPage === totalPages}
      className="px-3 py-1 border rounded disabled:opacity-50"
    >
      Next
    </button>
  </div>
)};
