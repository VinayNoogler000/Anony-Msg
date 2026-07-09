"use client"
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { signInSchema } from "@/schemas/signInSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

function SingInPage() {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Form Schema
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    }
  });

  // Form onSubmit Handler
  const onSubmit = (data) => {
    setIsSubmitting(true);

    try {
      
    } 
    catch (error) {
      
    }
    finally{
      setIsSubmitting(false);
      form.reset();
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Welcome Back to True Feedback
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
                  <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                  <Input {...field} id={field.name} aria-invalid={fieldState.invalid} type="email"/>
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
                  <Input {...field} id={field.name} aria-invalid={fieldState.invalid} type="password"/>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            
          </FieldGroup>

          <Button type="submit" disabled={isSubmitting} aria-disabled={isSubmitting} className="self-center">
            Sign-In
          </Button>
        </form>
      </div>
    </div>
  )
}

export default SingInPage;