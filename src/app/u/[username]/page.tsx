"use client"

import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { msgSchema } from '@/schemas/msgSchema';
import ApiResponse from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

function page() {
  const { username } = useParams();
  const [ isSending, setIsSending ] = useState<boolean>(false);
  const [ isSuggesting, setIsSuggesting ] = useState<boolean>(false);

  const form = useForm<z.infer<typeof msgSchema>>({
    resolver: zodResolver(msgSchema),
    defaultValues: { content: "" }
  });

  const onSubmit = async (data: z.infer<typeof msgSchema>) => {
    setIsSending(true);

    try {
      const response = await axios.post<ApiResponse>("/api/send-message/", { username, content: data.content });
      toast.success("Message Sent", {dismissible: true});
    }
    catch(err) {
      console.error("Error in Sending Message: ", err);
      const axiosError = err as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message || "Failed to send message. Please try again later!", {dismissible: true });
    }
    finally {
      setIsSending(false);
    }
  }

  const handleSuggestMsgsBtnClick = async () => {
    setIsSuggesting(true);

    try {
      const response = await axios.get("/api/suggest-messages/");
      console.log(response.data);
      toast.success("Message Suggestions Loaded", {dismissible: true});
    } 
    catch (err) {
      const axiosError = err as AxiosError<ApiResponse>;
      toast.error("Failed to Suggest Messages.", {description: axiosError.response?.data.message, dismissible: true});
    }
    finally {
      setIsSuggesting(false);
    }
  }

  return (
    <div>
      <h1 className="text-4xl font-bold">Public Profile Link</h1>
      
      <div>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Controller
            name="content"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} orientation={"responsive"}>
                <FieldLabel htmlFor={field.name}> Send Anonymouse Message to @{username} </FieldLabel>

                <Input {...field} id={field.name} aria-invalid={fieldState.invalid} placeholder='Write your "anonymous message" here.' /> 
                
                {fieldState.invalid && ( <FieldError errors={[fieldState.error]} /> )}
              </Field>
            )}
          />

          <Button type="submit" disabled={isSending} aria-disabled={isSending} className="" >
            Send It
          </Button>
        </form>
      </div>

      <div>
        <Button type="button" disabled={isSuggesting} aria-disabled={isSuggesting} className="" onClick={handleSuggestMsgsBtnClick}>
            Suggest Messages
        </Button>
      </div>
    </div>
  )
}

export default page