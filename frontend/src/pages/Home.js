import React from 'react'
import { Link } from 'react-router-dom'
import { RiCustomerService2Fill } from 'react-icons/ri'
import CategoryList from '../components/CategoryList'
import BannerProduct from '../components/BannerProduct'
import HorizontalCardProduct from '../components/HorizontalCardProduct'
import VerticalCardProduct from '../components/VerticalCardProduct'

const Home = () => {
  return (
    <div>
      <CategoryList/>
      <BannerProduct/>

      <HorizontalCardProduct category={"airpodes"} heading={"Top's Airpodes"}/>
      <HorizontalCardProduct category={"watches"} heading={"Popular's Watches"}/>

      <VerticalCardProduct category={"mobiles"} heading={"Mobiles"}/>
      <VerticalCardProduct category={"Mouse"} heading={"Mouse"}/>
      <VerticalCardProduct category={"televisions"} heading={"Televisions"}/>
      <VerticalCardProduct category={"camera"} heading={"Camera & Photography"}/>
      <VerticalCardProduct category={"earphones"} heading={"Wired Earphones"}/>
      <VerticalCardProduct category={"speakers"} heading={"Bluetooth Speakers"}/>
      <VerticalCardProduct category={"refrigerator"} heading={"Refrigerator"}/>
      <VerticalCardProduct category={"trimmers"} heading={"Trimmers"}/>

      <Link to="/assistant" className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-red-600 px-4 py-3 text-white shadow-xl shadow-red-400/30 transition hover:bg-red-700">
        <RiCustomerService2Fill className="text-2xl" />
        <span className="hidden sm:inline-block font-medium">AI Help</span>
      </Link>
    </div>
  )
}

export default Home