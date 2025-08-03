import React from 'react'
import type { Route } from '../../+types/root';
import { Link } from 'react-router';
import { Button } from '@/components/ui/button';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "GPT" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

const Homepage = () => {
  return (
    <div className='w-full h-screen flex items-center justify-center gap-4'>
        <Link to="/sign-in">
            <Button className='bg-blue-500 white-text'>Login</Button>
        </Link>
        <Link to="/sign-up">
            <Button className='bg-green-500 white-text'>Sign Up</Button>    
        </Link>
        
    </div>
  )
}

export default Homepage