import { fetchCategoryList } from '@/hooks/useProducts';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { useQuery } from '@tanstack/react-query';
import Link from "next/link";

type productSubCategory = {
  subCategoryEng: string;
};

type Category = {
  product: string;
  productSubCategory?: productSubCategory[];
};

export default function DropdownMenu() {
  const {
    data: productCategories = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategoryList,
  });

 
  if (error) return <p>Failed to load categories</p>;

  return (
        <div className="flex flex-col md:flex-row md:gap-4 w-full">
      {isLoading ? (
        // ✅ Loading skeletons
        Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-10 w-32 rounded-md bg-gray-200 animate-pulse"
          />
        ))
      ) : (
        productCategories.map((cat: Category, i: number) => (
          <Menu as="div" key={i} className="relative w-full md:w-auto">
            {({ open }) => (
              <>
                {/* Main Category Button */}
                <MenuButton
                  className={`flex w-full md:w-auto items-center justify-between px-4 py-3 text-md  rounded-md transition 
                    ${open ? "bg-gray-100 border-l-4 border-blue-500 md:border-b-2 md:border-l-0 shadow-md" : "hover:bg-gray-50"}
                  `}
                >
                  {cat.product}
                  <ChevronDownIcon
                    aria-hidden="true"
                    className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
                      open ? "rotate-180 text-blue-500" : ""
                    }`}
                  />
                </MenuButton>

                {/* MOBILE: Inline expand */}
                <div
                  className={`md:hidden overflow-hidden transition-all duration-300 ${
                    open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="flex flex-col bg-gray-50 rounded-md border-l-4 border-blue-100 mt-1">
                    {cat.productSubCategory?.map(
                      (productSubCategory: productSubCategory, a: number) => (
                        <Link
                          key={a}
                          href="#"
                          className="px-6 py-2 text-md  hover:bg-blue-50 hover:text-blue-600 transition"
                        >
                          {productSubCategory.subCategoryEng}
                        </Link>
                      )
                    )}
                  </div>
                </div>

                {/* DESKTOP: Floating dropdown */}
                {open && (
                  <MenuItems
                    static
                    className="hidden md:block absolute left-0 z-10 mt-1 w-56 origin-top-left rounded-md border border-blue-200 bg-white shadow-lg outline-none"
                  >
                    <div className="py-2">
                      {cat.productSubCategory?.map(
                        (productSubCategory: productSubCategory, a: number) => (
                          <MenuItem key={a}>
                            {({ active }) => (
                              <Link
                                href="#"
                                className={`block px-4 py-2 text-md rounded-md transition ${
                                  active
                                    ? "bg-blue-50 text-blue-600 font-medium"
                                    : "text-gray-700"
                                }`}
                              >
                                {productSubCategory.subCategoryEng}
                              </Link>
                            )}
                          </MenuItem>
                        )
                      )}
                    </div>
                  </MenuItems>
                )}
              </>
            )}
          </Menu>
        ))
      )}
    </div>



  );
}
