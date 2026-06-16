import React from "react";
import { IconType } from "react-icons";
import { CiCamera, CiDesktop, CiHeadphones, CiMobile3 } from "react-icons/ci";
import { IoGameControllerOutline } from "react-icons/io5";
import { PiWatchLight } from "react-icons/pi";

const iconMap = {
  CiMobile3: CiMobile3,
  CiDesktop: CiDesktop,
  PiWatchLight: PiWatchLight,
  CiCamera: CiCamera,
  CiHeadphones: CiHeadphones,
  IoGameControllerOutline: IoGameControllerOutline,
};
type CategoriesProps = {
  icon: keyof typeof iconMap;
  title: string;
};
const Categoriescard = () => {
  const categories: CategoriesProps[] = [
    {
      icon: "CiMobile3",
      title: "Phones",
    },
    {
      icon: "CiDesktop",
      title: "Computer",
    },
    {
      icon: "PiWatchLight",
      title: "SmartWatch",
    },
    {
      icon: "CiCamera",
      title: "Camera",
    },
    {
      icon: "CiHeadphones",
      title: "HeadPhones",
    },
    {
      icon: "IoGameControllerOutline",
      title: "Gaming",
    },
  ];
  return (
    <div>
      <h1 className="border-l-15 border-red-500 text-xl px-4">Categories</h1>
      <div>
        <h1 className="text-4xl font-semibold py-4">Browser By Category</h1>
        <div className="flex justify-between">
          {categories.map((categorie, index) => {
            const IconComponent: IconType = iconMap[categorie.icon];
            return (
              <div
                key={index}
                className="border-1 py-8 px-12 flex flex-col items-center"
              >
                <IconComponent size={50} />
                <h1>{categorie.title}</h1>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Categoriescard;
