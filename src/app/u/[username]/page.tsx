"use client"

import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { msgSchema } from '@/schemas/msgSchema';
import ApiResponse from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { useCompletion } from '@ai-sdk/react';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { getErrorMessage } from '@/helpers/error';
import { Skeleton } from "@/components/ui/skeleton"

const parseJsonErrorMessage = (error: Error | any): string => {
  return getErrorMessage(JSON.parse(error.message));
}

const specialChar = "||"; // character used as as dividor between messages in AI's reponse

const initialSuggestions: string = "What's your favorite movie?||Do you have any pets?||What's your dream job?";

function Page() {
  const { username } = useParams<{ username: string }>();
  const router = useRouter();
  const [isSending, setIsSending] = useState<boolean>(false);

  const [isTokenLimitError, setIsTokenLimitError] = useState<boolean>(false);
  const { complete, completion, isLoading: isSuggestionsLoading, stop, error } = useCompletion({
    api: '/api/suggest-messages/',
    streamProtocol: "text",
    onFinish: (prompt, completion) => {
      if (!completion.trim()) {
        toast.dismiss();
        toast.error("An Error Occurred", {description: "Suggestion failed due to token limit. Please try again.", dismissible: true});
        setIsTokenLimitError(true);
      }
    },
    onError: (error) => {
      toast.dismiss();
      toast.error("An Error Occurred", { description: parseJsonErrorMessage(error), dismissible: true });
    },
    initialCompletion: initialSuggestions
  });
  const [wasStopped, setWasStopped] = useState<boolean>(false); // Only by User

  const { watch, setValue, handleSubmit, control, reset } = useForm<z.infer<typeof msgSchema>>({
    resolver: zodResolver(msgSchema),
    defaultValues: { content: "" }
  });

  const msgContent = watch("content");

  const sendMessage = async (data: z.infer<typeof msgSchema>) => {
    setIsSending(true);

    try {
      await axios.post<ApiResponse>("/api/send-message/", { username, content: data.content });
      toast.success("Message Sent!", { dismissible: true });
      reset({ content: '' });
    }
    catch (err) {
      console.error("Error in Sending Message: ", err);
      const axiosError = err as AxiosError<ApiResponse>;
      toast.error("Error", { description: axiosError.response?.data.message || "Failed to send message. Please try again later!", dismissible: true });

      if (axiosError.response?.data.message.includes("Not Authenticated")) router.replace("/sign-in");0
    }
    finally {
      setIsSending(false);
    }
  }

  const fetchMsgSuggestions = async () => {
    setWasStopped(false);

    try {
      await complete('');
    }
    catch (error) {
      console.error('Error fetching messages:', error);
      toast.error("Error", { description: "Message Suggestions Failed due to technical issues. Please try again later!", dismissible: true });
    }
  }

  const handleStopSuggestions = () => {
    setWasStopped(true);
    stop();
  };

  const renderSuggestions = () => {
    const suggestions = isTokenLimitError ? initialSuggestions.split(specialChar) : completion.split(specialChar);

    // If Error while Streaming Tokens
    if (error && !isSuggestionsLoading) {
      return <p className="text-red-500"> {parseJsonErrorMessage(error)} </p>
    }

    // If User has Requested to Give Message Suggestions, but Streaming Token (Msgs) hasn't Started
    if (isSuggestionsLoading && !completion ) {
      return (
        <>
          <Skeleton className="h-11 w-full rounded-md" />
          <Skeleton className="h-11 w-full rounded-md" />
          <Skeleton className="h-11 w-full rounded-md" />
        </>
      );
    }

    // If User has Stopped the Suggestion Process by itself. 
    if (wasStopped) {
      return <>
        <p> Message Suggestions Stopped </p>

        {initialSuggestions.split(specialChar).map((msg, idx) => (
          <Button key={idx} variant="outline" className="!text-wrap py-3 h-auto min-h-9" onClick={() => setValue("content", msg)} >
            {msg}
          </Button>
        ))}
      </>
    }

    // If Streaming of Message Suggestions has started
    return (<>
      {suggestions.map((msg, idx) => (
        <Button key={idx} variant="outline" className="!text-wrap py-3 h-auto min-h-9" onClick={() => setValue("content", msg)} >
          {msg}
        </Button>
      ))}
    </>);
};

  useEffect(() => {
    if (!error) {
      return;
    }

    const errMsg = parseJsonErrorMessage(error);
    if (errMsg === "Not Authenticated. Please Login!") {
      router.replace("/sign-in");
    }
  }, [error, router]);

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
          <Button type="submit" disabled={isSending || !msgContent} aria-disabled={isSending || !msgContent} >
            {isSending ?
              <> <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending... </> :
              "Send It"
            }
          </Button>
        </div>
      </form>

      <div className="space-y-4 my-8">

        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2">
            <Button onClick={fetchMsgSuggestions} className="my-4" disabled={isSuggestionsLoading} aria-disabled={isSuggestionsLoading} >
              { isSuggestionsLoading ? 
                <> <Loader2 className="h-4 w-4 animate-spin"/>  Generating... </>  : 
                <> <Sparkles className="h-4 w-4" /> Get Suggestions with AI </> 
              }
            </Button>

            <Button type="button" disabled={!isSuggestionsLoading} aria-disabled={!isSuggestionsLoading} onClick={handleStopSuggestions}>
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
            {renderSuggestions()}
          </CardContent>
        </Card>

      </div>

      <Separator className="my-6" />
    </div>
  )
}

export default Page