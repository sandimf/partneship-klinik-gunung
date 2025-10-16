import { header } from '@/data/header'
import React from 'react'
// Component Header 
// use data for landing page 
export const Header = () => {
    return (
        <div>
            <h1 className='text-center bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-3xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white text-transparent mb-3 tracking-tight leading-none dark:from-white dark:to-slate-900/10'>{header.title}<span className="text-gray-900 dark:text-white"><br/>{header.subtitle}</span></h1>
        </div>
    )
}
