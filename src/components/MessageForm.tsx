"use client";
import { useForm } from "react-hook-form";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type Props = {
  listingId: string;
  sellerEmail: string;
};

export default function MessageForm({ listingId, sellerEmail }: Props) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting, isValid }, 
  } = useForm<{ buyer_email: string; message: string }>({
    mode: "onChange",
  });


  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const watchedEmail = watch("buyer_email");
  const watchedMessage = watch("message");


  const isEmailInvalid = watchedEmail ? !emailRegex.test(watchedEmail) : true;

  const isMessageInvalid = !watchedMessage || watchedMessage.trim().length < 10;


  const isButtonDisabled =
    isSubmitting ||
    isEmailInvalid ||
    isMessageInvalid ||
    !isValid;

  const onSubmit = async (data: { buyer_email: string; message: string }) => {
    const { error } = await supabase.from("messages").insert([
      {
        listing_id: listingId,
        seller_email: sellerEmail,
        buyer_email: data.buyer_email,
        message: data.message,
      },
    ]);
    if (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message. Please try again.");
    } else {
      toast.success("Message sent successfully!");
      
      // Trigger email notification
      fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          listing_id: listingId,
          seller_email: sellerEmail,
          buyer_email: data.buyer_email,
          message: data.message,
        }),
      }).catch(error => {
        // Log error, but don't bother the user since the primary action (sending message) succeeded.
        console.error('Failed to trigger email notification:', error);
      });

      reset();
      router.back();
    }
  };

  const handleGoBack = () => {
  router.back();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 p-4 bg-white shadow rounded-lg">
      
      <div>
        <input
          {...register("buyer_email", {
            required: "Email is required",
            pattern: {
              value: emailRegex,
              message: "Please enter a valid email address",
            },
          })}
          type="email"
          placeholder="Your Email"
          className={`input ${errors.buyer_email ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-blue-500"} w-full p-2 rounded-md`}
        />
        {errors.buyer_email && (
          <p className="text-red-500 text-sm mt-1">{errors.buyer_email.message}</p>
        )}
      </div>

      <div>
        <textarea
          {...register("message", {
            required: "Message is required",
            minLength: {
              value: 10,
              message: "Message must be at least 10 characters long",
            },
          })}
          placeholder="Your message to the seller..."
          rows={5}
          className={`input ${errors.message ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-blue-500"} w-full p-2 rounded-md resize-y`}
        />
        {errors.message && (
          <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
        )}
      </div>


       <div className="flex flex-col sm:flex-row gap-2">
        <button
          type="button"
          onClick={handleGoBack}
          className="flex-1 py-2 px-4 rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 font-semibold transition-colors duration-200"
        >
          Back
        </button>
        <button
          type="submit"
          className={`flex-1 py-2 px-4 rounded-md text-white font-semibold transition-colors duration-200 ${
            isButtonDisabled
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
          disabled={isButtonDisabled}
        >
          {isSubmitting ? "Sending message..." : "Send Message"}
        </button>
        </div>
    </form>
  );
}