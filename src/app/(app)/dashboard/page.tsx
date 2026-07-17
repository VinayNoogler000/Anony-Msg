"use client"
import MsgCard from '@/components/MsgCard';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Message } from '@/model/User'
import { AcceptMsgSchema } from '@/schemas/acceptMsgSchema';
import ApiResponse from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { Axios, AxiosError } from 'axios';
import { Loader2, RefreshCcw } from 'lucide-react';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

function page() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false); // when sending or receiving messages
  const [isSwitchLoading, setIsSwitchLoading] = useState<boolean>(false);

  const handleDeleteMsg = (msgId:string) => {
    setMessages(() => messages.filter((msg) => msg._id.toString() !== msgId));
  }

  const {data:session} = useSession();

  const form = useForm<z.infer<typeof AcceptMsgSchema>>({
    resolver: zodResolver(AcceptMsgSchema),
    defaultValues: { acceptMessage: false }
  })

  const { register, watch, setValue } = form;

  let acceptMessages = watch("acceptMessage");

  const fetchAcceptMsgStatus = useCallback(async () => {
    setIsSwitchLoading(true);

    try {
      const response = await axios.get<ApiResponse>("/api/accept-messages");
      setValue("acceptMessage", response.data.isAcceptingMessages as boolean);
      toast.success("Successfully Fetched Message Acceptance Status", {dismissible: true})
    }
    catch(err) {
      const axiosError = err as AxiosError<ApiResponse>;
      toast.error("Error", {description: axiosError.response?.data.message || "Failed to fetch message settings", dismissible: true})
    }
    finally {
      setIsSwitchLoading(false);
    }
  }, [setValue])

  const fetchMessages = useCallback(async (refresh: boolean = false) => {
    setIsSwitchLoading(true);
    setIsLoading(true);

    try {
      const response = await axios.get<ApiResponse>("/api/get-messages");
      setMessages(response.data.messages || []);
      toast.success("Refreshed Messages", {description: "Showing latest messages", dismissible: true})
    } 
    catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error("Error", {description: axiosError.response?.data.message || "Failed to fetch messages", dismissible: true})
    }
    finally {
      setIsSwitchLoading(false);
      setIsLoading(false);
    }
  }, [setIsLoading, setMessages]);

  useEffect(() => {
    if (!session || !session.user) return;
    fetchMessages();
    fetchAcceptMsgStatus();
  }, [session, setValue, fetchAcceptMsgStatus, fetchMessages]);

  const handleSwitchChange = async () => {
    setIsSwitchLoading(true);

    try {
      const response = await axios.post<ApiResponse>("/api/accept-messages", { isAcceptingMsg: !acceptMessages });
      setValue("acceptMessage", !acceptMessages);
      toast.success("Success", {description: response.data.message, dismissible: true});
    }
    catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error("Error", {description: axiosError.response?.data.message || "Failed to update message acceptance status", dismissible: true});
    }
    finally {
      setIsSwitchLoading(false);
    }
  }

  const {username} = session?.user as User;
  const baseUrl = window.location.origin;
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(profileUrl);
    toast.info("URL Copied", {description: "Profile URL has been Copied to Clipboard", dismissible: true});
  }, []);
  

  if (!session || !session.user) {
    return <div> Please Login </div>
  }

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      <div className="mb-4">
        <Switch
          {...register("acceptMessage")}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span className="ml-2">
          Accept Messages: {acceptMessages ? 'On' : 'Off'}
        </span>
      </div>
      <Separator />

      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <MsgCard
              key={message._id.toString()}
              message={message}
              onMessageDelete={handleDeleteMsg}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
  );
}

export default page