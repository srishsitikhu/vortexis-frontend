import Image from "next/image";
import React from "react";
import { IconType } from "react-icons";
import { CiDollar, CiGift, CiShop } from "react-icons/ci";
import { FaSackDollar } from "react-icons/fa6";

const iconMap = {
  CiShop: CiShop,
  CiDollar: CiDollar,
  CiGift: CiGift,
  FaSackDollar: FaSackDollar,
};

type feature = {
  icon: keyof typeof iconMap;
  title: string;
  description: string;
};

const Aboutpage = () => {
  const features1: feature[] = [
    {
      icon: "CiShop",
      title: "10.5K",
      description: "Sallers active our site",
    },
    {
      icon: "CiDollar",
      title: "33K",
      description: "Monthly Product Sale",
    },
    {
      icon: "CiGift",
      title: "45.5K",
      description: "Customer active in our site",
    },
    {
      icon: "FaSackDollar",
      title: "10.5K",
      description: "Annual gross sales in our site",
    },
  ];
  // const features2: feature[] = [
  //   {
  //     img: "CiShop",
  //     title: "10.5K",
  //     description: "Sallers active our site",
  //   },
  //   {
  //     img: "CiDollar",
  //     title: "33K",
  //     description: "Monthly Product Sale",
  //   },
  //   {
  //     img: "BsBagCheck",
  //     title: "45.5K",
  //     description: "Customer active in our site",
  //   },
  // ];
  return (
    <div className="mx-35">
      <h1>
        Home / <b>About</b>
      </h1>
      <div className="flex justify-center items-center m-4 p-4 gap-4">
        <div className="w-130">
          <h1 className="text-4xl mb-4">Our Story</h1>
          <p className="text-justify">
            Launced in 2015, Vortexis is South Asias premier online shopping
            makterplace with an active presense in Bangladesh. Supported by wide
            range of tailored marketing, data and service solutions, Vortexis
            has 10,500 sallers and 300 brands and serves 3 millioons customers
            across the region. <br />
            <br />
            Vortexis has more than 1 Million products to offer, growing at a
            very fast. Vortexis offers a diverse assotment in categories ranging
            from consumer.
          </p>
        </div>
        <div>
          <Image src="/SideImageAbout.jpg" alt="About Us" width={500} height={300} />
        </div>
      </div>
      <div className="flex gap-10 justify-center mb-8">
        {features1.map((feature, index) => {
          const IconComponent: IconType = iconMap[feature.icon];
          return (
            <div
              key={index}
              className="group flex flex-col items-center px-6 py-4 gap-2 bg-white border-1 border-[#0000004D] hover:bg-red-500 hover:border-red-500 transition-all ease-in-out duration-300"
            >
              <div className="rounded-full p-4 bg-neutral-400 group-hover:bg-neutral-300">
                <IconComponent
                  size={60}
                  className="rounded-full p-2 bg-neutral-900 text-neutral-100 group-hover:bg-neutral-100 group-hover:text-neutral-900"
                />
              </div>
              <h1 className="text-2xl font-bold text-neutral-900 group-hover:text-neutral-100">
                {feature.title}
              </h1>
              <h1 className="text-neutral-900 group-hover:text-neutral-100">
                {feature.description}
              </h1>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Aboutpage;
