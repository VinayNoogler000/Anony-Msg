"use client"
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { verifySchema } from '@/schemas/verifySchema';
import ApiResponse from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

function VerifyAccountPage() {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const router = useRouter()
  const { username } = useParams<{ username: string }>();
  
  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: { verificationCode: "" }
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    setIsSubmitting(true);

    try {
      const response = await axios.post<ApiResponse>("/api/verify-code", { username, verificationCode: data.verificationCode })
      toast.success(response.data.message, {dismissible: true});
      router.replace("/sign-in");
    } 
    catch (error) {
      console.error("Error in Verifying Code: ", error);
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message, {dismissible: true });
    }
    finally {
      setIsSubmitting(false);
      form.reset();
    }
  };

  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-800'>
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Verify Your Account
          </h1>
          <p className="mb-4">Enter the verification code sent to your email</p>
        </div>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col space-y-6">
          <Controller 
            name='verificationCode'
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} orientation={"responsive"}>
                <FieldLabel htmlFor={field.name}>Verification Code</FieldLabel>
                <Input {...field} id={field.name} aria-invalid={fieldState.invalid} placeholder="Enter Code...">
                </Input>
                { fieldState.invalid && <FieldError errors={[fieldState.error]}/> }
              </Field>
            )}>
          </Controller>

          <Button type="submit" disabled={isSubmitting} aria-disabled={isSubmitting}  className="self-center" >
            Submit
          </Button>
        </form>
      </div>
    </div>
  )
}

export default VerifyAccount;