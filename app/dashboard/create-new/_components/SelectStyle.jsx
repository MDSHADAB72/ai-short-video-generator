import React, { useState } from 'react';
import Image from 'next/image';

function SelectStyle({onUserSelect}) {
  const styleOptions = [
    {
      name: 'Realistic',
      image: '/Realistics.png',
    },
    {
      name: 'Cartoon',
      image: '/cartoon.png',
    },
    {
      name: 'Comic',
      image: '/comic.png',
    },
    {
      name: 'WaterColor',
      image: '/watercolor.png',
    },
    {
      name: 'GTA',
      image: '/gta.png',
    }
  ];

  const [selectedOption, setSelectedOption] = useState();

  return (
    <div className='mt-6'>
      <h2 className='font-bold text-2xl text-primary'>Style</h2>
      <h2 className='text-gray-500'>Select your video Style</h2>
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-3'>
        {styleOptions.map((item, index) => (
          <div key={index} className={`relative hover:scale-105 transition-all cursor-pointer rounded-lg
            ${selectedOption === item.name&& 'border-2 border-primary'}`
          }> 
            <Image 
              src={item.image} 
              width={100} 
              height={100} 
              alt={item.name} 
              className='h-60 object-cover rounded-lg w-full'
            onClick={ () => {
              setSelectedOption(item.name)
              onUserSelect('imageStyle', item.name)
            } }
            />
            <h2 className='absolute p-1 bg-gray-200 bottom-0 w-full text-primary text-center rounded-b-lg'>{item.name}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SelectStyle;
