"use client"
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { signInSchema } from "@/schemas/signInSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

function SingInPage() {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const router = useRouter();

  // Form Schema
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: '',
    }
  });

  // Form onSubmit Handler
  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true);
    const callbackUrl = new URLSearchParams(window.location.search).get("callbackUrl") || "/dashboard";

    const result = await signIn("credentials", {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
      callbackUrl,
    })

    if (result?.error) {
      toast.error("Login Failed", { description: result.error, dismissible: true, duration: 10000 });
      
      if (result.error.includes("User Not Verified")) {
        router.replace(`/verify/${data.identifier}`);
      }
    }

    if (result?.url) {
      router.replace(result.url);
    }

    setIsSubmitting(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Welcome Back to AnonyMsg
          </h1>
          <p className="mb-4">Sign in to continue your secret conversations🤫</p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col space-y-6">
          <FieldGroup className="@container/field-group">
            <Controller
              name="identifier"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} orientation={"responsive"}>
                  <FieldLabel htmlFor={field.name}>Email/Username</FieldLabel>
                  <Input {...field} id={field.name} aria-invalid={fieldState.invalid} placeholder="For ex:  'johndoe@gmail.com' or 'jd007'" type="text" autoComplete="username" />
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
                  <Input {...field} id={field.name} aria-invalid={fieldState.invalid} placeholder="For ex:  'as0f94Gjf0(*f)_A'" type="password" autoComplete="current-password" />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

          </FieldGroup>

          <Button type="submit" disabled={isSubmitting} aria-disabled={isSubmitting} className="self-center">
            { isSubmitting ? <> <Loader2 className="mr-2 h-4 w-4 animate-spin"/>  Signing in... </>  : "Sign In" }
          </Button>
        </form>

        <div className="text-center mt-4">
          <p>
            New User?{' '}
            <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SingInPage;