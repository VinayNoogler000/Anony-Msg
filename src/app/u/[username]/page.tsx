"use client"

import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { msgSchema } from '@/schemas/msgSchema';
import ApiResponse from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { useCompletion } from '@ai-sdk/react';

function page() {
  const { username } = useParams();
  const [ isSending, setIsSending ] = useState<boolean>(false);
  const { completion, complete, isLoading, stop, error } = useCompletion({
    api: '/api/suggest-messages/',
    streamProtocol: "text",
    onFinish: () => (error !instanceof Error) && toast.success("Message Suggestions Completed", {dismissible: true}),
    onError: (error) => toast.error("An Error Occurred", {description: error.message, dismissible: true})
  });

  const form = useForm<z.infer<typeof msgSchema>>({
    resolver: zodResolver(msgSchema),
    defaultValues: { content: "" }
  });

  const sendMessage = async (data: z.infer<typeof msgSchema>) => {
    setIsSending(true);

    try {
      await axios.post<ApiResponse>("/api/send-message/", { username, content: data.content });
      toast.success("Message Sent!", {dismissible: true});
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
    await complete('');
    // try {
    //   await complete('');
    // } 
    // catch (err) {
    //   const axiosError = err as AxiosError<ApiResponse>;
    //   toast.error("Failed to Suggest Messages.", {description: axiosError.response?.data.message, dismissible: true});
    // }
  }

  const suggestions = completion.split("||").map((msg) => msg.trim());

  useEffect(() => {
    if (error) {
      toast.error(error.message)
    }
  }, [error])

  return (
    <div>
      <h1 className="text-4xl font-bold">Public Profile Link</h1>
      
      <div>
        <form onSubmit={form.handleSubmit(sendMessage)}>
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
        <Button type="button" disabled={isLoading} aria-disabled={isLoading} className="" onClick={handleSuggestMsgsBtnClick}>
            Suggest Messages
        </Button>
        
        <Button type="button" disabled={!isLoading} aria-disabled={!isLoading} className="" onClick={stop}>
            Stop
        </Button>

        { error && (<p> {error.message} </p>) }

        <div className="mt-4">
          { isLoading && completion.length === 0 && <p>Suggesting...</p> }

          {suggestions.length > 0 && (
            <ul>
              {suggestions.map((msg, idx) => (
                <li key={idx}>{msg}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

export default page