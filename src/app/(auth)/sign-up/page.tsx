"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDebounceCallback } from 'usehooks-ts'
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/schemas/signUpSchema"
import axios, { AxiosError } from "axios"
import type ApiResponse from "@/types/ApiResponse"
import { Field, FieldLabel, FieldError, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

function page() {
  const [username, setUsername] = useState<string>("");
  const [usernameMsg, setUsernameMsg] = useState<string>("");
  const [isCheckingUsername, setIsCheckingUsername] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const debounced = useDebounceCallback(setUsername, 800);
  const router = useRouter();

  // zod implementation
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: ""
    }
  });

  useEffect(() => {
    // Only check username after user has typed something
    if (!username) {
      return;
    }

    // Check-Username Unique IIFE 
    (async () => {
      setIsCheckingUsername(true);
      setUsernameMsg("");

      try {
        const response = await axios.get<ApiResponse>(`/api/unique-username?username=${username}`);
        setUsernameMsg(response.data.message);
      }
      catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        setUsernameMsg(axiosError.response?.data.message ?? "Error Checking Username");
      } 
      finally {
        setIsCheckingUsername(false);
      }
    })();
    
  }, [username])

  const onSubmit = async (data:z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);

    try {
      const response = await axios.post<ApiResponse>("/api/sign-up", data);
      if (response.data.success) {
        toast.success("Success", { description: response.data.message });
        router.replace(`/verify/${username}`); // render the verification-code page to allow users to verify them. 
        form.reset(); // only reset the form upon successful signup
      }
    }
    catch (error) {
      console.error("Error in Signup: ", error);
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMsg = axiosError.response?.data.message;
      toast.error("Signup Failed", { description: errorMsg, dismissible: true });
    }
    finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join AnonyMsg
          </h1>
          <p className="mb-4">Sign-In to continue your <b>Secret Conversations</b>🤫</p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FieldGroup className="@container/field-group">
            <Controller
              name="username"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} orientation={"responsive"}>
                  <FieldLabel htmlFor={field.name}>Username</FieldLabel>
                  <Input {...field} id={field.name} aria-invalid={fieldState.invalid} 
                    onChange={(e) => {
                      field.onChange(e);
                      debounced(e.target.value)
                    }}/>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            { isCheckingUsername && <> 
              <Loader2 className="animate-spin" /> 
              Checking Username Availability...  
            </> }
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} orientation={"responsive"}>
                  <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                  <Input {...field} id={field.name} aria-invalid={fieldState.invalid}/>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} orientation={"responsive"}>
                  <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                  <Input {...field} id={field.name} aria-invalid={fieldState.invalid}/>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>

          <Button type="submit" aria-disabled={isSubmitting}>
              { isSubmitting ? (
                  <> <Loader2 className="mr-2 h-4 w-4 animate-spin"/>  Please Wait...! </>
                ) : "Signup" }
          </Button>
        </form>

        <div className="text-center mt-4">
          <p>
            Already a member?{' '}
            <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default page