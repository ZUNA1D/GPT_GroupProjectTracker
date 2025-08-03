import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {z} from 'zod'
import { SignInSchema } from '@/lib/schema'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Link, useNavigate } from 'react-router'
import { useLoginMutation } from '@/hooks/use-auth'
import { toast } from 'sonner'
import { useAuth } from '@/provider/auth-context'


type SignInFormData = z.infer<typeof SignInSchema>;
const SignIn = () => {
    const {login} = useAuth();
    const navigate = useNavigate();
    const form = useForm<z.infer<typeof SignInSchema>>(
        {
            resolver: zodResolver(SignInSchema),
            defaultValues: {
                email: '',
                password: ''
            }
        }
    );

    const {mutate,isPending} = useLoginMutation();
    
    const handleOnSubmit = (values: SignInFormData) => {
        mutate(values, {
            onSuccess: (data) => {
                // Handle successful login
                login(data);
                console.log('Login successful:', data);
                toast.success('Login successful!');
                navigate('/dashboard');
            },
            onError: (error: any) => {
                // Handle error
                const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
                console.error('Login failed:', error);
                toast.error(errorMessage);
            }
        });
    };
  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-muted/40 p-4'>
        <Card className='max-w-md w-full p-6'>
            <CardHeader>
                <CardTitle className='text-2xl font-bold'>Sign In</CardTitle>
                    <CardDescription className='text-sm text-muted-foreground'>Welcome back! Please sign in to your account.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleOnSubmit)} className='space-y-4'>
                        <FormField 
                        control={form.control} 
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email Address</FormLabel>
                                    <FormControl>
                                        <Input type='email' placeholder='Enter your email' {...field} />
                                    </FormControl>
                                <FormMessage />
                                    
                            </FormItem>
                        )}
                        />
                        <FormField 
                        control={form.control} 
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <div className='flex justify-between items-center'>
                                    <FormLabel>Password</FormLabel>
                                    <Link to="/forgot-password" className='text-sm text-blue-500 hover:underline'>Forgot Password?</Link>
                                </div>
                                <FormControl>
                                    <Input type='password' placeholder='******' {...field} />
                                </FormControl>
                                <FormMessage />
                                    
                            </FormItem>
                        )}
                        />

                        <Button type='submit' className='w-full bg-blue-500 hover:bg-blue-600 text-white' disabled={isPending}>
                            {isPending ? 'Signing In...' : 'Sign In'}
                        </Button>  
                    </form> 
                </Form>
                    
                <CardFooter className='mt-4 text-sm text-muted-foreground'>
                    Don't have an account? <Link to="/sign-up" className='text-blue-500 hover:underline'>Sign Up</Link>
                </CardFooter>

            </CardContent>
        </Card>
    </div>
  )
}

export default SignIn