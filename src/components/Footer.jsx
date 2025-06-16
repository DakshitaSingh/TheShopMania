export const Footer = () =>{
    return(
    <>
    <footer className="bg-[#b5a17b] text-gray-800 pt-14 px-6 mt-20">
    <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
      {/* Branding */}
      <div>
        <h4 className="text-2xl font-bold text-orange-950 mb-3">
          ShopMania
        </h4>
        <p className="text-sm mb-4">
          Bringing all your favorite brands to one place. Shop smart, shop
          easy.
        </p>
        <div className="flex gap-3 text-xl text-pink-500">
          <a href="#">
            <i className="fab fa-facebook hover:text-gray-600"></i>
          </a>
          <a href="#">
            <i className="fab fa-instagram hover:text-gray-600"></i>
          </a>
          <a href="#">
            <i className="fab fa-twitter hover:text-gray-600"></i>
          </a>
          <a href="#">
            <i className="fab fa-youtube hover:text-gray-600"></i>
          </a>
        </div>
      </div>

      {/* Navigation */}
      <div>
        <h5 className="text-lg font-semibold mb-3">Navigation</h5>
        <ul className="space-y-2 text-sm">
          <li>
            <a href="/home" className="hover:text-pink-500">
              Home
            </a>
          </li>
          <li>
            <a href="/dashboard" className="hover:text-pink-500">
              Categories
            </a>
          </li>
          <li>
            <a href="/dashboard" className="hover:text-pink-500">
              Deals
            </a>
          </li>
          <li>
            <a href="/about" className="hover:text-pink-500">
              About Us
            </a>
          </li>
          <li>
            <a href="/login" className="hover:text-pink-500">
              Login/SignUp
            </a>
          </li>
        </ul>
      </div>

      {/* Categories */}
<div>
  <h5 className="text-lg font-semibold mb-3">Popular Categories</h5>
  <ul className="space-y-2 text-sm text-gray-700">
    <li><span className="cursor-default">Men’s Clothing</span></li>
    <li><span className="cursor-default">Women’s Fashion</span></li>
    <li><span className="cursor-default">Kids Wear</span></li>
    <li><span className="cursor-default">Footwear</span></li>
    <li><span className="cursor-default">Accessories</span></li>
  </ul>
</div>


      {/* Newsletter */}
     
        <div className="mt-4 text-sm">
          <p>
            <strong>Email:</strong> support@shopmania.com
          </p>
          <p>
            <strong>Phone:</strong> +91 9876543210
          </p>
          <p>
            <strong>Hours:</strong> Mon-Fri, 10am - 6pm
          </p>
        </div>
      </div>
  

    {/* Bottom */}
    <div className="border-t border-gray-200 mt-12 pt-6 text-center text-xs text-gray-500">
      &copy; {new Date().getFullYear()} The ShopMania. All rights reserved.
      | Designed with ❤️ By Dakshita+Manya
    </div>
  </footer>
    </>
    )
    
}