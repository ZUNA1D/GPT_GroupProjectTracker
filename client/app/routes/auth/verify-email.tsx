import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import React, { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router'

import {Loader} from 'lucide-react'
import { useVerifyEmailMutation } from '@/hooks/use-auth';
import { toast } from 'sonner';

const VerifyEmail = () => {

  const [searchParams] = useSearchParams();
  const [isSuccess, setIsSuccess] = useState(false);
  const {mutate, isPending: isVerifying } = useVerifyEmailMutation();
  const token = searchParams.get('token');

  useEffect(() => {
    if (token){
          mutate({ token }, {
              onSuccess: () => {
                  setIsSuccess(true);
              },
              onError: (error: any) => {
                  const errorMessage = error.response?.data?.message || 'An error occurred during email verification';
                  setIsSuccess(false);
                  console.log(error)
                  toast.error(errorMessage)
              }
          }); 
        }
  }, [searchParams])

  return (
    <div className='flex flex-col items-center justify-center h-screen bg-muted/40 p-4'>
      <h1 className='text-2xl font-bold'>Verify Email</h1>
      {/* <p>Verifying your email.</p> */}

      <Card className='max-w-md w-full p-6 mt-4'>
        {/* <CardHeader>
          <Link to='sign-in' className='flex items-center gap-2 hover:underline'> Back to Sign In</Link>
        </CardHeader> */}

        <CardContent className='flex flex-col items-center justify-center space-y-4'>
          {isVerifying ? (
          <>
            <Loader className="h-10 w-10 text-gray animate-spin"/>
            <h3 className='text-lg font-semibold'>Verifying you email...</h3>
            <p className='text-sm text-gray-500'>Please wait while your email verifies.</p>

          </>
          ) :isSuccess ? (
            <div className='text-center'>
              <h3 className='text-lg font-semibold text-green-500'>Email verified successfully!</h3>
              <Link to='/sign-in' className='mt-4'>
              <Button variant="outline">Back to Sign In</Button>
              </Link>
            </div>
          ) : (
            <div className='text-center' >
              <h3 className='text-lg font-semibold text-red-500'>Email verification failed. Please try again.</h3>
              <Link to='/sign-in' className='mt-4'>
              <Button variant="outline" className='text-sm '>Back to Sign In</Button>
              </Link>
            </div>
            
          )}
        </CardContent>

      </Card>
      
    </div>
  )
}

export default VerifyEmail