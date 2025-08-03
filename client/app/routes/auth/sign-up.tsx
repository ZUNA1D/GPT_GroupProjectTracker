import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import z from 'zod'
import { SignUpSchema } from '@/lib/schema'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Link, useNavigate } from 'react-router'
import { useSignUpMutation } from '@/hooks/use-auth'
import { toast } from 'sonner'

export type SignUpFormData = z.infer<typeof SignUpSchema>;

const SignUp = () => {
    const navigate = useNavigate();
    const form = useForm<z.infer<typeof SignUpSchema>>(
        {
            resolver: zodResolver(SignUpSchema),
            defaultValues: {
                email: '',
                password: '',
                name: '',
                confirmPassword: ''
            }
        }
    );

    const {mutate, isPending} = useSignUpMutation();

    const handleOnSubmit = (values: SignUpFormData) => {
        mutate(values, {
            onSuccess: () => {
                toast.success('Email Verification Required.', {
                    description: 'Please check your email to verify your account.',});
                form.reset();
                navigate('/sign-in');
                },
            onError: (error:any) => {
                const errorMessage = error.response?.data?.message || 'An error occurred during sign up';
                console.error('Sign up failed:', error);
                toast.error(errorMessage);
            },
        });
    };
  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-muted/40 p-4'>
        <Card className='max-w-md w-full p-6'>
            <CardHeader>
            <CardTitle className='text-2xl font-bold'>Sign Up</CardTitle>
            <CardDescription className='text-sm text-muted-foreground'>Create an account</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleOnSubmit)} className='space-y-4'>
                        <FormField 
                        control={form.control} 
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl>
                                    <Input type='text' placeholder='Enter your name' {...field} />
                                </FormControl>
                                <FormMessage />
                                    
                            </FormItem>
                        )}
                        />
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
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input type='password' placeholder='******' {...field} />
                                </FormControl>
                                <FormMessage />
                                    
                            </FormItem>
                        )}
                        />
                        <FormField 
                        control={form.control} 
                        name="confirmPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Confirm Password</FormLabel>
                                <FormControl>
                                    <Input type='password' placeholder='******' {...field} />
                                </FormControl>
                                <FormMessage />
                                    
                            </FormItem>
                        )}
                        />

                        <Button type='submit' className='w-full bg-blue-500 hover:bg-blue-600 text-white' disabled={isPending}>
                        {isPending ? 'Signing Up...' : 'Sign Up'}
                        </Button>  
                    </form> 
                </Form>
                    
                <CardFooter className='mt-4 text-sm text-muted-foreground'>
                    Already have an account? <Link to="/sign-in" className='text-blue-500 hover:underline'>Sign In</Link>
                </CardFooter>

            </CardContent>
        </Card>
    </div>
  )
}

export default SignUp