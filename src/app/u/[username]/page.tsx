"use client"

import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { msgSchema } from '@/schemas/msgSchema';
import ApiResponse from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { useCompletion } from '@ai-sdk/react';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { getErrorMessage } from '@/helpers/error';

const parseJsonErrorMessage = (error:Error | any):string => {
  if ( JSON.parse(error.message).message.includes("No output generated. Check the stream for errors") ) {
    return "Unable to Suggest Messages due to AI Model's rate-limiting or high server-load. Please try again later!";
  }

  return getErrorMessage(error);
}

function page() {
  const { username } = useParams<{ username:string }>();
  const [ isSending, setIsSending ] = useState<boolean>(false);
  const { complete, completion, isLoading:isSuggestionsLoading, stop, error } = useCompletion({
    api: '/api/suggest-messages/',
    streamProtocol: "text",
    onFinish: () => {
      if ( !(error instanceof Error) ) {
        toast.success("Message Suggestions Completed", {dismissible: true});
      }
    },
    onError: (error) => toast.error("An Error Occurred", {description: parseJsonErrorMessage(error), dismissible: true}),
    initialCompletion: "What's your favorite movie?||Do you have any pets?||What's your dream job?"
  });

  const { watch, setValue, handleSubmit, control, reset } = useForm<z.infer<typeof msgSchema>>({
    resolver: zodResolver(msgSchema),
    defaultValues: { content: "" }
  });

  const msgContent = watch("content");

  const sendMessage = async (data: z.infer<typeof msgSchema>) => {
    setIsSending(true);

    try {
      await axios.post<ApiResponse>("/api/send-message/", { username, content: data.content });
      toast.success("Message Sent!", {dismissible: true});
      reset({ content: '' });
    }
    catch(err) {
      console.error("Error in Sending Message: ", err);
      const axiosError = err as AxiosError<ApiResponse>;
      toast.error("Error", {description: axiosError.response?.data.message || "Failed to send message. Please try again later!", dismissible: true });
    }
    finally {
      setIsSending(false);
    }
  }

  const fetchMsgSuggestions = async () => {
    try {
      complete('');
    }
    catch (error) {
      console.error('Error fetching messages:', error);
      toast.error("Error", {description: "Message Suggestions Failed due to technical issues. Please try again later!", dismissible: true });
    }
  }

  const suggestions = completion.split("||");

  return (
    <div className="container mx-auto my-8 p-6 bg-white rounded max-w-4xl">
      <h1 className="text-4xl font-bold mb-6 text-center">Public Profile Link</h1>

      <form onSubmit={handleSubmit(sendMessage)} className="space-y-6">
        <Controller
          name="content"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} orientation={"responsive"}>
              <FieldLabel htmlFor={field.name}> Send Anonymouse Message to <span className="border-y-2 border-gray-
              300 rounded-sm">@{username}</span> </FieldLabel>

              <Textarea
                {...field} id={field.name} aria-invalid={fieldState.invalid}
                placeholder="Write your anonymous message here..."
                className="resize-none"
              />

              {fieldState.invalid && (<FieldError errors={[fieldState.error]} />)}
            </Field>
          )}
        />

        <div className="flex justify-center">
          <Button type="submit" disabled={isSending || !msgContent} aria-disabled={isSending || !msgContent} className={isSending ? "mr-2 h-4 w-4 animate-spin" : ''} >
            {isSending ?
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please Wait...!
              </> :
              "Send It"
            }
          </Button>
        </div>
      </form>

      <div className="space-y-4 my-8">

        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2">
            <Button onClick={fetchMsgSuggestions} className="my-4" disabled={isSuggestionsLoading} aria-disabled={isSuggestionsLoading} >
              Suggest Messages
            </Button>

            <Button type="button" disabled={!isSuggestionsLoading} aria-disabled={!isSuggestionsLoading} onClick={stop}>
              Stop
            </Button>
          </div>
          
          <p>Click on any message below to select it.</p> 
        </div>
        
        
        <Card>
          <CardHeader>
            <h3 className="text-xl font-semibold">Messages</h3>
          </CardHeader>

          <CardContent className="flex flex-col space-y-4">
            {error ?
              (<p className="text-red-500">{parseJsonErrorMessage(error)}</p>) :
              (suggestions.map((msg, idx) => (
                <Button key={idx} variant="outline" className="mb-2" onClick={() => setValue("content", msg)}>
                  {msg}
                </Button>
              )))
            }
          </CardContent>
        </Card>
        
      </div>  

      <Separator className="my-6" />
      
      <footer className="py-6 text-center flex flex-col gap-4 items-center absolute bottom-0 left-1/2 -translate-x-1/2 ">
        <div>
          Made with ❤️ by
          <Link href="https://linktr.ee/vinay_tambey" target="_blank" className="inline border-b-2 border-gray-200"> Vinay Tambey </Link>
        </div>

        <Link href="https://vinay-tambey-portfolio.vercel.app/" target="_blank">
          <Button variant="secondary">Explore Vinay's Portfolio</Button>
        </Link>

        <p>© 2026 <Link href={'/'}>AnonyMsg</Link>. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default page